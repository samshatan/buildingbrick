import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Search, UserMinus, Mail } from 'lucide-react-native';
import tw from 'twrnc';

const dummyUsersList = [
  { id: '1', name: 'Alice Smith', email: 'alice@example.com', joinDate: 'Jan 15, 2026', status: 'Active' },
  { id: '2', name: 'Bob Johnson', email: 'bob@example.com', joinDate: 'Feb 02, 2026', status: 'Active' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', joinDate: 'Mar 10, 2026', status: 'Banned' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', joinDate: 'Apr 22, 2026', status: 'Active' },
];

export default function UsersManagementScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(dummyUsersList);

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Banned' : 'Active';
    Alert.alert(`Confirm Action`, `Are you sure you want to change user status to ${newStatus}?`, [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Confirm", 
        onPress: () => {
          setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
        }
      }
    ]);
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <View style={tw`px-6 pt-6 pb-4 bg-white border-b border-zinc-100`}>
        <View style={tw`flex-row items-center gap-4 mb-4`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`w-10 h-10 rounded-full bg-zinc-50 items-center justify-center`}>
            <ChevronLeft size={24} color="#3f3f46" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold text-zinc-800`}>Users Management</Text>
        </View>

        <View style={tw`flex-row items-center bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3`}>
          <Search size={20} color="#a1a1aa" />
          <TextInput
            style={tw`flex-1 ml-2 text-zinc-800 font-medium`}
            placeholder="Search by name or email..."
            placeholderTextColor="#a1a1aa"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-6 pb-24 gap-4`}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={tw`bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm`}>
            <View style={tw`flex-row justify-between items-start mb-4`}>
              <View>
                <Text style={tw`text-lg font-bold text-zinc-900 mb-0.5`}>{user.name}</Text>
                <Text style={tw`text-sm text-zinc-500`}>{user.email}</Text>
                <Text style={tw`text-xs text-zinc-400 mt-1`}>Joined: {user.joinDate}</Text>
              </View>
              <View style={tw`px-3 py-1 rounded-full ${user.status === 'Active' ? 'bg-green-100' : 'bg-red-100'}`}>
                <Text style={tw`text-[10px] font-bold uppercase tracking-widest ${user.status === 'Active' ? 'text-green-700' : 'text-red-700'}`}>{user.status}</Text>
              </View>
            </View>

            <View style={tw`flex-row gap-2 pt-4 border-t border-zinc-50`}>
              <TouchableOpacity onPress={() => Alert.alert('Email', `Opening mail client for ${user.email}...`)} style={tw`flex-1 flex-row items-center justify-center gap-2 bg-zinc-50 py-2.5 rounded-xl`}>
                <Mail size={16} color="#52525b" />
                <Text style={tw`text-zinc-700 font-bold text-xs uppercase tracking-wide`}>Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleStatus(user.id, user.status)} style={tw`flex-1 flex-row items-center justify-center gap-2 ${user.status === 'Active' ? 'bg-red-50' : 'bg-green-50'} py-2.5 rounded-xl`}>
                <UserMinus size={16} color={user.status === 'Active' ? "#dc2626" : "#16a34a"} />
                <Text style={tw`font-bold text-xs uppercase tracking-wide ${user.status === 'Active' ? 'text-red-600' : 'text-green-600'}`}>
                  {user.status === 'Active' ? 'Ban User' : 'Unban'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
