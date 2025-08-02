import React, { useState, useEffect, createContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const profile = await api.getProfile(token);
          if (profile && profile.id) {
            setUser(profile);
          } else {
            // Token might be invalid or expired
            setToken(null);
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoadingAuth(false);
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        return { success: true };
      } else {
        return { success: false, message: data.msg || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Server error during login' };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const data = await api.register(name, email, password, role);
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        return { success: true };
      } else {
        return { success: false, message: data.msg || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Server error during registration' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, user, loadingAuth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
