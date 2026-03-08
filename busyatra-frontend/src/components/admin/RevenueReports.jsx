import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TrendingUp, DollarSign, Activity, Ticket, Percent,
         ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Line,
} from 'recharts';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

/* ─── constants ─────────────────────────────────────────────────────────── */
const PERIOD_TO_GROUP = { weekly: 'day', monthly: 'week', yearly: 'month' };
const STATUS_COLORS   = { CONFIRMED:'#10b981', PENDING:'#f97415', CANCELLED:'#ef4444', COMPLETED:'#6366f1' };
const PAYMENT_COLORS  = { PAID:'#10b981', UNPAID:'#f97415', REFUNDED:'#ef4444' };
const FALLBACK        = ['#f97415','#10b981','#6366f1','#ec4899','#facc15'];

/* ─── helpers ────────────────────────────────────────────────────────────── */
const pct = (a, b) => (b === 0 ? 0 : (((a - b) / b) * 100).toFixed(1));
const fmt = (n) => n >= 1_000_000 ? `${(n/1_000_000).toFixed(1)}M`
          : n >= 1_000 ? `${(n/1_000).toFixed(1)}K` : String(n);

/* ─── custom tooltip ─────────────────────────────────────────────────────── */
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-3 min-w-[150px]">
      <p className="text-[10px] font-bold text-orange-500 mb-2 uppercase tracking-widest">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }}/>
            <span className="text-gray-500">{p.name}</span>
          </span>
          <span className="font-bold text-gray-800">
            {p.name === 'Bookings' ? p.value?.toLocaleString() : formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─── mini sparkline ─────────────────────────────────────────────────────── */
const Spark = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={36}>
    <AreaChart data={data} margin={{ top:2, right:0, left:0, bottom:0 }}>
      <defs>
        <linearGradient id={`sg${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%"  stopColor={color} stopOpacity={0.2}/>
          <stop offset="95%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5}
        fill={`url(#sg${color.replace('#','')})`} dot={false}/>
    </AreaChart>
  </ResponsiveContainer>
);

/* ═══════════════════════════════════════════════════════════════════════════ */
const RevenueReports = () => {
  const [revenueData,  setRevenueData]  = useState([]);
  const [topTravelers, setTopTravelers] = useState([]);
  const [bookingStats, setBookingStats] = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [timeFilter,   setTimeFilter]   = useState('monthly');
  const [activeTab,    setActiveTab]    = useState('overview');

  /* ── fetch all 3 APIs in parallel ── */
  const fetchAll = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const [rev, trav, stats] = await Promise.all([
        adminService.getRevenueReport({ groupBy: PERIOD_TO_GROUP[timeFilter] }),
        adminService.getTopTravelers(10),
        adminService.getBookingStats(),
      ]);
      setRevenueData(rev.data    || []);
      setTopTravelers(trav.data  || []);
      setBookingStats(stats.data || null);
    } catch {
      toast.error('Failed to load revenue reports');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeFilter]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── computed analytics ── */
  const analytics = useMemo(() => {
    const h   = Math.floor(revenueData.length / 2);
    const cur = revenueData.slice(h);
    const prv = revenueData.slice(0, h);

    const totalRev   = revenueData.reduce((s,d) => s + (d.revenue||0), 0);
    const totalBk    = revenueData.reduce((s,d) => s + (d.bookings||0), 0);
    const totalSeats = revenueData.reduce((s,d) => s + (d.seats||0), 0);
    const curRev     = cur.reduce((s,d) => s + (d.revenue||0), 0);
    const prvRev     = prv.reduce((s,d) => s + (d.revenue||0), 0);
    const curBk      = cur.reduce((s,d) => s + (d.bookings||0), 0);
    const prvBk      = prv.reduce((s,d) => s + (d.bookings||0), 0);

    const avgBkVal   = totalBk > 0    ? totalRev / totalBk    : 0;
    const revPerSeat = totalSeats > 0 ? totalRev / totalSeats : 0;
    const velocity   = revenueData.length > 0 ? totalRev / revenueData.length : 0;

    const allBk      = (bookingStats?.by_status||[]).reduce((s,x) => s+x.count, 0);
    const confCount  = (bookingStats?.by_status||[]).find(s => s._id==='CONFIRMED')?.count || 0;
    const confRate   = allBk > 0 ? ((confCount/allBk)*100).toFixed(1) : 0;
    const totalPaid  = (bookingStats?.by_payment||[]).find(p => p._id==='PAID')?.total_amount || 0;

    const grandRev   = topTravelers.reduce((s,t) => s + t.total_revenue, 0);
    const travelersWithShare = topTravelers.map(t => ({
      ...t,
      share:   grandRev > 0 ? ((t.total_revenue/grandRev)*100).toFixed(1) : 0,
      revPerBk: t.total_bookings > 0 ? (t.total_revenue/t.total_bookings) : 0,
    }));

    return {
      totalRev, totalBk, totalSeats, avgBkVal, revPerSeat, velocity,
      confRate, totalPaid, travelersWithShare,
      topTraveler:  travelersWithShare[0] || null,
      revGrowth:    Number(pct(curRev, prvRev)),
      bkGrowth:     Number(pct(curBk,  prvBk)),
      revSpark:     revenueData.map(d => ({ v: d.revenue||0 })),
      bkSpark:      revenueData.map(d => ({ v: d.bookings||0 })),
    };
  }, [revenueData, topTravelers, bookingStats]);

  const chartData  = revenueData.map(d => ({ name:d.date, revenue:d.revenue, bookings:d.bookings }));
  const statusPie  = (bookingStats?.by_status  || []).map(s => ({ name:s._id, value:s.total_amount, count:s.count }));
  const paymentPie = (bookingStats?.by_payment || []).map(s => ({ name:s._id, value:s.total_amount, count:s.count }));

  /* ── loading ── */
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-4 bg-gray-50">
      <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"/>
      <p className="text-orange-500 text-[10px] uppercase tracking-[0.2em] font-bold">Loading Analytics…</p>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5" style={{ fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-orange-500 text-[10px] uppercase tracking-[0.25em] font-bold mb-1">
            Admin · Financial Intelligence
          </p>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Revenue{' '}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage:'linear-gradient(90deg,#f97415,#fb923c)' }}>
              Analytics
            </span>
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">Period-over-period performance & growth intelligence</p>
        </div>

        <div className="flex items-center gap-3">
          {/* period selector */}
          <div className="flex bg-white border border-gray-200 p-1 rounded-xl gap-1 shadow-sm">
            {['weekly','monthly','yearly'].map(p => (
              <button key={p} onClick={() => setTimeFilter(p)}
                className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200"
                style={timeFilter === p
                  ? { background:'linear-gradient(135deg,#f97415,#ea580c)', color:'#fff', boxShadow:'0 2px 10px rgba(249,116,21,0.35)' }
                  : { color:'#9ca3af' }}>
                {p}
              </button>
            ))}
          </div>
          {/* refresh */}
          <button onClick={() => fetchAll(true)}
            className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-sm transition-colors hover:border-orange-300"
            style={{ color: refreshing ? '#f97415' : '#9ca3af' }}>
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}/>
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex gap-1 p-1 rounded-xl w-fit bg-white border border-gray-200 shadow-sm">
        {[['overview','Overview'],['traveler','Top Travelers']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className="px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200"
            style={activeTab === key
              ? { background:'rgba(249,116,21,0.1)', color:'#f97415', border:'1px solid rgba(249,116,21,0.25)' }
              : { color:'#9ca3af' }}>
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ════════════ OVERVIEW ════════════ */}
        {activeTab === 'overview' && (
          <motion.div key="ov" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            className="space-y-5">

            {/* ── 4 KPI Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label:'Total Revenue', value: formatCurrency(analytics.totalRev),
                  badge: `${analytics.revGrowth >= 0 ? '+' : ''}${analytics.revGrowth}% vs prev`,
                  positive: analytics.revGrowth >= 0,
                  icon: <DollarSign className="w-4 h-4"/>, accent:'#10b981',
                  bg:'bg-emerald-50', spark: analytics.revSpark,
                },
                {
                  label:'Avg Booking Value', value: formatCurrency(analytics.avgBkVal),
                  badge: `${analytics.totalBk.toLocaleString()} bookings`,
                  positive: true,
                  icon: <TrendingUp className="w-4 h-4"/>, accent:'#6366f1',
                  bg:'bg-indigo-50', spark: analytics.bkSpark,
                },
                {
                  label:'Revenue / Seat', value: formatCurrency(analytics.revPerSeat),
                  badge: `${analytics.totalSeats.toLocaleString()} seats`,
                  positive: true,
                  icon: <Ticket className="w-4 h-4"/>, accent:'#f97415',
                  bg:'bg-orange-50', spark: analytics.revSpark,
                },
                {
                  label:'Confirmation Rate', value: `${analytics.confRate}%`,
                  badge: `${analytics.bkGrowth >= 0 ? '+' : ''}${analytics.bkGrowth}% bookings`,
                  positive: analytics.confRate >= 70,
                  icon: <Percent className="w-4 h-4"/>,
                  accent: analytics.confRate >= 70 ? '#10b981' : '#ef4444',
                  bg: analytics.confRate >= 70 ? 'bg-emerald-50' : 'bg-red-50',
                  spark: analytics.bkSpark,
                },
              ].map((kpi, i) => (
                <motion.div key={kpi.label}
                  initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                  className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">

                  {/* subtle top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                    style={{ background: `linear-gradient(90deg,${kpi.accent},transparent)` }}/>

                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                      <span style={{ color: kpi.accent }}>{kpi.icon}</span>
                    </div>
                    <span className={`flex items-center gap-0.5 text-[9px] font-bold px-2 py-1 rounded-full ${
                      kpi.positive
                        ? 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                        : 'text-red-500 bg-red-50 border border-red-100'
                    }`}>
                      {kpi.positive
                        ? <ArrowUpRight className="w-3 h-3"/>
                        : <ArrowDownRight className="w-3 h-3"/>}
                      {kpi.badge}
                    </span>
                  </div>

                  <p className="text-gray-400 text-[9px] uppercase tracking-widest font-bold mb-1">{kpi.label}</p>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">{kpi.value}</h3>
                  {kpi.spark.length > 1 && <Spark data={kpi.spark} color={kpi.accent}/>}
                </motion.div>
              ))}
            </div>

            {/* ── Revenue Pulse Banner ── */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
              className="bg-white rounded-2xl border border-orange-100 shadow-sm px-5 py-4 flex flex-wrap items-center gap-6"
              style={{ background:'linear-gradient(135deg,rgba(249,116,21,0.04),#fff)' }}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-100">
                  <Activity className="w-3.5 h-3.5 text-orange-500"/>
                </div>
                <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Revenue Pulse</span>
              </div>
              {[
                { label:'Velocity / Period', val: formatCurrency(analytics.velocity) },
                { label:'Paid Revenue',       val: formatCurrency(analytics.totalPaid) },
                { label:'Booking Δ',          val: `${analytics.bkGrowth >= 0?'+':''}${analytics.bkGrowth}%` },
                { label:'Top Company',        val: analytics.topTraveler?.company_name || 'N/A' },
                { label:'Top Co. Share',      val: `${analytics.topTraveler?.share || 0}%` },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-gray-200 text-lg">·</span>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-black text-gray-800">{item.val}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* ── Composed Chart: Revenue bars + Bookings line ── */}
            <motion.div initial={{ opacity:0, scale:0.98 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.35 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-gray-900 font-black text-sm">Revenue & Booking Trend</h3>
                  <p className="text-gray-400 text-[10px] mt-0.5">Revenue (bars, left axis) vs bookings count (line, right axis)</p>
                </div>
                <div className="flex gap-4 text-[10px]">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-3 h-2.5 rounded-sm inline-block" style={{ background:'rgba(249,116,21,0.7)' }}/> Revenue
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-4 h-0.5 bg-indigo-400 inline-block"/> Bookings
                  </span>
                </div>
              </div>
              {chartData.length > 0 ? (
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} barCategoryGap="35%">
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#f97415" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#fb923c" stopOpacity={0.3}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false}/>
                      <XAxis dataKey="name" axisLine={false} tickLine={false}
                        tick={{ fill:'#9ca3af', fontSize:10 }} interval="preserveStartEnd"/>
                      <YAxis yAxisId="rev" axisLine={false} tickLine={false}
                        tick={{ fill:'#9ca3af', fontSize:10 }} tickFormatter={v => fmt(v)}/>
                      <YAxis yAxisId="bk" orientation="right" axisLine={false} tickLine={false}
                        tick={{ fill:'#9ca3af', fontSize:10 }}/>
                      <Tooltip content={<ChartTip/>}/>
                      <Bar yAxisId="rev" dataKey="revenue" name="Revenue"
                        fill="url(#barGrad)" radius={[4,4,0,0]}/>
                      <Line yAxisId="bk" type="monotone" dataKey="bookings" name="Bookings"
                        stroke="#818cf8" strokeWidth={2}
                        dot={{ fill:'#818cf8', r:3, strokeWidth:0 }}/>
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-gray-300 text-sm">
                  No data for this period
                </div>
              )}
            </motion.div>

            {/* ── Dual Pie: Booking Status + Payment Status ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                { title:'Booking Status',  sub:'Revenue amount by booking state',  data:statusPie,  cmap:STATUS_COLORS },
                { title:'Payment Status',  sub:'Revenue amount by payment state',   data:paymentPie, cmap:PAYMENT_COLORS },
              ].map((chart, ci) => (
                <motion.div key={chart.title}
                  initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.4+ci*0.08 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                  <h3 className="text-gray-900 font-black text-sm mb-0.5">{chart.title}</h3>
                  <p className="text-gray-400 text-[10px] mb-5">{chart.sub}</p>

                  {chart.data.length > 0 ? (
                    <div className="flex items-center gap-5">
                      {/* donut */}
                      <div className="w-[150px] h-[150px] flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={chart.data} cx="50%" cy="50%"
                              innerRadius={44} outerRadius={70}
                              paddingAngle={4} dataKey="value" strokeWidth={0}>
                              {chart.data.map((e, i) => (
                                <Cell key={i}
                                  fill={chart.cmap[e.name] || FALLBACK[i%FALLBACK.length]}/>
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={v => formatCurrency(v)}
                              contentStyle={{ background:'#fff', border:'1px solid #f3f4f6', borderRadius:12, boxShadow:'0 4px 20px rgba(0,0,0,0.08)' }}
                              labelStyle={{ color:'#f97415' }} itemStyle={{ color:'#374151' }}/>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* breakdown rows */}
                      <div className="flex-1 space-y-3">
                        {chart.data.map((e, i) => {
                          const total = chart.data.reduce((s,x) => s+x.value, 0);
                          const share = total > 0 ? ((e.value/total)*100).toFixed(1) : 0;
                          const color = chart.cmap[e.name] || FALLBACK[i%FALLBACK.length];
                          return (
                            <div key={i}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="flex items-center gap-1.5 text-[10px] text-gray-500 font-semibold">
                                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:color }}/>
                                  {e.name}
                                </span>
                                <span className="text-[10px] font-black text-gray-800">{share}%</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-700"
                                  style={{ width:`${share}%`, background:color }}/>
                              </div>
                              <p className="text-[9px] text-gray-400 mt-0.5">
                                {formatCurrency(e.value)} · {e.count?.toLocaleString()} bookings
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[150px] flex items-center justify-center text-gray-300 text-xs">No data</div>
                  )}
                </motion.div>
              ))}
            </div>

          </motion.div>
        )}

        {/* ════════════ TRAVELER TAB ════════════ */}
        {activeTab === 'traveler' && (
          <motion.div key="tv" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            className="space-y-4">

            {/* horizontal bar chart */}
            {analytics.travelersWithShare.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-gray-900 font-black text-sm mb-0.5">Revenue by Company</h3>
                <p className="text-gray-400 text-[10px] mb-5">Top 10 travelers ranked by total revenue contribution</p>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[...analytics.travelersWithShare].reverse()} layout="vertical" barCategoryGap="20%">
                      <defs>
                        <linearGradient id="hbar" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%"   stopColor="#f97415" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#fb923c" stopOpacity={0.35}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false}/>
                      <XAxis type="number" axisLine={false} tickLine={false}
                        tick={{ fill:'#9ca3af', fontSize:10 }} tickFormatter={v => fmt(v)}/>
                      <YAxis type="category" dataKey="company_name" axisLine={false} tickLine={false}
                        tick={{ fill:'#6b7280', fontSize:10 }} width={110}/>
                      <Tooltip content={<ChartTip/>}/>
                      <Bar dataKey="total_revenue" name="Revenue" fill="url(#hbar)" radius={[0,4,4,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* leaderboard table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h3 className="text-gray-900 font-black text-sm">Leaderboard</h3>
                <p className="text-gray-400 text-[10px] mt-0.5">Market share, rev/booking, and seat efficiency</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Rank','Company','Total Revenue','Bookings','Seats','Market Share','Rev / Booking'].map(h => (
                        <th key={h}
                          className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-widest text-gray-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {analytics.travelersWithShare.map((t, i) => (
                      <motion.tr key={t._id}
                        initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.04 }}
                        className="group cursor-default transition-colors hover:bg-orange-50/50">

                        {/* rank badge */}
                        <td className="px-5 py-3.5">
                          <span
                            className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[10px] font-black"
                            style={
                              i===0 ? { background:'#f97415', color:'#fff' }
                            : i===1 ? { background:'#e5e7eb', color:'#6b7280' }
                            : i===2 ? { background:'#fef3c7', color:'#d97706' }
                            : { color:'#d1d5db' }
                            }>
                            {i+1}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs font-bold text-gray-800">{t.company_name}</td>
                        <td className="px-5 py-3.5 text-xs text-emerald-600 font-black">{formatCurrency(t.total_revenue)}</td>
                        <td className="px-5 py-3.5 text-xs text-gray-500">{t.total_bookings.toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-xs text-gray-500">{t.total_seats.toLocaleString()}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex-1 max-w-[56px]">
                              <div className="h-full rounded-full bg-orange-400 transition-all duration-700"
                                style={{ width:`${t.share}%` }}/>
                            </div>
                            <span className="text-[10px] font-black text-orange-500">{t.share}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-indigo-500 font-bold">
                          {formatCurrency(t.revPerBk)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default RevenueReports;