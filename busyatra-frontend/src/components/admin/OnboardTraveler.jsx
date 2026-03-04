import React, { useState, useEffect } from 'react';
import { UserCheck, Building, Mail, Phone, MapPin, Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const OnboardTraveler = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    company_name: '',
    business_contact: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  useEffect(() => {
    fetchPotentialTravelers();
  }, []);

 const fetchPotentialTravelers = async () => {
  try {
    const response = await adminService.getUsers({});  // ← remove role filter
    console.log('API Response:', response);

    let allUsers = [];
    if (Array.isArray(response)) allUsers = response;
    else if (Array.isArray(response?.data)) allUsers = response.data;
    else if (Array.isArray(response?.data?.data)) allUsers = response.data.data;

    // Filter out admins on frontend
    const customers = allUsers.filter(u => 
      u.role !== 'ADMIN' && u.role !== 'TRAVELER'
    );
    setUsers(customers);
  } catch (error) {
    console.error('Fetch users error:', error);
    toast.error('Failed to load eligible users');
  }
};

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setFormData(prev => ({
      ...prev,
      business_contact: user.mobile_number || ''
    }));
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error('Please select a user to onboard');
      return;
    }

    setLoading(true);
    try {
      await adminService.onboardTraveler({
        user_id: selectedUser.user_id,
        company_name: formData.company_name,
        business_contact: formData.business_contact,
        address: formData.address
      });
      toast.success('Traveler onboarded successfully!');
      navigate('/admin/travelers');
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Failed to onboard traveler');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Onboard <span className="text-primary">Traveler</span></h2>
        <p className="text-gray-500 mt-2">Convert an existing customer into a bus operator partner.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: User Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#12121c] rounded-2xl p-6 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">1</span>
              Select User
            </h3>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search customers..."
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-primary/50 outline-none"
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <button
                    key={user.user_id}
                    onClick={() => handleUserSelect(user)}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${
                      selectedUser?.user_id === user.user_id
                        ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20'
                        : 'bg-white/5 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <p className={`font-medium text-sm ${selectedUser?.user_id === user.user_id ? 'text-primary' : 'text-white'}`}>
                      {user.full_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-600 text-sm">
                  No eligible customers found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Company Details Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-[#12121c] rounded-2xl p-8 border border-white/5 relative overflow-hidden">

            {/* Overlay when no user selected */}
            {!selectedUser && (
              <div className="absolute inset-0 bg-[#12121c]/80 backdrop-blur-sm z-10 flex items-center justify-center text-center p-8">
                <div className="max-w-xs">
                  <UserCheck className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Select a user first</h3>
                  <p className="text-gray-500 text-sm">Please select a customer from the left panel to proceed with onboarding.</p>
                </div>
              </div>
            )}

            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">2</span>
              Company Details
            </h3>

            <div className="space-y-5">

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Company Name</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:ring-1 focus:ring-primary/50 outline-none transition"
                    placeholder="e.g., Royal Travels"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Business Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.business_contact}
                      onChange={(e) => setFormData({ ...formData, business_contact: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:ring-1 focus:ring-primary/50 outline-none transition"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Business Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      readOnly
                      value={selectedUser?.email || ''}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Street Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  <textarea
                    required
                    rows="2"
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:ring-1 focus:ring-primary/50 outline-none transition resize-none"
                    placeholder="Street / Area / Locality"
                  />
                </div>
              </div>

              {/* City & State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    value={formData.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:ring-1 focus:ring-primary/50 outline-none transition"
                    placeholder="e.g., Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">State</label>
                  <input
                    type="text"
                    required
                    value={formData.address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:ring-1 focus:ring-primary/50 outline-none transition"
                    placeholder="e.g., Maharashtra"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Pincode</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={formData.address.pincode}
                  onChange={(e) => handleAddressChange('pincode', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:ring-1 focus:ring-primary/50 outline-none transition"
                  placeholder="e.g., 400001"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-primary to-orange-600 rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Complete Onboarding <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="text-center mt-3 text-xs text-gray-500">
                  By clicking submit, you agree to grant this user Traveler privileges.
                </p>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardTraveler;