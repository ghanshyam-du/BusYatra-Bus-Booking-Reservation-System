// Edit existing bus
// ----------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bus as BusIcon, MapPin, IndianRupee, Users } from 'lucide-react';
import travelerService from '../../services/travelerService';
import toast from 'react-hot-toast';

const EditBus = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bus_number: '',
    bus_type: 'SEATER',
    from_location: '',
    to_location: '',
    departure_time: '',
    arrival_time: '',
    total_seats: 40,
    fare: '',
    amenities: []
  });

  const busTypes = ['SEATER', 'SLEEPER', 'SEMI_SLEEPER', 'AC', 'NON_AC', 'VOLVO'];
  const amenityOptions = ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket', 'Pillow', 'Reading Light', 'Emergency Exit'];

  useEffect(() => {
    fetchBusDetails();
  }, [busId]);

  const fetchBusDetails = async () => {
    try {
      const response = await travelerService.getBuses();
      const bus = response.data?.find(b => b.bus_id === busId);
      if (bus) {
        setFormData({
          bus_number: bus.bus_number,
          bus_type: bus.bus_type,
          from_location: bus.from_location,
          to_location: bus.to_location,
          departure_time: bus.departure_time,
          arrival_time: bus.arrival_time,
          total_seats: bus.total_seats,
          fare: bus.fare,
          amenities: bus.amenities || []
        });
      }
    } catch (error) {
      toast.error('Failed to load bus details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenityToggle = (amenity) => {
    const current = formData.amenities || [];
    if (current.includes(amenity)) {
      setFormData({ ...formData, amenities: current.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...current, amenity] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await travelerService.updateBus(busId, {
        ...formData,
        total_seats: parseInt(formData.total_seats),
        fare: parseFloat(formData.fare)
      });
      toast.success('Bus updated successfully!');
      navigate('/traveler');
    } catch (error) {
      toast.error(error.message || 'Failed to update bus');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="bg-white rounded-lg shadow-sm p-8 text-center">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/traveler')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-2xl font-bold">Edit Bus</h2>
          <p className="text-gray-600 mt-1">Update bus details</p>
        </div>
      </div>

      {/* Form - Similar to AddBus but with pre-filled data */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Same fields as AddBus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bus Number *</label>
              <input
                type="text"
                name="bus_number"
                value={formData.bus_number}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Bus number cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bus Type *</label>
              <select
                name="bus_type"
                value={formData.bus_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                {busTypes.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fare per Seat (₹) *</label>
              <input
                type="number"
                name="fare"
                value={formData.fare}
                onChange={handleChange}
                min="1"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {amenityOptions.map(amenity => (
                <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities?.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Bus'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/traveler')}
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

export default EditBus;
