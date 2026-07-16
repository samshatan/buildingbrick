import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft, Box, Truck } from 'lucide-react-native';

export default function BulkOrdersScreen({ navigation }: any) {
  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <View style={tw`px-6 pt-4 pb-4 flex-row items-center gap-4 border-b border-zinc-100 bg-white`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 bg-zinc-50 rounded-full`}>
          <ArrowLeft size={20} color="#3f3f46" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-zinc-900`}>Bulk Orders</Text>
      </View>
      <ScrollView contentContainerStyle={tw`p-6`}>
        <View style={tw`bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
          <Truck size={32} color="#cc4518" />
        </View>
        <Text style={tw`text-3xl font-bold text-zinc-800 mb-2`}>Wholesale Materials</Text>
        <Text style={tw`text-zinc-500 mb-6 leading-tight`}>
          Need materials in large quantities? Request a bulk order for special discounted pricing on bricks, cement, and more.
        </Text>

        <View style={tw`bg-white p-5 rounded-[24px] border border-zinc-100 shadow-sm mb-6 flex-row items-start gap-4`}>
          <Box size={24} color="#f59e0b" />
          <View style={tw`flex-1`}>
            <Text style={tw`text-lg font-bold text-zinc-800 mb-1`}>Request a Quote</Text>
            <Text style={tw`text-zinc-500 text-sm mb-4`}>Tell us what materials you need and in what quantity, and we'll get back to you with our best rates.</Text>
            <TouchableOpacity style={tw`bg-zinc-900 py-3 rounded-full flex-row items-center justify-center`}>
              <Text style={tw`text-white font-bold uppercase tracking-widest text-xs`}>Start Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
