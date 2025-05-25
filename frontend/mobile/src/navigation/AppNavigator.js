import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import MfaSetupScreen from '../screens/auth/MfaSetupScreen';
import MfaVerifyScreen from '../screens/auth/MfaVerifyScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Onboarding Screens
import AddVehicleScreen from '../screens/onboarding/AddVehicleScreen';
import VehicleDetailsScreen from '../screens/onboarding/VehicleDetailsScreen';
import ObdConnectionScreen from '../screens/onboarding/ObdConnectionScreen';
import OnboardingCompleteScreen from '../screens/onboarding/OnboardingCompleteScreen';

// Main App Screens
import HomeScreen from '../screens/main/HomeScreen';
import VehicleInfoScreen from '../screens/main/VehicleInfoScreen';
import MaintenanceScreen from '../screens/main/MaintenanceScreen';
import ServiceHistoryScreen from '../screens/main/ServiceHistoryScreen';
import AddServiceScreen from '../screens/main/AddServiceScreen';
import ServiceDetailsScreen from '../screens/main/ServiceDetailsScreen';
import PredictiveMaintenanceScreen from '../screens/main/PredictiveMaintenanceScreen';
import ObdDashboardScreen from '../screens/main/ObdDashboardScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Navigation Stacks
const AuthStack = createStackNavigator();
const OnboardingStack = createStackNavigator();
const HomeStack = createStackNavigator();
const MaintenanceStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="MfaSetup" component={MfaSetupScreen} />
    <AuthStack.Screen name="MfaVerify" component={MfaVerifyScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

// Onboarding Navigator
const OnboardingNavigator = () => (
  <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
    <OnboardingStack.Screen name="AddVehicle" component={AddVehicleScreen} />
    <OnboardingStack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
    <OnboardingStack.Screen name="ObdConnection" component={ObdConnectionScreen} />
    <OnboardingStack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />
  </OnboardingStack.Navigator>
);

// Home Stack Navigator
const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Dashboard" component={HomeScreen} options={{ headerShown: false }} />
    <HomeStack.Screen name="VehicleInfo" component={VehicleInfoScreen} options={{ title: 'Vehicle Details' }} />
    <HomeStack.Screen name="ObdDashboard" component={ObdDashboardScreen} options={{ title: 'Vehicle Diagnostics' }} />
  </HomeStack.Navigator>
);

// Maintenance Stack Navigator
const MaintenanceStackNavigator = () => (
  <MaintenanceStack.Navigator>
    <MaintenanceStack.Screen name="MaintenanceDashboard" component={MaintenanceScreen} options={{ headerShown: false }} />
    <MaintenanceStack.Screen name="ServiceHistory" component={ServiceHistoryScreen} options={{ title: 'Service History' }} />
    <MaintenanceStack.Screen name="AddService" component={AddServiceScreen} options={{ title: 'Add Service Record' }} />
    <MaintenanceStack.Screen name="ServiceDetails" component={ServiceDetailsScreen} options={{ title: 'Service Details' }} />
    <MaintenanceStack.Screen name="PredictiveMaintenance" component={PredictiveMaintenanceScreen} options={{ title: 'Predictive Insights' }} />
  </MaintenanceStack.Navigator>
);

// Profile Stack Navigator
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
  </ProfileStack.Navigator>
);

// Main Tab Navigator
const MainTabNavigator = () => (
  <MainTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Maintenance') {
          iconName = focused ? 'wrench' : 'wrench-outline';
        } else if (route.name === 'Track') {
          iconName = focused ? 'map-marker' : 'map-marker-outline';
        } else if (route.name === 'More') {
          iconName = focused ? 'menu' : 'menu-outline';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2C6BED',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <MainTab.Screen name="Home" component={HomeStackNavigator} options={{ headerShown: false }} />
    <MainTab.Screen name="Maintenance" component={MaintenanceStackNavigator} options={{ headerShown: false }} />
    <MainTab.Screen name="Track" component={ProfileStackNavigator} options={{ headerShown: false }} />
    <MainTab.Screen name="More" component={ProfileStackNavigator} options={{ headerShown: false }} />
  </MainTab.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  // Replace with proper authentication state check
  const isAuthenticated = false;
  const isOnboarded = false;

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : !isOnboarded ? (
        <OnboardingNavigator />
      ) : (
        <MainTabNavigator />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
