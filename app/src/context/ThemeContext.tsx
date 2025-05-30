import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContextType, ThemeType, Theme } from '../types/theme';
import { useColorScheme } from 'react-native';

// African-inspired color palette with new design specs
const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#2563eb',       // Vibrant automotive blue
    primaryLight: '#0ea5e9',  // Electric accent blue
    secondary: '#f59e0b',     // Warm amber for highlights
    background: '#ffffff',    // Clean white
    backgroundAlt: '#f8fafc', // Soft gray
    card: '#ffffff',          // Pure white for cards
    cardElevated: '#f8fafc',  // Slightly off-white for elevated cards
    text: '#1f2937',          // Rich dark gray
    textSecondary: '#6b7280', // Medium gray for secondary text
    border: '#e2e8f0',        // Light gray for borders
    notification: '#0ea5e9',  // Blue for notifications
    error: '#ef4444',         // Red for errors
    success: '#10b981',       // Fresh success green
    warning: '#f97316',       // Alert orange
    info: '#0ea5e9',          // Info blue
    accent1: '#10b981',       // Fresh green accent
    accent2: '#f97316',       // Orange accent
    accent3: '#8b5cf6',       // Purple accent
    surfaceOverlay: 'rgba(255, 255, 255, 0.8)', // Overlay for light mode
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '900' }
  },
  animation: {
    duration: {
      short: 150,
      medium: 300,
      long: 450,
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  elevation: {
    small: 2,
    medium: 4,
    large: 8,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#1e40af',       // Deep automotive blue
    primaryLight: '#38bdf8',  // Bright electric accent
    secondary: '#fbbf24',     // Rich gold
    background: '#000000',    // True black
    backgroundAlt: '#111827', // Rich charcoal
    card: '#1f2937',          // Dark cards
    cardElevated: '#374151',  // Slightly elevated dark cards
    text: '#ffffff',          // Pure white
    textSecondary: '#d1d5db', // Light gray for secondary text
    border: '#374151',        // Dark border
    notification: '#38bdf8',  // Notification blue
    error: '#f87171',         // Error red
    success: '#34d399',       // Vibrant success green
    warning: '#fb923c',       // Warm alert orange
    info: '#38bdf8',          // Info blue
    accent1: '#34d399',       // Green accent
    accent2: '#fb923c',       // Orange accent
    accent3: '#a78bfa',       // Purple accent
    surfaceOverlay: 'rgba(0, 0, 0, 0.7)', // Overlay for dark mode
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '900' }
  },
  animation: {
    duration: {
      short: 150,
      medium: 300,
      long: 450,
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  elevation: {
    small: 2,
    medium: 4,
    large: 8,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_PREFERENCE_KEY = '@garilink:theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>(deviceTheme as ThemeType || 'light');
  
  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (savedTheme !== null) {
          setThemeType(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem(THEME_PREFERENCE_KEY, themeType);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    };
    
    saveThemePreference();
  }, [themeType]);
  
  const toggleTheme = () => {
    setThemeType(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newThemeType: ThemeType) => {
    setThemeType(newThemeType);
  };
  
  const theme = themeType === 'dark' ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={{ theme, themeType, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
