// /home/ubuntu/app/news_dashboard/src/services/authService.jsx
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

// Create authentication service for handling login/logout operations
const authService = {
  // Login user with email and password
  login: async (email, password) => {
    try {
      // When implementing with a real API, uncomment the below code:
      // const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      // return response.data;
      
      // For now, use mock credentials check
      const mockCredentials = {
        admin: { email: 'admin@newshub.com', password: 'admin123' },
        manager: { email: 'manager@newshub.com', password: 'manager123' }
      };
      
      const isValidAdmin = email === mockCredentials.admin.email && 
                          password === mockCredentials.admin.password;
      const isValidManager = email === mockCredentials.manager.email && 
                            password === mockCredentials.manager.password;
      
      if (isValidAdmin || isValidManager) {
        const userInfo = {
          email,
          role: isValidAdmin ? 'admin' : 'manager',
          isAuthenticated: true,
          loginTime: new Date().toISOString()
        };
        return { success: true, user: userInfo };
      } else {
        return { success: false, message: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error?.response?.data?.message || 'Authentication failed');
    }
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('newsHubUser');
  },
  
  // Get current authenticated user
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('newsHubUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    return !!user?.isAuthenticated;
  }
};

export default authService;