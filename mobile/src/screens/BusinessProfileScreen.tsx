import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Camera, MapPin, Clock, Save, Edit3 } from 'lucide-react-native';
import tw from 'twrnc';

export default function BusinessProfileScreen({ navigation }: any) {
  const [businessName, setBusinessName] = useState('Central Cafe & Supplies');
  const [address, setAddress] = useState('123 Main St, Downtown');
  const [description, setDescription] = useState('Premium coffee and building supplies for local workers.');
  const [isCurrentlyOpen, setIsCurrentlyOpen] = useState(true);

  const handleSave = () => {
    Alert.alert("Success", "Business profile updated successfully!");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={tw`flex-1`}>
        <View style={tw`flex-row items-center justify-between px-6 pt-6 pb-4 bg-white border-b border-zinc-100`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`w-10 h-10 rounded-full bg-zinc-50 items-center justify-center`}>
            <ChevronLeft size={24} color="#3f3f46" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold text-zinc-800`}>Business Profile</Text>
          <TouchableOpacity onPress={handleSave} style={tw`w-10 h-10 items-center justify-center`}>
            <Save size={24} color="#cc4518" />
          </TouchableOpacity>
        </View>

        <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-8`}>
          {/* Cover Image Area */}
          <View style={tw`relative h-48 bg-zinc-200`}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80' }} 
              style={tw`w-full h-full opacity-80`} 
            />
            <TouchableOpacity style={tw`absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md`}>
              <Camera size={20} color="#3f3f46" />
            </TouchableOpacity>
          </View>

          <View style={tw`px-6 -mt-8`}>
            <View style={tw`bg-white rounded-3xl p-6 shadow-sm border border-zinc-100`}>
              <View style={tw`flex-row justify-between items-center mb-6`}>
                <Text style={tw`text-lg font-bold text-zinc-800`}>Open for Business</Text>
                <Switch
                  value={isCurrentlyOpen}
                  onValueChange={setIsCurrentlyOpen}
                  trackColor={{ false: "#e4e4e7", true: "#fdba74" }}
                  thumbColor={isCurrentlyOpen ? "#cc4518" : "#f4f4f5"}
                />
              </View>

              <View style={tw`mb-5`}>
                <View style={tw`flex-row items-center gap-2 mb-2`}>
                  <Edit3 size={16} color="#71717a" />
                  <Text style={tw`text-xs font-bold text-zinc-500 uppercase tracking-wider`}>Business Name</Text>
                </View>
                <TextInput
                  style={tw`bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 font-medium`}
                  value={businessName}
                  onChangeText={setBusinessName}
                />
              </View>

              <View style={tw`mb-5`}>
                <View style={tw`flex-row items-center gap-2 mb-2`}>
                  <MapPin size={16} color="#71717a" />
                  <Text style={tw`text-xs font-bold text-zinc-500 uppercase tracking-wider`}>Location</Text>
                </View>
                <TextInput
                  style={tw`bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-800 font-medium`}
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              <View style={tw`mb-5`}>
                <View style={tw`flex-row items-center gap-2 mb-2`}>
                  <Edit3 size={16} color="#71717a" />
                  <Text style={tw`text-xs font-bold text-zinc-500 uppercase tracking-wider`}>Description</Text>
                </View>
                <TextInput
                  style={tw`bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-zinc-800 font-medium h-24`}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <View style={tw`mb-2`}>
                <View style={tw`flex-row items-center gap-2 mb-2`}>
                  <Clock size={16} color="#71717a" />
                  <Text style={tw`text-xs font-bold text-zinc-500 uppercase tracking-wider`}>Operating Hours</Text>
                </View>
                <TouchableOpacity style={tw`bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 flex-row justify-between items-center`}>
                  <Text style={tw`text-zinc-800 font-medium`}>Mon - Fri: 8:00 AM - 6:00 PM</Text>
                  <Text style={tw`text-[#cc4518] font-bold text-xs`}>EDIT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
