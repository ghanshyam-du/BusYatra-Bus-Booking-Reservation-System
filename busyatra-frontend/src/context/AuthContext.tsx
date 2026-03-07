import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

interface User {
  user_id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  gender: 'Male' | 'Female' | 'Other';
  date_of_birth: string;
  role: 'CUSTOMER' | 'TRAVELER' | 'ADMIN';
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
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
  fetchMe: () => Promise<void>;
  isAuthenticated: boolean;
  isCustomer: boolean;
  isTraveler: boolean;
  isAdmin: boolean;
  role: User['role'] | null;
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

  // Calls GET /auth/me and syncs the result into state + localStorage
  const fetchMe = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setLoading(false);
      return;
    }
    try {
      const response = await authService.getProfile(); // GET /auth/me
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      // Token is expired or invalid — clean up
      console.error('AuthProvider: session invalid, logging out', error);
      authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Paint immediately from cache so UI doesn't flash
    const cached = authService.getCurrentUser();
    if (cached) setUser(cached);

    // 2. Then verify with server and get latest data (role, name, etc.)
    fetchMe();
  }, [fetchMe]);

  const login = async (credentials: Credentials) => {
    const response = await authService.login(credentials);
    if (response.success) {
      // login already saves to localStorage via authService
      // fetch fresh data from server to ensure we have all fields
      await fetchMe();
    }
    return response;
  };

  const register = async (userData: any) => {
    const response = await authService.register(userData);
    if (response.success) {
      setUser(response.data);
    }
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    fetchMe,
    isAuthenticated: !!user,
    isCustomer: user?.role === 'CUSTOMER',
    isTraveler: user?.role === 'TRAVELER',
    isAdmin: user?.role === 'ADMIN',
    role: user?.role ?? null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;