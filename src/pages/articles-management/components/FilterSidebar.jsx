import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const FilterSidebar = ({ 
  filters, 
  setFilters, 
  availableAuthors, 
  searchQuery, 
  setSearchQuery,
  onClose 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    authors: true,
    contentTypes: true,
    dateRange: true,
    status: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAuthorToggle = (author) => {
    setFilters(prev => ({
      ...prev,
      authors: prev.authors.includes(author)
        ? prev.authors.filter(a => a !== author)
        : [...prev.authors, author]
    }));
  };

  const handleContentTypeToggle = (type) => {
    setFilters(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter(t => t !== type)
        : [...prev.contentTypes, type]
    }));
  };

  const handleDateRangeChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value
      }
    }));
  };

  const handleStatusChange = (status) => {
    setFilters(prev => ({
      ...prev,
      status
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      authors: [],
      contentTypes: ['news', 'blog'],
      dateRange: { start: '', end: '' },
      status: 'all'
    });
    setSearchQuery('');
  };

  const hasActiveFilters = 
    filters.authors.length > 0 || 
    filters.contentTypes.length < 2 || 
    filters.dateRange.start || 
    filters.dateRange.end || 
    filters.status !== 'all' ||
    searchQuery;

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary-50 transition-colors duration-150"
      >
        <span className="font-medium text-text-primary">{title}</span>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-secondary-500" 
        />
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-surface rounded-lg border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary hover:text-primary-700 font-medium transition-colors duration-150"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Search Section */}
      <FilterSection
        title="Search"
        isExpanded={expandedSections.search}
        onToggle={() => toggleSection('search')}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
          />
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" 
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-text-primary transition-colors duration-150"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>
      </FilterSection>

      {/* Authors Section */}
      <FilterSection
        title={`Authors ${filters.authors.length > 0 ? `(${filters.authors.length})` : ''}`}
        isExpanded={expandedSections.authors}
        onToggle={() => toggleSection('authors')}
      >
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableAuthors.map((author) => (
            <label key={author} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.authors.includes(author)}
                onChange={() => handleAuthorToggle(author)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm text-text-primary">{author}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Content Types Section */}
      <FilterSection
        title="Content Type"
        isExpanded={expandedSections.contentTypes}
        onToggle={() => toggleSection('contentTypes')}
      >
        <div className="space-y-2">
          {['news', 'blog'].map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.contentTypes.includes(type)}
                onChange={() => handleContentTypeToggle(type)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex items-center gap-2">
                <Icon 
                  name={type === 'news' ? 'Newspaper' : 'FileText'} 
                  size={14} 
                  className="text-secondary-500" 
                />
                <span className="text-sm text-text-primary capitalize">{type}</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Date Range Section */}
      <FilterSection
        title="Date Range"
        isExpanded={expandedSections.dateRange}
        onToggle={() => toggleSection('dateRange')}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">From</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">To</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
            />
          </div>
        </div>
      </FilterSection>

      {/* Status Section */}
      <FilterSection
        title="Status"
        isExpanded={expandedSections.status}
        onToggle={() => toggleSection('status')}
      >
        <div className="space-y-2">
          {[
            { value: 'all', label: 'All Status' },
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Draft' },
            { value: 'review', label: 'Under Review' }
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="status"
                value={option.value}
                checked={filters.status === option.value}
                onChange={() => handleStatusChange(option.value)}
                className="w-4 h-4 text-primary border-border focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm text-text-primary">{option.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;