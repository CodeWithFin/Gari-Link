import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ServicesStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

// Import screens
import ServicesListScreen from '../screens/Services/ServicesListScreen';
import ServiceDetailsScreen from '../screens/Services/ServiceDetailsScreen';
import MapViewScreen from '../screens/Services/MapViewScreen';
import AddReviewScreen from '../screens/Services/AddReviewScreen';
import FilterServicesScreen from '../screens/Services/FilterServicesScreen';

const Stack = createStackNavigator<ServicesStackParamList>();

const ServicesStack: React.FC = () => {
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
        name="ServicesList" 
        component={ServicesListScreen} 
        options={{ title: 'Service Providers' }}
      />
      <Stack.Screen 
        name="ServiceDetails" 
        component={ServiceDetailsScreen} 
        options={({ route }) => ({ title: 'Service Details' })}
      />
      <Stack.Screen 
        name="MapView" 
        component={MapViewScreen} 
        options={{ title: 'Map View' }}
      />
      <Stack.Screen 
        name="AddReview" 
        component={AddReviewScreen} 
        options={{ title: 'Write a Review' }}
      />
      <Stack.Screen 
        name="FilterServices" 
        component={FilterServicesScreen} 
        options={{ title: 'Filter Services' }}
      />
    </Stack.Navigator>
  );
};

export default ServicesStack;
