import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Search, MapPin, ChevronLeft, ShoppingCart, Store, TrendingDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MATERIALS = [
  {
    id: 1,
    name: "Classic Red Brick (Pallet)",
    category: "Bricks",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=300&q=80",
    description: "Standard red clay bricks for general masonry. 500 count per pallet.",
    retailers: [
      { name: "HomeDepot", price: 355, stock: "Low Stock", distance: "2.1 mi" },
      { name: "BuildMart", price: 340, stock: "In Stock", distance: "4.5 mi" },
      { name: "Masonry Supply Co.", price: 325, stock: "In Stock", distance: "8.0 mi" }
    ]
  },
  {
    id: 2,
    name: "Portland Cement (50lb)",
    category: "Cement",
    image: "https://images.unsplash.com/photo-1621644782250-bcce4cc87c32?auto=format&fit=crop&w=300&q=80",
    description: "High quality portland cement for structural concrete.",
    retailers: [
      { name: "BuildMart", price: 18.50, stock: "In Stock", distance: "4.5 mi" },
      { name: "City Hardware", price: 21.00, stock: "In Stock", distance: "1.2 mi" },
      { name: "HomeDepot", price: 17.90, stock: "Out of Stock", distance: "2.1 mi" }
    ]
  },
  {
    id: 3,
    name: "Washed Concrete Sand (Ton)",
    category: "Sand",
    image: "https://images.unsplash.com/photo-1541604193435-22287d32c2c2?auto=format&fit=crop&w=300&q=80",
    description: "Clean washed sand for mixing and leveling.",
    retailers: [
      { name: "City Hardware", price: 45, stock: "In Stock", distance: "1.2 mi" },
      { name: "Masonry Supply Co.", price: 40, stock: "In Stock", distance: "8.0 mi" }
    ]
  }
];

export default function MaterialsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState<typeof MATERIALS[0] | null>(null);

  const categories = ["All", "Bricks", "Cement", "Sand", "Lumber"];

  const filteredMaterials = MATERIALS.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          material.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCategory === "All") return matchesSearch;
    return matchesSearch && material.category === activeCategory;
  });

  if (selectedMaterial) {
    const sortedRetailers = [...selectedMaterial.retailers].sort((a, b) => a.price - b.price);
    const bestPrice = sortedRetailers.length > 0 ? sortedRetailers[0].price : 0;

    return (
      <View style={tw`flex-1 bg-zinc-50 relative`}>
        <ScrollView contentContainerStyle={tw`pb-24`} showsVerticalScrollIndicator={false}>
          {/* Header Image */}
          <View style={[tw`relative bg-zinc-200`, { height: 224 }]}>
            <Image source={{ uri: selectedMaterial.image }} style={tw`w-full h-full`} />
            <LinearGradient
              colors={['transparent', 'rgba(24, 24, 27, 0.4)', '#18181b']}
              style={tw`absolute inset-0`}
            />
            
            <TouchableOpacity 
              onPress={() => setSelectedMaterial(null)}
              style={tw`absolute top-12 left-6 w-10 h-10 rounded-full bg-white/20 items-center justify-center`}
            >
              <ChevronLeft color="white" size={24} />
            </TouchableOpacity>

            <View style={tw`absolute bottom-6 left-6 right-6`}>
              <View style={tw`self-start px-2 py-1 bg-white/20 rounded-md mb-3`}>
                <Text style={tw`text-[10px] font-bold uppercase tracking-widest text-white`}>{selectedMaterial.category}</Text>
              </View>
              <Text style={tw`text-2xl font-bold text-white leading-tight`}>{selectedMaterial.name}</Text>
            </View>
          </View>

          <View style={tw`flex-1 px-6 pt-6 flex-col gap-6 -mt-4 bg-zinc-50 rounded-t-[24px]`}>
             {/* Description */}
            <View>
                <Text style={tw`text-sm font-bold text-zinc-900 tracking-wide mb-2`}>Description</Text>
                <Text style={tw`text-sm text-zinc-500 font-medium leading-relaxed`}>{selectedMaterial.description}</Text>
            </View>
            
             {/* Retailers */}
            <View>
                <View style={tw`flex-row items-center justify-between mb-4`}>
                  <Text style={tw`text-sm font-bold text-zinc-900 tracking-wide`}>Compare Retailers</Text>
                  <View style={tw`flex-row items-center gap-1`}>
                    <TrendingDown size={14} color="#10b981" />
                    <Text style={tw`text-[10px] font-bold text-emerald-500 uppercase tracking-widest`}>Best Price: ${bestPrice.toFixed(2)}</Text>
                  </View>
                </View>
                
                <View style={tw`flex-col gap-3`}>
                  {sortedRetailers.map((retailer, i) => (
                    <View key={i} style={tw`p-4 border rounded-[24px] bg-white flex-row items-center justify-between ${i === 0 ? 'border-[#cc4518] shadow-sm' : 'border-zinc-100 shadow-sm'}`}>
                      <View style={tw`flex-col gap-1`}>
                        <View style={tw`flex-row items-center gap-2`}>
                          <Store size={14} color={i === 0 ? "#cc4518" : "#a1a1aa"} />
                          <Text style={tw`font-bold text-zinc-900 text-sm`}>{retailer.name}</Text>
                        </View>
                        <View style={tw`flex-row items-center gap-2 mt-0.5`}>
                          <Text style={tw`text-[10px] font-bold uppercase tracking-widest ${retailer.stock === 'In Stock' ? 'text-emerald-500' : 'text-red-500'}`}>{retailer.stock}</Text>
                          <Text style={tw`text-[10px] font-bold text-zinc-400`}>•</Text>
                          <View style={tw`flex-row items-center gap-1`}>
                              <MapPin size={10} color="#a1a1aa" />
                              <Text style={tw`text-[10px] font-bold text-zinc-400 tracking-wide`}>{retailer.distance}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={tw`flex-col items-end gap-2`}>
                        <Text style={tw`font-bold text-lg text-zinc-900`}>${retailer.price.toFixed(2)}</Text>
                        <TouchableOpacity style={tw`px-4 py-1.5 rounded-full ${retailer.stock === 'In Stock' ? 'bg-zinc-900' : 'bg-zinc-100'}`} disabled={retailer.stock !== 'In Stock'}>
                          <Text style={tw`text-[10px] font-bold uppercase tracking-widest ${retailer.stock === 'In Stock' ? 'text-white' : 'text-zinc-400'}`}>Buy Now</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <View style={tw`px-6 pt-6 pb-24 flex-1`}>
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(400)} style={tw`flex-row items-center justify-between mb-8`}>
          <Text style={tw`text-3xl font-bold text-zinc-700`}>Materials</Text>
          <View style={tw`w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center bg-white`}>
            <ShoppingCart size={20} color="#71717a" />
          </View>
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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`flex-col gap-4 pb-12`}>
          {filteredMaterials.map((material, index) => {
            const sortedPrices = material.retailers.map(r => r.price).sort((a, b) => a - b);
            const bestPrice = sortedPrices.length > 0 ? sortedPrices[0] : 0;
            return (
              <Animated.View key={material.id} entering={FadeInUp.delay(300 + index * 100).duration(500).springify()}>
                <TouchableOpacity 
                  onPress={() => setSelectedMaterial(material)}
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
      </View>
    </SafeAreaView>
  );
}
