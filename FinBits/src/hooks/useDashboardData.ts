import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';

interface UseDashboardDataOptions<T> {
  selector: (data: any) => T;
  cacheKey?: string;
  cacheDuration?: number;
}

const CACHE_PREFIX = 'dashboard_cache_';
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; 

export function useDashboardData<T>({ selector, cacheKey, cacheDuration = DEFAULT_CACHE_DURATION }: UseDashboardDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const loadFromCache = useCallback((): T | null => {
    if (!cacheKey) return null;
    try {
      const cached = localStorage.getItem(CACHE_PREFIX + cacheKey);
      if (!cached) return null;
      
      const { data: cachedData, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      if (now - timestamp < cacheDuration) {
        console.log(`📦 Loaded ${cacheKey} from cache`);
        return cachedData;
      } else {
        localStorage.removeItem(CACHE_PREFIX + cacheKey);
        return null;
      }
    } catch (err) {
      console.error('Error loading from cache:', err);
      return null;
    }
  }, [cacheKey, cacheDuration]);

  const saveToCache = useCallback((value: T) => {
    if (!cacheKey) return;
    try {
      localStorage.setItem(CACHE_PREFIX + cacheKey, JSON.stringify({
        data: value,
        timestamp: Date.now(),
      }));
      console.log(`💾 Saved ${cacheKey} to cache`);
    } catch (err) {
      console.error('Error saving to cache:', err);
    }
  }, [cacheKey]);

  const fetchFromAPI = useCallback(async () => {
    try {
      setError(null);
      const response = await dashboardService.getDashboardData();
      const newData = selector(response);
      setData(newData);
      saveToCache(newData);
      setRetryCount(0);
      return newData;
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Gagal memuat data');
      
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000);
      }
      return null;
    }
  }, [selector, retryCount, saveToCache]);

  useEffect(() => {
    const initializeData = async () => {
      const cachedData = loadFromCache();
      if (cachedData !== null) {
        setData(cachedData);
        setLoading(false);
        fetchFromAPI();
        return;
      }

      setLoading(true);
      await fetchFromAPI();
      setLoading(false);
    };

    initializeData();
  }, [retryCount]); 

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(`🔄 Auto-refreshing ${cacheKey || 'dashboard'} data...`);
      fetchFromAPI();
    }, 30000); 

    return () => clearInterval(interval);
  }, [fetchFromAPI, cacheKey]);

  const retry = useCallback(() => {
    setRetryCount(0);
  }, []);

  const refresh = useCallback(() => {
    if (cacheKey) {
      localStorage.removeItem(CACHE_PREFIX + cacheKey);
    }
    setRetryCount(0);
  }, [cacheKey]);

  return { data, loading, error, retry, refresh };
}
