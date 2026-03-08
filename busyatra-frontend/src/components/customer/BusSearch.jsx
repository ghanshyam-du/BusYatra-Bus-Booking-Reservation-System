import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Calendar, ArrowRightLeft, Bus,
  Clock, Wifi, Coffee, BatteryCharging, ChevronRight,
  ShieldCheck, Star, TrendingUp, Award, Users, Zap,
  CheckCircle, RefreshCw, X
} from 'lucide-react';
import bookingService from '../../services/bookingService';
import { formatCurrency, formatTime, formatDuration } from '../../utils/formatters';
import toast from 'react-hot-toast';
import SeatSelection from './SeatSelection';

/* ─── popular routes ─────────────────────────────────────────────────────── */
const POPULAR = [
  { from:'Mumbai',    to:'Pune'       },
  { from:'Delhi',     to:'Agra'       },
  { from:'Bangalore', to:'Mysore'     },
  { from:'Chennai',   to:'Madurai'    },
  { from:'Hyderabad', to:'Vijayawada' },
];

/* ─── seat availability bar ──────────────────────────────────────────────── */
const SeatsBar = ({ booked, total }) => {
  const left = Math.max(0, (total || 0) - (booked || 0));
  const pct  = Math.min(100, ((booked || 0) / (total || 1)) * 100);
  const color = left > 10 ? 'bg-emerald-400' : left > 3 ? 'bg-amber-400' : 'bg-red-400';
  const textColor = left > 10 ? 'text-emerald-600' : left > 3 ? 'text-amber-600' : 'text-red-600';
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Availability</span>
        <span className={`text-[10px] font-black ${textColor}`}>{left} left</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-20">
        <div className={`h-full rounded-full ${color}`} style={{ width:`${pct}%` }}/>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   BUS CARD
═══════════════════════════════════════════════════════════════════════════ */
const BusCard = ({ bus, idx, onSelect }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: idx * 0.08 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-100 transition-all overflow-hidden">

      <div className="h-[2px]" style={{ background:'linear-gradient(90deg,#f97415,transparent)' }}/>

      <div className="p-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-5">

          {/* Operator */}
          <div className="flex items-center gap-3 lg:w-44 flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background:'linear-gradient(135deg,#fff7ed,#fed7aa)' }}>
              <Bus className="w-6 h-6 text-orange-500"/>
            </div>
            <div className="min-w-0">
              <p className="font-black text-gray-900 text-sm truncate">{bus.company_name || 'Bus Service'}</p>
              <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                {bus.bus_type || 'Standard'}
              </span>
            </div>
          </div>

          {/* Journey timeline */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 justify-between">
              <div>
                <p className="text-2xl font-black text-gray-900 leading-none">{formatTime ? formatTime(bus.departure_time) : bus.departure_time || '—'}</p>
                <p className="text-xs text-gray-500 mt-1 font-semibold truncate max-w-[90px]">{bus.from_location}</p>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 min-w-0 px-2">
                <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {formatDuration ? formatDuration(bus.departure_time, bus.arrival_time) : 'Direct'}
                </span>
                <div className="w-full flex items-center gap-1">
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-orange-300"/>
                  <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"/>
                  <div className="flex-1 h-px bg-gradient-to-l from-gray-200 to-orange-300"/>
                </div>
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Direct
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-gray-900 leading-none">{formatTime ? formatTime(bus.arrival_time) : bus.arrival_time || '—'}</p>
                <p className="text-xs text-gray-500 mt-1 font-semibold truncate max-w-[90px] text-right">{bus.to_location}</p>
              </div>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto border-t border-gray-50 lg:border-t-0 pt-4 lg:pt-0 lg:pl-5 lg:border-l lg:border-gray-100 gap-3 flex-shrink-0">
            <div className="flex items-center gap-0.5 mb-0.5">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`w-3 h-3 ${s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}/>
              ))}
              <span className="text-[10px] text-gray-400 font-semibold ml-1">4.8</span>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-[9px] uppercase tracking-widest font-black text-gray-400">Per Seat</p>
              <p className="text-2xl font-black text-orange-500 leading-tight">{formatCurrency(bus.fare)}</p>
            </div>
            <button onClick={onSelect}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-black transition-all hover:opacity-90 active:scale-95 shadow-sm whitespace-nowrap"
              style={{ background:'linear-gradient(135deg,#f97415,#ea580c)' }}>
              Book Now <ChevronRight className="w-4 h-4"/>
            </button>
          </div>
        </div>

        {/* Amenities + seats + expand */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { icon:Wifi,            label:'WiFi',     cls:'bg-blue-50 text-blue-600'    },
              { icon:BatteryCharging, label:'Charging', cls:'bg-amber-50 text-amber-600'  },
              { icon:Coffee,          label:'Snacks',   cls:'bg-emerald-50 text-emerald-600' },
            ].map((a, i) => (
              <span key={i} className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${a.cls}`}>
                <a.icon className="w-3 h-3"/> {a.label}
              </span>
            ))}
            {bus.bus_number && (
              <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">#{bus.bus_number}</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <SeatsBar booked={bus.booked_seats} total={bus.total_seats}/>
            <button onClick={() => setExpanded(!expanded)}
              className="text-[10px] font-black text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-0.5">
              {expanded ? 'Less' : 'Details'}
              <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`}/>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
            className="overflow-hidden border-t border-gray-50">
            <div className="px-5 py-4 bg-gray-50/50 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {[
                { label:'Bus Number',  value: bus.bus_number   || '—'             },
                { label:'Total Seats', value: bus.total_seats  || '—'             },
                { label:'Booked',      value: bus.booked_seats || 0               },
                { label:'Fare',        value: formatCurrency(bus.fare)            },
              ].map((d, i) => (
                <div key={i}>
                  <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-0.5">{d.label}</p>
                  <p className="font-black text-gray-900">{d.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN SEARCH COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
const BusSearch = () => {
  const [from,        setFrom]        = useState('');
  const [to,          setTo]          = useState('');
  const [date,        setDate]        = useState('');
  const [buses,       setBuses]       = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [searched,    setSearched]    = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showSeats,   setShowSeats]   = useState(false);
  const [sortBy,      setSortBy]      = useState('fare');

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = async (e) => {
    e?.preventDefault();

    /* ── only From + To required; date is optional ── */
    if (!from.trim() || !to.trim()) {
      toast.error('Please enter both From and To city');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      /* pass date only if provided — backend returns all schedules for route when date omitted */
      const params = { from: from.trim(), to: to.trim() };
      if (date) params.date = date;

      const res = await bookingService.searchBuses(params);
      const data = res.data || [];
      setBuses(data);
      if (!data.length) toast('No buses found for this route', { icon:'🔍' });
    } catch {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const swapLocations = () => { setFrom(to); setTo(from); };

  const clearDate = () => setDate('');

  /* sorted */
  const sorted = [...buses].sort((a, b) =>
    sortBy === 'fare'
      ? (a.fare || 0) - (b.fare || 0)
      : ((b.total_seats || 0) - (b.booked_seats || 0)) - ((a.total_seats || 0) - (a.booked_seats || 0))
  );

  return (
    <div className="min-h-screen" style={{ fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── Hero / search section ── */}
      <div className="relative rounded-3xl overflow-hidden mb-6 p-6 md:p-8"
        style={{ background:'linear-gradient(135deg,#fff7ed 0%,#ffedd5 50%,#fed7aa 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-orange-200/30 -translate-y-1/2 translate-x-1/4 pointer-events-none"/>
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-orange-300/20 translate-y-1/2 -translate-x-1/4 pointer-events-none"/>

        <div className="relative mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-orange-200 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-3">
            <ShieldCheck className="w-3.5 h-3.5"/> Verified & Secure Booking
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
            Find Your <span className="text-orange-500">Perfect Ride</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Search from 5,000+ routes across India</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="relative bg-white rounded-2xl shadow-sm border border-orange-100 p-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">

            {/* From */}
            <div className="md:col-span-4 relative group">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-orange-400 transition-colors pointer-events-none"/>
              <input
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400 transition-all"
                placeholder="From City *"
                value={from}
                onChange={e => setFrom(e.target.value)}
              />
            </div>

            {/* Swap */}
            <div className="md:col-span-1 flex justify-center">
              <button type="button" onClick={swapLocations}
                className="p-2.5 bg-orange-50 hover:bg-orange-500 text-orange-500 hover:text-white rounded-xl transition-all hover:rotate-180 duration-500 border border-orange-100 hover:border-orange-500">
                <ArrowRightLeft className="w-4 h-4"/>
              </button>
            </div>

            {/* To */}
            <div className="md:col-span-4 relative group">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-orange-400 transition-colors pointer-events-none"/>
              <input
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-400 transition-all"
                placeholder="To City *"
                value={to}
                onChange={e => setTo(e.target.value)}
              />
            </div>

            {/* Date — OPTIONAL */}
            <div className="md:col-span-2 relative group">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-orange-400 transition-colors pointer-events-none"/>
              <input type="date" min={today}
                className="w-full pl-9 pr-7 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none text-sm font-semibold text-gray-700 cursor-pointer transition-all"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
              {/* clear date button */}
              {date && (
                <button type="button" onClick={clearDate}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-400 transition-colors">
                  <X className="w-3.5 h-3.5"/>
                </button>
              )}
            </div>

            {/* Search btn */}
            <div className="md:col-span-1">
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-black text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                style={{ background:'linear-gradient(135deg,#f97415,#ea580c)' }}>
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                  : <><Search className="w-4 h-4"/> Search</>
                }
              </button>
            </div>
          </div>

          {/* Optional date hint */}
          <p className="text-[10px] text-gray-400 font-semibold mt-2 px-1">
            💡 Date is optional — leave blank to see all available buses on this route
          </p>
        </form>

        {/* Popular routes */}
        <div className="relative mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-wider">Popular:</span>
          {POPULAR.map((r, i) => (
            <button key={i} type="button" onClick={() => { setFrom(r.from); setTo(r.to); }}
              className="text-[10px] font-bold px-2.5 py-1 bg-white/70 hover:bg-white border border-orange-100 text-gray-600 hover:text-orange-500 rounded-full transition-all">
              {r.from} → {r.to}
            </button>
          ))}
        </div>
      </div>

      {/* Stats strip after search */}
      <AnimatePresence>
        {buses.length > 0 && !loading && (
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { icon:<Bus className="w-4 h-4"/>,        label:'Buses Found',    value: buses.length,                                                            color:'#6366f1' },
              { icon:<TrendingUp className="w-4 h-4"/>, label:'Starting From',  value: formatCurrency(Math.min(...buses.map(b => b.fare || 9999))),             color:'#10b981' },
              { icon:<Award className="w-4 h-4"/>,      label:'Avg Rating',     value: '4.8 ★',                                                                  color:'#f59e0b' },
              { icon:<Users className="w-4 h-4"/>,      label:'Seats Available',value: buses.reduce((a,b) => a + Math.max(0,(b.total_seats||40)-(b.booked_seats||0)),0), color:'#ec4899' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:`${s.color}15`, color: s.color }}>{s.icon}</div>
                <div>
                  <p className="text-base font-black text-gray-900 leading-none">{s.value}</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{s.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sort bar */}
      {buses.length > 0 && !loading && (
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <p className="text-xs font-black text-gray-400">
            {buses.length} result{buses.length !== 1 ? 's' : ''} · {from} → {to}
            {date && <span className="ml-1 text-orange-400">· {new Date(date).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</span>}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Sort by</span>
            {[{ key:'fare', label:'Lowest Price' }, { key:'seats', label:'Most Seats' }].map(s => (
              <button key={s.key} onClick={() => setSortBy(s.key)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  sortBy === s.key ? 'text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-orange-300'
                }`}
                style={sortBy === s.key ? { background:'linear-gradient(135deg,#f97415,#ea580c)' } : {}}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-36 bg-gray-100 animate-pulse rounded-2xl"/>)}
          </motion.div>
        ) : sorted.length > 0 ? (
          <motion.div key="results" initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-3">
            {sorted.map((bus, i) => (
              <BusCard key={bus.schedule_id || i} bus={bus} idx={i}
                onSelect={() => { setSelectedBus(bus); setShowSeats(true); }}/>
            ))}
          </motion.div>
        ) : searched ? (
          <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4 relative">
              <Bus className="w-8 h-8 text-orange-300"/>
              <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-orange-200"/>
            </div>
            <h3 className="font-black text-gray-900 mb-1">No buses found</h3>
            <p className="text-gray-400 text-sm max-w-xs mb-5">
              Try a different date or check nearby cities. New routes are added every week!
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              {date && (
                <button onClick={clearDate}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black text-orange-500 bg-orange-50 border border-orange-100 hover:bg-orange-100 transition-all">
                  <X className="w-3.5 h-3.5"/> Remove Date Filter
                </button>
              )}
              <button onClick={() => { setBuses([]); setSearched(false); setFrom(''); setTo(''); setDate(''); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all">
                <RefreshCw className="w-3.5 h-3.5"/> New Search
              </button>
            </div>
          </motion.div>
        ) : (
          /* Idle state */
          <motion.div key="idle" initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-4">Why choose BusYatra?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon:<ShieldCheck className="w-5 h-5"/>, title:'Secure Payments',   desc:'100% safe & encrypted transactions',   color:'#10b981' },
                { icon:<Zap className="w-5 h-5"/>,         title:'Instant Booking',   desc:'Confirm your seat in under 2 minutes',  color:'#6366f1' },
                { icon:<CheckCircle className="w-5 h-5"/>, title:'Easy Cancellation', desc:'Hassle-free refunds when plans change',  color:'#f97415' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background:`${f.color}15`, color: f.color }}>{f.icon}</div>
                  <div>
                    <p className="text-xs font-black text-gray-900">{f.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showSeats && selectedBus && (
        <SeatSelection
          bus={selectedBus}
          onClose={() => setShowSeats(false)}
          onBookingComplete={() => { setShowSeats(false); toast.success('Booking confirmed! 🎉'); }}
        />
      )}
    </div>
  );
};

export default BusSearch;