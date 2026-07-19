import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ChevronLeft, MapPin, Package, ShoppingCart, Star } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import apiClient from '../api/client';

export default function MaterialDetailsScreen({ route, navigation }: any) {
  const { material } = route.params;
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  const handleAddToCart = async (retailer: any, index: number) => {
    setAddingToCart(index);
    try {
      await apiClient.post('/cart/add', {
        materialId: material._id || material.id,
        name: material.name,
        price: retailer.price,
        quantity: 1,
        image: material.image,
        retailer: {
          name: retailer.name,
          distance: retailer.distance,
          stock: retailer.stock
        }
      });
      Alert.alert("Added to Cart 🛒", `${material.name} from ${retailer.name} was added to your cart.`);
    } catch (error: any) {      Alert.alert('Error', 'Could not add to cart. Please log in first.');
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`pb-8`} showsVerticalScrollIndicator={false} bounces={false}>
        {/* Header Image */}
        <View style={tw`relative w-full h-80 bg-zinc-100`}>
          <Image source={{ uri: material.image }} style={tw`w-full h-full object-cover`} />
          
          <SafeAreaView style={tw`absolute inset-0 flex-row justify-between px-6 pt-4`}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={tw`w-12 h-12 bg-white/90 rounded-full items-center justify-center shadow-sm`}
            >
              <ChevronLeft size={24} color="#18181b" />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Decorative bottom curve */}
          <View style={tw`absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-[32px]`} />
        </View>

        {/* Content */}
        <View style={tw`px-6 -mt-2`}>
          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <View style={tw`flex-row justify-between items-start mb-2`}>
              <View style={tw`flex-1 pr-4`}>
                <Text style={tw`text-3xl font-black text-zinc-900 tracking-tight mb-2`}>{material.name}</Text>
                <View style={tw`flex-row items-center gap-2 mb-4`}>
                  <View style={tw`bg-orange-100 px-3 py-1 rounded-full`}>
                    <Text style={tw`text-orange-700 text-[10px] font-bold uppercase tracking-widest`}>{material.category}</Text>
                  </View>
                  <View style={tw`flex-row items-center gap-1`}>
                    <Star size={14} color="#eab308" fill="#eab308" />
                    <Text style={tw`text-xs font-bold text-zinc-700`}>4.8 (120 reviews)</Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={tw`text-zinc-500 text-base leading-relaxed mb-8 font-medium`}>
              {material.description || `Premium quality ${material.name.toLowerCase()} sourced locally. Perfect for construction, landscaping, and remodeling projects. Available for immediate delivery or pickup from verified retailers.`}
            </Text>

            <Text style={tw`text-lg font-black text-zinc-900 mb-4`}>Available Retailers</Text>
          </Animated.View>

          {/* Retailers List */}
          <View style={tw`flex-col gap-4`}>
            {material.retailers?.map((retailer: any, idx: number) => (
              <Animated.View key={idx} entering={FadeInUp.delay(200 + idx * 100).duration(600).springify()}>
                <View style={tw`bg-zinc-50 p-5 rounded-3xl border border-zinc-100 flex-col gap-4`}>
                  
                  <View style={tw`flex-row justify-between items-start`}>
                    <View>
                      <Text style={tw`text-lg font-bold text-zinc-900 mb-1`}>{retailer.name}</Text>
                      <View style={tw`flex-row items-center gap-3`}>
                        <View style={tw`flex-row items-center gap-1`}>
                          <MapPin size={12} color="#71717a" />
                          <Text style={tw`text-xs font-bold text-zinc-500`}>{retailer.distance} km away</Text>
                        </View>
                        <View style={tw`flex-row items-center gap-1`}>
                          <Package size={12} color="#71717a" />
                          <Text style={tw`text-xs font-bold text-zinc-500`}>{retailer.stock} in stock</Text>
                        </View>
                      </View>
                    </View>
                    <View style={tw`items-end`}>
                      <Text style={tw`text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1`}>Price</Text>
                      <Text style={tw`text-xl font-black text-[#cc4518]`}>Rs {retailer.price}</Text>
                    </View>
                  </View>

                  <TouchableOpacity 
                    onPress={() => handleAddToCart(retailer, idx)}
                    disabled={addingToCart !== null}
                    style={tw`w-full bg-[#18181b] py-3.5 rounded-2xl flex-row items-center justify-center gap-2`}
                  >
                    {addingToCart === idx ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <ShoppingCart size={18} color="white" />
                        <Text style={tw`text-white font-bold text-sm tracking-wide`}>Add to Cart</Text>
                      </>
                    )}
                  </TouchableOpacity>

                </View>
              </Animated.View>
            ))}
            
            {(!material.retailers || material.retailers.length === 0) && (
              <View style={tw`p-6 bg-orange-50 border border-orange-100 rounded-3xl items-center`}>
                <Text style={tw`text-orange-800 font-bold text-center`}>Out of Stock</Text>
                <Text style={tw`text-orange-600 text-sm text-center mt-1`}>No retailers are currently selling this item.</Text>
              </View>
            )}
          </View>
          
        </View>
      </ScrollView>
    </View>
  );
}
