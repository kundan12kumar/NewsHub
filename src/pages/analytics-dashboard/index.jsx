import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from 'components/ui/Header';
import Icon from 'components/AppIcon';

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for analytics
  const kpiData = {
    totalArticles: 1247,
    totalEngagement: 89432,
    topPerformingContent: 'Breaking: Tech Innovation Summit 2024',
    activeAuthors: 23
  };

  const articlesByType = [
    { type: 'News', count: 847, percentage: 68 },
    { type: 'Blog', count: 400, percentage: 32 }
  ];

  const publicationTrends = [
    { date: '2024-01-01', articles: 45, engagement: 2340 },
    { date: '2024-01-02', articles: 52, engagement: 2890 },
    { date: '2024-01-03', articles: 38, engagement: 2156 },
    { date: '2024-01-04', articles: 61, engagement: 3245 },
    { date: '2024-01-05', articles: 47, engagement: 2567 },
    { date: '2024-01-06', articles: 55, engagement: 3012 },
    { date: '2024-01-07', articles: 43, engagement: 2234 }
  ];

  const authorProductivity = [
    { author: 'Sarah Johnson', articles: 156, engagement: 12450 },
    { author: 'Michael Chen', articles: 142, engagement: 11230 },
    { author: 'Emily Rodriguez', articles: 134, engagement: 10890 },
    { author: 'David Kim', articles: 128, engagement: 9876 },
    { author: 'Lisa Thompson', articles: 119, engagement: 9234 },
    { author: 'James Wilson', articles: 112, engagement: 8765 }
  ];

  const quickInsights = [
    {
      title: 'Top Performing Day',
      value: 'Thursday',
      description: 'Highest average engagement'
    },
    {
      title: 'Peak Publishing Time',
      value: '2:00 PM',
      description: 'Most articles published'
    },
    {
      title: 'Growth Rate',
      value: '+12.5%',
      description: 'vs. previous month'
    }
  ];

  const handleExportPDF = () => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      alert('PDF report exported successfully!');
    }, 2000);
  };

  const handleExportCSV = () => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      alert('CSV data exported successfully!');
    }, 1500);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">Analytics Dashboard</h1>
                <p className="text-text-secondary">Comprehensive insights into content performance and author productivity</p>
              </div>
              
              {/* Export Actions */}
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <button
                  onClick={handleExportPDF}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
                >
                  <Icon name="FileDown" size={16} />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-secondary-100 text-secondary-700 px-4 py-2 rounded-md hover:bg-secondary-200 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
                >
                  <Icon name="Download" size={16} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Total Articles</p>
                      <p className="text-2xl font-bold text-text-primary">{kpiData.totalArticles.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={24} color="var(--color-primary)" />
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Total Engagement</p>
                      <p className="text-2xl font-bold text-text-primary">{kpiData.totalEngagement.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                      <Icon name="TrendingUp" size={24} color="var(--color-success)" />
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Top Content</p>
                      <p className="text-sm font-bold text-text-primary truncate">{kpiData.topPerformingContent}</p>
                    </div>
                    <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                      <Icon name="Star" size={24} color="var(--color-accent)" />
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-secondary">Active Authors</p>
                      <p className="text-2xl font-bold text-text-primary">{kpiData.activeAuthors}</p>
                    </div>
                    <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <Icon name="Users" size={24} color="var(--color-secondary)" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Article Count by Type */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">Articles by Type</h3>
                    <Icon name="BarChart3" size={20} className="text-text-secondary" />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={articlesByType}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis 
                          dataKey="type" 
                          stroke="var(--color-text-secondary)"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="var(--color-text-secondary)"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="var(--color-primary)" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Publication Trends */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">Publication Trends</h3>
                    <Icon name="TrendingUp" size={20} className="text-text-secondary" />
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={publicationTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={formatDate}
                          stroke="var(--color-text-secondary)"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="var(--color-text-secondary)"
                          fontSize={12}
                        />
                        <Tooltip 
                          labelFormatter={(value) => formatDate(value)}
                          contentStyle={{
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="articles" 
                          stroke="var(--color-primary)" 
                          strokeWidth={2}
                          dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                          name="Articles"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="engagement" 
                          stroke="var(--color-accent)" 
                          strokeWidth={2}
                          dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                          name="Engagement"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Author Productivity Chart */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">Author Productivity</h3>
                  <Icon name="Users" size={20} className="text-text-secondary" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={authorProductivity} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis 
                        type="number"
                        stroke="var(--color-text-secondary)"
                        fontSize={12}
                      />
                      <YAxis 
                        type="category"
                        dataKey="author" 
                        stroke="var(--color-text-secondary)"
                        fontSize={12}
                        width={120}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="articles" 
                        fill="var(--color-primary)" 
                        radius={[0, 4, 4, 0]}
                        name="Articles"
                      />
                      <Bar 
                        dataKey="engagement" 
                        fill="var(--color-accent)" 
                        radius={[0, 4, 4, 0]}
                        name="Engagement"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right Panel - Desktop Only */}
            <div className="hidden lg:block space-y-6">
              {/* Filters */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Filters</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Date Range
                    </label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full input-field"
                    >
                      <option value="last7days">Last 7 days</option>
                      <option value="last30days">Last 30 days</option>
                      <option value="last90days">Last 90 days</option>
                      <option value="lastyear">Last year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Content Type
                    </label>
                    <select
                      value={contentTypeFilter}
                      onChange={(e) => setContentTypeFilter(e.target.value)}
                      className="w-full input-field"
                    >
                      <option value="all">All Types</option>
                      <option value="news">News Only</option>
                      <option value="blog">Blog Only</option>
                    </select>
                  </div>

                  <button className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200">
                    Apply Filters
                  </button>
                </div>
              </div>

              {/* Quick Insights */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Insights</h3>
                
                <div className="space-y-4">
                  {quickInsights.map((insight, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <h4 className="font-medium text-text-primary">{insight.title}</h4>
                      <p className="text-lg font-bold text-primary">{insight.value}</p>
                      <p className="text-sm text-text-secondary">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Panel */}
        <div className="lg:hidden">
          {/* Floating Action Button */}
          <button
            onClick={() => setIsFilterPanelOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 z-50"
          >
            <Icon name="Filter" size={24} />
          </button>

          {/* Filter Panel Overlay */}
          {isFilterPanelOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setIsFilterPanelOpen(false)}
              />
              <div className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-lg shadow-lg z-50 animate-slide-up">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">Filters & Insights</h3>
                    <button
                      onClick={() => setIsFilterPanelOpen(false)}
                      className="p-2 hover:bg-secondary-100 rounded-md transition-colors duration-150"
                    >
                      <Icon name="X" size={20} />
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Date Range
                      </label>
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full input-field"
                      >
                        <option value="last7days">Last 7 days</option>
                        <option value="last30days">Last 30 days</option>
                        <option value="last90days">Last 90 days</option>
                        <option value="lastyear">Last year</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Content Type
                      </label>
                      <select
                        value={contentTypeFilter}
                        onChange={(e) => setContentTypeFilter(e.target.value)}
                        className="w-full input-field"
                      >
                        <option value="all">All Types</option>
                        <option value="news">News Only</option>
                        <option value="blog">Blog Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mb-6">
                    {quickInsights.map((insight, index) => (
                      <div key={index} className="bg-secondary-50 p-3 rounded-md">
                        <h4 className="font-medium text-text-primary text-sm">{insight.title}</h4>
                        <p className="text-lg font-bold text-primary">{insight.value}</p>
                        <p className="text-xs text-text-secondary">{insight.description}</p>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setIsFilterPanelOpen(false)}
                    className="w-full bg-primary text-white px-4 py-3 rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;