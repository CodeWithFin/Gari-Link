import React, { lazy, Suspense } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { MainTabParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View, Platform } from 'react-native';

// Preload the stack navigators to avoid circular dependencies
import HomeStack from './HomeStack';
import VehicleStack from './VehicleStack';
import ServicesStack from './ServicesStack';
import CommunityStack from './CommunityStack';
import ProfileStack from './ProfileStack';

// Loading component for Suspense fallback
const LoadingScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: theme.colors.background 
    }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  const { theme } = useTheme();

  // Create a navigation theme object that matches React Navigation's expected format
  const navigationTheme: NavigationTheme = {
    ...DefaultTheme,
    dark: theme.dark,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.notification,
    }
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any;

            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'VehicleTab') {
              iconName = focused ? 'car' : 'car-outline';
            } else if (route.name === 'ServicesTab') {
              iconName = focused ? 'construct' : 'construct-outline';
            } else if (route.name === 'CommunityTab') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'ProfileTab') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            ...Platform.select({
              ios: {
                shadowColor: theme.dark ? '#000' : theme.colors.primary,
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: theme.dark ? 0.2 : 0.1,
                shadowRadius: 5,
              },
              android: {
                elevation: theme.elevation.medium,
              },
            }),
          },
          tabBarLabelStyle: {
            fontFamily: theme.fonts.medium.fontFamily,
            fontWeight: theme.fonts.medium.fontWeight as '400' | '500' | 'bold',
            fontSize: 12,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="HomeTab" 
          options={{ tabBarLabel: 'Home' }}
          component={HomeStack}
        />
        <Tab.Screen 
          name="VehicleTab" 
          options={{ tabBarLabel: 'My Vehicle' }}
          component={VehicleStack}
        />
        <Tab.Screen 
          name="ServicesTab" 
          options={{ tabBarLabel: 'Services' }}
          component={ServicesStack}
        />
        <Tab.Screen 
          name="CommunityTab" 
          options={{ tabBarLabel: 'Community' }}
          component={CommunityStack}
        />
        <Tab.Screen 
          name="ProfileTab" 
          options={{ tabBarLabel: 'Profile' }}
          component={ProfileStack}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
