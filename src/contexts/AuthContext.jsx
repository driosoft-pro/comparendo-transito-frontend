
import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../services/apiClient.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'ct_token';
const USER_KEY = 'ct_user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parseando usuario en localStorage', err);
      }
    }
    setInitializing(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await apiClient.post('/auth/login', {
      username,
      password,
    });

    if (data?.token) {
      setToken(data.token);
      localStorage.setItem(TOKEN_KEY, data.token);
    }

    if (data?.user) {
      setUser(data.user);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        initializing,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
