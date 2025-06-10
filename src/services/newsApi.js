// src/services/newsApi.js
const API_KEY = 'dde3164f62b84b93b1dee305f8a56f5c'; // Replace with your actual API key

export const fetchNewsArticles = async (params = {}) => {
  try {
    const { q, from, to, sortBy, pageSize = 20 } = params;
    let url = `https://newsapi.org/v2/everything?apiKey=${API_KEY}&pageSize=${pageSize}`;

    if (q) url += `&q=${encodeURIComponent(q)}`;
    if (from) url += `&from=${from}`;
    if (to) url += `&to=${to}`;
    if (sortBy) url += `&sortBy=${sortBy}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NewsAPI request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    throw error;
  }
};

export const fetchTopHeadlines = async (params = {}) => {
  try {
    const { country, category, pageSize = 5 } = params;
    let url = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&pageSize=${pageSize}`;

    if (country) url += `&country=${country}`;
    if (category) url += `&category=${category}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NewsAPI request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching top headlines:', error);
    throw error;
  }
};