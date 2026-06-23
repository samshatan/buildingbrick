import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.paragraph}>Last updated: June 2026</Text>
        <Text style={styles.heading}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>By accessing and using BuildingBrick, you accept and agree to be bound by the terms and provisions of this agreement.</Text>
        <Text style={styles.heading}>2. Use License</Text>
        <Text style={styles.paragraph}>Permission is granted to temporarily download one copy of the materials on BuildingBrick's app for personal, non-commercial transitory viewing only.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  heading: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginTop: 16, marginBottom: 8 },
  paragraph: { fontSize: 16, color: '#4b5563', lineHeight: 24 },
});
