import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Ticket, IndianRupee, MapPin, Calendar, ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react';
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
  const [bookings, setBookings] = useState([]);
  const [bookingStats, setBookingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentBookings();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await travelerService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      // Fetch bookings — sorted by date desc, we slice the first 5 for "recent"
      const response = await travelerService.getBookings();
      const allBookings = response.data || [];
      setBookings(allBookings.slice(0, 5));         // show latest 5
      setBookingStats(response.stats || null);
    } catch (error) {
      toast.error('Failed to load recent bookings');
    } finally {
      setBookingsLoading(false);
    }
  };

  const chartData = [
    { name: 'Mon', bookings: 4, revenue: 2400 },
    { name: 'Tue', bookings: 3, revenue: 1398 },
    { name: 'Wed', bookings: 2, revenue: 9800 },
    { name: 'Thu', bookings: 7, revenue: 3908 },
    { name: 'Fri', bookings: 12, revenue: 4800 },
    { name: 'Sat', bookings: 18, revenue: 8800 },
    { name: 'Sun', bookings: 15, revenue: 7300 },
  ];

  const getStatusConfig = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Confirmed' };
      case 'CANCELLED':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Cancelled' };
      case 'PENDING':
        return { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Pending' };
      default:
        return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-500/10', label: status };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const kpiCards = [
    { label: 'Total Revenue', value: formatCurrency(stats?.total_revenue || bookingStats?.total_revenue || 0), icon: IndianRupee, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Bookings', value: stats?.total_bookings || bookingStats?.total_bookings || 0, icon: Ticket, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Confirmed', value: bookingStats?.confirmed ?? '—', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Active Buses', value: stats?.total_buses || 0, icon: MapPin, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Booking <span className="text-primary">Analytics</span></h2>
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

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#12121c] rounded-2xl p-6 border border-white/5"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white">Recent Bookings</h3>
          {bookingStats && (
            <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
              {bookingStats.total_bookings} total
            </span>
          )}
        </div>

        {bookingsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-3">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] gap-4 px-3 pb-2 border-b border-white/5">
              {['Booking Ref', 'Journey', 'Date', 'Amount', 'Status'].map((h) => (
                <p key={h} className="text-xs text-gray-500 font-medium uppercase tracking-wider">{h}</p>
              ))}
            </div>

            {bookings.map((booking, idx) => {
              const statusConfig = getStatusConfig(booking.booking_status);
              const StatusIcon = statusConfig.icon;
              return (
                <motion.div
                  key={booking.booking_id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr_1fr_1fr] gap-4 items-center p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/[0.08] transition-colors"
                >
                  {/* Booking Ref */}
                  <div>
                    <p className="text-sm font-semibold text-white">{booking.booking_reference || '—'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{booking.number_of_seats} seat{booking.number_of_seats !== 1 ? 's' : ''}</p>
                  </div>

                  {/* Journey */}
                  <div className="flex items-center gap-2 min-w-0">
                    {booking.journey ? (
                      <>
                        <span className="text-sm text-white truncate">{booking.journey.from}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-white truncate">{booking.journey.to}</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">—</span>
                    )}
                  </div>

                  {/* Journey Date */}
                  <div>
                    <p className="text-sm text-gray-300">{formatDate(booking.journey?.journey_date)}</p>
                    {booking.journey?.departure_time && (
                      <p className="text-xs text-gray-500 mt-0.5">{booking.journey.departure_time}</p>
                    )}
                  </div>

                  {/* Amount */}
                  <p className="text-sm font-bold text-white">{formatCurrency(booking.total_amount)}</p>

                  {/* Status Badge */}
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${statusConfig.bg}`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
                    <span className={`text-xs font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Ticket className="w-8 h-8 text-gray-600" />
            <p className="text-gray-500 text-sm">No recent bookings to display.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BookingAnalytics;