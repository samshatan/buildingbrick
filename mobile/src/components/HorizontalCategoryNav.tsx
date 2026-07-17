import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';

const categories = [
  { id: "construction", name: "Construction", image: require('../../assets/construction_worker.png'), bgColor: 'bg-pink-100' },
  { id: "domestic", name: "Domestic", image: require('../../assets/domestic_worker.png'), bgColor: 'bg-blue-100' },
  { id: "utilities", name: "Utilities", image: require('../../assets/utilities_worker.png'), bgColor: 'bg-green-100' },
  { id: "interior", name: "Interior", image: require('../../assets/interior_worker.png'), bgColor: 'bg-purple-100' },
];

export default function HorizontalCategoryNav() {
  const navigation = useNavigation<any>();

  return (
    <View style={tw`w-full py-4 mt-2 mb-2`}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-6 gap-2`}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => navigation.navigate('Workers', { category: category.id })}
            style={tw`flex-col items-center w-[84px] mr-2`}
            activeOpacity={0.7}
          >
            <View style={tw`w-[80px] h-[86px] ${category.bgColor} rounded-t-full rounded-b-xl flex justify-end items-center overflow-hidden pt-2`}>
              <Image 
                source={category.image} 
                style={[tw`w-[95%] h-[95%]`, { resizeMode: 'contain' }]}
              />
            </View>
            <Text style={tw`text-xs font-bold text-zinc-700 mt-2 text-center tracking-wide`}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
