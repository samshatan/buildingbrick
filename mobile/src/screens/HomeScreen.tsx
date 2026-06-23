import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function HomeScreen({ navigation }: any) {
  // Placeholder for Categories
  const categories = ['Construction', 'Plumbing', 'Electrical', 'Painting', 'Carpentry'];

  return (
    <ScrollView style={styles.container}>
      <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello, User!</Text>
            <Text style={styles.subtitle}>Find the right worker</Text>
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
          {categories.map((cat, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard}>
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Rated Workers</Text>
        {/* Placeholder for top workers list */}
        <View style={styles.workerCard}>
          <Text style={styles.workerName}>John Doe</Text>
          <Text style={styles.workerJob}>Plumber - 4.9⭐</Text>
        </View>
        <View style={styles.workerCard}>
          <Text style={styles.workerName}>Jane Smith</Text>
          <Text style={styles.workerJob}>Electrician - 4.8⭐</Text>
        </View>
        <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('Workers')}>
          <Text style={styles.viewAllText}>View All Workers</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    backgroundColor: '#2563eb',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  notificationBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 12,
  },
  notificationIcon: {
    fontSize: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#bfdbfe',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  categoriesList: {
    flexDirection: 'row',
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  workerCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  workerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  workerJob: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  viewAllBtn: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
