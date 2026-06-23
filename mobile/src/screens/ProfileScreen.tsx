import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Settings, HelpCircle, Bell, ChevronRight, LogOut, Shield, Briefcase, User as UserIcon, Store, ChevronLeft, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Role = 'user' | 'worker' | 'cafe_owner' | 'admin';

export default function ProfileScreen({ navigation }: any) {
  const [role, setRole] = useState<string>('hirer');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [activeNotificationTab, setActiveNotificationTab] = useState<'All' | 'Projects' | 'Messages'>('All');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userInfo');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUserInfo(parsed);
          setRole(parsed.userType?.toLowerCase() || 'hirer');
        }
      } catch (e) {
        console.error('Failed to load user info', e);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    navigation.replace('Login');
  };

  const getRoleIcon = () => {
    switch(role) {
      case 'admin': return <Shield size={16} color="#52525b" />;
      case 'cafe_owner': return <Store size={16} color="#52525b" />;
      case 'worker': return <Briefcase size={16} color="#52525b" />;
      default: return <UserIcon size={16} color="#52525b" />;
    }
  };

  const getRoleMenuItems = () => {
    const common = [
      { icon: Bell, label: "Notifications" },
      { icon: Settings, label: "Settings" },
      { icon: HelpCircle, label: "Help & Support" },
    ];

    switch(role) {
      case 'admin':
        return [
          { icon: Shield, label: "Platform Moderation" },
          { icon: Briefcase, label: "Manage Roles" },
          ...common
        ];
      case 'cafe_owner':
        return [
          { icon: Briefcase, label: "My Job Postings" },
          { icon: Store, label: "My Business Profile" },
          ...common
        ];
      case 'worker':
        return [
          { icon: Briefcase, label: "My Jobs & Earnings" },
          ...common
        ];
      default:
        return [
          { icon: Store, label: "Saved Workers" },
          ...common
        ];
    }
  };

  const menuItems = getRoleMenuItems();

  const renderSubPage = () => {
    let content = (
      <View style={tw`flex-1 items-center justify-center pt-12`}>
          <View style={tw`w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-full items-center justify-center mb-4`}>
            <Settings size={28} color="#a1a1aa" />
          </View>
          <View style={tw`items-center`}>
            <Text style={tw`text-lg font-bold text-zinc-900 tracking-wide mb-1`}>Coming Soon</Text>
            <Text style={tw`text-sm font-medium text-zinc-500 text-center`}>The {activePage} section is currently under development.</Text>
          </View>
      </View>
    );

    if (activePage === "Settings") {
      content = (
        <View style={tw`flex-col gap-6`}>
          {['Push Notifications', 'Email Alerts', 'Dark Mode', 'Biometric Login'].map((setting, i) => (
            <View key={i} style={tw`flex-row items-center justify-between py-2 border-b border-zinc-100 pb-4 ${i === 3 ? 'border-0 pb-0' : ''}`}>
              <Text style={tw`font-bold text-zinc-700 text-sm tracking-wide`}>{setting}</Text>
              <View style={tw`w-12 h-6 rounded-full p-1 justify-center ${i === 2 ? 'bg-zinc-200' : 'bg-[#cc4518]'}`}>
                <View style={[tw`w-4 h-4 rounded-full bg-white shadow-sm`, { transform: [{ translateX: i === 2 ? 0 : 24 }] }]} />
              </View>
            </View>
          ))}
        </View>
      );
    } else if (activePage === "Notifications") {
      content = (
          <View style={tw`flex-col h-full -mx-6 px-6`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`flex-row gap-2 pb-4 mb-4 border-b border-zinc-100`}>
              {['All', 'Projects', 'Messages'].map(tab => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveNotificationTab(tab as any)}
                  style={tw`px-4 py-2 rounded-full ${activeNotificationTab === tab ? "bg-zinc-800" : "bg-zinc-50"}`}
                >
                  <Text style={tw`text-[10px] font-bold uppercase tracking-widest ${activeNotificationTab === tab ? "text-white" : "text-zinc-500"}`}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={tw`flex-col gap-3 pb-8`}>
              <View style={tw`p-5 border border-orange-100 bg-orange-50 rounded-[24px] shadow-sm flex-row gap-4`}>
                <View style={tw`w-10 h-10 rounded-full bg-orange-100 items-center justify-center`}>
                  <AlertCircle size={18} color="#cc4518" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-bold text-[#cc4518] text-sm tracking-wide mb-1`}>Project Updated</Text>
                  <Text style={tw`text-xs text-orange-700 font-medium`}>Your project "Riverside Estate" remodeling was marked as ongoing by Sarah Chen.</Text>
                  <Text style={tw`text-[10px] font-bold text-orange-400 mt-2`}>10 MINS AGO</Text>
                </View>
              </View>
              
              <View style={tw`p-5 border border-zinc-100 bg-white rounded-[24px] shadow-sm flex-row gap-4`}>
                <View style={tw`w-10 h-10 rounded-full bg-zinc-100 items-center justify-center`}>
                  <MessageSquare size={18} color="#71717a" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-bold text-zinc-900 text-sm tracking-wide mb-1`}>New Message from Marcus</Text>
                  <Text style={tw`text-xs text-zinc-500 font-medium`}>"I've attached the final estimate for the brickwork we discussed."</Text>
                  <Text style={tw`text-[10px] font-bold text-zinc-400 mt-2`}>1 DAY AGO</Text>
                </View>
              </View>
            </View>
          </View>
      );
    }

    return (
      <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
        <View style={tw`px-6 pt-6 pb-24 flex-1`}>
          <View style={tw`flex-row items-center gap-4 mb-8`}>
            <TouchableOpacity
              onPress={() => setActivePage(null)}
              style={tw`w-12 h-12 rounded-full bg-white border border-zinc-200 shadow-sm items-center justify-center`}
            >
              <ChevronLeft size={24} color="#3f3f46" />
            </TouchableOpacity>
            <Text style={tw`text-3xl font-bold text-zinc-700 flex-1`} numberOfLines={1}>{activePage}</Text>
          </View>
          
          <ScrollView style={tw`bg-white rounded-[32px] p-6 shadow-sm border border-zinc-100 flex-1`} showsVerticalScrollIndicator={false}>
            {content}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  };

  if (activePage) {
    return renderSubPage();
  }

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-zinc-50 items-center justify-center`}>
         {/* Could put a loading spinner here if desired */}
      </SafeAreaView>
    );
  }

  if (!userInfo) {
    return (
      <View style={tw`flex-1 bg-white`}>
        {/* Decorative Background */}
        <View style={tw`absolute top-0 left-0 right-0 h-96 bg-orange-50 rounded-b-[64px]`} />
        
        <SafeAreaView style={tw`flex-1`}>
          <View style={tw`flex-1 items-center justify-center px-8 pt-12`}>
            <Animated.View entering={FadeInUp.duration(600).springify()} style={tw`items-center w-full`}>
              
              <View style={tw`w-32 h-32 bg-white rounded-full items-center justify-center mb-8 shadow-md border-4 border-orange-100`}>
                <UserIcon size={48} color="#cc4518" />
              </View>
              
              <Text style={tw`text-3xl font-black text-zinc-900 mb-4 text-center tracking-tight`}>
                Join Our Community
              </Text>
              
              <Text style={tw`text-base text-zinc-500 text-center mb-12 leading-relaxed px-4`}>
                Sign up to hire top-rated workers, manage your projects, and access exclusive tools designed for you.
              </Text>
              
              <View style={tw`w-full gap-4`}>
                <TouchableOpacity 
                  onPress={() => navigation.replace('Login')}
                  style={tw`w-full bg-[#cc4518] py-4 rounded-full shadow-md items-center flex-row justify-center gap-2`}
                >
                  <Text style={tw`text-white font-bold text-base tracking-wide`}>Log In or Sign Up</Text>
                  <ChevronRight size={20} color="#ffffff" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => navigation.goBack()}
                  style={tw`w-full bg-white border-2 border-zinc-100 py-4 rounded-full items-center`}
                >
                  <Text style={tw`text-zinc-600 font-bold text-base tracking-wide`}>Continue as Guest</Text>
                </TouchableOpacity>
              </View>

            </Animated.View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <ScrollView contentContainerStyle={tw`px-6 pt-6 pb-32`}>
        <Animated.View entering={FadeInUp.duration(400)} style={tw`flex-row justify-between items-end mb-8`}>
          <Text style={tw`text-4xl font-bold text-zinc-700`}>Profile</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={tw`bg-white rounded-[32px] p-6 shadow-sm border border-zinc-100 flex-row items-center gap-5 mb-8`}>
          <View style={tw`w-20 h-20 rounded-full bg-orange-100 items-center justify-center overflow-hidden border-4 border-white shadow-sm`}>
            <Image source={{ uri: userInfo?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80" }} style={tw`w-full h-full`} />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-xl font-bold text-zinc-900 tracking-wide`} numberOfLines={1}>{userInfo?.fullName || 'Loading...'}</Text>
            <Text style={tw`text-sm font-medium text-zinc-500 mt-0.5`} numberOfLines={1}>{userInfo?.email || userInfo?.phone || '...'}</Text>
            <View style={tw`flex-row items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 self-start mt-2`}>
              {getRoleIcon()}
              <Text style={tw`text-zinc-600 text-[10px] font-bold uppercase tracking-widest`}>{role.replace('_', ' ')}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={tw`bg-white rounded-[32px] p-3 shadow-sm border border-zinc-100 mb-6`}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => setActivePage(item.label)}
              style={tw`flex-row items-center justify-between p-4 ${index !== menuItems.length - 1 ? 'border-b border-zinc-100' : ''}`}
            >
              <View style={tw`flex-row items-center gap-4`}>
                <View style={tw`w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 items-center justify-center`}>
                    <item.icon size={22} color="#3f3f46" />
                </View>
                <Text style={tw`font-bold text-zinc-900 tracking-wide text-sm`}>{item.label}</Text>
              </View>
              <ChevronRight size={20} color="#d4d4d8" />
            </TouchableOpacity>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <TouchableOpacity
            onPress={handleLogout}
            style={tw`mt-4 flex-row items-center justify-center gap-2 bg-transparent border-2 border-orange-100 rounded-full py-4 shadow-sm`}
          >
            <LogOut size={16} color="#cc4518" />
            <Text style={tw`text-[#cc4518] font-bold text-xs uppercase tracking-widest`}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
