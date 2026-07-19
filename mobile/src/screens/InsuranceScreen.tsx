import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft, ShieldCheck, HeartPulse } from 'lucide-react-native';

export default function InsuranceScreen({ navigation }: any) {
  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <View style={tw`px-6 pt-4 pb-4 flex-row items-center gap-4 border-b border-zinc-100 bg-white`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 bg-zinc-50 rounded-full`}>
          <ArrowLeft size={20} color="#3f3f46" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-zinc-900`}>Worker Insurance</Text>
      </View>
      <ScrollView contentContainerStyle={tw`p-6`}>
        <View style={tw`bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
          <ShieldCheck size={32} color="#10b981" />
        </View>
        <Text style={tw`text-3xl font-bold text-zinc-800 mb-2`}>Protect Yourself</Text>
        <Text style={tw`text-zinc-500 mb-6 leading-tight`}>
          Exclusive health and accident insurance plans available only for our verified workers. Secure your future while you work.
        </Text>

        <View style={tw`bg-white p-5 rounded-[24px] border border-emerald-200 shadow-sm mb-6 flex-row items-center gap-4`}>
          <HeartPulse size={24} color="#10b981" />
          <View style={tw`flex-1`}>
            <Text style={tw`text-lg font-bold text-zinc-800 mb-1`}>Health Cover Plus</Text>
            <Text style={tw`text-zinc-500 text-xs`}>Comprehensive medical and accident coverage up to $50,000.</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => Alert.alert(
            'Apply for Insurance',
            'You are about to apply for the Health Cover Plus plan. This provides up to $50,000 in medical and accident coverage exclusively for verified platform workers.

Our team will contact you within 24 hours to complete the enrollment.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Apply Now', onPress: () => Alert.alert('Application Submitted!', 'Thank you! Our team will review your profile and reach out to you shortly.') }
            ]
          )}
          style={tw`bg-[#10b981] py-4 rounded-full flex-row items-center justify-center shadow-lg mt-2`}
        >
          <Text style={tw`text-white font-bold uppercase tracking-widest text-sm`}>Apply Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
