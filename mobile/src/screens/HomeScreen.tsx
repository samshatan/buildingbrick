import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';

export default function HomeScreen({ navigation }: any) {
  const [userName, setUserName] = useState('User');
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    { name: 'Construction', icon: '🏗️', id: 'construction' },
    { name: 'Plumbing', icon: '🚰', id: 'utilities' },
    { name: 'Electrical', icon: '⚡', id: 'utilities' },
    { name: 'Painting', icon: '🎨', id: 'interior' },
    { name: 'Carpentry', icon: '🪚', id: 'interior' },
  ];

  const loadData = useCallback(async () => {
    try {
      const userStr = await AsyncStorage.getItem('userInfo');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.fullName || user.name || 'User');
      }

      const response = await apiClient.get('/workers');
      const workerData = response.data.data || response.data.workers || response.data;
      setWorkers(Array.isArray(workerData) ? workerData.slice(0, 5) : []);
    } catch (error) {
      console.log('Error loading home data', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.secondary} />}
    >
      <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello, {userName}!</Text>
            <Text style={styles.subtitle}>Find your project expert</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('Workers', { categoryId: cat.id })}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Workers</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Workers')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator size="small" color={COLORS.secondary} style={{ marginTop: 20 }} />
        ) : workers.length > 0 ? (
          workers.map((worker: any, index: number) => (
            <Animated.View key={worker._id || index} entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity
                style={styles.workerCard}
                onPress={() => navigation.navigate('WorkerDetails', { worker })}
              >
                <View style={styles.workerAvatar} />
                <View style={styles.workerInfo}>
                  <Text style={styles.workerName}>{worker.name || worker.displayName || 'Worker'}</Text>
                  <Text style={styles.workerJob}>{worker.jobTitle || worker.workerType || 'Professional'}</Text>
                </View>
                <View style={styles.workerMeta}>
                  <Text style={styles.workerRating}>⭐ {worker.rating || '4.5'}</Text>
                  <Text style={styles.workerPrice}>${worker.pricePerHour || worker.dailyRate || '25'}/hr</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        ) : (
          <Text style={styles.emptyText}>No workers available at the moment.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl * 2,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    ...SHADOWS.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  notificationIcon: {
    fontSize: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  section: {
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  viewAllText: {
    color: COLORS.secondary,
    fontWeight: '700',
  },
  categoriesList: {
    paddingRight: SPACING.md,
  },
  categoryCard: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.md,
    alignItems: 'center',
    minWidth: 100,
    ...SHADOWS.sm,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  workerCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  workerAvatar: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.border,
    marginRight: SPACING.md,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  workerJob: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  workerMeta: {
    alignItems: 'flex-end',
  },
  workerRating: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warning,
  },
  workerPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.accent,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: SPACING.xl,
  },
});
