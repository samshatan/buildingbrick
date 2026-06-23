import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image, Alert } from 'react-native';
import tw from 'twrnc';
import { Cuboid, ArrowRight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import apiClient from '../api/client';

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen({ navigation }: any) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'user' | 'worker'>('user');
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '202330709483-pkfo88k3ftoe5sdsv817dieh9mr88fel.apps.googleusercontent.com',
    iosClientId: '202330709483-pkfo88k3ftoe5sdsv817dieh9mr88fel.apps.googleusercontent.com', // typically requires specific iOS client id, but we'll try this
    androidClientId: '202330709483-pkfo88k3ftoe5sdsv817dieh9mr88fel.apps.googleusercontent.com', // typically requires specific Android client id, but we'll try this
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === 'success') {
        setGoogleLoading(true);
        const { authentication } = response;
        try {
          const res = await apiClient.post('/auth/google', { token: authentication?.accessToken });
          if (res.data?.token) {
            await AsyncStorage.setItem('userToken', res.data.token);
            await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.data?.user || res.data.user || {}));
            navigation.replace('Home');
          }
        } catch (err: any) {
          console.log('Google Auth error', err);
          setError(err.response?.data?.message || 'Google authentication failed.');
        } finally {
          setGoogleLoading(false);
        }
      } else if (response?.type === 'error' || response?.type === 'dismiss') {
        setGoogleLoading(false);
      }
    };

    handleGoogleResponse();
  }, [response]);

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    await promptAsync();
  };

  const handleSubmit = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    if (!isLogin && !fullName) {
      setError('Full name is required for sign up.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await apiClient.post('/auth/login', { email, password });
        if (res.data?.token) {
          await AsyncStorage.setItem('userToken', res.data.token);
          await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.data?.user || res.data.user || {}));
          navigation.replace('Home');
        }
      } else {
        const res = await apiClient.post('/auth/send-otp', { 
          identifier: email,
          type: 'signup'
        });
        
        // Navigate to Verification Screen instead of Home
        navigation.navigate('Verification', {
          identifier: email,
          password,
          name: fullName,
          accountType: role
        });
      }
    } catch (err: any) {
      console.log('Auth error', err);
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-zinc-950`}
    >
      <TouchableOpacity 
        onPress={() => navigation.replace('Home')}
        style={tw`absolute top-14 right-6 w-10 h-10 bg-zinc-900 rounded-full items-center justify-center z-10 border border-zinc-800`}
      >
        <Text style={tw`text-zinc-400 font-bold text-lg`}>✕</Text>
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={tw`flex-grow justify-center px-8 py-12`}>
        <View style={tw`mb-10 items-center`}>
          <View style={tw`w-16 h-16 bg-[#cc4518] rounded-[20px] items-center justify-center mb-6`}>
            <Cuboid size={32} color="white" />
          </View>
          <Text style={tw`text-4xl font-bold text-white mb-2 tracking-tight`}>BrickOurHouse</Text>
          <Text style={tw`text-zinc-400 text-sm font-medium`}>Build your vision, block by block.</Text>
        </View>

        <View style={tw`flex flex-col gap-4`}>
          {error ? (
            <View style={tw`bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl items-center`}>
              <Text style={tw`text-red-400 text-xs font-bold`}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity 
            onPress={handleGoogleLogin}
            disabled={googleLoading}
            style={tw`w-full py-3.5 bg-white rounded-xl flex-row items-center justify-center gap-3 mb-2 ${googleLoading ? 'opacity-70' : ''}`}
          >
            {googleLoading ? (
              <ActivityIndicator color="#09090b" size="small" />
            ) : (
              <>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' }} style={tw`w-5 h-5`} />
                <Text style={tw`text-zinc-900 font-bold text-sm tracking-wide`}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={tw`flex-row items-center justify-between mb-2`}>
            <View style={tw`flex-1 h-[1px] bg-zinc-800`} />
            <Text style={tw`text-zinc-600 font-bold text-xs px-4 uppercase tracking-widest`}>OR</Text>
            <View style={tw`flex-1 h-[1px] bg-zinc-800`} />
          </View>

          {!isLogin && (
            <View style={tw`flex flex-col gap-1.5`}>
              <Text style={tw`text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1`}>Full Name</Text>
              <TextInput 
                placeholder="John Doe" 
                placeholderTextColor="#52525b"
                value={fullName}
                onChangeText={setFullName}
                style={tw`w-full px-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-medium text-white`} 
              />
            </View>
          )}
          
          <View style={tw`flex flex-col gap-1.5`}>
            <Text style={tw`text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1`}>Email Address</Text>
            <TextInput 
              placeholder="you@example.com" 
              placeholderTextColor="#52525b"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={tw`w-full px-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-medium text-white`} 
            />
          </View>

          <View style={tw`flex flex-col gap-1.5`}>
            <Text style={tw`text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1`}>Password</Text>
            <TextInput 
              placeholder="••••••••" 
              placeholderTextColor="#52525b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={tw`w-full px-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-medium text-white`} 
            />
          </View>

          {!isLogin && (
            <View style={tw`flex flex-col gap-1.5 mt-2`}>
              <Text style={tw`text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1`}>I am a</Text>
              <View style={tw`flex-row gap-2`}>
                <TouchableOpacity
                  onPress={() => setRole('user')}
                  style={tw`flex-1 py-3 px-4 rounded-xl border items-center ${role === 'user' ? 'bg-[#cc4518] border-[#cc4518]' : 'bg-zinc-900 border-zinc-800'}`}
                >
                  <Text style={tw`text-xs font-bold ${role === 'user' ? 'text-white' : 'text-zinc-400'}`}>User / App</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setRole('worker')}
                  style={tw`flex-1 py-3 px-4 rounded-xl border items-center ${role === 'worker' ? 'bg-[#cc4518] border-[#cc4518]' : 'bg-zinc-900 border-zinc-800'}`}
                >
                  <Text style={tw`text-xs font-bold ${role === 'worker' ? 'text-white' : 'text-zinc-400'}`}>Worker</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity 
            onPress={handleSubmit}
            disabled={loading}
            style={tw`w-full py-4 mt-6 bg-[#cc4518] rounded-xl flex-row items-center justify-center gap-2 ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Text style={tw`text-white font-bold text-xs uppercase tracking-widest`}>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Text>
                <ArrowRight size={16} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={tw`mt-8 items-center`}>
          <TouchableOpacity 
            onPress={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            <Text style={tw`text-xs font-bold text-zinc-400`}>
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
