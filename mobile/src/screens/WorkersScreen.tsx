import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import apiClient from '../api/client';

export default function WorkersScreen({ navigation }: any) {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWorkers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredWorkers(workers);
    } else {
      const filtered = workers.filter((w: any) =>
        w.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.role?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWorkers(filtered);
    }
  }, [searchQuery, workers]);

  const fetchWorkers = async () => {
    try {
      const response = await apiClient.get('/workers');
      if (response.data) {
        // Handle different response structures
        const workerData = response.data.data || response.data.workers || response.data;
        const workersArray = Array.isArray(workerData) ? workerData : [];
        setWorkers(workersArray);
        setFilteredWorkers(workersArray);
      }
    } catch (error) {
      console.log('Error fetching workers', error);
    } finally {
      setLoading(false);
    }
  };

  const renderWorker = ({ item, index }: any) => (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(500)}>
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('WorkerDetails', { worker: item })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatarPlaceholder} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name || 'Worker Name'}</Text>
            <Text style={styles.role}>{item.jobTitle || item.role || 'Skilled Professional'}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.price}>${item.pricePerHour || '25'}/hr</Text>
          <Text style={styles.rating}>⭐ {item.rating || '4.5'}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Workers</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or skill..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <Animated.FlatList
        data={filteredWorkers.length > 0 ? filteredWorkers : (searchQuery ? [] : [1, 2, 3, 4, 5])}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderWorker}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          searchQuery ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No workers found matching "{searchQuery}"</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e5e7eb',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  role: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669', // green
  },
  rating: {
    fontSize: 16,
    fontWeight: '500',
    color: '#d97706', // orange/gold
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
