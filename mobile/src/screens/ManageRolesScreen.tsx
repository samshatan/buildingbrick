import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Search, Shield, User, Store, Briefcase } from 'lucide-react-native';
import tw from 'twrnc';

type UserRole = 'user' | 'worker' | 'cafe_owner' | 'admin';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

const dummyUsers: UserData[] = [
  { id: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'admin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  { id: '2', name: 'Bob Johnson', email: 'bob@example.com', role: 'cafe_owner', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'worker', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&q=80' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'user', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' },
];

export default function ManageRolesScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserData[]>(dummyUsers);

  const getRoleIcon = (role: UserRole) => {
    switch(role) {
      case 'admin': return <Shield size={14} color="#cc4518" />;
      case 'cafe_owner': return <Store size={14} color="#cc4518" />;
      case 'worker': return <Briefcase size={14} color="#cc4518" />;
      default: return <User size={14} color="#a1a1aa" />;
    }
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    Alert.alert("Confirm Role Change", `Change this user's role to ${newRole}?`, [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Confirm", 
        onPress: () => {
          setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
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
          <Text style={tw`text-xl font-bold text-zinc-800`}>Manage Roles</Text>
        </View>

        <View style={tw`flex-row items-center bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3`}>
          <Search size={20} color="#a1a1aa" />
          <TextInput
            style={tw`flex-1 ml-2 text-zinc-800 font-medium`}
            placeholder="Search users..."
            placeholderTextColor="#a1a1aa"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-6 pb-24 gap-4`}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={tw`bg-white rounded-2xl p-4 border border-zinc-100 shadow-sm flex-row items-center gap-4`}>
            <Image source={{ uri: user.avatar }} style={tw`w-14 h-14 rounded-full bg-zinc-200`} />
            
            <View style={tw`flex-1`}>
              <Text style={tw`font-bold text-zinc-900 text-base mb-0.5`}>{user.name}</Text>
              <Text style={tw`text-xs text-zinc-500 mb-2`}>{user.email}</Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`flex-row`}>
                {(['user', 'worker', 'cafe_owner', 'admin'] as UserRole[]).map(role => (
                  <TouchableOpacity
                    key={role}
                    onPress={() => handleRoleChange(user.id, role)}
                    style={tw`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full mr-2 border ${user.role === role ? 'border-orange-200 bg-orange-50' : 'border-zinc-200 bg-white'}`}
                  >
                    {user.role === role && getRoleIcon(role)}
                    <Text style={tw`text-[10px] font-bold uppercase tracking-wider ${user.role === role ? 'text-[#cc4518]' : 'text-zinc-500'}`}>
                      {role.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        ))}
        {filteredUsers.length === 0 && (
          <Text style={tw`text-center text-zinc-500 mt-10`}>No users found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
