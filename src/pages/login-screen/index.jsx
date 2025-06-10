// /home/ubuntu/app/news_dashboard/src/pages/login-screen/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mock credentials for different user types
  const mockCredentials = {
    admin: { email: 'admin@newshub.com', password: 'admin123' },
    manager: { email: 'manager@newshub.com', password: 'manager123' }
  };

  // Check if user is already logged in
  useEffect(() => {
    const userInfo = localStorage.getItem('newsHubUser');
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        if (parsedUserInfo?.isAuthenticated) {
          navigate('/dashboard');
        }
      } catch (error) {
        // Invalid user info in localStorage, clear it
        localStorage.removeItem('newsHubUser');
      }
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check credentials
      const isValidAdmin = formData.email === mockCredentials.admin.email && 
                          formData.password === mockCredentials.admin.password;
      const isValidManager = formData.email === mockCredentials.manager.email && 
                            formData.password === mockCredentials.manager.password;

      if (isValidAdmin || isValidManager) {
        // Store user info in localStorage
        const userInfo = {
          email: formData.email,
          role: isValidAdmin ? 'admin' : 'manager',
          isAuthenticated: true,
          loginTime: new Date().toISOString()
        };
        
        try {
          localStorage.setItem('newsHubUser', JSON.stringify(userInfo));
          // Verify the data was stored correctly
          const storedData = localStorage.getItem('newsHubUser');
          if (!storedData) {
            throw new Error('Failed to store authentication data');
          }
          
          // Navigate to dashboard
          navigate('/dashboard');
        } catch (storageError) {
          console.error('localStorage error:', storageError);
          setErrors({
            general: 'Unable to save login information. Please check your browser settings.'
          });
        }
      } else {
        setErrors({
          general: 'Invalid email or password. Please try again.'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: 'Login failed. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Mock forgot password functionality
    alert('Password reset link would be sent to your email address.');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
            <Icon name="Newspaper" size={32} color="white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">NewsHub</h1>
          <p className="text-text-secondary">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-surface rounded-lg shadow-md border border-border p-8">
          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-error-100 border border-error-600 rounded-md">
              <div className="flex items-center">
                <Icon name="AlertCircle" size={20} color="var(--color-error-600)" className="mr-2" />
                <span className="text-error-600 text-sm font-medium">{errors.general}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150 ${
                    errors.email ? 'border-error bg-error-100' : 'border-border'
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                <Icon 
                  name="Mail" 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150 ${
                    errors.password ? 'border-error bg-error-100' : 'border-border'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <Icon 
                  name="Lock" 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-150"
                  disabled={isLoading}
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error">{errors.password}</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary-500 focus:ring-2"
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-text-secondary">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:text-primary-700 transition-colors duration-150"
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Mock Credentials Info */}
          <div className="mt-6 p-4 bg-secondary-100 rounded-md">
            <h3 className="text-sm font-medium text-text-primary mb-2">Demo Credentials:</h3>
            <div className="text-xs text-text-secondary space-y-1">
              <p><strong>Admin:</strong> admin@newshub.com / admin123</p>
              <p><strong>Manager:</strong> manager@newshub.com / manager123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} NewsHub. All rights reserved.
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 flex items-center space-x-3">
            <Icon name="Loader2" size={24} className="animate-spin text-primary" />
            <span className="text-text-primary font-medium">Authenticating...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;