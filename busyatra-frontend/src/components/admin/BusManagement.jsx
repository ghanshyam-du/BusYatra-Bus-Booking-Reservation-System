import React, { useState, useEffect } from 'react';
import { Search, Bus as BusIcon, MapPin, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBuses();
  }, [statusFilter]);

  const fetchBuses = async () => {
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const response = await adminService.getAllBuses(params);
      setBuses(response.data || []);
    } catch (error) {
      toast.error('Failed to load buses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (busId) => {
    if (!confirm('Are you sure? This will deactivate the bus and cancel all future schedules.')) return;
    try {
      await adminService.deactivateBus(busId);
      toast.success('Bus deactivated successfully!');
      fetchBuses();
    } catch (error) {
      toast.error(error.message || 'Failed to deactivate bus');
    }
  };

  const filteredBuses = buses.filter(bus => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      bus.bus_number?.toLowerCase().includes(search) ||
      bus.from_location?.toLowerCase().includes(search) ||
      bus.to_location?.toLowerCase().includes(search) ||
      bus.traveler_id?.company_name?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filterButtons = [
    { key: 'all',      label: 'All'      },
    { key: 'active',   label: 'Active'   },
    { key: 'inactive', label: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bus <span className="text-orange-500">Management</span></h2>
        <p className="text-gray-500 text-sm mt-1">System-wide bus oversight and control</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by bus number, route, or company..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition"
            />
          </div>
          <div className="flex gap-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setStatusFilter(btn.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${statusFilter === btn.key
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                  }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bus List */}
      {filteredBuses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
          <BusIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No buses found</h3>
          <p className="text-gray-400 text-sm">No buses match your search criteria</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBuses.map((bus, index) => (
            <motion.div
              key={bus.bus_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bus.is_active ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                      <BusIcon className={`w-5 h-5 ${bus.is_active ? 'text-emerald-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{bus.bus_number}</h3>
                      <p className="text-xs text-gray-500">{bus.traveler_id?.company_name || 'Unknown Company'}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${bus.is_active
                        ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
                        : 'bg-gray-100 text-gray-500 ring-1 ring-gray-300'
                      }`}>
                      {bus.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold ring-1 ring-orange-300">
                      {bus.bus_type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">From</p>
                        <p className="text-sm font-semibold text-gray-700">{bus.from_location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">To</p>
                        <p className="text-sm font-semibold text-gray-700">{bus.to_location}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Capacity</p>
                      <p className="text-sm font-semibold text-gray-700">{bus.total_seats} seats</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Fare</p>
                      <p className="text-sm font-semibold text-orange-600">{formatCurrency(bus.fare)}</p>
                    </div>
                  </div>
                </div>

                {bus.is_active && (
                  <div className="flex items-start">
                    <button
                      onClick={() => handleDeactivate(bus.bus_id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition text-sm font-semibold ring-1 ring-red-200"
                    >
                      <XCircle className="w-4 h-4" />
                      Deactivate
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusManagement;