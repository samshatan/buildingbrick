import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import tw from 'twrnc';
import { ShieldCheck, ArrowRight, ChevronLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

export default function VerificationScreen({ route, navigation }: any) {
  const { name, identifier, password, accountType, photoUri, category, workerRole } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');

  const handleVerifyAndSignup = async () => {
    setError('');
    
    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('identifier', identifier);
      formData.append('otp', otp);
      formData.append('password', password);
      formData.append('accountType', accountType);
      if (workerRole) {
        formData.append('workerRole', workerRole);
      }
      
      if (accountType === 'worker' && category) {
        formData.append('category', category);
      }
      
      if (accountType === 'worker' && photoUri) {
        const uriParts = photoUri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('photo', {
          uri: photoUri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const res = await apiClient.post('/auth/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.token) {
        await AsyncStorage.setItem('userToken', res.data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.data?.user || res.data.user || {}));
        Alert.alert("Success!", "Your account has been verified and created.");
        navigation.replace('Home');
      }
    } catch (err: any) {
      console.log('Signup error', err);
      setError(err.response?.data?.message || err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setError('');
    try {
      await apiClient.post('/auth/send-otp', { identifier, type: 'signup' });
      Alert.alert("OTP Sent", `A new OTP has been sent to ${identifier}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-zinc-950`}
    >
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={tw`absolute top-14 left-6 w-10 h-10 bg-zinc-900 rounded-full items-center justify-center z-10 border border-zinc-800`}
      >
        <ChevronLeft size={20} color="#a1a1aa" />
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={tw`flex-grow justify-center px-8 py-12`}>
        <View style={tw`mb-10 items-center`}>
          <View style={tw`w-16 h-16 bg-[#cc4518]/20 border border-[#cc4518]/50 rounded-[20px] items-center justify-center mb-6`}>
            <ShieldCheck size={32} color="#cc4518" />
          </View>
          <Text style={tw`text-3xl font-bold text-white mb-2 tracking-tight text-center`}>Verify Account</Text>
          <Text style={tw`text-zinc-400 text-sm font-medium text-center px-4`}>
            We sent a 6-digit verification code to <Text style={tw`text-white font-bold`}>{identifier}</Text>
          </Text>
        </View>

        <View style={tw`flex flex-col gap-4`}>
          {error ? (
            <View style={tw`bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl items-center`}>
              <Text style={tw`text-red-400 text-xs font-bold`}>{error}</Text>
            </View>
          ) : null}

          <View style={tw`flex flex-col gap-1.5`}>
            <Text style={tw`text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 text-center`}>Enter 6-Digit OTP</Text>
            <TextInput 
              placeholder="000000" 
              placeholderTextColor="#52525b"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              style={tw`w-full px-4 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-2xl tracking-[10px] font-bold text-white text-center`} 
            />
          </View>

          <TouchableOpacity 
            onPress={handleVerifyAndSignup}
            disabled={loading}
            style={tw`w-full py-4 mt-4 bg-[#cc4518] rounded-xl flex-row items-center justify-center gap-2 ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Text style={tw`text-white font-bold text-xs uppercase tracking-widest`}>Verify & Create Account</Text>
                <ArrowRight size={16} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={tw`mt-8 items-center flex-row justify-center gap-2`}>
          <Text style={tw`text-xs font-medium text-zinc-500`}>Didn't receive the code?</Text>
          <TouchableOpacity onPress={handleResendOtp} disabled={resending}>
            {resending ? (
              <ActivityIndicator size="small" color="#cc4518" />
            ) : (
              <Text style={tw`text-xs font-bold text-[#cc4518]`}>Resend OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
