import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vehicle } from '../types/models';
import { generateId } from '../utils/helpers';

// Storage keys
const VEHICLES_STORAGE_KEY = '@garilink:vehicles';

/**
 * Service for managing vehicle data in local storage
 */
export const VehicleService = {
  /**
   * Get all vehicles for a user
   * @param userId The user ID
   * @returns Promise resolving to an array of vehicles
   */
  getVehicles: async (userId: string): Promise<Vehicle[]> => {
    try {
      const data = await AsyncStorage.getItem(VEHICLES_STORAGE_KEY);
      if (data) {
        const allVehicles: Vehicle[] = JSON.parse(data);
        return allVehicles.filter(vehicle => vehicle.userId === userId);
      }
      return [];
    } catch (error) {
      console.error('Error getting vehicles:', error);
      throw error;
    }
  },

  /**
   * Get a vehicle by ID
   * @param vehicleId The vehicle ID
   * @returns Promise resolving to a vehicle or null if not found
   */
  getVehicleById: async (vehicleId: string): Promise<Vehicle | null> => {
    try {
      const data = await AsyncStorage.getItem(VEHICLES_STORAGE_KEY);
      if (data) {
        const vehicles: Vehicle[] = JSON.parse(data);
        return vehicles.find(vehicle => vehicle.id === vehicleId) || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting vehicle by ID:', error);
      throw error;
    }
  },

  /**
   * Add a new vehicle
   * @param vehicle The vehicle to add (without ID)
   * @returns Promise resolving to the created vehicle with ID
   */
  addVehicle: async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    try {
      const newVehicle: Vehicle = {
        ...vehicle,
        id: generateId(),
      };

      const data = await AsyncStorage.getItem(VEHICLES_STORAGE_KEY);
      let vehicles: Vehicle[] = [];
      
      if (data) {
        vehicles = JSON.parse(data);
      }
      
      vehicles.push(newVehicle);
      await AsyncStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
      
      return newVehicle;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw error;
    }
  },

  /**
   * Update an existing vehicle
   * @param updatedVehicle The updated vehicle data
   * @returns Promise resolving to the updated vehicle
   */
  updateVehicle: async (updatedVehicle: Vehicle): Promise<Vehicle> => {
    try {
      const data = await AsyncStorage.getItem(VEHICLES_STORAGE_KEY);
      if (!data) {
        throw new Error('No vehicles found');
      }

      let vehicles: Vehicle[] = JSON.parse(data);
      
      const index = vehicles.findIndex(v => v.id === updatedVehicle.id);
      if (index === -1) {
        throw new Error('Vehicle not found');
      }
      
      vehicles[index] = updatedVehicle;
      await AsyncStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
      
      return updatedVehicle;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  },

  /**
   * Delete a vehicle
   * @param vehicleId The ID of the vehicle to delete
   * @returns Promise resolving to boolean indicating success
   */
  deleteVehicle: async (vehicleId: string): Promise<boolean> => {
    try {
      const data = await AsyncStorage.getItem(VEHICLES_STORAGE_KEY);
      if (!data) {
        return false;
      }

      let vehicles: Vehicle[] = JSON.parse(data);
      vehicles = vehicles.filter(vehicle => vehicle.id !== vehicleId);
      
      await AsyncStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
      return true;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  },

  /**
   * Update vehicle mileage
   * @param vehicleId The vehicle ID
   * @param newMileage The new mileage value
   * @returns Promise resolving to the updated vehicle
   */
  updateMileage: async (vehicleId: string, newMileage: number): Promise<Vehicle> => {
    try {
      const data = await AsyncStorage.getItem(VEHICLES_STORAGE_KEY);
      if (!data) {
        throw new Error('No vehicles found');
      }

      let vehicles: Vehicle[] = JSON.parse(data);
      
      const index = vehicles.findIndex(v => v.id === vehicleId);
      if (index === -1) {
        throw new Error('Vehicle not found');
      }
      
      vehicles[index] = {
        ...vehicles[index],
        currentMileage: newMileage,
      };
      
      await AsyncStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
      
      return vehicles[index];
    } catch (error) {
      console.error('Error updating mileage:', error);
      throw error;
    }
  },
};
