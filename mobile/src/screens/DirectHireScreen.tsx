import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import apiClient from '../api/client';

export default function DirectHireScreen({ route, navigation }: any) {
  const { worker } = route.params || {};

  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(''); // Simple text input for now, could use a date picker library later
  const [loading, setLoading] = useState(false);

  const handleHireRequest = async () => {
    if (!description || !address || !date) {
      Alert.alert('Missing Fields', 'Please fill in all the required information to request this worker.');
      return;
    }

    setLoading(true);
    try {
      // Assuming a backend route like /api/v1/direct-requests to create a job/hire request
      const response = await apiClient.post('/direct-requests', {
        workerId: worker?._id || worker?.id,
        description,
        address,
        date
      });

      if (response.data) {
        Alert.alert('Success!', `Your hiring request has been sent to ${worker?.name || 'the worker'}.`);
        navigation.goBack();
      }
    } catch (error: any) {
      console.log('Error creating direct hire request:', error);
      Alert.alert('Request Failed', error.response?.data?.message || 'There was an issue sending your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hire {worker?.name || 'Worker'}</Text>
        <Text style={styles.subtitle}>Provide details about the job you need done.</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Job Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe what you need help with..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Job Location (Address)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 123 Main St, City, Zip"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Preferred Date</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. YYYY-MM-DD or 'Next Monday'"
            value={date}
            onChangeText={setDate}
          />
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>
          <Text style={styles.summaryText}>Hourly Rate: ${worker?.pricePerHour || '25'}/hr</Text>
          <Text style={styles.summaryNote}>You will discuss final hours and pricing directly with the worker once they accept the request.</Text>
        </View>

        <TouchableOpacity 
          style={styles.submitBtn} 
          onPress={handleHireRequest}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Send Request</Text>
          )}
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
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  summaryBox: {
    backgroundColor: '#eff6ff', // blue-50
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe', // blue-200
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a', // blue-900
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 15,
    color: '#1e40af', // blue-800
    marginBottom: 4,
  },
  summaryNote: {
    fontSize: 13,
    color: '#3b82f6', // blue-500
    marginTop: 8,
    fontStyle: 'italic',
  },
  submitBtn: {
    backgroundColor: '#059669', // green-600
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
