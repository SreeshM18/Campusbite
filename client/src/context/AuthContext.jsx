import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check initial session validity via HTTP-Only cookie on mount
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authApi.getMe();
      if (res && res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true, user: res.user };
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      const msg = err.message || 'Invalid email or password';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    setAuthError(null);
    try {
      const res = await authApi.register(userData);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true, user: res.user };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err) {
      const msg = err.message || 'Registration failed';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authApi.updateProfile(profileData);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true, user: res.user };
      }
      throw new Error(res.message || 'Failed to update profile');
    } catch (err) {
      return { success: false, error: err.message || 'Profile update failed' };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const res = await authApi.changePassword(passwordData);
      if (res.success) {
        return { success: true, message: res.message };
      }
      throw new Error(res.message || 'Failed to change password');
    } catch (err) {
      return { success: false, error: err.message || 'Password update failed' };
    }
  };

  const value = {
    user,
    loading,
    authError,
    setAuthError,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuth,
    isAuthenticated: !!user,
    isStaff: user?.role === 'CANTEEN_STAFF',
    isFaculty: user?.role === 'FACULTY',
    isStudent: user?.role === 'STUDENT'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
