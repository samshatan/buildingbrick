import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>About BuildingBrick</Text>
        <Text style={styles.paragraph}>
          BuildingBrick is your premier marketplace for connecting with highly skilled construction professionals, plumbers, electricians, painters, and carpenters.
        </Text>
        <Text style={styles.paragraph}>
          Our mission is to make hiring reliable workers as seamless as possible, providing a trustworthy platform for both clients and professionals to thrive.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 },
  paragraph: { fontSize: 16, color: '#4b5563', lineHeight: 24, marginBottom: 16 },
});
