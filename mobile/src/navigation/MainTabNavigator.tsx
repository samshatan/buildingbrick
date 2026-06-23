import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import StudioScreen from '../screens/StudioScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ label, focused }: { label: string, focused: boolean }) => {
  const icon = label === 'Home' ? '🏠' : label === 'Studio' ? '🧱' : label === 'Projects' ? '📂' : '👤';
  return (
    <View style={styles.iconContainer}>
      <View style={[
        styles.iconCircle,
        focused && styles.iconCircleActive
      ]}>
        <Text style={[styles.icon, { opacity: focused ? 1 : 0.5 }]}>{icon}</Text>
      </View>
      <Text style={[styles.label, { color: focused ? COLORS.primary : COLORS.textLight }]}>{label.toUpperCase()}</Text>
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
        name="Studio"
        component={StudioScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Studio" focused={focused} />
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Projects" focused={focused} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 90,
    paddingBottom: SPACING.md,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  iconCircle: {
    padding: 8,
    borderRadius: 20,
  },
  iconCircleActive: {
    backgroundColor: COLORS.primaryLight,
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontSize: 8,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
