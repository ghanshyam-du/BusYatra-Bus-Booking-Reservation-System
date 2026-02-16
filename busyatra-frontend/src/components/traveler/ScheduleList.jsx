
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, IndianRupee, Users, ArrowRight, Trash2, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import travelerService from '../../services/travelerService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSchedules();
  }, [filter]);

  const fetchSchedules = async () => {
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      const response = await travelerService.getSchedules(params);
      setSchedules(response.data || []);
    } catch (error) {
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (!confirm('Are you sure? This will cancel the schedule.')) return;

    try {
      await travelerService.deleteSchedule(scheduleId);
      toast.success('Schedule cancelled successfully');
      setSchedules(schedules.filter(s => s.schedule_id !== scheduleId));
    } catch (error) {
      toast.error(error.message || 'Failed to cancel schedule');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filterButtons = [
    { key: 'all', label: 'All' },
    { key: 'SCHEDULED', label: 'Scheduled' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Trip <span className="text-primary">Schedules</span></h2>
          <p className="text-gray-500 text-sm mt-1">Manage departure times and active trips</p>
        </div>
        <Link
          to="/traveler/add-schedule"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-orange-600 text-white rounded-xl transition font-medium shadow-lg shadow-primary/20"
        >
          <Calendar className="w-4 h-4" />
          Add Schedule
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-[#12121c] rounded-2xl p-2 border border-white/5 inline-flex">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filter === btn.key
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Schedules List */}
      <div className="space-y-4">
        <AnimatePresence>
          {schedules.map((schedule, index) => (
            <motion.div
              key={schedule.schedule_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#12121c] rounded-2xl p-5 border border-white/5 hover:border-primary/30 transition-all group"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Time & Date Column */}
                <div className="flex flex-col items-center lg:items-start min-w-[120px] text-center lg:text-left">
                  <div className="text-2xl font-bold text-white">
                    {new Date(schedule.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-1">
                    {new Date(schedule.departure_time).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
                  </div>
                  <div className={`mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${schedule.status === 'SCHEDULED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      schedule.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-gray-800 text-gray-400 border-gray-700'
                    }`}>
                    {schedule.status}
                  </div>
                </div>

                {/* Route & Bus Info */}
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-400 text-sm font-medium">{schedule.bus?.bus_number}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span className="text-primary text-sm font-medium">{schedule.bus?.bus_type}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent -z-10" />

                        <div className="bg-[#12121c] pr-4">
                          <p className="text-white font-bold text-lg">{schedule.bus?.from_location}</p>
                          <p className="text-xs text-gray-500">Source</p>
                        </div>
                        <div className="bg-[#12121c] pl-4 text-right">
                          <p className="text-white font-bold text-lg">{schedule.bus?.to_location}</p>
                          <p className="text-xs text-gray-500">Destination</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seats & Price */}
                <div className="flex items-center gap-8 border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-6 w-full lg:w-auto justify-between lg:justify-start">
                  <div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs uppercase tracking-wider mb-1">
                      <Users className="w-3.5 h-3.5" /> Booked
                    </div>
                    <p className="text-white font-bold">
                      {schedule.booked_seats || 0} <span className="text-gray-600 font-normal">/ {schedule.bus?.total_seats}</span>
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs uppercase tracking-wider mb-1">
                      <IndianRupee className="w-3.5 h-3.5" /> Fare
                    </div>
                    <p className="text-primary font-bold text-lg">{formatCurrency(schedule.fare)}</p>
                  </div>

                  {schedule.status === 'SCHEDULED' && (
                    <button
                      onClick={() => handleDelete(schedule.schedule_id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition ml-2"
                      title="Cancel Schedule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {schedules.length === 0 && (
          <div className="text-center py-16 bg-[#12121c] rounded-2xl border border-white/5">
            <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <h3 className="text-white font-medium">No schedules found</h3>
            <p className="text-gray-500 text-sm mt-1">Create a schedule to start selling tickets</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleList;