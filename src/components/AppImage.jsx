// src/components/SafeImage.js
import React, { useState, useRef } from 'react';

const SafeImage = ({ 
  src, 
  alt, 
  fallbackSrc = null, 
  className = '', 
  onError = null,
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const errorAttempts = useRef(0);
  const maxRetries = 1; // Only try fallback once

  // List of reliable placeholder services
  const defaultFallbacks = [
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE4NVYxMzVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE2NSAxMTVIMTk1VjE0NUgxNjVWMTE1WiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHRleHQgeD0iMjAwIiB5PSIxMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==',
    'https://via.placeholder.com/400x250/f3f4f6/9ca3af?text=No+Image',
    'https://placehold.co/400x250/f3f4f6/9ca3af?text=No+Image'
  ];

  const handleImageError = () => {
    if (errorAttempts.current < maxRetries) {
      errorAttempts.current += 1;
      
      // Try fallback image first
      if (fallbackSrc && imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc);
        return;
      }
      
      // Try default fallbacks
      const fallbackIndex = errorAttempts.current - 1;
      if (fallbackIndex < defaultFallbacks.length) {
        setImgSrc(defaultFallbacks[fallbackIndex]);
        return;
      }
    }
    
    // All attempts failed
    setHasError(true);
    setIsLoading(false);
    
    if (onError) {
      onError();
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // If we've exhausted all options, show a simple div
  if (hasError) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        {...props}
      >
        <div className="text-center text-gray-400">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            className="mx-auto mb-2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
          <span className="text-xs">No Image</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 bg-gray-100 flex items-center justify-center ${className}`}>
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default SafeImage;