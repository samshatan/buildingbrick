import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, FlatList, RefreshControl } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import apiClient from '../api/client';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';

export default function WorkersScreen({ navigation, route }: any) {
  const categoryId = route.params?.categoryId;
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchWorkers = useCallback(async () => {
    try {
      const response = await apiClient.get('/workers');
      if (response.data) {
        const workerData = response.data.data || response.data.workers || response.data;
        const workersArray = Array.isArray(workerData) ? workerData : [];
        setWorkers(workersArray);

        // Filter by category if coming from home
        if (categoryId) {
          const categoryFiltered = workersArray.filter((w: any) =>
            w.categoryId === categoryId || w.category === categoryId
          );
          setFilteredWorkers(categoryFiltered);
        } else {
          setFilteredWorkers(workersArray);
        }
      }
    } catch (error) {
      console.log('Error fetching workers', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  useEffect(() => {
    let result = workers;
    if (categoryId) {
      result = result.filter((w: any) => w.categoryId === categoryId || w.category === categoryId);
    }
    if (searchQuery.trim() !== '') {
      result = result.filter((w: any) =>
        w.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.workerType?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredWorkers(result);
  }, [searchQuery, workers, categoryId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkers();
  };

  const renderWorker = ({ item, index }: any) => (
    <Animated.View entering={FadeInUp.delay(index * 50).duration(400)}>
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('WorkerDetails', { worker: item })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatarPlaceholder} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name || item.displayName || 'Worker Name'}</Text>
            <Text style={styles.role}>{item.jobTitle || item.workerType || 'Skilled Professional'}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.verified ? '✓' : '?'}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Rate</Text>
            <Text style={styles.price}>${item.pricePerHour || item.dailyRate || '25'}/hr</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Rating</Text>
            <Text style={styles.rating}>⭐ {item.rating || '4.5'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Exp</Text>
            <Text style={styles.exp}>{item.experienceYears || '5'}y</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expert Marketplace</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or skill..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
        </View>
      ) : (
        <FlatList
          data={filteredWorkers}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderWorker}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.secondary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? `No results for "${searchQuery}"` : "No workers available in this category."}
              </Text>
              <TouchableOpacity style={styles.resetBtn} onPress={() => {setSearchQuery(''); navigation.setParams({categoryId: null})}}>
                <Text style={styles.resetBtnText}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    paddingTop: SPACING.xl,
    ...SHADOWS.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  searchContainer: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    height: 48,
    fontSize: 16,
    color: COLORS.text,
  },
  listContainer: {
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.border,
    marginRight: SPACING.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  role: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  badge: {
    backgroundColor: COLORS.background,
    padding: SPACING.xs,
    borderRadius: RADIUS.sm,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.accent,
  },
  rating: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.warning,
  },
  exp: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  resetBtn: {
    padding: SPACING.sm,
  },
  resetBtnText: {
    color: COLORS.secondary,
    fontWeight: '700',
  },
});
