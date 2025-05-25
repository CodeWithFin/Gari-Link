import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { API_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [tempEmail, setTempEmail] = useState(null);

  // Setup axios instance with auth header
  const authAxios = axios.create({
    baseURL: API_URL
  });

  // Add token to requests if available
  authAxios.interceptors.request.use(
    config => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  // Save token securely
  const saveToken = async (token) => {
    try {
      await Keychain.setGenericPassword('authToken', token);
      setToken(token);
      
      // Decode and save user data
      const decoded = jwtDecode(token);
      await AsyncStorage.setItem('user', JSON.stringify(decoded));
      setCurrentUser(decoded);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  // Clear token and user data
  const clearToken = async () => {
    try {
      await Keychain.resetGenericPassword();
      await AsyncStorage.removeItem('user');
      setToken(null);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  };

  // Register a new user
  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (response.data.token) {
        await saveToken(response.data.token);
        return { success: true };
      }
      
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during registration');
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      // Check if MFA is required
      if (response.data.mfaRequired) {
        setMfaRequired(true);
        setTempEmail(email);
        return { success: true, mfaRequired: true };
      }
      
      // If no MFA required, save token and user data
      if (response.data.token) {
        await saveToken(response.data.token);
        return { success: true };
      }
      
      return { success: false, message: 'Login failed' };
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password');
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Verify MFA token
  const verifyMfa = async (token) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/verify-mfa`, { 
        email: tempEmail, 
        token 
      });
      
      if (response.data.token) {
        await saveToken(response.data.token);
        setMfaRequired(false);
        setTempEmail(null);
        return { success: true };
      }
      
      return { success: false, message: 'MFA verification failed' };
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid MFA token');
      return { 
        success: false, 
        message: error.response?.data?.message || 'MFA verification failed' 
      };
    }
  };

  // Setup MFA for user
  const setupMfa = async (mfaMethod) => {
    try {
      setError(null);
      const response = await authAxios.post('/auth/setup-mfa', { mfaMethod });
      return { 
        success: true,
        data: response.data.data 
      };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to setup MFA');
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to setup MFA' 
      };
    }
  };

  // Enable MFA after setup
  const enableMfa = async (token) => {
    try {
      setError(null);
      const response = await authAxios.post('/auth/enable-mfa', { token });
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to enable MFA');
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to enable MFA' 
      };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authAxios.get('/auth/logout');
      await clearToken();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear token on client side even if server request fails
      await clearToken();
      return { success: true };
    }
  };

  // Reset password request
  const forgotPassword = async (email) => {
    try {
      setError(null);
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset email');
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to send reset email' 
      };
    }
  };

  // Reset password with token
  const resetPassword = async (token, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/reset-password`, { 
        token, 
        password 
      });
      
      if (response.data.token) {
        await saveToken(response.data.token);
      }
      
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password');
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to reset password' 
      };
    }
  };

  // Update password when logged in
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      const response = await authAxios.post('/auth/update-password', {
        currentPassword,
        newPassword
      });
      
      if (response.data.token) {
        await saveToken(response.data.token);
      }
      
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update password');
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update password' 
      };
    }
  };

  // Check if user is authenticated on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        // Try to get token from secure storage
        const credentials = await Keychain.getGenericPassword();
        
        if (credentials) {
          const token = credentials.password;
          
          // Check if token is valid and not expired
          if (!isTokenExpired(token)) {
            setToken(token);
            
            // Get stored user data
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
              setCurrentUser(JSON.parse(userData));
            }
          } else {
            // If token is expired, clear it
            await clearToken();
          }
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  const value = {
    currentUser,
    token,
    loading,
    error,
    mfaRequired,
    register,
    login,
    logout,
    verifyMfa,
    setupMfa,
    enableMfa,
    forgotPassword,
    resetPassword,
    updatePassword,
    authAxios
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
