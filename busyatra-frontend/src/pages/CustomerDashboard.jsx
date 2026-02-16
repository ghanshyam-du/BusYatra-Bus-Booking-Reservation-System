import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Ticket, User, LogOut, Sparkles, MapPin, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
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
      color: 'from-primary to-amber-500',
      bgTint: 'bg-primary/8',
    },
    {
      name: 'My Bookings',
      path: '/customer/bookings',
      icon: Ticket,
      color: 'from-purple-500 to-pink-500',
      bgTint: 'bg-purple-500/8',
    },
    {
      name: 'My Profile',
      path: '/customer/profile',
      icon: User,
      color: 'from-emerald-500 to-teal-500',
      bgTint: 'bg-emerald-500/8',
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
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />

      {/* Background — matches Home.jsx */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-background bg-dot-pattern mask-[radial-gradient(ellipse_at_center,black_20%,transparent_70%)] opacity-50" />
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-linear-to-b from-primary/5 to-transparent blur-3xl -z-10" />

      <div className="pt-28 pb-24 container mx-auto px-4 md:px-6">
        {/* Welcome Header — matches Home hero animation style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar — gradient like Home hero CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary via-purple-500 to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/25"
              >
                {getInitials(user?.full_name)}
              </motion.div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-extrabold tracking-tight"
                >
                  Welcome back,{' '}
                  <span className="text-gradient">
                    {user?.full_name?.split(' ')[0]}
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground mt-1"
                >
                  Ready for your next adventure?
                </motion.p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-sm shadow-sm"
            >
              <Sparkles size={16} className="text-amber-500" />
              <span className="text-sm font-semibold text-muted-foreground">Premium Member</span>
            </motion.div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-80 shrink-0"
          >
            <div className="sticky top-28 space-y-6">
              {/* Navigation Card */}
              <div className="bg-white/70 dark:bg-card/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
                <div className="mb-6">
                  <h2 className="text-lg font-bold tracking-tight mb-0.5">Navigation</h2>
                  <p className="text-sm text-muted-foreground">Manage your travel</p>
                </div>

                <nav className="space-y-1.5">
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
                          transition={{ delay: 0.3 + index * 0.1 }}
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
                                "absolute inset-0 bg-linear-to-r rounded-2xl",
                                item.color
                              )}
                              initial={false}
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <div className={cn(
                            "relative z-10 w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                            active ? "bg-white/20" : item.bgTint
                          )}>
                            <item.icon size={18} className="relative z-10" />
                          </div>
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

                <div className="h-px bg-linear-to-r from-transparent via-border/60 to-transparent my-5" />

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 dark:text-red-400 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-red-500/8 flex items-center justify-center group-hover:bg-red-500/15 transition-colors">
                    <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                  </div>
                  <span className="font-medium">Logout</span>
                </button>
              </div>

              {/* Stats Cards — bento style like Home features */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/70 dark:bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg ring-1 ring-black/5 dark:ring-white/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary/10 to-amber-500/10 flex items-center justify-center mb-3">
                    <Ticket size={18} className="text-primary" />
                  </div>
                  <p className="text-2xl font-extrabold tracking-tight">0</p>
                  <p className="text-xs text-muted-foreground font-medium">Total Trips</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/70 dark:bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg ring-1 ring-black/5 dark:ring-white/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center mb-3">
                    <MapPin size={18} className="text-emerald-600" />
                  </div>
                  <p className="text-2xl font-extrabold tracking-tight">5,000+</p>
                  <p className="text-xs text-muted-foreground font-medium">Routes</p>
                </motion.div>
              </div>

              {/* Trust Badge — matches Home CTA vibes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-linear-to-br from-primary/5 via-purple-500/5 to-accent/5 rounded-2xl p-4 ring-1 ring-primary/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Safe & Secure</p>
                    <p className="text-xs text-muted-foreground">100% secure payments & data</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex-1 min-h-[600px]"
          >
            <div className="bg-white/70 dark:bg-card/50 backdrop-blur-xl rounded-3xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
              <Routes>
                <Route index element={<BusSearch />} />
                <Route path="bookings" element={<MyBookings />} />
                <Route path="profile" element={<UserProfile />} />
              </Routes>
            </div>
          </motion.main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;