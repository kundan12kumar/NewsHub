// /home/ubuntu/app/news_dashboard/src/Routes.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Page imports
import LoginScreen from "pages/login-screen";
import Dashboard from "pages/dashboard";
import ArticlesManagement from "pages/articles-management";
import AnalyticsDashboard from "pages/analytics-dashboard";
import PayoutManagementAdminOnly from "pages/payout-management-admin-only";
import NotFound from "pages/NotFound";

// Protected route component
const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  useEffect(() => {
    // Check authentication status
    try {
      const userInfo = localStorage.getItem('newsHubUser');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        setIsAuthenticated(!!user?.isAuthenticated);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Authentication check error:', error);
      setIsAuthenticated(false);
    }
  }, []);
  
  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>;
  }
  
  return isAuthenticated ? element : <Navigate to="/" replace />;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/login-screen" element={<LoginScreen />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/articles-management" element={<ProtectedRoute element={<ArticlesManagement />} />} />
          <Route path="/analytics-dashboard" element={<ProtectedRoute element={<AnalyticsDashboard />} />} />
          <Route path="/payout-management-admin-only" element={<ProtectedRoute element={<PayoutManagementAdminOnly />} />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;