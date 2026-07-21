import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, TrendingUp, Users, DollarSign } from 'lucide-react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import tw from 'twrnc';
import apiClient from '../api/client';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticalReportsScreen({ navigation }: any) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-zinc-50 justify-center items-center`}>
        <ActivityIndicator size="large" color="#cc4518" />
      </SafeAreaView>
    );
  }

  const lineData = stats?.growthData?.map((item: any) => ({
    value: item.users || 0,
    label: item.name
  })) || [];

  const barData = stats?.transactionData?.map((item: any) => ({
    value: item.amount || 0,
    label: item.name
  })) || [];

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <View style={tw`flex-row items-center gap-4 px-6 pt-6 pb-4 bg-white border-b border-zinc-100`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`w-10 h-10 rounded-full bg-zinc-50 items-center justify-center`}>
          <ChevronLeft size={24} color="#3f3f46" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-zinc-800`}>Analytical Reports</Text>
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-6 pb-8 gap-6`}>
        {/* KPI Cards */}
        <View style={tw`flex-row gap-4`}>
          <View style={tw`flex-1 bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm`}>
            <View style={tw`w-8 h-8 rounded-full bg-orange-100 items-center justify-center mb-2`}>
              <Users size={16} color="#cc4518" />
            </View>
            <Text style={tw`text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1`}>Total Users</Text>
            <Text style={tw`text-2xl font-black text-zinc-900`}>{stats?.totals?.totalUsers || 0}</Text>
          </View>

          <View style={tw`flex-1 bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm`}>
            <View style={tw`w-8 h-8 rounded-full bg-green-100 items-center justify-center mb-2`}>
              <DollarSign size={16} color="#16a34a" />
            </View>
            <Text style={tw`text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1`}>Total Revenue</Text>
            <Text style={tw`text-2xl font-black text-zinc-900`}>${stats?.totals?.totalRevenue || 0}</Text>
          </View>
        </View>

        {/* User Growth Chart */}
        <View style={tw`bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm`}>
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <Text style={tw`text-lg font-bold text-zinc-800`}>User Growth</Text>
            <TrendingUp size={20} color="#a1a1aa" />
          </View>
          {lineData.length > 0 ? (
            <View style={tw`items-center`}>
              <LineChart
                data={lineData}
                width={screenWidth - 120}
                height={180}
                thickness={4}
                color="#cc4518"
                noOfSections={4}
                yAxisTextStyle={tw`text-xs text-zinc-400`}
                xAxisLabelTextStyle={tw`text-xs text-zinc-400`}
                dataPointsColor="#cc4518"
                hideRules
                initialSpacing={10}
              />
            </View>
          ) : (
            <Text style={tw`text-zinc-500 text-center py-4`}>No data available</Text>
          )}
        </View>

        {/* Revenue Chart */}
        <View style={tw`bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm`}>
          <Text style={tw`text-lg font-bold text-zinc-800 mb-6`}>Weekly Transaction Volume</Text>
          {barData.length > 0 ? (
            <View style={tw`items-center`}>
              <BarChart
                data={barData}
                width={screenWidth - 120}
                height={180}
                barWidth={22}
                spacing={14}
                roundedTop
                frontColor="#fdba74"
                yAxisTextStyle={tw`text-xs text-zinc-400`}
                xAxisLabelTextStyle={tw`text-xs text-zinc-400`}
                noOfSections={4}
                hideRules
                initialSpacing={10}
              />
            </View>
          ) : (
            <Text style={tw`text-zinc-500 text-center py-4`}>No data available</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
