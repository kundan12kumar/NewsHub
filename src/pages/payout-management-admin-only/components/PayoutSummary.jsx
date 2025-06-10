import React from 'react';
import Icon from 'components/AppIcon';

const PayoutSummary = ({ totalPending, totalPaid, totalAuthors, pendingAuthors }) => {
  const summaryCards = [
    {
      title: "Total Pending",
      value: `$${totalPending.toLocaleString()}`,
      icon: "Clock",
      color: "text-warning-600",
      bgColor: "bg-warning-100",
      description: `${pendingAuthors} authors awaiting payment`
    },
    {
      title: "Total Paid",
      value: `$${totalPaid.toLocaleString()}`,
      icon: "CheckCircle",
      color: "text-success-600",
      bgColor: "bg-success-100",
      description: "This month"
    },
    {
      title: "Active Authors",
      value: totalAuthors.toString(),
      icon: "Users",
      color: "text-primary-600",
      bgColor: "bg-primary-100",
      description: "Content creators"
    },
    {
      title: "Processing Rate",
      value: `${totalAuthors > 0 ? Math.round(((totalAuthors - pendingAuthors) / totalAuthors) * 100) : 0}%`,
      icon: "TrendingUp",
      color: "text-secondary-600",
      bgColor: "bg-secondary-100",
      description: "Payment completion"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryCards.map((card, index) => (
        <div key={index} className="bg-surface rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={card.icon} size={24} className={card.color} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-text-primary mb-1">{card.value}</h3>
            <p className="text-sm font-medium text-text-primary mb-1">{card.title}</p>
            <p className="text-xs text-text-secondary">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PayoutSummary;