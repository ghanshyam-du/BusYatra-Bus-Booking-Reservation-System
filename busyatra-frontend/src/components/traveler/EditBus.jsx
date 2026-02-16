
import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Users, IndianRupee, Wifi, Coffee, Music, BatteryCharging, ArrowRight, Save, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import travelerService from '../../services/travelerService';
import toast from 'react-hot-toast';

const EditBus = () => {
  const navigate = useNavigate();
  const { busId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    bus_number: '',
    total_seats: '',
    bus_type: 'AC Seater',
    amenities: [],
    from_location: '',
    to_location: '',
    fare: '',
  });

  const amenitiesList = [
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { id: 'charging_point', label: 'Charging Point', icon: BatteryCharging },
    { id: 'water_bottle', label: 'Water Bottle', icon: Coffee },
    { id: 'entertainment', label: 'Entertainment', icon: Music },
  ];

  const busTypes = ['AC Seater', 'AC Sleeper', 'Non-AC Seater', 'Non-AC Sleeper', 'Volvo'];

  useEffect(() => {
    fetchBusDetails();
  }, [busId]);

  const fetchBusDetails = async () => {
    try {
      const response = await travelerService.getBus(busId);
      const bus = response.data;

      // Parse amenities if they are stored as string
      let amenities = [];
      if (typeof bus.amenities === 'string') {
        amenities = bus.amenities.split(',').filter(Boolean);
      } else if (Array.isArray(bus.amenities)) {
        amenities = bus.amenities;
      }

      setFormData({
        bus_number: bus.bus_number,
        total_seats: bus.total_seats,
        bus_type: bus.bus_type,
        amenities: amenities,
        from_location: bus.from_location,
        to_location: bus.to_location,
        fare: bus.fare,
      });
    } catch (error) {
      toast.error('Failed to load bus details');
      navigate('/traveler/buses');
    } finally {
      setLoading(false);
    }
  };

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
    setSaving(true);

    try {
      const payload = {
        ...formData,
        amenities: formData.amenities.join(','),
        total_seats: parseInt(formData.total_seats),
        fare: parseFloat(formData.fare)
      };

      await travelerService.updateBus(busId, payload);
      toast.success('Bus updated successfully!');
      navigate('/traveler/buses');
    } catch (error) {
      toast.error(error.message || 'Failed to update bus');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/traveler/buses')}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Buses
        </button>
        <h2 className="text-3xl font-bold text-gray-900">Edit <span className="text-primary">Bus</span></h2>
        <p className="text-gray-600 mt-2">Update vehicle information and settings.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Section 1: Bus Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Bus className="w-5 h-5 text-primary" /> Vehicle Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bus Number</label>
                <input
                  type="text"
                  name="bus_number"
                  required
                  value={formData.bus_number}
                  onChange={handleChange}
                  placeholder="e.g., KA-01-AB-1234"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary/50 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bus Type</label>
                  <select
                    name="bus_type"
                    value={formData.bus_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-1 focus:ring-primary/50 outline-none transition appearance-none"
                  >
                    {busTypes.map(type => (
                      <option key={type} value={type} className="bg-white text-gray-900">{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Seats</label>
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
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary/50 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Fare (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    name="fare"
                    required
                    min="1"
                    value={formData.fare}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary/50 outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Route & Amenities */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <MapPin className="w-5 h-5 text-primary" /> Route & Amenities
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">From Location</label>
                  <input
                    type="text"
                    name="from_location"
                    required
                    value={formData.from_location}
                    onChange={handleChange}
                    placeholder="Source City"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary/50 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">To Location</label>
                  <input
                    type="text"
                    name="to_location"
                    required
                    value={formData.to_location}
                    onChange={handleChange}
                    placeholder="Destination City"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary/50 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                <div className="grid grid-cols-2 gap-3">
                  {amenitiesList.map((amenity) => (
                    <div
                      key={amenity.id}
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`cursor-pointer flex items-center gap-3 p-3 rounded-xl border transition-all ${formData.amenities.includes(amenity.id)
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
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
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/traveler/buses')}
            className="px-6 py-3 rounded-xl text-gray-500 font-medium hover:text-gray-900 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-primary hover:bg-orange-600 rounded-xl text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2"
          >
            {saving ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" /> Update Bus
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBus;