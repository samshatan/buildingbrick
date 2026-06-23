import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import tw from 'twrnc';
import { ChevronLeft, Send, Camera, Image as ImageIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

export default function ChatScreen({ route, navigation }: any) {
  const { worker } = route.params || { worker: { name: 'Support', photo: '' } };
  const [messages, setMessages] = useState([
    { id: '1', text: `Hi there! Let me know if you need any help with your project.`, sender: 'worker', time: '10:00 AM' }
  ]);
  const [inputText, setInputText] = useState('');

  const getWorkerImage = (w: any) => w.photo || w.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80";

  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    setMessages([...messages, {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInputText('');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMessages([...messages, {
        id: Date.now().toString(),
        text: '📸 Image Attached',
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMessages([...messages, {
        id: Date.now().toString(),
        text: '📸 Photo Attached',
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`} edges={['top']}>
      {/* Header */}
      <View style={tw`px-4 py-3 bg-white border-b border-zinc-100 flex-row items-center gap-3 shadow-sm z-10`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
          <ChevronLeft size={24} color="#18181b" />
        </TouchableOpacity>
        <View style={tw`w-10 h-10 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200`}>
          <Image source={{ uri: getWorkerImage(worker) }} style={tw`w-full h-full`} />
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-base font-bold text-zinc-900`}>{worker.name || worker.displayName}</Text>
          <Text style={tw`text-[10px] font-bold text-green-500 uppercase tracking-widest`}>Online</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView contentContainerStyle={tw`p-4 pb-8`} style={tw`flex-1 bg-zinc-50`}>
        {messages.map((msg) => (
          <View key={msg.id} style={tw`mb-4 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <View style={tw`max-w-[80%] rounded-2xl px-4 py-3 ${msg.sender === 'user' ? 'bg-[#cc4518] rounded-tr-sm' : 'bg-white border border-zinc-200 rounded-tl-sm'}`}>
              <Text style={tw`text-sm font-medium ${msg.sender === 'user' ? 'text-white' : 'text-zinc-800'}`}>
                {msg.text}
              </Text>
            </View>
            <Text style={tw`text-[9px] font-bold text-zinc-400 mt-1 mx-1`}>{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Bar */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
        <View style={tw`bg-white px-4 py-3 border-t border-zinc-100 flex-row items-end gap-2 pb-8`}>
          <View style={tw`flex-1 bg-zinc-50 border border-zinc-200 rounded-[24px] flex-row items-end p-1`}>
            <TouchableOpacity onPress={takePhoto} style={tw`p-2.5 rounded-full bg-white shadow-sm border border-zinc-100 mb-0.5 ml-0.5`}>
              <Camera size={18} color="#71717a" />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={tw`p-2.5 rounded-full bg-white shadow-sm border border-zinc-100 mb-0.5 ml-1 mr-1`}>
              <ImageIcon size={18} color="#71717a" />
            </TouchableOpacity>
            
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Message..."
              placeholderTextColor="#a1a1aa"
              multiline
              style={tw`flex-1 min-h-[44px] max-h-[100px] text-sm text-zinc-900 pt-3 pb-3 px-2`}
            />
          </View>
          
          <TouchableOpacity 
            onPress={sendMessage}
            disabled={!inputText.trim()}
            style={tw`w-12 h-12 rounded-full ${inputText.trim() ? 'bg-[#cc4518]' : 'bg-zinc-200'} items-center justify-center`}
          >
            <Send size={18} color="white" style={tw`ml-1`} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
