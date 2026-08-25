import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext();

export { api };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Set default header if token exists on mount
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Attach token interceptor and handle 401 response cleanup
  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use((config) => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }
      return config;
    });

    const resInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Clean up stale or expired session tokens silently
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          delete api.defaults.headers.common['Authorization'];
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, []);

  // Fetch current user on boot
  useEffect(() => {
    let isMounted = true;

    const fetchMe = async () => {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
        const res = await api.get('/auth/me');
        if (isMounted && res.data?.success) {
          setUser(res.data.data);
        }
      } catch (err) {
        // Expired or invalid session token - clean up state cleanly
        localStorage.removeItem('token');
        if (isMounted) {
          setToken(null);
          setUser(null);
        }
        delete api.defaults.headers.common['Authorization'];
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMe();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: receivedToken, data: userData } = res.data;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(userData);
        api.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
        return { success: true, user: userData };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      setAuthError(message);
      return { success: false, message };
    }
  };

  const register = async (formData) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        const { token: receivedToken, data: userData } = res.data;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(userData);
        api.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
        return { success: true, user: userData };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      setAuthError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore network logout errors
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.error('Refresh user error:', err);
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const value = {
    user,
    token,
    loading,
    authError,
    setAuthError,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    isAuthenticated: !!user,
    isFarmer: user?.role === 'FARMER',
    isBuyer: user?.role === 'BUYER',
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
