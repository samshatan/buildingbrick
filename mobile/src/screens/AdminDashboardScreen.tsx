import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import apiClient from '../api/client';

export default function AdminDashboardScreen({ navigation }: any) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkers: 0,
    totalCafes: 0,
    activeJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const [usersRes, workersRes, cafesRes, jobsRes] = await Promise.all([
        apiClient.get('/admin/users'),
        apiClient.get('/admin/workers'),
        apiClient.get('/admin/cafes'),
        apiClient.get('/jobs')
      ]);

      setStats({
        totalUsers: (usersRes.data.data || usersRes.data).length || 0,
        totalWorkers: (workersRes.data.data || workersRes.data).length || 0,
        totalCafes: (cafesRes.data.data || cafesRes.data).length || 0,
        activeJobs: (jobsRes.data.data || jobsRes.data).length || 0,
      });
    } catch (error) {
      console.log('Error fetching admin stats', error);
      // Alert.alert('Error', 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Overview of platform metrics</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalUsers}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalWorkers}</Text>
          <Text style={styles.statLabel}>Workers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalCafes}</Text>
          <Text style={styles.statLabel}>Partner Cafes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.activeJobs}</Text>
          <Text style={styles.statLabel}>Active Jobs</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('UsersManagement')}>
          <Text style={styles.actionBtnText}>Manage Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('WorkerVerification')}>
          <Text style={styles.actionBtnText}>Verify Workers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AnalyticalReports')}>
          <Text style={styles.actionBtnText}>View Reports</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 24, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  subtitle: { fontSize: 16, color: '#6b7280', marginTop: 4 },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: '#ffffff', padding: 20, borderRadius: 12, marginBottom: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#2563eb', marginBottom: 4 },
  statLabel: { fontSize: 14, color: '#4b5563', textAlign: 'center' },
  actionsContainer: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginBottom: 16 },
  actionBtn: { backgroundColor: '#ffffff', padding: 16, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#d1d5db' },
  actionBtnText: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
});
