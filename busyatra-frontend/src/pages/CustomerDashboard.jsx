import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Ticket, User, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import BusSearch from '../components/customer/BusSearch';
import MyBookings from '../components/customer/MyBookings';
import UserProfile from '../components/customer/UserProfile';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/customer' && location.pathname === '/customer') return true;
    return location.pathname.includes(path) && path !== '/customer';
  };

  const navItems = [
    { 
      name: 'Search Buses', 
      path: '/customer', 
      icon: Search,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'My Bookings', 
      path: '/customer/bookings', 
      icon: Ticket,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      name: 'My Profile', 
      path: '/customer/profile', 
      icon: User,
      color: 'from-emerald-500 to-teal-500'
    },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-dot-pattern mask-[radial-gradient(ellipse_at_center,black_20%,transparent_70%)] opacity-50" />
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-linear-to-b from-primary/5 to-transparent blur-3xl -z-10" />

      <div className="pt-28 pb-12 container mx-auto px-4 md:px-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/25">
                  {getInitials(user?.full_name)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-500">{user?.full_name?.split(' ')[0]}</span>
                  </h1>
                  <p className="text-muted-foreground">Ready for your next adventure?</p>
                </div>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-sm shadow-sm"
            >
              <Sparkles size={16} className="text-amber-500" />
              <span className="text-sm font-medium text-muted-foreground">Premium Member</span>
            </motion.div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-72 shrink-0"
          >
            <div className="sticky top-28 bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-1">Navigation</h2>
                <p className="text-sm text-muted-foreground">Manage your travel</p>
              </div>

              <nav className="space-y-2 mb-6">
                {navItems.map((item, index) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden",
                          active
                            ? "text-white shadow-lg"
                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {active && (
                          <motion.div
                            layoutId="activeTab"
                            className={cn(
                              "absolute inset-0 bg-linear-to-r",
                              item.color
                            )}
                            initial={false}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <item.icon size={20} className="relative z-10" />
                        <span className="font-medium relative z-10">{item.name}</span>
                        {active && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-2 h-2 rounded-full bg-white relative z-10"
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>

              <div className="h-px bg-border/50 my-6" />

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 transition-all duration-300 group"
              >
                <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Logout</span>
              </button>

              {/* Stats Card */}
              <div className="mt-6 p-4 rounded-2xl bg-linear-to-br from-primary/5 to-purple-500/5 border border-primary/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Ticket size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground">Total Trips</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 min-h-[600px]"
          >
            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
              <Routes>
                <Route index element={<BusSearch />} />
                <Route path="bookings" element={<MyBookings />} />
                <Route path="profile" element={<UserProfile />} />
              </Routes>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;