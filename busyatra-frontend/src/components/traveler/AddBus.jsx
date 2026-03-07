import React, { useState } from 'react';
import { Bus, MapPin, Users, IndianRupee, Wifi, Coffee, Music, BatteryCharging, Save, Bed, Tv, Lightbulb, LogOut, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import travelerService from '../../services/travelerService';
import toast from 'react-hot-toast';

const AddBus = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [busNumberError, setBusNumberError] = useState('');
  const [formData, setFormData] = useState({
    bus_number: '',
    bus_type: 'AC Seater',
    bus_model: '',
    from_location: '',
    to_location: '',
    total_seats: 40,
    fare: '',
    amenities: [],
  });

  const amenitiesList = [
    { id: 'WiFi', label: 'Wi-Fi', icon: Wifi },
    { id: 'Charging Port', label: 'Charging Port', icon: BatteryCharging },
    { id: 'Water Bottle', label: 'Water Bottle', icon: Coffee },
    { id: 'Blanket', label: 'Blanket', icon: Bed },
    { id: 'TV', label: 'TV', icon: Tv },
    { id: 'Reading Light', label: 'Reading Light', icon: Lightbulb },
    { id: 'Emergency Exit', label: 'Emergency Exit', icon: LogOut },
  ];

  const busTypes = [
    { value: 'AC Sleeper', label: 'AC Sleeper' },
    { value: 'Non-AC Sleeper', label: 'Non-AC Sleeper' },
    { value: 'AC Seater', label: 'AC Seater' },
    { value: 'Non-AC Seater', label: 'Non-AC Seater' },
    { value: 'Semi Sleeper', label: 'Semi Sleeper' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear bus number error when user starts editing
    if (name === 'bus_number') setBusNumberError('');
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

  const validateBusNumber = (busNumber) => {
    const pattern = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
    return pattern.test(busNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusNumberError('');

    // Validate bus number format
    if (!validateBusNumber(formData.bus_number.toUpperCase().trim())) {
      toast.error('Please enter a valid bus number (e.g., GJ01AB1234)');
      return;
    }

    // Validate from/to locations are different
    if (formData.from_location.trim().toLowerCase() === formData.to_location.trim().toLowerCase()) {
      toast.error('From and To locations must be different');
      return;
    }

    // Validate total seats (10–60)
    const totalSeats = parseInt(formData.total_seats);
    if (totalSeats < 10 || totalSeats > 60) {
      toast.error('Total seats must be between 10 and 60');
      return;
    }

    // Validate fare minimum ₹100
    const fare = parseFloat(formData.fare);
    if (isNaN(fare) || fare < 100) {
      toast.error('Fare must be at least ₹100');
      return;
    }

    // Validate all required fields
    if (!formData.bus_number || !formData.bus_type || !formData.bus_model ||
        !formData.from_location || !formData.to_location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await travelerService.addBus({
        ...formData,
        bus_number: formData.bus_number.toUpperCase().trim(),
        bus_model: formData.bus_model.trim(),
        from_location: formData.from_location.trim(),
        to_location: formData.to_location.trim(),
        total_seats: totalSeats,
        fare: fare,
        amenities: formData.amenities,
      });
      toast.success('Bus added successfully!');
      navigate('/traveler/buses');
    } catch (error) {
      // Check specifically for duplicate bus number error
      const isDuplicate =
        error?.response?.data?.error === 'Bus number already exists' ||
        error?.message?.toLowerCase().includes('bus number already exists');

      if (isDuplicate) {
        setBusNumberError('This bus number is already registered. Please use a different bus number.');
      } else {
        toast.error(error.message || 'Failed to add bus');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Add New <span className="text-primary">Bus</span></h2>
        <p className="text-gray-600 mt-2">Register a new vehicle to your fleet.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl space-y-10">

        {/* Section 1: Vehicle Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Bus className="w-5 h-5 text-primary" /> Vehicle Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bus Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bus Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bus_number"
                required
                maxLength={10}
                value={formData.bus_number}
                onChange={(e) => {
                  setBusNumberError('');
                  setFormData(prev => ({ ...prev, bus_number: e.target.value.toUpperCase() }));
                }}
                placeholder="GJ01AB1234"
                className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary/50 outline-none transition ${
                  busNumberError || (formData.bus_number && !validateBusNumber(formData.bus_number.toUpperCase()))
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-300'
                }`}
              />
              <p className="text-xs text-gray-400 mt-1">Format: GJ01AB1234</p>

              {/* ── Duplicate Bus Number Error Banner ── */}
              {busNumberError && (
                <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-600 font-medium">{busNumberError}</p>
                </div>
              )}
            </div>

            {/* Bus Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bus Type <span className="text-red-500">*</span>
              </label>
              <select
                name="bus_type"
                value={formData.bus_type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-1 focus:ring-primary/50 outline-none transition appearance-none"
              >
                {busTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Bus Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bus Model <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bus_model"
                required
                value={formData.bus_model}
                onChange={handleChange}
                placeholder="e.g., Volvo 9600"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary/50 outline-none transition"
              />
              <p className="text-xs text-gray-400 mt-1">Manufacturer &amp; model name</p>
            </div>
          </div>
        </div>

        {/* Section 2: Route Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <MapPin className="w-5 h-5 text-primary" /> Route Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                From Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="from_location"
                required
                value={formData.from_location}
                onChange={handleChange}
                placeholder="e.g., Ahmedabad"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary/50 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                To Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="to_location"
                required
                value={formData.to_location}
                onChange={handleChange}
                placeholder="e.g., Mumbai"
                className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary/50 outline-none transition ${
                  formData.from_location && formData.to_location &&
                  formData.from_location.trim().toLowerCase() === formData.to_location.trim().toLowerCase()
                    ? 'border-red-400'
                    : 'border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Capacity & Pricing */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Users className="w-5 h-5 text-primary" /> Capacity &amp; Pricing
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Total Seats <span className="text-red-500">*</span>
              </label>
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
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary/50 outline-none transition ${
                    formData.total_seats && (parseInt(formData.total_seats) < 10 || parseInt(formData.total_seats) > 60)
                      ? 'border-red-400'
                      : 'border-gray-300'
                  }`}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Between 10 and 60 seats</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Fare per Seat (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  name="fare"
                  required
                  min="100"
                  step="0.01"
                  value={formData.fare}
                  onChange={handleChange}
                  placeholder="500"
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary/50 outline-none transition ${
                    formData.fare && parseFloat(formData.fare) < 100
                      ? 'border-red-400'
                      : 'border-gray-300'
                  }`}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Minimum ₹100</p>
            </div>
          </div>
        </div>

        {/* Section 4: Amenities */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Music className="w-5 h-5 text-primary" /> Amenities &amp; Facilities
          </h3>
          <p className="text-sm text-gray-500">Select the amenities available in your bus (Optional)</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {amenitiesList.map((amenity) => (
              <div
                key={amenity.id}
                onClick={() => handleAmenityToggle(amenity.id)}
                className={`cursor-pointer flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  formData.amenities.includes(amenity.id)
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <amenity.icon className={`w-4 h-4 ${formData.amenities.includes(amenity.id) ? 'text-primary' : 'text-gray-500'}`} />
                <span className="text-sm font-medium">{amenity.label}</span>
              </div>
            ))}
          </div>

          {formData.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.amenities.map(a => (
                <span
                  key={a}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/30 cursor-pointer"
                  onClick={() => handleAmenityToggle(a)}
                >
                  {a} ✕
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions — Edit button removed, only Cancel + Save */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/traveler/buses')}
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