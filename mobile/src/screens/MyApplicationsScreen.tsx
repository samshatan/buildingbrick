import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Briefcase, Calendar, ChevronRight, Clock, CheckCircle2, XCircle, DollarSign } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';
import { useTheme } from '../context/ThemeProvider';

export default function MyApplicationsScreen() {
  const { theme } = useTheme();
  const COLORS = theme;
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        const userId = userInfo.id || userInfo._id;
        const response = await apiClient.get(`/applications/worker/${userId}`);
        if (response.data) {
          setApplications(Array.isArray(response.data) ? response.data : []);
        }
      }
    } catch (error) {    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-amber-600 bg-amber-50 border-amber-100';
    }
  };

  const renderApplicationCard = ({ item, index }: any) => {
    const jobTitle = item.requestId?.title || 'Unknown Job';
    const status = item.status || 'PENDING';
    const date = item.createdAt?.substring(0, 10) || 'Just now';
    
    return (
      <Animated.View entering={FadeInUp.delay(index * 100).duration(500).springify()}>
        <TouchableOpacity style={tw`bg-[${theme.card}] rounded-[24px] p-5 mb-4 shadow-sm border border-[${theme.border}]`}>
          <View style={tw`flex-row justify-between items-start mb-4`}>
            <View style={tw`flex-1 mr-4`}>
              <Text style={tw`text-lg font-bold text-[${theme.text}] mb-1`} numberOfLines={1}>{jobTitle}</Text>
              <View style={tw`flex-row items-center gap-1.5`}>
                <Calendar size={12} color="#71717a" />
                <Text style={tw`text-xs font-medium text-[${theme.textSecondary}]`}>{date}</Text>
              </View>
            </View>
            <View style={tw`px-3 py-1.5 rounded-full border flex-row items-center gap-1.5 ${getStatusColor(status)}`}>
              <Text style={tw`text-[10px] font-bold uppercase tracking-widest ${getStatusColor(status).split(' ')[0]}`}>
                {status}
              </Text>
            </View>
          </View>
          
          <View style={tw`flex-row justify-between items-center pt-4 border-t border-zinc-50`}>
            <View style={tw`flex-row items-center gap-2`}>
              <View style={tw`items-start`}>
                <Text style={tw`text-[10px] font-bold text-zinc-400 uppercase tracking-widest`}>Proposed Rate</Text>
                <Text style={tw`text-base font-bold text-[${theme.text}]`}>${item.proposedRate || 'N/A'}</Text>
              </View>
            </View>
            
            <View style={tw`flex-row items-center gap-2`}>
              <View style={tw`w-8 h-8 rounded-full bg-[${theme.bg}] items-center justify-center border border-[${theme.border}]`}>
                <ChevronRight size={16} color="#52525b" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[${theme.bg}]`}>
      <View style={tw`px-6 pt-6 pb-2`}>
        <Text style={tw`text-3xl font-bold text-[${theme.text}] mb-1`}>My Applications</Text>
        <Text style={tw`text-[${theme.textSecondary}] font-bold text-xs uppercase tracking-widest mb-6`}>Track your job proposals</Text>
      </View>
      
      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item, index) => item._id || item.id || index.toString()}
          renderItem={renderApplicationCard}
          contentContainerStyle={tw`px-6 pb-8 pt-2`}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Animated.View entering={FadeInUp.duration(500)} style={tw`flex-1 justify-center items-center py-20 px-6`}>
              <View style={tw`w-20 h-20 rounded-full bg-[${theme.border}] items-center justify-center mb-6`}>
                <Briefcase size={32} color="#a1a1aa" />
              </View>
              <Text style={tw`text-xl font-bold text-[${theme.text}] mb-2`}>No Applications Yet</Text>
              <Text style={tw`text-sm text-[${theme.textSecondary}] text-center leading-relaxed`}>
                You haven't applied to any public work requests yet.
              </Text>
            </Animated.View>
          }
        />
      )}
    </SafeAreaView>
  );
}
