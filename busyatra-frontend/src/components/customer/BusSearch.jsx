import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Calendar, ArrowRightLeft, Bus, 
  Clock, Wifi, Coffee, BatteryCharging, ArrowRight, 
  Filter, Star, Info, ChevronRight, ShieldCheck, Zap,
  TrendingUp, Award, Users
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
    <div className="min-h-screen">
      {/* Header Section */}
      <header className="p-8 pb-6 border-b border-border/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-linear-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-3"
            >
              <ShieldCheck className="w-4 h-4" /> 
              Verified & Secure
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Find Your <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-500 to-emerald-500">Perfect Ride</span>
            </h1>
            <p className="text-muted-foreground mt-2">Search from 5,000+ routes across India</p>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Modern Search Bar */}
        <motion.div 
          layout
          className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-border/50 ring-1 ring-black/5 dark:ring-white/10 mb-12"
        >
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-3 relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
              <input
                className="w-full pl-12 pr-4 py-4 bg-muted/30 rounded-2xl border border-transparent focus:border-teal-500/20 focus:ring-2 focus:ring-teal-500/20 focus:bg-background transition-all text-foreground placeholder:text-muted-foreground font-medium outline-none"
                placeholder="From City"
                value={searchParams.from}
                onChange={e => setSearchParams({...searchParams, from: e.target.value})}
              />
            </div>

            <div className="md:col-span-1 flex justify-center">
              <button 
                type="button" 
                onClick={swapLocations}
                className="p-3.5 bg-muted hover:bg-linear-to-r hover:from-teal-500 hover:to-emerald-500 hover:text-white rounded-2xl transition-all transform hover:rotate-180 duration-500 group"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="md:col-span-3 relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                className="w-full pl-12 pr-4 py-4 bg-muted/30 rounded-2xl border border-transparent focus:border-emerald-500/20 focus:ring-2 focus:ring-emerald-500/20 focus:bg-background transition-all text-foreground placeholder:text-muted-foreground font-medium outline-none"
                placeholder="To City"
                value={searchParams.to}
                onChange={e => setSearchParams({...searchParams, to: e.target.value})}
              />
            </div>

            <div className="md:col-span-3 relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="date"
                min={today}
                className="w-full pl-12 pr-4 py-4 bg-muted/30 rounded-2xl border border-transparent focus:border-teal-500/20 focus:ring-2 focus:ring-teal-500/20 focus:bg-background transition-all text-foreground font-medium cursor-pointer outline-none"
                value={searchParams.date}
                onChange={e => setSearchParams({...searchParams, date: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <button 
                className="w-full h-full py-4 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-2xl font-bold shadow-xl shadow-teal-500/30 hover:shadow-teal-500/50 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Search
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Quick Stats */}
        {buses.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Bus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{buses.length}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Buses Found</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {buses.length > 0 ? formatCurrency(Math.min(...buses.map(b => b.fare))) : '₹0'}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Starting From</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">4.8★</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Avg Rating</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {buses.reduce((acc, bus) => acc + (bus.total_seats - bus.booked_seats || 30), 0)}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Seats Available</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <div key="loading" className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-56 bg-muted/30 animate-pulse rounded-3xl border border-border/50" />
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
    className="group bg-card border border-border/50 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:border-primary/30"
  >
    <div className="p-6 md:p-8 flex flex-col lg:flex-row items-center gap-6">
      {/* Operator Brand */}
      <div className="flex flex-row lg:flex-col items-center gap-4 w-full lg:w-48 text-center lg:text-left">
        <div className="w-16 h-16 bg-linear-to-br from-teal-500/10 to-emerald-500/10 rounded-2xl flex items-center justify-center group-hover:from-teal-500 group-hover:to-emerald-500 transition-all duration-500 border border-teal-500/20">
          <Bus className="w-8 h-8 text-teal-600 dark:text-teal-400 group-hover:text-white transition-colors" />
        </div>
        <div>
          <h3 className="font-black text-foreground text-lg leading-tight truncate">{bus.company_name}</h3>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{bus.bus_type}</p>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="flex-1 w-full grid grid-cols-3 items-center gap-4">
        <div className="text-center md:text-left">
          <p className="text-3xl font-black text-foreground">{formatTime(bus.departure_time)}</p>
          <p className="text-sm font-medium text-muted-foreground truncate">{bus.from_location}</p>
        </div>

        <div className="relative flex flex-col items-center">
          <span className="text-[10px] font-bold text-muted-foreground mb-2 px-2 py-1 bg-muted rounded-full">
            {formatDuration(bus.departure_time, bus.arrival_time)}
          </span>
          <div className="w-full flex items-center gap-1">
            <div className="h-[3px] flex-1 bg-linear-to-r from-transparent via-teal-200 dark:via-teal-800 to-teal-500/50 rounded-full" />
            <div className="relative">
              <Bus className="w-5 h-5 text-teal-500" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <div className="h-[3px] flex-1 bg-linear-to-l from-transparent via-emerald-200 dark:via-emerald-800 to-emerald-500/50 rounded-full" />
          </div>
          <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 mt-2 uppercase tracking-tighter px-2 py-1 bg-teal-50 dark:bg-teal-950/30 rounded-full">
            Direct
          </span>
        </div>

        <div className="text-center md:text-right">
          <p className="text-3xl font-black text-foreground">{formatTime(bus.arrival_time)}</p>
          <p className="text-sm font-medium text-muted-foreground truncate">{bus.to_location}</p>
        </div>
      </div>

      {/* Pricing and Action */}
      <div className="w-full lg:w-auto flex lg:flex-col items-center justify-between gap-4 border-t lg:border-t-0 lg:border-l border-border/50 pt-6 lg:pt-0 lg:pl-8">
        <div className="text-left lg:text-right">
          <div className="flex items-center lg:justify-end gap-1 mb-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-foreground">4.8</span>
            <span className="text-xs text-muted-foreground">(2.5k)</span>
          </div>
          <p className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-emerald-600 leading-none">
            {formatCurrency(bus.fare)}
          </p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase mt-2">Per Seat</p>
        </div>

        <button 
          onClick={onSelect}
          className="px-8 py-4 bg-foreground hover:bg-linear-to-r hover:from-teal-600 hover:to-emerald-600 text-background hover:text-white rounded-2xl font-black text-sm transition-all transform active:scale-95 flex items-center gap-2 shadow-xl group"
        >
          Book Now
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>

    {/* Amenities */}
    <div className="px-8 pb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
            <Wifi className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-medium">WiFi</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
            <BatteryCharging className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="font-medium">Charging</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
            <Coffee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="font-medium">Snacks</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const NoResults = () => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-6 relative">
      <Bus className="w-16 h-16 text-muted-foreground/30" />
      <div className="absolute inset-0 rounded-full border-4 border-dashed border-muted-foreground/10" />
    </div>
    <h3 className="text-2xl font-black text-foreground mb-2">No buses available</h3>
    <p className="text-muted-foreground max-w-md">
      Try adjusting your search criteria or check a different date. We're constantly adding new routes!
    </p>
  </motion.div>
);

export default BusSearch;