import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

// Import screens
import HomeScreen from '../screens/Home/HomeScreen';
import NotificationsScreen from '../screens/Home/NotificationsScreen';
import AddVehicleScreen from '../screens/Vehicle/AddVehicleScreen';

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStack: React.FC = () => {
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
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
      />
      <Stack.Screen 
        name="AddVehicle" 
        component={AddVehicleScreen} 
        options={{ title: 'Add Vehicle' }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
