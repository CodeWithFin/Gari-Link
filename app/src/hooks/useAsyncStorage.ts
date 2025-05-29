import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Custom hook for managing data in AsyncStorage with type safety
 * @param key The AsyncStorage key
 * @param initialValue The initial value if nothing exists in storage
 * @returns An array with the current value, a setter function, and loading/error states
 */
const useAsyncStorage = <T>(
  key: string,
  initialValue: T
): [
  T,
  (value: T | ((prevValue: T) => T)) => Promise<void>,
  boolean,
  Error | null,
  () => Promise<void>
] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get value from AsyncStorage
  useEffect(() => {
    const getValueFromStorage = async () => {
      try {
        setLoading(true);
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        }
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to get data from storage'));
        console.error('Error reading from AsyncStorage:', e);
      } finally {
        setLoading(false);
      }
    };

    getValueFromStorage();
  }, [key]);

  // Set value to AsyncStorage
  const setValue = useCallback(
    async (value: T | ((prevValue: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to save data to storage'));
        console.error('Error writing to AsyncStorage:', e);
        throw e;
      }
    },
    [key, storedValue]
  );

  // Force refresh value from AsyncStorage
  const refreshValue = useCallback(async () => {
    try {
      setLoading(true);
      const item = await AsyncStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to refresh data from storage'));
      console.error('Error refreshing from AsyncStorage:', e);
    } finally {
      setLoading(false);
    }
  }, [key]);

  return [storedValue, setValue, loading, error, refreshValue];
};

export default useAsyncStorage;
