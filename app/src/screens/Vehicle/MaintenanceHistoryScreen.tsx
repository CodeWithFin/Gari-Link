import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { VehicleStackParamList, VehicleScreenNavigationProp } from '../../types/navigation';
import { MaintenanceRecord, Vehicle } from '../../types/models';
import { MaintenanceService } from '../../services/MaintenanceService';
import { VehicleService } from '../../services/VehicleService';
import useDebounce from '../../hooks/useDebounce';
import Button from '../../components/Button';
import { formatDate } from '../../utils/helpers';

type MaintenanceHistoryRouteProp = RouteProp<VehicleStackParamList, 'MaintenanceHistory'>;

const MaintenanceHistoryScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<VehicleScreenNavigationProp>();
  const route = useRoute<MaintenanceHistoryRouteProp>();
  const { vehicleId } = route.params;
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load vehicle details
      const vehicleData = await VehicleService.getVehicleById(vehicleId);
      if (!vehicleData) {
        Alert.alert('Error', 'Vehicle not found');
        navigation.goBack();
        return;
      }
      
      setVehicle(vehicleData);
      
      // Load maintenance records
      const maintenanceRecords = await MaintenanceService.getMaintenanceRecords(vehicleId);
      setRecords(maintenanceRecords);
      setFilteredRecords(maintenanceRecords);
    } catch (error) {
      console.error('Error loading maintenance history:', error);
      Alert.alert('Error', 'Failed to load maintenance history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [vehicleId, navigation]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const debouncedSearch = useDebounce((term: string) => {
    if (!term.trim()) {
      setFilteredRecords(records);
      return;
    }
    
    const filtered = records.filter(
      (record) =>
        record.serviceType.toLowerCase().includes(term.toLowerCase()) ||
        record.description.toLowerCase().includes(term.toLowerCase()) ||
        record.location.toLowerCase().includes(term.toLowerCase()) ||
        (record.performedBy && record.performedBy.toLowerCase().includes(term.toLowerCase()))
    );
    
    setFilteredRecords(filtered);
  }, 300);
  
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, records, debouncedSearch]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  const handleAddMaintenanceRecord = () => {
    navigation.navigate('AddMaintenanceRecord', { vehicleId });
  };
  
  const handleDeleteRecord = (recordId: string) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this maintenance record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await MaintenanceService.deleteMaintenanceRecord(recordId);
              setRecords(records.filter((record) => record.id !== recordId));
              setFilteredRecords(filteredRecords.filter((record) => record.id !== recordId));
            } catch (error) {
              console.error('Error deleting record:', error);
              Alert.alert('Error', 'Failed to delete record. Please try again.');
            }
          },
        },
      ]
    );
  };
  
  const renderItem = ({ item }: { item: MaintenanceRecord }) => (
    <View
      style={[
        styles.recordItem,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
    >
      <View style={styles.recordHeader}>
        <Text style={[styles.recordType, { color: theme.colors.text }]}>
          {item.serviceType}
        </Text>
        <TouchableOpacity
          onPress={() => handleDeleteRecord(item.id)}
          style={styles.deleteButton}
          accessibilityLabel="Delete record"
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.recordDate, { color: theme.colors.text }]}>
        {formatDate(new Date(item.date))} • {item.mileage.toLocaleString()} km
      </Text>
      
      <Text style={[styles.recordDescription, { color: theme.colors.text }]}>
        {item.description}
      </Text>
      
      <View style={styles.recordFooter}>
        <View style={styles.recordLocation}>
          <Ionicons name="location-outline" size={16} color={theme.colors.text} />
          <Text style={[styles.recordLocationText, { color: theme.colors.text }]}>
            {item.location}
          </Text>
        </View>
        
        <Text style={[styles.recordCost, { color: theme.colors.primary }]}>
          KSh {item.cost.toLocaleString()}
        </Text>
      </View>
      
      {item.performedBy && (
        <Text style={[styles.recordPerformedBy, { color: theme.colors.text }]}>
          Performed by: {item.performedBy}
        </Text>
      )}
    </View>
  );
  
  const renderEmpty = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        {searchTerm ? (
          <>
            <Ionicons
              name="search"
              size={48}
              color={theme.colors.text}
              style={{ opacity: 0.5 }}
            />
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              No records match your search
            </Text>
          </>
        ) : (
          <>
            <Ionicons
              name="construct-outline"
              size={48}
              color={theme.colors.text}
              style={{ opacity: 0.5 }}
            />
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              No maintenance records yet
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.text }]}>
              Add your first service record to start tracking maintenance history
            </Text>
          </>
        )}
      </View>
    );
  };
  
  const renderHeader = () => (
    <>
      {vehicle && (
        <View style={styles.vehicleInfo}>
          <Text style={[styles.vehicleName, { color: theme.colors.text }]}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Text>
          <Text style={[styles.vehicleMileage, { color: theme.colors.text }]}>
            Current Mileage: {vehicle.currentMileage.toLocaleString()} km
          </Text>
        </View>
      )}
      
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        ]}
      >
        <Ionicons name="search" size={20} color={theme.colors.text} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search service records..."
          placeholderTextColor={theme.dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'}
          value={searchTerm}
          onChangeText={setSearchTerm}
          accessibilityLabel="Search service records"
        />
        {searchTerm ? (
          <TouchableOpacity
            onPress={() => setSearchTerm('')}
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <View style={styles.statsContainer}>
        <View
          style={[
            styles.statItem,
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {records.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>Records</Text>
        </View>
        
        <View
          style={[
            styles.statItem,
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {records.reduce((sum, record) => sum + record.cost, 0).toLocaleString()}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>Total (KSh)</Text>
        </View>
        
        <View
          style={[
            styles.statItem,
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {records.length > 0
              ? Math.round(
                  records.reduce((sum, record) => sum + record.cost, 0) / records.length
                ).toLocaleString()
              : '0'}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>Avg (KSh)</Text>
        </View>
      </View>
      
      <Button
        title="Add Service Record"
        onPress={handleAddMaintenanceRecord}
        type="primary"
        leftIcon={<Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />}
        style={styles.addButton}
      />
    </>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={filteredRecords}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  vehicleInfo: {
    marginBottom: 16,
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vehicleMileage: {
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    height: 48,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 16,
    height: '100%',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    width: '31%',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  addButton: {
    marginBottom: 20,
  },
  recordItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recordType: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  recordDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  recordDescription: {
    fontSize: 16,
    marginBottom: 12,
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recordLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordLocationText: {
    fontSize: 14,
    marginLeft: 4,
  },
  recordCost: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordPerformedBy: {
    fontSize: 14,
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default MaintenanceHistoryScreen;
