import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Image, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [userName, setUserName] = useState('User');
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const services = [
    { title: "Masonry", icon: "🧱", color: COLORS.surface },
    { title: "Remodeling", icon: "🏠", color: COLORS.surface },
    { title: "Estimates", icon: "💎", color: COLORS.surface }
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
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      {/* Hero Section with Background Image */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80' }}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay} />

        <Animated.View entering={FadeIn.duration(800)} style={styles.heroContent}>
          <Text style={styles.heroTitle}>Build your dream{"\n"}brick home.</Text>
          <Text style={styles.heroSubtitle}>Riverside Estate Phase 2</Text>
        </Animated.View>

        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* 3D Studio Promo Card */}
      <View style={styles.promoWrapper}>
        <Animated.View
          entering={FadeIn.delay(200).duration(800)}
          style={styles.promoCard}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✨ NEW FEATURE</Text>
          </View>
          <Text style={styles.promoTitle}>Visualize with 3D Studio</Text>
          <Text style={styles.promoDesc}>
            Design a custom brick facade in real-time. Change colors, styles, and trim instantly.
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('Studio')}
          >
            <Text style={styles.ctaText}>OPEN 3D STUDIO</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Services Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Services</Text>
        <View style={styles.servicesGrid}>
          {services.map((service, i) => (
            <Animated.View
              key={service.title}
              entering={FadeInDown.delay(300 + (i * 100))}
              style={styles.serviceCard}
            >
              <View style={styles.serviceIconCircle}>
                <Text style={styles.serviceIcon}>{service.icon}</Text>
              </View>
              <Text style={styles.serviceLabel}>{service.title}</Text>
            </Animated.View>
          ))}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.serviceCardMore}>
            <Text style={styles.serviceMoreText}>SEE ALL +</Text>
          </Animated.View>
        </View>
      </View>

      {/* Expert Marketplace Preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Experts</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Workers')}>
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : workers.length > 0 ? (
          workers.map((worker: any, index: number) => (
            <Animated.View key={worker._id || index} entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity
                style={styles.workerCard}
                onPress={() => navigation.navigate('WorkerDetails', { worker })}
              >
                <View style={styles.workerAvatar} />
                <View style={styles.workerMainInfo}>
                  <Text style={styles.workerName}>{worker.name || worker.displayName || 'Worker'}</Text>
                  <Text style={styles.workerRole}>{worker.jobTitle || worker.workerType || 'Professional'}</Text>
                </View>
                <View style={styles.workerMeta}>
                  <Text style={styles.ratingText}>⭐ {worker.rating || '4.5'}</Text>
                  <Text style={styles.priceText}>${worker.pricePerHour || worker.dailyRate || '25'}/hr</Text>
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
  contentContainer: {
    paddingBottom: 100,
  },
  heroContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.zinc900,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroContent: {
    position: 'absolute',
    bottom: SPACING.xl,
    left: SPACING.lg,
    right: SPACING.lg,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF',
    lineHeight: 38,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#EEE',
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  notificationBtn: {
    position: 'absolute',
    top: SPACING.xl * 1.5,
    right: SPACING.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  notificationIcon: {
    fontSize: 20,
  },
  promoWrapper: {
    paddingHorizontal: SPACING.lg,
    marginTop: -SPACING.lg,
  },
  promoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badge: {
    backgroundColor: '#F5F2ED',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  promoDesc: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  ctaBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.full,
    ...SHADOWS.lg,
  },
  ctaText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  ctaArrow: {
    color: '#FFF',
    fontSize: 20,
  },
  section: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
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
  viewAllLink: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  serviceCard: {
    width: (width - (SPACING.lg * 2) - SPACING.md) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  serviceCardMore: {
    width: (width - (SPACING.lg * 2) - SPACING.md) / 2,
    backgroundColor: '#F5F2ED',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  serviceIconCircle: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  serviceIcon: {
    fontSize: 24,
  },
  serviceLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  serviceMoreText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  workerCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  workerAvatar: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.border,
    marginRight: SPACING.md,
  },
  workerMainInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  workerRole: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  workerMeta: {
    alignItems: 'flex-end',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.warning,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: SPACING.xl,
  },
});
