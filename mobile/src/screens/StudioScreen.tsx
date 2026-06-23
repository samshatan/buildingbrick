import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { RefreshCw, X, Box } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function StudioScreen({ navigation }: any) {
  const [brickStyle, setBrickStyle] = useState('#cc4518');
  const [roofStyle, setRoofStyle] = useState('#1a1a1a');
  const [sqft, setSqft] = useState(2500);

  useEffect(() => {
    const loadState = async () => {
      try {
        const b = await AsyncStorage.getItem('budgetEstimator_brickStyle');
        const r = await AsyncStorage.getItem('budgetEstimator_roofStyle');
        const s = await AsyncStorage.getItem('budgetEstimator_sqft');
        if (b) setBrickStyle(b);
        if (r) setRoofStyle(r);
        if (s) setSqft(parseInt(s, 10));
      } catch (e) {}
    };
    loadState();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('budgetEstimator_brickStyle', brickStyle);
    AsyncStorage.setItem('budgetEstimator_roofStyle', roofStyle);
    AsyncStorage.setItem('budgetEstimator_sqft', sqft.toString());
  }, [brickStyle, roofStyle, sqft]);

  const brickPresets = [
    { name: 'Classic Red', color: '#cc4518', price: 8 },
    { name: 'Weathered', color: '#965a3e', price: 10 },
    { name: 'Modern White', color: '#f0f0f0', price: 12 },
    { name: 'Charcoal', color: '#333333', price: 11 }
  ];

  const roofPresets = [
    { name: 'Slate Black', color: '#1a1a1a', price: 6 },
    { name: 'Navy Blue', color: '#1b2a47', price: 7 },
    { name: 'Terracotta', color: '#9e4624', price: 9 }
  ];

  const selectedBrick = brickPresets.find(p => p.color === brickStyle) || brickPresets[0];
  const selectedRoof = roofPresets.find(p => p.color === roofStyle) || roofPresets[0];

  const materialCost = (selectedBrick.price + selectedRoof.price) * sqft;
  const laborCost = 25 * sqft;
  const totalCost = materialCost + laborCost;

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <Animated.View entering={FadeInDown.duration(500)} style={tw`absolute top-12 left-6 right-6 z-10 flex-row justify-between items-center`}>
        <View style={tw`bg-white/80 px-6 py-3 rounded-full shadow-sm border border-zinc-100 flex-row items-center gap-4`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <X size={20} color="#18181b" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold text-zinc-900`}>3D Designer</Text>
        </View>
        <TouchableOpacity
          style={tw`bg-white/80 p-3.5 rounded-full shadow-sm border border-zinc-100`}
          onPress={() => {
            setBrickStyle('#cc4518');
            setRoofStyle('#1a1a1a');
          }}
        >
          <RefreshCw size={20} color="#3f3f46" />
        </TouchableOpacity>
      </Animated.View>

      {/* Mock 3D Viewport to prevent Expo Go Crashes */}
      <View style={[tw`items-center justify-center bg-zinc-200`, { height: SCREEN_HEIGHT * 0.55 }]}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' }} 
          style={tw`absolute inset-0 w-full h-full opacity-60`} 
        />
        <View style={tw`bg-white/90 p-4 rounded-2xl shadow-sm border border-zinc-100 items-center max-w-[80%]`}>
          <Box size={32} color="#cc4518" style={tw`mb-2`} />
          <Text style={tw`text-center font-bold text-zinc-900 mb-1`}>3D View Disabled</Text>
          <Text style={tw`text-center text-xs text-zinc-500`}>Live 3D rendering uses native code that crashes standard Expo Go. It is fully functional when you build the native app.</Text>
        </View>
        
        {/* Color Indicators overlaid on the image */}
        <View style={tw`absolute bottom-12 flex-row gap-4`}>
          <View style={tw`items-center`}>
            <View style={[tw`w-8 h-8 rounded-full border-2 border-white shadow-sm mb-1`, { backgroundColor: brickStyle }]} />
            <Text style={tw`text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-md`}>Wall</Text>
          </View>
          <View style={tw`items-center`}>
            <View style={[tw`w-8 h-8 rounded-full border-2 border-white shadow-sm mb-1`, { backgroundColor: roofStyle }]} />
            <Text style={tw`text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-md`}>Roof</Text>
          </View>
        </View>
      </View>

      {/* Controls Container */}
      <Animated.View entering={FadeInUp.duration(600).springify()} style={tw`flex-1 bg-white rounded-t-[40px] shadow-lg border-t border-zinc-100 -mt-6 px-6 pt-6`}>
        <View style={tw`w-16 h-1 bg-zinc-200 rounded-full mx-auto mb-6`} />
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-12`}>
          {/* Wall Material */}
          <Text style={tw`text-[10px] font-bold text-zinc-400 mb-4 uppercase tracking-widest`}>Wall Material</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mb-8`} contentContainerStyle={tw`gap-4 pr-6`}>
            {brickPresets.map((preset) => (
              <TouchableOpacity
                key={preset.name}
                onPress={() => setBrickStyle(preset.color)}
                style={tw`items-center gap-3 w-16`}
              >
                <View
                  style={[
                    tw`w-16 h-16 rounded-full shadow-sm border-4`,
                    brickStyle === preset.color ? tw`border-[#cc4518]` : tw`border-white`
                  ]}
                >
                  <View style={[tw`flex-1 rounded-full`, { backgroundColor: preset.color }]} />
                </View>
                <Text style={tw`text-[9px] font-bold uppercase tracking-widest text-zinc-500 text-center leading-tight`}>{preset.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Roofing Style */}
          <Text style={tw`text-[10px] font-bold text-zinc-400 mb-4 uppercase tracking-widest`}>Roofing Style</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mb-8`} contentContainerStyle={tw`gap-4 pr-6`}>
            {roofPresets.map((preset) => (
              <TouchableOpacity
                key={preset.name}
                onPress={() => setRoofStyle(preset.color)}
                style={tw`items-center gap-3 w-16`}
              >
                <View
                  style={[
                    tw`w-16 h-16 rounded-full shadow-sm border-4`,
                    roofStyle === preset.color ? tw`border-zinc-900` : tw`border-white`
                  ]}
                >
                  <View style={[tw`flex-1 rounded-full`, { backgroundColor: preset.color }]} />
                </View>
                <Text style={tw`text-[9px] font-bold uppercase tracking-widest text-zinc-500 text-center leading-tight`}>{preset.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Budget Estimator */}
          <View style={tw`pt-6 border-t border-zinc-100`}>
            <View style={tw`flex-row justify-between items-end mb-4`}>
              <Text style={tw`text-[10px] font-bold text-zinc-400 uppercase tracking-widest`}>Estimated Budget</Text>
              <Text style={tw`text-2xl font-bold text-[#cc4518]`}>
                ${totalCost.toLocaleString()}
              </Text>
            </View>
            
            <View style={tw`bg-zinc-50 rounded-[24px] p-6 border border-zinc-100 flex-col gap-6`}>
              <View>
                  <View style={tw`flex-row justify-between mb-2`}>
                    <Text style={tw`text-xs font-bold text-zinc-700 uppercase tracking-widest`}>Estimated Area</Text>
                    <Text style={tw`text-xs font-bold text-zinc-700 uppercase tracking-widest`}>{sqft} sq ft</Text>
                  </View>
                  <View style={tw`flex-row justify-between items-center bg-white rounded-full p-2 border border-zinc-200 mt-2`}>
                    <TouchableOpacity onPress={() => setSqft(Math.max(1000, sqft - 100))} style={tw`w-10 h-10 bg-zinc-100 rounded-full items-center justify-center`}>
                      <Text style={tw`text-lg font-bold text-zinc-500`}>-</Text>
                    </TouchableOpacity>
                    <Text style={tw`text-lg font-bold text-zinc-900`}>{sqft}</Text>
                    <TouchableOpacity onPress={() => setSqft(Math.min(6000, sqft + 100))} style={tw`w-10 h-10 bg-zinc-100 rounded-full items-center justify-center`}>
                      <Text style={tw`text-lg font-bold text-zinc-500`}>+</Text>
                    </TouchableOpacity>
                  </View>
              </View>
              
              <View style={tw`flex-col gap-3 pt-4 border-t border-zinc-200/50`}>
                  <View style={tw`flex-row justify-between`}>
                    <Text style={tw`text-xs text-zinc-500 font-medium`}>Material ({selectedBrick.name} & {selectedRoof.name})</Text>
                    <Text style={tw`text-xs text-zinc-900 font-bold`}>${materialCost.toLocaleString()}</Text>
                  </View>
                  <View style={tw`flex-row justify-between`}>
                    <Text style={tw`text-xs text-zinc-500 font-medium`}>Estimated Labor</Text>
                    <Text style={tw`text-xs text-zinc-900 font-bold`}>${laborCost.toLocaleString()}</Text>
                  </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
