import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image, Alert } from 'react-native';
import tw from 'twrnc';
import { Cuboid, ArrowRight, Camera, Fingerprint } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as LocalAuthentication from 'expo-local-authentication';
import apiClient from '../api/client';
import { useTheme } from '../context/ThemeProvider';

WebBrowser.maybeCompleteAuthSession();

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
});

export default function AuthScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'hirer' | 'worker'>('hirer');
  const [workerRole, setWorkerRole] = useState<'LABOUR' | 'CONTRACTOR' | 'SELLER' | 'NONE'>('NONE');
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [workerTypes, setWorkerTypes] = useState<string[]>([]);
  
  const WORKER_CATEGORIES = [
    "Contractor", "Bricklayer", "Painter", "Helper", "Carpenter",
    "House Helps", "Cooks", "Maids", 
    "Electrician", "Plumber", "Welder"
  ];
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasBiometricToken, setHasBiometricToken] = useState(false);

  useEffect(() => {
    const checkBiometrics = async () => {
      const token = await AsyncStorage.getItem('biometricToken');
      if (token) {
        setHasBiometricToken(true);
      }
    };
    checkBiometrics();
  }, []);

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const { accessToken } = await GoogleSignin.getTokens();
      
      const res = await apiClient.post('/auth/google', { token: accessToken });
      if (res.data?.token) {
        await AsyncStorage.setItem('userToken', res.data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.data?.user || res.data.user || {}));
        navigation.replace('Home');
      }
    } catch (err: any) {
      console.log('Google Auth error', err);
      setError(err.response?.data?.message || err.message || 'Google authentication failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const toggleWorkerType = (type: string) => {
    if (workerTypes.includes(type)) {
      setWorkerTypes(workerTypes.filter(t => t !== type));
    } else {
      setWorkerTypes([...workerTypes, type]);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to log in to BrickOurHouse",
      });
      if (result.success) {
        const token = await AsyncStorage.getItem('biometricToken');
        if (token) {
          setLoading(true);
          await AsyncStorage.setItem('userToken', token);
          try {
            const userRes = await apiClient.get('/auth/me', {
              headers: { Authorization: `Bearer ${token}` }
            });
            await AsyncStorage.setItem('userInfo', JSON.stringify(userRes.data));
            navigation.replace('Home');
          } catch(e) {
            setError('Session expired. Please log in with password.');
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('biometricToken');
            setHasBiometricToken(false);
          } finally {
            setLoading(false);
          }
        }
      }
    } catch(e) {
      console.log('Biometric error', e);
    }
  };

  const handleSubmit = async () => {
    setError('');
    
    if (!identifier || !password) {
      setError('Mobile number (or email) and password are required.');
      return;
    }

    if (!isLogin && !fullName) {
      setError('Full name is required for sign up.');
      return;
    }

    if (!isLogin && role === 'worker') {
      if (!profileImage) {
        setError('Profile photo is mandatory for workers.');
        return;
      }
      if (workerTypes.length === 0) {
        setError('Please select at least one worker type.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await apiClient.post('/auth/login', { identifier, password });
        if (res.data?.token) {
          await AsyncStorage.setItem('userToken', res.data.token);
          await AsyncStorage.setItem('userInfo', JSON.stringify(res.data.data?.user || res.data.user || {}));
          navigation.replace('Home');
        }
      } else {
        const res = await apiClient.post('/auth/send-otp', { 
          identifier: identifier,
          type: 'signup'
        });
        
        navigation.navigate('Verification', {
          identifier: identifier,
          password,
          name: fullName,
          accountType: role,
          workerRole: workerRole,
          photoUri: profileImage,
          category: workerTypes.join(', ')
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
      style={tw`flex-1 bg-[${theme.bg}]`}
    >
      <TouchableOpacity
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
        style={tw`absolute top-14 right-6 w-10 h-10 bg-[${theme.card}] rounded-full items-center justify-center z-10 border border-[${theme.border}]`}
      >
        <Text style={tw`text-[${theme.textSecondary}] font-bold text-lg`}>✕</Text>
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={tw`flex-grow justify-center px-8 py-12`}>
        <View style={tw`mb-10 items-center`}>
          <View style={tw`w-16 h-16 bg-[#cc4518] rounded-[20px] items-center justify-center mb-6 shadow-md`}>
            <Cuboid size={32} color="white" />
          </View>
          <Text style={tw`text-4xl font-bold text-[${theme.text}] mb-2 tracking-tight`}>BrickOurHouse</Text>
          <Text style={tw`text-[${theme.textSecondary}] text-sm font-medium`}>Build your vision, block by block.</Text>
        </View>

        <View style={tw`flex flex-col gap-4`}>
          {error ? (
            <View style={tw`bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl items-center`}>
              <Text style={tw`text-red-400 text-xs font-bold`}>{error}</Text>
            </View>
          ) : null}

          {isLogin && hasBiometricToken && (
            <TouchableOpacity
              onPress={handleBiometricLogin}
              style={tw`w-full py-3.5 bg-[${theme.card}] border border-[#cc4518] rounded-xl flex-row items-center justify-center gap-3 mb-2`}
            >
              <Fingerprint size={20} color="#cc4518" />
              <Text style={tw`text-[#cc4518] font-bold text-sm tracking-wide`}>Login with Face ID / Fingerprint</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleGoogleLogin}
            disabled={googleLoading}
            style={tw`w-full py-3.5 bg-[${theme.card}] border border-[${theme.border}] rounded-xl flex-row items-center justify-center gap-3 mb-2 ${googleLoading ? 'opacity-70' : ''}`}
          >
            {googleLoading ? (
              <ActivityIndicator color={theme.text} size="small" />
            ) : (
              <>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' }} style={tw`w-5 h-5`} />
                <Text style={tw`text-[${theme.text}] font-bold text-sm tracking-wide`}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={tw`flex-row items-center justify-between mb-2`}>
            <View style={tw`flex-1 h-[1px] bg-[${theme.border}]`} />
            <Text style={tw`text-[${theme.textSecondary}] font-bold text-xs px-4 uppercase tracking-widest`}>OR</Text>
            <View style={tw`flex-1 h-[1px] bg-[${theme.border}]`} />
          </View>

          {!isLogin && (
            <View style={tw`flex flex-col gap-1.5`}>
              <Text style={tw`text-xs font-bold text-[${theme.textSecondary}] uppercase tracking-widest ml-1`}>Full Name</Text>
              <TextInput
                placeholder="John Doe"
                placeholderTextColor={theme.textSecondary}
                value={fullName}
                onChangeText={setFullName}
                style={tw`w-full px-4 py-3.5 bg-[${theme.card}] border border-[${theme.border}] rounded-xl text-sm font-medium text-[${theme.text}]`} 
              />
            </View>
          )}
          
          <View style={tw`flex flex-col gap-1.5`}>
            <Text style={tw`text-xs font-bold text-[${theme.textSecondary}] uppercase tracking-widest ml-1`}>Mobile Number or Email</Text>
            <TextInput
              placeholder="+91234567890"
              placeholderTextColor={theme.textSecondary}
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              keyboardType="default"
              style={tw`w-full px-4 py-3.5 bg-[${theme.card}] border border-[${theme.border}] rounded-xl text-sm font-medium text-[${theme.text}]`} 
            />
          </View>

          <View style={tw`flex flex-col gap-1.5`}>
            <Text style={tw`text-xs font-bold text-[${theme.textSecondary}] uppercase tracking-widest ml-1`}>Password</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={theme.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={tw`w-full px-4 py-3.5 bg-[${theme.card}] border border-[${theme.border}] rounded-xl text-sm font-medium text-[${theme.text}]`} 
            />
          </View>

          {!isLogin && (
            <View style={tw`flex flex-col gap-1.5 mt-2`}>
              <Text style={tw`text-xs font-bold text-[${theme.textSecondary}] uppercase tracking-widest ml-1`}>I am a</Text>
              <View style={tw`flex-row flex-wrap gap-2`}>
                <TouchableOpacity
                  onPress={() => { setRole('hirer'); setWorkerRole('NONE'); }}
                  style={tw`w-[48%] py-3 px-4 rounded-xl border items-center ${role === 'hirer' ? 'bg-[#cc4518] border-[#cc4518]' : `bg-[${theme.card}] border-[${theme.border}]`}`}
                >
                  <Text style={tw`text-xs font-bold text-center ${role === 'hirer' ? 'text-white' : `text-[${theme.textSecondary}]`}`}>User / Hirer</Text>
                  <Text style={tw`text-[9px] mt-1 ${role === 'hirer' ? 'text-white' : `text-[${theme.textSecondary}]`}`}>Free</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setRole('worker'); setWorkerRole('LABOUR'); }}
                  style={tw`w-[48%] py-3 px-4 rounded-xl border items-center ${workerRole === 'LABOUR' ? 'bg-[#cc4518] border-[#cc4518]' : `bg-[${theme.card}] border-[${theme.border}]`}`}
                >
                  <Text style={tw`text-xs font-bold text-center ${workerRole === 'LABOUR' ? 'text-white' : `text-[${theme.textSecondary}]`}`}>Labour / Worker</Text>
                  <Text style={tw`text-[9px] mt-1 ${workerRole === 'LABOUR' ? 'text-white' : `text-[${theme.textSecondary}]`}`}>Rs 19 Reg. Fee</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setRole('worker'); setWorkerRole('CONTRACTOR'); }}
                  style={tw`w-[48%] py-3 px-4 rounded-xl border items-center ${workerRole === 'CONTRACTOR' ? 'bg-[#cc4518] border-[#cc4518]' : `bg-[${theme.card}] border-[${theme.border}]`}`}
                >
                  <Text style={tw`text-xs font-bold text-center ${workerRole === 'CONTRACTOR' ? 'text-white' : `text-[${theme.textSecondary}]`}`}>Main Contractor</Text>
                  <Text style={tw`text-[9px] mt-1 ${workerRole === 'CONTRACTOR' ? 'text-white' : `text-[${theme.textSecondary}]`}`}>Rs 499 Reg. Fee</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setRole('worker'); setWorkerRole('SELLER'); }}
                  style={tw`w-[48%] py-3 px-4 rounded-xl border items-center ${workerRole === 'SELLER' ? 'bg-[#cc4518] border-[#cc4518]' : `bg-[${theme.card}] border-[${theme.border}]`}`}
                >
                  <Text style={tw`text-xs font-bold text-center ${workerRole === 'SELLER' ? 'text-white' : `text-[${theme.textSecondary}]`}`}>Material Seller</Text>
                  <Text style={tw`text-[9px] mt-1 ${workerRole === 'SELLER' ? 'text-white' : `text-[${theme.textSecondary}]`}`}>Free (for now)</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {!isLogin && role === 'worker' && (
            <View style={tw`flex flex-col gap-4 mt-2`}>
              <View style={tw`flex flex-col gap-1.5`}>
                <Text style={tw`text-xs font-bold text-[${theme.textSecondary}] uppercase tracking-widest ml-1`}>Profile Photo *</Text>
                <TouchableOpacity
                  onPress={pickImage}
                  style={tw`w-full h-24 border border-dashed border-[${theme.border}] bg-[${theme.card}] rounded-xl items-center justify-center`}
                >
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={tw`w-full h-full rounded-xl`} />
                  ) : (
                    <>
                      <Camera size={24} color={theme.textSecondary} style={tw`mb-2`} />
                      <Text style={tw`text-[${theme.textSecondary}] text-xs font-medium`}>Tap to upload photo</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <View style={tw`flex flex-col gap-1.5`}>
                <Text style={tw`text-xs font-bold text-[${theme.textSecondary}] uppercase tracking-widest ml-1`}>Worker Type *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-2 pb-2`}>
                  {WORKER_CATEGORIES.map((cat, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => toggleWorkerType(cat)}
                      style={tw`px-3 py-2 rounded-lg border ${workerTypes.includes(cat) ? 'bg-[#cc4518] border-[#cc4518]' : `bg-[${theme.card}] border-[${theme.border}]`}`}
                    >
                      <Text style={tw`text-xs font-medium ${workerTypes.includes(cat) ? 'text-white' : `text-[${theme.textSecondary}]`}`}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
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
            <Text style={tw`text-xs font-bold text-[${theme.textSecondary}]`}>
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
