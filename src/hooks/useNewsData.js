// src/hooks/useNewsData.js
import { useState, useEffect } from 'react';
import { fetchNewsArticles, fetchTopHeadlines } from '../services/newsApi';

export const useNewsData = (endpoint, params, mockData) => {
  const [data, setData] = useState(mockData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let result;
        if (endpoint === 'everything') {
          result = await fetchNewsArticles(params);
        } else if (endpoint === 'top-headlines') {
          result = await fetchTopHeadlines(params);
        }
        
        if (result && result.articles) {
          setData(result.articles);
          setUsingMockData(false);
        }
      } catch (err) {
        console.error('Failed to fetch real data, using mock data:', err);
        setData(mockData);
        setUsingMockData(true);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint, params, mockData]);

  return { data, isLoading, error, usingMockData };
};