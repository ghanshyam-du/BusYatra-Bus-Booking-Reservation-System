import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Award, DollarSign, Activity, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

// UI period → backend groupBy param
const PERIOD_TO_GROUP = {
  weekly:  'day',
  monthly: 'week',
  yearly:  'month',
};

// Fixed colours per booking status returned by getBookingStats
const STATUS_COLORS = {
  CONFIRMED: '#10b981',
  PENDING:   '#f97415',
  CANCELLED: '#ef4444',
  COMPLETED: '#6366f1',
};
const FALLBACK_COLORS = ['#f97415', '#10b981', '#6366f1', '#ec4899', '#facc15'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
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
};

const RevenueReports = () => {
  // getRevenueReport  → { success, count, data: [{date, revenue, bookings, seats}] }
  const [revenueData,  setRevenueData]  = useState([]);
  // getTopTravelers   → { success, count, data: [{company_name, total_revenue, total_bookings, total_seats}] }
  const [topTravelers, setTopTravelers] = useState([]);
  // getBookingStats   → { success, data: { by_status: [{_id, count, total_amount}], by_payment: [...] } }
  const [bookingStats, setBookingStats] = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [timeFilter,   setTimeFilter]   = useState('monthly');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [revenueRes, travelersRes, statsRes] = await Promise.all([
        adminService.getRevenueReport({ groupBy: PERIOD_TO_GROUP[timeFilter] }),
        adminService.getTopTravelers(5),
        adminService.getBookingStats(),
      ]);

      setRevenueData(revenueRes.data    || []);
      setTopTravelers(travelersRes.data || []);
      setBookingStats(statsRes.data     || null);
    } catch {
      toast.error('Failed to load revenue reports');
    } finally {
      setLoading(false);
    }
  }, [timeFilter]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Derived KPIs from revenueData ────────────────────────────────────────────
  const totalRevenue    = revenueData.reduce((s, d) => s + (d.revenue  || 0), 0);
  const totalBookings   = revenueData.reduce((s, d) => s + (d.bookings || 0), 0);
  const totalSeats      = revenueData.reduce((s, d) => s + (d.seats    || 0), 0);
  const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
  const topTraveler     = topTravelers[0] || null;

  // Area chart: backend returns { date, revenue } — rename date → name for XAxis
  const chartData = revenueData.map((d) => ({ name: d.date, revenue: d.revenue }));

  // Pie chart: by_status from getBookingStats, keyed by total_amount
  const pieData = (bookingStats?.by_status || []).map((s) => ({
    name:  s._id,
    value: s.total_amount,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-[3px] border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Revenue <span className="text-orange-500">Analytics</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">Financial performance and growth metrics</p>
        </div>
        <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm inline-flex">
          {['weekly', 'monthly', 'yearly'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeFilter(period)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                timeFilter === period
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Revenue — sum of revenueData[].revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="p-3 bg-emerald-100 rounded-xl w-fit mb-4">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Revenue</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalRevenue)}</h3>
        </motion.div>

        {/* Avg Booking Value — totalRevenue / totalBookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg flex items-center gap-1 border border-blue-200">
              <Activity className="w-3 h-3" /> {totalBookings} bookings
            </span>
          </div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Avg. Booking Value</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(avgBookingValue)}</h3>
        </motion.div>

        {/* Top Performer — topTravelers[0] from getTopTravelers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4">
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Top Performer</p>
          <h3 className="text-base font-bold text-gray-900 mt-1 truncate">
            {topTraveler?.company_name || 'N/A'}
          </h3>
          {topTraveler && (
            <p className="text-xs text-gray-400 mt-0.5">
              {formatCurrency(topTraveler.total_revenue)} · {topTraveler.total_bookings} bookings
            </p>
          )}
        </motion.div>

        {/* Total Seats — sum of revenueData[].seats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="p-3 bg-orange-100 rounded-xl w-fit mb-4">
            <Ticket className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Seats Sold</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalSeats.toLocaleString()}</h3>
        </motion.div>

      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Revenue Trend — chartData from getRevenueReport */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <h3 className="text-base font-bold text-gray-900 mb-6">Revenue Trend</h3>
          {chartData.length > 0 ? (
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
                  <XAxis
                    dataKey="name" axisLine={false} tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone" dataKey="revenue" name="Revenue"
                    stroke="#f97415" strokeWidth={2.5}
                    fillOpacity={1} fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
              No revenue data for this period
            </div>
          )}
        </motion.div>

        {/* Booking Status Distribution — pieData from getBookingStats → by_status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
        >
          <h3 className="text-base font-bold text-gray-900 mb-6">Booking Status Distribution</h3>
          {pieData.length > 0 ? (
            <>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData} cx="50%" cy="50%"
                      innerRadius={60} outerRadius={100}
                      paddingAngle={5} dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={STATUS_COLORS[entry.name] || FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2 flex-wrap">
                {pieData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: STATUS_COLORS[entry.name] || FALLBACK_COLORS[i % FALLBACK_COLORS.length]
                      }}
                    />
                    <span className="text-xs text-gray-600 font-medium">{entry.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
              No booking stats available
            </div>
          )}
        </motion.div>

      </div>

      {/* ── Top Travelers Table — from getTopTravelers ── */}
      {topTravelers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Top Travelers by Revenue</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {['#', 'Company', 'Total Revenue', 'Bookings', 'Seats Sold'].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topTravelers.map((t, i) => (
                  <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-400 font-medium">{i + 1}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{t.company_name}</td>
                    <td className="px-6 py-4 text-emerald-600 font-bold">{formatCurrency(t.total_revenue)}</td>
                    <td className="px-6 py-4 text-gray-600">{t.total_bookings.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600">{t.total_seats.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default RevenueReports;