import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE, Region, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '../../context/ThemeContext';
import { ServicesScreenNavigationProp } from '../../types/navigation';
import { ServiceProvider } from '../../types/models';
import { ServiceProviderService } from '../../services/ServiceProviderService';
import Card from '../../components/Card';

const { width, height } = Dimensions.get('window');

// Default region (Nairobi, Kenya)
const NAIROBI_REGION: Region = {
  latitude: -1.286389,
  longitude: 36.817223,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const MapViewScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<ServicesScreenNavigationProp>();
  const mapRef = useRef<MapView>(null);
  
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [region, setRegion] = useState(NAIROBI_REGION);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);

  // Fetch service providers data on mount
  useEffect(() => {
    const loadServiceProviders = async () => {
      try {
        setIsLoading(true);
        const providers = await ServiceProviderService.getServiceProviders();
        setServiceProviders(providers);
      } catch (error) {
        console.error('Error loading service providers:', error);
        Alert.alert('Error', 'Failed to load service providers');
      } finally {
        setIsLoading(false);
      }
    };

    loadServiceProviders();
  }, []);

  // Request location permissions and get user's location
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        setLocatingUser(true);
        
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to show your position on the map.');
          return;
        }
        
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });
        
        // Update region to user's location
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        
        // Animate map to user location
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000);
      } catch (error) {
        console.error('Error getting user location:', error);
        Alert.alert('Location Error', 'Could not get your current location.');
      } finally {
        setLocatingUser(false);
      }
    };

    getUserLocation();
  }, []);

  const handleMarkerPress = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    
    // Animate to the selected provider with some offset for the card
    mapRef.current?.animateToRegion({
      latitude: provider.location.latitude - 0.01,
      longitude: provider.location.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 500);
  };

  const handleProviderCardPress = () => {
    if (selectedProvider) {
      navigation.navigate('ServiceDetails', { serviceId: selectedProvider.id });
    }
  };

  const handleUserLocationPress = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    } else {
      Alert.alert('Location Unavailable', 'Your location is not available.');
    }
  };

  const handleFilterPress = () => {
    navigation.navigate('FilterServices');
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading map data...
          </Text>
        </View>
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            showsUserLocation
            showsMyLocationButton={false}
            showsCompass
            showsScale
            loadingEnabled
            loadingIndicatorColor={theme.colors.primary}
          >
            {serviceProviders.map((provider) => (
              <Marker
                key={provider.id}
                coordinate={{
                  latitude: provider.location.latitude,
                  longitude: provider.location.longitude,
                }}
                title={provider.name}
                description={provider.priceRange}
                onPress={() => handleMarkerPress(provider)}
                pinColor={
                  provider.priceRange === 'Premium' ? 'red' :
                  provider.priceRange === 'Mid-Range' ? 'orange' : 'green'
                }
              >
                <Callout>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{provider.name}</Text>
                    <Text style={styles.calloutSubtitle}>{provider.priceRange}</Text>
                    <Text style={styles.calloutRating}>
                      ★ {provider.rating.toFixed(1)} ({provider.reviewCount} reviews)
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
          
          {/* Back Button */}
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
            ]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          {/* Legend */}
          <View style={[styles.legendContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.legendTitle, { color: theme.colors.text }]}>Price Range</Text>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: 'green' }]} />
              <Text style={[styles.legendText, { color: theme.colors.text }]}>Budget</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: 'orange' }]} />
              <Text style={[styles.legendText, { color: theme.colors.text }]}>Mid-Range</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: 'red' }]} />
              <Text style={[styles.legendText, { color: theme.colors.text }]}>Premium</Text>
            </View>
          </View>
          
          {/* Filter Button */}
          <TouchableOpacity
            style={[
              styles.filterButton,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
            ]}
            onPress={handleFilterPress}
          >
            <Ionicons name="options-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          {/* My Location Button */}
          <TouchableOpacity
            style={[
              styles.myLocationButton,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
            ]}
            onPress={handleUserLocationPress}
          >
            {locatingUser ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Ionicons name="locate" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
          
          {/* Selected Provider Card */}
          {selectedProvider && (
            <TouchableOpacity
              style={styles.providerCardContainer}
              onPress={handleProviderCardPress}
              activeOpacity={0.9}
            >
              <Card style={[styles.providerCard, { borderColor: theme.colors.border }]}>
                <View style={styles.providerCardContent}>
                  <View style={styles.providerInfo}>
                    <View style={styles.nameContainer}>
                      <Text style={[styles.providerName, { color: theme.colors.text }]}>
                        {selectedProvider.name}
                      </Text>
                      {selectedProvider.verified && (
                        <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                      )}
                    </View>
                    <Text style={[styles.providerAddress, { color: theme.colors.textSecondary }]}>
                      {selectedProvider.location.address}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color={theme.colors.warning} />
                      <Text style={[styles.ratingText, { color: theme.colors.text }]}>
                        {selectedProvider.rating.toFixed(1)} ({selectedProvider.reviewCount} reviews)
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.priceAndDistance}>
                    <View style={[
                      styles.priceTag,
                      { 
                        backgroundColor: 
                          selectedProvider.priceRange === 'Premium' ? theme.colors.error + '20' :
                          selectedProvider.priceRange === 'Mid-Range' ? theme.colors.warning + '20' :
                          theme.colors.success + '20',
                        borderColor:
                          selectedProvider.priceRange === 'Premium' ? theme.colors.error :
                          selectedProvider.priceRange === 'Mid-Range' ? theme.colors.warning :
                          theme.colors.success,
                      }
                    ]}>
                      <Text style={[
                        styles.priceText,
                        { 
                          color: 
                            selectedProvider.priceRange === 'Premium' ? theme.colors.error :
                            selectedProvider.priceRange === 'Mid-Range' ? theme.colors.warning :
                            theme.colors.success
                        }
                      ]}>
                        {selectedProvider.priceRange}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.detailsButton, { backgroundColor: theme.colors.primary }]}
                      onPress={handleProviderCardPress}
                    >
                      <Text style={styles.detailsButtonText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  map: {
    width,
    height,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
  },
  filterButton: {
    position: 'absolute',
    bottom: 160,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calloutContainer: {
    width: 150,
    padding: 6,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  calloutSubtitle: {
    fontSize: 12,
  },
  calloutRating: {
    fontSize: 12,
    marginTop: 2,
  },
  providerCardContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    padding: 16,
  },
  providerCard: {
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  providerCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  providerInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  providerAddress: {
    fontSize: 14,
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  priceAndDistance: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
    borderWidth: 1,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MapViewScreen;
