import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ChevronLeft, Camera, User as UserIcon, Save } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

export default function EditProfileScreen({ navigation }: any) {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [newAvatarSelected, setNewAvatarSelected] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userInfo');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUserInfo(parsed);
          setName(parsed.name || parsed.fullName || '');
          setEmail(parsed.email || '');
          setPhone(parsed.phone || '');
          setAvatarUri(parsed.avatarUrl || null);
        }
      } catch (e) {
        console.error('Failed to load user info', e);
      } finally {
        setInitialLoading(false);
      }
    };
    loadUserData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
      setNewAvatarSelected(true);
    }
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert("Error", "Name is required");
      return;
    }

    setLoading(true);
    try {
      let uploadedAvatarUrl = userInfo?.avatarUrl;

      // 1. Upload new avatar if selected
      if (newAvatarSelected && avatarUri) {
        const formData = new FormData();
        const uriParts = avatarUri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('image', {
          uri: avatarUri,
          name: `avatar.${fileType}`,
          type: `image/${fileType}`,
        } as any);

        const uploadRes = await apiClient.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (uploadRes.data?.url) {
          uploadedAvatarUrl = uploadRes.data.url;
        }
      }

      // 2. Update profile details
      const updateRes = await apiClient.patch('/users/account', {
        name,
        email: email || undefined,
        phone: phone || undefined,
        avatarUrl: uploadedAvatarUrl
      });

      if (updateRes.data?.user) {
        // Save new user info
        await AsyncStorage.setItem('userInfo', JSON.stringify(updateRes.data.user));
        Alert.alert("Success", "Profile updated successfully!");
        navigation.goBack();
      }

    } catch (error: any) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-zinc-50 items-center justify-center`}>
        <ActivityIndicator size="large" color="#cc4518" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={tw`flex-1`}>
        <View style={tw`flex-row items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white z-10`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`w-10 h-10 items-center justify-center -ml-2 rounded-full bg-zinc-50`}>
            <ChevronLeft size={24} color="#3f3f46" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-zinc-900 tracking-wide`}>Edit Profile</Text>
          <View style={tw`w-10 h-10`} />
        </View>

        <ScrollView contentContainerStyle={tw`p-6 pb-32`}>
          {/* Avatar Section */}
          <View style={tw`items-center mb-8`}>
            <TouchableOpacity onPress={pickImage} style={tw`relative`}>
              <View style={tw`w-28 h-28 rounded-full bg-zinc-100 border-4 border-white shadow-sm items-center justify-center overflow-hidden`}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={tw`w-full h-full`} />
                ) : (
                  <UserIcon size={40} color="#cc4518" />
                )}
              </View>
              <View style={tw`absolute bottom-0 right-0 w-8 h-8 bg-[#cc4518] rounded-full border-2 border-white items-center justify-center shadow-sm`}>
                <Camera size={14} color="white" />
              </View>
            </TouchableOpacity>
            <Text style={tw`text-zinc-500 text-xs font-medium mt-3`}>Tap to change photo</Text>
          </View>

          {/* Form Fields */}
          <View style={tw`bg-white rounded-[24px] p-5 shadow-sm border border-zinc-100 flex-col gap-4`}>
            <View style={tw`flex-col gap-1.5`}>
              <Text style={tw`text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1`}>Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
                placeholderTextColor="#a1a1aa"
                style={tw`w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900`}
              />
            </View>

            <View style={tw`flex-col gap-1.5`}>
              <Text style={tw`text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1`}>Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="john@example.com"
                placeholderTextColor="#a1a1aa"
                keyboardType="email-address"
                autoCapitalize="none"
                style={tw`w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900`}
              />
            </View>

            <View style={tw`flex-col gap-1.5`}>
              <Text style={tw`text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1`}>Phone Number</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+91234567890"
                placeholderTextColor="#a1a1aa"
                keyboardType="phone-pad"
                style={tw`w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900`}
              />
            </View>
          </View>
        </ScrollView>

        <View style={tw`absolute bottom-0 left-0 right-0 p-6 bg-zinc-50 border-t border-zinc-100`}>
          <TouchableOpacity 
            onPress={handleSave} 
            disabled={loading}
            style={tw`w-full bg-[#cc4518] py-4 rounded-xl shadow-md items-center justify-center flex-row gap-2 ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Save size={18} color="white" />
                <Text style={tw`text-white font-bold tracking-wide`}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
