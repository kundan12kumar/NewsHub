import React from 'react';
import Icon from 'components/AppIcon';

const QuickFilters = ({ 
  selectedDateRange, 
  selectedContentType, 
  onDateRangeChange, 
  onContentTypeChange 
}) => {
  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' },
    { value: 'year', label: 'This year' }
  ];

  const contentTypeOptions = [
    { value: 'all', label: 'All Content', icon: 'FileText' },
    { value: 'news', label: 'News', icon: 'Newspaper' },
    { value: 'blog', label: 'Blog Posts', icon: 'Edit3' }
  ];

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
        <Icon name="Filter" size={20} />
        <span>Quick Filters</span>
      </h3>
      
      {/* Date Range Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-2">
          Date Range
        </label>
        <select
          value={selectedDateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="w-full border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150 bg-surface text-text-primary"
        >
          {dateRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Content Type Filter */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Content Type
        </label>
        <div className="space-y-2">
          {contentTypeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onContentTypeChange(option.value)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors duration-150 ${
                selectedContentType === option.value
                  ? 'bg-primary-100 text-primary-700 border border-primary-200' :'text-text-secondary hover:bg-secondary-100 border border-transparent'
              }`}
            >
              <Icon name={option.icon} size={16} />
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <button className="w-full mt-6 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 font-medium">
        Apply Filters
      </button>
    </div>
  );
};

export default QuickFilters;