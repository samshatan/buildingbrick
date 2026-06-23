import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, FlatList, RefreshControl, SafeAreaView } from 'react-native';
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

        if (categoryId) {
          const categoryFiltered = workersArray.filter((w: any) =>
            w.categoryId === categoryId || w.category === categoryId || w.workerType?.toLowerCase().includes(categoryId.toLowerCase())
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
      result = result.filter((w: any) =>
        w.categoryId === categoryId || w.category === categoryId || w.workerType?.toLowerCase().includes(categoryId.toLowerCase())
      );
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
          <View style={[styles.badge, { backgroundColor: item.verified ? '#F0FDF4' : '#F5F2ED' }]}>
            <Text style={[styles.badgeText, { color: item.verified ? COLORS.success : COLORS.primary }]}>
              {item.verified ? '✓ VERIFIED' : 'PENDING'}
            </Text>
          </View>
        </View>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>DAILY RATE</Text>
            <Text style={styles.price}>${item.pricePerHour || item.dailyRate || '25'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>RATING</Text>
            <Text style={styles.rating}>⭐ {item.rating || '4.5'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>EXP</Text>
            <Text style={styles.exp}>{item.experienceYears || '5'} YRS</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expert Marketplace</Text>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
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
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredWorkers}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderWorker}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? `No results for "${searchQuery}"` : "No experts available in this category."}
              </Text>
              <TouchableOpacity style={styles.resetBtn} onPress={() => {setSearchQuery(''); navigation.setParams({categoryId: null})}}>
                <Text style={styles.resetBtnText}>CLEAR ALL FILTERS</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
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
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  searchContainer: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    height: 48,
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  listContainer: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    marginRight: SPACING.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  role: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
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
    fontSize: 9,
    color: COLORS.textLight,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  rating: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.warning,
  },
  exp: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  resetBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
  },
  resetBtnText: {
    color: COLORS.surface,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
  },
});
