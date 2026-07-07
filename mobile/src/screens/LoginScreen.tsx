import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';
import { SPACING, RADIUS, SHADOWS } from '../theme/theme';
import { useTheme } from '../context/ThemeProvider';

export default function LoginScreen({ navigation }: any) {
  const { theme } = useTheme();
  const COLORS = theme;
  const styles = getStyles(COLORS);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Required', 'Please enter your login details');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { identifier: email, password });
      
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
        
        navigation.replace('Home');
      } else {
        Alert.alert('Login Failed', response.data.message || 'Check your credentials');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Connection to server failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🏗️</Text>
          <Text style={styles.brandName}>BuildingBrick</Text>
        </View>

        <Text style={styles.header}>Welcome Back</Text>
        <Text style={styles.subtext}>Manage your projects with ease</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email or Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="example@email.com"
            placeholderTextColor={COLORS.textLight}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={COLORS.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledBtn]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to the platform? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.footerLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (COLORS: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoText: {
    fontSize: 48,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 8,
    letterSpacing: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
  },
  forgotPassword: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  footerText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  footerLink: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '800',
  },
});
