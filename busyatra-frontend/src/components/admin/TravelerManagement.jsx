
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
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filterButtons = [
    { key: 'all', label: 'All' },
    { key: 'approved', label: 'Approved' },
    { key: 'pending', label: 'Pending' },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Traveler <span className="text-primary">Management</span></h2>
          <p className="text-gray-500 text-sm mt-1">Oversee bus operator partners and approvals</p>
        </div>
        <Link
          to="/admin/travelers/onboard"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-orange-600 text-white rounded-xl transition font-medium shadow-lg shadow-primary/20"
        >
          <UserCheck className="w-4 h-4" />
          Onboard New Traveler
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#12121c] rounded-2xl p-4 border border-white/5 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company, representative, or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-600 focus:ring-1 focus:ring-primary/30 focus:border-primary/30 outline-none transition"
          />
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl overflow-x-auto">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setStatusFilter(btn.key)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === btn.key
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Travelers Grid */}
      {filteredTravelers.length === 0 ? (
        <div className="bg-[#12121c] rounded-2xl p-12 text-center border border-white/5">
          <Building className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-1">No travelers found</h3>
          <p className="text-gray-500 text-sm">Adjust filters or search to find travelers</p>
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
                className="bg-[#12121c] rounded-2xl border border-white/5 overflow-hidden hover:border-primary/30 transition-all group"
              >
                {/* Card Header with Status */}
                <div className="p-5 border-b border-white/5 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-lg font-bold text-white border border-white/10 shadow-inner">
                      {traveler.company_name?.[0] || 'C'}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight">{traveler.company_name}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3" />
                        {traveler.user_id?.full_name || 'No Rep'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${traveler.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      traveler.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                    {traveler.status}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="truncate">{traveler.contact_number}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="truncate">{traveler.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span>Since {new Date(traveler.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(traveler.traveler_id, traveler.status)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${traveler.status === 'approved'
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                      }`}
                  >
                    {traveler.status === 'approved' ? (
                      <>
                        <XCircle className="w-4 h-4" /> Revoke
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" /> Approve
                      </>
                    )}
                  </button>
                  <button className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg border border-white/5 transition">
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
