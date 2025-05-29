import React, { lazy, Suspense } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MainTabParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';

// Lazy load stack navigators to avoid circular dependencies
const HomeStack = lazy(() => import('./HomeStack'));
const VehicleStack = lazy(() => import('./VehicleStack'));
const ServicesStack = lazy(() => import('./ServicesStack'));
const CommunityStack = lazy(() => import('./CommunityStack'));
const ProfileStack = lazy(() => import('./ProfileStack'));

// Loading component for Suspense fallback
const LoadingScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={{
      dark: theme.dark,
      colors: {
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.card,
        text: theme.colors.text,
        border: theme.colors.border,
        notification: theme.colors.notification,
      },
      fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '700' },
        heavy: { fontFamily: 'System', fontWeight: '900' }
      }
    }}>
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
          tabBarInactiveTintColor: theme.colors.text,
          tabBarStyle: {
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="HomeTab" 
          options={{ tabBarLabel: 'Home' }}
        >
          {() => (
            <Suspense fallback={<LoadingScreen />}>
              <HomeStack />
            </Suspense>
          )}
        </Tab.Screen>
        <Tab.Screen 
          name="VehicleTab" 
          options={{ tabBarLabel: 'My Vehicle' }}
        >
          {() => (
            <Suspense fallback={<LoadingScreen />}>
              <VehicleStack />
            </Suspense>
          )}
        </Tab.Screen>
        <Tab.Screen 
          name="ServicesTab" 
          options={{ tabBarLabel: 'Services' }}
        >
          {() => (
            <Suspense fallback={<LoadingScreen />}>
              <ServicesStack />
            </Suspense>
          )}
        </Tab.Screen>
        <Tab.Screen 
          name="CommunityTab" 
          options={{ tabBarLabel: 'Community' }}
        >
          {() => (
            <Suspense fallback={<LoadingScreen />}>
              <CommunityStack />
            </Suspense>
          )}
        </Tab.Screen>
        <Tab.Screen 
          name="ProfileTab" 
          options={{ tabBarLabel: 'Profile' }}
        >
          {() => (
            <Suspense fallback={<LoadingScreen />}>
              <ProfileStack />
            </Suspense>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
