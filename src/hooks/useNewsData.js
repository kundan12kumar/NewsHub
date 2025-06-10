// src/hooks/useNewsData.js
import { useState, useEffect, useRef } from 'react';
import { fetchNewsArticles, fetchTopHeadlines } from '../services/newsApi';

// Cache to store API responses and avoid duplicate calls
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to create cache key
const createCacheKey = (endpoint, params) => {
  return `${endpoint}-${JSON.stringify(params)}`;
};

// Helper function to check if cache is still valid
const isCacheValid = (cacheEntry) => {
  return Date.now() - cacheEntry.timestamp < CACHE_DURATION;
};

export const useNewsData = (endpoint, params, mockData) => {
  const [data, setData] = useState(mockData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(true); // Start with mock data assumption
  
  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);
  
  // Use ref to prevent duplicate API calls
  const fetchInProgressRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      // Prevent duplicate calls
      if (fetchInProgressRef.current) {
        return;
      }

      const cacheKey = createCacheKey(endpoint, params);
      
      // Check cache first
      const cachedData = apiCache.get(cacheKey);
      if (cachedData && isCacheValid(cachedData)) {
        if (isMountedRef.current) {
          setData(cachedData.data);
          setUsingMockData(false);
          setError(null);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);
      fetchInProgressRef.current = true;
      
      try {
        let result;
        
        // Add timeout to prevent hanging requests
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 second timeout
        });

        if (endpoint === 'everything') {
          result = await Promise.race([
            fetchNewsArticles(params),
            timeoutPromise
          ]);
        } else if (endpoint === 'top-headlines') {
          result = await Promise.race([
            fetchTopHeadlines(params),
            timeoutPromise
          ]);
        }
        
        if (result && result.articles && isMountedRef.current) {
          // Cache the successful response
          apiCache.set(cacheKey, {
            data: result.articles,
            timestamp: Date.now()
          });
          
          setData(result.articles);
          setUsingMockData(false);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch real data, using mock data:', err);
        
        if (isMountedRef.current) {
          // Only set mock data after API fails
          setData(mockData);
          setUsingMockData(true);
          setError(err);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
        fetchInProgressRef.current = false;
      }
    };

    fetchData();
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [endpoint, JSON.stringify(params)]); // Use JSON.stringify to properly compare params

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { data, isLoading, error, usingMockData };
};