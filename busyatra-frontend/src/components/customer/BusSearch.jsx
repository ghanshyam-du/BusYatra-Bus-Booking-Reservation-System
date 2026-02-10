import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Calendar,
  ArrowRightLeft,
  Bus,
  Clock,
  Armchair,
  Wifi,
  Coffee,
  BatteryCharging,
  ArrowRight,
  Filter
} from 'lucide-react';
import bookingService from '../../services/bookingService';
import { formatCurrency, formatTime, formatDuration } from '../../utils/formatters';
import toast from 'react-hot-toast';
import SeatSelection from './SeatSelection';
import { cn } from '../../utils/cn';

const BusSearch = () => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: ''
  });
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
      if (response.data?.length === 0) {
        toast.error('No buses found for this route');
      } else {
        toast.success(`Found ${response.data.length} buses!`);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to search buses');
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLocations = () => {
    setSearchParams({
      ...searchParams,
      from: searchParams.to,
      to: searchParams.from,
    });
  };

  const amenities = [
    { icon: Wifi, label: 'WiFi' },
    { icon: Coffee, label: 'Snacks' },
    { icon: BatteryCharging, label: 'Charging' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Search Header & Form */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-linear-to-br from-teal-500 to-emerald-600 rounded-2xl shadow-lg shadow-teal-500/20">
              <Bus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Search Buses</h1>
              <p className="text-gray-500 dark:text-gray-400">Find the perfect ride for your journey</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">

              {/* From */}
              <div className="md:col-span-4 space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">From</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  <input
                    type="text"
                    value={searchParams.from}
                    onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                    placeholder="Source City"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex justify-center pb-2">
                <button
                  type="button"
                  onClick={handleSwapLocations}
                  className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-gray-500 hover:text-teal-600 transition-colors"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </button>
              </div>

              {/* To */}
              <div className="md:col-span-4 space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">To</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    value={searchParams.to}
                    onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                    placeholder="Destination City"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="md:col-span-3 space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Journey Date</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  <input
                    type="date"
                    value={searchParams.date}
                    min={today}
                    onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all dark:text-white cursor-pointer"
                  />
                </div>
              </div>

              {/* Submit - Full width on mobile */}
              <div className="col-span-1 md:col-span-12">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  <span>{loading ? 'Searching buses...' : 'Search Buses'}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {!loading && buses.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Available Buses
                  <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm rounded-full">
                    {buses.length} Found
                  </span>
                </h2>
                <button className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter Results
                </button>
              </div>

              <div className="grid gap-6">
                {buses.map((bus, index) => (
                  <motion.div
                    key={bus.schedule_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">

                      {/* Bus Info */}
                      <div className="flex items-start gap-4 min-w-[200px]">
                        <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl text-teal-600 dark:text-teal-400">
                          <Bus className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-teal-600 transition-colors">
                            {bus.company_name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                            {bus.bus_number}
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            {bus.bus_type}
                          </p>
                          <div className="flex gap-2 mt-3">
                            {amenities.map(({ icon: Icon, label }) => (
                              <div key={label} className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-400" title={label}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="flex-1 flex items-center justify-between px-4 lg:px-12">
                        <div className="text-center">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Departure</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">{formatTime(bus.departure_time)}</p>
                          <p className="text-sm text-gray-500">{bus.from_location}</p>
                        </div>

                        <div className="flex-1 px-4 flex flex-col items-center">
                          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(bus.departure_time, bus.arrival_time)}
                          </div>
                          <div className="w-full h-0.5 bg-gray-200 dark:bg-gray-700 relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-teal-500 rounded-full" />
                            <Bus className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-teal-500" />
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Arrival</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">{formatTime(bus.arrival_time)}</p>
                          <p className="text-sm text-gray-500">{bus.to_location}</p>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center lg:gap-4 pl-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-800 pt-4 lg:pt-0">
                        <div className="text-left lg:text-right">
                          <p className="text-xs text-gray-500 mb-0.5">Starting from</p>
                          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                            {formatCurrency(bus.fare)}
                          </p>
                          <p className={`text-xs font-medium mt-1 ${bus.available_seats < 10 ? 'text-amber-500' : 'text-emerald-500'
                            }`}>
                            {bus.available_seats} Seats Left
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedBus(bus);
                            setShowSeatSelection(true);
                          }}
                          className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                          Select Seats
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* No Results */}
          {!loading && buses.length === 0 && searchParams.from && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800"
            >
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bus className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Buses Found</h3>
              <p className="text-gray-500">We couldn't find any buses for this route on the selected date.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {showSeatSelection && selectedBus && (
          <SeatSelection
            bus={selectedBus}
            onClose={() => {
              setShowSeatSelection(false);
              setSelectedBus(null);
            }}
            onBookingComplete={() => {
              setShowSeatSelection(false);
              setSelectedBus(null);
              setBuses([]);
              toast.success('Booking completed! Check My Bookings');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BusSearch;