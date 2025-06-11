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

  // Mock data as fallback only
  const mockDashboardMetrics = useMemo(() => ({
    totalArticles: 1247,
    recentAdditions: 23,
    topAuthors: 8,
    pendingReviews: 5,
  }), []);

  const mockRecentArticles = useMemo(() => [
    {
      id: 1,
      title: "Breaking: Major Tech Conference Announces Revolutionary AI Breakthrough",
      author: "Sarah Johnson",
      publishedDate: "2024-01-15",
      type: "news",
      thumbnail: generatePlaceholderUrl(400, 250, 'Tech News'),
      excerpt: "Industry leaders gather to discuss the latest developments in artificial intelligence technology that could reshape the future of computing.",
      url: "https://example.com/tech-ai-breakthrough",
      content: "Full article content would go here..."
    },
    {
      id: 2,
      title: "Climate Change Impact: New Research Reveals Alarming Ocean Temperature Rise",
      author: "Dr. Michael Chen",
      publishedDate: "2024-01-14",
      type: "news",
      thumbnail: generatePlaceholderUrl(400, 250, 'Climate News'),
      excerpt: "Scientists from leading universities present compelling evidence of accelerated ocean warming patterns affecting marine ecosystems worldwide.",
      url: "https://example.com/climate-ocean-temperature",
      content: "Full article content would go here..."
    },
    {
      id: 3,
      title: "The Future of Remote Work: How Companies Are Adapting to Hybrid Models",
      author: "Emily Rodriguez",
      publishedDate: "2024-01-13",
      type: "blog",
      thumbnail: generatePlaceholderUrl(400, 250, 'Work Trends'),
      excerpt: "An in-depth analysis of how organizations worldwide are implementing flexible work arrangements and the long-term implications for productivity.",
      url: "https://example.com/remote-work-hybrid",
      content: "Full article content would go here..."
    },
    {
      id: 4,
      title: "Sustainable Energy Solutions: Solar Power Efficiency Reaches New Heights",
      author: "James Wilson",
      publishedDate: "2024-01-12",
      type: "news",
      thumbnail: generatePlaceholderUrl(400, 250, 'Energy News'),
      excerpt: "Latest innovations in photovoltaic technology promise to make solar energy more accessible and cost-effective for residential consumers.",
      url: "https://example.com/solar-power-efficiency",
      content: "Full article content would go here..."
    },
  ], []);

  // API parameters for different data fetches
  const recentArticlesParams = useMemo(() => ({ 
    country: "us", 
    pageSize: 4 
  }), []);

  const totalArticlesParams = useMemo(() => ({ 
    country: "us", 
    pageSize: 100 // Get more articles to calculate better metrics
  }), []);

  const businessNewsParams = useMemo(() => ({ 
    country: "us", 
    category: "business",
    pageSize: 50 
  }), []);

  const techNewsParams = useMemo(() => ({ 
    country: "us", 
    category: "technology",
    pageSize: 50 
  }), []);

  // Multiple API calls for comprehensive data
  const {
    data: recentArticles,
    isLoading: articlesLoading,
    error: articlesError,
    usingMockData: recentUsingMock,
  } = useNewsData("top-headlines", recentArticlesParams, mockRecentArticles);

  const {
    data: allArticles,
    isLoading: allArticlesLoading,
    error: allArticlesError,
    usingMockData: allUsingMock,
  } = useNewsData("top-headlines", totalArticlesParams, []);

  const {
    data: businessArticles,
    isLoading: businessLoading,
    error: businessError,
    usingMockData: businessUsingMock,
  } = useNewsData("top-headlines", businessNewsParams, []);

  const {
    data: techArticles,
    isLoading: techLoading,
    error: techError,
    usingMockData: techUsingMock,
  } = useNewsData("top-headlines", techNewsParams, []);

  // Calculate real metrics from API data
  const calculatedMetrics = useMemo(() => {
    if (allUsingMock || !allArticles) {
      return mockDashboardMetrics;
    }

    // Combine all articles for comprehensive analysis
    const combinedArticles = [
      ...(allArticles || []),
      ...(businessArticles || []),
      ...(techArticles || [])
    ];

    // Remove duplicates by URL
    const uniqueArticles = combinedArticles.filter((article, index, self) =>
      index === self.findIndex(a => a.url === article.url)
    );

    // Calculate total articles
    const totalArticles = uniqueArticles.length;

    // Calculate recent additions (articles from last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentAdditions = uniqueArticles.filter(article => {
      if (!article.publishedAt) return false;
      const publishDate = new Date(article.publishedAt);
      return publishDate >= sevenDaysAgo;
    }).length;

    // Calculate top authors (unique authors count)
    const authors = uniqueArticles
      .map(article => article.author)
      .filter(author => author && author !== 'Unknown Author' && author.trim() !== '')
      .filter((author, index, self) => self.indexOf(author) === index);
    
    const topAuthors = authors.length;

    // Calculate pending reviews (articles without complete data)
    const pendingReviews = uniqueArticles.filter(article => 
      !article.description || 
      !article.urlToImage || 
      article.title === '[Removed]' ||
      article.description === '[Removed]'
    ).length;

    return {
      totalArticles,
      recentAdditions,
      topAuthors,
      pendingReviews,
    };
  }, [allArticles, businessArticles, techArticles, allUsingMock, mockDashboardMetrics]);

  // Calculate author performance from real data
  const authorPerformance = useMemo(() => {
    if (allUsingMock || !allArticles) {
      return [
        { name: "Sarah Johnson", articles: 45 },
        { name: "Dr. Michael Chen", articles: 38 },
        { name: "Emily Rodriguez", articles: 32 },
        { name: "James Wilson", articles: 28 },
        { name: "Lisa Thompson", articles: 24 },
      ];
    }

    // Combine all articles for author analysis
    const combinedArticles = [
      ...(allArticles || []),
      ...(businessArticles || []),
      ...(techArticles || [])
    ];

    // Count articles by author
    const authorCounts = {};
    combinedArticles.forEach(article => {
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
  }, [allArticles, businessArticles, techArticles, allUsingMock]);

  // Calculate article trends from real data
  const articleTrends = useMemo(() => {
    if (allUsingMock || !allArticles) {
      return [
        { date: "2024-01-09", articles: 12 },
        { date: "2024-01-10", articles: 15 },
        { date: "2024-01-11", articles: 8 },
        { date: "2024-01-12", articles: 18 },
        { date: "2024-01-13", articles: 22 },
        { date: "2024-01-14", articles: 16 },
        { date: "2024-01-15", articles: 25 },
      ];
    }

    // Combine all articles for trend analysis
    const combinedArticles = [
      ...(allArticles || []),
      ...(businessArticles || []),
      ...(techArticles || [])
    ];

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
    combinedArticles.forEach(article => {
      if (article.publishedAt) {
        const publishDate = new Date(article.publishedAt);
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
  }, [allArticles, businessArticles, techArticles, allUsingMock]);

  // Transform recent articles data
  const formattedArticles = useMemo(() => {
    if (recentUsingMock) {
      return recentArticles || [];
    }
    
    return recentArticles?.map((article, index) => {
      const sanitizedImageUrl = sanitizeImageUrl(article.urlToImage);
      
      return {
        id: index + 1,
        title: article.title || "Untitled Article",
        author: article.author || "Unknown Author",
        publishedDate: article.publishedAt
          ? article.publishedAt.split("T")[0]
          : new Date().toISOString().split("T")[0],
        type: "news",
        thumbnail: sanitizedImageUrl || generatePlaceholderUrl(400, 250, 'News'),
        excerpt: article.description || "No description available",
        url: article.url,
        content: article.content || article.description || "No content available",
      };
    }) || [];
  }, [recentArticles, recentUsingMock]);

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
      totalArticlesTrend: getTrendPercentage(calculatedMetrics.totalArticles, calculatedMetrics.totalArticles * 0.9),
      recentAdditionsTrend: getTrendPercentage(currentWeekArticles, previousWeekArticles),
      topAuthorsTrend: calculatedMetrics.topAuthors > 5 ? "Growing" : "Stable",
      pendingReviewsTrend: calculatedMetrics.pendingReviews,
    };
  }, [calculatedMetrics]);

  // Check if any data is loading
  const isAnyLoading = articlesLoading || allArticlesLoading || businessLoading || techLoading;
  const hasAnyError = articlesError || allArticlesError || businessError || techError;
  const isUsingAnyMockData = recentUsingMock || allUsingMock || businessUsingMock || techUsingMock;

  // Simulate dashboard loading
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
              {isUsingAnyMockData && (
                <div className="mt-2 text-sm text-warning-600 bg-warning-50 px-3 py-1 rounded inline-flex items-center">
                  <Icon name="AlertTriangle" size={14} className="mr-1" />
                  {isAnyLoading ? 'Loading live data...' : 'Some data unavailable - showing mixed real/sample data'}
                </div>
              )}
              {hasAnyError && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded inline-flex items-center">
                  <Icon name="AlertTriangle" size={14} className="mr-1" />
                  API Error - Using available data
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-8">
              {/* Metrics Cards */}
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
                  trend={`${calculatedMetrics.pendingReviews} items`}
                  trendDirection={calculatedMetrics.pendingReviews > 20 ? "up" : "down"}
                  subtitle="Need attention"
                  loading={isAnyLoading}
                />
              </div>

              {/* Charts Section */}
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