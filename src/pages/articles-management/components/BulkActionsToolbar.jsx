import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const BulkActionsToolbar = ({ selectedCount, onBulkAction, isLoading }) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const handleAction = (action) => {
    onBulkAction(action);
    setIsExportMenuOpen(false);
  };

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Check" size={16} color="white" />
          </div>
          <span className="text-sm font-medium text-primary-700">
            {selectedCount} article{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-surface text-text-primary border border-border rounded-md hover:bg-secondary-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="Download" size={16} />
              <span className="text-sm font-medium">Export</span>
              <Icon name="ChevronDown" size={14} />
            </button>

            {isExportMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setIsExportMenuOpen(false)}
                />
                <div className="absolute right-0 top-10 w-40 bg-surface rounded-md shadow-lg border border-border z-20">
                  <div className="py-1">
                    <button
                      onClick={() => handleAction('export-csv')}
                      className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-secondary-100 transition-colors duration-150"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleAction('export-pdf')}
                      className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-secondary-100 transition-colors duration-150"
                    >
                      Export as PDF
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Status Actions */}
          <button
            onClick={() => handleAction('publish')}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-success text-white rounded-md hover:bg-success-600 focus:ring-2 focus:ring-success-500 focus:ring-offset-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="Globe" size={16} />
            <span className="text-sm font-medium">Publish</span>
          </button>

          <button
            onClick={() => handleAction('archive')}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-secondary text-white rounded-md hover:bg-secondary-600 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="Archive" size={16} />
            <span className="text-sm font-medium">Archive</span>
          </button>

          <button
            onClick={() => handleAction('delete')}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-error text-white rounded-md hover:bg-error-600 focus:ring-2 focus:ring-error-500 focus:ring-offset-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="Trash2" size={16} />
            <span className="text-sm font-medium">Delete</span>
          </button>

          {isLoading && (
            <div className="flex items-center gap-2 text-primary">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Processing...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;