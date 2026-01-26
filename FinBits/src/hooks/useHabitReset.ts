import { useEffect, useCallback } from 'react';

interface UseHabitResetOptions {
  onReset?: () => void;
}

export function useHabitReset({ onReset }: UseHabitResetOptions = {}) {
  const calculateTimeUntilMidnight = useCallback(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    return tomorrow.getTime() - now.getTime();
  }, []);

  useEffect(() => {
    const scheduleReset = () => {
      const timeUntilMidnight = calculateTimeUntilMidnight();
      
      const timeout = setTimeout(() => {
        const timestamps = localStorage.getItem('habitCompletedTimestamps');
        if (timestamps) {
          localStorage.setItem('habitCompletedTimestamps', '{}');
        }
        
        onReset?.();
        
        scheduleReset();
      }, timeUntilMidnight);

      return () => clearTimeout(timeout);
    };

    return scheduleReset();
  }, [calculateTimeUntilMidnight, onReset]);
}
