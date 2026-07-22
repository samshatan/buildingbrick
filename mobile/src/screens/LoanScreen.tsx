import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft, HandCoins, Landmark } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

export default function LoanScreen({ navigation }: any) {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [bankPreference, setBankPreference] = useState('');
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userInfo');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setAccountType((parsed.accountType || parsed.userType || '').toLowerCase() || null);
        }
      } catch {
        setAccountType(null);
      }
    };

    loadUser();
  }, []);

  const handleApply = async () => {
    const cleanedAadhaar = aadhaarNumber.replace(/\s+/g, '');
    const cleanedPan = panNumber.trim().toUpperCase();

    if (cleanedAadhaar.length !== 12 || !/^\d{12}$/.test(cleanedAadhaar)) {
      Alert.alert('Required', 'Enter a valid 12-digit Aadhaar number.');
      return;
    }

    if (cleanedPan && cleanedPan.length !== 10) {
      Alert.alert('Required', 'PAN number must be 10 characters long.');
      return;
    }

    if (accountType && accountType !== 'worker') {
      Alert.alert('Workers only', 'Only workers can apply for this financial support flow.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/vbank/apply', {
        aadhaarNumber: cleanedAadhaar,
        panNumber: cleanedPan,
        bankPreference: bankPreference.trim() || 'No Preference',
      });

      Alert.alert(
        'Application Submitted',
        'Your application has been submitted for review. You will be contacted after verification.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Application Failed', error.response?.data?.message || 'Unable to submit your application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <View style={tw`px-6 pt-4 pb-4 flex-row items-center gap-4 border-b border-zinc-100 bg-white`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 bg-zinc-50 rounded-full`}>
          <ArrowLeft size={20} color="#3f3f46" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-zinc-900`}>Worker Financial Support</Text>
      </View>
      <ScrollView contentContainerStyle={tw`p-6 pb-10`}>
        <View style={tw`bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
          <HandCoins size={32} color="#9333ea" />
        </View>
        <Text style={tw`text-3xl font-bold text-zinc-800 mb-2`}>Financial Support</Text>
        <Text style={tw`text-zinc-500 mb-6 leading-tight`}>
          Submit your Aadhaar and PAN details to apply for worker financial support. The team reviews each request and follows up after verification.
        </Text>

        <View style={tw`bg-white p-5 rounded-[24px] border border-purple-200 shadow-sm mb-6 flex-row items-center gap-4`}>
          <Landmark size={24} color="#9333ea" />
          <View style={tw`flex-1`}>
            <Text style={tw`text-lg font-bold text-zinc-800 mb-1`}>Verification Required</Text>
            <Text style={tw`text-zinc-500 text-xs`}>Only workers with completed profiles can submit this application.</Text>
          </View>
        </View>

        {accountType && accountType !== 'worker' ? (
          <View style={tw`bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6`}>
            <Text style={tw`text-amber-900 font-bold mb-1`}>Workers only</Text>
            <Text style={tw`text-amber-800 text-sm`}>This application is available to worker accounts only.</Text>
          </View>
        ) : null}

        <View style={tw`bg-white p-5 rounded-[24px] border border-zinc-100 shadow-sm mb-6 gap-4`}>
          <View>
            <Text style={tw`text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1`}>Aadhaar Number</Text>
            <TextInput
              value={aadhaarNumber}
              onChangeText={setAadhaarNumber}
              placeholder="123456789012"
              keyboardType="numeric"
              maxLength={12}
              placeholderTextColor="#a1a1aa"
              style={tw`w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900`}
            />
          </View>

          <View>
            <Text style={tw`text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1`}>PAN Number</Text>
            <TextInput
              value={panNumber}
              onChangeText={setPanNumber}
              placeholder="ABCDE1234F"
              autoCapitalize="characters"
              maxLength={10}
              placeholderTextColor="#a1a1aa"
              style={tw`w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900`}
            />
          </View>

          <View>
            <Text style={tw`text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1`}>Bank Preference</Text>
            <TextInput
              value={bankPreference}
              onChangeText={setBankPreference}
              placeholder="No Preference"
              placeholderTextColor="#a1a1aa"
              style={tw`w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900`}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleApply}
          disabled={loading || (accountType !== null && accountType !== 'worker')}
          style={tw`bg-[#9333ea] py-4 rounded-full flex-row items-center justify-center shadow-lg mt-2 ${loading || (accountType !== null && accountType !== 'worker') ? 'opacity-70' : ''}`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={tw`text-white font-bold uppercase tracking-widest text-sm`}>Submit Application</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
