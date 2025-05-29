import { useEffect, useRef } from 'react';

/**
 * Custom hook to debounce a function call
 * @param func The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced version of the function
 */
function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export default useDebounce;
