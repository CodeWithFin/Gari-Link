import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { VehicleStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

// Import screens
import VehicleListScreen from '../screens/Vehicle/VehicleListScreen';
import VehicleDetailsScreen from '../screens/Vehicle/VehicleDetailsScreen';
import AddMaintenanceRecordScreen from '../screens/Vehicle/AddMaintenanceRecordScreen';
import MaintenanceHistoryScreen from '../screens/Vehicle/MaintenanceHistoryScreen';
import AddReminderScreen from '../screens/Vehicle/AddReminderScreen';
import EditVehicleScreen from '../screens/Vehicle/EditVehicleScreen';

const Stack = createStackNavigator<VehicleStackParamList>();

const VehicleStack: React.FC = () => {
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
        name="VehicleList" 
        component={VehicleListScreen} 
        options={{ title: 'My Vehicles' }}
      />
      <Stack.Screen 
        name="VehicleDetails" 
        component={VehicleDetailsScreen} 
        options={({ route }) => ({ title: 'Vehicle Details' })}
      />
      <Stack.Screen 
        name="AddMaintenanceRecord" 
        component={AddMaintenanceRecordScreen} 
        options={{ title: 'Add Service Record' }}
      />
      <Stack.Screen 
        name="MaintenanceHistory" 
        component={MaintenanceHistoryScreen} 
        options={{ title: 'Maintenance History' }}
      />
      <Stack.Screen 
        name="AddReminder" 
        component={AddReminderScreen} 
        options={{ title: 'Add Reminder' }}
      />
      <Stack.Screen 
        name="EditVehicle" 
        component={EditVehicleScreen} 
        options={{ title: 'Edit Vehicle' }}
      />
    </Stack.Navigator>
  );
};

export default VehicleStack;
