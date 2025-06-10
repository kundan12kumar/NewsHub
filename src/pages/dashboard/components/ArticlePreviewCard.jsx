import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const ArticlePreviewCard = ({ article, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'news':
        return 'bg-primary-100 text-primary-700';
      case 'blog':
        return 'bg-accent-100 text-accent-700';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  };

  return (
    <div 
      className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(article.type)}`}>
            {article.type.charAt(0).toUpperCase() + article.type.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-150">
          {article.title}
        </h3>
        
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
              <Icon name="User" size={12} color="white" />
            </div>
            <span className="text-text-secondary font-medium">{article.author}</span>
          </div>
          
          <div className="flex items-center space-x-1 text-text-secondary">
            <Icon name="Calendar" size={14} />
            <span>{formatDate(article.publishedDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePreviewCard;