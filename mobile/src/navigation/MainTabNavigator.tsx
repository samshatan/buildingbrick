import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Home, Cuboid, ShoppingCart, Users, FolderOpen, User } from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import StudioScreen from '../screens/StudioScreen';
import MaterialsScreen from '../screens/MaterialsScreen';
import WorkersScreen from '../screens/WorkersScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useTheme } from '../context/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused, color }: { name: string, focused: boolean, color: string }) => {
  const { theme } = useTheme();
  const COLORS = theme;
  const styles = getStyles(COLORS, 0); // TabIcon doesn't need insets for its local styles
  let IconComponent = Home;
  
  switch(name) {
    case 'Home': IconComponent = Home; break;
    case 'Studio': IconComponent = Cuboid; break;
    case 'Materials': IconComponent = ShoppingCart; break;
    case 'Workers': IconComponent = Users; break;
    case 'Projects': IconComponent = FolderOpen; break;
    case 'Profile': IconComponent = User; break;
  }

  return (
    <View style={styles.iconContainer}>
      <View style={[
        styles.iconCircle,
        focused && styles.iconCircleActive
      ]}>
        <IconComponent size={20} color={focused ? "#cc4518" : "#a1a1aa"} strokeWidth={focused ? 2.5 : 1.5} />
      </View>
      <Text style={[styles.label, { color: focused ? "#cc4518" : "#a1a1aa" }]}>{name.toUpperCase()}</Text>
    </View>
  );
};

export default function MainTabNavigator() {
  const { theme } = useTheme();
  const COLORS = theme;
  const insets = useSafeAreaInsets();
  const styles = getStyles(COLORS, insets.bottom);
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
          tabBarIcon: ({ focused, color }) => <TabIcon name="Home" focused={focused} color={color} />
        }}
      />
      <Tab.Screen 
        name="Studio"
        component={StudioScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon name="Studio" focused={focused} color={color} />
        }}
      />
      <Tab.Screen
        name="Materials"
        component={MaterialsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon name="Materials" focused={focused} color={color} />
        }}
      />
      <Tab.Screen
        name="Workers"
        component={WorkersScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon name="Workers" focused={focused} color={color} />
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon name="Projects" focused={focused} color={color} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon name="Profile" focused={focused} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}

const getStyles = (COLORS: any, bottomInset: number) => StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 78 + (bottomInset > 0 ? bottomInset : 10),
    paddingBottom: bottomInset > 0 ? bottomInset : 10,
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
    marginTop: 10,
  },
  iconCircle: {
    padding: 8,
    borderRadius: 20,
  },
  iconCircleActive: {
    backgroundColor: COLORS.primaryLight + '30',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
