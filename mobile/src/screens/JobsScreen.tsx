import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import apiClient from '../api/client';

export default function JobsScreen() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Set this to false when you want to test with actual database data or see the empty state
  const USE_MOCK_DATA = true;

  const mockJobs = [
    { _id: 'job1', title: 'Roof Installation', status: 'Pending', date: 'Oct 10, 2026', workerName: 'Charlie Builder', amount: '2500' },
    { _id: 'job2', title: 'Kitchen Remodel', status: 'Completed', date: 'Oct 01, 2026', workerName: 'Sarah Remodels', amount: '8400' },
    { _id: 'job3', title: 'Driveway Paving', status: 'Accepted', date: 'Oct 15, 2026', workerName: 'Paver Bros', amount: '1200' }
  ];

  useEffect(() => {
    if (USE_MOCK_DATA) {
      setLoading(false);
    } else {
      fetchJobs();
    }
  }, []);

  const fetchJobs = async () => {
    try {
      // Endpoint updated to /jobs based on backend routing
      const response = await apiClient.get('/jobs');
      if (response.data) {
        // Handle different response structures
        const jobData = response.data.data || response.data.jobs || response.data;
        setJobs(Array.isArray(jobData) ? jobData : []);
      }
    } catch (error) {
      console.log('Error fetching jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#d97706'; // orange
      case 'accepted': return '#2563eb'; // blue
      case 'completed': return '#059669'; // green
      case 'cancelled': return '#dc2626'; // red
      default: return '#6b7280'; // gray
    }
  };

  const renderJobCard = ({ item, index }: any) => {
    // Handling dummy data if the API is empty for preview purposes
    const jobTitle = item.title || item.description || `Job Request #${index + 1}`;
    const status = item.status || (index === 0 ? 'Pending' : 'Completed');
    const date = item.date || item.createdAt?.substring(0, 10) || '2026-06-22';
    
    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.jobTitle} numberOfLines={1}>{jobTitle}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
              {status.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.cardBody}>
          <Text style={styles.jobDetail}>Date: {date}</Text>
          <Text style={styles.jobDetail}>Worker: {item.worker?.name || item.workerName || 'Assigned Worker'}</Text>
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={styles.amount}>Total: ${item.amount || item.totalPrice || '---'}</Text>
          <Text style={styles.viewDetails}>View Details</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={USE_MOCK_DATA ? mockJobs : jobs}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderJobCard}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You don't have any jobs yet.</Text>
          </View>
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
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    marginBottom: 12,
  },
  jobDetail: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  viewDetails: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});
