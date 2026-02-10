import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

interface User {
  role: 'CUSTOMER' | 'TRAVELER' | 'ADMIN';
  [key: string]: any;
}

interface Credentials {
  email: string;
  password: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: Credentials) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  updateUser: (userData: User) => void;
  isAuthenticated: boolean;
  isCustomer: boolean;
  isTraveler: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials: Credentials) => {
    const response = await authService.login(credentials);
    const userData = response.user;
    setUser(userData);
    console.log('test2', userData);
    return response;
  };



  const register = async (userData: any) => {
    const response = await authService.register(userData);
    setUser(response.data);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isCustomer: user?.role === 'CUSTOMER',
    isTraveler: user?.role === 'TRAVELER',
    isAdmin: user?.role === 'ADMIN',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


// Authentication context for global auth state