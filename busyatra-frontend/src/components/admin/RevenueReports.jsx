import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Award, BarChart3, ArrowDown, ArrowUp, DollarSign, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const RevenueReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('monthly');

  useEffect(() => {
    fetchReports();
  }, [timeFilter]);

  const fetchReports = async () => {
    try {
      const response = await adminService.getRevenueReports({ period: timeFilter });
      setReports(response.data);
    } catch (error) {
      toast.error('Failed to load revenue reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = reports?.chartData || [
    { name: 'Jan', revenue: 4000, profit: 2400 },
    { name: 'Feb', revenue: 3000, profit: 1398 },
    { name: 'Mar', revenue: 2000, profit: 9800 },
    { name: 'Apr', revenue: 2780, profit: 3908 },
    { name: 'May', revenue: 1890, profit: 4800 },
    { name: 'Jun', revenue: 2390, profit: 3800 },
  ];

  const pieData = [
    { name: 'Bus Tickets', value: 400 },
    { name: 'Commission',  value: 300 },
    { name: 'Ads',         value: 300 },
    { name: 'Other',       value: 200 },
  ];
  const COLORS = ['#f97415', '#10b981', '#6366f1', '#ec4899'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3">
          <p className="text-xs font-bold text-gray-600 mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
              {p.name}: {formatCurrency(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Revenue <span className="text-orange-500">Analytics</span></h2>
          <p className="text-gray-500 text-sm mt-1">Financial performance and growth metrics</p>
        </div>
        <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm inline-flex">
          {['weekly', 'monthly', 'yearly'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeFilter(period)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${timeFilter === period
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'text-gray-500 hover:text-gray-800'
                }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg flex items-center gap-1 border border-emerald-200">
              <ArrowUp className="w-3 h-3" /> +12.5%
            </span>
          </div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Revenue</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(reports?.total_revenue || 0)}</h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg flex items-center gap-1 border border-blue-200">
              <Activity className="w-3 h-3" /> Stable
            </span>
          </div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Avg. Booking Value</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(reports?.avg_booking_value || 0)}</h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Top Performer</p>
          <h3 className="text-base font-bold text-gray-900 mt-1 truncate">{reports?.top_traveler?.company_name || 'N/A'}</h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-lg flex items-center gap-1 border border-red-200">
              <ArrowDown className="w-3 h-3" /> -2.4%
            </span>
          </div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Conversion Rate</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">3.2%</h3>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-6">Revenue Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f97415" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f97415" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#f97415" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-6">Revenue Distribution</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                  paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2 flex-wrap">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-gray-600 font-medium">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RevenueReports;