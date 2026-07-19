import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { ChevronLeft, Send, Camera, Image as ImageIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import apiClient, { SOCKET_URL } from '../api/client';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen({ route, navigation }: any) {
  const { worker } = route.params || { worker: { name: 'Support', photo: '', userId: '' } };
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const initUser = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
          const parsed = JSON.parse(userInfo);
          const uid = parsed._id || parsed.id;
          setCurrentUserId(uid);
          // Join socket room as soon as we have the userId
          if (socketRef.current?.connected && uid) {
            socketRef.current.emit('join', uid);
          }
        }
      } catch (e) {}
    };
    initUser();
  }, []);

  const fetchMessages = async () => {
    try {
      // Use worker.userId for fetching messages. If not available, fallback to worker._id
      const targetId = worker.userId || worker._id;
      if (!targetId) return;

      const res = await apiClient.get(`/messages/${targetId}`);
      if (res.data?.success) {
        setMessages(res.data.data);
      }
    } catch (error) {    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Connect to Socket
    socketRef.current = io(SOCKET_URL);
    
    socketRef.current.on('connect', () => {      if (socketRef.current) {
        // Emit join immediately on connect; currentUserId may load after
        const userId = currentUserId;
        if (userId) socketRef.current.emit('join', userId);
      }
    });

    socketRef.current.on('receiveMessage', (msg: any) => {
      // If the message involves this chat
      const targetId = worker.userId || worker._id;
      if (msg.senderId === targetId || msg.receiverId === targetId || msg.senderId === currentUserId) {
        setMessages(prev => {
          // Check if message already exists (optimistic update)
          const exists = prev.find(m => m._id === msg._id || (m.text === msg.text && m.senderId === msg.senderId && Date.now() - new Date(m.createdAt).getTime() < 5000));
          if (exists) return prev;
          return [...prev, msg];
        });
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [worker, currentUserId]);

  const getWorkerImage = (w: any) => w.photo || w.image || w.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80";

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const targetId = worker.userId || worker._id;
    if (!targetId) return;

    // Optimistic UI update
    const tempMsg = {
      _id: Date.now().toString(),
      text: inputText.trim(),
      senderId: currentUserId,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    setInputText('');
    
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      await apiClient.post('/messages', {
        receiverId: targetId,
        text: tempMsg.text
      });
      // Removing fetchMessages() as socket will handle the real message
    } catch (error) {      Alert.alert("Error", "Failed to send message");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true
    });

    if (!result.canceled && result.assets[0].base64) {
      sendImageMessage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true
    });

    if (!result.canceled && result.assets[0].base64) {
      sendImageMessage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const sendImageMessage = async (base64Image: string) => {
    const targetId = worker.userId || worker._id;
    if (!targetId) return;

    // Optimistic
    const tempMsg = {
      _id: Date.now().toString(),
      text: '',
      imageUrl: base64Image,
      senderId: currentUserId,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      await apiClient.post('/messages', {
        receiverId: targetId,
        imageUrl: base64Image
      });
      fetchMessages();
    } catch (error) {      Alert.alert("Error", "Failed to send image");
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
      <ScrollView ref={scrollViewRef} contentContainerStyle={tw`p-4 pb-8`} style={tw`flex-1 bg-zinc-50`} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
        {loadingMessages ? (
          <View style={tw`flex-1 justify-center items-center py-12`}>
            <ActivityIndicator size="large" color="#cc4518" />
          </View>
        ) : messages.length === 0 ? (
          <View style={tw`flex-1 justify-center items-center py-12`}>
            <Text style={tw`text-zinc-400 text-sm font-medium`}>No messages yet. Say hello! 👋</Text>
          </View>
        ) : (
          messages.map((msg) => {
            const isUser = msg.senderId === currentUserId;
            const timeString = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
            
            return (
              <View key={msg._id || msg.id} style={tw`mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
                <View style={tw`max-w-[80%] rounded-2xl px-4 py-3 ${isUser ? 'bg-[#cc4518] rounded-tr-sm' : 'bg-white border border-zinc-200 rounded-tl-sm'}`}>
                  {msg.imageUrl ? (
                    <Image source={{ uri: msg.imageUrl }} style={tw`w-48 h-48 rounded-xl`} />
                  ) : null}
                  {msg.text ? (
                    <Text style={tw`text-sm font-medium ${isUser ? 'text-white' : 'text-zinc-800'} ${msg.imageUrl ? 'mt-2' : ''}`}>
                      {msg.text}
                    </Text>
                  ) : null}
                </View>
                <Text style={tw`text-[9px] font-bold text-zinc-400 mt-1 mx-1`}>{timeString}</Text>
              </View>
            );
          })
        )}
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
