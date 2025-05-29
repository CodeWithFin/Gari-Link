import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContextType, ThemeType, Theme } from '../types/theme';
import { useColorScheme } from 'react-native';

// African-inspired color palette
const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#E63946',     // Vibrant red for primary actions
    secondary: '#F9C74F',   // Warm yellow for secondary elements
    background: '#F1FAEE',  // Off-white background
    card: '#FFFFFF',        // White card background
    text: '#1D3557',        // Dark blue text
    border: '#A8DADC',      // Light blue border
    notification: '#457B9D', // Medium blue for notifications
    error: '#E63946',       // Red for errors
    success: '#2A9D8F',     // Teal for success
    warning: '#F9C74F',     // Yellow for warnings
    info: '#457B9D',        // Blue for info
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#E63946',     // Keeping primary consistent
    secondary: '#F9C74F',   // Keeping secondary consistent
    background: '#1D3557',  // Dark blue background
    card: '#2A3F5F',        // Slightly lighter blue for cards
    text: '#F1FAEE',        // Off-white text
    border: '#457B9D',      // Medium blue border
    notification: '#A8DADC', // Light blue for notifications
    error: '#E63946',       // Red for errors
    success: '#2A9D8F',     // Teal for success
    warning: '#F9C74F',     // Yellow for warnings
    info: '#A8DADC',        // Light blue for info
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
  
  const theme = themeType === 'dark' ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={{ theme, themeType, toggleTheme }}>
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
