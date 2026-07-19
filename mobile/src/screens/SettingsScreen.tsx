import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { ChevronLeft, Bell, Lock, Shield, Info } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import apiClient from '../api/client';
import { useTheme } from '../context/ThemeProvider';

export default function SettingsScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userInfo');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed.preferences) {
            setNotificationsEnabled(parsed.preferences.pushNotifications ?? true);
            setBiometricsEnabled(parsed.preferences.biometricLogin ?? false);
          }
        }
      } catch (e) {      }
    };
    loadPrefs();
  }, []);

  const savePreference = async (key: string, value: boolean) => {
    try {
      // Update local storage
      const storedUser = await AsyncStorage.getItem('userInfo');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (!parsed.preferences) parsed.preferences = {};
        parsed.preferences[key] = value;
        await AsyncStorage.setItem('userInfo', JSON.stringify(parsed));
      }
      
      // Update backend
      await apiClient.patch('/users/preferences', { [key]: value });
    } catch (e) {    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await savePreference('pushNotifications', value);
    if (value) {
      Alert.alert("Push Notifications", "Push notifications have been enabled.");
    }
  };

  const handleToggleBiometrics = async (value: boolean) => {
    if (value) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware || !isEnrolled) {
        Alert.alert("Unsupported", "Your device does not support or have biometrics set up.");
        return;
      }
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to enable Biometric Login",
      });
      
      if (result.success) {
        setBiometricsEnabled(true);
        await savePreference('biometricLogin', true);
        
        // Save the current token as the biometric token
        const currentToken = await AsyncStorage.getItem('userToken');
        if (currentToken) {
          await AsyncStorage.setItem('biometricToken', currentToken);
        }
      } else {
        setBiometricsEnabled(false);
      }
    } else {
      setBiometricsEnabled(false);
      await savePreference('biometricLogin', false);
      await AsyncStorage.removeItem('biometricToken');
    }
  };

  const SettingRow = ({ icon: Icon, title, description, value, onValueChange }: any) => (
    <View style={tw`flex-row items-center justify-between py-4 border-b border-[${theme.border}]`}>
      <View style={tw`flex-row items-center gap-4 flex-1 pr-4`}>
        <View style={tw`w-10 h-10 rounded-full bg-[${theme.bg}] border border-[${theme.border}] items-center justify-center`}>
          <Icon size={18} color={theme.textSecondary} />
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-sm font-bold text-[${theme.text}] tracking-wide mb-0.5`}>{title}</Text>
          {description && <Text style={tw`text-xs text-[${theme.textSecondary}] font-medium`}>{description}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.border, true: '#fbdccf' }}
        thumbColor={value ? '#cc4518' : '#fff'}
        ios_backgroundColor={theme.border}
      />
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-[${theme.bg}]`}>
      <View style={tw`flex-row items-center justify-between px-6 py-4 bg-[${theme.card}] z-10 border-b border-[${theme.border}]`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`w-10 h-10 items-center justify-center -ml-2 rounded-full bg-[${theme.bg}]`}>
          <ChevronLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-[${theme.text}] tracking-wide`}>Settings</Text>
        <View style={tw`w-10 h-10`} />
      </View>

      <ScrollView contentContainerStyle={tw`p-6 pb-8`}>
        
        <Text style={tw`text-xs font-bold text-[${theme.textSecondary}] uppercase tracking-widest mb-3 ml-2`}>Preferences</Text>
        <View style={tw`bg-[${theme.card}] rounded-[24px] px-5 shadow-sm border border-[${theme.border}] mb-8`}>
          <SettingRow 
            icon={Bell} 
            title="Push Notifications" 
            description="Receive project alerts and messages." 
            value={notificationsEnabled} 
            onValueChange={handleToggleNotifications} 
          />
        </View>

        <Text style={tw`text-xs font-bold text-[${theme.textSecondary}] uppercase tracking-widest mb-3 ml-2`}>Security</Text>
        <View style={tw`bg-[${theme.card}] rounded-[24px] px-5 shadow-sm border border-[${theme.border}] mb-8`}>
          <SettingRow 
            icon={Lock} 
            title="Biometric Login" 
            description="Use Face ID or Fingerprint to log in." 
            value={biometricsEnabled} 
            onValueChange={handleToggleBiometrics} 
          />
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={tw`flex-row items-center justify-between py-4`}>
            <View style={tw`flex-row items-center gap-4 flex-1 pr-4`}>
              <View style={tw`w-10 h-10 rounded-full bg-[${theme.bg}] border border-[${theme.border}] items-center justify-center`}>
                <Shield size={18} color={theme.textSecondary} />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-sm font-bold text-[${theme.text}] tracking-wide mb-0.5`}>Change Password</Text>
                <Text style={tw`text-xs text-[${theme.textSecondary}] font-medium`}>Update your account password</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={tw`text-xs font-bold text-[${theme.textSecondary}] uppercase tracking-widest mb-3 ml-2`}>About</Text>
        <View style={tw`bg-[${theme.card}] rounded-[24px] px-5 py-4 shadow-sm border border-[${theme.border}]`}>
          <View style={tw`flex-row items-center gap-4`}>
            <View style={tw`w-10 h-10 rounded-full bg-[${theme.bg}] border border-[${theme.border}] items-center justify-center`}>
              <Info size={18} color={theme.textSecondary} />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm font-bold text-[${theme.text}] tracking-wide mb-0.5`}>App Version</Text>
              <Text style={tw`text-xs text-[${theme.textSecondary}] font-medium`}>v1.0.0</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
