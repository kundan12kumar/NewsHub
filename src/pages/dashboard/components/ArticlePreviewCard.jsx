// src/components/ArticlePreviewCard.js
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ArticlePreviewCard = ({ article, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Generate a safe fallback image
  const generateFallbackImage = (text = 'No Image') => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="250" fill="#F3F4F6"/>
        <rect x="160" y="85" width="80" height="80" stroke="#9CA3AF" stroke-width="2" fill="none" rx="4"/>
        <circle cx="185" cy="110" r="8" fill="#9CA3AF"/>
        <path d="M220 140 L180 125 L165 140 Z" fill="#9CA3AF"/>
        <text x="200" y="190" font-family="Arial" font-size="12" fill="#9CA3AF" text-anchor="middle">${text}</text>
      </svg>
    `)}`;
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200 group"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-400">
              <Icon name="Image" size={32} className="mx-auto mb-2" />
              <span className="text-xs">No Image Available</span>
            </div>
          </div>
        ) : (
          <img
            src={article.thumbnail || generateFallbackImage()}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        )}
        
        {/* Article Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium capitalize">
            {article.type || 'Article'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-150">
          {article.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {truncateText(article.excerpt)}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Icon name="User" size={12} className="mr-1" />
              {article.author}
            </span>
            <span className="flex items-center">
              <Icon name="Calendar" size={12} className="mr-1" />
              {formatDate(article.publishedDate)}
            </span>
          </div>
          
          <Icon 
            name="ArrowRight" 
            size={14} 
            className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150" 
          />
        </div>
      </div>
    </div>
  );
};

export default ArticlePreviewCard;