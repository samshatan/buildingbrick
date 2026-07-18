import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';
import { SPACING, RADIUS, SHADOWS } from '../theme/theme';
import { useTheme } from '../context/ThemeProvider';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export default function SignUpScreen({ navigation }: any) {
  const { theme } = useTheme();
  const COLORS = theme;
  const styles = getStyles(COLORS);
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify & Details
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('hirer');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!identifier) {
      Alert.alert('Required', 'Please enter your email or phone number');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/auth/send-otp', { identifier, type: 'signup' });
      Alert.alert('OTP Sent', `A verification code has been sent to ${identifier}`);
      setStep(2);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!name || !otp || !password) {
      Alert.alert('Required', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/signup', {
        name,
        identifier,
        otp,
        password,
        accountType
      });
      
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
        navigation.replace('Home');
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;

      if (idToken) {
        setLoading(true);
        const serverResponse = await apiClient.post('/auth/google-mobile', { idToken });
        
        if (serverResponse.data.token) {
          await AsyncStorage.setItem('userToken', serverResponse.data.token);
          await AsyncStorage.setItem('userInfo', JSON.stringify(serverResponse.data.user));
          navigation.replace('Home');
        } else {
          Alert.alert('Registration Failed', 'Unable to register with Google');
        }
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Wait', 'Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services not available or outdated');
      } else {
        Alert.alert('Google Sign-In Error', error.response?.data?.message || error.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.header}>Create Account</Text>
          <Text style={styles.subtext}>Join the BuildingBrick community</Text>

          {step === 1 ? (
            <View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email or Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="example@email.com or 9876543210"
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Verification Code</Text>}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.googleButton, loading && styles.disabledBtn]}
                onPress={handleGoogleSignUp}
                disabled={loading}
              >
                <Text style={styles.googleButtonText}>Sign Up with Google</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Verification Code (OTP)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123456"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Create Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <Text style={styles.label}>I am a...</Text>
              <View style={styles.typeContainer}>
                <TouchableOpacity
                  style={[styles.typeBtn, accountType === 'hirer' && styles.typeBtnActive]}
                  onPress={() => setAccountType('hirer')}
                >
                  <Text style={[styles.typeText, accountType === 'hirer' && styles.typeTextActive]}>Client</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeBtn, accountType === 'worker' && styles.typeBtnActive]}
                  onPress={() => setAccountType('worker')}
                >
                  <Text style={[styles.typeText, accountType === 'worker' && styles.typeTextActive]}>Worker</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Complete Registration</Text>}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setStep(1)}>
                <Text style={styles.changeContact}>Change email/phone</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (COLORS: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
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
  typeContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  typeBtn: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  typeText: {
    fontWeight: '700',
    color: COLORS.textLight,
  },
  typeTextActive: {
    color: COLORS.surface,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '800',
  },
  googleButton: {
    backgroundColor: '#fff',
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  changeContact: {
    textAlign: 'center',
    color: COLORS.textLight,
    textDecorationLine: 'underline',
    marginBottom: SPACING.md,
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
