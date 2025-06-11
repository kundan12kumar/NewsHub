import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Header from 'components/ui/Header';
import PayoutRateConfig from './components/PayoutRateConfig';
import PayoutCalculationTable from './components/PayoutCalculationTable';
import ExportSection from './components/ExportSection';
import PayoutSummary from './components/PayoutSummary';
import { useNewsData } from "hooks/useNewsData";

const PayoutManagementAdminOnly = () => {
  const navigate = useNavigate();
  const [payoutRates, setPayoutRates] = useState({
    newsArticle: { basic: 50, premium: 75, featured: 100 },
    blogPost: { basic: 40, premium: 60, featured: 80 }
  });
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [manualPaymentUpdates, setManualPaymentUpdates] = useState({});

  // REAL API CALL - Same parameters as Dashboard component
  const allArticlesParams = useMemo(() => ({ 
    q: "technology",
    pageSize: 100, // Same as Dashboard
    sortBy: "publishedAt",
  }), []);

  // Single API call for all data (same as Dashboard)
  const {
    data: allArticles,
    isLoading: dataLoading,
    error: dataError,
  } = useNewsData("everything", allArticlesParams, []); // Use "everything" endpoint like Dashboard

  // Transform all articles (same logic as Dashboard)
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

  // Generate payout data from real articles
  const payoutData = useMemo(() => {
    if (!transformedArticles || transformedArticles.length === 0) {
      return [];
    }

    // Group articles by author
    const authorGroups = {};
    transformedArticles.forEach(article => {
      if (article.author && article.author !== 'Unknown Author' && article.author.trim() !== '') {
        const author = article.author.trim();
        if (!authorGroups[author]) {
          authorGroups[author] = [];
        }
        authorGroups[author].push(article);
      }
    });

    const calculateAuthorTotal = (author, rates) => {
      const newsTotal = 
        (author.newsArticles.basic * rates.newsArticle.basic) +
        (author.newsArticles.premium * rates.newsArticle.premium) +
        (author.newsArticles.featured * rates.newsArticle.featured);
      
      const blogTotal = 
        (author.blogPosts.basic * rates.blogPost.basic) +
        (author.blogPosts.premium * rates.blogPost.premium) +
        (author.blogPosts.featured * rates.blogPost.featured);
      
      return newsTotal + blogTotal;
    };

    // Convert to payout format
    return Object.entries(authorGroups).map(([authorName, articles], index) => {
      // Categorize articles based on content length and views
      const newsArticles = { basic: 0, premium: 0, featured: 0 };
      const blogPosts = { basic: 0, premium: 0, featured: 0 };

      articles.forEach(article => {
        const contentLength = article.content?.length || 0;
        const views = article.views || 0;
        
        // Categorize as featured, premium, or basic based on content quality indicators
        let category = 'basic';
        if (contentLength > 1000 && views > 15000) {
          category = 'featured';
        } else if (contentLength > 500 && views > 8000) {
          category = 'premium';
        }

        // Randomly assign as news article or blog post (80% news, 20% blog)
        if (Math.random() > 0.2) {
          newsArticles[category]++;
        } else {
          blogPosts[category]++;
        }
      });

      // Calculate total amount
      const totalAmount = calculateAuthorTotal({ newsArticles, blogPosts }, payoutRates);

      // Generate realistic email from author name
      const generateEmail = (name) => {
        return name.toLowerCase()
          .replace(/[^a-z\s]/g, '')
          .split(' ')
          .join('.')
          .replace(/\s+/g, '') + '@newsorg.com';
      };

      // Generate realistic dates
      const joinDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString().split('T')[0];
      
      const lastPaymentDate = new Date(2024, 10 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 30) + 1)
        .toISOString().split('T')[0];

      // Generate realistic payment status
      const statuses = ['pending', 'paid', 'processing'];
      const statusWeights = [0.4, 0.5, 0.1]; // 40% pending, 50% paid, 10% processing
      let randomValue = Math.random();
      let paymentStatus = 'pending';
      
      if (randomValue < statusWeights[1]) {
        paymentStatus = 'paid';
      } else if (randomValue < statusWeights[1] + statusWeights[2]) {
        paymentStatus = 'processing';
      }

      // Check for manual payment updates
      const authorId = index + 1;
      const finalPaymentStatus = manualPaymentUpdates[authorId]?.status || paymentStatus;
      const finalLastPayment = manualPaymentUpdates[authorId]?.lastPayment || lastPaymentDate;

      return {
        id: authorId,
        authorName,
        email: generateEmail(authorName),
        newsArticles,
        blogPosts,
        totalAmount,
        paymentStatus: finalPaymentStatus,
        lastPayment: finalLastPayment,
        joinDate,
        articleCount: articles.length
      };
    }).sort((a, b) => b.totalAmount - a.totalAmount); // Sort by total amount descending
  }, [transformedArticles, payoutRates, manualPaymentUpdates]);

  const handleRateUpdate = (newRates) => {
    setPayoutRates(newRates);
    // In a real app, this would save to localStorage
    // localStorage.setItem('payoutRates', JSON.stringify(newRates));
  };

  const handleBulkStatusUpdate = (authorIds, newStatus) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const updates = {};
    
    authorIds.forEach(id => {
      updates[id] = {
        status: newStatus,
        lastPayment: currentDate
      };
    });

    setManualPaymentUpdates(prev => ({
      ...prev,
      ...updates
    }));
    
    setSelectedAuthors([]);
  };

  const filteredPayoutData = payoutData.filter(author => {
    const matchesSearch = author.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         author.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = paymentStatus === 'all' || author.paymentStatus === paymentStatus;
    const matchesDateRange = !dateRange.start || !dateRange.end || 
                            (author.lastPayment >= dateRange.start && author.lastPayment <= dateRange.end);
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const totalPending = filteredPayoutData
    .filter(author => author.paymentStatus === 'pending')
    .reduce((sum, author) => sum + author.totalAmount, 0);

  const totalPaid = filteredPayoutData
    .filter(author => author.paymentStatus === 'paid')
    .reduce((sum, author) => sum + author.totalAmount, 0);

  // Loading state
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading payout data from NewsAPI...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (dataError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon name="AlertTriangle" size={48} className="mx-auto mb-4 text-red-500" />
            <p className="text-text-primary mb-2">Failed to load payout data from NewsAPI</p>
            <p className="text-text-secondary mb-4">Error: {dataError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="hover:text-primary transition-colors duration-150"
            >
              Dashboard
            </button>
            <Icon name="ChevronRight" size={16} />
            <span className="text-text-primary font-medium">Admin</span>
            <Icon name="ChevronRight" size={16} />
            <span className="text-text-primary font-medium">Payouts</span>
          </nav>

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Payout Management</h1>
              <p className="text-text-secondary">Configure rates, calculate payments, and manage payouts for content creators</p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Shield" size={16} className="text-primary" />
                <span>Admin Access</span>
              </div>
            </div>
          </div>

          {/* Payout Summary */}
          <PayoutSummary 
            totalPending={totalPending}
            totalPaid={totalPaid}
            totalAuthors={filteredPayoutData.length}
            pendingAuthors={filteredPayoutData.filter(a => a.paymentStatus === 'pending').length}
          />

          {/* Payout Rate Configuration */}
          <PayoutRateConfig 
            payoutRates={payoutRates}
            onRateUpdate={handleRateUpdate}
          />

          {/* Filters and Search */}
          <div className="bg-surface rounded-lg shadow-sm border border-border p-6 mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Filters & Search</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Search Authors</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* No Data State */}
          {payoutData.length === 0 ? (
            <div className="bg-surface rounded-lg shadow-sm border border-border p-12 text-center">
              <Icon name="Users" size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No Authors Found</h3>
              <p className="text-text-secondary">
                No valid authors found in the NewsAPI dataset. This could be because:
              </p>
              <ul className="text-text-secondary text-sm mt-2 space-y-1">
                <li>• All articles have "Unknown Author" or missing author information</li>
                <li>• The NewsAPI data doesn't include author details for this search</li>
                <li>• The current query filter is too restrictive</li>
              </ul>
              <div className="mt-4">
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Payout Calculation Table */}
              <PayoutCalculationTable 
                payoutData={filteredPayoutData}
                payoutRates={payoutRates}
                selectedAuthors={selectedAuthors}
                onSelectedAuthorsChange={setSelectedAuthors}
                onBulkStatusUpdate={handleBulkStatusUpdate}
              />

              {/* Export Section */}
              <ExportSection 
                payoutData={filteredPayoutData}
                payoutRates={payoutRates}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayoutManagementAdminOnly;