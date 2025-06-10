import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const PayoutRateConfig = ({ payoutRates, onRateUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempRates, setTempRates] = useState(payoutRates);
  const [hasChanges, setHasChanges] = useState(false);

  const handleRateChange = (contentType, tier, value) => {
    const newRates = {
      ...tempRates,
      [contentType]: {
        ...tempRates[contentType],
        [tier]: parseFloat(value) || 0
      }
    };
    setTempRates(newRates);
    setHasChanges(JSON.stringify(newRates) !== JSON.stringify(payoutRates));
  };

  const handleSave = () => {
    onRateUpdate(tempRates);
    setHasChanges(false);
  };

  const handleReset = () => {
    setTempRates(payoutRates);
    setHasChanges(false);
  };

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border mb-6">
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={20} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Payout Rate Configuration</h3>
              <p className="text-sm text-text-secondary">Configure payment rates for different content types and tiers</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {hasChanges && (
              <span className="px-2 py-1 bg-warning-100 text-warning-700 text-xs font-medium rounded-full">
                Unsaved Changes
              </span>
            )}
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={20} 
              className="text-text-secondary" 
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* News Articles Rates */}
            <div>
              <h4 className="text-md font-semibold text-text-primary mb-4 flex items-center">
                <Icon name="Newspaper" size={18} className="mr-2 text-primary-600" />
                News Articles
              </h4>
              <div className="space-y-4">
                {Object.entries(tempRates.newsArticle).map(([tier, rate]) => (
                  <div key={tier} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-text-primary capitalize">
                      {tier} Tier
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-text-secondary">$</span>
                      <input
                        type="number"
                        value={rate}
                        onChange={(e) => handleRateChange('newsArticle', tier, e.target.value)}
                        className="w-20 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-right"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blog Posts Rates */}
            <div>
              <h4 className="text-md font-semibold text-text-primary mb-4 flex items-center">
                <Icon name="FileText" size={18} className="mr-2 text-primary-600" />
                Blog Posts
              </h4>
              <div className="space-y-4">
                {Object.entries(tempRates.blogPost).map(([tier, rate]) => (
                  <div key={tier} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-text-primary capitalize">
                      {tier} Tier
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-text-secondary">$</span>
                      <input
                        type="number"
                        value={rate}
                        onChange={(e) => handleRateChange('blogPost', tier, e.target.value)}
                        className="w-20 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-right"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <Icon name="Save" size={16} />
              <span>Changes are saved to LocalStorage automatically</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleReset}
                disabled={!hasChanges}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 text-sm font-medium"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutRateConfig;