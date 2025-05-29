import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { VehicleScreenNavigationProp } from '../../types/navigation';
import { Vehicle } from '../../types/models';
import { VehicleService } from '../../services/VehicleService';
import Button from '../../components/Button';
import Card from '../../components/Card';

const VehicleListScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<VehicleScreenNavigationProp>();
  const { user } = useAuth();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadVehicles = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userVehicles = await VehicleService.getVehicles(user.id);
      setVehicles(userVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      Alert.alert('Error', 'Failed to load vehicles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load vehicles when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadVehicles();
    }, [loadVehicles])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVehicles();
    setRefreshing(false);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    Alert.alert(
      'Delete Vehicle',
      `Are you sure you want to delete your ${vehicle.year} ${vehicle.make} ${vehicle.model}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await VehicleService.deleteVehicle(vehicle.id);
              setVehicles(vehicles.filter((v) => v.id !== vehicle.id));
            } catch (error) {
              console.error('Error deleting vehicle:', error);
              Alert.alert('Error', 'Failed to delete vehicle. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.emptyStateContainer}>
          <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>
            Please sign in to manage your vehicles
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            My Vehicles
          </Text>
          <Button
            title="Add Vehicle"
            onPress={() => navigation.navigate('AddVehicle')}
            type="primary"
            size="small"
            leftIcon={<Ionicons name="add" size={16} color="#FFFFFF" />}
          />
        </View>

        {loading && !refreshing ? (
          <Card isLoading={true} />
        ) : vehicles.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons
              name="car-outline"
              size={64}
              color={theme.colors.text}
              style={{ opacity: 0.5 }}
            />
            <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>
              No vehicles added yet
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.colors.text }]}>
              Add your first vehicle to start tracking maintenance and receive service reminders
            </Text>
            <Button
              title="Add Vehicle"
              onPress={() => navigation.navigate('AddVehicle')}
              type="primary"
              style={{ marginTop: 20 }}
            />
          </View>
        ) : (
          vehicles.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.id}
              style={[
                styles.vehicleCard,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => navigation.navigate('VehicleDetails', { vehicleId: vehicle.id })}
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
                    <Ionicons name="car" size={48} color={theme.colors.text} />
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
                <Text style={[styles.vehicleDetails, { color: theme.colors.text }]}>
                  {vehicle.licensePlate ? vehicle.licensePlate : 'No license plate'}
                </Text>
                <Text style={[styles.vehicleMileage, { color: theme.colors.text }]}>
                  {vehicle.currentMileage.toLocaleString()} km
                </Text>
              </View>
              <View style={styles.vehicleActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('EditVehicle', { vehicleId: vehicle.id })}
                  accessibilityLabel={`Edit ${vehicle.make} ${vehicle.model}`}
                >
                  <Ionicons name="create-outline" size={22} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteVehicle(vehicle)}
                  accessibilityLabel={`Delete ${vehicle.make} ${vehicle.model}`}
                >
                  <Ionicons name="trash-outline" size={22} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 16,
  },
  vehicleCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  vehicleImageContainer: {
    height: 160,
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
    padding: 16,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  vehicleMileage: {
    fontSize: 16,
    fontWeight: '500',
  },
  vehicleActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  actionButton: {
    padding: 8,
    marginLeft: 16,
  },
});

export default VehicleListScreen;
