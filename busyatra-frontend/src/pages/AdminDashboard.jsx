
import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Bus, Ticket, MessageSquare, BarChart3, LogOut, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardStats from '../components/admin/DashboardStats';
import TravelerManagement from '../components/admin/TravelerManagement';
import OnboardTraveler from '../components/admin/OnboardTraveler';
import TicketManagement from '../components/admin/TicketManagement';
import RevenueReports from '../components/admin/RevenueReports';
import UserManagement from '../components/admin/UserManagement';
import BusManagement from '../components/admin/BusManagement';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    return location.pathname.includes(path) && path !== '/admin';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">BusYatra</span>
                <span className="ml-2 text-sm text-purple-100">Admin Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-white font-medium">👑 {user?.full_name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-4 h-fit sticky top-24">
            <nav className="space-y-2">
              <Link
                to="/admin"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  location.pathname === '/admin'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>

              <Link
                to="/admin/travelers"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive('/travelers')
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UserCheck className="w-5 h-5" />
                Travelers
              </Link>

              <Link
                to="/admin/users"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive('/users')
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                Users
              </Link>

              <Link
                to="/admin/buses"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive('/buses')
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Bus className="w-5 h-5" />
                Buses
              </Link>

              <Link
                to="/admin/tickets"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive('/tickets')
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                Support Tickets
              </Link>

              <Link
                to="/admin/reports"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive('/reports')
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Reports
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Routes>
              <Route index element={<DashboardStats />} />
              <Route path="travelers" element={<TravelerManagement />} />
              <Route path="travelers/onboard" element={<OnboardTraveler />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="buses" element={<BusManagement />} />
              <Route path="tickets" element={<TicketManagement />} />
              <Route path="reports" element={<RevenueReports />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;