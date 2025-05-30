import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { HomeScreenNavigationProp } from '../../types/navigation';
import { VehicleService } from '../../services/VehicleService';
import { MaintenanceService } from '../../services/MaintenanceService';
import { Vehicle, MaintenanceRecord } from '../../types/models';
import { formatDate, isServiceDue } from '../../utils/helpers';

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { width } = useWindowDimensions();
  
  const [refreshing, setRefreshing] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [upcomingServices, setUpcomingServices] = useState<{
    vehicle: Vehicle;
    service: MaintenanceRecord;
    dueInfo: { isDue: boolean; kmRemaining: number };
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load user's vehicles
      const userVehicles = await VehicleService.getVehicles(user.id);
      setVehicles(userVehicles);
      
      // Load upcoming services for each vehicle
      const services: {
        vehicle: Vehicle;
        service: MaintenanceRecord;
        dueInfo: { isDue: boolean; kmRemaining: number };
      }[] = [];
      
      for (const vehicle of userVehicles) {
        const maintenanceRecords = await MaintenanceService.getMaintenanceRecords(vehicle.id);
        
        // For each vehicle, find the most recent oil change service
        // In a real app, we would have a more sophisticated algorithm for different service types
        const oilChangeRecords = maintenanceRecords.filter(
          record => record.serviceType.toLowerCase().includes('oil change')
        );
        
        if (oilChangeRecords.length > 0) {
          // Sort by date (most recent first)
          oilChangeRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          const lastOilChange = oilChangeRecords[0];
          const nextServiceMileage = lastOilChange.mileage + 5000; // Assuming 5000 km interval
          
          const dueInfo = isServiceDue(vehicle.currentMileage, nextServiceMileage);
          
          services.push({
            vehicle,
            service: lastOilChange,
            dueInfo,
          });
        }
      }
      
      // Sort by urgency (due first, then by remaining km)
      services.sort((a, b) => {
        if (a.dueInfo.isDue && !b.dueInfo.isDue) return -1;
        if (!a.dueInfo.isDue && b.dueInfo.isDue) return 1;
        return a.dueInfo.kmRemaining - b.dueInfo.kmRemaining;
      });
      
      setUpcomingServices(services);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
      showToast({
        message: "Dashboard refreshed",
        type: "success",
        duration: 1500,
        position: "bottom"
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      showToast({
        message: "Failed to refresh dashboard",
        type: "error",
        duration: 2000,
        position: "bottom"
      });
    } finally {
      setRefreshing(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centered}>
          <Text style={[styles.message, { color: theme.colors.text }]}>
            Please sign in to access GariLink
          </Text>
          <Button
            title="Sign In"
            onPress={() => navigation.navigate('ProfileTab', { screen: 'UserProfile' })}
            type="primary"
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.text }]}>
              Hello, {user.name.split(' ')[0]}
            </Text>
            <Text style={[styles.subGreeting, { color: theme.colors.text }]}>
              Welcome back to GariLink!
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate('Notifications')}
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('VehicleTab', { screen: 'VehicleList' })}
              accessibilityLabel="My Vehicles"
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="car" size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                My Vehicles
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('ServicesTab', { screen: 'ServicesList' })}
              accessibilityLabel="Find Services"
            >
              <View
                style={[styles.quickActionIcon, { backgroundColor: theme.colors.secondary }]}
              >
                <Ionicons name="construct" size={24} color="#1D3557" />
              </View>
              <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                Find Services
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('CommunityTab', { screen: 'Groups' })}
              accessibilityLabel="Community"
            >
              <View
                style={[styles.quickActionIcon, { backgroundColor: theme.colors.notification }]}
              >
                <Ionicons name="people" size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                Community
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* My Vehicles Summary */}
        <Card
          title="My Vehicles"
          headerRight={
            <TouchableOpacity
              onPress={() => navigation.navigate('VehicleTab', { screen: 'VehicleList' })}
              accessibilityLabel="View all vehicles"
            >
              <Text style={{ color: theme.colors.primary }}>View All</Text>
            </TouchableOpacity>
          }
          isLoading={loading && !refreshing}
        >
          {vehicles.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="car-outline"
                size={48}
                color={theme.colors.text}
                style={{ opacity: 0.5 }}
              />
              <Text
                style={[styles.emptyStateText, { color: theme.colors.text }]}
              >
                No vehicles added yet
              </Text>
              <Button
                title="Add Vehicle"
                onPress={() => navigation.navigate('AddVehicle')}
                type="primary"
                size="small"
                style={{ marginTop: 10 }}
              />
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.vehiclesContainer}
            >
              {vehicles.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.id}
                  style={[
                    styles.vehicleCard,
                    { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                    { width: width * 0.7 },
                  ]}
                  onPress={() =>
                    navigation.navigate('VehicleTab', {
                      screen: 'VehicleDetails',
                      params: { vehicleId: vehicle.id },
                    })
                  }
                  accessibilityLabel={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                >
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
                        <Ionicons name="car" size={36} color={theme.colors.text} />
                      </View>
                    )}
                  </View>
                  <View style={styles.vehicleInfo}>
                    <Text
                      style={[styles.vehicleName, { color: theme.colors.text }]}
                      numberOfLines={1}
                    >
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </Text>
                    <Text
                      style={[styles.vehicleMileage, { color: theme.colors.text }]}
                    >
                      {vehicle.currentMileage.toLocaleString()} km
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.addVehicleCard,
                  {
                    backgroundColor: theme.dark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                    borderColor: theme.colors.border,
                    width: width * 0.3,
                  },
                ]}
                onPress={() => navigation.navigate('AddVehicle')}
                accessibilityLabel="Add a new vehicle"
              >
                <Ionicons
                  name="add-circle"
                  size={36}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.addVehicleText,
                    { color: theme.colors.text },
                  ]}
                >
                  Add Vehicle
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </Card>

        {/* Upcoming Maintenance */}
        <Card
          title="Upcoming Maintenance"
          isLoading={loading && !refreshing}
        >
          {upcomingServices.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="checkmark-circle-outline"
                size={48}
                color={theme.colors.success}
                style={{ opacity: 0.7 }}
              />
              <Text
                style={[styles.emptyStateText, { color: theme.colors.text }]}
              >
                No upcoming maintenance required
              </Text>
            </View>
          ) : (
            <View style={styles.maintenanceList}>
              {upcomingServices.slice(0, 3).map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.maintenanceItem,
                    {
                      backgroundColor: item.dueInfo.isDue
                        ? theme.dark
                          ? 'rgba(230, 57, 70, 0.2)'
                          : 'rgba(230, 57, 70, 0.1)'
                        : theme.colors.card,
                      borderColor: item.dueInfo.isDue
                        ? theme.colors.error
                        : theme.colors.border,
                    },
                  ]}
                  onPress={() =>
                    navigation.navigate('VehicleTab', {
                      screen: 'VehicleDetails',
                      params: { vehicleId: item.vehicle.id },
                    })
                  }
                >
                  <View style={styles.maintenanceInfo}>
                    <Text
                      style={[
                        styles.maintenanceVehicle,
                        { color: theme.colors.text },
                      ]}
                      numberOfLines={1}
                    >
                      {item.vehicle.year} {item.vehicle.make} {item.vehicle.model}
                    </Text>
                    <Text
                      style={[
                        styles.maintenanceType,
                        {
                          color: item.dueInfo.isDue
                            ? theme.colors.error
                            : theme.colors.text,
                        },
                      ]}
                    >
                      {item.service.serviceType}
                    </Text>
                    <Text
                      style={[
                        styles.maintenanceDetails,
                        { color: theme.colors.text },
                      ]}
                    >
                      Last service: {formatDate(new Date(item.service.date))} at{' '}
                      {item.service.mileage.toLocaleString()} km
                    </Text>
                  </View>
                  <View style={styles.maintenanceStatus}>
                    {item.dueInfo.isDue ? (
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: theme.colors.error },
                        ]}
                      >
                        <Text style={styles.statusText}>Overdue</Text>
                      </View>
                    ) : (
                      <Text
                        style={[
                          styles.maintenanceRemaining,
                          { color: theme.colors.text },
                        ]}
                      >
                        {item.dueInfo.kmRemaining.toLocaleString()} km left
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subGreeting: {
    fontSize: 16,
    opacity: 0.8,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  quickAction: {
    alignItems: 'center',
    width: '30%',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    textAlign: 'center',
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
  vehiclesContainer: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  vehicleCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 12,
  },
  vehicleImageContainer: {
    height: 120,
    width: '100%',
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
  vehicleInfo: {
    padding: 12,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  vehicleMileage: {
    fontSize: 14,
  },
  addVehicleCard: {
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  addVehicleText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  maintenanceList: {
    marginVertical: 8,
  },
  maintenanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  maintenanceInfo: {
    flex: 1,
    marginRight: 8,
  },
  maintenanceVehicle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  maintenanceType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  maintenanceDetails: {
    fontSize: 12,
  },
  maintenanceStatus: {
    alignItems: 'flex-end',
  },
  maintenanceRemaining: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default HomeScreen;
