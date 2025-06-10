import React from 'react';
import Icon from 'components/AppIcon';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'article_published',
      user: 'Sarah Johnson',
      action: 'published a new article',
      target: 'AI Breakthrough in Healthcare',
      timestamp: '2 hours ago',
      icon: 'FileText',
      iconColor: 'text-success'
    },
    {
      id: 2,
      type: 'article_reviewed',
      user: 'Admin',
      action: 'approved article',
      target: 'Climate Change Research',
      timestamp: '4 hours ago',
      icon: 'CheckCircle',
      iconColor: 'text-primary'
    },
    {
      id: 3,
      type: 'user_joined',
      user: 'Michael Chen',
      action: 'joined as contributor',
      target: '',
      timestamp: '6 hours ago',
      icon: 'UserPlus',
      iconColor: 'text-accent'
    },
    {
      id: 4,
      type: 'article_draft',
      user: 'Emily Rodriguez',
      action: 'saved draft',
      target: 'Remote Work Trends',
      timestamp: '8 hours ago',
      icon: 'Edit3',
      iconColor: 'text-secondary-500'
    },
    {
      id: 5,
      type: 'article_updated',
      user: 'James Wilson',
      action: 'updated article',
      target: 'Solar Energy Solutions',
      timestamp: '1 day ago',
      icon: 'RefreshCw',
      iconColor: 'text-warning'
    }
  ];

  const getActivityDescription = (activity) => {
    if (activity.target) {
      return (
        <span>
          <span className="font-medium">{activity.user}</span> {activity.action}{' '}
          <span className="font-medium text-text-primary">"{activity.target}"</span>
        </span>
      );
    }
    return (
      <span>
        <span className="font-medium">{activity.user}</span> {activity.action}
      </span>
    );
  };

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
        <Icon name="Activity" size={20} />
        <span>Recent Activity</span>
      </h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center flex-shrink-0 ${activity.iconColor}`}>
              <Icon name={activity.icon} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-secondary">
                {getActivityDescription(activity)}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-primary hover:text-primary-700 text-sm font-medium py-2 transition-colors duration-150">
        View All Activity
      </button>
    </div>
  );
};

export default RecentActivity;