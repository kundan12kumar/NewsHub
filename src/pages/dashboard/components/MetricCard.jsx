import React from 'react';
import Icon from 'components/AppIcon';

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDirection = 'neutral', 
  subtitle 
}) => {
  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up':
        return 'TrendingUp';
      case 'down':
        return 'TrendingDown';
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <Icon name={icon} size={24} color="var(--color-primary)" />
        </div>
        {getTrendIcon() && (
          <Icon 
            name={getTrendIcon()} 
            size={20} 
            className={getTrendColor()} 
          />
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-text-primary mb-1">{value}</h3>
        <p className="text-sm text-text-secondary mb-2">{title}</p>
        
        <div className="flex items-center justify-between">
          {trend && (
            <span className={`text-xs font-medium ${getTrendColor()}`}>
              {trend}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-text-secondary">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;