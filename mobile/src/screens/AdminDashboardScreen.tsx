import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function AdminDashboardScreen() {
  const [stats] = useState({
    totalUsers: 1254,
    totalWorkers: 342,
    activeJobs: 89,
    revenue: 15400,
  });

  return (
    <ScrollView style={styles.container}>
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
          <Text style={styles.statLabel}>Verified Workers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.activeJobs}</Text>
          <Text style={styles.statLabel}>Active Jobs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${stats.revenue}</Text>
          <Text style={styles.statLabel}>Platform Revenue</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Manage Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Verify Workers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>View Reports</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
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
