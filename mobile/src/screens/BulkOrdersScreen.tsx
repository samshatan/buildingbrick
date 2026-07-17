import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ArrowLeft, Box, Truck, CheckCircle2 } from 'lucide-react-native';
import apiClient from '../api/client';

export default function BulkOrdersScreen({ navigation }: any) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [materials, setMaterials] = useState('');
  const [quantity, setQuantity] = useState('');
  const [address, setAddress] = useState('');

  const submitOrder = async () => {
    if (!materials || !quantity) {
      Alert.alert('Missing Info', 'Please provide materials and quantity details.');
      return;
    }
    
    setLoading(true);
    try {
      await apiClient.post('/bulk-orders', {
        materialsRequested: materials,
        quantityDescription: quantity,
        deliveryAddress: address
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit bulk order request.');
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
        <Text style={tw`text-lg font-bold text-zinc-900`}>Bulk Orders</Text>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={tw`p-6`}>
          
          {success ? (
            <View style={tw`flex-1 justify-center items-center py-20`}>
              <View style={tw`w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6`}>
                <CheckCircle2 size={40} color="#16a34a" />
              </View>
              <Text style={tw`text-2xl font-bold text-zinc-900 mb-2`}>Request Sent!</Text>
              <Text style={tw`text-center text-zinc-500 mb-8`}>
                We've received your bulk order request. Our team will review your requirements and get back to you with a quote shortly.
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
                  <TouchableOpacity 
                    onPress={() => setShowForm(true)}
                    style={tw`bg-zinc-900 py-3 rounded-full flex-row items-center justify-center`}
                  >
                    <Text style={tw`text-white font-bold uppercase tracking-widest text-xs`}>Start Request</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <View style={tw`bg-white p-6 rounded-[24px] shadow-sm border border-zinc-100`}>
              <Text style={tw`text-xl font-bold text-zinc-800 mb-6`}>Order Details</Text>
              
              <Text style={tw`text-sm font-bold text-zinc-700 mb-2`}>What materials do you need?</Text>
              <TextInput
                style={tw`bg-zinc-50 border border-zinc-200 rounded-xl p-4 mb-4 text-zinc-800 min-h-[100px]`}
                placeholder="E.g., 500 bags of cement, 10,000 red bricks..."
                placeholderTextColor="#a1a1aa"
                multiline
                textAlignVertical="top"
                value={materials}
                onChangeText={setMaterials}
              />

              <Text style={tw`text-sm font-bold text-zinc-700 mb-2`}>Quantity & Timeline</Text>
              <TextInput
                style={tw`bg-zinc-50 border border-zinc-200 rounded-xl p-4 mb-4 text-zinc-800 min-h-[100px]`}
                placeholder="E.g., Need it delivered by next week."
                placeholderTextColor="#a1a1aa"
                multiline
                textAlignVertical="top"
                value={quantity}
                onChangeText={setQuantity}
              />

              <Text style={tw`text-sm font-bold text-zinc-700 mb-2`}>Delivery Address (Optional)</Text>
              <TextInput
                style={tw`bg-zinc-50 border border-zinc-200 rounded-xl p-4 mb-8 text-zinc-800 min-h-[80px]`}
                placeholder="Where should it be delivered?"
                placeholderTextColor="#a1a1aa"
                multiline
                textAlignVertical="top"
                value={address}
                onChangeText={setAddress}
              />

              <TouchableOpacity 
                onPress={submitOrder}
                disabled={loading}
                style={tw`bg-[#cc4518] py-4 rounded-full flex-row items-center justify-center ${loading ? 'opacity-70' : ''}`}
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
