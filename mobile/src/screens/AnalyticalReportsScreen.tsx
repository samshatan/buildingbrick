import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, TrendingUp, Users, DollarSign } from 'lucide-react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import tw from 'twrnc';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticalReportsScreen({ navigation }: any) {
  const lineData = [
    { value: 15, label: 'Jan' },
    { value: 30, label: 'Feb' },
    { value: 26, label: 'Mar' },
    { value: 40, label: 'Apr' },
    { value: 55, label: 'May' },
    { value: 60, label: 'Jun' },
  ];

  const barData = [
    { value: 2500, label: 'Mon' },
    { value: 3000, label: 'Tue' },
    { value: 2000, label: 'Wed' },
    { value: 4500, label: 'Thu' },
    { value: 6000, label: 'Fri' },
    { value: 5500, label: 'Sat' },
    { value: 4000, label: 'Sun' },
  ];

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
            <Text style={tw`text-2xl font-black text-zinc-900`}>12.4k</Text>
            <Text style={tw`text-[10px] font-bold text-green-600 mt-1`}>+14% THIS MONTH</Text>
          </View>

          <View style={tw`flex-1 bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm`}>
            <View style={tw`w-8 h-8 rounded-full bg-green-100 items-center justify-center mb-2`}>
              <DollarSign size={16} color="#16a34a" />
            </View>
            <Text style={tw`text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1`}>Revenue</Text>
            <Text style={tw`text-2xl font-black text-zinc-900`}>$84k</Text>
            <Text style={tw`text-[10px] font-bold text-green-600 mt-1`}>+8% THIS MONTH</Text>
          </View>
        </View>

        {/* User Growth Chart */}
        <View style={tw`bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm`}>
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <Text style={tw`text-lg font-bold text-zinc-800`}>User Growth</Text>
            <TrendingUp size={20} color="#a1a1aa" />
          </View>
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
        </View>

        {/* Revenue Chart */}
        <View style={tw`bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm`}>
          <Text style={tw`text-lg font-bold text-zinc-800 mb-6`}>Weekly Transaction Volume</Text>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
