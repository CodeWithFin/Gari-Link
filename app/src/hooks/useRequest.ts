import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for handling API requests with loading, error, and retry functionality
 * @param asyncFunction The async function to execute
 * @returns An object with request state and methods
 */
const useRequest = <T, P extends any[]>(
  asyncFunction: (...args: P) => Promise<T>
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef<boolean>(true);

  // Set up cleanup when component unmounts
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFunction(...args);
        
        // Only update state if component is still mounted
        if (mountedRef.current) {
          setData(result);
          setLoading(false);
        }
        
        return result;
      } catch (err) {
        // Only update state if component is still mounted
        if (mountedRef.current) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
          setLoading(false);
          setData(null);
        }
        
        return null;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export default useRequest;
