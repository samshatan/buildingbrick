import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, LogBox } from 'react-native';

LogBox.ignoreLogs([
  'THREE.WebGLShadowMap: PCFSoftShadowMap has been deprecated',
  'THREE.Clock: This module has been deprecated',
  'Multiple instances of Three.js being imported'
]);
import Animated, { FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { RefreshCw, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Canvas } from '@react-three/fiber/native';
// Native version of OrbitControls/ContactShadows might have issues depending on drei version.
// Using basic lighting and manual rotation if OrbitControls fails.

import * as THREE from 'three';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function HouseModel({ brickColor, roofingColor }: { brickColor: string, roofingColor: string }) {
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: brickColor,
    roughness: 0.8,
  });

  const roofMaterial = new THREE.MeshStandardMaterial({
    color: roofingColor,
    roughness: 0.9,
  });

  return (
    <group position={[0, -1, 0]}>
      {/* Main Building Frame */}
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[4, 3, 3]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      
      {/* Front extension/Garage */}
      <mesh castShadow receiveShadow position={[1, 1, 1.5]}>
        <boxGeometry args={[2, 2, 2]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* Roof Main */}
      <mesh castShadow receiveShadow position={[0, 3.5, 0]}>
        <coneGeometry args={[3.2, 1.5, 4]} />
        <primitive object={roofMaterial} attach="material" />
      </mesh>
      <group position={[0, 3.5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <mesh castShadow receiveShadow>
          <coneGeometry args={[3.2, 1.5, 4]} />
          <primitive object={roofMaterial} attach="material" />
        </mesh>
      </group>

      {/* Door */}
      <mesh position={[-0.8, 0.8, 1.51]}>
        <planeGeometry args={[0.8, 1.6]} />
        <meshStandardMaterial color="#2d2d2d" />
      </mesh>

      {/* Garage Door */}
      <mesh position={[1, 0.9, 2.51]}>
        <planeGeometry args={[1.5, 1.8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Window */}
      <mesh position={[-1, 1.5, 1.51]}>
        <planeGeometry args={[0.8, 1]} />
        <meshStandardMaterial color="#1f4e79" roughness={0.1} />
      </mesh>

      {/* Grass/Base */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#4a7c59" />
      </mesh>
    </group>
  );
}

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

      {/* 3D Canvas Viewport */}
      <View style={{ height: SCREEN_HEIGHT * 0.55 }}>
        <Canvas shadows camera={{ position: [5, 4, 8], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight castShadow position={[5, 10, 5]} intensity={1.5} />
          
          <group>
            <HouseModel brickColor={brickStyle} roofingColor={roofStyle} />
          </group>
        </Canvas>
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
