import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Calendar, ArrowRightLeft, Bus, 
  Clock, Wifi, Coffee, BatteryCharging, ArrowRight, 
  Filter, Star, Info, ChevronRight, ShieldCheck
} from 'lucide-react';
import bookingService from '../../services/bookingService';
import { formatCurrency, formatTime, formatDuration } from '../../utils/formatters';
import toast from 'react-hot-toast';
import SeatSelection from './SeatSelection';
import { cn } from '../../utils/cn';

const BusSearch = () => {
  const [searchParams, setSearchParams] = useState({ from: '', to: '', date: '' });
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showSeatSelection, setShowSeatSelection] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await bookingService.searchBuses(searchParams);
      setBuses(response.data || []);
      if (response.data?.length === 0) toast.error('No buses found');
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const swapLocations = () => {
    setSearchParams(prev => ({ ...prev, from: prev.to, to: prev.from }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        {/* --- Header Section --- */}
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-4"
            >
              <ShieldCheck className="w-4 h-4" /> Secure Ticketing
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Where to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">Next?</span>
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-md md:text-right">
            Premium bus travel across 500+ cities. Relax, we'll get you there.
          </p>
        </header>

        {/* --- Modern Search Bar --- */}
        <motion.div 
          layout
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl shadow-slate-200/60 dark:shadow-black/40 border border-slate-100 dark:border-slate-800 mb-16"
        >
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-3 relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500" />
              <input
                className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                placeholder="From City"
                value={searchParams.from}
                onChange={e => setSearchParams({...searchParams, from: e.target.value})}
              />
            </div>

            <div className="md:col-span-1 flex justify-center">
              <button 
                type="button" onClick={swapLocations}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-teal-500 hover:text-white transition-all transform hover:rotate-180"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="md:col-span-3 relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500" />
              <input
                className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                placeholder="To City"
                value={searchParams.to}
                onChange={e => setSearchParams({...searchParams, to: e.target.value})}
              />
            </div>

            <div className="md:col-span-3 relative group lg:border-l border-slate-100 dark:border-slate-800">
              <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500" />
              <input
                type="date"
                min={today}
                className="w-full pl-14 pr-4 py-4 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white font-medium cursor-pointer"
                value={searchParams.date}
                onChange={e => setSearchParams({...searchParams, date: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <button 
                className="w-full h-full py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-[1.8rem] font-bold shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-2 group"
                disabled={loading}
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                Search
              </button>
            </div>
          </form>
        </motion.div>

        {/* --- Results Section --- */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <div key="loading" className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-48 bg-slate-200/50 dark:bg-slate-800/50 animate-pulse rounded-3xl" />
                ))}
              </div>
            ) : buses.length > 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6">
                {buses.map((bus, idx) => (
                  <BusCard key={bus.schedule_id} bus={bus} idx={idx} onSelect={() => { setSelectedBus(bus); setShowSeatSelection(true); }} />
                ))}
              </motion.div>
            ) : (
              <NoResults />
            )}
          </AnimatePresence>
        </div>
      </div>

      {showSeatSelection && selectedBus && (
        <SeatSelection 
          bus={selectedBus} 
          onClose={() => setShowSeatSelection(false)} 
          onBookingComplete={() => { /* logic */ }}
        />
      )}
    </div>
  );
};

const BusCard = ({ bus, idx, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.1 }}
    className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500"
  >
    <div className="p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8">
      {/* Operator Brand */}
      <div className="flex flex-row lg:flex-col items-center gap-4 w-full lg:w-48 text-center lg:text-left">
        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-500">
          <Bus className="w-8 h-8 text-teal-600 dark:text-teal-400 group-hover:text-white" />
        </div>
        <div>
          <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight truncate">{bus.company_name}</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{bus.bus_type}</p>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="flex-1 w-full grid grid-cols-3 items-center gap-4">
        <div className="text-center md:text-left">
          <p className="text-2xl font-black text-slate-900 dark:text-white">{formatTime(bus.departure_time)}</p>
          <p className="text-sm font-medium text-slate-500 truncate">{bus.from_location}</p>
        </div>

        <div className="relative flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 mb-2">{formatDuration(bus.departure_time, bus.arrival_time)}</span>
          <div className="w-full flex items-center gap-1">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-700" />
            <Bus className="w-4 h-4 text-teal-500 animate-pulse" />
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-700" />
          </div>
          <span className="text-[10px] font-bold text-teal-500 mt-2 uppercase tracking-tighter italic">Direct</span>
        </div>

        <div className="text-center md:text-right">
          <p className="text-2xl font-black text-slate-900 dark:text-white">{formatTime(bus.arrival_time)}</p>
          <p className="text-sm font-medium text-slate-500 truncate">{bus.to_location}</p>
        </div>
      </div>

      {/* Pricing and Action */}
      <div className="w-full lg:w-auto flex lg:flex-col items-center justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-8">
        <div className="text-left lg:text-right">
          <div className="flex items-center lg:justify-end gap-1 mb-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">4.8</span>
          </div>
          <p className="text-3xl font-black text-teal-600 dark:text-teal-400 leading-none">
            {formatCurrency(bus.fare)}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Per Passenger</p>
        </div>

        <button 
          onClick={onSelect}
          className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm hover:bg-teal-600 dark:hover:bg-teal-500 dark:hover:text-white transition-all transform active:scale-95 flex items-center gap-2 shadow-xl shadow-slate-200 dark:shadow-none"
        >
          Book Now
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </motion.div>
);

const NoResults = () => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="w-32 h-32 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
      <Bus className="w-12 h-12 text-slate-300" />
    </div>
    <h3 className="text-2xl font-black text-slate-900 dark:text-white">No rides available</h3>
    <p className="text-slate-500 mt-2">Try adjusting your filters or checking a different date.</p>
  </motion.div>
);

export default BusSearch;