
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Bus, Ticket, MessageSquare, BarChart3, LogOut, UserCheck, Menu, X, ChevronRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardStats from '../components/admin/DashboardStats';
import TravelerManagement from '../components/admin/TravelerManagement';
import OnboardTraveler from '../components/admin/OnboardTraveler';
import TicketManagement from '../components/admin/TicketManagement';
import RevenueReports from '../components/admin/RevenueReports';
import UserManagement from '../components/admin/UserManagement';
import BusManagement from '../components/admin/BusManagement';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    return location.pathname.includes(path) && path !== '/admin';
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/travelers', icon: UserCheck, label: 'Travelers' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/buses', icon: Bus, label: 'Buses' },
    { path: '/admin/tickets', icon: MessageSquare, label: 'Support Tickets' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-30 bg-[#0f0f18]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 transition"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <Link to="/admin" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold text-white">BusYatra</span>
                  <span className="ml-2 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">Admin</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user?.full_name?.[0] || 'A'}</span>
                </div>
                <span className="text-sm font-medium text-gray-300">{user?.full_name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-gray-400 rounded-xl transition-all duration-200 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto flex">
        {/* Sidebar Overlay (Mobile) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 lg:top-[61px] z-20 lg:z-10
          w-[260px] h-[calc(100vh-64px)] lg:h-[calc(100vh-61px)]
          bg-[#0f0f18]/95 lg:bg-[#0f0f18]/50 backdrop-blur-xl
          border-r border-white/5
          p-4 overflow-y-auto
          transition-transform duration-300 lg:transition-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = item.exact ? location.pathname === item.path : isActive(item.path.replace('/admin/', ''));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
                      ? 'bg-gradient-to-r from-primary/15 to-orange-600/10 text-primary shadow-sm'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${active ? 'text-primary' : 'text-gray-600 group-hover:text-gray-400'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                  {active && <ChevronRight className="w-4 h-4 ml-auto text-primary/50" />}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-orange-600/5 border border-primary/10">
            <p className="text-xs text-gray-500 font-medium">Platform Status</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-gray-400">All systems operational</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-61px)] p-4 lg:p-8">
          <Routes>
            <Route index element={<DashboardStats />} />
            <Route path="travelers" element={<TravelerManagement />} />
            <Route path="travelers/onboard" element={<OnboardTraveler />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="buses" element={<BusManagement />} />
            <Route path="tickets" element={<TicketManagement />} />
            <Route path="reports" element={<RevenueReports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;