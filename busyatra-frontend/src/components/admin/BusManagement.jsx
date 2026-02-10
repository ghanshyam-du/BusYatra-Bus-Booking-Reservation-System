
import React, { useState, useEffect } from 'react';
import { Search, Bus as BusIcon, MapPin, XCircle } from 'lucide-react';
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
    return <div className="bg-white rounded-lg shadow-sm p-8 text-center">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Bus Management</h2>
        <p className="text-gray-600 mt-1">System-wide bus oversight and control</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by bus number, route, or company..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'active' ? 'bg-purple-600 text-white' : 'bg-gray-100'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'inactive' ? 'bg-purple-600 text-white' : 'bg-gray-100'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Bus List */}
      {filteredBuses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <BusIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No buses found</h3>
          <p className="text-gray-600">No buses match your search criteria</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBuses.map((bus) => (
            <div key={bus.bus_id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      bus.is_active ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <BusIcon className={`w-6 h-6 ${bus.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{bus.bus_number}</h3>
                      <p className="text-sm text-gray-600">{bus.traveler_id?.company_name || 'Unknown Company'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      bus.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {bus.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {bus.bus_type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">From</p>
                        <p className="font-medium">{bus.from_location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">To</p>
                        <p className="font-medium">{bus.to_location}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Capacity</p>
                      <p className="font-medium">{bus.total_seats} seats</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fare</p>
                      <p className="font-medium">{formatCurrency(bus.fare)}</p>
                    </div>
                  </div>
                </div>

                {/* Admin Override Action */}
                {bus.is_active && (
                  <button
                    onClick={() => handleDeactivate(bus.bus_id)}
                    className="flex items-center gap-2 ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                    title="Admin Override: Deactivate Bus"
                  >
                    <XCircle className="w-4 h-4" />
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusManagement;
