import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, TextInput, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { CreditCard, Lock, ShieldCheck, ChevronRight } from 'lucide-react-native';
import apiClient from '../api/client';
import { useTheme } from '../context/ThemeProvider';

export default function PaymentScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const COLORS = theme;
  const { amount, items } = route.params || { amount: 0, items: [] };
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePayment = async () => {
    if (!cardNumber || !expiry || !cvv) {
      Alert.alert('Incomplete', 'Please fill in all card details');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/payment/process', {
        amount,
        items,
        paymentMethod: 'card',
        cardDetails: {
          last4: cardNumber.slice(-4),
        }
      });

      if (response.data.success || response.data) {
        Alert.alert('Payment Successful', 'Your order has been placed successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
      } else {
        Alert.alert('Payment Failed', response.data.message || 'Something went wrong');
      }
    } catch (error: any) {
      Alert.alert('Payment Failed', error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[${theme.bg}]`}>
      <ScrollView contentContainerStyle={tw`p-6`} showsVerticalScrollIndicator={false}>
        
        {/* Header Summary */}
        <Animated.View entering={FadeInDown.duration(400)} style={tw`items-center mb-8`}>
          <Text style={tw`text-[${theme.textSecondary}] font-bold text-xs uppercase tracking-widest mb-2`}>Total to pay</Text>
          <Text style={tw`text-5xl font-extrabold text-[${COLORS.primary}]`}>
            ${amount.toFixed(2)}
          </Text>
        </Animated.View>

        {/* Card Entry Form */}
        <Animated.View entering={FadeInUp.delay(200).duration(500).springify()}>
          <View style={tw`bg-[${theme.card}] rounded-[32px] p-6 shadow-sm border border-[${theme.border}] mb-6`}>
            <View style={tw`flex-row items-center gap-2 mb-6`}>
              <View style={tw`w-10 h-10 rounded-full bg-orange-50 items-center justify-center`}>
                <CreditCard size={20} color={COLORS.primary} />
              </View>
              <Text style={tw`text-lg font-bold text-[${theme.text}]`}>Card Details</Text>
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-xs font-bold text-[${theme.textSecondary}] uppercase tracking-widest mb-2 ml-1`}>Card Number</Text>
              <View style={tw`bg-[${theme.bg}] rounded-2xl border border-[${theme.border}] flex-row items-center px-4 h-14`}>
                <TextInput
                  style={tw`flex-1 font-bold text-zinc-800 text-base`}
                  placeholder="XXXX XXXX XXXX XXXX"
                  placeholderTextColor="#a1a1aa"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                  maxLength={16}
                />
                <CreditCard size={18} color="#a1a1aa" />
              </View>
            </View>

            <View style={tw`flex-row gap-4 mb-2`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-xs font-bold text-[${theme.textSecondary}] uppercase tracking-widest mb-2 ml-1`}>Expiry</Text>
                <View style={tw`bg-[${theme.bg}] rounded-2xl border border-[${theme.border}] flex-row items-center px-4 h-14`}>
                  <TextInput
                    style={tw`flex-1 font-bold text-zinc-800 text-base`}
                    placeholder="MM/YY"
                    placeholderTextColor="#a1a1aa"
                    value={expiry}
                    onChangeText={setExpiry}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-xs font-bold text-[${theme.textSecondary}] uppercase tracking-widest mb-2 ml-1`}>CVV</Text>
                <View style={tw`bg-[${theme.bg}] rounded-2xl border border-[${theme.border}] flex-row items-center px-4 h-14`}>
                  <TextInput
                    style={tw`flex-1 font-bold text-zinc-800 text-base`}
                    placeholder="123"
                    placeholderTextColor="#a1a1aa"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={3}
                  />
                  <Lock size={16} color="#a1a1aa" />
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Action Button */}
        <Animated.View entering={FadeInUp.delay(400).duration(500).springify()}>
          <TouchableOpacity
            style={tw`bg-[${COLORS.primary}] h-16 rounded-full flex-row justify-center items-center gap-2 shadow-lg shadow-orange-900/20 ${loading ? 'opacity-70' : ''}`}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={tw`text-white font-bold text-lg`}>Pay ${amount.toFixed(2)}</Text>
                <ChevronRight size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Security Note */}
        <Animated.View entering={FadeInUp.delay(500).duration(500)} style={tw`flex-row justify-center items-center gap-2 mt-8`}>
          <ShieldCheck size={16} color="#52525b" />
          <Text style={tw`text-xs font-bold text-[${theme.textSecondary}] uppercase tracking-widest`}>
            Payments are secure and encrypted
          </Text>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}
