import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  FlatList
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SIZES } from '../../config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ServiceHistoryScreen = ({ route, navigation }) => {
  const { vehicleId } = route.params || {};
  const { authAxios } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'

  useEffect(() => {
    if (vehicleId) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [vehicleId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load vehicle data
      const vehicleRes = await authAxios.get(`/vehicles/${vehicleId}`);
      setVehicle(vehicleRes.data.data.vehicle);
      
      // Load maintenance records
      const maintenanceRes = await authAxios.get(`/maintenance/${vehicleId}`);
      setMaintenanceRecords(maintenanceRes.data.data.maintenanceRecords || []);
    } catch (error) {
      console.error('Error loading service history:', error);
      Alert.alert(
        'Error',
        'Failed to load service history. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getFilteredRecords = () => {
    if (!maintenanceRecords.length) return [];
    
    let filtered = [...maintenanceRecords];
    
    if (filterType !== 'all') {
      filtered = filtered.filter(record => record.type === filterType);
    }
    
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case 'oil_change':
        return <Icon name="oil" size={24} color={COLORS.primary} />;
      case 'tire_rotation':
        return <Icon name="tire" size={24} color={COLORS.primary} />;
      case 'brake_service':
        return <Icon name="car-brake-abs" size={24} color={COLORS.primary} />;
      case 'inspection':
        return <Icon name="magnify" size={24} color={COLORS.primary} />;
      case 'repair':
        return <Icon name="wrench" size={24} color={COLORS.primary} />;
      default:
        return <Icon name="tools" size={24} color={COLORS.primary} />;
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewDetails = (serviceRecord) => {
    navigation.navigate('ServiceDetails', { recordId: serviceRecord._id });
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.serviceItem}
      onPress={() => handleViewDetails(item)}
    >
      <View style={styles.serviceIconContainer}>
        {getServiceIcon(item.type)}
      </View>
      <View style={styles.serviceContent}>
        <Text style={styles.serviceTitle}>{item.title}</Text>
        <View style={styles.serviceDetails}>
          <View style={styles.serviceDetailItem}>
            <Icon name="calendar" size={14} color={COLORS.gray} />
            <Text style={styles.serviceDetailText}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.serviceDetailItem}>
            <Icon name="speedometer" size={14} color={COLORS.gray} />
            <Text style={styles.serviceDetailText}>{item.mileage.toLocaleString()} miles</Text>
          </View>
          {item.cost && (
            <View style={styles.serviceDetailItem}>
              <Icon name="currency-usd" size={14} color={COLORS.gray} />
              <Text style={styles.serviceDetailText}>${item.cost.amount}</Text>
            </View>
          )}
        </View>
        {item.serviceProvider && item.serviceProvider.name && (
          <Text style={styles.serviceProvider}>
            Provider: {item.serviceProvider.name}
          </Text>
        )}
      </View>
      <Icon name="chevron-right" size={20} color={COLORS.gray} />
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading service history...</Text>
      </View>
    );
  }

  if (!vehicle && vehicleId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service History</Text>
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

  const filteredRecords = getFilteredRecords();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service History</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddService', { vehicleId })}>
          <Icon name="plus" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.vehicleInfoContainer}>
        <Text style={styles.vehicleInfoTitle}>
          {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.nickname ? ` (${vehicle.nickname})` : ''}` : 'Unknown Vehicle'}
        </Text>
        {vehicle && vehicle.mileage && (
          <Text style={styles.vehicleInfoSubtitle}>
            Current Mileage: {vehicle.mileage.current.toLocaleString()} miles
          </Text>
        )}
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
          <TouchableOpacity
            style={[styles.filterButton, filterType === 'all' && styles.filterButtonActive]}
            onPress={() => setFilterType('all')}
          >
            <Text style={[styles.filterButtonText, filterType === 'all' && styles.filterButtonTextActive]}>
              All Services
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filterType === 'oil_change' && styles.filterButtonActive]}
            onPress={() => setFilterType('oil_change')}
          >
            <Text style={[styles.filterButtonText, filterType === 'oil_change' && styles.filterButtonTextActive]}>
              Oil Changes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filterType === 'tire_rotation' && styles.filterButtonActive]}
            onPress={() => setFilterType('tire_rotation')}
          >
            <Text style={[styles.filterButtonText, filterType === 'tire_rotation' && styles.filterButtonTextActive]}>
              Tire Services
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filterType === 'brake_service' && styles.filterButtonActive]}
            onPress={() => setFilterType('brake_service')}
          >
            <Text style={[styles.filterButtonText, filterType === 'brake_service' && styles.filterButtonTextActive]}>
              Brake Services
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filterType === 'repair' && styles.filterButtonActive]}
            onPress={() => setFilterType('repair')}
          >
            <Text style={[styles.filterButtonText, filterType === 'repair' && styles.filterButtonTextActive]}>
              Repairs
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filterType === 'inspection' && styles.filterButtonActive]}
            onPress={() => setFilterType('inspection')}
          >
            <Text style={[styles.filterButtonText, filterType === 'inspection' && styles.filterButtonTextActive]}>
              Inspections
            </Text>
          </TouchableOpacity>
        </ScrollView>
        
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={toggleSortOrder}
        >
          <Icon 
            name={sortOrder === 'newest' ? 'sort-calendar-descending' : 'sort-calendar-ascending'} 
            size={20} 
            color={COLORS.dark} 
          />
          <Text style={styles.sortButtonText}>
            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <FlatList
          data={filteredRecords}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderServiceItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="history" size={60} color={COLORS.gray} />
              <Text style={styles.emptyTitle}>No Service Records</Text>
              <Text style={styles.emptyText}>
                {filterType === 'all' 
                  ? "You haven't logged any service records for this vehicle yet." 
                  : `No ${filterType.replace('_', ' ')} services found for this vehicle.`}
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('AddService', { vehicleId })}
              >
                <Text style={styles.emptyButtonText}>Add Service Record</Text>
              </TouchableOpacity>
            </View>
          }
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddService', { vehicleId })}
        >
          <Icon name="plus" size={20} color={COLORS.white} />
          <Text style={styles.addButtonText}>Add Service Record</Text>
        </TouchableOpacity>
      </View>
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
  vehicleInfoContainer: {
    padding: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  vehicleInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  vehicleInfoSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 5,
  },
  filterContainer: {
    paddingVertical: 10,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  filterScrollView: {
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    backgroundColor: COLORS.white,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  filterButtonTextActive: {
    color: COLORS.white,
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  sortButtonText: {
    fontSize: 14,
    color: COLORS.dark,
    marginLeft: 5,
  },
  mainContent: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContentContainer: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 10,
    paddingBottom: 80,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grayLight,
    borderRadius: 20,
    marginRight: 15,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 5,
  },
  serviceDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  serviceDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  serviceDetailText: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 5,
  },
  serviceProvider: {
    fontSize: 14,
    color: COLORS.dark,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  emptyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayLight,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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

export default ServiceHistoryScreen;
