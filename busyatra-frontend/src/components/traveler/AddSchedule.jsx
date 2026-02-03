// Create new schedule (auto-generates seats)
// ----------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Bus as BusIcon } from 'lucide-react';
import travelerService from '../../services/travelerService';
import toast from 'react-hot-toast';

const AddSchedule = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bus_id: '',
    journey_date: '',
    departure_time: '',
    arrival_time: ''
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await travelerService.getBuses();
      setBuses(response.data?.filter(b => b.is_active) || []);
    } catch (error) {
      toast.error('Failed to load buses');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Auto-fill times from selected bus
    if (name === 'bus_id' && value) {
      const selectedBus = buses.find(b => b.bus_id === value);
      if (selectedBus) {
        setFormData(prev => ({
          ...prev,
          departure_time: selectedBus.departure_time,
          arrival_time: selectedBus.arrival_time
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate future date
    const selectedDate = new Date(formData.journey_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error('Journey date must be in the future');
      return;
    }

    setLoading(true);
    try {
      await travelerService.createSchedule(formData);
      toast.success('Schedule created successfully! Seats auto-generated.');
      navigate('/traveler/schedules');
    } catch (error) {
      toast.error(error.message || 'Failed to create schedule');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/traveler/schedules')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-2xl font-bold">Create Schedule</h2>
          <p className="text-gray-600 mt-1">Schedule a bus journey (seats will be auto-generated)</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Bus */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Bus *
            </label>
            <select
              name="bus_id"
              value={formData.bus_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Choose a bus</option>
              {buses.map(bus => (
                <option key={bus.bus_id} value={bus.bus_id}>
                  {bus.bus_number} - {bus.from_location} to {bus.to_location} ({bus.total_seats} seats)
                </option>
              ))}
            </select>
            {buses.length === 0 && (
              <p className="text-sm text-red-600 mt-2">
                No active buses found. Please add a bus first.
              </p>
            )}
          </div>

          {/* Journey Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Journey Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                name="journey_date"
                value={formData.journey_date}
                onChange={handleChange}
                min={today}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure Time *
              </label>
              <input
                type="time"
                name="departure_time"
                value={formData.departure_time}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arrival Time *
              </label>
              <input
                type="time"
                name="arrival_time"
                value={formData.arrival_time}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> When you create this schedule, {formData.bus_id ? buses.find(b => b.bus_id === formData.bus_id)?.total_seats : 'all'} seats will be automatically generated and marked as available for booking.
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || buses.length === 0}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Schedule'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/traveler/schedules')}
              className="px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSchedule;