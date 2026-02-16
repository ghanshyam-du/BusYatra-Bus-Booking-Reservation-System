
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bus,
  Calendar,
  BarChart3,
  Ticket,
  LogOut,
  Users,
  Menu,
  X
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import BusList from '../components/traveler/BusList';
import AddBus from '../components/traveler/AddBus';
import EditBus from '../components/traveler/EditBus';
import ScheduleList from '../components/traveler/ScheduleList';
import AddSchedule from '../components/traveler/AddSchedule';
import BookingAnalytics from '../components/traveler/BookingAnalytics';
import SupportTickets from '../components/traveler/SupportTickets';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const TravelerDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/traveler' && location.pathname === '/traveler') return true;
    return location.pathname.includes(path) && path !== '/traveler';
  };

  const navItems = [
    { name: 'Dashboard', path: '/traveler', icon: LayoutDashboard },
    { name: 'My Buses', path: '/traveler/buses', icon: Bus },
    { name: 'Schedules', path: '/traveler/schedules', icon: Calendar },
    { name: 'Bookings', path: '/traveler/bookings', icon: BarChart3 },
    { name: 'Support', path: '/traveler/tickets', icon: Users }, // Changed icon to match typical support icon usage or keep Users if preferred
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-8 px-2">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Traveler Portal</h2>
        <div className="flex items-center gap-3 mt-4 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
            {user?.full_name?.[0] || 'T'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.full_name}</p>
            <p className="text-xs text-primary font-medium">Bus Operator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
              isActive(item.path)
                ? "bg-gradient-to-r from-primary to-orange-600 text-white shadow-lg shadow-primary/25"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <item.icon size={20} className={cn("transition-transform duration-300", isActive(item.path) ? "scale-110" : "group-hover:scale-110")} />
            <span className="font-medium relative z-10">{item.name}</span>
            {isActive(item.path) && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-gray-500 hover:text-red-600 transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <div className="pt-24 container mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-100px)]">

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-2 text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            <span className="font-medium">Menu</span>
          </button>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            <SidebarContent />
          </div>
        </aside>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-white p-6 shadow-2xl border-r border-gray-200">
                <div className="flex justify-end mb-4">
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-gray-900">
                    <X size={24} />
                  </button>
                </div>
                <SidebarContent />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 w-full overflow-hidden">
          <div className="bg-white/50 backdrop-blur-md border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm min-h-[500px] relative">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />

            <Routes>
              <Route index element={
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <LayoutDashboard className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back, {user?.full_name?.split(' ')[0]}!</h2>
                  <p className="text-gray-500 max-w-md">
                    Manage your fleet, check bookings, and track revenue all in one place.
                    Select an option from the sidebar to get started.
                  </p>
                  <Link
                    to="/traveler/bookings"
                    className="mt-8 px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-900 font-medium transition flex items-center gap-2 shadow-sm"
                  >
                    View Analytics <BarChart3 size={18} className="text-primary" />
                  </Link>
                </div>
              } />
              <Route path="buses" element={<BusList />} />
              <Route path="add-bus" element={<AddBus />} />
              <Route path="edit-bus/:busId" element={<EditBus />} />
              <Route path="schedules" element={<ScheduleList />} />
              <Route path="add-schedule" element={<AddSchedule />} />
              <Route path="bookings" element={<BookingAnalytics />} />
              <Route path="tickets" element={<SupportTickets />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TravelerDashboard;