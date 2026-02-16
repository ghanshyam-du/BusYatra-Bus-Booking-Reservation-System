import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Person, Email, Phone, CalendarMonth,
  Edit, Save, Close, DirectionsBus,
  Verified, TrendingUp, LocalOffer,
  CheckCircle
} from '@mui/icons-material';
import { Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    mobile_number: user?.mobile_number || ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.updateProfile(formData);
      updateUser(response.data);
      setEditing(false);
      toast.success('✨ Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      mobile_number: user?.mobile_number || ''
    });
    setEditing(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 p-8 rounded-3xl overflow-hidden bg-linear-to-r from-primary via-orange-500 to-amber-500"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="relative z-10 flex items-center gap-6 flex-wrap">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-24 h-24 rounded-3xl bg-white shadow-2xl shadow-black/20 flex items-center justify-center text-3xl font-black text-primary"
          >
            {getInitials(user?.full_name)}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-black text-white truncate">
                {user?.full_name || 'Guest User'}
              </h1>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <Verified className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white">Verified</span>
              </div>
            </div>
            <p className="text-white/90 mb-3">{user?.email}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                <DirectionsBus className="w-4 h-4" />
                <span>Premium Traveler</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                <Award className="w-4 h-4" />
                <span>Member since {new Date(user?.created_at || Date.now()).getFullYear()}</span>
              </div>
            </div>
          </div>

          {!editing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditing(true)}
              className="p-4 rounded-2xl bg-white hover:bg-white/90 text-primary shadow-xl transition-colors"
            >
              <Edit />
            </motion.button>
          )}
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Profile Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10 mb-8"
      >
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black">Personal Information</h2>
            <p className="text-muted-foreground text-sm">Manage your account details</p>
          </div>
          {editing && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-500/20">
              <Edit className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">Editing Mode</span>
            </div>
          )}
        </div>

        <form onSubmit={handleUpdate} className="p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative group">
                <Person className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                  editing ? "text-primary" : "text-muted-foreground"
                )} />
                <input
                  type="text"
                  value={editing ? formData.full_name : user?.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  disabled={!editing}
                  className={cn(
                    "w-full pl-12 pr-4 py-4 rounded-2xl border-2 font-medium transition-all outline-none",
                    editing
                      ? "bg-background border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10"
                      : "bg-muted border-transparent cursor-not-allowed"
                  )}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Email className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent bg-muted font-medium cursor-not-allowed outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Verified</span>
                </div>
              </div>
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative group">
                <Phone className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                  editing ? "text-primary" : "text-muted-foreground"
                )} />
                <input
                  type="tel"
                  value={editing ? formData.mobile_number : user?.mobile_number || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, mobile_number: value });
                  }}
                  disabled={!editing}
                  maxLength={10}
                  className={cn(
                    "w-full pl-12 pr-4 py-4 rounded-2xl border-2 font-medium transition-all outline-none",
                    editing
                      ? "bg-background border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10"
                      : "bg-muted border-transparent cursor-not-allowed"
                  )}
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Date of Birth
              </label>
              <div className="relative">
                <CalendarMonth className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formatDate(user?.date_of_birth)}
                  disabled
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent bg-muted font-medium cursor-not-allowed outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {editing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 pt-6 border-t border-border/50"
            >
              <button
                type="submit"
                className="flex-1 py-4 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 group"
              >
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-4 px-6 rounded-2xl border-2 border-border hover:bg-muted font-bold transition-all flex items-center justify-center gap-2"
              >
                <Close className="w-5 h-5" />
                Cancel
              </button>
            </motion.div>
          )}
        </form>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-3xl bg-linear-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 group cursor-default"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DirectionsBus className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <TrendingUp className="w-6 h-6 text-blue-600/50 dark:text-blue-400/50" />
          </div>
          <p className="text-4xl font-black mb-2">0</p>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Total Bookings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 group cursor-default"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <TrendingUp className="w-6 h-6 text-emerald-600/50 dark:text-emerald-400/50" />
          </div>
          <p className="text-4xl font-black mb-2">0</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Completed Trips</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-3xl bg-linear-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 group cursor-default"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <LocalOffer className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <TrendingUp className="w-6 h-6 text-amber-600/50 dark:text-amber-400/50" />
          </div>
          <p className="text-4xl font-black mb-2">₹0</p>
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Total Spent</p>
        </motion.div>
      </div>

      {/* Rewards Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-8 rounded-3xl bg-linear-to-r from-primary via-orange-500 to-amber-500 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">Rewards & Benefits</h3>
              <p className="text-white/80 text-sm">Unlock exclusive perks as you travel</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {['10% Cashback', 'Free Cancellation', 'Priority Boarding', 'Lounge Access'].map((benefit, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center hover:bg-white/15 hover:shadow-lg hover:shadow-white/5 transition-colors cursor-default"
              >
                <p className="text-white font-bold text-sm">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </motion.div>
    </div>
  );
};

export default UserProfile;