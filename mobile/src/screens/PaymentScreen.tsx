import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { CreditCard, ShieldCheck, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeProvider';
import { payWithRazorpay } from '../api/razorpay';

export default function PaymentScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const COLORS = theme;
  const { amount, items } = route.params || { amount: 0, items: [] };
  const [loading, setLoading] = useState(false);
  const handlePayment = async () => {
    setLoading(true);
    try {
      await payWithRazorpay({
        amount,
        items,
        paymentType: 'CART_CHECKOUT',
      });

      Alert.alert('Payment Successful', 'Your order has been placed successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error: any) {
      const message = error.code === 0 || error.description === 'Payment cancelled'
        ? 'Payment cancelled.'
        : error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
      Alert.alert('Payment Failed', message);
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

        {/* Razorpay checkout */}
        <Animated.View entering={FadeInUp.delay(200).duration(500).springify()}>
          <View style={tw`bg-[${theme.card}] rounded-[32px] p-6 shadow-sm border border-[${theme.border}] mb-6`}>
            <View style={tw`flex-row items-center gap-2 mb-6`}>
              <View style={tw`w-10 h-10 rounded-full bg-orange-50 items-center justify-center`}>
                <CreditCard size={20} color={COLORS.primary} />
              </View>
              <Text style={tw`text-lg font-bold text-[${theme.text}]`}>Secure Razorpay Checkout</Text>
            </View>
            <Text style={tw`text-sm text-[${theme.textSecondary}] leading-6`}>
              You will complete payment securely in Razorpay. Your card details are never stored by this app.
            </Text>
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
