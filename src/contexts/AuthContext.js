import React, { createContext, useState, useEffect } from 'react';
import { api } from '../api/api'; // ✅ correct named import


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localstorage + validate token perhaps on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if(token && userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/users/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (name, email, password) => {
    return await api.post('/users/register', { name, email, password });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};