import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import * as Notifications from 'expo-notifications';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeProvider';

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
  useEffect(() => {
    // const requestPermissions = async () => {
    //   const { status: existingStatus } = await Notifications.getPermissionsAsync();
    //   let finalStatus = existingStatus;
    //   if (existingStatus !== 'granted') {
    //     const { status } = await Notifications.requestPermissionsAsync();
    //     finalStatus = status;
    //   }
    //   if (finalStatus !== 'granted') {
    //     console.log('Failed to get push token for push notification!');
    //     return;
    //   }
      
    //   // In a real app, you would fetch the token here and send it to your backend
    //   // const token = (await Notifications.getExpoPushTokenAsync()).data;
    //   // console.log("Push Token:", token);
    // };
    
    // requestPermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
