import React, { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for dashboard metrics as fallback
  const mockDashboardMetrics = {
    totalArticles: 1247,
    recentAdditions: 23,
    topAuthors: 8,
    pendingReviews: 5,
  };

  // Mock data for recent articles as fallback
  const mockRecentArticles = [
    {
      id: 1,
      title:
        "Breaking: Major Tech Conference Announces Revolutionary AI Breakthrough",
      author: "Sarah Johnson",
      publishedDate: "2024-01-15",
      type: "news",
      thumbnail:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
      excerpt:
        "Industry leaders gather to discuss the latest developments in artificial intelligence technology that could reshape the future of computing.",
    },
    {
      id: 2,
      title:
        "Climate Change Impact: New Research Reveals Alarming Ocean Temperature Rise",
      author: "Dr. Michael Chen",
      publishedDate: "2024-01-14",
      type: "news",
      thumbnail:
        "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?w=400&h=250&fit=crop",
      excerpt:
        "Scientists from leading universities present compelling evidence of accelerated ocean warming patterns affecting marine ecosystems worldwide.",
    },
    {
      id: 3,
      title:
        "The Future of Remote Work: How Companies Are Adapting to Hybrid Models",
      author: "Emily Rodriguez",
      publishedDate: "2024-01-13",
      type: "blog",
      thumbnail:
        "https://images.pixabay.com/photo/2020/07/08/04/12/work-5382501_1280.jpg?w=400&h=250&fit=crop",
      excerpt:
        "An in-depth analysis of how organizations worldwide are implementing flexible work arrangements and the long-term implications for productivity.",
    },
    {
      id: 4,
      title:
        "Sustainable Energy Solutions: Solar Power Efficiency Reaches New Heights",
      author: "James Wilson",
      publishedDate: "2024-01-12",
      type: "news",
      thumbnail:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop",
      excerpt:
        "Latest innovations in photovoltaic technology promise to make solar energy more accessible and cost-effective for residential consumers.",
    },
  ];

  // Mock data for article trends (last 7 days)
  const articleTrends = [
    { date: "2024-01-09", articles: 12 },
    { date: "2024-01-10", articles: 15 },
    { date: "2024-01-11", articles: 8 },
    { date: "2024-01-12", articles: 18 },
    { date: "2024-01-13", articles: 22 },
    { date: "2024-01-14", articles: 16 },
    { date: "2024-01-15", articles: 25 },
  ];

  // Mock data for author performance
  const authorPerformance = [
    { name: "Sarah Johnson", articles: 45 },
    { name: "Dr. Michael Chen", articles: 38 },
    { name: "Emily Rodriguez", articles: 32 },
    { name: "James Wilson", articles: 28 },
    { name: "Lisa Thompson", articles: 24 },
  ];

  const {
    data: recentArticles,
    error,
    usingMockData,
  } = useNewsData(
    "top-headlines",
    { country: "us", pageSize: 4 },
    mockRecentArticles
  );

  // FIX 1: Use the correct dashboardMetrics variable instead of undefined one
  const dashboardMetrics = mockDashboardMetrics;

  // Transform NewsAPI data to match our format
  const formattedArticles = usingMockData
    ? recentArticles
    : recentArticles?.map((article) => ({
        id: article.url,
        title: article.title,
        author: article.author || "Unknown Author",
        publishedDate: article.publishedAt
          ? article.publishedAt.split("T")[0]
          : "Unknown date",
        type: "news",
        thumbnail: article.urlToImage || "https://via.placeholder.com/400x250",
        excerpt: article.description || "No description available",
      })) || []; // FIX 2: Add fallback empty array to prevent undefined errors

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

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

  // FIX 3: Add error handling for when the hook returns an error
  if (error && !usingMockData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon name="AlertTriangle" size={48} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">Error Loading Data</h2>
            <p className="text-text-secondary">{error.message || "Something went wrong"}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
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
                  Showing mock data due to API limitations
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
                  value={dashboardMetrics.totalArticles.toLocaleString()}
                  icon="FileText"
                  trend="+12%"
                  trendDirection="up"
                />
                <MetricCard
                  title="Recent Additions"
                  value={dashboardMetrics.recentAdditions}
                  icon="Plus"
                  trend="+5"
                  trendDirection="up"
                  subtitle="This week"
                />
                <MetricCard
                  title="Top Authors"
                  value={dashboardMetrics.topAuthors}
                  icon="Users"
                  trend="Active"
                  trendDirection="neutral"
                />
                <MetricCard
                  title="Pending Reviews"
                  value={dashboardMetrics.pendingReviews}
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

              {/* Recent Articles Preview - Now using real data when available */}
              <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-text-primary">Recent Articles</h2>
                    <p className="text-text-secondary">Latest published content</p>
                  </div>
                  <button
                    onClick={handleViewAllArticles}
                    className="text-primary hover:text-primary-700 font-medium flex items-center space-x-1 transition-colors duration-150"
                  >
                    <span>View All</span>
                    <Icon name="ArrowRight" size={16} />
                  </button>
                </div>

                {/* FIX 4: Add check for empty articles array */}
                {formattedArticles.length > 0 ? (
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
                    <p className="text-text-secondary">No articles available at the moment.</p>
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