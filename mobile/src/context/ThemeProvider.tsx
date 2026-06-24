import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = {
  bg: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
};

type ThemeContextType = {
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
  theme: Theme;
};

export const lightTheme: Theme = {
  bg: '#fdfbf7', // Creamy white
  card: '#ffffff',
  text: '#18181b', // zinc-900
  textSecondary: '#71717a', // zinc-500
  border: '#f4f4f5', // zinc-100
};

export const darkTheme: Theme = {
  bg: '#18181b', // zinc-900
  card: '#27272a', // zinc-800
  text: '#fafafa', // zinc-50
  textSecondary: '#a1a1aa', // zinc-400
  border: '#3f3f46', // zinc-700
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  setDarkMode: () => {},
  theme: lightTheme,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userInfo');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed.preferences?.darkMode !== undefined) {
            setIsDarkMode(parsed.preferences.darkMode);
          }
        }
      } catch (e) {
        console.error('Failed to load theme preference', e);
      }
    };
    loadTheme();
  }, []);

  const setDarkMode = (value: boolean) => {
    setIsDarkMode(value);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, setDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
