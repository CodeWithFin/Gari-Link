/**
 * Formats a date object to a user-friendly string in Kenyan format
 * @param date The date to format
 * @returns A formatted date string (DD/MM/YYYY)
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-KE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Formats a number as currency in KES
 * @param amount The amount to format
 * @returns A formatted currency string (KES X,XXX)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(amount);
};

/**
 * Debounces a function call
 * @param func The function to debounce
 * @param wait The wait time in milliseconds
 * @returns A debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generates a random unique ID
 * @returns A unique ID string
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Compresses an image file to a maximum size
 * @param uri The URI of the image
 * @param maxSize The maximum size in KB
 * @returns A promise resolving to the compressed image URI
 */
export const compressImage = async (
  uri: string,
  maxSize: number = 800
): Promise<string> => {
  // In a real implementation, we would use image-manipulator or similar
  // For now, this is a placeholder that just returns the original URI
  console.log(`Image would be compressed to ${maxSize}KB`);
  return uri;
};

/**
 * Validates a Kenyan phone number
 * @param phoneNumber The phone number to validate
 * @returns True if the phone number is valid
 */
export const isValidKenyanPhone = (phoneNumber: string): boolean => {
  // Basic validation for Kenyan phone numbers
  // Should start with +254 or 0, followed by 9 digits
  const kenyanPhoneRegex = /^(?:\+254|0)[17]\d{8}$/;
  return kenyanPhoneRegex.test(phoneNumber);
};

/**
 * Calculates next service date based on current mileage and service interval
 * @param currentMileage The current mileage of the vehicle
 * @param lastServiceMileage The mileage at the last service
 * @param serviceInterval The service interval in kilometers
 * @returns The next service mileage
 */
export const calculateNextServiceMileage = (
  currentMileage: number,
  lastServiceMileage: number,
  serviceInterval: number
): number => {
  return lastServiceMileage + serviceInterval;
};

/**
 * Calculates if service is due based on mileage
 * @param currentMileage The current mileage of the vehicle
 * @param nextServiceMileage The mileage for the next service
 * @param warningThreshold The threshold in km to start warning (default 500)
 * @returns An object with isDue and daysOrKmRemaining
 */
export const isServiceDue = (
  currentMileage: number,
  nextServiceMileage: number,
  warningThreshold: number = 500
): { isDue: boolean; kmRemaining: number } => {
  const kmRemaining = nextServiceMileage - currentMileage;
  return {
    isDue: kmRemaining <= 0,
    kmRemaining,
  };
};
