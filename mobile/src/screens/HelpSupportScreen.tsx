import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, ChevronUp, Mail, Phone, MessageSquare, Send } from 'lucide-react-native';
import tw from 'twrnc';

const faqs = [
  { question: "How do I hire a worker?", answer: "Browse the 'Workers' tab, select a worker that fits your needs, and click 'Book Worker' to send a direct hire request." },
  { question: "How does payment work?", answer: "Payments are held securely in escrow until the job is completed and approved by you." },
  { question: "What if a worker doesn't show up?", answer: "You can report the issue through this Help page and we will refund your deposit or assign a new worker." },
  { question: "How do I become a verified worker?", answer: "Go to your profile, click 'Apply as Worker' and complete the onboarding form with your documents." }
];

export default function HelpSupportScreen({ navigation }: any) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const submitTicket = () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message before submitting.");
      return;
    }
    Alert.alert("Success", "Your support ticket has been submitted. Our team will get back to you within 24 hours.", [
      { text: "OK", onPress: () => setMessage('') }
    ]);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={tw`flex-1`}>
        <View style={tw`flex-row items-center gap-4 px-6 pt-6 pb-4 bg-white border-b border-zinc-100`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`w-10 h-10 rounded-full bg-zinc-50 items-center justify-center`}>
            <ChevronLeft size={24} color="#3f3f46" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold text-zinc-800`}>Help & Support</Text>
        </View>

        <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-6 pb-8`}>
          <Text style={tw`text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4`}>Frequently Asked Questions</Text>
          
          <View style={tw`bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden mb-8`}>
            {faqs.map((faq, index) => (
              <View key={index} style={tw`${index !== faqs.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                <TouchableOpacity onPress={() => toggleFAQ(index)} style={tw`flex-row justify-between items-center p-4`}>
                  <Text style={tw`text-zinc-800 font-medium flex-1 pr-4`}>{faq.question}</Text>
                  {expandedIndex === index ? <ChevronUp size={20} color="#a1a1aa" /> : <ChevronDown size={20} color="#a1a1aa" />}
                </TouchableOpacity>
                {expandedIndex === index && (
                  <View style={tw`px-4 pb-4 pt-1`}>
                    <Text style={tw`text-zinc-500 text-sm leading-5`}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          <Text style={tw`text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4`}>Contact Support</Text>

          <View style={tw`flex-row gap-4 mb-6`}>
            <TouchableOpacity style={tw`flex-1 bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm items-center`}>
              <Mail size={24} color="#cc4518" style={tw`mb-2`} />
              <Text style={tw`font-bold text-zinc-700`}>Email</Text>
              <Text style={tw`text-xs text-zinc-500`}>support@app.com</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={tw`flex-1 bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm items-center`}>
              <Phone size={24} color="#cc4518" style={tw`mb-2`} />
              <Text style={tw`font-bold text-zinc-700`}>Phone</Text>
              <Text style={tw`text-xs text-zinc-500`}>+1 800 123 4567</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm`}>
            <View style={tw`flex-row items-center gap-2 mb-3`}>
              <MessageSquare size={20} color="#3f3f46" />
              <Text style={tw`font-bold text-zinc-800`}>Send us a message</Text>
            </View>
            <TextInput
              style={tw`bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-zinc-800 h-32 mb-4`}
              placeholder="Describe your issue..."
              placeholderTextColor="#a1a1aa"
              multiline
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity onPress={submitTicket} style={tw`bg-[#cc4518] rounded-xl py-3 flex-row items-center justify-center gap-2`}>
              <Send size={18} color="white" />
              <Text style={tw`text-white font-bold text-sm tracking-wide`}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
