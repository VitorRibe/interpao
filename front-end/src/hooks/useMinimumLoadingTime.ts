import { useState, useEffect } from 'react';

/**
 * A hook that ensures a loading state lasts for at least a minimum duration.
 * 
 * @param isLoading The actual loading state from a query or other source.
 * @param minimumTime The minimum duration in milliseconds (default: 200ms).
 * @returns A boolean indicating if the skeleton should still be shown.
 */
export function useMinimumLoadingTime(isLoading: boolean, minimumTime: number = 200): boolean {
  const [displayLoading, setDisplayLoading] = useState(isLoading);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      // If it started loading, we immediately show the skeleton
      setDisplayLoading(true);
    } else {
      // If it stopped loading, we wait for the remaining time if necessary
      timeoutId = setTimeout(() => {
        setDisplayLoading(false);
      }, minimumTime);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, minimumTime]);

  return displayLoading;
}
