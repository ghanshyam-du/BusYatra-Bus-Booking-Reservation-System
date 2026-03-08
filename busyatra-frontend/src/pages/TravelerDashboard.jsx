import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Bus, Calendar, BarChart3, Ticket,
  LogOut, Users, Menu, X, UserCircle,
  ChevronRight, Plus, MapPin, IndianRupee,
  AlertCircle, RefreshCw, Clock, ArrowRight
} from 'lucide-react';
import BusList          from '../components/traveler/BusList';
import AddBus           from '../components/traveler/AddBus';
import EditBus          from '../components/traveler/EditBus';
import ScheduleList     from '../components/traveler/ScheduleList';
import AddSchedule      from '../components/traveler/AddSchedule';
import BookingAnalytics from '../components/traveler/BookingAnalytics';
import SupportTickets   from '../components/traveler/SupportTickets';
import { useAuth }      from '../context/AuthContext';
import { cn }           from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import travelerService  from '../services/travelerService';
import UserProfile      from '../components/UserProfile';

/* ─── helpers ────────────────────────────────────────────────────────────── */
const fmt         = (n) => Number(n || 0).toLocaleString('en-IN');
const fmtCurrency = (n) => `₹${fmt(n)}`;
const fmtDate     = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
};
const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
};

/* ─── pick route from schedule — handles all possible field names ─────────
   Backend may return: from_location/to_location OR source/destination OR
   origin/destination OR from/to                                           */
const scheduleRoute = (s) => {
  const from = s.from_location || s.source || s.origin    || s.from || s.departure_city || '?';
  const to   = s.to_location   || s.destination           || s.to   || s.arrival_city   || '?';
  return { from, to };
};

/* ─── status pill ────────────────────────────────────────────────────────── */
const StatusPill = ({ status }) => {
  const map = {
    ACTIVE:      { bg:'bg-emerald-50', text:'text-emerald-700', dot:'bg-emerald-500' },
    CONFIRMED:   { bg:'bg-emerald-50', text:'text-emerald-700', dot:'bg-emerald-500' },
    OPEN:        { bg:'bg-amber-50',   text:'text-amber-700',   dot:'bg-amber-400'   },
    IN_PROGRESS: { bg:'bg-blue-50',    text:'text-blue-700',    dot:'bg-blue-500'    },
    CANCELLED:   { bg:'bg-red-50',     text:'text-red-700',     dot:'bg-red-500'     },
    COMPLETED:   { bg:'bg-gray-50',    text:'text-gray-600',    dot:'bg-gray-400'    },
    RESOLVED:    { bg:'bg-purple-50',  text:'text-purple-700',  dot:'bg-purple-500'  },
    PENDING:     { bg:'bg-amber-50',   text:'text-amber-700',   dot:'bg-amber-400'   },
    PAID:        { bg:'bg-emerald-50', text:'text-emerald-700', dot:'bg-emerald-500' },
    UNPAID:      { bg:'bg-red-50',     text:'text-red-700',     dot:'bg-red-500'     },
  };
  const s = map[status] || { bg:'bg-gray-50', text:'text-gray-500', dot:'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex-shrink-0 ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`}/>
      {(status || 'UNKNOWN').replace(/_/g, ' ')}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD HOME
═══════════════════════════════════════════════════════════════════════════ */
const DashboardHome = ({ user }) => {
  const [stats,     setStats]     = useState(null);
  const [buses,     setBuses]     = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [tickets,   setTickets]   = useState([]);
  const [loading,   setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, bRes, schRes, bkRes, tRes] = await Promise.allSettled([
        travelerService.getDashboardStats(),
        travelerService.getBuses(),
        travelerService.getSchedules({ limit: 5 }),
        travelerService.getBookings({ limit: 5 }),
        travelerService.getTickets(),
      ]);

      // normalise all shapes: { success, data: [] } or { data: [] } or []
      const pick = (r) => {
        if (r.status !== 'fulfilled') return [];
        const v = r.value;
        if (Array.isArray(v)) return v;
        if (Array.isArray(v?.data)) return v.data;
        return v?.data ?? v ?? [];
      };
      const pickObj = (r) => {
        if (r.status !== 'fulfilled') return null;
        const v = r.value;
        if (v?.data && !Array.isArray(v.data)) return v.data;
        return v ?? null;
      };

      setStats(pickObj(sRes));
      setBuses(pick(bRes).slice(0, 4));
      setSchedules(pick(schRes).slice(0, 5));
      setBookings(pick(bkRes).slice(0, 5));
      setTickets(pick(tRes).filter(t => t.ticket_status === 'OPEN').slice(0, 3));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const kpis = [
    { label:'Total Buses',      value: fmt(stats?.total_buses),          icon:<Bus className="w-5 h-5"/>,              accent:'#6366f1', sub:`${stats?.active_buses   ?? 0} active`     },
    { label:'Active Schedules', value: fmt(stats?.active_schedules),     icon:<Calendar className="w-5 h-5"/>,         accent:'#10b981', sub:'Running trips'                              },
    { label:'Total Bookings',   value: fmt(stats?.total_bookings),       icon:<Ticket className="w-5 h-5"/>,           accent:'#f97415', sub:`${stats?.recent_bookings ?? 0} this week`  },
    { label:'Total Revenue',    value: fmtCurrency(stats?.total_revenue),icon:<IndianRupee className="w-5 h-5"/>,      accent:'#ec4899', sub:'Confirmed bookings'                        },
  ];

  if (loading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-56 bg-gray-100 rounded-xl"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl"/>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1,2].map(i => <div key={i} className="h-56 bg-gray-100 rounded-2xl"/>)}
      </div>
    </div>
  );

  return (
    <div className="space-y-5" style={{ fontFamily:"'DM Sans',sans-serif" }}>

      {/* Greeting */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Good {greeting()}, {user?.full_name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Here's your fleet overview for today</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-all shadow-sm">
          <RefreshCw className="w-3.5 h-3.5"/> Refresh
        </button>
      </div>

      {/* Alert: open tickets */}
      {tickets.length > 0 && (
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0"/>
          <p className="text-xs font-semibold text-amber-700 flex-1">
            You have <strong>{tickets.length}</strong> open support ticket{tickets.length > 1 ? 's' : ''} awaiting response.
          </p>
          <Link to="/traveler/tickets"
            className="text-[10px] font-black text-amber-700 hover:underline flex-shrink-0">View →</Link>
        </motion.div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <motion.div key={i} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 relative overflow-hidden hover:shadow-md transition-all">
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
              style={{ background:`linear-gradient(90deg,${k.accent},transparent)` }}/>
            <div className="p-2 rounded-xl inline-flex mb-3" style={{ background:`${k.accent}15` }}>
              <span style={{ color: k.accent }}>{k.icon}</span>
            </div>
            <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-0.5">{k.label}</p>
            <p className="text-2xl font-black text-gray-900">{k.value ?? '0'}</p>
            <p className="text-[10px] text-gray-400 mt-1">{k.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Schedules + Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Schedules */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50"><Calendar className="w-4 h-4 text-emerald-500"/></div>
              <h3 className="font-black text-gray-900 text-sm">Recent Schedules</h3>
            </div>
            <Link to="/traveler/schedules"
              className="text-[10px] font-black text-orange-500 hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3"/>
            </Link>
          </div>

          <div className="divide-y divide-gray-50">
            {schedules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                <Calendar className="w-8 h-8 mb-2"/>
                <p className="text-xs font-semibold">No schedules yet</p>
              </div>
            ) : schedules.map((s, i) => {
              const { from, to } = scheduleRoute(s);
              return (
                <div key={i} className="px-5 py-3 hover:bg-gray-50/50 transition-colors">
                  {/* Route row */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="text-xs font-black text-gray-900 truncate">{from}</span>
                      <ArrowRight className="w-3 h-3 text-gray-300 flex-shrink-0"/>
                      <span className="text-xs font-black text-gray-900 truncate">{to}</span>
                    </div>
                    <StatusPill status={s.schedule_status}/>
                  </div>
                  {/* Meta row */}
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3"/>{fmtDate(s.journey_date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3"/>{s.departure_time || s.departure || '—'}
                    </span>
                    {s.fare && (
                      <span className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3"/>{fmt(s.fare)}
                      </span>
                    )}
                    {s.available_seats != null && (
                      <span className="text-emerald-500 font-semibold">{s.available_seats} seats left</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-5 py-3 border-t border-gray-50">
            <Link to="/traveler/add-schedule"
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-black text-white"
              style={{ background:'linear-gradient(135deg,#f97415,#ea580c)' }}>
              <Plus className="w-3.5 h-3.5"/> Add New Schedule
            </Link>
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-50"><Ticket className="w-4 h-4 text-orange-500"/></div>
              <h3 className="font-black text-gray-900 text-sm">Recent Bookings</h3>
            </div>
            <Link to="/traveler/bookings"
              className="text-[10px] font-black text-orange-500 hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3"/>
            </Link>
          </div>

          <div className="divide-y divide-gray-50">
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                <Ticket className="w-8 h-8 mb-2"/>
                <p className="text-xs font-semibold">No bookings yet</p>
              </div>
            ) : bookings.map((b, i) => (
              <div key={i} className="px-5 py-3 hover:bg-gray-50/50 transition-colors">
                {/* Top row: ID + amount */}
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-black text-gray-900">{b.booking_id}</p>
                  <p className="text-sm font-black text-gray-900">{fmtCurrency(b.total_amount)}</p>
                </div>
                {/* Bottom row: date + seats + status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3"/>{fmtDate(b.booking_date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3"/>
                      {b.number_of_seats ?? b.seats ?? 1} seat{(b.number_of_seats ?? 1) !== 1 ? 's' : ''}
                    </span>
                    {b.payment_status && (
                      <span className={`font-semibold ${b.payment_status === 'PAID' ? 'text-emerald-500' : 'text-red-400'}`}>
                        {b.payment_status}
                      </span>
                    )}
                  </div>
                  <StatusPill status={b.booking_status}/>
                </div>
                {/* Route if available */}
                {(b.schedule_id?.from_location || b.from_location) && (
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3"/>
                    {b.schedule_id?.from_location || b.from_location} → {b.schedule_id?.to_location || b.to_location}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fleet + Revenue + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* My Fleet */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50"><Bus className="w-4 h-4 text-indigo-500"/></div>
              <h3 className="font-black text-gray-900 text-sm">My Fleet</h3>
              <span className="text-[9px] font-black bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full">
                {stats?.total_buses ?? buses.length} total
              </span>
            </div>
            <Link to="/traveler/buses"
              className="text-[10px] font-black text-orange-500 hover:underline flex items-center gap-0.5">
              Manage <ChevronRight className="w-3 h-3"/>
            </Link>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {buses.length === 0 ? (
              <div className="col-span-2 flex flex-col items-center justify-center py-10 text-gray-300">
                <Bus className="w-8 h-8 mb-2"/>
                <p className="text-xs font-semibold">No buses added yet</p>
              </div>
            ) : buses.map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <Bus className="w-5 h-5 text-indigo-500"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-gray-900 truncate">
                    {b.bus_name || b.bus_number || b.name || `Bus ${i+1}`}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {b.bus_type || b.type || 'Standard'} · {b.total_seats || b.capacity || '—'} seats
                  </p>
                  {b.bus_number && b.bus_name && (
                    <p className="text-[10px] text-gray-300">{b.bus_number}</p>
                  )}
                </div>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${
                  b.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                }`}>
                  {b.is_active ? 'Active' : 'Off'}
                </span>
              </div>
            ))}
          </div>
          <div className="px-4 pb-4">
            <Link to="/traveler/add-bus"
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-xs font-black text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-all">
              <Plus className="w-3.5 h-3.5"/> Add Another Bus
            </Link>
          </div>
        </motion.div>

        {/* Revenue + Quick Actions */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
          className="space-y-3">

          {/* Revenue highlight */}
          <div className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background:'linear-gradient(135deg,#f97415,#ea580c)' }}>
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10"/>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5"/>
            <p className="text-[9px] uppercase tracking-widest font-black text-orange-200 mb-1">Total Revenue</p>
            <p className="text-3xl font-black text-white leading-tight">{fmtCurrency(stats?.total_revenue)}</p>
            <p className="text-[10px] text-orange-200 mt-1">from {fmt(stats?.total_bookings)} bookings</p>
            <div className="flex gap-3 mt-3 pt-3 border-t border-white/20">
              <div>
                <p className="text-[9px] text-orange-200 font-bold">Buses</p>
                <p className="text-sm font-black text-white">{fmt(stats?.total_buses)}</p>
              </div>
              <div>
                <p className="text-[9px] text-orange-200 font-bold">Schedules</p>
                <p className="text-sm font-black text-white">{fmt(stats?.active_schedules)}</p>
              </div>
              <div>
                <p className="text-[9px] text-orange-200 font-bold">This week</p>
                <p className="text-sm font-black text-white">{fmt(stats?.recent_bookings)}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 px-4 pt-4 pb-2">Quick Actions</p>
            {[
              { label:'Add New Bus',     icon:<Bus className="w-3.5 h-3.5"/>,      href:'/traveler/add-bus',      color:'#6366f1' },
              { label:'Add Schedule',    icon:<Calendar className="w-3.5 h-3.5"/>, href:'/traveler/add-schedule', color:'#10b981' },
              { label:'View Bookings',   icon:<Ticket className="w-3.5 h-3.5"/>,   href:'/traveler/bookings',     color:'#f97415' },
              { label:'Support Tickets', icon:<Users className="w-3.5 h-3.5"/>,    href:'/traveler/tickets',      color:'#ec4899' },
            ].map((a, i) => (
              <Link key={i} to={a.href}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-t border-gray-50 first:border-0 group">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background:`${a.color}15`, color: a.color }}>
                  {a.icon}
                </div>
                <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900 flex-1">{a.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors"/>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN LAYOUT
═══════════════════════════════════════════════════════════════════════════ */
const TravelerDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/traveler' && location.pathname === '/traveler') return true;
    return location.pathname.startsWith(path) && path !== '/traveler';
  };

  const navItems = [
    { name:'Dashboard', path:'/traveler',          icon:LayoutDashboard },
    { name:'My Buses',  path:'/traveler/buses',     icon:Bus             },
    { name:'Schedules', path:'/traveler/schedules', icon:Calendar        },
    { name:'Bookings',  path:'/traveler/bookings',  icon:BarChart3       },
    { name:'Support',   path:'/traveler/tickets',   icon:Users           },
    { name:'Profile',   path:'/traveler/profile',   icon:UserCircle      },
  ];

  /* ── sidebar — NO brand logo (already in top navbar) ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ fontFamily:"'DM Sans',sans-serif" }}>

      {/* User card only — no duplicate BusYatra brand */}
      <Link to="/traveler/profile" onClick={() => setIsMobileMenuOpen(false)}
        className="flex items-center gap-3 p-3 mb-5 bg-gray-50 rounded-2xl hover:bg-orange-50 border border-transparent hover:border-orange-100 transition-all group">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
          style={{ background:'linear-gradient(135deg,#f97415,#ea580c)' }}>
          {user?.full_name?.[0] || 'T'}
        </div>
        <div className="overflow-hidden flex-1 min-w-0">
          <p className="text-xs font-black text-gray-900 truncate">{user?.full_name}</p>
          <p className="text-[9px] text-gray-400 font-semibold">Bus Operator</p>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-orange-400 flex-shrink-0 transition-colors"/>
      </Link>

      {/* Nav items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
                active ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
              style={active ? { background:'linear-gradient(135deg,#f97415,#ea580c)' } : {}}>
              <item.icon className={cn("w-4 h-4 flex-shrink-0",
                active ? "text-white" : "text-gray-400 group-hover:text-gray-600")}/>
              <span className="font-bold text-sm flex-1">{item.name}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 text-white/70"/>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-4 border-t border-gray-100 pb-2">
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all group">
          <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"/>
          <span className="font-bold text-sm">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── Top navbar ── */}
      <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition">
              {isMobileMenuOpen ? <X size={18}/> : <Menu size={18}/>}
            </button>
            {/* brand — shown ONCE here only */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background:'linear-gradient(135deg,#f97415,#ea580c)' }}>
                <Bus className="w-4 h-4 text-white"/>
              </div>
              <span className="font-black text-gray-900 text-lg hidden sm:block">BusYatra</span>
              <span className="text-[10px] font-black text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full hidden sm:block">
                Operator
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/traveler/profile"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-black"
                style={{ background:'linear-gradient(135deg,#f97415,#ea580c)' }}>
                {user?.full_name?.[0] || 'T'}
              </div>
              <span className="text-sm font-semibold text-gray-700">{user?.full_name}</span>
            </Link>
            <button onClick={logout}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-xl transition-all text-sm font-medium border border-transparent hover:border-red-200">
              <LogOut className="w-4 h-4"/>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto flex">
        {/* Mobile overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}/>
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-[57px] z-20 lg:z-10
          w-[240px] h-[calc(100vh-57px)]
          bg-white border-r border-gray-200
          p-4 overflow-y-auto
          transition-transform duration-300 lg:transition-none
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <SidebarContent/>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-57px)] p-4 lg:p-6 bg-gray-50">
          <Routes>
            <Route index                  element={<DashboardHome user={user}/>}/>
            <Route path="buses"           element={<BusList/>}/>
            <Route path="add-bus"         element={<AddBus/>}/>
            <Route path="edit-bus/:busId" element={<EditBus/>}/>
            <Route path="schedules"       element={<ScheduleList/>}/>
            <Route path="add-schedule"    element={<AddSchedule/>}/>
            <Route path="bookings"        element={<BookingAnalytics/>}/>
            <Route path="tickets"         element={<SupportTickets/>}/>
            <Route path="profile"         element={<UserProfile/>}/>
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default TravelerDashboard;