import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaintenanceRecord } from '../types/models';
import { generateId } from '../utils/helpers';

// Storage keys
const MAINTENANCE_RECORDS_STORAGE_KEY = '@garilink:maintenance_records';

/**
 * Service for managing maintenance records in local storage
 */
export const MaintenanceService = {
  /**
   * Get all maintenance records for a vehicle
   * @param vehicleId The vehicle ID
   * @returns Promise resolving to an array of maintenance records
   */
  getMaintenanceRecords: async (vehicleId: string): Promise<MaintenanceRecord[]> => {
    try {
      const data = await AsyncStorage.getItem(MAINTENANCE_RECORDS_STORAGE_KEY);
      if (data) {
        const allRecords: MaintenanceRecord[] = JSON.parse(data);
        return allRecords
          .filter(record => record.vehicleId === vehicleId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
      return [];
    } catch (error) {
      console.error('Error getting maintenance records:', error);
      throw error;
    }
  },

  /**
   * Get a maintenance record by ID
   * @param recordId The maintenance record ID
   * @returns Promise resolving to a maintenance record or null if not found
   */
  getMaintenanceRecordById: async (recordId: string): Promise<MaintenanceRecord | null> => {
    try {
      const data = await AsyncStorage.getItem(MAINTENANCE_RECORDS_STORAGE_KEY);
      if (data) {
        const records: MaintenanceRecord[] = JSON.parse(data);
        return records.find(record => record.id === recordId) || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting maintenance record by ID:', error);
      throw error;
    }
  },

  /**
   * Add a new maintenance record
   * @param record The maintenance record to add (without ID)
   * @returns Promise resolving to the created maintenance record with ID
   */
  addMaintenanceRecord: async (
    record: Omit<MaintenanceRecord, 'id'>
  ): Promise<MaintenanceRecord> => {
    try {
      const newRecord: MaintenanceRecord = {
        ...record,
        id: generateId(),
        date: typeof record.date === 'string' ? new Date(record.date) : record.date,
      };

      const data = await AsyncStorage.getItem(MAINTENANCE_RECORDS_STORAGE_KEY);
      let records: MaintenanceRecord[] = [];
      
      if (data) {
        records = JSON.parse(data);
      }
      
      records.push(newRecord);
      await AsyncStorage.setItem(MAINTENANCE_RECORDS_STORAGE_KEY, JSON.stringify(records));
      
      return newRecord;
    } catch (error) {
      console.error('Error adding maintenance record:', error);
      throw error;
    }
  },

  /**
   * Update an existing maintenance record
   * @param updatedRecord The updated maintenance record data
   * @returns Promise resolving to the updated maintenance record
   */
  updateMaintenanceRecord: async (
    updatedRecord: MaintenanceRecord
  ): Promise<MaintenanceRecord> => {
    try {
      const data = await AsyncStorage.getItem(MAINTENANCE_RECORDS_STORAGE_KEY);
      if (!data) {
        throw new Error('No maintenance records found');
      }

      let records: MaintenanceRecord[] = JSON.parse(data);
      
      const index = records.findIndex(r => r.id === updatedRecord.id);
      if (index === -1) {
        throw new Error('Maintenance record not found');
      }
      
      // Ensure date is properly handled
      const recordToUpdate = {
        ...updatedRecord,
        date: typeof updatedRecord.date === 'string' 
          ? new Date(updatedRecord.date) 
          : updatedRecord.date,
      };
      
      records[index] = recordToUpdate;
      await AsyncStorage.setItem(MAINTENANCE_RECORDS_STORAGE_KEY, JSON.stringify(records));
      
      return recordToUpdate;
    } catch (error) {
      console.error('Error updating maintenance record:', error);
      throw error;
    }
  },

  /**
   * Delete a maintenance record
   * @param recordId The ID of the maintenance record to delete
   * @returns Promise resolving to boolean indicating success
   */
  deleteMaintenanceRecord: async (recordId: string): Promise<boolean> => {
    try {
      const data = await AsyncStorage.getItem(MAINTENANCE_RECORDS_STORAGE_KEY);
      if (!data) {
        return false;
      }

      let records: MaintenanceRecord[] = JSON.parse(data);
      records = records.filter(record => record.id !== recordId);
      
      await AsyncStorage.setItem(MAINTENANCE_RECORDS_STORAGE_KEY, JSON.stringify(records));
      return true;
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
      throw error;
    }
  },

  /**
   * Search maintenance records by service type
   * @param vehicleId The vehicle ID
   * @param searchTerm The search term
   * @returns Promise resolving to filtered maintenance records
   */
  searchMaintenanceRecords: async (
    vehicleId: string,
    searchTerm: string
  ): Promise<MaintenanceRecord[]> => {
    try {
      const records = await this.getMaintenanceRecords(vehicleId);
      const term = searchTerm.toLowerCase().trim();
      
      if (!term) return records;
      
      return records.filter(
        record =>
          record.serviceType.toLowerCase().includes(term) ||
          record.description.toLowerCase().includes(term) ||
          record.location.toLowerCase().includes(term) ||
          (record.performedBy && record.performedBy.toLowerCase().includes(term))
      );
    } catch (error) {
      console.error('Error searching maintenance records:', error);
      throw error;
    }
  },
};
