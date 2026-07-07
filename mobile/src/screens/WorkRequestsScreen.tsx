import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Calendar, MapPin, CheckCircle2, XCircle, Inbox } from 'lucide-react-native';
import apiClient from '../api/client';
import { useTheme } from '../context/ThemeProvider';

export default function WorkRequestsScreen() {
  const { theme } = useTheme();
  const COLORS = theme;
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Dispute modal state
  const [disputeModalVisible, setDisputeModalVisible] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeDescription, setDisputeDescription] = useState("");
  const [selectedRequestForDispute, setSelectedRequestForDispute] = useState<any>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await apiClient.get('/requests');
      if (response.data) {
        setRequests(response.data.data || response.data);
      }
    } catch (error) {
      console.log('Error fetching requests', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'accept' | 'decline') => {
    try {
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo.userType === 'WORKER' && userInfo.registrationFeePaid === false) {
          Alert.alert(
            'Registration Fee Required',
            'You must pay the registration fee before accepting or declining jobs. Please visit your Profile to pay.'
          );
          return;
        }
      }

      setActionLoading(id);
      await apiClient.post(`/requests/${id}/${action}`);
      Alert.alert('Success', `You have ${action}ed the request.`);
      fetchRequests();
    } catch (error) {
      console.log(`Error ${action}ing request`, error);
      Alert.alert('Error', `Failed to ${action} the request. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenDispute = (req: any) => {
    setSelectedRequestForDispute(req);
    setDisputeReason("");
    setDisputeDescription("");
    setDisputeModalVisible(true);
  };

  const submitDispute = async () => {
    if (!disputeReason || !disputeDescription) {
      Alert.alert('Error', 'Please provide both a reason and a description.');
      return;
    }

    try {
      setActionLoading('dispute');
      await apiClient.post('/disputes', {
        requestType: 'WorkRequest', // Or DirectRequest based on your data, assuming WorkRequest for now
        requestId: selectedRequestForDispute._id || selectedRequestForDispute.id,
        reason: disputeReason,
        description: disputeDescription
      });
      Alert.alert('Success', 'Dispute submitted successfully.');
      setDisputeModalVisible(false);
    } catch (error) {
      console.log('Error submitting dispute', error);
      Alert.alert('Error', 'Failed to submit dispute. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const renderRequestCard = ({ item, index }: any) => {
    const title = item.title || item.description || `New Request #${item._id?.substring(0,5) || index + 1}`;
    const date = item.date || item.createdAt?.substring(0, 10) || 'Pending Date';
    const location = item.address || item.location || 'Client Location';
    const clientName = item.client?.name || item.clientName || item.hirerUserId?.name || 'Anonymous Client';
    const isActionLoading = actionLoading === (item._id || item.id);

    return (
      <Animated.View entering={FadeInUp.delay(index * 100).duration(500).springify()}>
        <View style={tw`bg-[] rounded-[24px] p-5 mb-4 shadow-sm border border-[] overflow-hidden`}>
          <View style={tw`absolute top-0 left-0 bottom-0 w-1.5 bg-[#cc4518]`} />
          <View style={tw`flex-row justify-between items-start mb-4 pl-2`}>
            <View style={tw`flex-1 mr-4`}>
              <Text style={tw`text-lg font-bold text-[] mb-1`} numberOfLines={1}>{title}</Text>
              <Text style={tw`text-xs font-medium text-[]`}>From: {clientName}</Text>
            </View>
            <View style={tw`flex-row items-center gap-2`}>
              {item.buildingType && (
                <View style={tw`px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100`}>
                  <Text style={tw`text-[10px] font-bold uppercase tracking-widest text-blue-700`}>{item.buildingType}</Text>
                </View>
              )}
              <View style={tw`px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100`}>
                <Text style={tw`text-[10px] font-bold uppercase tracking-widest text-[#cc4518]`}>NEW</Text>
              </View>
            </View>
          </View>

          <View style={tw`bg-[] rounded-xl p-3 mb-4 pl-4`}>
            <View style={tw`flex-row items-center gap-2 mb-2`}>
              <Calendar size={14} color="#71717a" />
              <Text style={tw`text-sm font-medium text-[]`}>{date}</Text>
            </View>
            <View style={tw`flex-row items-center gap-2`}>
              <MapPin size={14} color="#71717a" />
              <Text style={tw`text-sm font-medium text-[]`}>{location}</Text>
            </View>
          </View>

          <View style={tw`flex-row justify-between gap-3 pl-2`}>
            {item.status === 'ACCEPTED' || item.status === 'CLOSED' ? (
               <TouchableOpacity 
                 style={tw`flex-1 bg-red-50 py-3 rounded-xl border border-red-100 flex-row justify-center items-center gap-2`}
                 onPress={() => handleOpenDispute(item)}
               >
                 <XCircle size={16} color={COLORS.error} />
                 <Text style={tw`text-red-600 font-bold text-sm`}>Report Issue</Text>
               </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity 
                  style={tw`flex-1 bg-red-50 py-3 rounded-xl border border-red-100 flex-row justify-center items-center gap-2`}
                  onPress={() => handleAction(item._id || item.id, 'decline')}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? <ActivityIndicator size="small" color={COLORS.error} /> : (
                    <>
                      <XCircle size={16} color={COLORS.error} />
                      <Text style={tw`text-red-600 font-bold text-sm`}>Decline</Text>
                    </>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={tw`flex-1 bg-emerald-600 py-3 rounded-xl flex-row justify-center items-center gap-2`}
                  onPress={() => handleAction(item._id || item.id, 'accept')}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? <ActivityIndicator size="small" color="white" /> : (
                    <>
                      <CheckCircle2 size={16} color="white" />
                      <Text style={tw`text-white font-bold text-sm`}>Accept</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[]`}>
      <View style={tw`px-6 pt-6 pb-2`}>
        <Text style={tw`text-3xl font-bold text-[] mb-1`}>Work Requests</Text>
        <Text style={tw`text-[] font-bold text-xs uppercase tracking-widest mb-6`}>Review incoming job offers</Text>
      </View>
      
      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item, index) => item._id || item.id || index.toString()}
          renderItem={renderRequestCard}
          contentContainerStyle={tw`px-6 pb-24 pt-2`}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Animated.View entering={FadeInUp.duration(500)} style={tw`flex-1 justify-center items-center py-20 px-6`}>
              <View style={tw`w-20 h-20 rounded-full bg-[] items-center justify-center mb-6`}>
                <Inbox size={32} color="#a1a1aa" />
              </View>
              <Text style={tw`text-xl font-bold text-[] mb-2`}>No New Requests</Text>
              <Text style={tw`text-sm text-[] text-center leading-relaxed`}>
                You don't have any pending work requests right now. When a client hires you, it will show up here.
              </Text>
            </Animated.View>
          }
        />
      )}

      {/* Dispute Modal */}
      <Modal
        visible={disputeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDisputeModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50 p-4`}>
          <View style={tw`bg-white w-full rounded-[24px] p-6 shadow-xl`}>
            <Text style={tw`text-2xl font-bold text-gray-900 mb-2`}>Report Issue</Text>
            <Text style={tw`text-sm text-gray-500 mb-6`}>Please provide details about the dispute.</Text>
            
            <Text style={tw`text-sm font-bold text-gray-700 mb-2`}>Reason</Text>
            <TextInput
              style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-900 font-medium`}
              placeholder="e.g. Payment issue, Poor quality"
              value={disputeReason}
              onChangeText={setDisputeReason}
            />
            
            <Text style={tw`text-sm font-bold text-gray-700 mb-2`}>Description</Text>
            <TextInput
              style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6 text-gray-900 font-medium`}
              placeholder="Provide more details..."
              value={disputeDescription}
              onChangeText={setDisputeDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <View style={tw`flex-row gap-4`}>
              <TouchableOpacity 
                style={tw`flex-1 py-3.5 rounded-xl border-2 border-gray-200 items-center`}
                onPress={() => setDisputeModalVisible(false)}
              >
                <Text style={tw`text-gray-600 font-bold`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={tw`flex-1 py-3.5 rounded-xl bg-red-600 items-center`}
                onPress={submitDispute}
                disabled={actionLoading === 'dispute'}
              >
                {actionLoading === 'dispute' ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={tw`text-white font-bold`}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
