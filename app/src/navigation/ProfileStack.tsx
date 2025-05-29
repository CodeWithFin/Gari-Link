import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

// Import screens
import UserProfileScreen from '../screens/Profile/UserProfileScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import AppPreferencesScreen from '../screens/Profile/AppPreferencesScreen';
import HelpScreen from '../screens/Profile/HelpScreen';
import AboutScreen from '../screens/Profile/AboutScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStack: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: theme.colors.background }
      }}
    >
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen} 
        options={{ title: 'My Profile' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
      />
      <Stack.Screen 
        name="AppPreferences" 
        component={AppPreferencesScreen} 
        options={{ title: 'App Preferences' }}
      />
      <Stack.Screen 
        name="Help" 
        component={HelpScreen} 
        options={{ title: 'Help & Support' }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen} 
        options={{ title: 'About GariLink' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
