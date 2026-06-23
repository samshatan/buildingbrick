import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// NOTE: Commented out because the native module crashes standard Expo Go
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import apiClient from '../api/client';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    // NOTE: Commented out because GoogleSignin requires a Development Build
    // and will crash standard Expo Go. Uncomment when building natively!
    /*
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com',
    });
    */
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      if (response.data.success && response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
        
        navigation.replace('Home');
      } else {
        Alert.alert('Login Failed', response.data.message || 'Something went wrong');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  // NOTE: Google Sign In logic hidden for Expo Go testing
  /*
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      
      // Handle newer v11+ API where signIn returns an object with a 'type' property
      if (response.type === 'success') {
        const idToken = response.data.idToken;

        // Send the Google idToken to your backend to authenticate
        const apiResponse = await apiClient.post('/auth/google', { token: idToken });
        
        if (apiResponse.data.success && apiResponse.data.token) {
          await AsyncStorage.setItem('userToken', apiResponse.data.token);
          await AsyncStorage.setItem('userInfo', JSON.stringify(apiResponse.data.user));
          navigation.replace('Home');
        }
      } else if (response.type === 'cancelled') {
        console.log('User cancelled the login flow');
      }
    } catch (error: any) {
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Play services not available or outdated');
      } else {
        console.log('Google login error', error);
        Alert.alert('Error', 'Google Sign-In failed');
      }
    } finally {
      setGoogleLoading(false);
    }
  };
  */

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back</Text>
      <Text style={styles.subtext}>Log in to BuildingBrick</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
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
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={loading || googleLoading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      {/* NOTE: Google Sign-In is temporarily hidden for Expo Go testing. 
          Uncomment this block when you switch to a custom Dev Build.
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.divider} />
      </View>

      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={handleGoogleLogin}
        disabled={loading || googleLoading}
      >
        {googleLoading ? (
          <ActivityIndicator color="#db4437" />
        ) : (
          <Text style={styles.googleButtonText}>Sign In with Google</Text>
        )}
      </TouchableOpacity>
      */}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  forgotPassword: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2563eb', // blue-600
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#6b7280',
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
  },
  footerLink: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
