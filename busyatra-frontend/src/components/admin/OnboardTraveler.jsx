
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Phone, MapPin } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const OnboardTraveler = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    company_name: '',
    business_contact: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminService.onboardTraveler(formData);
      toast.success('Traveler onboarded successfully!');
      navigate('/admin/travelers');
    } catch (error) {
      toast.error(error.message || 'Failed to onboard traveler');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/travelers')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-2xl font-bold">Onboard New Traveler</h2>
          <p className="text-gray-600 mt-1">Convert an existing user to traveler</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID * <span className="text-xs text-gray-500">(e.g., USR000001)</span>
            </label>
            <input
              type="text"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="USR000001"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the user_id of an existing CUSTOMER user to convert them to TRAVELER
            </p>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="ABC Travels Pvt. Ltd."
                required
              />
            </div>
          </div>

          {/* Business Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Contact Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="business_contact"
                value={formData.business_contact}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="9876543210"
                maxLength="10"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Business Address *
            </label>
            
            <div>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Street Address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="City"
                required
              />
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="State"
                required
              />
              <input
                type="text"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Pincode"
                maxLength="6"
                required
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <strong>Note:</strong> Onboarding will:
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Change the user's role from CUSTOMER to TRAVELER</li>
                <li>Create a traveler profile with APPROVED status</li>
                <li>Allow them to add buses and create schedules</li>
              </ul>
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Onboarding...' : 'Onboard Traveler'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/travelers')}
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

export default OnboardTraveler;

