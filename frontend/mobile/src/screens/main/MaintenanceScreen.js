import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Alert
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SIZES } from '../../config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MaintenanceScreen = ({ navigation }) => {
  const { authAxios } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);
  const [completedMaintenance, setCompletedMaintenance] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch user's vehicles
      const vehiclesRes = await authAxios.get('/vehicles');
      const fetchedVehicles = vehiclesRes.data.data.vehicles;
      setVehicles(fetchedVehicles);

      // If vehicles exist, select first one and load its data
      if (fetchedVehicles.length > 0) {
        const firstVehicle = fetchedVehicles[0];
        setSelectedVehicle(firstVehicle);
        
        // Load maintenance data
        await loadMaintenanceData(firstVehicle._id);
      }
    } catch (error) {
      console.error('Error loading maintenance data:', error);
      Alert.alert(
        'Error',
        'Failed to load maintenance data. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMaintenanceData = async (vehicleId) => {
    try {
      // Load upcoming maintenance
      const upcomingRes = await authAxios.get('/maintenance/upcoming');
      const upcomingItems = upcomingRes.data.data.upcomingMaintenance
        .filter(item => item.vehicleId === vehicleId);
      
      setUpcomingMaintenance(upcomingItems);
      
      // Load maintenance history for this vehicle
      const historyRes = await authAxios.get(`/maintenance/${vehicleId}`);
      const historyItems = historyRes.data.data.maintenanceRecords
        .filter(item => item.status === 'completed')
        .slice(0, 5); // Get latest 5 completed items
      
      setCompletedMaintenance(historyItems);
    } catch (error) {
      console.error('Error loading maintenance data for vehicle:', error);
      throw error;
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleVehicleSelect = async (vehicle) => {
    setSelectedVehicle(vehicle);
    try {
      await loadMaintenanceData(vehicle._id);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to load maintenance data for this vehicle. Please try again.'
      );
    }
  };

  const handleScheduleService = (maintenanceItem) => {
    navigation.navigate('ScheduleService', { 
      vehicleId: selectedVehicle._id,
      maintenanceItem
    });
  };

  const handleRemindMe = (maintenanceItem) => {
    // This would integrate with the device's reminder/calendar system
    Alert.alert(
      'Reminder Set',
      `We'll remind you about ${maintenanceItem.title} when it's due.`
    );
  };

  const handleViewDetails = (maintenanceItem) => {
    navigation.navigate('ServiceDetails', { 
      recordId: maintenanceItem._id 
    });
  };

  const getEstimatedCostRange = (maintenanceItem) => {
    // This is a placeholder - in a real app this would use more sophisticated calculation
    const maintenanceTypes = {
      oil_change: { min: 45, max: 65 },
      tire_rotation: { min: 25, max: 40 },
      brake_service: { min: 150, max: 350 },
      inspection: { min: 50, max: 100 },
      repair: { min: 200, max: 500 },
      other: { min: 50, max: 150 }
    };
    
    return maintenanceTypes[maintenanceItem.type] || { min: 50, max: 150 };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading maintenance data...</Text>
      </View>
    );
  }

  if (vehicles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.headerTitle}>Maintenance Dashboard</Text>
        <View style={styles.emptyStateContainer}>
          <Icon name="car-off" size={80} color={COLORS.gray} />
          <Text style={styles.emptyStateTitle}>No Vehicles Found</Text>
          <Text style={styles.emptyStateText}>
            Add your first vehicle to track maintenance.
          </Text>
          <TouchableOpacity
            style={styles.addVehicleButton}
            onPress={() => navigation.navigate('AddVehicle')}
          >
            <Text style={styles.addVehicleButtonText}>Add Vehicle</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Maintenance Dashboard</Text>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.vehicleSelectorContainer}>
          <TouchableOpacity 
            style={styles.vehicleSelector}
            onPress={() => {
              // Show vehicle selector dropdown or modal
              // For now, just cycle through vehicles as an example
              if (vehicles.length > 1) {
                const currentIndex = vehicles.findIndex(v => v._id === selectedVehicle._id);
                const nextIndex = (currentIndex + 1) % vehicles.length;
                handleVehicleSelect(vehicles[nextIndex]);
              }
            }}
          >
            <Text style={styles.vehicleSelectorText}>
              {selectedVehicle ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}${selectedVehicle.nickname ? ` (${selectedVehicle.nickname})` : ''}` : 'Select Vehicle'}
            </Text>
            <Icon name="chevron-down" size={20} color={COLORS.dark} />
          </TouchableOpacity>
        </View>

        <View style={styles.maintenanceContainer}>
          <Text style={styles.sectionTitle}>Upcoming Maintenance</Text>
          
          {upcomingMaintenance.length === 0 ? (
            <View style={styles.emptyMaintenanceContainer}>
              <Icon name="check-circle" size={40} color={COLORS.success} />
              <Text style={styles.emptyMaintenanceText}>
                No upcoming maintenance needed
              </Text>
            </View>
          ) : (
            upcomingMaintenance.map((item, index) => {
              const costEstimate = getEstimatedCostRange(item);
              return (
                <View key={index} style={styles.maintenanceItem}>
                  <View style={styles.maintenanceIcon}>
                    {item.type === 'oil_change' && <Icon name="oil" size={24} color={COLORS.primary} />}
                    {item.type === 'tire_rotation' && <Icon name="tire" size={24} color={COLORS.primary} />}
                    {item.type === 'brake_service' && <Icon name="car-brake-abs" size={24} color={COLORS.primary} />}
                    {item.type === 'inspection' && <Icon name="magnify" size={24} color={COLORS.primary} />}
                    {item.type === 'repair' && <Icon name="wrench" size={24} color={COLORS.primary} />}
                    {item.type === 'other' && <Icon name="tools" size={24} color={COLORS.primary} />}
                  </View>
                  <View style={styles.maintenanceContent}>
                    <Text style={styles.maintenanceTitle}>{item.title}</Text>
                    
                    <Text style={styles.maintenanceDue}>
                      Due in: {item.reminder.dueMileage 
                        ? `${item.reminder.dueMileage - selectedVehicle.mileage.current} miles` 
                        : `${new Date(item.reminder.dueDate).toLocaleDateString()}`}
                    </Text>
                    
                    <Text style={styles.maintenanceCost}>
                      Est. Cost: ${costEstimate.min}-{costEstimate.max}
                    </Text>
                    
                    <View style={styles.maintenanceActions}>
                      <TouchableOpacity 
                        style={styles.maintenanceActionButton}
                        onPress={() => handleScheduleService(item)}
                      >
                        <Text style={styles.maintenanceActionButtonText}>Schedule Service</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.maintenanceActionButton, styles.secondaryButton]}
                        onPress={() => handleRemindMe(item)}
                      >
                        <Text style={styles.secondaryButtonText}>Remind Me</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
          
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('AddService', { vehicleId: selectedVehicle._id })}
            >
              <Icon name="plus" size={18} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Add Service</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.outlineButton]}
              onPress={() => navigation.navigate('ServiceHistory', { vehicleId: selectedVehicle._id })}
            >
              <Icon name="history" size={18} color={COLORS.primary} />
              <Text style={styles.outlineButtonText}>View History</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Recent Service History</Text>
          
          {completedMaintenance.length === 0 ? (
            <View style={styles.emptyMaintenanceContainer}>
              <Icon name="history" size={40} color={COLORS.gray} />
              <Text style={styles.emptyMaintenanceText}>
                No service history yet
              </Text>
            </View>
          ) : (
            completedMaintenance.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyItemHeader}>
                  <Text style={styles.historyItemTitle}>{item.title}</Text>
                  <Text style={styles.historyItemDate}>
                    {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.historyItemDetails}>
                  <Text style={styles.historyItemDetail}>
                    <Text style={styles.detailLabel}>Mileage:</Text> {item.mileage.toLocaleString()}
                  </Text>
                  
                  <Text style={styles.historyItemDetail}>
                    <Text style={styles.detailLabel}>Cost:</Text> ${item.cost.amount}
                  </Text>
                  
                  {item.serviceProvider && item.serviceProvider.name && (
                    <Text style={styles.historyItemDetail}>
                      <Text style={styles.detailLabel}>Provider:</Text> {item.serviceProvider.name}
                    </Text>
                  )}
                </View>
                
                <View style={styles.historyItemActions}>
                  {item.receipts && item.receipts.length > 0 && (
                    <TouchableOpacity 
                      style={styles.historyItemButton}
                      onPress={() => {
                        // View receipt
                      }}
                    >
                      <Text style={styles.historyItemButtonText}>Receipt</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={styles.historyItemButton}
                    onPress={() => handleViewDetails(item)}
                  >
                    <Text style={styles.historyItemButtonText}>Details</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.historyItemButton}
                    onPress={() => {
                      // Share service history
                    }}
                  >
                    <Text style={styles.historyItemButtonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          
          {completedMaintenance.length > 0 && (
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('ServiceHistory', { vehicleId: selectedVehicle._id })}
            >
              <Text style={styles.viewAllButtonText}>View Full History</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.gray,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  scrollView: {
    flex: 1,
  },
  vehicleSelectorContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  vehicleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  vehicleSelectorText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  maintenanceContainer: {
    padding: SIZES.padding,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.dark,
  },
  maintenanceItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  maintenanceIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grayLight,
    borderRadius: 25,
    marginRight: 15,
  },
  maintenanceContent: {
    flex: 1,
  },
  maintenanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 5,
  },
  maintenanceDue: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 5,
  },
  maintenanceCost: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 10,
  },
  maintenanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  maintenanceActionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  maintenanceActionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyMaintenanceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    marginBottom: 15,
  },
  emptyMaintenanceText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.gray,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  outlineButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.grayLight,
    marginVertical: 20,
  },
  historyItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    flex: 1,
  },
  historyItemDate: {
    fontSize: 14,
    color: COLORS.gray,
  },
  historyItemDetails: {
    marginBottom: 10,
  },
  historyItemDetail: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
  },
  historyItemActions: {
    flexDirection: 'row',
  },
  historyItemButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: 5,
    marginRight: 10,
  },
  historyItemButtonText: {
    fontSize: 14,
    color: COLORS.dark,
  },
  viewAllButton: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: 5,
  },
  viewAllButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  addVehicleButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  addVehicleButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MaintenanceScreen;
