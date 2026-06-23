import React from 'react';
import { ScrollView, Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';

export default function ContactScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.paragraph}>Have questions? We're here to help.</Text>

        <TextInput style={styles.input} placeholder="Your Name" />
        <TextInput style={styles.input} placeholder="Your Email" keyboardType="email-address" />
        <TextInput style={[styles.input, styles.textArea]} placeholder="Your Message" multiline numberOfLines={4} />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Send Message</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  paragraph: { fontSize: 16, color: '#6b7280', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
});
