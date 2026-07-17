import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import tw from 'twrnc';
import { ArrowRight, Sparkles, Building, PaintRoller, ShoppingCart, Star, MapPin, Truck, Home, SearchCheck, Briefcase, Landmark, ShieldCheck } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [userName, setUserName] = useState('Builder');
  const [isWorker, setIsWorker] = useState(false);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);

  useEffect(() => {
    // Load User
    const loadUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem('userInfo');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.name) setUserName(user.name.split(' ')[0]);
          if (user.role === 'worker' || user.isWorker) setIsWorker(true);
        }
      } catch (e) {
        console.log('Error parsing user info', e);
      }
    };

    // Load Workers
    const fetchWorkers = async () => {
      try {
        const response = await apiClient.get('/workers');
        const workerData = response.data?.data || response.data?.workers || response.data || [];
        setWorkers(Array.isArray(workerData) ? workerData.slice(0, 3) : []);
      } catch (err) {
        console.log('Error fetching workers', err);
      } finally {
        setLoadingWorkers(false);
      }
    };

    loadUser();
    fetchWorkers();
  }, []);

  const services = [
    { title: "Workers", icon: Building, action: () => navigation.navigate('Workers') },
    { title: "Construction", icon: Home, action: () => navigation.navigate('FullHouseConstruction') },
    { title: "Estimates", icon: Sparkles, action: () => navigation.navigate('Studio') },
    { title: "Materials", icon: ShoppingCart, action: () => navigation.navigate('Materials') },
    { title: "Bulk Orders", icon: Truck, action: () => navigation.navigate('BulkOrders') },
    { title: "Inspection", icon: SearchCheck, action: () => navigation.navigate('ExpertInspection') },
    { title: "Posted Works", icon: Briefcase, action: () => navigation.navigate('Jobs') },
    { title: "Projects", icon: PaintRoller, action: () => navigation.navigate('Projects') },
  ];

  const workerPerks = [
    { title: "Loans", icon: Landmark, action: () => navigation.navigate('Loans') },
    { title: "Insurance", icon: ShieldCheck, action: () => navigation.navigate('Insurance') },
  ];

  return (
    <ScrollView style={tw`flex-1 bg-zinc-50`} contentContainerStyle={tw`pb-8`}>
      {/* Header section */}
      <Animated.View entering={FadeIn.duration(800)} style={[tw`relative w-full bg-zinc-900 overflow-hidden rounded-b-[32px]`, { height: 288 }]}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" }}
          style={[tw`absolute inset-0 w-full h-full`, { opacity: 0.6 }]}
        />
        <LinearGradient
          colors={['transparent', 'rgba(24, 24, 27, 0.4)', '#18181b']}
          style={tw`absolute inset-0`}
        />
        
        <View style={tw`absolute bottom-6 left-6 right-6`}>
          <Text style={tw`text-zinc-300 text-sm font-bold uppercase tracking-widest mb-1`}>
            Welcome back, {userName}
          </Text>
          <Text style={tw`text-3xl font-bold text-white mb-2 leading-tight`}>
            Build your dream{'\n'}brick home.
          </Text>
          <Text style={tw`text-zinc-100 text-xs font-medium uppercase tracking-widest mt-2`}>
            Riverside Estate Phase 2
          </Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={tw`px-6 relative -mt-4`}>
        {/* Call to action card */}
        <View style={tw`bg-white rounded-[32px] p-6 shadow-sm border border-zinc-100 flex-col gap-5`}>
          <View>
            <View style={tw`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 self-start mb-3`}>
              <Sparkles size={12} color="#cc4518" />
              <Text style={tw`text-[#cc4518] text-xs font-bold uppercase tracking-widest`}>New Feature</Text>
            </View>
            <Text style={tw`text-xl font-bold text-zinc-700`}>Visualize with 3D Studio</Text>
            <Text style={tw`text-sm text-zinc-500 mt-2 leading-tight`}>
              Design a custom brick facade in real-time. Change colors, styles, and trim instantly.
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Studio')}
            style={tw`bg-[#cc4518] rounded-full py-4 px-6 flex-row items-center justify-between shadow-lg`}
          >
            <Text style={tw`text-white font-bold text-xs uppercase tracking-widest`}>Open 3D Studio</Text>
            <ArrowRight size={18} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).duration(600).springify()} style={tw`px-6 mt-8`}>
        <Text style={tw`text-xl font-bold text-zinc-700 mb-4`}>Our Services</Text>
        <View style={tw`flex-row flex-wrap justify-between`}>
          {services.map((service) => (
            <TouchableOpacity 
              key={service.title}
              onPress={service.action}
              style={[tw`bg-white rounded-[24px] p-5 shadow-sm border border-zinc-100 flex-col gap-4 mb-4`, { width: (width - 48 - 16) / 2 }]}
            >
              <View style={tw`w-12 h-12 rounded-full flex items-center justify-center bg-zinc-50 border border-zinc-100`}>
                <service.icon size={22} color="#3f3f46" />
              </View>
              <Text style={tw`font-bold text-zinc-900 text-sm tracking-wide`}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Worker Perks Section */}
      {isWorker && (
        <Animated.View entering={FadeInUp.delay(500).duration(600).springify()} style={tw`px-6 mt-6`}>
          <Text style={tw`text-xl font-bold text-zinc-700 mb-4`}>Worker Perks</Text>
          <View style={tw`flex-row flex-wrap justify-between`}>
            {workerPerks.map((perk) => (
              <TouchableOpacity 
                key={perk.title}
                onPress={perk.action}
                style={[tw`bg-purple-50 rounded-[24px] p-5 shadow-sm border border-purple-100 flex-col gap-4 mb-4`, { width: (width - 48 - 16) / 2 }]}
              >
                <View style={tw`w-12 h-12 rounded-full flex items-center justify-center bg-white border border-purple-100 shadow-sm`}>
                  <perk.icon size={22} color="#9333ea" />
                </View>
                <Text style={tw`font-bold text-purple-900 text-sm tracking-wide`}>{perk.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Featured Experts Section */}
      <Animated.View entering={FadeInUp.delay(600).duration(600).springify()} style={tw`px-6 mt-6`}>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Text style={tw`text-xl font-bold text-zinc-700`}>Featured Experts</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Workers')}>
            <Text style={tw`text-[#cc4518] font-bold text-sm tracking-wide`}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`flex-col gap-4`}>
          {loadingWorkers ? (
            <View style={tw`flex justify-center items-center py-8`}>
              <ActivityIndicator color="#cc4518" size="large" />
            </View>
          ) : workers.length > 0 ? (
            workers.map((worker, index) => (
              <TouchableOpacity
                key={worker._id || index}
                onPress={() => navigation.navigate('WorkerDetails', { worker })}
                style={tw`bg-white rounded-[24px] p-4 shadow-sm border border-zinc-100 flex-row items-center gap-4`}
              >
                <View style={tw`w-14 h-14 rounded-full overflow-hidden bg-zinc-100`}>
                  {worker.photo || worker.image ? (
                    <Image source={{ uri: worker.photo || worker.image }} style={tw`w-full h-full`} />
                  ) : (
                    <View style={tw`w-full h-full flex justify-center items-center bg-orange-100`}>
                      <Text style={tw`text-[#cc4518] font-bold text-lg`}>{(worker.name || 'W')[0]}</Text>
                    </View>
                  )}
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-base font-bold text-zinc-900`} numberOfLines={1}>{worker.name || worker.displayName}</Text>
                  <Text style={tw`text-xs font-medium text-[#cc4518] mb-1`} numberOfLines={1}>{worker.jobTitle || worker.workerType || 'Professional'}</Text>
                  <View style={tw`flex-row items-center gap-2`}>
                    <View style={tw`flex-row items-center gap-1`}>
                      <Star size={10} color="#eab308" fill="#eab308" />
                      <Text style={tw`text-[10px] font-bold text-zinc-400 uppercase tracking-widest`}>{worker.rating || '4.5'}</Text>
                    </View>
                    <Text style={tw`text-[10px] font-bold text-zinc-400 uppercase tracking-widest`}>•</Text>
                    <Text style={tw`text-[10px] font-bold text-zinc-400 uppercase tracking-widest`}>${worker.pricePerHour || worker.dailyRate || worker.rate || '25'}/hr</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={tw`py-6 border border-dashed border-zinc-200 rounded-[24px] items-center`}>
              <Text style={tw`text-zinc-400 text-sm font-medium`}>No experts available right now.</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );
}
