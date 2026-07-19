import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, FlatList, Alert, RefreshControl } from 'react-native';
import apiClient from '../api/client';

export default function CafeDashboardScreen() {
  const [unverifiedWorkers, setUnverifiedWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchUnverifiedWorkers = useCallback(async () => {
    try {
      const response = await apiClient.get('/cafes/workers/unverified');
      if (response.data) {
        setUnverifiedWorkers(response.data);
      }
    } catch (error) {    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUnverifiedWorkers();
  }, [fetchUnverifiedWorkers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUnverifiedWorkers();
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await apiClient.get(`/cafes/workers/search?query=${searchQuery}`);
      setSearchResults(response.data || []);
    } catch (error) {      Alert.alert('Error', 'Failed to search for workers');
    } finally {
      setIsSearching(false);
    }
  };

  const verifyWorker = async (workerId: string) => {
    try {
      const response = await apiClient.post(`/cafes/workers/verify/${workerId}`);
      if (response.data) {
        Alert.alert('Success', 'Worker verified successfully!');
        fetchUnverifiedWorkers();
        setSearchResults([]);
        setSearchQuery('');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Verification failed');
    }
  };

  const renderWorker = ({ item }: any) => (
    <View style={styles.workerItem}>
      <View style={styles.workerInfo}>
        <Text style={styles.workerName}>{item.name}</Text>
        <Text style={styles.workerSkill}>{item.jobTitle || 'Worker'}</Text>
      </View>
      <TouchableOpacity
        style={styles.verifyBtn}
        onPress={() => verifyWorker(item._id)}
      >
        <Text style={styles.verifyBtnText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Cafe Dashboard</Text>
        <Text style={styles.subtitle}>On-site worker verification</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verify New Worker</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by worker ID or Name"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            {isSearching ? <ActivityIndicator color="#fff" /> : <Text style={styles.searchBtnText}>Search</Text>}
          </TouchableOpacity>
        </View>

        {searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.subSectionTitle}>Search Results</Text>
            {searchResults.map((worker: any) => (
              <View key={worker._id} style={styles.workerItem}>
                <View style={styles.workerInfo}>
                  <Text style={styles.workerName}>{worker.name}</Text>
                  <Text style={styles.workerSkill}>{worker.jobTitle}</Text>
                </View>
                <TouchableOpacity style={styles.verifyBtn} onPress={() => verifyWorker(worker._id)}>
                  <Text style={styles.verifyBtnText}>Verify</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pending Verifications</Text>
        {unverifiedWorkers.length === 0 ? (
          <Text style={styles.emptyText}>No workers waiting for verification.</Text>
        ) : (
          unverifiedWorkers.map((worker: any) => (
            <View key={worker._id} style={styles.workerItem}>
              <View style={styles.workerInfo}>
                <Text style={styles.workerName}>{worker.name}</Text>
                <Text style={styles.workerSkill}>{worker.jobTitle}</Text>
              </View>
              <TouchableOpacity style={styles.verifyBtn} onPress={() => verifyWorker(worker._id)}>
                <Text style={styles.verifyBtnText}>Verify</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
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
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginBottom: 16 },
  subSectionTitle: { fontSize: 14, fontWeight: '600', color: '#6b7280', marginBottom: 8 },
  searchContainer: { flexDirection: 'row', marginBottom: 16 },
  searchInput: { flex: 1, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, marginRight: 8 },
  searchBtn: { backgroundColor: '#059669', paddingHorizontal: 20, borderRadius: 8, justifyContent: 'center' },
  searchBtnText: { color: '#ffffff', fontWeight: 'bold' },
  resultsContainer: { backgroundColor: '#f0fdf4', padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#bbf7d0' },
  workerItem: { flexDirection: 'row', backgroundColor: '#ffffff', padding: 16, borderRadius: 8, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  workerInfo: { flex: 1 },
  workerName: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  workerSkill: { fontSize: 14, color: '#6b7280' },
  verifyBtn: { backgroundColor: '#059669', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  verifyBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  emptyText: { textAlign: 'center', color: '#6b7280', marginTop: 10 },
});
