
import React, { useState, useEffect } from 'react';
import { Users, Bus, Ticket, TrendingUp, AlertCircle, UserCheck, IndianRupee, Calendar } from 'lucide-react';
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
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Travelers',
      value: stats?.travelers || 0,
      icon: UserCheck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Active Buses',
      value: stats?.buses || 0,
      icon: Bus,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Bookings',
      value: stats?.bookings || 0,
      icon: Ticket,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.revenue || 0),
      icon: IndianRupee,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      isLarge: true
    },
    {
      title: 'Confirmed Bookings',
      value: stats?.confirmed_bookings || 0,
      icon: TrendingUp,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    },
    {
      title: 'Recent Bookings (7 days)',
      value: stats?.recent_bookings || 0,
      icon: Calendar,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Pending Approvals',
      value: stats?.pending_approvals || 0,
      icon: AlertCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      alert: stats?.pending_approvals > 0
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h2>
        <p className="text-gray-600 mt-2">System overview and key metrics</p>
      </div>

      {/* Alert Cards */}
      {(stats?.pending_approvals > 0 || stats?.pending_tickets > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {stats?.pending_approvals > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <h4 className="font-bold text-red-900">{stats.pending_approvals} Pending Traveler Approvals</h4>
                  <p className="text-sm text-red-700">Review and approve new traveler applications</p>
                </div>
              </div>
            </div>
          )}
          {stats?.pending_tickets > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <div>
                  <h4 className="font-bold text-yellow-900">{stats.pending_tickets} Open Support Tickets</h4>
                  <p className="text-sm text-yellow-700">Address customer support requests</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition ${
              stat.alert ? 'ring-2 ring-red-500 animate-pulse' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              {stat.alert && <AlertCircle className="w-5 h-5 text-red-500" />}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.title}</h3>
            <p className={`${stat.isLarge ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="font-bold text-lg mb-2">Quick Actions</h3>
          <p className="text-purple-100 text-sm mb-4">Manage your platform efficiently</p>
          <div className="space-y-2">
            <a href="/admin/travelers/onboard" className="block py-2 px-4 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm">
              Onboard New Traveler
            </a>
            <a href="/admin/tickets" className="block py-2 px-4 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm">
              View Support Tickets
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h3 className="font-bold text-lg mb-2">Revenue Insights</h3>
          <p className="text-blue-100 text-sm mb-4">Platform earnings overview</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-100">Total Revenue:</span>
              <span className="font-bold">{formatCurrency(stats?.revenue || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-100">Avg per Booking:</span>
              <span className="font-bold">
                {stats?.confirmed_bookings > 0 
                  ? formatCurrency((stats.revenue / stats.confirmed_bookings).toFixed(2))
                  : formatCurrency(0)
                }
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <h3 className="font-bold text-lg mb-2">System Health</h3>
          <p className="text-green-100 text-sm mb-4">Platform status</p>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm">All Systems Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm">Database Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm">APIs Responding</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;