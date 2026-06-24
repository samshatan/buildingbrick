import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Check, X, FileText } from 'lucide-react-native';
import tw from 'twrnc';

const dummyApplications = [
  { id: '101', name: 'James Carter', skill: 'Electrician', experience: '5 Years', documents: 2, status: 'Pending' },
  { id: '102', name: 'Maria Garcia', skill: 'Plumber', experience: '8 Years', documents: 3, status: 'Pending' },
];

export default function WorkerVerificationScreen({ navigation }: any) {
  const [apps, setApps] = useState(dummyApplications);

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    Alert.alert(`Confirm ${action}`, `Are you sure you want to mark this application as ${action}?`, [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Confirm", 
        onPress: () => {
          setApps(apps.filter(app => app.id !== id));
          Alert.alert("Success", `Application has been ${action.toLowerCase()}.`);
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <View style={tw`flex-row items-center gap-4 px-6 pt-6 pb-4 bg-white border-b border-zinc-100`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`w-10 h-10 rounded-full bg-zinc-50 items-center justify-center`}>
          <ChevronLeft size={24} color="#3f3f46" />
        </TouchableOpacity>
        <View>
          <Text style={tw`text-xl font-bold text-zinc-800`}>Worker Verification</Text>
          <Text style={tw`text-xs font-medium text-zinc-500`}>{apps.length} Pending Approvals</Text>
        </View>
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-6 pb-24 gap-4`}>
        {apps.length === 0 ? (
          <Text style={tw`text-center text-zinc-500 mt-10`}>No pending applications right now.</Text>
        ) : apps.map((app) => (
          <View key={app.id} style={tw`bg-white rounded-2xl p-5 border border-orange-100 shadow-sm`}>
            <View style={tw`flex-row items-center gap-4 mb-4`}>
              <View style={tw`w-16 h-16 bg-zinc-100 rounded-full items-center justify-center`}>
                <Image source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=cc4518&color=fff` }} style={tw`w-16 h-16 rounded-full`} />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-bold text-zinc-900`}>{app.name}</Text>
                <Text style={tw`text-sm font-medium text-[#cc4518]`}>{app.skill}</Text>
                <Text style={tw`text-xs text-zinc-500`}>{app.experience} Experience</Text>
              </View>
            </View>

            <TouchableOpacity style={tw`flex-row items-center justify-between bg-zinc-50 p-3 rounded-xl mb-4 border border-zinc-100`}>
              <View style={tw`flex-row items-center gap-2`}>
                <FileText size={16} color="#71717a" />
                <Text style={tw`text-sm font-bold text-zinc-700`}>View Identity & Docs</Text>
              </View>
              <View style={tw`bg-zinc-200 px-2 py-0.5 rounded-full`}>
                <Text style={tw`text-[10px] font-bold text-zinc-600`}>{app.documents} Files</Text>
              </View>
            </TouchableOpacity>

            <View style={tw`flex-row gap-2 mt-1`}>
              <TouchableOpacity onPress={() => handleAction(app.id, 'Approved')} style={tw`flex-1 flex-row items-center justify-center gap-2 bg-[#cc4518] py-3 rounded-xl shadow-sm`}>
                <Check size={16} color="white" />
                <Text style={tw`text-white font-bold text-sm tracking-wide`}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAction(app.id, 'Rejected')} style={tw`flex-1 flex-row items-center justify-center gap-2 bg-white border border-red-200 py-3 rounded-xl`}>
                <X size={16} color="#dc2626" />
                <Text style={tw`text-red-600 font-bold text-sm tracking-wide`}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
