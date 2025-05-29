import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reminder } from '../types/models';
import { generateId } from '../utils/helpers';

// Storage keys
const REMINDERS_STORAGE_KEY = '@garilink:reminders';

/**
 * Service for managing service reminders in local storage
 */
export const ReminderService = {
  /**
   * Get all reminders for a vehicle
   * @param vehicleId The vehicle ID
   * @returns Promise resolving to an array of reminders
   */
  getReminders: async (vehicleId: string): Promise<Reminder[]> => {
    try {
      const data = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
      if (data) {
        const allReminders: Reminder[] = JSON.parse(data);
        return allReminders
          .filter(reminder => reminder.vehicleId === vehicleId)
          .sort((a, b) => {
            // Sort by completion status first, then by priority
            if (a.isCompleted !== b.isCompleted) {
              return a.isCompleted ? 1 : -1;
            }
            
            // Sort by priority for non-completed reminders
            const priorityValues = { 'High': 0, 'Medium': 1, 'Low': 2 };
            return priorityValues[a.priority] - priorityValues[b.priority];
          });
      }
      return [];
    } catch (error) {
      console.error('Error getting reminders:', error);
      throw error;
    }
  },

  /**
   * Get a reminder by ID
   * @param reminderId The reminder ID
   * @returns Promise resolving to a reminder or null if not found
   */
  getReminderById: async (reminderId: string): Promise<Reminder | null> => {
    try {
      const data = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
      if (data) {
        const reminders: Reminder[] = JSON.parse(data);
        return reminders.find(reminder => reminder.id === reminderId) || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting reminder by ID:', error);
      throw error;
    }
  },

  /**
   * Add a new reminder
   * @param reminder The reminder to add (without ID)
   * @returns Promise resolving to the created reminder with ID
   */
  addReminder: async (
    reminder: Omit<Reminder, 'id'>
  ): Promise<Reminder> => {
    try {
      const newReminder: Reminder = {
        ...reminder,
        id: generateId(),
        targetDate: reminder.targetDate && typeof reminder.targetDate === 'string' 
          ? new Date(reminder.targetDate) 
          : reminder.targetDate,
      };

      const data = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
      let reminders: Reminder[] = [];
      
      if (data) {
        reminders = JSON.parse(data);
      }
      
      reminders.push(newReminder);
      await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
      
      return newReminder;
    } catch (error) {
      console.error('Error adding reminder:', error);
      throw error;
    }
  },

  /**
   * Update an existing reminder
   * @param updatedReminder The updated reminder data
   * @returns Promise resolving to the updated reminder
   */
  updateReminder: async (
    updatedReminder: Reminder
  ): Promise<Reminder> => {
    try {
      const data = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
      if (!data) {
        throw new Error('No reminders found');
      }

      let reminders: Reminder[] = JSON.parse(data);
      
      const index = reminders.findIndex(r => r.id === updatedReminder.id);
      if (index === -1) {
        throw new Error('Reminder not found');
      }
      
      // Ensure date is properly handled
      const reminderToUpdate = {
        ...updatedReminder,
        targetDate: updatedReminder.targetDate && typeof updatedReminder.targetDate === 'string' 
          ? new Date(updatedReminder.targetDate) 
          : updatedReminder.targetDate,
      };
      
      reminders[index] = reminderToUpdate;
      await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
      
      return reminderToUpdate;
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  },

  /**
   * Mark a reminder as completed
   * @param reminderId The ID of the reminder to mark as completed
   * @returns Promise resolving to the updated reminder
   */
  markReminderAsCompleted: async (reminderId: string): Promise<Reminder> => {
    try {
      const reminder = await this.getReminderById(reminderId);
      if (!reminder) {
        throw new Error('Reminder not found');
      }
      
      const updatedReminder = {
        ...reminder,
        isCompleted: true
      };
      
      return await this.updateReminder(updatedReminder);
    } catch (error) {
      console.error('Error marking reminder as completed:', error);
      throw error;
    }
  },

  /**
   * Delete a reminder
   * @param reminderId The ID of the reminder to delete
   * @returns Promise resolving to boolean indicating success
   */
  deleteReminder: async (reminderId: string): Promise<boolean> => {
    try {
      const data = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
      if (!data) {
        return false;
      }

      let reminders: Reminder[] = JSON.parse(data);
      reminders = reminders.filter(reminder => reminder.id !== reminderId);
      
      await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
      return true;
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  },

  /**
   * Get all upcoming reminders
   * @returns Promise resolving to an array of upcoming reminders
   */
  getUpcomingReminders: async (): Promise<Reminder[]> => {
    try {
      const data = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
      if (data) {
        const allReminders: Reminder[] = JSON.parse(data);
        const today = new Date();
        
        // Filter incomplete reminders with target dates
        return allReminders
          .filter(reminder => 
            !reminder.isCompleted && 
            reminder.targetDate && 
            new Date(reminder.targetDate) > today
          )
          .sort((a, b) => 
            new Date(a.targetDate!).getTime() - new Date(b.targetDate!).getTime()
          );
      }
      return [];
    } catch (error) {
      console.error('Error getting upcoming reminders:', error);
      throw error;
    }
  },
};
