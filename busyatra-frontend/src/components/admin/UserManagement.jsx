import React, { useState, useEffect } from 'react';
import { Search, UserX, UserCheck, Shield, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import adminService from '../../services/adminService';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const params = {};
      if (filter !== 'all') params.role = filter;
      const response = await adminService.getUsers(params);
      setUsers(response.data || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    if (!confirm("Are you sure you want to toggle this user's status?")) return;
    try {
      await adminService.toggleUserStatus(userId);
      toast.success('User status updated successfully!');
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.mobile_number?.includes(search)
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
    { key: 'all',      label: 'All Users'  },
    { key: 'CUSTOMER', label: 'Customers'  },
    { key: 'TRAVELER', label: 'Travelers'  },
    { key: 'ADMIN',    label: 'Admins'     },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User <span className="text-orange-500">Management</span></h2>
        <p className="text-gray-500 text-sm mt-1">Manage and monitor all platform users</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or mobile..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none transition"
          />
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl flex-wrap">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === btn.key
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white'
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.user_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-700 font-bold text-sm border border-orange-200">
                          {user.full_name?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{user.full_name}</p>
                          <p className="text-xs text-gray-400 font-mono">{user.user_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-700">{user.email}</p>
                        <p className="text-xs text-gray-400">{user.mobile_number}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 border ${
                        user.role === 'ADMIN'    ? 'bg-purple-100 text-purple-700 border-purple-300' :
                        user.role === 'TRAVELER' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                                   'bg-gray-100 text-gray-600 border-gray-300'
                      }`}>
                        {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        user.is_active
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                          : 'bg-red-100 text-red-700 border-red-300'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(user.user_id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                          user.is_active
                            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {user.is_active
                          ? <><UserX className="w-3.5 h-3.5" /> Deactivate</>
                          : <><UserCheck className="w-3.5 h-3.5" /> Activate</>
                        }
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No users found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;