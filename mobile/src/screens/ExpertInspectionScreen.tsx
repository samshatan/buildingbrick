import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft, SearchCheck, UserCheck } from 'lucide-react-native';

export default function ExpertInspectionScreen({ navigation }: any) {
  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <View style={tw`px-6 pt-4 pb-4 flex-row items-center gap-4 border-b border-zinc-100 bg-white`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 bg-zinc-50 rounded-full`}>
          <ArrowLeft size={20} color="#3f3f46" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-zinc-900`}>Expert Inspection</Text>
      </View>
      <ScrollView contentContainerStyle={tw`p-6`}>
        <View style={tw`bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
          <SearchCheck size={32} color="#2563eb" />
        </View>
        <Text style={tw`text-3xl font-bold text-zinc-800 mb-2`}>Quality & Product Inspection</Text>
        <Text style={tw`text-zinc-500 mb-6 leading-tight`}>
          Book a verified expert to inspect the quality of materials or the structural integrity of an ongoing project.
        </Text>

        <TouchableOpacity style={tw`bg-[#2563eb] py-4 rounded-full flex-row items-center justify-center shadow-lg mt-2`}>
          <UserCheck size={18} color="white" style={tw`mr-2`} />
          <Text style={tw`text-white font-bold uppercase tracking-widest text-sm`}>Book an Expert</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
