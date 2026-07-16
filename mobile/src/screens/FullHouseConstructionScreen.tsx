import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft, Home, FileText, CheckCircle2 } from 'lucide-react-native';

export default function FullHouseConstructionScreen({ navigation }: any) {
  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <View style={tw`px-6 pt-4 pb-4 flex-row items-center gap-4 border-b border-zinc-100 bg-white`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 bg-zinc-50 rounded-full`}>
          <ArrowLeft size={20} color="#3f3f46" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-zinc-900`}>Full House Construction</Text>
      </View>
      <ScrollView contentContainerStyle={tw`p-6`}>
        <Image 
          source={{ uri: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80" }}
          style={tw`w-full h-48 rounded-[24px] mb-6`}
        />
        <Text style={tw`text-3xl font-bold text-zinc-800 mb-2`}>Build Your Dream Home</Text>
        <Text style={tw`text-zinc-500 mb-6 leading-tight`}>
          Get end-to-end construction services. From design and approvals to execution and handover, we manage everything.
        </Text>

        <View style={tw`bg-white p-5 rounded-[24px] border border-zinc-100 shadow-sm mb-6`}>
          <View style={tw`flex-row items-center gap-3 mb-4`}>
            <CheckCircle2 size={24} color="#10b981" />
            <Text style={tw`text-lg font-bold text-zinc-800`}>What's included</Text>
          </View>
          <View style={tw`gap-3`}>
            {['Architectural Design & Planning', 'Material Procurement', 'Labor Management', 'Quality Assurance', 'Timely Handover'].map((item, idx) => (
              <View key={idx} style={tw`flex-row items-center gap-2`}>
                <View style={tw`w-1.5 h-1.5 rounded-full bg-zinc-400`} />
                <Text style={tw`text-zinc-600`}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={tw`bg-[#cc4518] py-4 rounded-full flex-row items-center justify-center shadow-lg mt-4`}>
          <FileText size={18} color="white" style={tw`mr-2`} />
          <Text style={tw`text-white font-bold uppercase tracking-widest text-sm`}>Get Free Estimate</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
