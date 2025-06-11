import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from 'components/ui/Header';
import Icon from 'components/AppIcon';
import { useNewsData } from 'hooks/useNewsData';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get article from location state if passed from previous page
  const [article, setArticle] = useState(location.state?.article || null);
  const [isLoading, setIsLoading] = useState(!article);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState([]);

  // If no article is passed via state, fetch from API
  const newsParams = React.useMemo(() => ({
    q: 'technology',
    pageSize: 100,
    sortBy: 'publishedAt'
  }), []);

  const { 
    data: newsData, 
    isLoading: isNewsLoading, 
    error: newsError 
  } = useNewsData('everything', newsParams);

  // Find article by ID if not passed via state
  useEffect(() => {
    if (!article && newsData && newsData.length > 0) {
      const foundArticle = newsData.find((item, index) => (index + 1).toString() === id);
      
      if (foundArticle) {
        const transformedArticle = {
          id: parseInt(id),
          title: foundArticle.title || 'Untitled Article',
          author: foundArticle.author || 'Unknown Author',
          date: foundArticle.publishedAt ? foundArticle.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
          publishedAt: foundArticle.publishedAt,
          type: 'news',
          status: 'published',
          thumbnail: foundArticle.urlToImage || null,
          excerpt: foundArticle.description || 'No description available',
          content: foundArticle.content || foundArticle.description || 'Full content not available',
          url: foundArticle.url,
          source: foundArticle.source?.name || 'Unknown Source',
          category: 'Technology',
          readTime: `${Math.max(1, Math.floor((foundArticle.content?.length || 500) / 500))} min read`,
          views: Math.floor(Math.random() * 20000)
        };
        setArticle(transformedArticle);
      } else {
        setError(new Error('Article not found'));
      }
      setIsLoading(false);
    }
  }, [id, article, newsData]);

  // Get related articles (exclude current article)
  useEffect(() => {
    if (newsData && article) {
      const related = newsData
        .filter((item, index) => (index + 1) !== article.id)
        .slice(0, 3)
        .map((item, index) => ({
          id: index + 1,
          title: item.title || 'Untitled Article',
          author: item.author || 'Unknown Author',
          date: item.publishedAt ? item.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
          thumbnail: item.urlToImage,
          readTime: `${Math.max(1, Math.floor((item.content?.length || 500) / 500))} min read`
        }));
      setRelatedArticles(related);
    }
  }, [newsData, article]);

  // Handle back navigation
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  // Handle bookmark toggle
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically save to localStorage or API
  };

  // Handle external link
  const handleReadOriginal = () => {
    if (article?.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate placeholder image
  const generatePlaceholderUrl = (width = 800, height = 400, text = 'Article Image') => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#F3F4F6"/>
        <rect x="${width/2 - 60}" y="${height/2 - 60}" width="120" height="120" stroke="#9CA3AF" stroke-width="2" fill="none" rx="8"/>
        <circle cx="${width/2 - 20}" cy="${height/2 - 20}" r="12" fill="#9CA3AF"/>
        <path d="M${width/2 + 30} ${height/2 + 30} L${width/2 - 30} ${height/2 - 15} L${width/2 - 50} ${height/2 + 30} Z" fill="#9CA3AF"/>
        <text x="${width/2}" y="${height/2 + 80}" font-family="Arial" font-size="16" fill="#9CA3AF" text-anchor="middle">${text}</text>
      </svg>
    `)}`;
  };

  // Loading state
  if (isLoading || isNewsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || newsError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon name="AlertTriangle" size={48} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">Article Not Found</h2>
            <p className="text-text-secondary mb-4">
              {error?.message || newsError?.message || "The article you're looking for doesn't exist."}
            </p>
            <button 
              onClick={handleBack}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No article found
  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon name="FileText" size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">Article Not Found</h2>
            <p className="text-text-secondary mb-4">The article you're looking for doesn't exist.</p>
            <button 
              onClick={handleBack}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Breadcrumb and Navigation */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <Icon name="ArrowLeft" size={16} />
                <span>Back</span>
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-md transition-colors ${
                    isBookmarked 
                      ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
                >
                  <Icon name={isBookmarked ? "Star" : "Star"} size={18} fill={isBookmarked ? "currentColor" : "none"} />
                </button>
                
                <button
                  onClick={handleShare}
                  className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-secondary-50 transition-colors"
                  title="Share article"
                >
                  <Icon name="Share2" size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
              <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                {article.category || 'News'}
              </span>
              <span>•</span>
              <span>{article.readTime}</span>
              <span>•</span>
              <span>{article.views?.toLocaleString()} views</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">{article.author}</p>
                  <p className="text-sm text-text-secondary">
                    Published on {formatDate(article.publishedAt || article.date)}
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-text-secondary">
                Source: <span className="font-medium">{article.source}</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {article.thumbnail && (
            <div className="mb-8">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-sm"
                onError={(e) => {
                  e.target.src = generatePlaceholderUrl(800, 400, 'Article Image');
                }}
              />
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-lg max-w-none mb-8">
            <div className="text-text-primary leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
            
            {/* Note about content limitation */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-800 font-medium mb-1">
                    Limited Content Preview
                  </p>
                  <p className="text-sm text-amber-700">
                    This is a preview of the article content. For the full article, please visit the original source.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Read Original Button */}
          {article.url && (
            <div className="mb-8">
              <button
                onClick={handleReadOriginal}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                <Icon name="ExternalLink" size={18} />
                Read Full Article on {article.source}
              </button>
            </div>
          )}

          {/* Article Footer */}
          <footer className="border-t border-border pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-text-secondary">Share this article:</span>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  <Icon name="Share2" size={16} />
                  Share
                </button>
              </div>
              
              <div className="text-xs text-text-secondary">
                Article ID: {article.id}
              </div>
            </div>
          </footer>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-surface border-t border-border">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Related Articles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <article
                    key={relatedArticle.id}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/article/${relatedArticle.id}`)}
                  >
                    <div className="bg-white rounded-lg border border-border hover:shadow-md transition-shadow">
                      {relatedArticle.thumbnail && (
                        <img
                          src={relatedArticle.thumbnail}
                          alt={relatedArticle.title}
                          className="w-full h-32 object-cover rounded-t-lg"
                          onError={(e) => {
                            e.target.src = generatePlaceholderUrl(300, 150, 'Related');
                          }}
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {relatedArticle.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-text-secondary">
                          <span>{relatedArticle.author}</span>
                          <span>{relatedArticle.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ArticleDetail;