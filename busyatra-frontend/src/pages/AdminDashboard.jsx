import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Bus, Ticket, MessageSquare,
  BarChart3, LogOut, UserCheck, Menu, X, ChevronRight,
  Shield, UserCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardStats from '../components/admin/DashboardStats';
import TravelerManagement from '../components/admin/TravelerManagement';
import OnboardTraveler from '../components/admin/OnboardTraveler';
import TicketManagement from '../components/admin/TicketManagement';
import RevenueReports from '../components/admin/RevenueReports';
import UserManagement from '../components/admin/UserManagement';
import BusManagement from '../components/admin/BusManagement';
import UserProfile from '../components/UserProfile';
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
    { path: '/admin',           icon: LayoutDashboard, label: 'Dashboard',       exact: true },
    { path: '/admin/travelers', icon: UserCheck,       label: 'Travelers'                    },
    { path: '/admin/users',     icon: Users,           label: 'Users'                        },
    { path: '/admin/buses',     icon: Bus,             label: 'Buses'                        },
    { path: '/admin/tickets',   icon: MessageSquare,   label: 'Support Tickets'              },
    { path: '/admin/reports',   icon: BarChart3,       label: 'Reports'                      },
    { path: '/admin/profile',   icon: UserCircle,      label: 'Profile'                      },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Navbar ──────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <Link to="/admin" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md shadow-orange-200">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold text-gray-900">BusYatra</span>
                  <span className="ml-2 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">Admin</span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin/profile"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 group"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user?.full_name?.[0] || 'A'}</span>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {user?.full_name}
                </span>
                <UserCircle className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-xl transition-all duration-200 text-sm font-medium border border-transparent hover:border-red-200"
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
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside className={`
          fixed lg:sticky top-16 lg:top-[61px] z-20 lg:z-10
          w-[260px] h-[calc(100vh-64px)] lg:h-[calc(100vh-61px)]
          bg-white border-r border-gray-200
          p-4 overflow-y-auto
          transition-transform duration-300 lg:transition-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = item.exact
                ? location.pathname === item.path
                : isActive(item.path.replace('/admin/', ''));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-200'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${active ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                  {active && <ChevronRight className="w-4 h-4 ml-auto text-orange-400" />}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
            <p className="text-xs text-gray-500 font-medium">Platform Status</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-gray-600">All systems operational</span>
            </div>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <main className="flex-1 min-h-[calc(100vh-61px)] p-4 lg:p-8 bg-gray-50">
          <Routes>
            <Route index element={<DashboardStats />} />
            <Route path="travelers" element={<TravelerManagement />} />
            <Route path="travelers/onboard" element={<OnboardTraveler />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="buses" element={<BusManagement />} />
            <Route path="tickets" element={<TicketManagement />} />
            <Route path="reports" element={<RevenueReports />} />
            <Route path="profile" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;