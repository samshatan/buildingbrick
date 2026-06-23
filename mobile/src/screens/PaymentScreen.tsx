import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput, ScrollView } from 'react-native';
import apiClient from '../api/client';

export default function PaymentScreen({ route, navigation }: any) {
  const { amount, items } = route.params || { amount: 0, items: [] };
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePayment = async () => {
    if (!cardNumber || !expiry || !cvv) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }

    setLoading(true);
    try {
      // In a real app with Stripe, you'd use Stripe SDK to get a token
      // and send it to your backend. Here we simulate the process.
      const response = await apiClient.post('/payment/process', {
        amount,
        items,
        paymentMethod: 'card',
        cardDetails: {
          last4: cardNumber.slice(-4),
        }
      });

      if (response.data.success) {
        Alert.alert('Payment Successful', 'Your order has been placed successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
      } else {
        Alert.alert('Payment Failed', response.data.message || 'Something went wrong');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Payment Summary</Text>
        <Text style={styles.summaryAmount}>Total to pay: ${amount.toFixed(2)}</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="XXXX XXXX XXXX XXXX"
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="numeric"
          maxLength={16}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              value={expiry}
              onChangeText={setExpiry}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              secureTextEntry
              maxLength={3}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.paymentBtn, loading && styles.disabledBtn]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.paymentBtnText}>Pay Now</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.securityNote}>
        🛡️ Your payment information is encrypted and secure.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  paymentBtn: {
    backgroundColor: '#059669', // green
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  paymentBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  securityNote: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    marginTop: 20,
  },
});
