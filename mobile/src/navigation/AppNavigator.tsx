import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainTabNavigator from './MainTabNavigator';
import WorkerDetailsScreen from '../screens/WorkerDetailsScreen';
import DirectHireScreen from '../screens/DirectHireScreen';
import JobsScreen from '../screens/JobsScreen';
import WorkRequestsScreen from '../screens/WorkRequestsScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import TermsScreen from '../screens/TermsScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import RefundScreen from '../screens/RefundScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import CartScreen from '../screens/CartScreen';
import PaymentScreen from '../screens/PaymentScreen';
import NotificationScreen from '../screens/NotificationScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import CafeDashboardScreen from '../screens/CafeDashboardScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Reset Password' }} />
        <Stack.Screen name="Home" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="WorkerDetails" component={WorkerDetailsScreen} options={{ title: 'Worker Profile' }} />
        <Stack.Screen name="DirectHire" component={DirectHireScreen} options={{ title: 'Book Worker' }} />
        <Stack.Screen name="Jobs" component={JobsScreen} options={{ title: 'My Jobs' }} />
        <Stack.Screen name="WorkRequests" component={WorkRequestsScreen} options={{ title: 'Incoming Requests' }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About Us' }} />
        <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact Us' }} />
        <Stack.Screen name="Terms" component={TermsScreen} options={{ title: 'Terms of Service' }} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacy Policy' }} />
        <Stack.Screen name="Refund" component={RefundScreen} options={{ title: 'Refund Policy' }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Your Cart' }} />
        <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Checkout' }} />
        <Stack.Screen name="Notifications" component={NotificationScreen} options={{ title: 'Notifications' }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Panel' }} />
        <Stack.Screen name="CafeDashboard" component={CafeDashboardScreen} options={{ title: 'Cafe Panel' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

