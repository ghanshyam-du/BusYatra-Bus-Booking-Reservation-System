
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Check, X, Building2 } from 'lucide-react';
import adminService from '../../services/adminService';
import { formatDate, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';

const TravelerManagement = () => {
  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTravelers();
  }, [filter]);

  const fetchTravelers = async () => {
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      
      const response = await adminService.getTravelers(params);
      setTravelers(response.data || []);
    } catch (error) {
      toast.error('Failed to load travelers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (travelerId, status) => {
    const action = status === 'APPROVED' ? 'approve' : 'reject';
    if (!confirm(`Are you sure you want to ${action} this traveler?`)) return;

    try {
      await adminService.updateTravelerStatus(travelerId, status);
      toast.success(`Traveler ${action}d successfully!`);
      fetchTravelers();
    } catch (error) {
      toast.error(error.message || `Failed to ${action} traveler`);
    }
  };

  const filteredTravelers = travelers.filter(traveler => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      traveler.company_name?.toLowerCase().includes(search) ||
      traveler.business_contact?.includes(search) ||
      traveler.user_id?.email?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return <div className="bg-white rounded-lg shadow-sm p-8 text-center">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Traveler Management</h2>
          <p className="text-gray-600 mt-1">Manage bus operators and their verification</p>
        </div>
        <Link
          to="/admin/travelers/onboard"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
        >
          <Plus className="w-5 h-5" />
          Onboard Traveler
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company name, contact, or email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              All ({travelers.length})
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'PENDING' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('APPROVED')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'APPROVED' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('REJECTED')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'REJECTED' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      {/* Travelers List */}
      {filteredTravelers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No travelers found</h3>
          <p className="text-gray-600">No travelers match your search criteria</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTravelers.map((traveler) => (
            <div key={traveler.traveler_id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{traveler.company_name}</h3>
                      <p className="text-sm text-gray-600">{traveler.traveler_id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(traveler.verification_status)}`}>
                      {traveler.verification_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Contact Person</p>
                      <p className="font-medium">{traveler.user_id?.full_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium">{traveler.user_id?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Business Contact</p>
                      <p className="font-medium">{traveler.business_contact}</p>
                    </div>
                  </div>

                  {traveler.address && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Address:</span> {traveler.address.street}, {traveler.address.city}, {traveler.address.state} - {traveler.address.pincode}
                    </div>
                  )}

                  <div className="mt-3 text-xs text-gray-500">
                    Registered on {formatDate(traveler.created_at)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  {traveler.verification_status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(traveler.traveler_id, 'APPROVED')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(traveler.traveler_id, 'REJECTED')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                  {traveler.verification_status === 'REJECTED' && (
                    <button
                      onClick={() => handleStatusUpdate(traveler.traveler_id, 'APPROVED')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <Check className="w-4 h-4" />
                      Approve Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelerManagement;
