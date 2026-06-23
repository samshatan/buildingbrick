import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.paragraph}>Your privacy is important to us. It is BuildingBrick's policy to respect your privacy regarding any information we may collect from you across our application.</Text>
        <Text style={styles.heading}>Information we collect</Text>
        <Text style={styles.paragraph}>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</Text>
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
