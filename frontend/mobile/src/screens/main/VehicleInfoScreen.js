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
  RefreshControl,
  Dimensions
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SIZES } from '../../config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const VehicleInfoScreen = ({ route, navigation }) => {
  const { vehicleId } = route.params || {};
  const { authAxios } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (vehicleId) {
      loadVehicleData();
    } else if (route.params?.vehicle) {
      setVehicle(route.params.vehicle);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [vehicleId]);

  const loadVehicleData = async () => {
    setLoading(true);
    try {
      const response = await authAxios.get(`/vehicles/${vehicleId}`);
      setVehicle(response.data.data.vehicle);
    } catch (error) {
      console.error('Error loading vehicle data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadVehicleData();
  };

  const handleUpdateMileage = () => {
    navigation.navigate('UpdateMileage', { vehicle });
  };

  const handleViewServiceHistory = () => {
    navigation.navigate('ServiceHistory', { vehicleId: vehicle._id });
  };

  const handleConnectObd = () => {
    navigation.navigate('ObdConnection', { vehicleId: vehicle._id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading vehicle details...</Text>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vehicle Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Icon name="car-off" size={80} color={COLORS.gray} />
          <Text style={styles.errorTitle}>Vehicle Not Found</Text>
          <Text style={styles.errorText}>
            We couldn't find this vehicle. It may have been removed or you may not have permission to view it.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const hasMultiplePhotos = vehicle.photos && vehicle.photos.length > 1;
  const currentPhoto = vehicle.photos && vehicle.photos.length > 0
    ? vehicle.photos[currentPhotoIndex].url
    : 'https://via.placeholder.com/300x200?text=No+Image';

  const fuelTypeLabels = {
    gasoline: 'Gasoline',
    diesel: 'Diesel',
    electric: 'Electric',
    hybrid: 'Hybrid',
    plugin_hybrid: 'Plug-in Hybrid',
    other: 'Other'
  };

  const transmissionLabels = {
    automatic: 'Automatic',
    manual: 'Manual',
    cvt: 'CVT',
    other: 'Other'
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Details</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditVehicle', { vehicle })}>
          <Icon name="pencil" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.photoGalleryContainer}>
          <Image 
            source={{ uri: currentPhoto }}
            style={styles.vehicleImage}
            resizeMode="cover"
          />

          {hasMultiplePhotos && (
            <View style={styles.photoControls}>
              <TouchableOpacity 
                style={styles.photoControlButton}
                onPress={() => setCurrentPhotoIndex((prevIndex) => 
                  prevIndex === 0 ? vehicle.photos.length - 1 : prevIndex - 1
                )}
              >
                <Icon name="chevron-left" size={24} color={COLORS.white} />
              </TouchableOpacity>
              
              <Text style={styles.photoCounter}>
                {currentPhotoIndex + 1} / {vehicle.photos.length}
              </Text>
              
              <TouchableOpacity 
                style={styles.photoControlButton}
                onPress={() => setCurrentPhotoIndex((prevIndex) => 
                  prevIndex === vehicle.photos.length - 1 ? 0 : prevIndex + 1
                )}
              >
                <Icon name="chevron-right" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.vehicleDetailsContainer}>
          <Text style={styles.vehicleName}>
            {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim ? vehicle.trim : ''}
          </Text>
          {vehicle.nickname && (
            <Text style={styles.vehicleNickname}>"{vehicle.nickname}"</Text>
          )}
          
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('EditVehicle', { vehicle })}>
              <Text style={styles.actionButtonText}>Edit Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          
          <View style={styles.infoGrid}>
            {vehicle.licensePlate && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>License Plate</Text>
                <Text style={styles.infoValue}>{vehicle.licensePlate}</Text>
              </View>
            )}
            
            {vehicle.color && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Color</Text>
                <Text style={styles.infoValue}>{vehicle.color}</Text>
              </View>
            )}
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>
                {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>
                {vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1)}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Current Mileage</Text>
              <Text style={styles.infoValue}>
                {vehicle.mileage.current.toLocaleString()} {vehicle.mileage.unit}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>
                {new Date(vehicle.mileage.lastUpdated).toLocaleDateString()}
              </Text>
            </View>
            
            {vehicle.vin && (
              <View style={[styles.infoItem, styles.fullWidthInfoItem]}>
                <Text style={styles.infoLabel}>VIN</Text>
                <Text style={styles.infoValue}>{vehicle.vin}</Text>
              </View>
            )}
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fuel Type</Text>
              <Text style={styles.infoValue}>{fuelTypeLabels[vehicle.fuelType]}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Transmission</Text>
              <Text style={styles.infoValue}>{transmissionLabels[vehicle.transmission]}</Text>
            </View>
            
            {vehicle.engineSize && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Engine Size</Text>
                <Text style={styles.infoValue}>{vehicle.engineSize}L</Text>
              </View>
            )}
          </View>
          
          {/* OBD Status */}
          <View style={styles.obdStatusContainer}>
            <Icon 
              name={vehicle.obd && vehicle.obd.connected ? "wifi" : "wifi-off"} 
              size={24} 
              color={vehicle.obd && vehicle.obd.connected ? COLORS.success : COLORS.gray} 
            />
            <View style={styles.obdStatusText}>
              <Text style={styles.obdStatusTitle}>
                {vehicle.obd && vehicle.obd.connected 
                  ? "OBD-II Device Connected" 
                  : "OBD-II Device Not Connected"}
              </Text>
              {vehicle.obd && vehicle.obd.connected && vehicle.obd.lastConnected && (
                <Text style={styles.obdStatusSubtitle}>
                  Last connected: {new Date(vehicle.obd.lastConnected).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
          
          {/* Insurance Information */}
          {vehicle.insurance && (vehicle.insurance.provider || vehicle.insurance.policyNumber) && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Insurance Information</Text>
              
              <View style={styles.infoGrid}>
                {vehicle.insurance.provider && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Provider</Text>
                    <Text style={styles.infoValue}>{vehicle.insurance.provider}</Text>
                  </View>
                )}
                
                {vehicle.insurance.policyNumber && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Policy Number</Text>
                    <Text style={styles.infoValue}>{vehicle.insurance.policyNumber}</Text>
                  </View>
                )}
                
                {vehicle.insurance.startDate && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Start Date</Text>
                    <Text style={styles.infoValue}>{new Date(vehicle.insurance.startDate).toLocaleDateString()}</Text>
                  </View>
                )}
                
                {vehicle.insurance.endDate && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>End Date</Text>
                    <Text style={styles.infoValue}>{new Date(vehicle.insurance.endDate).toLocaleDateString()}</Text>
                  </View>
                )}
              </View>
            </>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.quickActionButton} onPress={handleUpdateMileage}>
              <Icon name="speedometer" size={28} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Update Mileage</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton} onPress={handleViewServiceHistory}>
              <Icon name="history" size={28} color={COLORS.primary} />
              <Text style={styles.quickActionText}>Service History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton} onPress={handleConnectObd}>
              <Icon name="wifi" size={28} color={COLORS.primary} />
              <Text style={styles.quickActionText}>OBD-II Connect</Text>
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
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  backButton: {
    padding: 5,
  },
  editButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  photoGalleryContainer: {
    position: 'relative',
    width: '100%',
    height: 220,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  photoControls: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  photoControlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCounter: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  vehicleDetailsContainer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
  },
  vehicleName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  vehicleNickname: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 5,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
    marginRight: 10,
  },
  actionButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.grayLight,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.dark,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 15,
  },
  fullWidthInfoItem: {
    width: '100%',
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: '500',
  },
  obdStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.grayLight,
    borderRadius: 8,
    marginTop: 10,
  },
  obdStatusText: {
    marginLeft: 10,
    flex: 1,
  },
  obdStatusTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.dark,
  },
  obdStatusSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 3,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  quickActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    padding: 15,
    backgroundColor: COLORS.grayLight,
    borderRadius: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: COLORS.dark,
    marginTop: 10,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  errorButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VehicleInfoScreen;
