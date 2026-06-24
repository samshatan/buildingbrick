import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react-native';
import tw from 'twrnc';

const dummyReports = [
  { id: 1, type: 'User', targetName: 'John Doe', reason: 'Inappropriate behavior in chat', status: 'Pending', reportedBy: 'Jane Smith' },
  { id: 2, type: 'Job', targetName: 'Plumbing Repair', reason: 'Fraudulent listing', status: 'Pending', reportedBy: 'Mike Johnson' },
  { id: 3, type: 'Review', targetName: '5-star Review', reason: 'Spam / Fake review', status: 'Resolved', reportedBy: 'System Auto-flag' }
];

export default function PlatformModerationScreen({ navigation }: any) {
  const [reports, setReports] = useState(dummyReports);

  const handleAction = (id: number, action: 'ban' | 'warn' | 'dismiss') => {
    Alert.alert(`Confirm ${action}`, `Are you sure you want to ${action} this report?`, [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Confirm", 
        onPress: () => {
          setReports(reports.map(r => r.id === id ? { ...r, status: action === 'dismiss' ? 'Dismissed' : 'Resolved' } : r));
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <View style={tw`flex-row items-center gap-4 px-6 pt-6 pb-4 bg-white border-b border-zinc-100`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`w-10 h-10 rounded-full bg-zinc-50 items-center justify-center`}>
          <ChevronLeft size={24} color="#3f3f46" />
        </TouchableOpacity>
        <View>
          <Text style={tw`text-xl font-bold text-zinc-800`}>Platform Moderation</Text>
          <Text style={tw`text-xs font-medium text-zinc-500`}>{reports.filter(r => r.status === 'Pending').length} Pending Reports</Text>
        </View>
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-6 pb-24 gap-4`}>
        {reports.map((report) => (
          <View key={report.id} style={tw`bg-white rounded-2xl p-5 border ${report.status === 'Pending' ? 'border-orange-200 bg-orange-50/30' : 'border-zinc-200'} shadow-sm`}>
            <View style={tw`flex-row justify-between items-start mb-3`}>
              <View style={tw`flex-row items-center gap-2`}>
                {report.status === 'Pending' ? <ShieldAlert size={20} color="#cc4518" /> : <CheckCircle2 size={20} color="#10b981" />}
                <Text style={tw`font-bold text-zinc-800`}>Reported {report.type}</Text>
              </View>
              <View style={tw`px-3 py-1 rounded-full ${report.status === 'Pending' ? 'bg-orange-100' : 'bg-zinc-100'}`}>
                <Text style={tw`text-[10px] font-bold uppercase tracking-widest ${report.status === 'Pending' ? 'text-orange-700' : 'text-zinc-500'}`}>{report.status}</Text>
              </View>
            </View>
            
            <View style={tw`mb-4`}>
              <Text style={tw`text-lg font-bold text-zinc-900 mb-1`}>{report.targetName}</Text>
              <Text style={tw`text-sm text-zinc-600 mb-2`}>Reason: <Text style={tw`font-medium text-zinc-800`}>{report.reason}</Text></Text>
              <Text style={tw`text-xs text-zinc-400`}>Reported by: {report.reportedBy}</Text>
            </View>

            {report.status === 'Pending' && (
              <View style={tw`flex-row gap-2 mt-2 pt-4 border-t border-zinc-100/50`}>
                <TouchableOpacity onPress={() => handleAction(report.id, 'ban')} style={tw`flex-1 bg-red-100 py-2.5 rounded-xl items-center`}>
                  <Text style={tw`text-red-700 font-bold text-xs uppercase tracking-wide`}>Ban/Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAction(report.id, 'warn')} style={tw`flex-1 bg-orange-100 py-2.5 rounded-xl items-center`}>
                  <Text style={tw`text-orange-700 font-bold text-xs uppercase tracking-wide`}>Warn</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAction(report.id, 'dismiss')} style={tw`flex-1 bg-zinc-100 py-2.5 rounded-xl items-center`}>
                  <Text style={tw`text-zinc-600 font-bold text-xs uppercase tracking-wide`}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
