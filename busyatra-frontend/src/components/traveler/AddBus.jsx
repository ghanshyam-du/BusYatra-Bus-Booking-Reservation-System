
import React, { useState } from 'react';
import { Bus, MapPin, Users, IndianRupee, Wifi, Coffee, Music, BatteryCharging, ArrowRight, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import travelerService from '../../services/travelerService';
import toast from 'react-hot-toast';

const AddBus = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bus_number: '',
    total_seats: '',
    bus_type: 'AC Seater',
    amenities: [],
    from_location: '',
    to_location: '',
    fare: '',
    departure_time: '',             // Not always needed for "Add Bus" but sometimes kept for defaults
    arrival_time: ''
    // Note: The backend model might separate Bus vs Schedule. 
    // Assuming this component creates a Bus + potentially a default schedule or just the Bus vehicle.
    // Based on previous file analysis, it had fields for locations and fare, so keeping them.
  });

  const amenitiesList = [
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { id: 'charging_point', label: 'Charging Point', icon: BatteryCharging },
    { id: 'water_bottle', label: 'Water Bottle', icon: Coffee },
    { id: 'entertainment', label: 'Entertainment', icon: Music },
  ];

  const busTypes = ['AC Seater', 'AC Sleeper', 'Non-AC Seater', 'Non-AC Sleeper', 'Volvo'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => {
      const amenities = prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId];
      return { ...prev, amenities };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure amenities are comma-separated string if backend expects that, or array.
      // Keeping it as array for now, adjusting to backend likely expecting array or CSV.
      // Based on typical implementations, let's pass it as is or join if needed.
      // The previous file analysis didn't show the submit logic specifics, but usually JSON array is fine.

      const payload = {
        ...formData,
        amenities: formData.amenities.join(','), // Converting to CSV string just in case
        total_seats: parseInt(formData.total_seats),
        fare: parseFloat(formData.fare)
      };

      await travelerService.addBus(payload);
      toast.success('Bus added successfully!');
      navigate('/traveler/buses');
    } catch (error) {
      toast.error(error.message || 'Failed to add bus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Add New <span className="text-primary">Bus</span></h2>
        <p className="text-gray-500 mt-2">Register a new vehicle to your fleet.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#12121c] rounded-2xl p-8 border border-white/5 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Section 1: Bus Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <Bus className="w-5 h-5 text-primary" /> Vehicle Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Bus Number</label>
                <input
                  type="text"
                  name="bus_number"
                  required
                  value={formData.bus_number}
                  onChange={handleChange}
                  placeholder="e.g., KA-01-AB-1234"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:ring-1 focus:ring-primary/50 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Bus Type</label>
                  <select
                    name="bus_type"
                    value={formData.bus_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-1 focus:ring-primary/50 outline-none transition appearance-none"
                  >
                    {busTypes.map(type => (
                      <option key={type} value={type} className="bg-[#12121c]">{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Total Seats</label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="number"
                      name="total_seats"
                      required
                      min="10"
                      max="60"
                      value={formData.total_seats}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:ring-1 focus:ring-primary/50 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Default Fare (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    name="fare"
                    required
                    min="1"
                    value={formData.fare}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:ring-1 focus:ring-primary/50 outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Route & Amenities */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <MapPin className="w-5 h-5 text-primary" /> Route & Amenities
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">From Location</label>
                  <input
                    type="text"
                    name="from_location"
                    required
                    value={formData.from_location}
                    onChange={handleChange}
                    placeholder="Source City"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:ring-1 focus:ring-primary/50 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">To Location</label>
                  <input
                    type="text"
                    name="to_location"
                    required
                    value={formData.to_location}
                    onChange={handleChange}
                    placeholder="Destination City"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:ring-1 focus:ring-primary/50 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Amenities</label>
                <div className="grid grid-cols-2 gap-3">
                  {amenitiesList.map((amenity) => (
                    <div
                      key={amenity.id}
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`cursor-pointer flex items-center gap-3 p-3 rounded-xl border transition-all ${formData.amenities.includes(amenity.id)
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                      <amenity.icon className={`w-4 h-4 ${formData.amenities.includes(amenity.id) ? 'text-primary' : 'text-gray-500'}`} />
                      <span className="text-sm font-medium">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/traveler/buses')}
            className="px-6 py-3 rounded-xl text-gray-400 font-medium hover:text-white hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-primary to-orange-600 rounded-xl text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Bus
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBus;