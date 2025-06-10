import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "components/ui/Header";
import Icon from "components/AppIcon";

import MetricCard from "./components/MetricCard";
import ArticlePreviewCard from "./components/ArticlePreviewCard";
import QuickFilters from "./components/QuickFilters";
import RecentActivity from "./components/RecentActivity";
import TrendChart from "./components/TrendChart";
import { useNewsData } from "hooks/useNewsData";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedDateRange, setSelectedDateRange] = useState("7days");
  const [selectedContentType, setSelectedContentType] = useState("all");
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Helper function to validate and sanitize image URLs
  const sanitizeImageUrl = (url) => {
    if (!url || typeof url !== 'string') {
      return null;
    }
    
    // Remove common problematic patterns
    const cleanUrl = url.trim();
    
    // Check if it's a valid HTTP/HTTPS URL
    try {
      const urlObj = new URL(cleanUrl);
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return null;
      }
      
      // Check for common image extensions
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasValidExtension = validExtensions.some(ext => 
        cleanUrl.toLowerCase().includes(ext)
      );
      
      // If it's from a known image service or has valid extension, allow it
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

  // Mock data for dashboard metrics as fallback
  const mockDashboardMetrics = useMemo(() => ({
    totalArticles: 1247,
    recentAdditions: 23,
    topAuthors: 8,
    pendingReviews: 5,
  }), []);

  // Mock data for recent articles with safe image URLs
  const mockRecentArticles = useMemo(() => [
    {
      id: 1,
      title: "Breaking: Major Tech Conference Announces Revolutionary AI Breakthrough",
      author: "Sarah Johnson",
      publishedDate: "2024-01-15",
      type: "news",
      thumbnail: generatePlaceholderUrl(400, 250, 'Tech News'),
      excerpt: "Industry leaders gather to discuss the latest developments in artificial intelligence technology that could reshape the future of computing.",
    },
    {
      id: 2,
      title: "Climate Change Impact: New Research Reveals Alarming Ocean Temperature Rise",
      author: "Dr. Michael Chen",
      publishedDate: "2024-01-14",
      type: "news",
      thumbnail: generatePlaceholderUrl(400, 250, 'Climate News'),
      excerpt: "Scientists from leading universities present compelling evidence of accelerated ocean warming patterns affecting marine ecosystems worldwide.",
    },
    {
      id: 3,
      title: "The Future of Remote Work: How Companies Are Adapting to Hybrid Models",
      author: "Emily Rodriguez",
      publishedDate: "2024-01-13",
      type: "blog",
      thumbnail: generatePlaceholderUrl(400, 250, 'Work Trends'),
      excerpt: "An in-depth analysis of how organizations worldwide are implementing flexible work arrangements and the long-term implications for productivity.",
    },
    {
      id: 4,
      title: "Sustainable Energy Solutions: Solar Power Efficiency Reaches New Heights",
      author: "James Wilson",
      publishedDate: "2024-01-12",
      type: "news",
      thumbnail: generatePlaceholderUrl(400, 250, 'Energy News'),
      excerpt: "Latest innovations in photovoltaic technology promise to make solar energy more accessible and cost-effective for residential consumers.",
    },
  ], []);

  // Mock data for article trends (last 7 days)
  const articleTrends = useMemo(() => [
    { date: "2024-01-09", articles: 12 },
    { date: "2024-01-10", articles: 15 },
    { date: "2024-01-11", articles: 8 },
    { date: "2024-01-12", articles: 18 },
    { date: "2024-01-13", articles: 22 },
    { date: "2024-01-14", articles: 16 },
    { date: "2024-01-15", articles: 25 },
  ], []);

  // Mock data for author performance
  const authorPerformance = useMemo(() => [
    { name: "Sarah Johnson", articles: 45 },
    { name: "Dr. Michael Chen", articles: 38 },
    { name: "Emily Rodriguez", articles: 32 },
    { name: "James Wilson", articles: 28 },
    { name: "Lisa Thompson", articles: 24 },
  ], []);

  // Memoize API parameters to prevent unnecessary re-renders
  const apiParams = useMemo(() => ({ 
    country: "us", 
    pageSize: 4 
  }), []);

  const {
    data: recentArticles,
    isLoading: articlesLoading,
    error,
    usingMockData,
  } = useNewsData("top-headlines", apiParams, mockRecentArticles);

  // Transform NewsAPI data to match our format with safe image handling
  const formattedArticles = useMemo(() => {
    if (usingMockData) {
      return recentArticles || [];
    }
    
    return recentArticles?.map((article, index) => {
      const sanitizedImageUrl = sanitizeImageUrl(article.urlToImage);
      
      return {
        id: article.url || `article-${index}`,
        title: article.title || "Untitled Article",
        author: article.author || "Unknown Author",
        publishedDate: article.publishedAt
          ? article.publishedAt.split("T")[0]
          : new Date().toISOString().split("T")[0],
        type: "news",
        thumbnail: sanitizedImageUrl || generatePlaceholderUrl(400, 250, 'News'),
        excerpt: article.description || "No description available",
      };
    }) || [];
  }, [recentArticles, usingMockData]);

  // Simulate dashboard loading (separate from API loading)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboardLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleAddArticle = () => {
    navigate("/articles-management?action=add");
  };

  const handleViewAllArticles = () => {
    navigate("/articles-management");
  };

  const handleArticleClick = (articleId) => {
    navigate(`/articles-management?article=${articleId}`);
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
              {usingMockData && (
                <div className="mt-2 text-sm text-warning-600 bg-warning-50 px-3 py-1 rounded inline-flex items-center">
                  <Icon name="AlertTriangle" size={14} className="mr-1" />
                  {articlesLoading ? 'Loading live data...' : 'Showing sample data - API unavailable'}
                </div>
              )}
              {error && !usingMockData && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded inline-flex items-center">
                  <Icon name="AlertTriangle" size={14} className="mr-1" />
                  API Error: {error}
                </div>
              )}
            </div>
            <button
              onClick={handleAddArticle}
              className="mt-4 sm:mt-0 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 font-medium flex items-center space-x-2"
            >
              <Icon name="Plus" size={20} />
              <span>Add Article</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-8">
              {/* Metrics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Total Articles"
                  value={mockDashboardMetrics.totalArticles.toLocaleString()}
                  icon="FileText"
                  trend="+12%"
                  trendDirection="up"
                />
                <MetricCard
                  title="Recent Additions"
                  value={mockDashboardMetrics.recentAdditions}
                  icon="Plus"
                  trend="+5"
                  trendDirection="up"
                  subtitle="This week"
                />
                <MetricCard
                  title="Top Authors"
                  value={mockDashboardMetrics.topAuthors}
                  icon="Users"
                  trend="Active"
                  trendDirection="neutral"
                />
                <MetricCard
                  title="Pending Reviews"
                  value={mockDashboardMetrics.pendingReviews}
                  icon="Clock"
                  trend="-2"
                  trendDirection="down"
                  subtitle="Awaiting approval"
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrendChart
                  title="Article Trends"
                  subtitle="Articles published over time"
                  data={articleTrends}
                  type="line"
                />
                <TrendChart
                  title="Top Authors"
                  subtitle="Articles by author"
                  data={authorPerformance}
                  type="bar"
                />
              </div>

              {/* Recent Articles Preview */}
              <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-text-primary">Recent Articles</h2>
                    <p className="text-text-secondary">
                      {articlesLoading ? 'Loading latest content...' : 'Latest published content'}
                    </p>
                  </div>
                  <button
                    onClick={handleViewAllArticles}
                    className="text-primary hover:text-primary-700 font-medium flex items-center space-x-1 transition-colors duration-150"
                  >
                    <span>View All</span>
                    <Icon name="ArrowRight" size={16} />
                  </button>
                </div>

                {/* Articles Loading State */}
                {articlesLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading articles...</p>
                  </div>
                ) : formattedArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formattedArticles.map((article) => (
                      <ArticlePreviewCard
                        key={article.id}
                        article={article}
                        onClick={() => handleArticleClick(article.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Icon name="FileText" size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-text-secondary mb-4">No articles available at the moment.</p>
                    {error && (
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

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <QuickFilters
                selectedDateRange={selectedDateRange}
                selectedContentType={selectedContentType}
                onDateRangeChange={setSelectedDateRange}
                onContentTypeChange={setSelectedContentType}
              />
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;