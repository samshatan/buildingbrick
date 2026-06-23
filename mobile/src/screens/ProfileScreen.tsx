import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme/theme';

export default function ProfileScreen({ navigation }: any) {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userStr = await AsyncStorage.getItem('userInfo');
    if (userStr) {
      setUserInfo(JSON.parse(userStr));
    }
  };

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Log Out', 
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userInfo');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      }
    ]);
  };

  const handleUpdateProfile = () => {
    Alert.alert('Update Profile', 'This feature will allow you to change your name and profile picture. Backend integration is ready!');
  };

  const MenuItem = ({ title, icon, onPress, style = {}, textStyle = {} }: any) => (
    <TouchableOpacity style={[styles.menuItem, style]} onPress={onPress}>
      <Text style={[styles.menuText, textStyle]}>{icon}  {title}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer} onPress={handleUpdateProfile}>
          <View style={styles.avatar} />
          <View style={styles.editBadge}>
            <Text style={styles.editText}>✎</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{userInfo?.fullName || userInfo?.name || 'User Name'}</Text>
        <Text style={styles.email}>{userInfo?.email || 'user@example.com'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>{userInfo?.userType || 'USER'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <MenuItem title="My Profile" icon="👤" onPress={handleUpdateProfile} />
        <MenuItem title="My Jobs" icon="💼" onPress={() => navigation.navigate('Jobs')} />
        <MenuItem title="My Cart" icon="🛒" onPress={() => navigation.navigate('Cart')} />

        {userInfo?.userType !== 'WORKER' && (
          <MenuItem
            title="Become a Worker"
            icon="🛠️"
            onPress={() => navigation.navigate('WorkerOnboarding')}
            style={styles.workerItem}
            textStyle={styles.workerText}
          />
        )}
      </View>

      {userInfo?.userType === 'ADMIN' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Administration</Text>
          <MenuItem
            title="Admin Dashboard"
            icon="🛡️"
            onPress={() => navigation.navigate('AdminDashboard')}
            style={styles.adminItem}
            textStyle={styles.adminText}
          />
        </View>
      )}

      {(userInfo?.userType === 'CAFE' || userInfo?.userType === 'ADMIN') && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Partner Management</Text>
          <MenuItem
            title="Cafe Dashboard"
            icon="☕"
            onPress={() => navigation.navigate('CafeDashboard')}
            style={styles.cafeItem}
            textStyle={styles.cafeText}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        <MenuItem title="About BuildingBrick" icon="ℹ️" onPress={() => navigation.navigate('About')} />
        <MenuItem title="Contact Support" icon="📞" onPress={() => navigation.navigate('Contact')} />
        <MenuItem title="Privacy Policy" icon="🔒" onPress={() => navigation.navigate('Privacy')} />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0 (Stitsch Edition)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    padding: SPACING.xl,
    paddingTop: SPACING.xl * 2,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
  },
  editBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: COLORS.surface,
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    ...SHADOWS.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  email: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 1,
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginLeft: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  chevron: {
    fontSize: 20,
    color: COLORS.border,
  },
  workerItem: {
    backgroundColor: '#eff6ff',
  },
  workerText: {
    color: COLORS.secondary,
  },
  adminItem: {
    backgroundColor: '#fef2f2',
  },
  adminText: {
    color: '#991b1b',
  },
  cafeItem: {
    backgroundColor: '#ecfdf5',
  },
  cafeText: {
    color: '#065f46',
  },
  logoutBtn: {
    margin: SPACING.lg,
    marginTop: SPACING.xl,
    backgroundColor: '#fff',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 12,
    marginBottom: SPACING.xl,
  },
});
