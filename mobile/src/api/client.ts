import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const FALLBACK_PRODUCTION_URL = 'https://brickourhouse-backend.onrender.com';
const FALLBACK_DEV_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

// Prefer the configured API URL, then a sensible dev fallback, then the deployed backend.
export const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL || (__DEV__ ? FALLBACK_DEV_URL : FALLBACK_PRODUCTION_URL);

const API_URL = `${SOCKET_URL}/api/v1`;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
