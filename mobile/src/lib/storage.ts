import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

/**
 * SecureStore on iOS keychain / Android keystore for sensitive items
 * (JWT, refresh token). Falls back to AsyncStorage on web (Expo's
 * SecureStore is a no-op there).
 */
const secureAvailable = Platform.OS === 'ios' || Platform.OS === 'android'

export const secureStore = {
  async get(key: string): Promise<string | null> {
    return secureAvailable ? SecureStore.getItemAsync(key) : AsyncStorage.getItem(key)
  },
  async set(key: string, value: string): Promise<void> {
    return secureAvailable ? SecureStore.setItemAsync(key, value) : AsyncStorage.setItem(key, value)
  },
  async remove(key: string): Promise<void> {
    return secureAvailable ? SecureStore.deleteItemAsync(key) : AsyncStorage.removeItem(key)
  },
}

export const STORAGE_KEYS = {
  ACCESS_TOKEN:  'lms.accessToken',
  REFRESH_TOKEN: 'lms.refreshToken',
  USER:          'lms.user',
  PORTAL:        'lms.portal',
  THEME:         'lms.theme',
} as const
