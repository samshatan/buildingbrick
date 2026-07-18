import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import * as Notifications from 'expo-notifications';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeProvider';
import { StatusBar } from 'expo-status-bar';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//     shouldShowBanner: true,
//     shouldShowList: true,
//   }),
// });

export default function App() {
  const [initialRouteName, setInitialRouteName] = useState<'Login' | 'Home' | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        GoogleSignin.configure({
          webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
          iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
          offlineAccess: true,
        });

        const token = await AsyncStorage.getItem('userToken');
        setInitialRouteName(token ? 'Home' : 'Login');
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
