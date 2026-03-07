import React, { useState, useEffect } from 'react';
import { Search, UserCheck, MapPin, Phone, Building, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const TravelerManagement = () => {
  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchTravelers();
  }, [statusFilter]);

  const fetchTravelers = async () => {
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const response = await adminService.getAllTravelers(params);
      setTravelers(response.data || []);
    } catch (error) {
      toast.error('Failed to load travelers');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (travelerId, currentStatus) => {
    const newStatus = currentStatus === 'approved' ? 'rejected' : 'approved';
    if (!confirm(`Are you sure you want to ${newStatus} this traveler?`)) return;
    try {
      await adminService.updateTravelerStatus(travelerId, newStatus);
      toast.success(`Traveler ${newStatus} successfully!`);
      fetchTravelers();
    } catch (error) {
      toast.error(error.message || 'Failed to update traveler status');
    }
  };

  const filteredTravelers = travelers.filter(traveler => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      traveler.company_name?.toLowerCase().includes(search) ||
      traveler.user_id?.full_name?.toLowerCase().includes(search) ||
      traveler.user_id?.email?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filterButtons = [
    { key: 'all',      label: 'All'      },
    { key: 'approved', label: 'Approved' },
    { key: 'pending',  label: 'Pending'  },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Traveler <span className="text-orange-500">Management</span></h2>
          <p className="text-gray-500 text-sm mt-1">Oversee bus operator partners and approvals</p>
        </div>
        <Link
          to="/admin/travelers/onboard"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition font-semibold shadow-md shadow-orange-200"
        >
          <UserCheck className="w-4 h-4" />
          Onboard New Traveler
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company, representative, or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition"
          />
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl overflow-x-auto">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setStatusFilter(btn.key)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === btn.key
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white'
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Travelers Grid */}
      {filteredTravelers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No travelers found</h3>
          <p className="text-gray-400 text-sm">Adjust filters or search to find travelers</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTravelers.map((traveler, index) => (
              <motion.div
                key={traveler.traveler_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-orange-300 transition-all group"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-lg font-bold text-orange-700 border border-orange-200 shadow-sm">
                      {traveler.company_name?.[0] || 'C'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base leading-tight">{traveler.company_name}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3" />
                        {traveler.user_id?.full_name || 'No Rep'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                    traveler.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                    traveler.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-300' :
                    'bg-amber-100 text-amber-700 border-amber-300'
                  }`}>
                    {traveler.status}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="truncate">{traveler.contact_number}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="truncate">{traveler.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-gray-500" />
                    </div>
                    <span>Since {new Date(traveler.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(traveler.traveler_id, traveler.status)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
                      traveler.status === 'approved'
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {traveler.status === 'approved' ? (
                      <><XCircle className="w-4 h-4" /> Revoke</>
                    ) : (
                      <><CheckCircle className="w-4 h-4" /> Approve</>
                    )}
                  </button>
                  <button className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-600 rounded-lg border border-gray-200 transition text-sm font-medium">
                    View
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TravelerManagement;