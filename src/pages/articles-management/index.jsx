import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "components/ui/Header";
import Icon from "components/AppIcon";
import { useNewsData } from "hooks/useNewsData";

import ArticleCard from "./components/ArticleCard";
import ArticleTable from "./components/ArticleTable";
import FilterSidebar from "./components/FilterSidebar";
import BulkActionsToolbar from "./components/BulkActionsToolbar";

// Pagination component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-surface rounded-lg border border-border">
      <div className="text-sm text-text-secondary">
        Showing {startItem} to {endItem} of {totalItems} articles
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 border border-border rounded-md hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <Icon name="ChevronLeft" size={16} />
        </button>

        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-text-secondary">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 rounded-md transition-colors duration-150 ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "border border-border hover:bg-secondary-50"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 border border-border rounded-md hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <Icon name="ChevronRight" size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <label htmlFor="itemsPerPage" className="text-text-secondary">
          Items per page:
        </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => onPageChange(1, parseInt(e.target.value))}
          className="px-2 py-1 border border-border rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
};

const ArticlesManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State management
  const [viewMode, setViewMode] = useState("card");
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Filter states
  const [filters, setFilters] = useState({
    authors: [],
    contentTypes: ["news", "blog"],
    dateRange: {
      start: "",
      end: "",
    },
    status: "all",
  });

  // Modified news hook parameters to fetch more articles
  const newsParams = useMemo(
    () => ({
      q: "technology",
      pageSize: 100, // Fetch more articles from API
      sortBy: "publishedAt",
    }),
    []
  );

  // Use news data hook with stable parameters
  const {
    data: newsData,
    isLoading: isNewsLoading,
    error,
  } = useNewsData("everything", newsParams);

  // Transform articles from NewsAPI
  const transformedArticles = useMemo(() => {
    if (!newsData || newsData.length === 0) {
      return [];
    }

    return newsData.map((article, index) => ({
      id: index + 1,
      title: article.title || "Untitled Article",
      author: article.author || "Unknown Author",
      date: article.publishedAt
        ? article.publishedAt.split("T")[0]
        : new Date().toISOString().split("T")[0],
      type: "news",
      status: "published",
      thumbnail: article.urlToImage || "https://via.placeholder.com/400x250",
      excerpt: article.description || "No description available",
      readTime: `${Math.max(
        1,
        Math.floor((article.content?.length || 500) / 500)
      )} min read`,
      views: Math.floor(Math.random() * 20000),
      category: "Technology",
      url: article.url,
      source: article.source?.name || "Unknown Source",
    }));
  }, [newsData]);

  // Available authors calculation
  const availableAuthors = useMemo(() => {
    if (!transformedArticles || transformedArticles.length === 0) {
      return [];
    }
    return [...new Set(transformedArticles.map((article) => article.author))];
  }, [transformedArticles]);

  // Filtering and sorting (without pagination)
  const filteredAndSortedArticles = useMemo(() => {
    if (!transformedArticles || transformedArticles.length === 0) {
      return [];
    }

    let filtered = transformedArticles.filter((article) => {
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
      if (
        filters.authors.length > 0 &&
        !filters.authors.includes(article.author)
      ) {
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
      if (filters.status !== "all" && article.status !== filters.status) {
        return false;
      }

      return true;
    });

    // Sort articles
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "author":
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "views":
          aValue = a.views;
          bValue = b.views;
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [transformedArticles, searchQuery, filters, sortBy, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArticles = filteredAndSortedArticles.slice(
    startIndex,
    endIndex
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy, sortOrder]);

  // Handle URL search params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get("search");
    const pageParam = urlParams.get("page");

    if (searchParam && searchParam !== searchQuery) {
      setSearchQuery(searchParam);
    }

    if (pageParam && parseInt(pageParam) !== currentPage) {
      setCurrentPage(parseInt(pageParam) || 1);
    }
  }, [location.search]);

  // Update URL when page changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (currentPage > 1) {
      urlParams.set("page", currentPage.toString());
    } else {
      urlParams.delete("page");
    }

    const newSearch = urlParams.toString();
    const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ""}`;

    if (newUrl !== `${location.pathname}${location.search}`) {
      navigate(newUrl, { replace: true });
    }
  }, [currentPage, location.pathname, location.search, navigate]);

  // Event handlers
  const handleArticleClick = useCallback(
    (article) => {
      navigate(`/article/${article.id}`, {
        state: {
          article: article,
        },
      });
    },
    [navigate]
  );
  const handleSelectArticle = useCallback((articleId) => {
    setSelectedArticles((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedArticles((prev) => {
      if (prev.length === paginatedArticles.length) {
        return [];
      } else {
        return paginatedArticles.map((article) => article.id);
      }
    });
  }, [paginatedArticles]);

  const handleBulkAction = useCallback(
    (action) => {
      setIsLoading(true);
      setTimeout(() => {
        console.log(`Performing ${action} on articles:`, selectedArticles);
        setSelectedArticles([]);
        setIsLoading(false);
      }, 1000);
    },
    [selectedArticles]
  );

  const handleArticleAction = useCallback((action, articleId) => {
    console.log(`Performing ${action} on article:`, articleId);
  }, []);

  const handleSort = useCallback(
    (field) => {
      if (sortBy === field) {
        setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(field);
        setSortOrder("asc");
      }
    },
    [sortBy]
  );

  const sortValue = useMemo(
    () => `${sortBy}-${sortOrder}`,
    [sortBy, sortOrder]
  );

  const handleSortChange = useCallback((e) => {
    const [field, order] = e.target.value.split("-");
    setSortBy(field);
    setSortOrder(order);
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback(
    (page, newItemsPerPage = itemsPerPage) => {
      if (newItemsPerPage !== itemsPerPage) {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
      } else {
        setCurrentPage(page);
      }
      // Clear selections when changing pages
      setSelectedArticles([]);
    },
    [itemsPerPage]
  );

  // Error state handling
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon
              name="AlertTriangle"
              size={48}
              className="mx-auto mb-4 text-red-500"
            />
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Error Loading Articles
            </h2>
            <p className="text-text-secondary mb-4">
              {error.message || "Something went wrong"}
            </p>
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
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Articles Management
            </h1>
            <p className="text-text-secondary">
              Manage and organize your news articles and blog posts
            </p>
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
                      <span className="font-medium text-text-primary">
                        {filteredAndSortedArticles.length}
                      </span>{" "}
                      articles found
                      {filteredAndSortedArticles.length > itemsPerPage && (
                        <span className="ml-2">
                          (showing {paginatedArticles.length} on page{" "}
                          {currentPage} of {totalPages})
                        </span>
                      )}
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
                        onClick={() => setViewMode("card")}
                        className={`p-2 rounded transition-colors duration-150 ${
                          viewMode === "card"
                            ? "bg-surface text-primary shadow-sm"
                            : "text-secondary-600 hover:text-text-primary"
                        }`}
                      >
                        <Icon name="Grid3X3" size={16} />
                      </button>
                      <button
                        onClick={() => setViewMode("table")}
                        className={`p-2 rounded transition-colors duration-150 ${
                          viewMode === "table"
                            ? "bg-surface text-primary shadow-sm"
                            : "text-secondary-600 hover:text-text-primary"
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
                    <Icon
                      name="FileText"
                      size={32}
                      className="text-secondary-400"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    No articles found
                  </h3>
                  <p className="text-text-secondary">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              ) : viewMode === "card" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedArticles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        isSelected={selectedArticles.includes(article.id)}
                        onSelect={handleSelectArticle}
                        onAction={handleArticleAction}
                        onClick={handleArticleClick} // Add this prop
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredAndSortedArticles.length}
                  />
                </>
              ) : (
                <>
                  <ArticleTable
                    articles={paginatedArticles}
                    selectedArticles={selectedArticles}
                    onSelectArticle={handleSelectArticle}
                    onSelectAll={handleSelectAll}
                    onAction={handleArticleAction}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredAndSortedArticles.length}
                  />
                </>
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
                <h2 className="text-lg font-semibold text-text-primary">
                  Filters
                </h2>
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
