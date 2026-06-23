import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function CafeDashboardScreen() {
  const [stats] = useState({
    pendingOrders: 12,
    completedOrders: 45,
    todayEarnings: 320,
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cafe Dashboard</Text>
        <Text style={styles.subtitle}>Manage your food orders & menu</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.pendingOrders}</Text>
          <Text style={styles.statLabel}>Pending Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.completedOrders}</Text>
          <Text style={styles.statLabel}>Completed Today</Text>
        </View>
        <View style={[styles.statCard, { width: '100%' }]}>
          <Text style={styles.statValue}>${stats.todayEarnings}</Text>
          <Text style={styles.statLabel}>Today's Earnings</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Cafe Management</Text>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>View Incoming Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Manage Menu Items</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Edit Cafe Profile</Text>
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
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#059669', marginBottom: 4 }, // green
  statLabel: { fontSize: 14, color: '#4b5563', textAlign: 'center' },
  actionsContainer: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginBottom: 16 },
  actionBtn: { backgroundColor: '#ffffff', padding: 16, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#d1d5db' },
  actionBtnText: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
});
