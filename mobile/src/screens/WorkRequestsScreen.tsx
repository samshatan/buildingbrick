import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import apiClient from '../api/client';

export default function WorkRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // Assuming a backend endpoint like /worker/requests or /jobs/requests
      const response = await apiClient.get('/requests');
      if (response.data) {
        setRequests(response.data.data || response.data);
      }
    } catch (error) {
      console.log('Error fetching requests', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'accept' | 'decline') => {
    try {
      // Optimistic UI update or show loading state
      Alert.alert('Action processing', `You chose to ${action} this request.`);
      // await apiClient.post(`/requests/${id}/${action}`);
      // fetchRequests();
    } catch (error) {
      console.log('Error updating request status', error);
    }
  };

  const renderRequestCard = ({ item, index }: any) => {
    const title = item.title || item.description || `New Request #${index + 1}`;
    const date = item.date || 'Pending Date';
    const location = item.address || item.location || 'Client Location';
    const clientName = item.client?.name || item.clientName || 'Anonymous Client';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <Text style={styles.clientName}>From: {clientName}</Text>
          </View>
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>📅 Date: {date}</Text>
          <Text style={styles.detailText}>📍 Location: {location}</Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.btn, styles.declineBtn]}
            onPress={() => handleAction(item._id || index, 'decline')}
          >
            <Text style={styles.declineBtnText}>Decline</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.btn, styles.acceptBtn]}
            onPress={() => handleAction(item._id || index, 'accept')}
          >
            <Text style={styles.acceptBtnText}>Accept Job</Text>
          </TouchableOpacity>
        </View>
      </View>
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
        data={requests.length > 0 ? requests : [1, 2]} // Dummy array if empty
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderRequestCard}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You have no new work requests right now.</Text>
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
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6', // blue border for new requests
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    maxWidth: '85%',
  },
  clientName: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  newBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: '#2563eb',
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailsContainer: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineBtn: {
    backgroundColor: '#fee2e2', // red-100
    marginRight: 8,
  },
  declineBtnText: {
    color: '#dc2626', // red-600
    fontWeight: 'bold',
    fontSize: 15,
  },
  acceptBtn: {
    backgroundColor: '#059669', // green-600
    marginLeft: 8,
  },
  acceptBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
