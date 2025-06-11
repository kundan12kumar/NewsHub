import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const ArticleTable = ({ 
  articles, 
  selectedArticles, 
  onSelectArticle, 
  onSelectAll, 
  onAction,
  sortBy,
  sortOrder,
  onSort,
  onRowClick
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-success-100 text-success-600';
      case 'draft':
        return 'bg-secondary-100 text-secondary-600';
      case 'review':
        return 'bg-warning-100 text-warning-600';
      default:
        return 'bg-secondary-100 text-secondary-600';
    }
  };

  const handleRowClick = (article, e) => {
    // Prevent navigation when clicking on action buttons or checkboxes
    if (e.target.closest('button') || e.target.closest('input[type="checkbox"]')) {
      return;
    }
    onRowClick?.(article);
  };

  const getTypeIcon = (type) => {
    return type === 'news' ? 'Newspaper' : 'FileText';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'ArrowUpDown';
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const isAllSelected = articles.length > 0 && selectedArticles.length === articles.length;
  const isIndeterminate = selectedArticles.length > 0 && selectedArticles.length < articles.length;

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <button
                  onClick={onSelectAll}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-150 ${
                    isAllSelected 
                      ? 'bg-primary border-primary' 
                      : isIndeterminate
                      ? 'bg-primary border-primary' :'border-border hover:border-primary'
                  }`}
                >
                  {isAllSelected && <Icon name="Check" size={12} color="white" />}
                  {isIndeterminate && <Icon name="Minus" size={12} color="white" />}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('title')}
                  className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-primary transition-colors duration-150"
                >
                  Article
                  <Icon name={getSortIcon('title')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('author')}
                  className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-primary transition-colors duration-150"
                >
                  Author
                  <Icon name={getSortIcon('author')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('date')}
                  className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-primary transition-colors duration-150"
                >
                  Date
                  <Icon name={getSortIcon('date')} size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-medium text-text-primary">Type</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-medium text-text-primary">Status</span>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('views')}
                  className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-primary transition-colors duration-150"
                >
                  Views
                  <Icon name={getSortIcon('views')} size={14} />
                </button>
              </th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {articles.map((article) => (
              <tr 
                key={article.id}
                className={`hover:bg-secondary-50 transition-colors duration-150 ${
                  selectedArticles.includes(article.id) ? 'bg-primary-50' : ''
                }`}
                onClick={(e) => handleRowClick(article, e)}
              >
                <td className="px-4 py-4">
                  <button
                    onClick={() => onSelectArticle(article.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-150 ${
                      selectedArticles.includes(article.id)
                        ? 'bg-primary border-primary' :'border-border hover:border-primary'
                    }`}
                  >
                    {selectedArticles.includes(article.id) && <Icon name="Check" size={12} color="white" />}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary-100 flex-shrink-0">
                      <Image
                        src={article.thumbnail}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-text-primary line-clamp-2 mb-1">
                        {article.title}
                      </h4>
                      <p className="text-xs text-text-secondary line-clamp-1">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-text-primary">{article.author}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-text-secondary">{formatDate(article.date)}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Icon name={getTypeIcon(article.type)} size={14} className="text-secondary-500" />
                    <span className="text-sm text-text-secondary capitalize">{article.type}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                    {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-text-secondary">{formatViews(article.views)}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === article.id ? null : article.id)}
                      className="p-1 hover:bg-secondary-100 rounded transition-colors duration-150"
                    >
                      <Icon name="MoreVertical" size={16} className="text-secondary-500" />
                    </button>
                    
                    {openMenuId === article.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 top-8 w-40 bg-surface rounded-md shadow-lg border border-border z-20">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                onAction('preview', article.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-secondary-100 transition-colors duration-150"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => {
                                onAction('edit', article.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-secondary-100 transition-colors duration-150"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                onAction('duplicate', article.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-secondary-100 transition-colors duration-150"
                            >
                              Duplicate
                            </button>
                            <hr className="my-1 border-border" />
                            <button
                              onClick={() => {
                                onAction('delete', article.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error-100 transition-colors duration-150"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArticleTable;