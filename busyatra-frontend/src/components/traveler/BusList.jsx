
import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Edit, Trash2, Plus, Users, Search, Filter, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import travelerService from '../../services/travelerService';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const BusList = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await travelerService.getBuses();
      setBuses(response.data || []);
    } catch (error) {
      toast.error('Failed to load buses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (busId) => {
    if (!confirm('Are you sure you want to delete this bus?')) return;

    try {
      await travelerService.deleteBus(busId);
      toast.success('Bus deleted successfully');
      setBuses(buses.filter(bus => bus.bus_id !== busId));
    } catch (error) {
      toast.error(error.message || 'Failed to delete bus');
    }
  };

  const filteredBuses = buses.filter(bus => {
    const matchesSearch =
      bus.bus_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.from_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.to_location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || bus.bus_type === typeFilter;

    return matchesSearch && matchesType;
  });

  const busTypes = ['all', 'AC Seater', 'AC Sleeper', 'Non-AC Seater', 'Non-AC Sleeper', 'Volvo'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">My <span className="text-primary">Buses</span></h2>
          <p className="text-gray-500 text-sm mt-1">Manage your fleet and routes</p>
        </div>
        <Link
          to="/traveler/add-bus"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-orange-600 text-white rounded-xl transition font-medium shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Add New Bus
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#12121c] rounded-2xl p-4 border border-white/5 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by bus number or route..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:ring-1 focus:ring-primary/30 focus:border-primary/30 outline-none transition"
          />
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl overflow-x-auto custom-scrollbar">
          {busTypes.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${typeFilter === type
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Bus Grid */}
      {filteredBuses.length === 0 ? (
        <div className="bg-[#12121c] rounded-2xl p-12 text-center border border-white/5">
          <Bus className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-1">No buses found</h3>
          <p className="text-gray-500 text-sm">Add a bus to get started or adjust your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBuses.map((bus, index) => (
              <motion.div
                key={bus.bus_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#12121c] rounded-2xl border border-white/5 overflow-hidden hover:border-primary/30 transition-all group flex flex-col"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-white/5 flex justify-between items-start bg-gradient-to-br from-white/5 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Bus className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{bus.bus_number}</h3>
                      <p className="text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded-full inline-block mt-1 border border-primary/20">
                        {bus.bus_type}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Capacity</p>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{bus.total_seats} Seats</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Base Fare</p>
                      <p className="font-bold text-white">{formatCurrency(bus.fare)}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">From</p>
                        <p className="text-sm font-medium text-white">{bus.from_location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-4 h-4 rounded-full border border-primary flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">To</p>
                        <p className="text-sm font-medium text-white">{bus.to_location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
                  <Link
                    to={`/traveler/edit-bus/${bus.bus_id}`}
                    className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 border border-white/5"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(bus.bus_id)}
                    className="flex-1 py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 border border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BusList;