// src/services/newsApi.js
const API_KEY = 'dde3164f62b84b93b1dee305f8a56f5c';

// Rate limiting to prevent too many API calls
let lastApiCall = 0;
const MIN_INTERVAL_BETWEEN_CALLS = 1000; // 1 second minimum between calls

// Helper function to enforce rate limiting
const enforceRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  
  if (timeSinceLastCall < MIN_INTERVAL_BETWEEN_CALLS) {
    const waitTime = MIN_INTERVAL_BETWEEN_CALLS - timeSinceLastCall;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastApiCall = Date.now();
};

// Enhanced error handling
const handleApiError = (response, endpoint) => {
  let errorMessage = `NewsAPI ${endpoint} request failed with status ${response.status}`;
  
  switch (response.status) {
    case 400:
      errorMessage = 'Bad request - please check your parameters';
      break;
    case 401:
      errorMessage = 'Invalid API key or unauthorized access';
      break;
    case 429:
      errorMessage = 'Rate limit exceeded - too many requests';
      break;
    case 500:
      errorMessage = 'NewsAPI server error - please try again later';
      break;
  }
  
  throw new Error(errorMessage);
};

export const fetchNewsArticles = async (params = {}) => {
  await enforceRateLimit();
  
  try {
    const { q, from, to, sortBy, pageSize = 20 } = params;
    let url = `https://newsapi.org/v2/everything?apiKey=${API_KEY}&pageSize=${pageSize}`;

    if (q) url += `&q=${encodeURIComponent(q)}`;
    if (from) url += `&from=${from}`;
    if (to) url += `&to=${to}`;
    if (sortBy) url += `&sortBy=${sortBy}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'NewsApp/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      handleApiError(response, 'everything');
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data || !Array.isArray(data.articles)) {
      throw new Error('Invalid response format from NewsAPI');
    }
    
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - NewsAPI is taking too long to respond');
    }
    
    console.error('Error fetching from NewsAPI everything endpoint:', error);
    throw error;
  }
};

export const fetchTopHeadlines = async (params = {}) => {
  await enforceRateLimit();
  
  try {
    const { country, category, pageSize = 5 } = params;
    let url = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&pageSize=${pageSize}`;

    if (country) url += `&country=${country}`;
    if (category) url += `&category=${category}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'NewsApp/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      handleApiError(response, 'top-headlines');
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data || !Array.isArray(data.articles)) {
      throw new Error('Invalid response format from NewsAPI');
    }
    
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - NewsAPI is taking too long to respond');
    }
    
    console.error('Error fetching top headlines:', error);
    throw error;
  }
};