import React, { useState } from "react";
import Icon from "components/AppIcon";
import Image from "components/AppImage";

const ArticleCard = ({ article, isSelected, onSelect, onAction, onClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-success-100 text-success-600";
      case "draft":
        return "bg-secondary-100 text-secondary-600";
      case "review":
        return "bg-warning-100 text-warning-600";
      default:
        return "bg-secondary-100 text-secondary-600";
    }
  };
  const handleCardClick = (e) => {
    // Prevent navigation when clicking on action buttons or checkboxes
    if (
      e.target.closest("button") ||
      e.target.closest('input[type="checkbox"]')
    ) {
      return;
    }
    onClick?.(article);
  };

  const getTypeIcon = (type) => {
    return type === "news" ? "Newspaper" : "FileText";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <div
      className={`bg-surface rounded-lg border transition-all duration-200 hover:shadow-md ${
        isSelected ? "border-primary ring-2 ring-primary-100" : "border-border"
      }`}
      onClick={handleCardClick}
    >
      {/* Card Header with Selection and Menu */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelect(article.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-150 ${
                isSelected
                  ? "bg-primary border-primary"
                  : "border-border hover:border-primary"
              }`}
            >
              {isSelected && <Icon name="Check" size={12} color="white" />}
            </button>
            <div className="flex items-center gap-2">
              <Icon
                name={getTypeIcon(article.type)}
                size={16}
                className="text-secondary-500"
              />
              <span className="text-xs font-medium text-secondary-600 uppercase tracking-wide">
                {article.type}
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 hover:bg-secondary-100 rounded transition-colors duration-150"
            >
              <Icon
                name="MoreVertical"
                size={16}
                className="text-secondary-500"
              />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-8 w-40 bg-surface rounded-md shadow-lg border border-border z-20">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onAction("preview", article.id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-secondary-100 transition-colors duration-150"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => {
                        onAction("edit", article.id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-secondary-100 transition-colors duration-150"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onAction("duplicate", article.id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-secondary-100 transition-colors duration-150"
                    >
                      Duplicate
                    </button>
                    <hr className="my-1 border-border" />
                    <button
                      onClick={() => {
                        onAction("delete", article.id);
                        setIsMenuOpen(false);
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
        </div>
      </div>

      {/* Article Thumbnail */}
      <div className="px-4 mb-4">
        <div
          className="relative overflow-hidden rounded-lg bg-secondary-100"
          style={{ height: "200px" }}
        >
          <Image
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                article.status
              )}`}
            >
              {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="px-4 pb-4">
        <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2 leading-tight">
          {article.title}
        </h3>

        <p className="text-sm text-text-secondary mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Article Metadata */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="User" size={14} />
            <span>{article.author}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={14} />
              <span>{formatDate(article.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={14} />
              <span>{article.readTime}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-text-secondary">
              <Icon name="Eye" size={14} />
              <span>{formatViews(article.views)} views</span>
            </div>
            <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs font-medium">
              {article.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
