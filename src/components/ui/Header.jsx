// /home/ubuntu/app/news_dashboard/src/components/ui/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "../AppIcon";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const navigationItems = [
    { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { label: "Articles", path: "/articles-management", icon: "FileText" },
    { label: "Analytics", path: "/analytics-dashboard", icon: "BarChart3" },
    {
      label: "Payouts",
      path: "/payout-management-admin-only",
      icon: "DollarSign",
      adminOnly: true,
    },
  ];

  // Load user information on component mount
  useEffect(() => {
    try {
      const userInfo = localStorage.getItem("newsHubUser");
      if (userInfo) {
        const user = JSON.parse(userInfo);
        setIsAdmin(user?.role === "admin");
        setUserName(user?.email || "User");
      } else {
        // Redirect to login if no user info is found
        navigate("/");
      }
    } catch (error) {
      console.error("Error loading user info:", error);
      navigate("/");
    }
  }, [navigate]);

  const visibleNavItems = navigationItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(
        `/articles-management?search=${encodeURIComponent(searchQuery)}`
      );
      setIsSearchExpanded(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("newsHubUser");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // If we can't remove from localStorage, still try to navigate to login
      navigate("/");
    }
    setIsUserMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-1000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation("/dashboard")}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-150"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Newspaper" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-text-primary hidden sm:block">
                NewsHub
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {visibleNavItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  isActiveRoute(item.path)
                    ? "bg-primary-100 text-primary-700 border-b-2 border-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-secondary-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Search and User Controls */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div ref={searchRef} className="relative">
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <div
                  className={`relative transition-all duration-200 ${
                    isSearchExpanded ? "w-64" : "w-10"
                  } md:w-64`}
                >
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-150 ${
                      isSearchExpanded
                        ? "opacity-100"
                        : "opacity-0 md:opacity-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-150"
                  >
                    <Icon name="Search" size={16} />
                  </button>
                </div>
              </form>
            </div>

            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary-100 transition-colors duration-150"
              >
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-text-primary">
                  {isAdmin ? "Admin User" : "Content Manager"}
                </span>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className="text-text-secondary"
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg border border-border z-1010 animate-fade-in">
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs text-text-secondary border-b border-border">
                      {userName}
                      <div className="font-medium mt-1">
                        {isAdmin ? "Administrator" : "Content Manager"}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-100 transition-colors duration-150"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-secondary-100 transition-colors duration-150"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-1015 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-surface border-b border-border z-1020 md:hidden animate-slide-in">
            <nav className="px-4 py-4 space-y-2">
              {visibleNavItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors duration-150 ${
                    isActiveRoute(item.path)
                      ? "bg-primary-100 text-primary-700"
                      : "text-text-primary hover:bg-secondary-100"
                  }`}
                >
                  <Icon name={item.icon} size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
