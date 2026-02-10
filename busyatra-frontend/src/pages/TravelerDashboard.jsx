import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bus,
  Calendar,
  BarChart3,
  Ticket,
  LogOut,
  Plus,
  Users
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

const TravelerDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/traveler' && location.pathname === '/traveler') return true;
    return location.pathname.includes(path) && path !== '/traveler';
  };

  const navItems = [
    { name: 'Dashboard', path: '/traveler', icon: LayoutDashboard },
    { name: 'My Buses', path: '/traveler/buses', icon: Bus },
    { name: 'Schedules', path: '/traveler/schedules', icon: Calendar },
    { name: 'Bookings', path: '/traveler/bookings', icon: BarChart3 },
    { name: 'Support', path: '/traveler/tickets', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 container mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-100px)]">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="mb-6 px-4">
              <h2 className="text-lg font-bold">Traveler Portal</h2>
              <p className="text-sm text-muted-foreground">{user?.full_name}</p>
              <div className="mt-2 text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full inline-block">
                Bus Operator
              </div>
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
            <Route index element={<div className="p-4">Dashboard Overview Coming Soon</div>} />
            <Route path="buses" element={<BusList />} />
            <Route path="add-bus" element={<AddBus />} />
            <Route path="edit-bus/:busId" element={<EditBus />} />
            <Route path="schedules" element={<ScheduleList />} />
            <Route path="add-schedule" element={<AddSchedule />} />
            <Route path="bookings" element={<BookingAnalytics />} />
            <Route path="tickets" element={<SupportTickets />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default TravelerDashboard;