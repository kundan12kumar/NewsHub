import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from 'components/AppIcon';

const TrendChart = ({ title, subtitle, data, type = 'line' }) => {
  const formatTooltipValue = (value, name) => {
    if (type === 'line') {
      return [`${value} articles`, 'Articles'];
    }
    return [`${value} articles`, name];
  };

  const formatXAxisLabel = (value) => {
    if (type === 'line') {
      const date = new Date(value);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return value.length > 10 ? `${value.substring(0, 10)}...` : value;
  };

  const renderChart = () => {
    if (type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickFormatter={formatXAxisLabel}
            />
            <YAxis stroke="var(--color-text-secondary)" fontSize={12} />
            <Tooltip 
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            <Bar 
              dataKey="articles" 
              fill="var(--color-primary)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="date" 
            stroke="var(--color-text-secondary)"
            fontSize={12}
            tickFormatter={formatXAxisLabel}
          />
          <YAxis stroke="var(--color-text-secondary)" fontSize={12} />
          <Tooltip 
            formatter={formatTooltipValue}
            contentStyle={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-md)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="articles" 
            stroke="var(--color-primary)" 
            strokeWidth={3}
            dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary">{subtitle}</p>
        </div>
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Icon name={type === 'line' ? 'TrendingUp' : 'BarChart3'} size={20} color="var(--color-primary)" />
        </div>
      </div>
      
      <div className="mt-4">
        {renderChart()}
      </div>
    </div>
  );
};

export default TrendChart;