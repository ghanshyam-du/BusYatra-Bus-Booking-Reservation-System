import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Ticket, User, LogOut, Bus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// import BusSearch from '../components/customer/BusSearch';
// import MyBookings from '../components/customer/MyBookings';
// import UserProfile from '../components/customer/UserProfile';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bus className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold">BusYatra</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-gray-700">Hi, {user?.full_name}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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
          <div className="w-64 bg-white rounded-lg shadow-sm p-4 h-fit">
            <nav className="space-y-2">
              <Link
                to="/customer"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  location.pathname === '/customer'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Search className="w-5 h-5" />
                Search Buses
              </Link>
              <Link
                to="/customer/bookings"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive('/bookings')
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Ticket className="w-5 h-5" />
                My Bookings
              </Link>
              <Link
                to="/customer/profile"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive('/profile')
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
                Profile
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Routes>
              <Route index element={<BusSearch />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="profile" element={<UserProfile />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;