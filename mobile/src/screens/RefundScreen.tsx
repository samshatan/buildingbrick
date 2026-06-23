import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

export default function RefundScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Refund Policy</Text>
        <Text style={styles.paragraph}>We want you to be completely satisfied with the services provided through BuildingBrick.</Text>
        <Text style={styles.heading}>Cancellations</Text>
        <Text style={styles.paragraph}>If you cancel a booking 24 hours before the scheduled time, you will receive a full refund. Cancellations made within 24 hours may be subject to a fee.</Text>
        <Text style={styles.heading}>Disputes</Text>
        <Text style={styles.paragraph}>If the work provided was unsatisfactory, please contact our support team within 48 hours of job completion to initiate a dispute resolution process.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 },
  heading: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginTop: 16, marginBottom: 8 },
  paragraph: { fontSize: 16, color: '#4b5563', lineHeight: 24 },
});
