import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import tw from 'twrnc';
import { Mail, ArrowRight, ChevronLeft, ShieldCheck } from 'lucide-react-native';
import apiClient from '../api/client';
import { useTheme } from '../context/ThemeProvider';

export default function ForgotPasswordScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!identifier) {
      Alert.alert('Required', 'Please enter your email or phone number.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email: identifier });
      setSent(true);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-[${theme.bg}]`}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={tw`absolute top-14 left-6 w-10 h-10 bg-[${theme.card}] rounded-full items-center justify-center z-10 border border-[${theme.border}]`}
      >
        <ChevronLeft size={20} color={theme.textSecondary} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={tw`flex-grow justify-center px-8 py-12`}>
        <View style={tw`mb-10 items-center`}>
          <View style={tw`w-16 h-16 bg-[#cc4518]/15 border border-[#cc4518]/30 rounded-[20px] items-center justify-center mb-6`}>
            <ShieldCheck size={32} color="#cc4518" />
          </View>
          <Text style={tw`text-3xl font-bold text-[${theme.text}] mb-2 tracking-tight text-center`}>
            Reset Password
          </Text>
          <Text style={tw`text-[${theme.textSecondary}] text-sm font-medium text-center px-4 leading-relaxed`}>
            Enter your email or phone number and we'll send you a reset link.
          </Text>
        </View>

        <View style={tw`flex flex-col gap-4`}>
          {sent ? (
            <View style={tw`bg-emerald-500/10 border border-emerald-500/20 px-6 py-5 rounded-2xl items-center gap-3`}>
              <Text style={tw`text-emerald-400 text-2xl`}>✓</Text>
              <Text style={tw`text-emerald-400 text-sm font-bold text-center`}>
                Reset link sent! Check your email or SMS inbox.
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={tw`mt-2 w-full py-3 bg-[#cc4518] rounded-xl items-center`}
              >
                <Text style={tw`text-white font-bold text-xs uppercase tracking-widest`}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={tw`flex flex-col gap-1.5`}>
                <Text style={tw`text-xs font-bold text-[${theme.textSecondary}] uppercase tracking-widest ml-1`}>
                  Email or Phone Number
                </Text>
                <View style={tw`flex-row items-center bg-[${theme.card}] border border-[${theme.border}] rounded-xl px-4 gap-3`}>
                  <Mail size={18} color={theme.textSecondary} />
                  <TextInput
                    placeholder="e.g. user@example.com or +91..."
                    placeholderTextColor={theme.textSecondary}
                    value={identifier}
                    onChangeText={setIdentifier}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={tw`flex-1 py-3.5 text-sm font-medium text-[${theme.text}]`}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleReset}
                disabled={loading}
                style={tw`w-full py-4 mt-2 bg-[#cc4518] rounded-xl flex-row items-center justify-center gap-2 ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Text style={tw`text-white font-bold text-xs uppercase tracking-widest`}>
                      Send Reset Link
                    </Text>
                    <ArrowRight size={16} color="white" />
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {!sent && (
          <View style={tw`mt-8 items-center`}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={tw`text-xs font-bold text-[${theme.textSecondary}]`}>
                Remember your password? Sign in
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
