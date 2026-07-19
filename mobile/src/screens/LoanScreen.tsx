import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft, HandCoins, Landmark } from 'lucide-react-native';

export default function LoanScreen({ navigation }: any) {
  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <View style={tw`px-6 pt-4 pb-4 flex-row items-center gap-4 border-b border-zinc-100 bg-white`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 bg-zinc-50 rounded-full`}>
          <ArrowLeft size={20} color="#3f3f46" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-zinc-900`}>Worker Loans</Text>
      </View>
      <ScrollView contentContainerStyle={tw`p-6`}>
        <View style={tw`bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
          <HandCoins size={32} color="#9333ea" />
        </View>
        <Text style={tw`text-3xl font-bold text-zinc-800 mb-2`}>Financial Support</Text>
        <Text style={tw`text-zinc-500 mb-6 leading-tight`}>
          Access low-interest loans designed specifically for our platform workers. Get funds for tools, emergencies, or personal needs.
        </Text>

        <View style={tw`bg-white p-5 rounded-[24px] border border-purple-200 shadow-sm mb-6 flex-row items-center gap-4`}>
          <Landmark size={24} color="#9333ea" />
          <View style={tw`flex-1`}>
            <Text style={tw`text-lg font-bold text-zinc-800 mb-1`}>Micro-Loans up to $5,000</Text>
            <Text style={tw`text-zinc-500 text-xs`}>Instant approval based on your work history and ratings on the platform.</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => Alert.alert(
            'Check Eligibility',
            'Eligibility is determined by your work history and ratings on the platform. Workers with 3+ completed jobs and a rating of 3.5 or higher are eligible.

Feature coming soon — our team will contact you within 48 hours after you apply.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Apply', onPress: () => Alert.alert('Application Received', 'Our team will review your profile and contact you shortly.') }
            ]
          )}
          style={tw`bg-[#9333ea] py-4 rounded-full flex-row items-center justify-center shadow-lg mt-2`}
        >
          <Text style={tw`text-white font-bold uppercase tracking-widest text-sm`}>Check Eligibility</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
