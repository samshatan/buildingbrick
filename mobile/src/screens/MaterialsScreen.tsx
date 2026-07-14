import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Search, MapPin, ChevronLeft, ShoppingCart, Store, TrendingDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import apiClient from '../api/client';

export default function MaterialsScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Bricks", "Cement", "Sand", "Lumber"];

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await apiClient.get('/materials');
        if (response.data?.data) {
          setMaterials(response.data.data);
        }
      } catch (error) {
        console.log('Error fetching materials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          material.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCategory === "All") return matchesSearch;
    return matchesSearch && material.category === activeCategory;
  });

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <View style={tw`px-6 pt-6 pb-8 flex-1`}>
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(400)} style={tw`flex-row items-center justify-between mb-8`}>
          <Text style={tw`text-3xl font-bold text-zinc-700`}>Materials</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Cart')}
            style={tw`w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center bg-white`}
          >
            <ShoppingCart size={20} color="#71717a" />
          </TouchableOpacity>
        </Animated.View>

        {/* Search */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={tw`bg-white rounded-full p-2 border border-zinc-200 shadow-sm flex-row items-center mb-4`}>
          <View style={tw`w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center shrink-0`}>
            <Search size={18} color="#a1a1aa" />
          </View>
          <TextInput 
            placeholder="Search materials..." 
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={tw`flex-1 bg-transparent px-3 text-sm font-medium text-zinc-700`}
            placeholderTextColor="#a1a1aa"
          />
        </Animated.View>

        {/* Categories */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={tw`mb-2`}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-2 pb-4`}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setActiveCategory(category)}
                style={tw`px-4 py-2 rounded-full border border-zinc-200 ${
                  activeCategory === category 
                    ? "bg-zinc-800 border-zinc-800" 
                    : "bg-white"
                }`}
              >
                <Text style={tw`text-[10px] font-bold uppercase tracking-widest ${activeCategory === category ? 'text-white' : 'text-zinc-500'}`}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Materials List */}
        {loading ? (
          <View style={tw`flex-1 items-center justify-center`}>
            <ActivityIndicator size="large" color="#cc4518" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`flex-col gap-4 pb-12`}>
            {filteredMaterials.map((material, index) => {
              const sortedPrices = material.retailers.map((r: any) => r.price).sort((a: number, b: number) => a - b);
              const bestPrice = sortedPrices.length > 0 ? sortedPrices[0] : 0;
              return (
                <Animated.View key={material._id || material.id || index} entering={FadeInUp.delay(300 + index * 100).duration(500).springify()}>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('MaterialDetails', { material })}
                    style={tw`bg-white rounded-[24px] p-4 shadow-sm border border-zinc-100 flex-row gap-4`}
                  >
                  <View style={tw`w-24 h-24 rounded-[16px] overflow-hidden shrink-0`}>
                    <Image source={{ uri: material.image }} style={tw`w-full h-full`} />
                  </View>
                  <View style={tw`justify-center flex-1`}>
                    <Text style={tw`text-[9px] font-bold text-[#cc4518] uppercase tracking-widest mb-1`}>{material.category}</Text>
                    <Text style={tw`font-bold text-zinc-900 text-sm leading-tight mb-2`} numberOfLines={2}>{material.name}</Text>
                    
                    <View style={tw`flex-row items-center justify-between mt-auto`}>
                      <View style={tw`flex-col`}>
                        <Text style={tw`text-[10px] font-bold text-zinc-400 uppercase tracking-widest`}>From</Text>
                        <Text style={tw`font-bold text-zinc-900`}>${bestPrice.toFixed(2)}</Text>
                      </View>
                      <View style={tw`flex-row items-center gap-1.5 px-2.5 py-1.5 bg-zinc-50 border border-zinc-100 rounded-lg`}>
                        <Store size={12} color="#52525b" /> 
                        <Text style={tw`text-[10px] font-bold text-zinc-600`}>{material.retailers.length} Retailers</Text>
                      </View>
                    </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
            {filteredMaterials.length === 0 && (
              <Text style={tw`text-center text-zinc-500 text-sm mt-8`}>No materials found.</Text>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
