import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "components/ui/Header";
import Icon from "components/AppIcon";

import MetricCard from "./components/MetricCard";
import ArticlePreviewCard from "./components/ArticlePreviewCard";
import TrendChart from "./components/TrendChart";
import { useNewsData } from "hooks/useNewsData";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Helper function to validate and sanitize image URLs
  const sanitizeImageUrl = (url) => {
    if (!url || typeof url !== 'string') {
      return null;
    }
    
    const cleanUrl = url.trim();
    
    try {
      const urlObj = new URL(cleanUrl);
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return null;
      }
      
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasValidExtension = validExtensions.some(ext => 
        cleanUrl.toLowerCase().includes(ext)
      );
      
      const knownImageServices = ['unsplash.com', 'pexels.com', 'pixabay.com', 'placeholder.com', 'placehold.co'];
      const isFromKnownService = knownImageServices.some(service => 
        cleanUrl.includes(service)
      );
      
      if (hasValidExtension || isFromKnownService || cleanUrl.includes('image')) {
        return cleanUrl;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  };

  // Generate a reliable placeholder URL
  const generatePlaceholderUrl = (width = 400, height = 250, text = 'No Image') => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#F3F4F6"/>
        <rect x="${width/2 - 40}" y="${height/2 - 40}" width="80" height="80" stroke="#9CA3AF" stroke-width="2" fill="none" rx="4"/>
        <circle cx="${width/2 - 15}" cy="${height/2 - 15}" r="8" fill="#9CA3AF"/>
        <path d="M${width/2 + 20} ${height/2 + 20} L${width/2 - 20} ${height/2 - 10} L${width/2 - 35} ${height/2 + 20} Z" fill="#9CA3AF"/>
        <text x="${width/2}" y="${height/2 + 50}" font-family="Arial" font-size="14" fill="#9CA3AF" text-anchor="middle">${text}</text>
      </svg>
    `)}`;
  };

  // UNIFIED API CALL - Same parameters as ArticlesManagement page
  const allArticlesParams = useMemo(() => ({ 
    q: "technology",
    pageSize: 100, // Same as ArticlesManagement
    sortBy: "publishedAt",
  }), []);

  // Single API call for all data (same as ArticlesManagement)
  const {
    data: allArticles,
    isLoading: allArticlesLoading,
    error: allArticlesError,
  } = useNewsData("everything", allArticlesParams, []); // Use "everything" endpoint like ArticlesManagement

  // Transform all articles (same logic as ArticlesManagement)
  const transformedArticles = useMemo(() => {
    if (!allArticles || allArticles.length === 0) {
      return [];
    }

    return allArticles.map((article, index) => ({
      id: index + 1,
      title: article.title || "Untitled Article",
      author: article.author || "Unknown Author",
      publishedDate: article.publishedAt
        ? article.publishedAt.split("T")[0]
        : new Date().toISOString().split("T")[0],
      date: article.publishedAt
        ? article.publishedAt.split("T")[0]
        : new Date().toISOString().split("T")[0],
      type: "news",
      status: "published",
      thumbnail: article.urlToImage,
      excerpt: article.description || "No description available",
      url: article.url,
      content: article.content || article.description || "No content available",
      readTime: `${Math.max(1, Math.floor((article.content?.length || 500) / 500))} min read`,
      views: Math.floor(Math.random() * 20000),
      category: "Technology",
      source: article.source?.name || "Unknown Source",
    }));
  }, [allArticles]);

  // Get recent articles for display (only 4 articles)
  const recentArticlesForDisplay = useMemo(() => {
    if (!transformedArticles || transformedArticles.length === 0) {
      return [];
    }
    
    // Sort by date (newest first) and take only 4
    const sortedArticles = [...transformedArticles]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4);
    
    return sortedArticles.map((article) => {
      const sanitizedImageUrl = sanitizeImageUrl(article.thumbnail);
      
      return {
        ...article,
        thumbnail: sanitizedImageUrl || generatePlaceholderUrl(400, 250, 'News'),
      };
    });
  }, [transformedArticles]);

  // Calculate real metrics from ALL articles (same logic as ArticlesManagement)
  const calculatedMetrics = useMemo(() => {
    if (!transformedArticles || transformedArticles.length === 0) {
      return {
        totalArticles: 0,
        recentAdditions: 0,
        topAuthors: 0,
        pendingReviews: 0,
      };
    }

    // Total articles count (should match ArticlesManagement page exactly)
    const totalArticles = transformedArticles.length;

    // Calculate recent additions (articles from last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentAdditions = transformedArticles.filter(article => {
      if (!article.date) return false;
      const publishDate = new Date(article.date);
      return publishDate >= sevenDaysAgo;
    }).length;

    // Calculate top authors (unique authors count) - same logic as ArticlesManagement
    const authors = transformedArticles
      .map(article => article.author)
      .filter(author => author && author !== 'Unknown Author' && author.trim() !== '')
      .filter((author, index, self) => self.indexOf(author) === index);
    
    const topAuthors = authors.length;

    // Calculate pending reviews (articles without complete data)
    const pendingReviews = transformedArticles.filter(article => 
      !article.excerpt || 
      !article.thumbnail || 
      article.title === '[Removed]' ||
      article.excerpt === '[Removed]' ||
      article.title.toLowerCase().includes('removed')
    ).length;

    return {
      totalArticles,
      recentAdditions,
      topAuthors,
      pendingReviews,
    };
  }, [transformedArticles]);

  // Calculate author performance from ALL articles
  const authorPerformance = useMemo(() => {
    if (!transformedArticles || transformedArticles.length === 0) {
      return [];
    }

    // Count articles by author (same logic as ArticlesManagement)
    const authorCounts = {};
    transformedArticles.forEach(article => {
      if (article.author && article.author !== 'Unknown Author' && article.author.trim() !== '') {
        const author = article.author.trim();
        authorCounts[author] = (authorCounts[author] || 0) + 1;
      }
    });

    // Convert to array and sort by article count
    return Object.entries(authorCounts)
      .map(([name, articles]) => ({ name, articles }))
      .sort((a, b) => b.articles - a.articles)
      .slice(0, 5); // Top 5 authors
  }, [transformedArticles]);

  // Calculate article trends from ALL articles
  const articleTrends = useMemo(() => {
    if (!transformedArticles || transformedArticles.length === 0) {
      return [];
    }

    // Group articles by date (last 7 days)
    const dateMap = {};
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Initialize last 7 days with 0 counts
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap[dateStr] = 0;
    }

    // Count articles for each date
    transformedArticles.forEach(article => {
      if (article.date) {
        const publishDate = new Date(article.date);
        if (publishDate >= sevenDaysAgo) {
          const dateStr = publishDate.toISOString().split('T')[0];
          if (dateMap.hasOwnProperty(dateStr)) {
            dateMap[dateStr]++;
          }
        }
      }
    });

    return Object.entries(dateMap).map(([date, articles]) => ({
      date,
      articles
    }));
  }, [transformedArticles]);

  // Calculate trend percentages
  const getTrendPercentage = (current, previous) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const percentage = ((current - previous) / previous) * 100;
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(0)}%`;
  };

  // Calculate trends for metrics
  const metricTrends = useMemo(() => {
    const currentWeekArticles = calculatedMetrics.recentAdditions;
    const previousWeekArticles = Math.max(1, Math.floor(currentWeekArticles * 0.8)); // Simulated previous week
    
    return {
      totalArticlesTrend: getTrendPercentage(calculatedMetrics.totalArticles, Math.floor(calculatedMetrics.totalArticles * 0.9)),
      recentAdditionsTrend: getTrendPercentage(currentWeekArticles, previousWeekArticles),
      topAuthorsTrend: calculatedMetrics.topAuthors > 5 ? "Growing" : "Stable",
      pendingReviewsTrend: `${calculatedMetrics.pendingReviews} items`,
    };
  }, [calculatedMetrics]);

  // Check if any data is loading
  const isAnyLoading = allArticlesLoading;
  const hasAnyError = allArticlesError;

  // Simulate dashboard loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboardLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleViewAllArticles = () => {
    navigate("/articles-management");
  };

  const handleArticleClick = (article) => {
    navigate(`/article/${article.id}`, { 
      state: { 
        article: article 
      } 
    });
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Show loading state only for dashboard initialization
  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Dashboard
              </h1>
              <p className="text-text-secondary">
                Welcome back! Here's what's happening with your content.
              </p>
              {isAnyLoading && (
                <div className="mt-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded inline-flex items-center">
                  <Icon name="Loader" size={14} className="mr-1 animate-spin" />
                  Loading latest data...
                </div>
              )}
              {hasAnyError && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded inline-flex items-center">
                  <Icon name="AlertTriangle" size={14} className="mr-1" />
                  Error loading data - Please try again
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-8">
              {/* Metrics Cards - Based on ALL articles */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Total Articles"
                  value={calculatedMetrics.totalArticles.toLocaleString()}
                  icon="FileText"
                  trend={metricTrends.totalArticlesTrend}
                  trendDirection="up"
                  loading={isAnyLoading}
                />
                <MetricCard
                  title="Recent Additions"
                  value={calculatedMetrics.recentAdditions}
                  icon="Plus"
                  trend={metricTrends.recentAdditionsTrend}
                  trendDirection={calculatedMetrics.recentAdditions > 10 ? "up" : "neutral"}
                  subtitle="This week"
                  loading={isAnyLoading}
                />
                <MetricCard
                  title="Top Authors"
                  value={calculatedMetrics.topAuthors}
                  icon="Users"
                  trend={metricTrends.topAuthorsTrend}
                  trendDirection="neutral"
                  loading={isAnyLoading}
                />
                <MetricCard
                  title="Pending Reviews"
                  value={calculatedMetrics.pendingReviews}
                  icon="Clock"
                  trend={metricTrends.pendingReviewsTrend}
                  trendDirection={calculatedMetrics.pendingReviews > 20 ? "up" : "down"}
                  subtitle="Need attention"
                  loading={isAnyLoading}
                />
              </div>

              {/* Charts Section - Based on ALL articles */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrendChart
                  title="Article Trends"
                  subtitle="Articles published over time"
                  data={articleTrends}
                  type="line"
                  loading={isAnyLoading}
                />
                <TrendChart
                  title="Top Authors"
                  subtitle="Articles by author"
                  data={authorPerformance}
                  type="bar"
                  loading={isAnyLoading}
                />
              </div>

              {/* Recent Articles Preview - Only 4 articles displayed */}
              <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-text-primary">Recent Articles</h2>
                    <p className="text-text-secondary">
                      {isAnyLoading ? 'Loading latest content...' : `Latest ${recentArticlesForDisplay.length} published articles`}
                    </p>
                  </div>
                  <button
                    onClick={handleViewAllArticles}
                    className="text-primary hover:text-primary-700 font-medium flex items-center space-x-1 transition-colors duration-150"
                  >
                    <span>View All ({calculatedMetrics.totalArticles})</span>
                    <Icon name="ArrowRight" size={16} />
                  </button>
                </div>

                {/* Articles Loading State */}
                {isAnyLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading articles...</p>
                  </div>
                ) : recentArticlesForDisplay.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recentArticlesForDisplay.map((article) => (
                      <ArticlePreviewCard
                        key={article.id}
                        article={article}
                        onClick={() => handleArticleClick(article)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Icon name="FileText" size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-text-secondary mb-4">No articles available at the moment.</p>
                    {hasAnyError && (
                      <button 
                        onClick={handleRetry} 
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;