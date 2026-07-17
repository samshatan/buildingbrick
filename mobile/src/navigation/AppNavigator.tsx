import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthScreen from '../screens/AuthScreen';
import VerificationScreen from '../screens/VerificationScreen';
import MainTabNavigator from './MainTabNavigator';
import WorkerDetailsScreen from '../screens/WorkerDetailsScreen';
import DirectHireScreen from '../screens/DirectHireScreen';
import JobsScreen from '../screens/JobsScreen';
import WorkersScreen from '../screens/WorkersScreen';
import WorkRequestsScreen from '../screens/WorkRequestsScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import TermsScreen from '../screens/TermsScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import RefundScreen from '../screens/RefundScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import CartScreen from '../screens/CartScreen';
import PaymentScreen from '../screens/PaymentScreen';
import MaterialDetailsScreen from '../screens/MaterialDetailsScreen';
import NotificationScreen from '../screens/NotificationScreen';
import StudioScreen from '../screens/StudioScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import WorkerOnboardingScreen from '../screens/WorkerOnboardingScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import CafeDashboardScreen from '../screens/CafeDashboardScreen';
import ChatScreen from '../screens/ChatScreen';
import OrdersScreen from '../screens/OrdersScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import BusinessProfileScreen from '../screens/BusinessProfileScreen';
import PlatformModerationScreen from '../screens/PlatformModerationScreen';
import ManageRolesScreen from '../screens/ManageRolesScreen';
import UsersManagementScreen from '../screens/UsersManagementScreen';
import WorkerVerificationScreen from '../screens/WorkerVerificationScreen';
import AnalyticalReportsScreen from '../screens/AnalyticalReportsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FullHouseConstructionScreen from '../screens/FullHouseConstructionScreen';
import BulkOrdersScreen from '../screens/BulkOrdersScreen';
import ExpertInspectionScreen from '../screens/ExpertInspectionScreen';
import InsuranceScreen from '../screens/InsuranceScreen';
import LoanScreen from '../screens/LoanScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createNativeStackNavigator();

type AppNavigatorProps = {
  initialRouteName: string;
};

export default function AppNavigator({ initialRouteName }: AppNavigatorProps) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen name="Login" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Create Account' }} />
        <Stack.Screen name="Verification" component={VerificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Reset Password' }} />
        <Stack.Screen name="Home" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="WorkerDetails" component={WorkerDetailsScreen} options={{ title: 'Worker Profile' }} />
        <Stack.Screen name="DirectHire" component={DirectHireScreen} options={{ title: 'Book Worker' }} />
        <Stack.Screen name="Workers" component={WorkersScreen} options={{ title: 'Saved Workers' }} />
        <Stack.Screen name="Jobs" component={JobsScreen} options={{ title: 'My Jobs' }} />
        <Stack.Screen name="WorkRequests" component={WorkRequestsScreen} options={{ title: 'Incoming Requests' }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About Us' }} />
        <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact Us' }} />
        <Stack.Screen name="Terms" component={TermsScreen} options={{ title: 'Terms of Service' }} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacy Policy' }} />
        <Stack.Screen name="Refund" component={RefundScreen} options={{ title: 'Refund Policy' }} />
        <Stack.Screen name="MaterialDetails" component={MaterialDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Your Cart' }} />
        <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Checkout' }} />
        <Stack.Screen name="Notifications" component={NotificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Studio" component={StudioScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Projects" component={ProjectsScreen} options={{ title: 'My Projects' }} />
        <Stack.Screen name="WorkerOnboarding" component={WorkerOnboardingScreen} options={{ title: 'Apply as Worker' }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Panel' }} />
        <Stack.Screen name="CafeDashboard" component={CafeDashboardScreen} options={{ title: 'Cafe Panel' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Orders" component={OrdersScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BusinessProfile" component={BusinessProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PlatformModeration" component={PlatformModerationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ManageRoles" component={ManageRolesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UsersManagement" component={UsersManagementScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WorkerVerification" component={WorkerVerificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AnalyticalReports" component={AnalyticalReportsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FullHouseConstruction" component={FullHouseConstructionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BulkOrders" component={BulkOrdersScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ExpertInspection" component={ExpertInspectionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Insurance" component={InsuranceScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Loans" component={LoanScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

