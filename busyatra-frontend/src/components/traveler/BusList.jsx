// List all buses with add/edit/delete actions
// ----------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Bus as BusIcon, MapPin, IndianRupee, Users } from 'lucide-react';
import travelerService from '../../services/travelerService';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const BusList = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (!confirm('Are you sure you want to delete this bus? This will cancel all future schedules.')) return;

    try {
      await travelerService.deleteBus(busId);
      toast.success('Bus deleted successfully');
      fetchBuses();
    } catch (error) {
      toast.error(error.message || 'Failed to delete bus');
    }
  };

  if (loading) {
    return <div className="bg-white rounded-lg shadow-sm p-8 text-center">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">My Buses</h2>
          <p className="text-gray-600 mt-1">Manage your bus fleet</p>
        </div>
        <Link
          to="/traveler/add-bus"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add New Bus
        </Link>
      </div>

      {/* Bus List */}
      {buses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <BusIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No buses yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first bus</p>
          <Link
            to="/traveler/add-bus"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Your First Bus
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {buses.map((bus) => (
            <div key={bus.bus_id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      bus.is_active ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <BusIcon className={`w-6 h-6 ${bus.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{bus.bus_number}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          bus.is_active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {bus.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {bus.bus_type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <div>
                        <p className="text-xs text-gray-500">From</p>
                        <p className="font-medium text-gray-900">{bus.from_location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <div>
                        <p className="text-xs text-gray-500">To</p>
                        <p className="font-medium text-gray-900">{bus.to_location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <div>
                        <p className="text-xs text-gray-500">Capacity</p>
                        <p className="font-medium text-gray-900">{bus.total_seats} seats</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <IndianRupee className="w-4 h-4" />
                      <div>
                        <p className="text-xs text-gray-500">Fare</p>
                        <p className="font-medium text-gray-900">{formatCurrency(bus.fare)}</p>
                      </div>
                    </div>
                  </div>

                  {bus.amenities && bus.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {bus.amenities.map((amenity, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <Link
                    to={`/traveler/edit-bus/${bus.bus_id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit Bus"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(bus.bus_id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete Bus"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusList;
