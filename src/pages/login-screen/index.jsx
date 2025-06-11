import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "components/AppIcon";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  // Mock credentials for different user types
  const mockCredentials = {
    admin: { email: "admin@newshub.com", password: "admin123" },
    manager: { email: "manager@newshub.com", password: "manager123" },
  };

  // Google OAuth configuration - REPLACE WITH YOUR ACTUAL CLIENT ID
  const GOOGLE_CLIENT_ID = "137303626540-bioipt09v1q2fasciecc8bom5qcipc7r.apps.googleusercontent.com";

  // Initialize Google OAuth
  useEffect(() => {
    const initGoogleAuth = () => {
      if (window.google && GOOGLE_CLIENT_ID !== "YOUR_ACTUAL_GOOGLE_CLIENT_ID") {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false, // This helps with some CORS issues
          });
          setIsGoogleReady(true);
        } catch (error) {
          console.error("Google OAuth initialization error:", error);
          setErrors({
            general: "Google authentication service is not available."
          });
        }
      }
    };

    // Only load Google script if we have a valid client ID
    if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== "YOUR_ACTUAL_GOOGLE_CLIENT_ID") {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.onload = initGoogleAuth;
        script.onerror = () => {
          console.error("Failed to load Google Identity Services");
          setErrors({
            general: "Failed to load Google authentication service."
          });
        };
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      } else {
        initGoogleAuth();
      }
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const userInfo = localStorage.getItem("newsHubUser");
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        if (parsedUserInfo?.isAuthenticated) {
          navigate("/dashboard");
        }
      } catch (error) {
        // Invalid user info in localStorage, clear it
        localStorage.removeItem("newsHubUser");
      }
    }
  }, [navigate]);

  const handleGoogleCallback = async (response) => {
    setIsGoogleLoading(true);
    setErrors({});

    try {
      // Decode the JWT token
      const decoded = parseJwt(response.credential);

      if (decoded) {
        // Create user info from Google data
        const userInfo = {
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
          role: "user", // Default role for Google users
          isAuthenticated: true,
          loginTime: new Date().toISOString(),
          authMethod: "google",
        };

        // Store user info in localStorage
        try {
          localStorage.setItem("newsHubUser", JSON.stringify(userInfo));

          // Verify the data was stored correctly
          const storedData = localStorage.getItem("newsHubUser");
          if (!storedData) {
            throw new Error("Failed to store authentication data");
          }

          // Navigate to dashboard
          navigate("/dashboard");
        } catch (storageError) {
          console.error("localStorage error:", storageError);
          setErrors({
            general:
              "Unable to save login information. Please check your browser settings.",
          });
        }
      } else {
        setErrors({
          general: "Failed to authenticate with Google. Please try again.",
        });
      }
    } catch (error) {
      console.error("Google login error:", error);
      setErrors({
        general: "Google authentication failed. Please try again.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Check if Google Client ID is configured
    if (GOOGLE_CLIENT_ID === "YOUR_ACTUAL_GOOGLE_CLIENT_ID") {
      setErrors({
        general: "Google authentication is not configured. Please contact administrator.",
      });
      return;
    }

    if (window.google && isGoogleReady) {
      setErrors({});
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log("Google One Tap not displayed:", notification.getNotDisplayedReason());
            // Fallback to renderButton method
            renderGoogleButton();
          }
        });
      } catch (error) {
        console.error("Google prompt error:", error);
        renderGoogleButton();
      }
    } else {
      setErrors({
        general:
          "Google authentication is not available. Please try again later.",
      });
    }
  };

  const renderGoogleButton = () => {
    const buttonDiv = document.getElementById('google-signin-button');
    if (buttonDiv && window.google) {
      // Clear any existing button
      buttonDiv.innerHTML = '';
      
      window.google.accounts.id.renderButton(buttonDiv, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'continue_with',
        shape: 'rectangular',
      });
    }
  };

  // Helper function to parse JWT token
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error parsing JWT:", error);
      return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check credentials
      const isValidAdmin =
        formData.email === mockCredentials.admin.email &&
        formData.password === mockCredentials.admin.password;
      const isValidManager =
        formData.email === mockCredentials.manager.email &&
        formData.password === mockCredentials.manager.password;

      if (isValidAdmin || isValidManager) {
        // Store user info in localStorage
        const userInfo = {
          email: formData.email,
          role: isValidAdmin ? "admin" : "manager",
          isAuthenticated: true,
          loginTime: new Date().toISOString(),
          authMethod: "email",
        };

        try {
          localStorage.setItem("newsHubUser", JSON.stringify(userInfo));
          // Verify the data was stored correctly
          const storedData = localStorage.getItem("newsHubUser");
          if (!storedData) {
            throw new Error("Failed to store authentication data");
          }

          // Navigate to dashboard
          navigate("/dashboard");
        } catch (storageError) {
          console.error("localStorage error:", storageError);
          setErrors({
            general:
              "Unable to save login information. Please check your browser settings.",
          });
        }
      } else {
        setErrors({
          general: "Invalid email or password. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        general: "Login failed. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Mock forgot password functionality
    alert("Password reset link would be sent to your email address.");
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
                <Icon
                  name="AlertCircle"
                  size={20}
                  color="var(--color-error-600)"
                  className="mr-2"
                />
                <span className="text-error-600 text-sm font-medium">
                  {errors.general}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary mb-2"
              >
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
                    errors.email ? "border-error bg-error-100" : "border-border"
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150 ${
                    errors.password
                      ? "border-error bg-error-100"
                      : "border-border"
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
                  <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Icon
                    name="Loader2"
                    size={20}
                    className="animate-spin mr-2"
                  />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Google Sign In Section */}
          {GOOGLE_CLIENT_ID !== "YOUR_ACTUAL_GOOGLE_CLIENT_ID" && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface text-text-secondary">
                    Or continue with Google
                  </span>
                </div>
              </div>

              {/* Google Button Container */}
              <div className="mb-6">
                <div id="google-signin-button" className="w-full"></div>
                {/* Fallback custom button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading || !isGoogleReady}
                  className="w-full bg-white border border-border text-text-primary py-3 px-4 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
                >
                  {isGoogleLoading ? (
                    <>
                      <Icon
                        name="Loader2"
                        size={20}
                        className="animate-spin mr-2"
                      />
                      Signing in with Google...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Mock Credentials Info */}
          <div className="mt-6 p-4 bg-secondary-100 rounded-md">
            <h3 className="text-sm font-medium text-text-primary mb-2">
              Demo Credentials:
            </h3>
            <div className="text-xs text-text-secondary space-y-1">
              <p>
                <strong>Admin:</strong> admin@newshub.com / admin123
              </p>
              <p>
                <strong>Manager:</strong> manager@newshub.com / manager123
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {(isLoading || isGoogleLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 flex items-center space-x-3">
            <Icon
              name="Loader2"
              size={24}
              className="animate-spin text-primary"
            />
            <span className="text-text-primary font-medium">
              {isGoogleLoading
                ? "Authenticating with Google..."
                : "Authenticating..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;