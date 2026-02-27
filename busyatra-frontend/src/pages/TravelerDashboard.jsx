
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
import travelerService from '../services/travelerService';

const DashboardHome = ({ user }) => {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await travelerService.getDashboardStats();
        if (res.success) {
          setStats(res.data);
        } else {
          setError('Failed to load stats');
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
        setError('Error loading stats');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Buses',
      value: stats?.total_buses || 0,
      icon: Bus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      delay: 0.1
    },
    {
      title: 'Active Schedules',
      value: stats?.active_schedules || 0,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      delay: 0.2
    },
    {
      title: 'Total Bookings',
      value: stats?.total_bookings || 0,
      icon: Ticket,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      delay: 0.3
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.total_revenue || 0).toLocaleString()}`,
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      delay: 0.4
    }
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome Back, {user?.full_name?.split(' ')[0]}!</h2>
          <p className="text-gray-500">Here's what's happening with your fleet today.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse h-32" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 font-medium">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
              </div>
              <div className="absolute right-0 bottom-0 opacity-[0.03] transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                <stat.icon size={120} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[250px]">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Bus className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Fleet</h3>
          <p className="text-gray-500 text-sm max-w-[250px] mb-6">Add new buses, update details or remove inactive vehicles from your fleet.</p>
          <Link to="/traveler/buses" className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
            View Buses
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[250px]">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Schedule Trips</h3>
          <p className="text-gray-500 text-sm max-w-[250px] mb-6">Create new routes, manage timings and oversee all active schedules easily.</p>
          <Link to="/traveler/schedules" className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
            View Schedules
          </Link>
        </div>
      </div>
    </div>
  );
};


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
        <div className="flex items-center gap-3 mt-6 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-xl shadow-md">
            {user?.full_name?.[0] || 'T'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.full_name}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Bus Operator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
              isActive(item.path)
                ? "bg-gray-900 text-white shadow-md shadow-gray-900/10"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
            )}
          >
            <item.icon size={20} className={cn("transition-transform duration-200", isActive(item.path) ? "scale-105" : "group-hover:scale-105")} />
            <span className="font-medium relative z-10">{item.name}</span>
            {isActive(item.path) && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
              />
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100 px-2 lg:mb-4">
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
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 selection:bg-gray-900 selection:text-white pb-12">
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
          <div className="sticky top-24 bg-white border border-gray-100 rounded-[2rem] p-4 shadow-sm h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
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
          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 md:p-8 shadow-sm min-h-[500px] relative">
            <Routes>
              <Route index element={<DashboardHome user={user} />} />
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