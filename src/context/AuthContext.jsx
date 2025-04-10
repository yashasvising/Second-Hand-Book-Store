import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/';
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get('api/auth/me');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        setIsAuthenticated(false);
        setError(err.response?.data?.message || 'Failed to authenticate');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post('api/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post('api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.put('api/auth/profile', userData);
      setUser(res.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      await axios.put('api/auth/change-password', { currentPassword, newPassword });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};