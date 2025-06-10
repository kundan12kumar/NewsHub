import React, { useState, useEffect, useMemo } from 'react';
import Icon from 'components/AppIcon';

const PayoutCalculationTable = ({ 
  payoutData, 
  payoutRates, 
  selectedAuthors, 
  onSelectedAuthorsChange, 
  onBulkStatusUpdate 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return payoutData;

    return [...payoutData].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'totalAmount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [payoutData, sortConfig]);

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectedAuthorsChange(payoutData.map(author => author.id));
    } else {
      onSelectedAuthorsChange([]);
    }
  };

  const handleSelectAuthor = (authorId, checked) => {
    if (checked) {
      onSelectedAuthorsChange([...selectedAuthors, authorId]);
    } else {
      onSelectedAuthorsChange(selectedAuthors.filter(id => id !== authorId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-warning-100 text-warning-700', icon: 'Clock' },
      processing: { color: 'bg-blue-100 text-blue-700', icon: 'Loader' },
      paid: { color: 'bg-success-100 text-success-700', icon: 'CheckCircle' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon name={config.icon} size={12} className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const calculateTotalArticles = (author) => {
    return Object.values(author.newsArticles).reduce((sum, count) => sum + count, 0) +
           Object.values(author.blogPosts).reduce((sum, count) => sum + count, 0);
  };

  if (isMobileView) {
    return (
      <div className="bg-surface rounded-lg shadow-sm border border-border mb-6">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Payout Calculations</h3>
            {selectedAuthors.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">{selectedAuthors.length} selected</span>
                <button
                  onClick={() => onBulkStatusUpdate(selectedAuthors, 'paid')}
                  className="px-3 py-1 bg-success-500 text-white rounded-md text-xs font-medium hover:bg-success-600 transition-colors duration-150"
                >
                  Mark as Paid
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="divide-y divide-border">
          {sortedData.map((author) => (
            <div key={author.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedAuthors.includes(author.id)}
                    onChange={(e) => handleSelectAuthor(author.id, e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500"
                  />
                  <div>
                    <h4 className="font-medium text-text-primary">{author.authorName}</h4>
                    <p className="text-sm text-text-secondary">{author.email}</p>
                  </div>
                </div>
                {getStatusBadge(author.paymentStatus)}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-text-secondary mb-1">Total Articles</p>
                  <p className="font-medium text-text-primary">{calculateTotalArticles(author)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-1">Total Amount</p>
                  <p className="font-bold text-lg text-primary-600">${author.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="text-xs text-text-secondary">
                Last Payment: {new Date(author.lastPayment).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border mb-6">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Payout Calculations</h3>
          {selectedAuthors.length > 0 && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-secondary">{selectedAuthors.length} authors selected</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onBulkStatusUpdate(selectedAuthors, 'processing')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors duration-150"
                >
                  Mark as Processing
                </button>
                <button
                  onClick={() => onBulkStatusUpdate(selectedAuthors, 'paid')}
                  className="px-4 py-2 bg-success-500 text-white rounded-md text-sm font-medium hover:bg-success-600 transition-colors duration-150"
                >
                  Mark as Paid
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedAuthors.length === payoutData.length && payoutData.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-primary"
                onClick={() => handleSort('authorName')}
              >
                <div className="flex items-center space-x-1">
                  <span>Author</span>
                  <Icon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Articles Breakdown
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-primary"
                onClick={() => handleSort('totalAmount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Total Amount</span>
                  <Icon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-primary"
                onClick={() => handleSort('paymentStatus')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <Icon name="ArrowUpDown" size={12} />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-primary"
                onClick={() => handleSort('lastPayment')}
              >
                <div className="flex items-center space-x-1">
                  <span>Last Payment</span>
                  <Icon name="ArrowUpDown" size={12} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedData.map((author) => (
              <tr key={author.id} className="hover:bg-secondary-50 transition-colors duration-150">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedAuthors.includes(author.id)}
                    onChange={(e) => handleSelectAuthor(author.id, e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-text-primary">{author.authorName}</div>
                    <div className="text-sm text-text-secondary">{author.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="font-medium">News:</span> 
                      <span className="ml-1 text-text-secondary">
                        B:{author.newsArticles.basic} P:{author.newsArticles.premium} F:{author.newsArticles.featured}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Blogs:</span>
                      <span className="ml-1 text-text-secondary">
                        B:{author.blogPosts.basic} P:{author.blogPosts.premium} F:{author.blogPosts.featured}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-lg text-primary-600">
                    ${author.totalAmount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(author.paymentStatus)}
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">
                  {new Date(author.lastPayment).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutCalculationTable;