import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function WorkerDetailsScreen({ route, navigation }: any) {
  // Get worker data passed from the previous screen
  const { worker } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      {/* Header Profile Section */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder} />
        <Text style={styles.name}>{worker?.name || 'Worker Name'}</Text>
        <Text style={styles.role}>{worker?.jobTitle || worker?.role || 'Skilled Professional'}</Text>
        <Text style={styles.rating}>⭐ {worker?.rating || '4.5'} (120 reviews)</Text>
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hourly Rate</Text>
          <Text style={styles.infoValue}>${worker?.pricePerHour || '25'}/hr</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Experience</Text>
          <Text style={styles.infoValue}>{worker?.experience || '5 Years'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>{worker?.location || 'New York, NY'}</Text>
        </View>

        <Text style={styles.aboutTitle}>About Me</Text>
        <Text style={styles.aboutText}>
          {worker?.description || 
            "I am a highly skilled professional with years of experience in my field. I take pride in delivering high-quality work on time and ensuring complete customer satisfaction."}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.messageBtn}>
          <Text style={styles.messageBtnText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.hireBtn}
          onPress={() => navigation.navigate('DirectHire', { worker })}
        >
          <Text style={styles.hireBtnText}>Direct Hire</Text>
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
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#d1d5db',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  role: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '500',
    color: '#d97706',
    marginTop: 8,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  messageBtn: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  messageBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  hireBtn: {
    flex: 1,
    backgroundColor: '#2563eb', // blue-600
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  hireBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
