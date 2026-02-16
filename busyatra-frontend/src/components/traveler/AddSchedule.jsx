import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, IndianRupee, Save, Bus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import travelerService from '../../services/travelerService';
import toast from 'react-hot-toast';

const AddSchedule = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState([]);

  const [formData, setFormData] = useState({
    bus_id: '',
    departure_time: '',
    arrival_time: '',
    date: '',
    fare: '',
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await travelerService.getBuses();
      setBuses(response.data || []);
    } catch (error) {
      console.error('Failed to load buses:', error);
      toast.error('Failed to load buses');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectedBus = buses.find(b => b.bus_id.toString() === formData.bus_id);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // ✅ Backend expects journey_date, departure_time, arrival_time
    const payload = {
      bus_id: formData.bus_id, // Keep as string, backend will handle conversion
      journey_date: formData.date, // YYYY-MM-DD format
      departure_time: formData.departure_time, // HH:MM format
      arrival_time: formData.arrival_time, // HH:MM format
    };

    console.log('📤 Form Data:', formData);
    console.log('📤 Sending payload:', payload);
    console.log('📤 Payload keys:', Object.keys(payload));
    console.log('📤 Payload values:', Object.values(payload));

    const response = await travelerService.createSchedule(payload);
    console.log('✅ Response:', response);
    
    toast.success('Schedule created successfully!');
    navigate('/traveler/schedules');
  } catch (error) {
    console.error('❌ Full error object:', error);
    console.error('❌ Error response:', error.response);
    console.error('❌ Error response data:', error.response?.data);
    
    const errorMessage = error.response?.data?.error
      || error.response?.data?.message 
      || error.message 
      || 'Failed to create schedule';
    
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Add <span className="text-primary">Schedule</span></h2>
        <p className="text-gray-600 mt-2">Plan a new journey for your fleet.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="space-y-6">
          {/* Section 1: Bus Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Bus className="w-5 h-5 text-primary" /> Select Bus
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Choose Vehicle</label>
              <select
                name="bus_id"
                required
                value={formData.bus_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-1 focus:ring-primary/50 outline-none transition appearance-none"
              >
                <option value="" className="bg-white text-gray-500">Select a bus...</option>
                {buses.map(bus => (
                  <option key={bus.bus_id} value={bus.bus_id} className="bg-white text-gray-900">
                    {bus.bus_number} - {bus.bus_type} ({bus.from_location} to {bus.to_location})
                  </option>
                ))}
              </select>
            </div>

            {/* Display Selected Bus Route for Confirmation */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: selectedBus ? 1 : 0, height: selectedBus ? 'auto' : 0 }}
              className="overflow-hidden"
            >
              {selectedBus && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs uppercase">Route</span>
                      <div className="flex items-center gap-2 font-medium text-gray-900">
                        {selectedBus.from_location} <ArrowRight className="w-3 h-3 text-gray-400" /> {selectedBus.to_location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 text-xs uppercase">Base Fare</span>
                    <div className="font-bold text-primary">{selectedBus.fare} INR</div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Section 2: Timing & Fare */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Calendar className="w-5 h-5 text-primary" /> Journey Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Journey Date</label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-1 focus:ring-primary/50 outline-none transition appearance-none calendar-light"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Trip Fare (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    name="fare"
                    value={formData.fare}
                    onChange={handleChange}
                    placeholder={selectedBus ? `Default: ${selectedBus.fare}` : 'Enter amount'}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary/50 outline-none transition"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Optional - Leave empty to use bus default fare</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Departure Time</label>
                <div className="relative">
                  <input
                    type="time"
                    name="departure_time"
                    required
                    value={formData.departure_time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-1 focus:ring-primary/50 outline-none transition appearance-none"
                  />
                  <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Arrival Time</label>
                <div className="relative">
                  <input
                    type="time"
                    name="arrival_time"
                    required
                    value={formData.arrival_time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-1 focus:ring-primary/50 outline-none transition appearance-none"
                  />
                  <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/traveler/schedules')}
            className="px-6 py-3 rounded-xl text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-primary hover:bg-orange-600 rounded-xl text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" /> Create Schedule
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSchedule;