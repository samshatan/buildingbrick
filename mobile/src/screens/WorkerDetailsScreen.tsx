import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Dimensions, Alert } from 'react-native';
import tw from 'twrnc';
import { Star, ChevronLeft, BadgeCheck } from 'lucide-react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function WorkerDetailsScreen({ route, navigation }: any) {
  const { worker } = route.params;
  const [requestText, setRequestText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleHire = async () => {
    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      
      // Simulate Notification with an Alert since Expo Go doesn't support Push anymore
      Alert.alert(
        "Request Sent! 🏗️", 
        `Your hire request has been sent to ${worker.name || worker.displayName}. They will review it shortly.`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
      
    }, 1500);
  };

  const getWorkerImage = (w: any) => w.photo || w.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80";

  const ratingHistoryData = [
    { value: 4.8, label: 'Jan' },
    { value: 4.8, label: 'Feb' },
    { value: 4.9, label: 'Mar' },
    { value: 4.9, label: 'Apr' },
    { value: 4.8, label: 'May' },
    { value: 4.9, label: 'Jun' }
  ];

  const projectHistoryData = [
    { value: 4, label: 'Jan' },
    { value: 3, label: 'Feb' },
    { value: 6, label: 'Mar' },
    { value: 5, label: 'Apr' },
    { value: 7, label: 'May' },
    { value: 5, label: 'Jun' }
  ];

  return (
    <View style={tw`flex-1 bg-zinc-50 relative`}>
      <ScrollView contentContainerStyle={tw`pb-24`} showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <View style={[tw`relative bg-zinc-200`, { height: 300 }]}>
          <Image source={{ uri: getWorkerImage(worker) }} style={tw`w-full h-full`} />
          <LinearGradient
            colors={['transparent', 'rgba(24, 24, 27, 0.4)', '#18181b']}
            style={tw`absolute inset-0`}
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`absolute top-12 left-6 w-10 h-10 rounded-full bg-black/20 flex items-center justify-center z-10`}
          >
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Chat', { worker })}
            style={tw`absolute top-12 right-6 bg-white/20 px-4 py-2 rounded-full border border-white/30 backdrop-blur-md flex-row items-center gap-2 z-10`}
          >
            <Text style={tw`text-white text-xs font-bold uppercase tracking-widest`}>Message</Text>
          </TouchableOpacity>

          <View style={tw`absolute bottom-8 left-6 right-6`}>
            <View style={tw`flex-row items-center gap-2 mb-1`}>
              <Text style={tw`text-3xl font-bold text-white`}>{worker.name || worker.displayName}</Text>
              {worker.verified && <BadgeCheck size={24} color="#60a5fa" fill="rgba(59, 130, 246, 0.2)" />}
            </View>
            <Text style={tw`text-sm font-medium text-zinc-300`}>{worker.jobTitle || worker.workerType || worker.role || 'Professional'}</Text>
          </View>
        </View>

        <View style={tw`flex-1 px-6 pt-6 -mt-6 bg-zinc-50 rounded-t-[24px]`}>
          {/* Stats Row */}
          <View style={tw`flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 mb-6`}>
            <View style={tw`items-center flex-1 border-r border-zinc-100`}>
              <Text style={tw`text-xl font-bold text-zinc-900`}>${worker.pricePerHour || worker.rate || worker.dailyRate || 25}</Text>
              <Text style={tw`text-[10px] font-bold text-zinc-400 uppercase tracking-widest`}>Rate / hr</Text>
            </View>
            <View style={tw`items-center flex-1 border-r border-zinc-100`}>
              <View style={tw`flex-row items-center justify-center gap-1`}>
                <Text style={tw`text-xl font-bold text-zinc-900`}>{worker.rating || 4.5}</Text>
                <Star size={14} color="#eab308" fill="#eab308" />
              </View>
              <Text style={tw`text-[10px] font-bold text-zinc-400 uppercase tracking-widest`}>Rating</Text>
            </View>
            <View style={tw`items-center flex-1`}>
              <Text style={tw`text-xl font-bold text-zinc-900`}>{worker.reviews || worker.reviewCount || 12}</Text>
              <Text style={tw`text-[10px] font-bold text-zinc-400 uppercase tracking-widest`}>Reviews</Text>
            </View>
          </View>

          {/* Skills */}
          <Text style={tw`text-sm font-bold text-zinc-900 tracking-wide mb-3`}>Skills</Text>
          <View style={tw`flex-row flex-wrap gap-2 mb-6`}>
            {(worker.skills || ['General Labor', 'Site Cleanup', 'Transport']).map((skill: string) => (
              <View key={skill} style={tw`px-3 py-1.5 bg-white rounded-lg border border-zinc-200`}>
                <Text style={tw`text-zinc-700 text-xs font-bold uppercase tracking-wider`}>{skill}</Text>
              </View>
            ))}
          </View>

          {/* Charts */}
          <Text style={tw`text-sm font-bold text-zinc-900 tracking-wide mb-3`}>Rating Trends</Text>
          <View style={tw`w-full bg-white p-4 rounded-2xl border border-zinc-200 mb-6 items-center`}>
            <LineChart
              data={ratingHistoryData}
              width={width - 80}
              height={120}
              color="#cc4518"
              thickness={3}
              dataPointsColor="#cc4518"
              dataPointsRadius={4}
              hideRules
              hideYAxisText
              xAxisColor="#e4e4e7"
              yAxisColor="transparent"
              initialSpacing={20}
              spacing={(width - 120) / 5}
              xAxisLabelTextStyle={{ color: '#71717a', fontSize: 10 }}
            />
          </View>

          <Text style={tw`text-sm font-bold text-zinc-900 tracking-wide mb-3`}>Projects Completed</Text>
          <View style={tw`w-full bg-white p-4 rounded-2xl border border-zinc-200 mb-6 items-center`}>
            <BarChart
              data={projectHistoryData}
              width={width - 80}
              height={120}
              frontColor="#18181b"
              barBorderRadius={4}
              hideRules
              hideYAxisText
              xAxisColor="#e4e4e7"
              yAxisColor="transparent"
              initialSpacing={20}
              spacing={(width - 120) / 6}
              barWidth={20}
              xAxisLabelTextStyle={{ color: '#71717a', fontSize: 10 }}
            />
          </View>

          {/* Booking Form */}
          <Text style={tw`text-sm font-bold text-zinc-900 tracking-wide mb-3`}>Project Details</Text>
          <TextInput
            placeholder="Describe the job and your requirements..."
            placeholderTextColor="#a1a1aa"
            multiline
            numberOfLines={4}
            value={requestText}
            onChangeText={setRequestText}
            style={[tw`w-full px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-medium text-zinc-900 mb-6`, { height: 120, textAlignVertical: 'top' }]}
          />
        </View>
      </ScrollView>

      {/* Floating Hire Button */}
      <View style={tw`absolute bottom-0 left-0 right-0 p-6 bg-zinc-50/90`}>
        <TouchableOpacity 
          onPress={handleHire}
          disabled={isSending}
          style={tw`w-full py-4 bg-[#cc4518] rounded-full items-center shadow-lg ${isSending ? 'opacity-70' : ''}`}
        >
          <Text style={tw`text-white font-bold text-xs uppercase tracking-widest`}>
            {isSending ? "Sending..." : "Send Request to Hire"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
