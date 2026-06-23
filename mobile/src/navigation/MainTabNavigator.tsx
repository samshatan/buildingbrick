import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import WorkersScreen from '../screens/WorkersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ label, focused }: { label: string, focused: boolean }) => {
  const icon = label === 'Home' ? '🏠' : label === 'Market' ? '🏪' : '👤';
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, { opacity: focused ? 1 : 0.5 }]}>{icon}</Text>
      <Text style={[styles.label, { color: focused ? COLORS.secondary : COLORS.textLight }]}>{label}</Text>
      {focused && <View style={styles.dot} />}
    </View>
  );
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} />
        }}
      />
      <Tab.Screen 
        name="Workers" 
        component={WorkersScreen} 
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Market" focused={focused} />
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Profile" focused={focused} />
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 0,
    height: 80,
    paddingBottom: SPACING.md,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.secondary,
    marginTop: 4,
  },
});
