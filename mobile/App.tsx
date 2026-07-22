import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeProvider';
import { StatusBar } from 'expo-status-bar';
import apiClient from './src/api/client';

export default function App() {
  const [initialRouteName, setInitialRouteName] = useState<'Login' | 'Home' | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const googleConfig: {
          webClientId?: string;
          iosClientId?: string;
          offlineAccess: boolean;
        } = { offlineAccess: true };

        if (process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) {
          googleConfig.webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
        }

        if (process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID) {
          googleConfig.iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
        }

        if (googleConfig.webClientId || googleConfig.iosClientId) {
          GoogleSignin.configure(googleConfig);
        }

        const token = await AsyncStorage.getItem('userToken');

        if (!token) {
          setInitialRouteName('Login');
          return;
        }

        try {
          const response = await apiClient.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          await AsyncStorage.setItem('userInfo', JSON.stringify(response.data?.data?.user || response.data?.user || response.data || {}));
          setInitialRouteName('Home');
        } catch {
          await AsyncStorage.multiRemove(['userToken', 'userInfo', 'biometricToken']);
          setInitialRouteName('Login');
        }
      } catch (error) {
        setInitialRouteName('Login');
      }
    };

    bootstrap();
  }, []);

  if (!initialRouteName) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF9F6' }}>
          <ActivityIndicator size="large" color="#cc4518" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <ThemeProvider>
        <AppNavigator initialRouteName={initialRouteName} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
