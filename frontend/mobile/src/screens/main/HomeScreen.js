import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SIZES } from '../../config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation }) => {
  const { currentUser, authAxios } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleHealth, setVehicleHealth] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);

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
        
        // Load vehicle health if OBD is connected
        if (firstVehicle.obd && firstVehicle.obd.connected) {
          const healthRes = await authAxios.get(`/obd/${firstVehicle._id}/health`);
          setVehicleHealth(healthRes.data.data);
        }
        
        // Load upcoming maintenance
        const maintenanceRes = await authAxios.get('/maintenance/upcoming');
        const upcomingItems = maintenanceRes.data.data.upcomingMaintenance
          .filter(item => item.vehicleId === firstVehicle._id)
          .slice(0, 3); // Limit to 3 items
        
        setUpcomingMaintenance(upcomingItems);
        
        // Generate alerts based on vehicle health and maintenance
        const newAlerts = [];
        
        // Add alerts from health issues
        if (vehicleHealth && vehicleHealth.deductions) {
          vehicleHealth.deductions.forEach(deduction => {
            newAlerts.push({
              type: 'health',
              icon: '⚠️',
              title: deduction.reason,
              description: `Health score reduced by ${deduction.points} points`
            });
          });
        }
        
        // Add alerts from upcoming maintenance
        upcomingItems.forEach(item => {
          newAlerts.push({
            type: 'maintenance',
            icon: '🔧',
            title: item.title,
            description: item.milesRemaining 
              ? `Due in ~${item.milesRemaining} miles`
              : `Due on ${new Date(item.reminder.dueDate).toLocaleDateString()}`
          });
        });
        
        setAlerts(newAlerts);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleVehicleSelect = async (vehicle) => {
    setSelectedVehicle(vehicle);
    
    // Load vehicle health if OBD is connected
    if (vehicle.obd && vehicle.obd.connected) {
      try {
        const healthRes = await authAxios.get(`/obd/${vehicle._id}/health`);
        setVehicleHealth(healthRes.data.data);
      } catch (error) {
        console.error('Error loading vehicle health:', error);
        setVehicleHealth(null);
      }
    } else {
      setVehicleHealth(null);
    }
    
    // Load upcoming maintenance for this vehicle
    try {
      const maintenanceRes = await authAxios.get('/maintenance/upcoming');
      const upcomingItems = maintenanceRes.data.data.upcomingMaintenance
        .filter(item => item.vehicleId === vehicle._id)
        .slice(0, 3); // Limit to 3 items
      
      setUpcomingMaintenance(upcomingItems);
      
      // Update alerts
      const newAlerts = [];
      
      // Add alerts from health issues
      if (vehicleHealth && vehicleHealth.deductions) {
        vehicleHealth.deductions.forEach(deduction => {
          newAlerts.push({
            type: 'health',
            icon: '⚠️',
            title: deduction.reason,
            description: `Health score reduced by ${deduction.points} points`
          });
        });
      }
      
      // Add alerts from upcoming maintenance
      upcomingItems.forEach(item => {
        newAlerts.push({
          type: 'maintenance',
          icon: '🔧',
          title: item.title,
          description: item.milesRemaining 
            ? `Due in ~${item.milesRemaining} miles`
            : `Due on ${new Date(item.reminder.dueDate).toLocaleDateString()}`
        });
      });
      
      setAlerts(newAlerts);
    } catch (error) {
      console.error('Error loading upcoming maintenance:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (vehicles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.headerTitle}>GariLink</Text>
        <View style={styles.emptyStateContainer}>
          <Icon name="car-off" size={80} color={COLORS.gray} />
          <Text style={styles.emptyStateTitle}>No Vehicles Found</Text>
          <Text style={styles.emptyStateText}>
            Add your first vehicle to get started with GariLink.
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
        <Text style={styles.headerTitle}>GariLink</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="bell" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="account" size={24} color={COLORS.dark} />
          </TouchableOpacity>
        </View>
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

        <View style={styles.vehicleImageContainer}>
          <Image
            source={{ uri: selectedVehicle.photos && selectedVehicle.photos.length > 0 
              ? selectedVehicle.photos[0].url 
              : 'https://via.placeholder.com/300x200?text=Vehicle+Image' }}
            style={styles.vehicleImage}
            resizeMode="cover"
          />
          <Text style={styles.vehicleName}>
            {`${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}${selectedVehicle.nickname ? ` (${selectedVehicle.nickname})` : ''}`}
          </Text>
        </View>

        <View style={styles.healthContainer}>
          <Text style={styles.sectionTitle}>Vehicle Health</Text>
          <View style={styles.healthBarContainer}>
            <View 
              style={[
                styles.healthBar, 
                { width: `${vehicleHealth ? vehicleHealth.healthScore : 85}%` }
              ]} 
            />
            <Text style={styles.healthScore}>
              {vehicleHealth ? vehicleHealth.healthScore : 85}%
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {selectedVehicle.mileage ? selectedVehicle.mileage.current.toLocaleString() : '0'}
            </Text>
            <Text style={styles.statLabel}>Mileage</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {upcomingMaintenance.length > 0 
                ? new Date(upcomingMaintenance[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'N/A'}
            </Text>
            <Text style={styles.statLabel}>Last Serv</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              ${upcomingMaintenance.length > 0 
                ? upcomingMaintenance[0].cost.amount
                : '0'}
            </Text>
            <Text style={styles.statLabel}>Next Serv Estimate</Text>
          </View>
        </View>

        <View style={styles.alertsContainer}>
          <Text style={styles.sectionTitle}>
            Alerts & Notifications ({alerts.length})
          </Text>
          
          {alerts.length === 0 ? (
            <View style={styles.emptyAlertsContainer}>
              <Icon name="check-circle" size={40} color={COLORS.success} />
              <Text style={styles.emptyAlertsText}>
                No alerts at this time
              </Text>
            </View>
          ) : (
            alerts.map((alert, index) => (
              <View key={index} style={styles.alertItem}>
                <Text style={styles.alertIcon}>{alert.icon}</Text>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertDescription}>
                    {alert.description}
                  </Text>
                </View>
              </View>
            ))
          )}
          
          {alerts.length > 0 && (
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Maintenance')}
            >
              <Text style={styles.viewAllButtonText}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('VehicleInfo', { vehicle: selectedVehicle })}
            >
              <Icon name="car" size={28} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Vehicle Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('ServiceHistory', { vehicleId: selectedVehicle._id })}
            >
              <Icon name="history" size={28} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Service History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('AddService', { vehicleId: selectedVehicle._id })}
            >
              <Icon name="plus-circle" size={28} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Add Service</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionItem}
              onPress={() => navigation.navigate('ObdDashboard', { vehicleId: selectedVehicle._id })}
            >
              <Icon name="engine" size={28} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Diagnostics</Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
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
  vehicleImageContainer: {
    marginVertical: 15,
    paddingHorizontal: SIZES.padding,
    alignItems: 'center',
  },
  vehicleImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  vehicleName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  healthContainer: {
    marginHorizontal: SIZES.padding,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.dark,
  },
  healthBarContainer: {
    height: 20,
    backgroundColor: COLORS.grayLight,
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthBar: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 10,
  },
  healthScore: {
    position: 'absolute',
    right: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: SIZES.padding,
    marginVertical: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: COLORS.white,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 5,
  },
  alertsContainer: {
    marginHorizontal: SIZES.padding,
    marginVertical: 10,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  alertIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  alertDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 5,
  },
  emptyAlertsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  emptyAlertsText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.gray,
  },
  viewAllButton: {
    alignItems: 'center',
    padding: 10,
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
  quickActionsContainer: {
    marginHorizontal: SIZES.padding,
    marginVertical: 15,
    marginBottom: 30,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    color: COLORS.dark,
    marginTop: 10,
    textAlign: 'center',
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

export default HomeScreen;
