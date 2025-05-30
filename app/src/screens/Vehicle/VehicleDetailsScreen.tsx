import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { VehicleStackParamList, VehicleScreenNavigationProp } from '../../types/navigation';
import { Vehicle, MaintenanceRecord, Reminder } from '../../types/models';
import { VehicleService } from '../../services/VehicleService';
import { MaintenanceService } from '../../services/MaintenanceService';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { formatDate, isServiceDue } from '../../utils/helpers';

type VehicleDetailsRouteProp = RouteProp<VehicleStackParamList, 'VehicleDetails'>;

const VehicleDetailsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const navigation = useNavigation<VehicleScreenNavigationProp>();
  const route = useRoute<VehicleDetailsRouteProp>();
  const { vehicleId } = route.params;
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mileageUpdateModal, setMileageUpdateModal] = useState(false);
  const [newMileage, setNewMileage] = useState('');

  useEffect(() => {
    loadVehicleData();
  }, [vehicleId]);

  const loadVehicleData = async () => {
    try {
      setLoading(true);
      
      // Load vehicle details
      const vehicleData = await VehicleService.getVehicleById(vehicleId);
      if (!vehicleData) {
        showToast({
          message: 'Vehicle not found',
          type: 'error',
          duration: 3000
        });
        navigation.goBack();
        return;
      }
      
      setVehicle(vehicleData);
      
      // Load maintenance records
      const records = await MaintenanceService.getMaintenanceRecords(vehicleId);
      setMaintenanceRecords(records);
      
      // In a real app, we would load reminders from a separate service
      // For now, we'll just set an empty array
      setReminders([]);
    } catch (error) {
      console.error('Error loading vehicle data:', error);
      showToast({
        message: 'Failed to load vehicle data. Please try again.',
        type: 'error',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadVehicleData();
      showToast({
        message: 'Vehicle data refreshed',
        type: 'info',
        duration: 1500
      });
    } catch (error) {
      console.error('Error refreshing vehicle data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddMaintenanceRecord = () => {
    navigation.navigate('AddMaintenanceRecord', { vehicleId });
  };

  const handleViewMaintenanceHistory = () => {
    navigation.navigate('MaintenanceHistory', { vehicleId });
  };

  const handleAddReminder = () => {
    navigation.navigate('AddReminder', { vehicleId });
  };

  const handleEditVehicle = () => {
    navigation.navigate('EditVehicle', { vehicleId });
  };

  const handleUpdateMileage = async () => {
    if (!vehicle) return;
    
    try {
      const mileageValue = parseInt(newMileage);
      
      if (isNaN(mileageValue)) {
        showToast({
          message: 'Please enter a valid number',
          type: 'error',
          duration: 3000
        });
        return;
      }
      
      if (mileageValue < vehicle.currentMileage) {
        showToast({
          message: 'New mileage cannot be less than the current mileage',
          type: 'warning',
          duration: 3000
        });
        return;
      }
      
      const updatedVehicle = await VehicleService.updateMileage(vehicleId, mileageValue);
      setVehicle(updatedVehicle);
      setMileageUpdateModal(false);
      setNewMileage('');
      
      showToast({
        message: 'Mileage updated successfully',
        type: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error('Error updating mileage:', error);
      Alert.alert('Error', 'Failed to update mileage. Please try again.');
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          Vehicle not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Vehicle Header */}
      <View style={styles.header}>
        <View style={styles.vehicleImageContainer}>
          {vehicle.image ? (
            <Image
              source={{ uri: vehicle.image }}
              style={styles.vehicleImage}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.vehiclePlaceholder,
                { backgroundColor: theme.colors.border },
              ]}
            >
              <Ionicons name="car" size={64} color={theme.colors.text} />
            </View>
          )}
        </View>
        
        <View style={styles.vehicleInfoHeader}>
          <Text
            style={[styles.vehicleName, { color: theme.colors.text }]}
            numberOfLines={2}
          >
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>
          
          {vehicle.licensePlate && (
            <View style={[styles.licensePlate, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.licensePlateText}>
                {vehicle.licensePlate}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickAction}
          onPress={handleAddMaintenanceRecord}
          accessibilityLabel="Add Service Record"
        >
          <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="construct" size={24} color="#FFFFFF" />
          </View>
          <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
            Add Service
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.quickAction}
          onPress={handleViewMaintenanceHistory}
          accessibilityLabel="View Maintenance History"
        >
          <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.secondary }]}>
            <Ionicons name="time" size={24} color="#1D3557" />
          </View>
          <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
            History
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.quickAction}
          onPress={handleAddReminder}
          accessibilityLabel="Add Reminder"
        >
          <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.notification }]}>
            <Ionicons name="notifications" size={24} color="#FFFFFF" />
          </View>
          <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
            Add Reminder
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.quickAction}
          onPress={handleEditVehicle}
          accessibilityLabel="Edit Vehicle"
        >
          <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.info }]}>
            <Ionicons name="create" size={24} color="#FFFFFF" />
          </View>
          <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Vehicle Details */}
      <Card title="Vehicle Details">
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
              Mileage
            </Text>
            <View style={styles.mileageContainer}>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                {vehicle.currentMileage.toLocaleString()} km
              </Text>
              <TouchableOpacity
                style={[styles.updateButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  setNewMileage(vehicle.currentMileage.toString());
                  Alert.prompt(
                    'Update Mileage',
                    'Enter the current mileage (km)',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Update',
                        onPress: (value) => {
                          if (value) {
                            setNewMileage(value);
                            handleUpdateMileage();
                          }
                        },
                      },
                    ],
                    'plain-text',
                    vehicle.currentMileage.toString(),
                  );
                }}
                accessibilityLabel="Update mileage"
              >
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
              Engine
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {vehicle.engineType || 'Not specified'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
              Transmission
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {vehicle.transmission || 'Not specified'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
              Color
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {vehicle.color || 'Not specified'}
            </Text>
          </View>
        </View>
      </Card>
      
      {/* Recent Maintenance */}
      <Card
        title="Recent Maintenance"
        headerRight={
          <TouchableOpacity
            onPress={handleViewMaintenanceHistory}
            accessibilityLabel="View all maintenance records"
          >
            <Text style={{ color: theme.colors.primary }}>View All</Text>
          </TouchableOpacity>
        }
      >
        {maintenanceRecords.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="construct-outline"
              size={48}
              color={theme.colors.text}
              style={{ opacity: 0.5 }}
            />
            <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>
              No maintenance records yet
            </Text>
            <Button
              title="Add Service Record"
              onPress={handleAddMaintenanceRecord}
              type="primary"
              size="small"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          <View style={styles.maintenanceList}>
            {maintenanceRecords.slice(0, 3).map((record) => (
              <TouchableOpacity
                key={record.id}
                style={[
                  styles.maintenanceItem,
                  { borderColor: theme.colors.border },
                ]}
                onPress={() => navigation.navigate('MaintenanceHistory', { vehicleId })}
              >
                <View style={styles.maintenanceHeader}>
                  <Text
                    style={[styles.maintenanceType, { color: theme.colors.text }]}
                    numberOfLines={1}
                  >
                    {record.serviceType}
                  </Text>
                  <Text style={[styles.maintenanceDate, { color: theme.colors.text }]}>
                    {formatDate(new Date(record.date))}
                  </Text>
                </View>
                <Text
                  style={[styles.maintenanceDescription, { color: theme.colors.text }]}
                  numberOfLines={2}
                >
                  {record.description}
                </Text>
                <View style={styles.maintenanceFooter}>
                  <Text style={[styles.maintenanceMileage, { color: theme.colors.text }]}>
                    {record.mileage.toLocaleString()} km
                  </Text>
                  <Text style={[styles.maintenanceCost, { color: theme.colors.primary }]}>
                    KSh {record.cost.toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Card>
      
      {/* Upcoming Maintenance */}
      <Card title="Upcoming Maintenance">
        {reminders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="calendar-outline"
              size={48}
              color={theme.colors.text}
              style={{ opacity: 0.5 }}
            />
            <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>
              No upcoming maintenance scheduled
            </Text>
            <Button
              title="Add Reminder"
              onPress={handleAddReminder}
              type="primary"
              size="small"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          <View style={styles.remindersList}>
            {/* Reminders would be rendered here */}
          </View>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  header: {
    marginBottom: 20,
  },
  vehicleImageContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  vehiclePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  licensePlate: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  licensePlateText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickAction: {
    alignItems: 'center',
    width: '22%',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    textAlign: 'center',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  detailItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  mileageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  updateButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  maintenanceList: {
    marginTop: 8,
  },
  maintenanceItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  maintenanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  maintenanceType: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  maintenanceDate: {
    fontSize: 14,
  },
  maintenanceDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  maintenanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  maintenanceMileage: {
    fontSize: 14,
  },
  maintenanceCost: {
    fontSize: 14,
    fontWeight: '600',
  },
  remindersList: {
    marginTop: 8,
  },
});

export default VehicleDetailsScreen;
