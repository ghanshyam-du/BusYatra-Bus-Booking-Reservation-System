import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Ticket, IndianRupee, MapPin,
  Calendar, ArrowRight, CheckCircle, XCircle, Clock,
  RefreshCw, BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Area, AreaChart
} from 'recharts';
import travelerService from '../../services/travelerService';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

/* ─── helpers ────────────────────────────────────────────────────────────── */
const fmtDate = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
};

const STATUS = {
  CONFIRMED: { icon: CheckCircle, dot:'bg-emerald-500', bg:'bg-emerald-50', text:'text-emerald-700', border:'border-emerald-200', label:'Confirmed' },
  CANCELLED: { icon: XCircle,     dot:'bg-red-500',     bg:'bg-red-50',     text:'text-red-700',     border:'border-red-200',     label:'Cancelled' },
  PENDING:   { icon: Clock,       dot:'bg-amber-400',   bg:'bg-amber-50',   text:'text-amber-700',   border:'border-amber-200',   label:'Pending'   },
};
const getStatus = (s) => STATUS[s?.toUpperCase()] || STATUS.PENDING;

/* ─── custom tooltip ─────────────────────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-3 text-xs font-semibold">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
const BookingAnalytics = () => {
  const [stats,          setStats]          = useState(null);
  const [bookings,       setBookings]       = useState([]);
  const [bookingStats,   setBookingStats]   = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [bookingsLoading,setBookingsLoading]= useState(true);
  const [refreshing,     setRefreshing]     = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setRefreshing(true);
    await Promise.allSettled([fetchStats(), fetchRecentBookings()]);
    setRefreshing(false);
  };

  const fetchStats = async () => {
    try {
      const res = await travelerService.getDashboardStats();
      setStats(res.data);
    } catch { toast.error('Failed to load stats'); }
    finally   { setLoading(false); }
  };

  const fetchRecentBookings = async () => {
    try {
      const res = await travelerService.getBookings();
      const all = res.data || [];
      setBookings(all.slice(0, 6));
      setBookingStats(res.stats || null);
    } catch { toast.error('Failed to load bookings'); }
    finally   { setBookingsLoading(false); }
  };

  /* demo chart data — replace with real API data when available */
  const chartData = [
    { name:'Mon', bookings:4,  revenue:2400 },
    { name:'Tue', bookings:3,  revenue:1398 },
    { name:'Wed', bookings:6,  revenue:9800 },
    { name:'Thu', bookings:7,  revenue:3908 },
    { name:'Fri', bookings:12, revenue:4800 },
    { name:'Sat', bookings:18, revenue:8800 },
    { name:'Sun', bookings:15, revenue:7300 },
  ];

  const kpis = [
    { label:'Total Revenue',  value: formatCurrency(stats?.total_revenue || 0),        icon:<IndianRupee className="w-5 h-5"/>, accent:'#f97415', sub:'All confirmed'          },
    { label:'Total Bookings', value: stats?.total_bookings || 0,                        icon:<Ticket className="w-5 h-5"/>,      accent:'#6366f1', sub:'Lifetime count'         },
    { label:'Confirmed',      value: bookingStats?.confirmed ?? stats?.total_bookings ?? '—', icon:<CheckCircle className="w-5 h-5"/>, accent:'#10b981', sub:'Successful trips'  },
    { label:'Active Buses',   value: stats?.total_buses || 0,                           icon:<MapPin className="w-5 h-5"/>,      accent:'#ec4899', sub:'In your fleet'          },
  ];

  /* ── loading skeleton ── */
  if (loading) return (
    <div className="space-y-5 animate-pulse" style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <div className="h-8 w-52 bg-gray-100 rounded-xl"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl"/>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1,2].map(i => <div key={i} className="h-64 bg-gray-100 rounded-2xl"/>)}
      </div>
      <div className="h-64 bg-gray-100 rounded-2xl"/>
    </div>
  );

  return (
    <div className="space-y-5" style={{ fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Booking Analytics</h2>
          <p className="text-gray-400 text-sm mt-0.5">Insights into your fleet's performance</p>
        </div>
        <button onClick={fetchAll} disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-all shadow-sm disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}/> Refresh
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <motion.div key={i} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 relative overflow-hidden hover:shadow-md hover:border-orange-100 transition-all">
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
              style={{ background:`linear-gradient(90deg,${k.accent},transparent)` }}/>
            <div className="p-2 rounded-xl inline-flex mb-3" style={{ background:`${k.accent}15` }}>
              <span style={{ color: k.accent }}>{k.icon}</span>
            </div>
            <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-0.5">{k.label}</p>
            <p className="text-2xl font-black text-gray-900">{k.value}</p>
            <p className="text-[10px] text-gray-400 mt-1">{k.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Weekly Bookings bar chart */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl hidden"/>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-50">
                <BarChart3 className="w-4 h-4 text-orange-500"/>
              </div>
              <h3 className="font-black text-gray-900 text-sm">Weekly Bookings</h3>
            </div>
            <select className="text-[10px] font-bold text-gray-500 border border-gray-200 rounded-lg px-2 py-1 outline-none bg-white hover:border-orange-300 transition-colors cursor-pointer">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false}/>
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fill:'#9ca3af', fontSize:11, fontFamily:"'DM Sans',sans-serif", fontWeight:700 }}/>
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fill:'#9ca3af', fontSize:10, fontFamily:"'DM Sans',sans-serif" }}/>
                <Tooltip content={<ChartTooltip/>}/>
                <Bar dataKey="bookings" name="Bookings" fill="#f97415" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue trend area chart */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50">
                <TrendingUp className="w-4 h-4 text-emerald-500"/>
              </div>
              <h3 className="font-black text-gray-900 text-sm">Revenue Trend</h3>
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
              This Week
            </span>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false}/>
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fill:'#9ca3af', fontSize:11, fontFamily:"'DM Sans',sans-serif", fontWeight:700 }}/>
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fill:'#9ca3af', fontSize:10, fontFamily:"'DM Sans',sans-serif" }}/>
                <Tooltip content={<ChartTooltip/>}/>
                <Area type="monotone" dataKey="revenue" name="Revenue (₹)"
                  stroke="#10b981" strokeWidth={2.5}
                  fill="url(#revGrad)"
                  dot={{ r:4, fill:'#10b981', strokeWidth:2, stroke:'#fff' }}
                  activeDot={{ r:6, fill:'#10b981', stroke:'#fff', strokeWidth:2 }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ── Recent Bookings table ── */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50"><Ticket className="w-4 h-4 text-indigo-500"/></div>
            <h3 className="font-black text-gray-900 text-sm">Recent Bookings</h3>
          </div>
          {bookingStats && (
            <span className="text-[10px] font-black text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
              {bookingStats.total_bookings} total
            </span>
          )}
        </div>

        {bookingsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : bookings.length > 0 ? (
          <>
            {/* table head */}
            <div className="hidden md:grid grid-cols-[1.2fr_1.8fr_1fr_1fr_1fr] gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-100">
              {['Booking Ref', 'Journey', 'Date', 'Amount', 'Status'].map(h => (
                <p key={h} className="text-[9px] uppercase tracking-widest font-black text-gray-400">{h}</p>
              ))}
            </div>

            <div className="divide-y divide-gray-50">
              {bookings.map((b, i) => {
                const sc = getStatus(b.booking_status);
                const Icon = sc.icon;
                return (
                  <motion.div key={b.booking_id || i}
                    initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.05 }}
                    className="grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr_1fr_1fr_1fr] gap-4 items-center px-5 py-3.5 hover:bg-gray-50/50 transition-colors">

                    {/* Ref + seats */}
                    <div>
                      <p className="text-xs font-black text-gray-900">{b.booking_id || b.booking_reference || '—'}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {b.number_of_seats ?? b.seats ?? 1} seat{(b.number_of_seats ?? 1) !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Journey */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      {b.journey ? (
                        <>
                          <span className="text-xs font-bold text-gray-800 truncate">{b.journey.from}</span>
                          <ArrowRight className="w-3 h-3 text-orange-400 flex-shrink-0"/>
                          <span className="text-xs font-bold text-gray-800 truncate">{b.journey.to}</span>
                        </>
                      ) : (b.schedule_id?.from_location || b.from_location) ? (
                        <>
                          <span className="text-xs font-bold text-gray-800 truncate">
                            {b.schedule_id?.from_location || b.from_location}
                          </span>
                          <ArrowRight className="w-3 h-3 text-orange-400 flex-shrink-0"/>
                          <span className="text-xs font-bold text-gray-800 truncate">
                            {b.schedule_id?.to_location || b.to_location}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">Route N/A</span>
                      )}
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-xs text-gray-700 font-semibold">
                        {fmtDate(b.journey?.journey_date || b.booking_date)}
                      </p>
                      {b.journey?.departure_time && (
                        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5"/>{b.journey.departure_time}
                        </p>
                      )}
                    </div>

                    {/* Amount */}
                    <p className="text-sm font-black text-gray-900">{formatCurrency(b.total_amount)}</p>

                    {/* Status */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border w-fit ${sc.bg} ${sc.text} ${sc.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>
                      {sc.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
              <Ticket className="w-7 h-7 text-indigo-400"/>
            </div>
            <h3 className="font-black text-gray-900 mb-1">No bookings yet</h3>
            <p className="text-gray-400 text-sm">Bookings will appear here once customers purchase tickets.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BookingAnalytics;