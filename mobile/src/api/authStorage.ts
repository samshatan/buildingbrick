import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const AUTH_KEYS = ['userToken', 'biometricToken'] as const;
type AuthKey = (typeof AUTH_KEYS)[number];

async function migrateLegacyValue(key: AuthKey): Promise<string | null> {
  const secureValue = await SecureStore.getItemAsync(key);
  if (secureValue) return secureValue;

  const legacyValue = await AsyncStorage.getItem(key);
  if (legacyValue) {
    await SecureStore.setItemAsync(key, legacyValue);
    await AsyncStorage.removeItem(key);
  }
  return legacyValue;
}

export const getAuthValue = (key: AuthKey) => migrateLegacyValue(key);

export const setAuthValue = (key: AuthKey, value: string) => SecureStore.setItemAsync(key, value);

export const removeAuthValue = async (key: AuthKey) => {
  await SecureStore.deleteItemAsync(key);
  await AsyncStorage.removeItem(key);
};

export const removeAuthValues = async () => {
  await Promise.all(AUTH_KEYS.map(removeAuthValue));
};
