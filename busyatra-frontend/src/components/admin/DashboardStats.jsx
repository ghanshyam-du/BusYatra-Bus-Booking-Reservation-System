import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users, Bus, Ticket, TrendingUp, AlertCircle, UserCheck,
  IndianRupee, Calendar, ArrowUpRight, Activity, Award,
  CheckCircle2, Clock, XCircle, RefreshCw, Percent,
  ChevronRight, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

/* ─── helpers ────────────────────────────────────────────────────────────── */
const fmt  = (n) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M`
           : n >= 1_000 ? `${(n/1_000).toFixed(1)}K` : String(n ?? 0);

const STATUS_COLORS  = { CONFIRMED:'#10b981', PENDING:'#f97415', CANCELLED:'#ef4444', COMPLETED:'#6366f1' };
const PAYMENT_COLORS = { PAID:'#10b981', UNPAID:'#f97415', REFUNDED:'#ef4444' };
const TICKET_BADGE   = {
  open:        { bg:'bg-red-50',    text:'text-red-600',    border:'border-red-100'    },
  in_progress: { bg:'bg-amber-50',  text:'text-amber-600',  border:'border-amber-100'  },
  resolved:    { bg:'bg-emerald-50',text:'text-emerald-600',border:'border-emerald-100'},
};

/* ─── mini area sparkline ────────────────────────────────────────────────── */
const Spark = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={44}>
    <AreaChart data={data} margin={{ top:2, right:0, left:0, bottom:0 }}>
      <defs>
        <linearGradient id={`sg${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%"  stopColor={color} stopOpacity={0.18}/>
          <stop offset="95%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.8}
        fill={`url(#sg${color.replace('#','')})`} dot={false}/>
    </AreaChart>
  </ResponsiveContainer>
);

/* ─── custom chart tooltip ───────────────────────────────────────────────── */
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-3 min-w-[130px]">
      <p className="text-[10px] font-bold text-orange-500 mb-1.5 uppercase tracking-widest">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-gray-500">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }}/>
            {p.name}
          </span>
          <span className="font-bold text-gray-800">
            {p.name === 'Bookings' ? p.value?.toLocaleString() : formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */
const DashboardStats = () => {
  const [stats,        setStats]        = useState(null);
  const [topTravelers, setTopTravelers] = useState([]);
  const [bookingStats, setBookingStats] = useState(null);
  const [revenueData,  setRevenueData]  = useState([]);
  const [tickets,      setTickets]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);

  /* ── fetch all APIs in parallel ── */
  const fetchAll = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const [dashRes, travRes, bkRes, revRes, tickRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getTopTravelers(5),
        adminService.getBookingStats(),
        adminService.getRevenueReport({ groupBy: 'day' }),
        adminService.getTickets({ status: 'open', limit: 5 }),
      ]);

      setStats(dashRes.data         || dashRes);
      setTopTravelers(travRes.data   || []);
      setBookingStats(bkRes.data     || null);
      setRevenueData(revRes.data     || []);
      setTickets(tickRes.data        || []);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── derived numbers ── */
  const derived = useMemo(() => {
    const totalRev     = stats?.revenue || 0;
    const confBk       = stats?.confirmed_bookings || 0;
    const totalBk      = stats?.bookings || 0;
    const avgPerBk     = confBk > 0 ? totalRev / confBk : 0;
    const confRate     = totalBk > 0 ? ((confBk / totalBk) * 100).toFixed(1) : 0;

    const statusPie    = (bookingStats?.by_status  || []).map(s => ({ name:s._id, value:s.total_amount, count:s.count }));
    const paymentPie   = (bookingStats?.by_payment || []).map(s => ({ name:s._id, value:s.total_amount, count:s.count }));

    const chartData    = revenueData.slice(-14).map(d => ({ name: d.date, Revenue: d.revenue, Bookings: d.bookings }));
    const revSpark     = revenueData.slice(-10).map(d => ({ v: d.revenue || 0 }));

    const grandTravRev = topTravelers.reduce((s,t) => s + t.total_revenue, 0);
    const travelers    = topTravelers.map(t => ({
      ...t,
      share: grandTravRev > 0 ? ((t.total_revenue / grandTravRev)*100).toFixed(1) : 0,
    }));

    return { avgPerBk, confRate, statusPie, paymentPie, chartData, revSpark, travelers };
  }, [stats, bookingStats, revenueData, topTravelers]);

  /* ── loading ── */
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-3 bg-gray-50">
      <div className="w-11 h-11 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"/>
      <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Loading dashboard…</p>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5" style={{ fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-orange-500 text-[10px] uppercase tracking-[0.25em] font-bold mb-0.5">
            Admin · Control Centre
          </p>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Dashboard{' '}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage:'linear-gradient(90deg,#f97415,#fb923c)' }}>
              Overview
            </span>
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">All system metrics in one place</p>
        </div>
        <button onClick={() => fetchAll(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-xs font-bold text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-all"
          style={{ color: refreshing ? '#f97415' : undefined }}>
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}/>
          Refresh
        </button>
      </div>

      {/* ── Alert Banners ── */}
      <AnimatePresence>
        {(stats?.pending_approvals > 0 || stats?.pending_tickets > 0) && (
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats?.pending_approvals > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4.5 h-4.5 text-red-600"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-red-700 text-sm">{stats.pending_approvals} Pending Traveler Approvals</p>
                  <p className="text-red-400 text-xs">Review and approve new applications</p>
                </div>
                <a href="/admin/travelers" className="flex-shrink-0 text-red-500 hover:text-red-700">
                  <ChevronRight className="w-4 h-4"/>
                </a>
              </div>
            )}
            {stats?.pending_tickets > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4.5 h-4.5 text-amber-600"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-amber-700 text-sm">{stats.pending_tickets} Open Support Tickets</p>
                  <p className="text-amber-400 text-xs">Customer requests need attention</p>
                </div>
                <a href="/admin/tickets" className="flex-shrink-0 text-amber-500 hover:text-amber-700">
                  <ChevronRight className="w-4 h-4"/>
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 8 KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label:'Total Users', value: fmt(stats?.users),
            sub: 'Registered accounts',
            icon:<Users className="w-4 h-4"/>, accent:'#3b82f6', bg:'bg-blue-50',
            spark: null,
          },
          {
            label:'Active Travelers', value: fmt(stats?.travelers),
            sub: `${stats?.pending_approvals || 0} pending approval`,
            icon:<UserCheck className="w-4 h-4"/>, accent:'#10b981', bg:'bg-emerald-50',
            spark: null,
          },
          {
            label:'Active Buses', value: fmt(stats?.buses),
            sub: 'On platform',
            icon:<Bus className="w-4 h-4"/>, accent:'#8b5cf6', bg:'bg-violet-50',
            spark: null,
          },
          {
            label:'Total Bookings', value: fmt(stats?.bookings),
            sub: `${derived.confRate}% confirmed`,
            icon:<Ticket className="w-4 h-4"/>, accent:'#f97415', bg:'bg-orange-50',
            spark: null,
          },
          {
            label:'Total Revenue', value: formatCurrency(stats?.revenue || 0),
            sub: `Avg ${formatCurrency(derived.avgPerBk)} / booking`,
            icon:<IndianRupee className="w-4 h-4"/>, accent:'#ec4899', bg:'bg-pink-50',
            spark: derived.revSpark, large: true,
          },
          {
            label:'Confirmed Bookings', value: fmt(stats?.confirmed_bookings),
            sub: `${derived.confRate}% of total`,
            icon:<TrendingUp className="w-4 h-4"/>, accent:'#14b8a6', bg:'bg-teal-50',
            spark: null,
          },
          {
            label:'Last 7 Days', value: fmt(stats?.recent_bookings),
            sub: 'Recent bookings',
            icon:<Calendar className="w-4 h-4"/>, accent:'#6366f1', bg:'bg-indigo-50',
            spark: null,
          },
          {
            label:'Pending Approvals', value: fmt(stats?.pending_approvals),
            sub: 'Awaiting review',
            icon:<Clock className="w-4 h-4"/>, accent:'#ef4444', bg:'bg-red-50',
            alert: stats?.pending_approvals > 0,
          },
        ].map((card, i) => (
          <motion.div key={i}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
            className={`bg-white rounded-2xl p-4 border shadow-sm hover:shadow-md transition-all group relative overflow-hidden ${
              card.alert ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-100'
            }`}>
            {/* top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
              style={{ background:`linear-gradient(90deg,${card.accent},transparent)` }}/>

            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 rounded-xl ${card.bg}`}>
                <span style={{ color: card.accent }}>{card.icon}</span>
              </div>
              {card.alert && stats?.pending_approvals > 0 && (
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"/>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"/>
                </span>
              )}
            </div>
            <p className="text-gray-400 text-[9px] uppercase tracking-widest font-bold mb-0.5">{card.label}</p>
            <p className={`font-black text-gray-900 ${card.large ? 'text-lg' : 'text-2xl'}`}>{card.value}</p>
            <p className="text-gray-400 text-[10px] mt-0.5">{card.sub}</p>
            {card.spark && card.spark.length > 1 && (
              <div className="mt-2">
                <Spark data={card.spark} color={card.accent}/>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Revenue Trend Chart (full width) ── */}
      {derived.chartData.length > 0 && (
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-gray-900 font-black text-sm">Revenue Trend</h3>
              <p className="text-gray-400 text-[10px]">Last 14 days · daily revenue</p>
            </div>
            <a href="/admin/reports"
              className="flex items-center gap-1 text-[10px] font-bold text-orange-500 hover:text-orange-600 transition-colors">
              Full Report <ArrowUpRight className="w-3 h-3"/>
            </a>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={derived.chartData} margin={{ top:4, right:4, left:0, bottom:0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f97415" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f97415" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false}/>
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fill:'#9ca3af', fontSize:9 }} interval="preserveStartEnd"/>
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fill:'#9ca3af', fontSize:9 }} tickFormatter={v => fmt(v)}/>
                <Tooltip content={<ChartTip/>}/>
                <Area type="monotone" dataKey="Revenue" name="Revenue"
                  stroke="#f97415" strokeWidth={2}
                  fillOpacity={1} fill="url(#revGrad)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* ── 3-column row: Booking Breakdown | Top Travelers | Open Tickets ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Booking Status Breakdown */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-gray-900 font-black text-sm mb-0.5">Booking Breakdown</h3>
          <p className="text-gray-400 text-[10px] mb-4">Status & payment distribution</p>

          {/* Booking status rows */}
          <div className="space-y-2.5 mb-4">
            {(bookingStats?.by_status || []).map((s, i) => {
              const total = (bookingStats?.by_status||[]).reduce((a,x)=>a+x.count,0);
              const pct   = total > 0 ? ((s.count/total)*100).toFixed(0) : 0;
              const color = STATUS_COLORS[s._id] || '#9ca3af';
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-600">
                      <span className="w-2 h-2 rounded-full" style={{ background:color }}/>
                      {s._id}
                    </span>
                    <span className="text-[10px] font-black text-gray-700">{s.count.toLocaleString()} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width:`${pct}%`, background:color }}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-50 pt-3 mt-1">
            <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-2">Payment Status</p>
            <div className="flex flex-wrap gap-2">
              {(bookingStats?.by_payment || []).map((p, i) => {
                const color = PAYMENT_COLORS[p._id] || '#9ca3af';
                return (
                  <div key={i} className="flex-1 min-w-[80px] rounded-xl p-2.5"
                    style={{ background:`${color}10`, border:`1px solid ${color}25` }}>
                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color }}>{p._id}</p>
                    <p className="text-sm font-black text-gray-800 mt-0.5">{p.count}</p>
                    <p className="text-[9px] text-gray-400">{formatCurrency(p.total_amount)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Top Travelers */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-gray-900 font-black text-sm">Top Travelers</h3>
              <p className="text-gray-400 text-[10px]">By revenue contribution</p>
            </div>
            <Award className="w-4 h-4 text-orange-400"/>
          </div>

          <div className="space-y-2.5">
            {derived.travelers.length > 0 ? derived.travelers.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                {/* rank */}
                <span className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black"
                  style={
                    i===0 ? { background:'#f97415', color:'#fff' }
                  : i===1 ? { background:'#e5e7eb', color:'#6b7280' }
                  : i===2 ? { background:'#fef3c7', color:'#d97706' }
                  : { background:'#f9fafb', color:'#d1d5db' }
                  }>{i+1}</span>
                {/* name + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-bold text-gray-700 truncate pr-2">{t.company_name}</p>
                    <p className="text-[10px] font-black text-orange-500 flex-shrink-0">{t.share}%</p>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-orange-400 transition-all duration-700"
                      style={{ width:`${t.share}%` }}/>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-0.5">{formatCurrency(t.total_revenue)} · {t.total_bookings} bookings</p>
                </div>
              </div>
            )) : (
              <div className="flex items-center justify-center h-24 text-gray-300 text-xs">No data</div>
            )}
          </div>

          <a href="/admin/reports"
            className="mt-4 flex items-center justify-center gap-1 w-full py-2 rounded-xl border border-gray-100 text-[10px] font-bold text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all">
            View Full Leaderboard <ArrowUpRight className="w-3 h-3"/>
          </a>
        </motion.div>

        {/* Open Tickets */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-gray-900 font-black text-sm">Open Tickets</h3>
              <p className="text-gray-400 text-[10px]">Recent support requests</p>
            </div>
            <span className="text-[10px] font-black text-red-500 bg-red-50 border border-red-100 px-2 py-1 rounded-full">
              {stats?.pending_tickets || tickets.length} open
            </span>
          </div>

          <div className="space-y-2">
            {tickets.length > 0 ? tickets.slice(0,5).map((ticket, i) => {
              const badge = TICKET_BADGE[ticket.status] || TICKET_BADGE['open'];
              return (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Ticket className="w-3.5 h-3.5 text-orange-500"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{ticket.subject || ticket.title || `Ticket #${ticket._id?.slice(-4)}`}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badge.bg} ${badge.text} border ${badge.border}`}>
                        {ticket.status?.replace('_',' ')}
                      </span>
                      <span className="text-[9px] text-gray-400">{ticket.category || 'General'}</span>
                    </div>
                  </div>
                  <a href={`/admin/tickets/${ticket._id}`}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-orange-500 transition-all flex-shrink-0">
                    <ChevronRight className="w-3.5 h-3.5"/>
                  </a>
                </div>
              );
            }) : (
              <div className="flex flex-col items-center justify-center h-24 gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-300"/>
                <p className="text-gray-300 text-xs">No open tickets</p>
              </div>
            )}
          </div>

          <a href="/admin/tickets"
            className="mt-3 flex items-center justify-center gap-1 w-full py-2 rounded-xl border border-gray-100 text-[10px] font-bold text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all">
            View All Tickets <ArrowUpRight className="w-3 h-3"/>
          </a>
        </motion.div>

      </div>

      {/* ── Bottom row: Revenue Insights | Quick Actions | System Health ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue Insights */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-pink-50">
              <IndianRupee className="w-4 h-4 text-pink-500"/>
            </div>
            <div>
              <h3 className="text-gray-900 font-black text-sm leading-tight">Revenue Insights</h3>
              <p className="text-gray-400 text-[10px]">Platform earnings overview</p>
            </div>
          </div>
          <div className="space-y-0">
            {[
              { label:'Total Revenue',       val: formatCurrency(stats?.revenue || 0), highlight:true },
              { label:'Avg / Booking',        val: formatCurrency(derived.avgPerBk) },
              { label:'Confirmed Bookings',   val: (stats?.confirmed_bookings || 0).toLocaleString() },
              { label:'Confirmation Rate',    val: `${derived.confRate}%` },
              { label:'Recent (7 days)',       val: (stats?.recent_bookings || 0).toLocaleString() + ' bookings' },
            ].map((row, i) => (
              <div key={i} className={`flex justify-between items-center py-2.5 ${i < 4 ? 'border-b border-gray-50' : ''}`}>
                <span className="text-xs text-gray-500">{row.label}</span>
                <span className={`text-xs font-black ${row.highlight ? 'text-orange-500' : 'text-gray-800'}`}>{row.val}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.55 }}
          className="rounded-2xl p-5 shadow-sm"
          style={{ background:'linear-gradient(135deg,#f97415 0%,#ea580c 100%)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-orange-200"/>
            <h3 className="font-black text-white text-sm">Quick Actions</h3>
          </div>
          <p className="text-orange-200 text-[10px] mb-4">Manage your platform efficiently</p>
          <div className="space-y-2">
            {[
              { label:'Onboard New Traveler', href:'/admin/travelers/onboard' },
              { label:'View Support Tickets', href:'/admin/tickets' },
              { label:'Revenue Reports',       href:'/admin/reports' },
              { label:'Manage Users',          href:'/admin/users' },
              { label:'Manage Buses',          href:'/admin/buses' },
            ].map((action, i) => (
              <a key={i} href={action.href}
                className="flex items-center justify-between py-2 px-3.5 bg-white/15 hover:bg-white/25 rounded-xl transition-all text-xs text-white font-semibold group">
                {action.label}
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity"/>
              </a>
            ))}
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-emerald-50">
              <Activity className="w-4 h-4 text-emerald-500"/>
            </div>
            <div>
              <h3 className="text-gray-900 font-black text-sm leading-tight">System Health</h3>
              <p className="text-gray-400 text-[10px]">Live platform status</p>
            </div>
          </div>

          {/* health bars */}
          <div className="space-y-3 mb-4">
            {[
              { label:'API Response',     pct:98, color:'#10b981' },
              { label:'Database',         pct:100,color:'#10b981' },
              { label:'Payment Gateway',  pct:95, color:'#10b981' },
              { label:'Booking Engine',   pct:99, color:'#10b981' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold text-gray-600">{item.label}</span>
                  <span className="text-[10px] font-black" style={{ color:item.color }}>{item.pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    initial={{ width:0 }} animate={{ width:`${item.pct}%` }} transition={{ delay:0.6+i*0.1, duration:0.7 }}
                    style={{ background:item.color }}/>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"/>
            <span className="text-[10px] font-bold text-emerald-600">All Systems Operational</span>
          </div>
        </motion.div>

      </div>

    </div>
  );
};

export default DashboardStats;