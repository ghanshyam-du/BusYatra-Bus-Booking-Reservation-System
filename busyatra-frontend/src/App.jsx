import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import ScrollToTop from './components/common/ScrollToTop';
import { ScrollProgress } from './components/common/ScrollProgress';
import PageTransition from './components/common/PageTransition';
import "./App.css"

// Pages
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import HomePage from './pages/Home';
import CustomerDashboard from './pages/CustomerDashboard';
import TravelerDashboard from './pages/TravelerDashboard';
// import AdminDashboard from './pages/AdminDashboard';

function App() {
  const location = useLocation();

  // Determine key for AnimatePresence
  // Use first segment of path for dashboard routes to prevent full unmount on sub-navigation
  const getKey = () => {
    const path = location.pathname;
    if (path.startsWith('/customer')) return 'customer';
    if (path.startsWith('/traveler')) return 'traveler';
    if (path.startsWith('/admin')) return 'admin';
    return path;
  };

  return (
    <AuthProvider>
      <ScrollToTop />
      <ScrollProgress />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <AnimatePresence mode="wait">
        <Routes location={location} key={getKey()}>
          {/* Public Routes */}
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />

          {/* Protected Routes */}
          <Route
            path="/customer/*"
            element={
              <PageTransition>
                <PrivateRoute allowedRoles={['CUSTOMER']}>
                  <CustomerDashboard />
                </PrivateRoute>
              </PageTransition>
            }
          />

          <Route
            path="/traveler/*"
            element={
              <PageTransition>
                <PrivateRoute allowedRoles={['TRAVELER']}>
                  <TravelerDashboard />
                </PrivateRoute>
              </PageTransition>
            }
          />

          <Route
            path="/admin/*"
            element={
              <PageTransition>
                <PrivateRoute allowedRoles={['ADMIN']}>
                  {/* <AdminDashboard /> */}
                  <div className="p-10 text-center">Admin Dashboard Coming Soon</div>
                </PrivateRoute>
              </PageTransition>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;
