
import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Ticket, IndianRupee, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import travelerService from '../../services/travelerService';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const BookingAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await travelerService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      // Silent fail or toast if critical
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts if not provided by API heavily
  const chartData = [
    { name: 'Mon', bookings: 4, revenue: 2400 },
    { name: 'Tue', bookings: 3, revenue: 1398 },
    { name: 'Wed', bookings: 2, revenue: 9800 },
    { name: 'Thu', bookings: 7, revenue: 3908 },
    { name: 'Fri', bookings: 12, revenue: 4800 },
    { name: 'Sat', bookings: 18, revenue: 8800 },
    { name: 'Sun', bookings: 15, revenue: 7300 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const kpiCards = [
    { label: 'Total Revenue', value: formatCurrency(stats?.revenue || 0), icon: IndianRupee, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Bookings', value: stats?.total_bookings || 0, icon: Ticket, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Passengers', value: stats?.passengers || 0, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Active Buses', value: stats?.active_buses || 0, icon: MapPin, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Booking <span className="text-primary">Analytics</span></h2>
        <p className="text-gray-500 text-sm mt-1">Insights into your fleet's performance</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#12121c] p-5 rounded-2xl border border-white/5"
          >
            <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center mb-3`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{kpi.label}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{kpi.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#12121c] p-6 rounded-2xl border border-white/5"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white">Weekly Bookings</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 px-2 py-1 outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#1f1f2e', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="bookings" fill="#f97415" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#12121c] p-6 rounded-2xl border border-white/5"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white">Revenue Trend</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f1f2e', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Bookings (Simplified List) */}
      <div className="bg-[#12121c] rounded-2xl p-6 border border-white/5">
        <h3 className="font-bold text-white mb-4">Recent Bookings</h3>
        <div className="space-y-3">
          {(stats?.recent_bookings || []).length > 0 ? (
            stats.recent_bookings.map((booking, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {booking.user?.full_name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{booking.user?.full_name}</p>
                    <p className="text-xs text-gray-500">{booking.booking_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{formatCurrency(booking.total_fare)}</p>
                  <p className="text-xs text-emerald-400 capitalize">{booking.booking_status.toLowerCase()}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">No recent bookings to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingAnalytics;