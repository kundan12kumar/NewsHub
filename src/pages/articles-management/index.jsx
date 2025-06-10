import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from 'components/ui/Header';
import Icon from 'components/AppIcon';
import { useNewsData } from 'hooks/useNewsData';

import ArticleCard from './components/ArticleCard';
import ArticleTable from './components/ArticleTable';
import FilterSidebar from './components/FilterSidebar';
import BulkActionsToolbar from './components/BulkActionsToolbar';

// FIX 1: Move mockArticles OUTSIDE component to prevent recreation on every render
const MOCK_ARTICLES = [
  {
    id: 1,
    title: "Breaking: Major Tech Company Announces Revolutionary AI Breakthrough",
    author: "Sarah Johnson",
    date: "2024-01-15",
    type: "news",
    status: "published",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
    excerpt: "A groundbreaking development in artificial intelligence promises to transform how we interact with technology in our daily lives.",
    readTime: "5 min read",
    views: 12500,
    category: "Technology"
  },
  {
    id: 2,
    title: "The Future of Remote Work: Trends and Predictions for 2024",
    author: "Michael Chen",
    date: "2024-01-14",
    type: "blog",
    status: "published",
    thumbnail: "https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?w=400&h=250&fit=crop",
    excerpt: "Exploring the evolving landscape of remote work and what organizations need to know to stay competitive.",
    readTime: "8 min read",
    views: 8750,
    category: "Business"
  },
  {
    id: 3,
    title: "Climate Change Summit Reaches Historic Agreement",
    author: "Emma Rodriguez",
    date: "2024-01-13",
    type: "news",
    status: "published",
    thumbnail: "https://images.pixabay.com/photo/2013/07/18/20/26/sea-164989_1280.jpg?w=400&h=250&fit=crop",
    excerpt: "World leaders unite on ambitious climate targets in what experts call the most significant environmental agreement in decades.",
    readTime: "6 min read",
    views: 15200,
    category: "Environment"
  },
  {
    id: 4,
    title: "Cryptocurrency Market Analysis: What Investors Need to Know",
    author: "David Park",
    date: "2024-01-12",
    type: "blog",
    status: "draft",
    thumbnail: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=250&fit=crop",
    excerpt: "A comprehensive analysis of current cryptocurrency trends and investment strategies for the modern portfolio.",
    readTime: "12 min read",
    views: 0,
    category: "Finance"
  },
  {
    id: 5,
    title: "Healthcare Innovation: New Treatment Shows Promise",
    author: "Dr. Lisa Thompson",
    date: "2024-01-11",
    type: "news",
    status: "published",
    thumbnail: "https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?w=400&h=250&fit=crop",
    excerpt: "Medical researchers announce breakthrough treatment that could revolutionize patient care for chronic conditions.",
    readTime: "7 min read",
    views: 9800,
    category: "Health"
  },
  {
    id: 6,
    title: "The Art of Digital Storytelling in Modern Marketing",
    author: "Jennifer Walsh",
    date: "2024-01-10",
    type: "blog",
    status: "published",
    thumbnail: "https://images.pixabay.com/photo/2017/01/29/21/16/nurse-2017825_1280.jpg?w=400&h=250&fit=crop",
    excerpt: "How brands are leveraging narrative techniques to create compelling digital experiences that resonate with audiences.",
    readTime: "10 min read",
    views: 6400,
    category: "Marketing"
  },
  {
    id: 7,
    title: "Space Exploration Milestone: Mars Mission Update",
    author: "Robert Kim",
    date: "2024-01-09",
    type: "news",
    status: "published",
    thumbnail: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=250&fit=crop",
    excerpt: "Latest developments from the Mars exploration mission reveal fascinating discoveries about the Red Planet's geology.",
    readTime: "9 min read",
    views: 18700,
    category: "Science"
  },
  {
    id: 8,
    title: "Sustainable Fashion: The Rise of Eco-Conscious Brands",
    author: "Maria Santos",
    date: "2024-01-08",
    type: "blog",
    status: "review",
    thumbnail: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?w=400&h=250&fit=crop",
    excerpt: "Examining how fashion brands are embracing sustainability and what consumers can do to support ethical fashion choices.",
    readTime: "11 min read",
    views: 0,
    category: "Lifestyle"
  }
];

const ArticlesManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management
  const [viewMode, setViewMode] = useState('card');
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    authors: [],
    contentTypes: ['news', 'blog'],
    dateRange: {
      start: '',
      end: ''
    },
    status: 'all'
  });

  // FIX 2: Memoize news hook parameters to prevent unnecessary calls
  const newsParams = useMemo(() => ({
    q: 'technology',
    pageSize: 20
  }), []);

  // Use news data hook with stable parameters
  const { 
    data: newsData, 
    isLoading: isNewsLoading, 
    usingMockData, 
    error 
  } = useNewsData('everything', newsParams, MOCK_ARTICLES);

  // FIX 3: Optimize article transformation with proper dependencies
  const transformedArticles = useMemo(() => {
    if (!newsData || newsData.length === 0) {
      return MOCK_ARTICLES;
    }

    if (usingMockData) {
      return newsData;
    }

    return newsData.map((article, index) => ({
      id: index + 1,
      title: article.title || 'Untitled Article',
      author: article.author || 'Unknown Author',
      date: article.publishedAt ? article.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
      type: 'news',
      status: 'published',
      thumbnail: article.urlToImage || 'https://via.placeholder.com/400x250',
      excerpt: article.description || 'No description available',
      readTime: `${Math.max(1, Math.floor((article.content?.length || 500) / 500))} min read`,
      views: Math.floor(Math.random() * 20000),
      category: 'Technology'
    }));
  }, [newsData, usingMockData]); // Removed MOCK_ARTICLES from dependencies since it's constant

  // FIX 4: Optimize available authors calculation
  const availableAuthors = useMemo(() => {
    if (!transformedArticles || transformedArticles.length === 0) {
      return [];
    }
    return [...new Set(transformedArticles.map(article => article.author))];
  }, [transformedArticles]);

  // FIX 5: Optimize filtering and sorting with better dependencies
  const filteredAndSortedArticles = useMemo(() => {
    if (!transformedArticles || transformedArticles.length === 0) {
      return [];
    }

    let filtered = transformedArticles.filter(article => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          article.title.toLowerCase().includes(searchLower) ||
          article.author.toLowerCase().includes(searchLower) ||
          article.excerpt.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Author filter
      if (filters.authors.length > 0 && !filters.authors.includes(article.author)) {
        return false;
      }

      // Content type filter
      if (!filters.contentTypes.includes(article.type)) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.start && article.date < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && article.date > filters.dateRange.end) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && article.status !== filters.status) {
        return false;
      }

      return true;
    });

    // Sort articles
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'author':
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'views':
          aValue = a.views;
          bValue = b.views;
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [transformedArticles, searchQuery, filters, sortBy, sortOrder]);

  // FIX 6: Handle URL search params only once on mount and location change
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    if (searchParam && searchParam !== searchQuery) {
      setSearchQuery(searchParam);
    }
  }, [location.search]); // Removed searchQuery from dependencies to prevent loop

  // FIX 7: Use useCallback for event handlers to prevent child re-renders
  const handleSelectArticle = useCallback((articleId) => {
    setSelectedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedArticles(prev => {
      if (prev.length === filteredAndSortedArticles.length) {
        return [];
      } else {
        return filteredAndSortedArticles.map(article => article.id);
      }
    });
  }, [filteredAndSortedArticles]);

  const handleBulkAction = useCallback((action) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log(`Performing ${action} on articles:`, selectedArticles);
      setSelectedArticles([]);
      setIsLoading(false);
    }, 1000);
  }, [selectedArticles]);

  const handleArticleAction = useCallback((action, articleId) => {
    console.log(`Performing ${action} on article:`, articleId);
  }, []);

  // FIX 8: Memoize sort handler
  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }, [sortBy]);

  // FIX 9: Memoize sort value for select
  const sortValue = useMemo(() => `${sortBy}-${sortOrder}`, [sortBy, sortOrder]);

  const handleSortChange = useCallback((e) => {
    const [field, order] = e.target.value.split('-');
    setSortBy(field);
    setSortOrder(order);
  }, []);

  // Error state handling
  if (error && !usingMockData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon name="AlertTriangle" size={48} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">Error Loading Articles</h2>
            <p className="text-text-secondary mb-4">{error.message || "Something went wrong"}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700"
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
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Articles Management</h1>
            <p className="text-text-secondary">Manage and organize your news articles and blog posts</p>
            {usingMockData && (
              <div className="mt-2 text-sm text-warning-600 bg-warning-50 px-3 py-1 rounded inline-flex items-center">
                <Icon name="AlertTriangle" size={14} className="mr-1" />
                Showing mock data due to API limitations
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                availableAuthors={availableAuthors}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="bg-surface rounded-lg border border-border p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Mobile Filter Button */}
                    <button
                      onClick={() => setIsMobileFiltersOpen(true)}
                      className="lg:hidden flex items-center gap-2 px-3 py-2 bg-secondary-100 text-secondary-700 rounded-md hover:bg-secondary-200 transition-colors duration-150"
                    >
                      <Icon name="Filter" size={16} />
                      <span className="text-sm font-medium">Filters</span>
                    </button>

                    {/* Results Count */}
                    <div className="text-sm text-text-secondary">
                      <span className="font-medium text-text-primary">{filteredAndSortedArticles.length}</span> articles found
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Sort Dropdown */}
                    <select
                      value={sortValue}
                      onChange={handleSortChange}
                      className="px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="date-desc">Newest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="title-asc">Title A-Z</option>
                      <option value="title-desc">Title Z-A</option>
                      <option value="author-asc">Author A-Z</option>
                      <option value="views-desc">Most Views</option>
                    </select>

                    {/* View Toggle */}
                    <div className="flex items-center bg-secondary-100 rounded-md p-1">
                      <button
                        onClick={() => setViewMode('card')}
                        className={`p-2 rounded transition-colors duration-150 ${
                          viewMode === 'card' ? 'bg-surface text-primary shadow-sm' : 'text-secondary-600 hover:text-text-primary'
                        }`}
                      >
                        <Icon name="Grid3X3" size={16} />
                      </button>
                      <button
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded transition-colors duration-150 ${
                          viewMode === 'table' ? 'bg-surface text-primary shadow-sm' : 'text-secondary-600 hover:text-text-primary'
                        }`}
                      >
                        <Icon name="List" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bulk Actions Toolbar */}
              {selectedArticles.length > 0 && (
                <BulkActionsToolbar
                  selectedCount={selectedArticles.length}
                  onBulkAction={handleBulkAction}
                  isLoading={isLoading}
                />
              )}

              {/* Articles Display */}
              {isNewsLoading || isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3 text-text-secondary">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading articles...</span>
                  </div>
                </div>
              ) : filteredAndSortedArticles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="FileText" size={32} className="text-secondary-400" />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">No articles found</h3>
                  <p className="text-text-secondary">Try adjusting your filters or search terms</p>
                </div>
              ) : viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAndSortedArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      isSelected={selectedArticles.includes(article.id)}
                      onSelect={handleSelectArticle}
                      onAction={handleArticleAction}
                    />
                  ))}
                </div>
              ) : (
                <ArticleTable
                  articles={filteredAndSortedArticles}
                  selectedArticles={selectedArticles}
                  onSelectArticle={handleSelectArticle}
                  onSelectAll={handleSelectAll}
                  onAction={handleArticleAction}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isMobileFiltersOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 bg-surface z-50 lg:hidden overflow-y-auto">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 hover:bg-secondary-100 rounded-md transition-colors duration-150"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                availableAuthors={availableAuthors}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onClose={() => setIsMobileFiltersOpen(false)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ArticlesManagement;