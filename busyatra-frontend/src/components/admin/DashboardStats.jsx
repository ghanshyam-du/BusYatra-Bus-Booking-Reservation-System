
import React, { useState, useEffect } from 'react';
import { Users, Bus, Ticket, TrendingUp, AlertCircle, UserCheck, IndianRupee, Calendar, ArrowUpRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-4 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats?.users || 0, icon: Users, gradient: 'from-blue-500/20 to-blue-600/5', accent: 'text-blue-400', ring: 'ring-blue-500/20' },
    { title: 'Active Travelers', value: stats?.travelers || 0, icon: UserCheck, gradient: 'from-emerald-500/20 to-emerald-600/5', accent: 'text-emerald-400', ring: 'ring-emerald-500/20' },
    { title: 'Active Buses', value: stats?.buses || 0, icon: Bus, gradient: 'from-violet-500/20 to-violet-600/5', accent: 'text-violet-400', ring: 'ring-violet-500/20' },
    { title: 'Total Bookings', value: stats?.bookings || 0, icon: Ticket, gradient: 'from-primary/20 to-orange-600/5', accent: 'text-primary', ring: 'ring-primary/20' },
    { title: 'Total Revenue', value: formatCurrency(stats?.revenue || 0), icon: IndianRupee, gradient: 'from-pink-500/20 to-pink-600/5', accent: 'text-pink-400', ring: 'ring-pink-500/20', isLarge: true },
    { title: 'Confirmed Bookings', value: stats?.confirmed_bookings || 0, icon: TrendingUp, gradient: 'from-teal-500/20 to-teal-600/5', accent: 'text-teal-400', ring: 'ring-teal-500/20' },
    { title: 'Recent (7 days)', value: stats?.recent_bookings || 0, icon: Calendar, gradient: 'from-indigo-500/20 to-indigo-600/5', accent: 'text-indigo-400', ring: 'ring-indigo-500/20' },
    { title: 'Pending Approvals', value: stats?.pending_approvals || 0, icon: AlertCircle, gradient: 'from-red-500/20 to-red-600/5', accent: 'text-red-400', ring: 'ring-red-500/20', alert: stats?.pending_approvals > 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">
          Dashboard <span className="text-primary">Overview</span>
        </h2>
        <p className="text-gray-500 mt-1 text-sm">System metrics and key performance indicators</p>
      </div>

      {/* Alert Cards */}
      {(stats?.pending_approvals > 0 || stats?.pending_tickets > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats?.pending_approvals > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="font-semibold text-red-300 text-sm">{stats.pending_approvals} Pending Traveler Approvals</h4>
                <p className="text-xs text-red-400/70">Review and approve new traveler applications</p>
              </div>
            </motion.div>
          )}
          {stats?.pending_tickets > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-300 text-sm">{stats.pending_tickets} Open Support Tickets</h4>
                <p className="text-xs text-amber-400/70">Address customer support requests</p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-[#12121c] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all group ${stat.alert ? 'ring-1 ring-red-500/30' : ''
              }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center ring-1 ${stat.ring}`}>
                <stat.icon className={`w-5 h-5 ${stat.accent}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors" />
            </div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">{stat.title}</p>
            <p className={`${stat.isLarge ? 'text-xl' : 'text-2xl'} font-bold text-white`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions + Revenue + Health Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-primary/10 to-orange-700/5 rounded-2xl p-6 border border-primary/10"
        >
          <h3 className="font-bold text-white text-lg mb-1">Quick Actions</h3>
          <p className="text-gray-500 text-xs mb-5">Manage your platform efficiently</p>
          <div className="space-y-2">
            <a href="/admin/travelers/onboard" className="flex items-center justify-between py-2.5 px-4 bg-white/5 hover:bg-primary/10 rounded-xl transition text-sm text-gray-300 hover:text-primary group">
              <span>Onboard New Traveler</span>
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
            </a>
            <a href="/admin/tickets" className="flex items-center justify-between py-2.5 px-4 bg-white/5 hover:bg-primary/10 rounded-xl transition text-sm text-gray-300 hover:text-primary group">
              <span>View Support Tickets</span>
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
            </a>
            <a href="/admin/reports" className="flex items-center justify-between py-2.5 px-4 bg-white/5 hover:bg-primary/10 rounded-xl transition text-sm text-gray-300 hover:text-primary group">
              <span>Revenue Reports</span>
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
            </a>
          </div>
        </motion.div>

        {/* Revenue Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[#12121c] rounded-2xl p-6 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-1">
            <IndianRupee className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-white text-lg">Revenue Insights</h3>
          </div>
          <p className="text-gray-500 text-xs mb-5">Platform earnings overview</p>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-sm text-gray-500">Total Revenue</span>
              <span className="font-bold text-white">{formatCurrency(stats?.revenue || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-sm text-gray-500">Avg per Booking</span>
              <span className="font-bold text-white">
                {stats?.confirmed_bookings > 0
                  ? formatCurrency((stats.revenue / stats.confirmed_bookings).toFixed(2))
                  : formatCurrency(0)
                }
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">Confirmed</span>
              <span className="font-bold text-emerald-400">{stats?.confirmed_bookings || 0}</span>
            </div>
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#12121c] rounded-2xl p-6 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-lg">System Health</h3>
          </div>
          <p className="text-gray-500 text-xs mb-5">Platform status</p>
          <div className="space-y-4">
            {['All Systems Operational', 'Database Connected', 'APIs Responding', 'Payment Gateway Active'].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm text-gray-400">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardStats;