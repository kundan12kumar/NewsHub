import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Header from 'components/ui/Header';
import PayoutRateConfig from './components/PayoutRateConfig';
import PayoutCalculationTable from './components/PayoutCalculationTable';
import ExportSection from './components/ExportSection';
import PayoutSummary from './components/PayoutSummary';

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

  // Mock payout data
  const mockPayoutData = [
    {
      id: 1,
      authorName: "Sarah Johnson",
      email: "sarah.johnson@newsorg.com",
      newsArticles: { basic: 12, premium: 8, featured: 3 },
      blogPosts: { basic: 5, premium: 3, featured: 1 },
      totalAmount: 1540,
      paymentStatus: "pending",
      lastPayment: "2024-11-15",
      joinDate: "2024-01-15"
    },
    {
      id: 2,
      authorName: "Michael Chen",
      email: "michael.chen@newsorg.com",
      newsArticles: { basic: 15, premium: 10, featured: 5 },
      blogPosts: { basic: 8, premium: 4, featured: 2 },
      totalAmount: 2020,
      paymentStatus: "paid",
      lastPayment: "2024-12-01",
      joinDate: "2024-02-20"
    },
    {
      id: 3,
      authorName: "Emily Rodriguez",
      email: "emily.rodriguez@newsorg.com",
      newsArticles: { basic: 20, premium: 12, featured: 4 },
      blogPosts: { basic: 10, premium: 6, featured: 2 },
      totalAmount: 2280,
      paymentStatus: "pending",
      lastPayment: "2024-11-20",
      joinDate: "2024-03-10"
    },
    {
      id: 4,
      authorName: "David Thompson",
      email: "david.thompson@newsorg.com",
      newsArticles: { basic: 8, premium: 5, featured: 2 },
      blogPosts: { basic: 4, premium: 2, featured: 1 },
      totalAmount: 940,
      paymentStatus: "processing",
      lastPayment: "2024-11-25",
      joinDate: "2024-04-05"
    },
    {
      id: 5,
      authorName: "Lisa Wang",
      email: "lisa.wang@newsorg.com",
      newsArticles: { basic: 18, premium: 14, featured: 6 },
      blogPosts: { basic: 12, premium: 8, featured: 3 },
      totalAmount: 2760,
      paymentStatus: "paid",
      lastPayment: "2024-12-05",
      joinDate: "2024-01-30"
    }
  ];

  const [payoutData, setPayoutData] = useState(mockPayoutData);

  useEffect(() => {
    // Load saved payout rates from localStorage
    const savedRates = localStorage.getItem('payoutRates');
    if (savedRates) {
      setPayoutRates(JSON.parse(savedRates));
    }
  }, []);

  const handleRateUpdate = (newRates) => {
    setPayoutRates(newRates);
    localStorage.setItem('payoutRates', JSON.stringify(newRates));
    
    // Recalculate amounts for all authors
    const updatedData = payoutData.map(author => ({
      ...author,
      totalAmount: calculateAuthorTotal(author, newRates)
    }));
    setPayoutData(updatedData);
  };

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

  const handleBulkStatusUpdate = (authorIds, newStatus) => {
    const updatedData = payoutData.map(author => 
      authorIds.includes(author.id) 
        ? { ...author, paymentStatus: newStatus, lastPayment: new Date().toISOString().split('T')[0] }
        : author
    );
    setPayoutData(updatedData);
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
        </div>
      </div>
    </div>
  );
};

export default PayoutManagementAdminOnly;