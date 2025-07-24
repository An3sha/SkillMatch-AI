import { useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing function calls
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  // Cleanup function to cancel pending timeouts
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Add cancel method to the debounced function
  (debouncedCallback as any).cancel = cancel;

  return debouncedCallback;
}; 