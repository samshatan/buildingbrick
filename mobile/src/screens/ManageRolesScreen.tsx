import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Search, Shield, User, Store, Briefcase } from 'lucide-react-native';
import tw from 'twrnc';
import apiClient from '../api/client';

type UserRole = 'user' | 'worker' | 'cafe_owner' | 'admin';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export default function ManageRolesScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const normalizeUser = (user: any): UserData => {
    const id = String(user.id || user._id || '');
    const displayName = user.name || user.fullName || 'Unknown User';
    const avatarName = encodeURIComponent(displayName);
    const role: UserRole = user.accountType === 'cafe'
      ? 'cafe_owner'
      : user.accountType === 'hirer'
        ? 'user'
        : user.accountType || 'user';

    return {
      id,
      name: displayName,
      email: user.email || user.phone || 'No contact info',
      role,
      avatar: user.avatarUrl || `https://ui-avatars.com/api/?name=${avatarName}&background=cc4518&color=fff`,
    };
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await apiClient.get('/admin/users');
        const data = Array.isArray(response.data) ? response.data : response.data?.users || [];
        setUsers(data.map(normalizeUser));
      } catch (error: any) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

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
        onPress: async () => {
          try {
            setSavingId(userId);
            const apiRole = newRole === 'cafe_owner' ? 'cafe' : newRole === 'user' ? 'hirer' : newRole;
            await apiClient.put(`/admin/users/${userId}/role`, { role: apiRole });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
          } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update role.');
          } finally {
            setSavingId(null);
          }
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

      {loading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color="#cc4518" />
        </View>
      ) : (
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-6 pb-8 gap-4`}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={tw`bg-white rounded-2xl p-4 border border-zinc-100 shadow-sm flex-row items-center gap-4`}>
            <Image source={{ uri: user.avatar }} style={tw`w-14 h-14 rounded-full bg-zinc-200`} />
            
            <View style={tw`flex-1`}>
              <Text style={tw`font-bold text-zinc-900 text-base mb-0.5`}>{user.name}</Text>
              <Text style={tw`text-xs text-zinc-500 mb-2`}>{user.email}</Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`flex-row`}>
                {(['user', 'worker', 'cafe_owner', 'admin'] as UserRole[]).map(role => (
                  <TouchableOpacity
                    disabled={savingId === user.id}
                    key={role}
                    onPress={() => handleRoleChange(user.id, role)}
                    style={tw`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full mr-2 border ${user.role === role ? 'border-orange-200 bg-orange-50' : 'border-zinc-200 bg-white'}`}
                  >
                    {user.role === role && getRoleIcon(role)}
                    <Text style={tw`text-[10px] font-bold uppercase tracking-wider ${user.role === role ? 'text-[#cc4518]' : 'text-zinc-500'}`}>
                      {role === 'user' ? 'hirer' : role.replace('_', ' ')}
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
      )}
    </SafeAreaView>
  );
}
