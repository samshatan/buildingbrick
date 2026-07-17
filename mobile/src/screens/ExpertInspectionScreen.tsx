import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft, SearchCheck, UserCheck, CheckCircle2 } from 'lucide-react-native';
import apiClient from '../api/client';

export default function ExpertInspectionScreen({ navigation }: any) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState('');

  const submitRequest = async () => {
    if (!details || !location) {
      Alert.alert('Missing Info', 'Please provide project details and location.');
      return;
    }
    
    setLoading(true);
    try {
      await apiClient.post('/expert-requests', {
        projectDetails: details,
        location: location
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit expert request.');
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
        <Text style={tw`text-lg font-bold text-zinc-900`}>Expert Inspection</Text>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={tw`p-6`}>
          
          {success ? (
            <View style={tw`flex-1 justify-center items-center py-20`}>
              <View style={tw`w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-6`}>
                <CheckCircle2 size={40} color="#2563eb" />
              </View>
              <Text style={tw`text-2xl font-bold text-zinc-900 mb-2`}>Expert Booked!</Text>
              <Text style={tw`text-center text-zinc-500 mb-8`}>
                We've received your request. An administrator will review your details and contact you to schedule the inspection.
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={tw`bg-zinc-900 px-8 py-4 rounded-full`}
              >
                <Text style={tw`text-white font-bold uppercase tracking-widest text-xs`}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          ) : !showForm ? (
            <>
              <View style={tw`bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                <SearchCheck size={32} color="#2563eb" />
              </View>
              <Text style={tw`text-3xl font-bold text-zinc-800 mb-2`}>Quality & Product Inspection</Text>
              <Text style={tw`text-zinc-500 mb-6 leading-tight`}>
                Book a verified expert to inspect the quality of materials or the structural integrity of an ongoing project.
              </Text>

              <TouchableOpacity 
                onPress={() => setShowForm(true)}
                style={tw`bg-[#2563eb] py-4 rounded-full flex-row items-center justify-center shadow-lg mt-2`}
              >
                <UserCheck size={18} color="white" style={tw`mr-2`} />
                <Text style={tw`text-white font-bold uppercase tracking-widest text-sm`}>Book an Expert</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={tw`bg-white p-6 rounded-[24px] shadow-sm border border-zinc-100`}>
              <Text style={tw`text-xl font-bold text-zinc-800 mb-6`}>Inspection Details</Text>
              
              <Text style={tw`text-sm font-bold text-zinc-700 mb-2`}>What needs inspection?</Text>
              <TextInput
                style={tw`bg-zinc-50 border border-zinc-200 rounded-xl p-4 mb-4 text-zinc-800 min-h-[100px]`}
                placeholder="E.g., Need structural integrity check for new roof, or material quality check."
                placeholderTextColor="#a1a1aa"
                multiline
                textAlignVertical="top"
                value={details}
                onChangeText={setDetails}
              />

              <Text style={tw`text-sm font-bold text-zinc-700 mb-2`}>Location</Text>
              <TextInput
                style={tw`bg-zinc-50 border border-zinc-200 rounded-xl p-4 mb-8 text-zinc-800 min-h-[80px]`}
                placeholder="Where is the site located?"
                placeholderTextColor="#a1a1aa"
                multiline
                textAlignVertical="top"
                value={location}
                onChangeText={setLocation}
              />

              <TouchableOpacity 
                onPress={submitRequest}
                disabled={loading}
                style={tw`bg-[#2563eb] py-4 rounded-full flex-row items-center justify-center shadow-md ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={tw`text-white font-bold uppercase tracking-widest text-sm`}>Submit Request</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setShowForm(false)}
                style={tw`py-4 mt-2 rounded-full flex-row items-center justify-center`}
              >
                <Text style={tw`text-zinc-500 font-bold uppercase tracking-widest text-xs`}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
