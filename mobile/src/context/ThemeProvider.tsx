import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  surface: string;
  text: string;
  textLight: string;
  border: string;
  accent: string;
  secondary: string;
  success: string;
  error: string;
  warning: string;
  zinc900: string;

  // Legacy mappings for older screens
  bg: string;
  card: string;
  textSecondary: string;
};

type ThemeContextType = {
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
  theme: Theme;
};

export const lightTheme: Theme = {
  primary: '#8B4513',
  primaryLight: '#D6C4B0',
  primaryDark: '#4A3B28',
  background: '#FAF9F6',
  surface: '#FFFFFF',
  text: '#2D2926',
  textLight: '#7C746B',
  border: '#E5E2DA',
  accent: '#7A3B0F',
  secondary: '#A0522D',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  zinc900: '#1A1715',
  
  bg: '#FAF9F6',
  card: '#FFFFFF',
  textSecondary: '#7C746B',
};

export const darkTheme: Theme = {
  primary: '#D69E66',
  primaryLight: '#4A3B28',
  primaryDark: '#FDE6CE',
  background: '#0F172A', // Slate 900
  surface: '#1E293B',    // Slate 800
  text: '#F8FAFC',       // Slate 50
  textLight: '#94A3B8',  // Slate 400
  border: '#334155',     // Slate 700
  accent: '#F59E0B',
  secondary: '#E28743', 
  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  zinc900: '#F8FAFC',

  bg: '#0F172A',
  card: '#1E293B',
  textSecondary: '#94A3B8',
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  setDarkMode: () => {},
  theme: lightTheme,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeContext.Provider value={{ isDarkMode: false, setDarkMode: () => {}, theme: lightTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
