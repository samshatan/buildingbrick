import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Image, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Search, Star, MapPin, Briefcase, Filter, BadgeCheck, Map as MapIcon, List as ListIcon } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';
import apiClient from '../api/client';
import { workerCategories, WorkerCategory } from '../data/marketplaceData';

export default function WorkersScreen({ navigation, route }: any) {
  const categoryId = route.params?.categoryId;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("All");
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Categories list including "All"
  const displayCategories = [{ id: "All", name: "All", icon: "🌐", types: [] }, ...workerCategories];
  
  // Find currently selected category
  const currentCategoryObj = workerCategories.find(c => c.id === activeCategory);
  const subCategories = currentCategoryObj ? ["All", ...currentCategoryObj.types] : [];

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await apiClient.get('/workers');
        const workerData = response.data?.data || response.data?.workers || response.data || [];
        setWorkers(Array.isArray(workerData) ? workerData : []);
      } catch (err) {      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  const filteredWorkers = workers.filter(worker => {
    const name = worker.name || worker.displayName || '';
    const role = worker.jobTitle || worker.workerType || '';
    const skills = worker.skills || [];
    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesCategory = true;
    if (activeCategory !== "All") {
      // If the worker has a categoryId, match on that. Otherwise, match on role.
      if (worker.categoryId) {
        matchesCategory = worker.categoryId === activeCategory;
      } else {
         const catTypes = currentCategoryObj?.types.map(t => t.toLowerCase()) || [];
         matchesCategory = catTypes.some(t => role.toLowerCase().includes(t));
      }
    }

    let matchesSub = true;
    if (activeSubCategory !== "All") {
      matchesSub = role.toLowerCase().includes(activeSubCategory.toLowerCase());
    }

    return matchesSearch && matchesCategory && matchesSub;
  });

  const getWorkerImage = (w: any) => w.photo || w.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80";

  const renderWorker = ({ item: worker, index }: any) => (
    <Animated.View entering={FadeInUp.delay(400 + index * 100).duration(500).springify()}>
      <View style={tw`bg-white rounded-[24px] p-5 shadow-sm border border-zinc-100 flex-col gap-4 mb-4 overflow-hidden relative`}>
        {worker.verified ? (
          <View style={tw`absolute top-0 right-0 bg-blue-50 px-3 py-1 rounded-bl-xl flex-row items-center gap-1 z-10`}>
            <BadgeCheck size={10} color="#2563eb" />
            <Text style={tw`text-blue-600 text-[9px] font-bold uppercase tracking-widest`}>Verified</Text>
          </View>
        ) : (
          <View style={tw`absolute top-0 right-0 bg-zinc-100 px-3 py-1 rounded-bl-xl z-10`}>
            <Text style={tw`text-zinc-500 text-[9px] font-bold uppercase tracking-widest`}>Pending</Text>
          </View>
        )}

        <View style={tw`flex-row items-start gap-4 mt-2`}>
          <View style={tw`w-16 h-16 rounded-full overflow-hidden bg-zinc-100 border-2 border-white shadow-sm`}>
            <Image source={{ uri: getWorkerImage(worker) }} style={tw`w-full h-full`} />
          </View>
          <View style={tw`flex-1`}>
            <View style={tw`flex-row justify-between items-start mb-1`}>
              <Text style={tw`text-lg font-bold text-zinc-900 pr-2 flex-1`} numberOfLines={1}>{worker.name || worker.displayName}</Text>
              {worker.rating > 0 && (
                <View style={tw`flex-row items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full`}>
                  <Star size={12} color="#eab308" fill="#eab308" />
                  <Text style={tw`text-yellow-600 text-[10px] font-bold`}>{worker.rating.toFixed(1)}</Text>
                </View>
              )}
            </View>
            <Text style={tw`text-sm font-medium text-[#cc4518] mb-2`}>{worker.jobTitle || worker.workerType || worker.role || 'Professional'}</Text>
            <View style={tw`flex-row items-center gap-3`}>
              <View style={tw`flex-row items-center gap-1`}>
                <MapPin size={12} color="#a1a1aa" />
                <Text style={tw`text-[11px] font-bold uppercase tracking-wider text-zinc-400`}>{worker.location || 'Local Area'}</Text>
              </View>
              <View style={tw`flex-row items-center gap-1`}>
                <Briefcase size={12} color="#a1a1aa" />
                <Text style={tw`text-[11px] font-bold uppercase tracking-wider text-zinc-400`}>{worker.jobsCompleted || 0} jobs</Text>
              </View>
            </View>
          </View>
        </View>

        {worker.skills && worker.skills.trim() !== '' && (
          <View style={tw`flex-row flex-wrap gap-2 pt-3 border-t border-zinc-50`}>
            {worker.skills.split(',').map((skill: string, idx: number) => (
              <View key={idx} style={tw`px-2.5 py-1 bg-zinc-50 rounded-md border border-zinc-100`}>
                <Text style={tw`text-zinc-600 text-[10px] font-bold uppercase tracking-wider`}>{skill.trim()}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={tw`flex-row items-center justify-between pt-2`}>
          <View style={tw`flex-row items-end`}>
            <Text style={tw`text-zinc-900 text-xl font-bold`}>${worker.pricePerHour || worker.rate || worker.dailyRate || 25}</Text>
            <Text style={tw`text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1 ml-1`}>/hr</Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.navigate('WorkerDetails', { worker })}
            disabled={worker.available === false}
            style={tw`px-6 py-2.5 rounded-full ${worker.available !== false ? 'bg-[#cc4518]' : 'bg-zinc-100'}`}
          >
            <Text style={tw`text-xs font-bold uppercase tracking-widest ${worker.available !== false ? 'text-white' : 'text-zinc-400'}`}>
              {worker.available !== false ? "Hire Now" : "Busy"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <View style={tw`px-6 pt-6 pb-2`}>
        <View style={tw`mb-6 flex-row justify-between items-start`}>
          <View>
            <Animated.Text entering={FadeInUp.duration(400)} style={tw`text-4xl font-bold text-zinc-700`}>Hire Experts</Animated.Text>
            <Animated.Text entering={FadeInUp.delay(100).duration(400)} style={tw`text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1`}>Build your dream team</Animated.Text>
          </View>
          <View style={tw`flex-row bg-white rounded-xl shadow-sm border border-zinc-200 p-1`}>
            <TouchableOpacity onPress={() => setViewMode('list')} style={tw`p-2 rounded-lg ${viewMode === 'list' ? 'bg-zinc-100' : 'bg-white'}`}>
              <ListIcon size={20} color={viewMode === 'list' ? '#18181b' : '#a1a1aa'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewMode('map')} style={tw`p-2 rounded-lg ${viewMode === 'map' ? 'bg-zinc-100' : 'bg-white'}`}>
              <MapIcon size={20} color={viewMode === 'map' ? '#18181b' : '#a1a1aa'} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Search Bar */}
        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={tw`bg-white rounded-full p-2 border border-zinc-200 shadow-sm flex-row items-center mb-6`}>
          <View style={tw`w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center shrink-0`}>
            <Search size={18} color="#a1a1aa" />
          </View>
          <TextInput 
            placeholder="Search by role or skill..." 
            placeholderTextColor="#a1a1aa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={tw`flex-1 px-3 text-sm text-zinc-700`}
          />
          <View style={tw`w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center`}>
            <Filter size={18} color="#cc4518" />
          </View>
        </Animated.View>

        {/* Categories (Grid/Card style like Flipkart) */}
        <Animated.View entering={FadeInUp.delay(300).duration(500)} style={tw`mb-2`}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-4 pb-2 px-1`}>
            {displayCategories.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => {
                    setActiveCategory(category.id);
                    setActiveSubCategory("All");
                  }}
                  style={tw`items-center`}
                >
                  <View style={tw`w-14 h-14 rounded-2xl flex items-center justify-center mb-1 ${isActive ? 'bg-orange-100 border-2 border-[#cc4518]' : 'bg-white border border-zinc-200 shadow-sm'}`}>
                    <Text style={tw`text-2xl`}>{category.icon}</Text>
                  </View>
                  <Text style={tw`text-[10px] font-bold text-center ${isActive ? 'text-[#cc4518]' : 'text-zinc-600'}`} numberOfLines={1}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Subcategories (Pills) */}
        {activeCategory !== "All" && subCategories.length > 0 && (
          <Animated.View entering={FadeInUp.duration(300)} style={tw`mb-4`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-2 pb-2`}>
              {subCategories.map((sub) => (
                <TouchableOpacity
                  key={sub}
                  onPress={() => setActiveSubCategory(sub)}
                  style={tw`px-3 py-1.5 rounded-full border ${activeSubCategory === sub ? 'bg-zinc-800 border-zinc-800' : 'bg-white border-zinc-200'}`}
                >
                  <Text style={tw`text-[10px] font-bold uppercase tracking-widest ${activeSubCategory === sub ? 'text-white' : 'text-zinc-500'}`}>
                    {sub}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>

      {/* Workers List / Map */}
      <View style={tw`flex-1 px-6`}>
        {loading ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator color="#cc4518" size="large" />
          </View>
        ) : viewMode === 'map' ? (
          <Animated.View entering={FadeInUp.duration(500)} style={tw`flex-1 mb-24 rounded-[32px] overflow-hidden border border-zinc-200 shadow-sm`}>
            <MapView 
              style={tw`flex-1`}
              initialRegion={{
                latitude: 40.7128,
                longitude: -74.0060,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
            >
              {filteredWorkers.map((worker: any, index: number) => {
                // Add some dummy coordinates around NYC for visual testing if missing
                const lat = worker.latitude || 40.7128 + (Math.random() - 0.5) * 0.05;
                const lng = worker.longitude || -74.0060 + (Math.random() - 0.5) * 0.05;
                
                return (
                  <Marker
                    key={worker._id || worker.id?.toString() || index.toString()}
                    coordinate={{ latitude: lat, longitude: lng }}
                    onCalloutPress={() => navigation.navigate('WorkerDetails', { worker })}
                  >
                    <View style={tw`w-12 h-12 rounded-full border-4 border-white shadow-md overflow-hidden bg-white items-center justify-center`}>
                      <Image source={{ uri: getWorkerImage(worker) }} style={tw`w-full h-full`} />
                    </View>
                  </Marker>
                );
              })}
            </MapView>
          </Animated.View>
        ) : (
          <FlatList
            data={filteredWorkers}
            keyExtractor={(item, index) => item._id || item.id?.toString() || index.toString()}
            renderItem={renderWorker}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`pb-8 pt-2`}
            ListEmptyComponent={
              <View style={tw`items-center py-12`}>
                <Text style={tw`text-zinc-500 text-sm font-medium`}>
                  No workers found {searchQuery ? `for "${searchQuery}"` : ""}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
