import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Settings, HelpCircle, Bell, ChevronRight, LogOut, Shield, Briefcase, User as UserIcon, Store, ChevronLeft, CheckCircle2, MessageSquare, AlertCircle, Package } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';
import { useTheme } from '../context/ThemeProvider';

type Role = 'user' | 'worker' | 'cafe_owner' | 'admin';

export default function ProfileScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [role, setRole] = useState<string>('hirer');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [workerProfile, setWorkerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userInfo');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUserInfo(parsed);
          setRole(parsed.userType?.toLowerCase() || 'hirer');
          
          if (parsed.userType?.toLowerCase() === 'worker') {
            try {
              const res = await apiClient.get(`/workers/user/${parsed.id || parsed._id}`);
              setWorkerProfile(res.data);
            } catch (err) {
              console.log('Error fetching worker profile', err);
            }
          }
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

  const handleOptInInsurance = async () => {
    if (!workerProfile) return;
    try {
      const res = await apiClient.post(`/workers/${workerProfile._id}/insurance`);
      setWorkerProfile(res.data);
      Alert.alert("Success", "You have successfully opted into the insurance program!");
    } catch (error) {
      console.log('Error opting in:', error);
      Alert.alert("Error", "Failed to opt into insurance. Please try again.");
    }
  };

  const getRoleIcon = () => {
    switch(role) {
      case 'admin': return <Shield size={16} color={theme.textSecondary} />;
      case 'cafe_owner': return <Store size={16} color={theme.textSecondary} />;
      case 'worker': return <Briefcase size={16} color={theme.textSecondary} />;
      default: return <UserIcon size={16} color={theme.textSecondary} />;
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
          { icon: Package, label: "My Material Orders" },
          ...common
        ];
      case 'worker':
        return [
          { icon: Briefcase, label: "My Jobs & Earnings" },
          { icon: Package, label: "My Material Orders" },
          ...common
        ];
      default:
        return [
          { icon: Briefcase, label: "My Job Postings" },
          { icon: Store, label: "Saved Workers" },
          { icon: Package, label: "My Material Orders" },
          ...common
        ];
    }
  };

  const menuItems = getRoleMenuItems();

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-[${theme.bg}] items-center justify-center`}>
      </SafeAreaView>
    );
  }

  if (!userInfo) {
    return (
      <View style={tw`flex-1 bg-[${theme.bg}]`}>
        <View style={tw`absolute top-0 left-0 right-0 h-96 bg-[#cc4518]/10 rounded-b-[64px]`} />
        
        <SafeAreaView style={tw`flex-1`}>
          <View style={tw`flex-1 items-center justify-center px-8 pt-12`}>
            <Animated.View entering={FadeInUp.duration(600).springify()} style={tw`items-center w-full`}>
              
              <View style={tw`w-32 h-32 bg-[${theme.card}] rounded-full items-center justify-center mb-8 shadow-md border-4 border-[#cc4518]/20`}>
                <UserIcon size={48} color="#cc4518" />
              </View>
              
              <Text style={tw`text-3xl font-black text-[${theme.text}] mb-4 text-center tracking-tight`}>
                Join Our Community
              </Text>
              
              <Text style={tw`text-base text-[${theme.textSecondary}] text-center mb-12 leading-relaxed px-4`}>
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
                  style={tw`w-full bg-[${theme.card}] border-2 border-[${theme.border}] py-4 rounded-full items-center`}
                >
                  <Text style={tw`text-[${theme.text}] font-bold text-base tracking-wide`}>Continue as Guest</Text>
                </TouchableOpacity>
              </View>

            </Animated.View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-[${theme.bg}]`}>
      <ScrollView contentContainerStyle={tw`px-6 pt-6 pb-8`}>
        <Animated.View entering={FadeInUp.duration(400)} style={tw`flex-row justify-between items-end mb-8`}>
          <Text style={tw`text-4xl font-bold text-[${theme.text}]`}>Profile</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={tw`bg-[${theme.card}] rounded-[32px] p-6 shadow-sm border border-[${theme.border}] flex-row items-center gap-5 mb-8`}>
          <View style={tw`w-20 h-20 rounded-full bg-[#cc4518]/10 items-center justify-center overflow-hidden border-4 border-[${theme.card}] shadow-sm`}>
            {userInfo?.avatarUrl ? (
              <Image source={{ uri: userInfo.avatarUrl }} style={tw`w-full h-full`} />
            ) : (
              <UserIcon size={32} color="#cc4518" />
            )}
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-xl font-bold text-[${theme.text}] tracking-wide`} numberOfLines={1}>{userInfo?.fullName || 'Loading...'}</Text>
            <Text style={tw`text-sm font-medium text-[${theme.textSecondary}] mt-0.5`} numberOfLines={1}>{userInfo?.email || userInfo?.phone || '...'}</Text>
            <View style={tw`flex-row items-center gap-1.5 px-2.5 py-1 rounded-md bg-[${theme.border}] self-start mt-2`}>
              {getRoleIcon()}
              <Text style={tw`text-[${theme.textSecondary}] text-xs font-bold uppercase tracking-widest`}>{role.replace('_', ' ')}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={tw`w-10 h-10 rounded-full bg-[${theme.bg}] border border-[${theme.border}] items-center justify-center shadow-sm`}>
            <Settings size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={tw`bg-[${theme.card}] rounded-[32px] p-3 shadow-sm border border-[${theme.border}] mb-6`}>
          {userInfo?.userType === 'WORKER' && userInfo?.registrationFeePaid === false && (
            <TouchableOpacity 
              onPress={async () => {
                try {
                  const res = await apiClient.post('/payment/phonepe/initiate', { 
                    workerProfileId: userInfo.id,
                    paymentType: 'REGISTRATION'
                  });
                  if (res.data && res.data.success) {
                    Alert.alert('Payment Initiated', 'In a real app, this would open ' + res.data.url);
                  }
                } catch (e) {
                  Alert.alert('Error', 'Failed to initiate payment.');
                }
              }}
              style={tw`bg-red-50 p-4 rounded-2xl border border-red-100 mb-4 flex-row items-center justify-between`}
            >
              <View style={tw`flex-1 mr-4`}>
                <Text style={tw`text-red-800 font-bold text-sm mb-0.5`}>Registration Fee Required</Text>
                <Text style={tw`text-red-600 text-xs font-medium leading-tight`}>Pay to unlock job applications.</Text>
              </View>
              <View style={tw`bg-red-600 px-4 py-2.5 rounded-xl shadow-sm`}>
                <Text style={tw`text-white font-bold text-xs uppercase tracking-widest`}>Pay Now</Text>
              </View>
            </TouchableOpacity>
          )}

          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => {
                if (item.label === 'My Jobs & Earnings' || item.label === 'My Job Postings') {
                  navigation.navigate('Projects');
                } else if (item.label === 'Notifications') {
                  navigation.navigate('Notifications');
                } else if (item.label === 'Saved Workers') {
                  navigation.navigate('Workers');
                } else if (item.label === 'My Material Orders') {
                  navigation.navigate('Orders');
                } else if (item.label === 'Help & Support') {
                  navigation.navigate('HelpSupport');
                } else if (item.label === 'Platform Moderation') {
                  navigation.navigate('PlatformModeration');
                } else if (item.label === 'Manage Roles') {
                  navigation.navigate('ManageRoles');
                } else if (item.label === 'My Business Profile') {
                  navigation.navigate('BusinessProfile');
                } else if (item.label === 'Settings') {
                  navigation.navigate('Settings');
                } else {
                  Alert.alert('Unavailable', 'This feature is not enabled in this build yet.');
                }
              }}
              style={tw`flex-row items-center justify-between p-4 ${index !== menuItems.length - 1 ? `border-b border-[${theme.border}]` : ''}`}
            >
              <View style={tw`flex-row items-center gap-4`}>
                <View style={tw`w-12 h-12 rounded-full bg-[${theme.bg}] border border-[${theme.border}] items-center justify-center`}>
                    <item.icon size={22} color={theme.text} />
                </View>
                <Text style={tw`font-bold text-[${theme.text}] tracking-wide text-sm`}>{item.label}</Text>
              </View>
              <ChevronRight size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {role === 'worker' && workerProfile && (
          <Animated.View entering={FadeInUp.delay(250).duration(400)} style={tw`bg-[${theme.card}] rounded-[32px] p-6 shadow-sm border ${workerProfile.insuranceStatus === 'ACTIVE' ? 'border-emerald-500' : 'border-[#cc4518]'} mb-6`}>
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <View style={tw`flex-row items-center gap-2`}>
                <Shield size={24} color={workerProfile.insuranceStatus === 'ACTIVE' ? '#10b981' : '#cc4518'} />
                <Text style={tw`text-lg font-bold text-[${theme.text}]`}>Insurance & Benefits</Text>
              </View>
              {workerProfile.insuranceStatus === 'ACTIVE' && (
                <View style={tw`bg-emerald-100 px-3 py-1 rounded-full`}>
                  <Text style={tw`text-emerald-700 text-xs font-bold uppercase`}>Active</Text>
                </View>
              )}
            </View>
            <Text style={tw`text-sm text-[${theme.textSecondary}] mb-6 leading-relaxed`}>
              {workerProfile.insuranceStatus === 'ACTIVE'
                ? "Your health and accident insurance coverage is currently active."
                : "Protect your future with our comprehensive worker insurance covering health and accidents."}
            </Text>
            {(!workerProfile.insuranceStatus || workerProfile.insuranceStatus === 'NOT_ENROLLED') && (
              <TouchableOpacity
                onPress={handleOptInInsurance}
                style={tw`w-full bg-[#cc4518] py-4 rounded-xl items-center shadow-sm`}
              >
                <Text style={tw`text-white font-bold text-sm tracking-wide`}>Opt-in Now</Text>
              </TouchableOpacity>
            )}
            {workerProfile.insuranceStatus === 'PENDING' && (
              <View style={tw`w-full bg-orange-100 py-4 rounded-xl items-center`}>
                <Text style={tw`text-orange-700 font-bold text-sm tracking-wide`}>Approval Pending</Text>
              </View>
            )}
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.delay(300).duration(400)}>
          <TouchableOpacity
            onPress={handleLogout}
            style={tw`mt-4 flex-row items-center justify-center gap-2 bg-transparent border-2 border-[#cc4518]/20 rounded-full py-4 shadow-sm`}
          >
            <LogOut size={16} color="#cc4518" />
            <Text style={tw`text-[#cc4518] font-bold text-xs uppercase tracking-widest`}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
