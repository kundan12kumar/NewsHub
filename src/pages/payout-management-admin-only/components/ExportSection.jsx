import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ExportSection = ({ payoutData, payoutRates }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState('pdf');
  const [selectedFields, setSelectedFields] = useState([
    'authorName', 'email', 'totalAmount', 'paymentStatus', 'lastPayment'
  ]);

  const availableFields = [
    { key: 'authorName', label: 'Author Name' },
    { key: 'email', label: 'Email' },
    { key: 'newsArticles', label: 'News Articles Count' },
    { key: 'blogPosts', label: 'Blog Posts Count' },
    { key: 'totalAmount', label: 'Total Amount' },
    { key: 'paymentStatus', label: 'Payment Status' },
    { key: 'lastPayment', label: 'Last Payment Date' },
    { key: 'joinDate', label: 'Join Date' }
  ];

  const handleFieldToggle = (fieldKey) => {
    if (selectedFields.includes(fieldKey)) {
      setSelectedFields(selectedFields.filter(f => f !== fieldKey));
    } else {
      setSelectedFields([...selectedFields, fieldKey]);
    }
  };

  const generateCSV = () => {
    const headers = availableFields
      .filter(field => selectedFields.includes(field.key))
      .map(field => field.label);

    const rows = payoutData.map(author => {
      return selectedFields.map(fieldKey => {
        switch (fieldKey) {
          case 'newsArticles':
            return `B:${author.newsArticles.basic} P:${author.newsArticles.premium} F:${author.newsArticles.featured}`;
          case 'blogPosts':
            return `B:${author.blogPosts.basic} P:${author.blogPosts.premium} F:${author.blogPosts.featured}`;
          case 'totalAmount':
            return `$${author.totalAmount}`;
          case 'lastPayment': case'joinDate':
            return new Date(author[fieldKey]).toLocaleDateString();
          default:
            return author[fieldKey] || '';
        }
      });
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `payout-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDF = () => {
    // Mock PDF generation - in real app, use libraries like jsPDF or react-pdf
    const pdfContent = `
      PAYOUT REPORT
      Generated: ${new Date().toLocaleDateString()}
      
      SUMMARY:
      Total Authors: ${payoutData.length}
      Total Pending: $${payoutData.filter(a => a.paymentStatus === 'pending').reduce((sum, a) => sum + a.totalAmount, 0).toLocaleString()}
      Total Paid: $${payoutData.filter(a => a.paymentStatus === 'paid').reduce((sum, a) => sum + a.totalAmount, 0).toLocaleString()}
      
      PAYOUT RATES:
      News Articles - Basic: $${payoutRates.newsArticle.basic}, Premium: $${payoutRates.newsArticle.premium}, Featured: $${payoutRates.newsArticle.featured}
      Blog Posts - Basic: $${payoutRates.blogPost.basic}, Premium: $${payoutRates.blogPost.premium}, Featured: $${payoutRates.blogPost.featured}
      
      AUTHOR DETAILS:
      ${payoutData.map(author => `
      ${author.authorName} (${author.email})
      News Articles: B:${author.newsArticles.basic} P:${author.newsArticles.premium} F:${author.newsArticles.featured}
      Blog Posts: B:${author.blogPosts.basic} P:${author.blogPosts.premium} F:${author.blogPosts.featured}
      Total Amount: $${author.totalAmount}
      Status: ${author.paymentStatus}
      Last Payment: ${new Date(author.lastPayment).toLocaleDateString()}
      `).join('\n')}
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `payout-report-${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (exportType === 'csv') {
      generateCSV();
    } else {
      generatePDF();
    }
    
    setIsExporting(false);
  };

  const generateInvoices = async () => {
    setIsExporting(true);
    
    // Mock invoice generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const pendingAuthors = payoutData.filter(author => author.paymentStatus === 'pending');
    const invoiceContent = pendingAuthors.map(author => `
      INVOICE - ${author.authorName}
      Email: ${author.email}
      Amount Due: $${author.totalAmount}
      Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
      
      Breakdown:
      News Articles: ${Object.values(author.newsArticles).reduce((sum, count) => sum + count, 0)} articles
      Blog Posts: ${Object.values(author.blogPosts).reduce((sum, count) => sum + count, 0)} posts
      
      Payment Instructions:
      Please process payment within 30 days of invoice date.
    `).join('\n\n---\n\n');

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `invoices-${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExporting(false);
  };

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
            <Icon name="Download" size={20} className="text-accent-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Export & Reports</h3>
            <p className="text-sm text-text-secondary">Generate reports and export payout data</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Export Configuration */}
          <div>
            <h4 className="text-md font-semibold text-text-primary mb-4">Export Configuration</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Export Format</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="pdf"
                      checked={exportType === 'pdf'}
                      onChange={(e) => setExportType(e.target.value)}
                      className="w-4 h-4 text-primary-600 border-border focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-text-primary">PDF Report</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="csv"
                      checked={exportType === 'csv'}
                      onChange={(e) => setExportType(e.target.value)}
                      className="w-4 h-4 text-primary-600 border-border focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-text-primary">CSV Data</span>
                  </label>
                </div>
              </div>

              {exportType === 'csv' && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Select Fields</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableFields.map(field => (
                      <label key={field.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFields.includes(field.key)}
                          onChange={() => handleFieldToggle(field.key)}
                          className="w-4 h-4 text-primary-600 border-border rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-text-primary">{field.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-md font-semibold text-text-primary mb-4">Quick Actions</h4>
            
            <div className="space-y-3">
              <button
                onClick={handleExport}
                disabled={isExporting || (exportType === 'csv' && selectedFields.length === 0)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
              >
                {isExporting ? (
                  <>
                    <Icon name="Loader" size={16} className="animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Download" size={16} />
                    <span>Export {exportType.toUpperCase()}</span>
                  </>
                )}
              </button>

              <button
                onClick={generateInvoices}
                disabled={isExporting}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-accent text-white rounded-md hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-colors duration-200"
              >
                {isExporting ? (
                  <>
                    <Icon name="Loader" size={16} className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Icon name="FileText" size={16} />
                    <span>Generate Invoices</span>
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-border">
                <div className="text-xs text-text-secondary space-y-1">
                  <p>• PDF reports include summary and detailed breakdown</p>
                  <p>• CSV exports contain raw data for analysis</p>
                  <p>• Invoices generated for pending payments only</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportSection;