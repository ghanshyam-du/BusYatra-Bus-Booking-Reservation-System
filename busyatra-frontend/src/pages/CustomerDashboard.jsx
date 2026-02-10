import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Ticket, User, LogOut, LayoutDashboard } from 'lucide-react';
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
    { name: 'Search Buses', path: '/customer', icon: Search },
    { name: 'My Bookings', path: '/customer/bookings', icon: Ticket },
    { name: 'My Profile', path: '/customer/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 container mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-100px)]">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="mb-6 px-4">
              <h2 className="text-lg font-bold">Dashboard</h2>
              <p className="text-sm text-muted-foreground">Welcome, {user?.full_name?.split(' ')[0]}</p>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}

              <div className="h-px bg-border my-2 mx-4" />

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-card/50 border border-border/50 rounded-2xl p-6 shadow-sm min-h-[500px]">
          <Routes>
            <Route index element={<BusSearch />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="profile" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;