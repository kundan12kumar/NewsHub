import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FileText, TrendingUp, Star, Users, BarChart3, FileDown, Download, AlertTriangle, Filter, X } from "lucide-react";
import Header from "components/ui/Header";


// Icon component using lucide-react
const Icon = ({ name, size = 16, color, className = "" }) => {
  const iconMap = {
    FileText,
    TrendingUp,
    Star,
    Users,
    BarChart3,
    AlertTriangle,
    FileDown,
    Download,
    Filter,
    X
  };
  
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  
  return (
    <IconComponent 
      size={size} 
      color={color} 
      className={className}
    />
  );
};

// Mock useNewsData hook
const useNewsData = () => {
  return {
    data: [],
    isLoading: false,
    usingMockData: true
  };
};

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("last30days");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for analytics
  const kpiData = {
    totalArticles: 1247,
    totalEngagement: 89432,
    topPerformingContent: "Breaking: Tech Innovation Summit 2024",
    activeAuthors: 23,
  };

  const mockArticlesByType = [
    { type: "News", count: 847, percentage: 68 },
    { type: "Blog", count: 400, percentage: 32 },
  ];

  const {
    data: newsData,
    isLoading: isNewsLoading,
    usingMockData,
  } = useNewsData("everything", { q: "technology", pageSize: 100 }, []);

  const mockPublicationTrends = [
    { date: "2024-01-01", articles: 45, engagement: 2340 },
    { date: "2024-01-02", articles: 52, engagement: 2890 },
    { date: "2024-01-03", articles: 38, engagement: 2156 },
    { date: "2024-01-04", articles: 61, engagement: 3245 },
    { date: "2024-01-05", articles: 47, engagement: 2567 },
    { date: "2024-01-06", articles: 55, engagement: 3012 },
    { date: "2024-01-07", articles: 43, engagement: 2234 },
  ];

  const authorProductivity = [
    { author: "Sarah Johnson", articles: 156, engagement: 12450 },
    { author: "Michael Chen", articles: 142, engagement: 11230 },
    { author: "Emily Rodriguez", articles: 134, engagement: 10890 },
    { author: "David Kim", articles: 128, engagement: 9876 },
    { author: "Lisa Thompson", articles: 119, engagement: 9234 },
    { author: "James Wilson", articles: 112, engagement: 8765 },
  ];


  const handleExportPDF = () => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      alert("PDF report exported successfully!");
    }, 2000);
  };

  const handleExportCSV = () => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      alert("CSV data exported successfully!");
    }, 1500);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Helper functions to process NewsAPI data
  function processArticlesByType(articles) {
    if (!articles || articles.length === 0) return mockArticlesByType;
    return [{ type: "News", count: articles.length, percentage: 100 }];
  }

  function processPublicationTrends(articles) {
    if (!articles || articles.length === 0) return mockPublicationTrends;
    
    const trendsMap = articles.reduce((acc, article) => {
      const date = article.publishedAt?.split("T")[0];
      if (date) {
        acc[date] = acc[date] || { date, articles: 0, engagement: 0 };
        acc[date].articles += 1;
        acc[date].engagement += Math.floor(Math.random() * 1000) + 500;
      }
      return acc;
    }, {});

    return Object.values(trendsMap).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }

  const articlesByType = usingMockData
    ? mockArticlesByType
    : processArticlesByType(newsData);

  const publicationTrends = usingMockData
    ? mockPublicationTrends
    : processPublicationTrends(newsData);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600">
                  Comprehensive insights into content performance and author
                  productivity
                </p>
                {usingMockData && (
                  <div className="mt-2 text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded inline-flex items-center">
                    <Icon name="AlertTriangle" size={14} className="mr-1" />
                    Showing mock data due to API limitations
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Articles
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {kpiData.totalArticles.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={24} color="#3B82F6" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Engagement
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {kpiData.totalEngagement.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon name="TrendingUp" size={24} color="#10B981" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Top Content
                      </p>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {kpiData.topPerformingContent}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Icon name="Star" size={24} color="#F59E0B" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Active Authors
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {kpiData.activeAuthors}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon name="Users" size={24} color="#8B5CF6" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Article Count by Type */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Articles by Type
                    </h3>
                    <Icon name="BarChart3" size={20} className="text-gray-500" />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={articlesByType}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="type" stroke="#6B7280" fontSize={12} />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #E5E7EB",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill="#3B82F6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Publication Trends */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Publication Trends
                    </h3>
                    <Icon name="TrendingUp" size={20} className="text-gray-500" />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={publicationTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={formatDate}
                          stroke="#6B7280"
                          fontSize={12}
                        />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip
                          labelFormatter={(value) => formatDate(value)}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #E5E7EB",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="articles"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                          name="Articles"
                        />
                        <Line
                          type="monotone"
                          dataKey="engagement"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                          name="Engagement"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Author Productivity Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Author Productivity
                  </h3>
                  <Icon name="Users" size={20} className="text-gray-500" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={authorProductivity} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis type="number" stroke="#6B7280" fontSize={12} />
                      <YAxis
                        type="category"
                        dataKey="author"
                        stroke="#6B7280"
                        fontSize={12}
                        width={120}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="articles"
                        fill="#3B82F6"
                        radius={[0, 4, 4, 0]}
                        name="Articles"
                      />
                      <Bar
                        dataKey="engagement"
                        fill="#F59E0B"
                        radius={[0, 4, 4, 0]}
                        name="Engagement"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;