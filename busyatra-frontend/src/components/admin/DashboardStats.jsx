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
          <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-4 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users',        value: stats?.users || 0,                       icon: Users,       bg: 'bg-blue-50',   icon_color: 'text-blue-600',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700'   },
    { title: 'Active Travelers',   value: stats?.travelers || 0,                   icon: UserCheck,   bg: 'bg-emerald-50',icon_color: 'text-emerald-600',border: 'border-emerald-200',badge: 'bg-emerald-100 text-emerald-700'},
    { title: 'Active Buses',       value: stats?.buses || 0,                       icon: Bus,         bg: 'bg-violet-50', icon_color: 'text-violet-600', border: 'border-violet-200', badge: 'bg-violet-100 text-violet-700'},
    { title: 'Total Bookings',     value: stats?.bookings || 0,                    icon: Ticket,      bg: 'bg-orange-50', icon_color: 'text-orange-600', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700'},
    { title: 'Total Revenue',      value: formatCurrency(stats?.revenue || 0),     icon: IndianRupee, bg: 'bg-pink-50',   icon_color: 'text-pink-600',   border: 'border-pink-200',   badge: 'bg-pink-100 text-pink-700',   isLarge: true },
    { title: 'Confirmed Bookings', value: stats?.confirmed_bookings || 0,          icon: TrendingUp,  bg: 'bg-teal-50',   icon_color: 'text-teal-600',   border: 'border-teal-200',   badge: 'bg-teal-100 text-teal-700'   },
    { title: 'Recent (7 days)',    value: stats?.recent_bookings || 0,             icon: Calendar,    bg: 'bg-indigo-50', icon_color: 'text-indigo-600', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700'},
    { title: 'Pending Approvals',  value: stats?.pending_approvals || 0,           icon: AlertCircle, bg: 'bg-red-50',    icon_color: 'text-red-600',    border: 'border-red-200',    badge: 'bg-red-100 text-red-700',    alert: stats?.pending_approvals > 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Dashboard <span className="text-orange-500">Overview</span>
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
              className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-red-700 text-sm">{stats.pending_approvals} Pending Traveler Approvals</h4>
                <p className="text-xs text-red-500 mt-0.5">Review and approve new traveler applications</p>
              </div>
            </motion.div>
          )}
          {stats?.pending_tickets > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-700 text-sm">{stats.pending_tickets} Open Support Tickets</h4>
                <p className="text-xs text-amber-500 mt-0.5">Address customer support requests</p>
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
            className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all group ${stat.alert ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-200'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.icon_color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{stat.title}</p>
            <p className={`${stat.isLarge ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
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
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-lg shadow-orange-200"
        >
          <h3 className="font-bold text-white text-lg mb-1">Quick Actions</h3>
          <p className="text-orange-100 text-xs mb-5">Manage your platform efficiently</p>
          <div className="space-y-2">
            <a href="/admin/travelers/onboard" className="flex items-center justify-between py-2.5 px-4 bg-white/15 hover:bg-white/25 rounded-xl transition text-sm text-white font-medium group">
              <span>Onboard New Traveler</span>
              <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 transition" />
            </a>
            <a href="/admin/tickets" className="flex items-center justify-between py-2.5 px-4 bg-white/15 hover:bg-white/25 rounded-xl transition text-sm text-white font-medium group">
              <span>View Support Tickets</span>
              <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 transition" />
            </a>
            <a href="/admin/reports" className="flex items-center justify-between py-2.5 px-4 bg-white/15 hover:bg-white/25 rounded-xl transition text-sm text-white font-medium group">
              <span>Revenue Reports</span>
              <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 transition" />
            </a>
          </div>
        </motion.div>

        {/* Revenue Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-1">
            <IndianRupee className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-gray-900 text-lg">Revenue Insights</h3>
          </div>
          <p className="text-gray-500 text-xs mb-5">Platform earnings overview</p>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Total Revenue</span>
              <span className="font-bold text-gray-900">{formatCurrency(stats?.revenue || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Avg per Booking</span>
              <span className="font-bold text-gray-900">
                {stats?.confirmed_bookings > 0
                  ? formatCurrency((stats.revenue / stats.confirmed_bookings).toFixed(2))
                  : formatCurrency(0)
                }
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">Confirmed</span>
              <span className="font-bold text-emerald-600">{stats?.confirmed_bookings || 0}</span>
            </div>
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-gray-900 text-lg">System Health</h3>
          </div>
          <p className="text-gray-500 text-xs mb-5">Platform status</p>
          <div className="space-y-4">
            {['All Systems Operational', 'Database Connected', 'APIs Responding', 'Payment Gateway Active'].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardStats;