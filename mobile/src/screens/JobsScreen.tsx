import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Briefcase, Calendar, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react-native';
import apiClient from '../api/client';
import { useTheme } from '../context/ThemeProvider';

export default function JobsScreen() {
  const { theme } = useTheme();
  const COLORS = theme;
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await apiClient.get('/jobs');
      if (response.data) {
        const jobData = response.data.data || response.data.jobs || response.data;
        setJobs(Array.isArray(jobData) ? jobData : []);
      }
    } catch (error) {
      console.log('Error fetching jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return <CheckCircle2 size={14} color="#2563eb" />;
      case 'completed': return <CheckCircle2 size={14} color={COLORS.success} />;
      case 'cancelled': return <XCircle size={14} color={COLORS.error} />;
      default: return <Clock size={14} color={COLORS.warning} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'completed': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-amber-600 bg-amber-50 border-amber-100';
    }
  };

  const renderJobCard = ({ item, index }: any) => {
    const jobTitle = item.title || item.requestId?.title || `Job Request #${item._id?.substring(0,5) || index + 1}`;
    const status = item.status || 'Pending';
    const date = item.date || item.createdAt?.substring(0, 10) || 'Just now';
    const workerName = item.worker?.name || item.workerId?.name || item.workerName || 'Worker';
    
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
              {getStatusIcon(status)}
              <Text style={tw`text-[10px] font-bold uppercase tracking-widest ${getStatusColor(status).split(' ')[0]}`}>
                {status}
              </Text>
            </View>
          </View>
          
          <View style={tw`flex-row justify-between items-center pt-4 border-t border-zinc-50`}>
            <View style={tw`flex-row items-center gap-2`}>
              <View style={tw`w-8 h-8 rounded-full bg-orange-50 items-center justify-center`}>
                <Text style={tw`text-[${COLORS.primary}] font-bold text-xs`}>{workerName[0]}</Text>
              </View>
              <View>
                <Text style={tw`text-[10px] font-bold text-zinc-400 uppercase tracking-widest`}>Assigned To</Text>
                <Text style={tw`text-sm font-bold text-zinc-700`}>{workerName}</Text>
              </View>
            </View>
            
            <View style={tw`flex-row items-center gap-2`}>
              <View style={tw`items-end mr-1`}>
                <Text style={tw`text-[10px] font-bold text-zinc-400 uppercase tracking-widest`}>Total</Text>
                <Text style={tw`text-base font-bold text-[${theme.text}]`}>${item.amount || item.agreedRate || item.totalPrice || '---'}</Text>
              </View>
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
        <Text style={tw`text-3xl font-bold text-[${theme.text}] mb-1`}>My Jobs</Text>
        <Text style={tw`text-[${theme.textSecondary}] font-bold text-xs uppercase tracking-widest mb-6`}>Manage your service requests</Text>
      </View>
      
      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item, index) => item._id || item.id || index.toString()}
          renderItem={renderJobCard}
          contentContainerStyle={tw`px-6 pb-24 pt-2`}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Animated.View entering={FadeInUp.duration(500)} style={tw`flex-1 justify-center items-center py-20 px-6`}>
              <View style={tw`w-20 h-20 rounded-full bg-[${theme.border}] items-center justify-center mb-6`}>
                <Briefcase size={32} color="#a1a1aa" />
              </View>
              <Text style={tw`text-xl font-bold text-[${theme.text}] mb-2`}>No Jobs Yet</Text>
              <Text style={tw`text-sm text-[${theme.textSecondary}] text-center leading-relaxed`}>
                You haven't booked any workers or services yet. Once you do, they will appear here.
              </Text>
            </Animated.View>
          }
        />
      )}
    </SafeAreaView>
  );
}
