import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, IndianRupee, Users, ArrowRight, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import travelerService from '../../services/travelerService';
import toast from 'react-hot-toast';

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('all');

  useEffect(() => { fetchSchedules(); }, [filter]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') params.status = filter;
      const response = await travelerService.getSchedules(params);
      setSchedules(response.data || []);
    } catch {
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (scheduleId) => {
    if (!confirm('Cancel this schedule?')) return;
    try {
      await travelerService.cancelSchedule(scheduleId);
      toast.success('Schedule cancelled');
      fetchSchedules();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to cancel schedule');
    }
  };

  const fmtCurrency = (n) =>
    new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n || 0);

  const fmtDate = (v) => {
    if (!v) return '—';
    const d = new Date(v);
    return isNaN(d) ? '—' : d.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' });
  };

  /* ── status config ── */
  const STATUS = {
    ACTIVE:    { bg:'bg-emerald-50', text:'text-emerald-700', border:'border-emerald-200', dot:'bg-emerald-500', label:'Active'    },
    COMPLETED: { bg:'bg-blue-50',    text:'text-blue-700',    border:'border-blue-200',    dot:'bg-blue-500',    label:'Completed' },
    CANCELLED: { bg:'bg-red-50',     text:'text-red-700',     border:'border-red-200',     dot:'bg-red-500',     label:'Cancelled' },
  };
  const st = (s) => STATUS[s] || { bg:'bg-gray-50', text:'text-gray-500', border:'border-gray-200', dot:'bg-gray-400', label: s };

  /* ── filter tabs ── */
  const filters = [
    { key:'all',       label:'All'       },
    { key:'ACTIVE',    label:'Active'    },
    { key:'COMPLETED', label:'Completed' },
    { key:'CANCELLED', label:'Cancelled' },
  ];

  /* ── loading skeleton ── */
  if (loading) return (
    <div className="space-y-4 animate-pulse" style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <div className="h-8 w-48 bg-gray-100 rounded-xl"/>
      <div className="h-10 w-72 bg-gray-100 rounded-2xl"/>
      {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl"/>)}
    </div>
  );

  return (
    <div className="space-y-5" style={{ fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Trip Schedules</h2>
          <p className="text-gray-400 text-sm mt-0.5">Manage departure times and active trips</p>
        </div>
        <Link to="/traveler/add-schedule"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-black shadow-sm transition-all hover:opacity-90"
          style={{ background:'linear-gradient(135deg,#f97415,#ea580c)' }}>
          <Plus className="w-4 h-4"/> Add Schedule
        </Link>
      </div>

      {/* ── Filter pills ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              filter === f.key
                ? 'text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500'
            }`}
            style={filter === f.key ? { background:'linear-gradient(135deg,#f97415,#ea580c)' } : {}}>
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 font-semibold">{schedules.length} schedule{schedules.length !== 1 ? 's' : ''}</span>
      </div>

      {/* ── Schedule cards ── */}
      <div className="space-y-3">
        <AnimatePresence>
          {schedules.map((s, i) => {
            const cfg = st(s.schedule_status);
            return (
              <motion.div key={s.schedule_id || i}
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, height:0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-100 transition-all overflow-hidden">

                {/* top accent line */}
                <div className="h-[2px]"
                  style={{ background:`linear-gradient(90deg,${s.schedule_status === 'ACTIVE' ? '#10b981' : s.schedule_status === 'CANCELLED' ? '#ef4444' : '#6366f1'},transparent)` }}/>

                <div className="p-5 flex flex-col lg:flex-row gap-5 items-start lg:items-center">

                  {/* ── Col 1: Time + Date + Status ── */}
                  <div className="flex items-center gap-4 lg:flex-col lg:items-center lg:gap-1 lg:min-w-[100px]">
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-900 leading-none">
                        {s.departure_time || '—'}
                      </p>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">
                        {fmtDate(s.journey_date)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>
                      {cfg.label}
                    </span>
                  </div>

                  {/* divider */}
                  <div className="hidden lg:block w-px h-16 bg-gray-100 flex-shrink-0"/>

                  {/* ── Col 2: Route ── */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {s.bus?.bus_number && (
                        <span className="text-[10px] font-black bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">
                          {s.bus.bus_number}
                        </span>
                      )}
                      {s.bus?.bus_type && (
                        <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded-lg">
                          {s.bus.bus_type}
                        </span>
                      )}
                    </div>

                    {/* from → to */}
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-base font-black text-gray-900 leading-tight">
                          {s.bus?.from_location || s.from_location || '—'}
                        </p>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Origin</p>
                      </div>
                      <div className="flex items-center gap-1 text-gray-300">
                        <div className="w-6 h-px bg-gray-200"/>
                        <ArrowRight className="w-4 h-4 text-orange-400"/>
                        <div className="w-6 h-px bg-gray-200"/>
                      </div>
                      <div>
                        <p className="text-base font-black text-gray-900 leading-tight">
                          {s.bus?.to_location || s.to_location || '—'}
                        </p>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Destination</p>
                      </div>
                    </div>
                  </div>

                  {/* divider */}
                  <div className="hidden lg:block w-px h-16 bg-gray-100 flex-shrink-0"/>

                  {/* ── Col 3: Stats ── */}
                  <div className="flex items-center gap-6 w-full lg:w-auto border-t border-gray-50 lg:border-0 pt-4 lg:pt-0">

                    {/* Seats */}
                    <div>
                      <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-black text-gray-400 mb-1">
                        <Users className="w-3 h-3"/> Seats
                      </div>
                      <p className="text-sm font-black text-gray-900">
                        {s.booked_seats || 0}
                        <span className="text-gray-400 font-semibold"> / {s.total_seats || s.bus?.total_seats || '—'}</span>
                      </p>
                      {/* occupancy bar */}
                      <div className="w-20 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full rounded-full bg-orange-400 transition-all"
                          style={{ width:`${Math.min(100, ((s.booked_seats||0) / (s.total_seats||1)) * 100)}%` }}/>
                      </div>
                    </div>

                    {/* Fare */}
                    <div>
                      <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-black text-gray-400 mb-1">
                        <IndianRupee className="w-3 h-3"/> Fare
                      </div>
                      <p className="text-sm font-black text-orange-500">{fmtCurrency(s.bus?.fare || s.fare)}</p>
                    </div>

                    {/* Available */}
                    {s.available_seats != null && (
                      <div>
                        <div className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-1">Available</div>
                        <p className={`text-sm font-black ${s.available_seats > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {s.available_seats}
                        </p>
                      </div>
                    )}

                    {/* Cancel button */}
                    {s.schedule_status === 'ACTIVE' && (
                      <button onClick={() => handleCancel(s.schedule_id)}
                        className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-red-500 text-xs font-black hover:bg-red-100 transition-all">
                        <Trash2 className="w-3.5 h-3.5"/> Cancel
                      </button>
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty state */}
        {schedules.length === 0 && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-orange-400"/>
            </div>
            <h3 className="font-black text-gray-900 mb-1">No schedules found</h3>
            <p className="text-gray-400 text-sm mb-5">
              {filter === 'all' ? 'Create a schedule to start selling tickets' : `No ${filter.toLowerCase()} schedules`}
            </p>
            {filter === 'all' && (
              <Link to="/traveler/add-schedule"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-black shadow-sm"
                style={{ background:'linear-gradient(135deg,#f97415,#ea580c)' }}>
                <Plus className="w-4 h-4"/> Create First Schedule
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScheduleList;