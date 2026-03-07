import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Person, Email, Phone, CalendarMonth,
  Edit, Save, Close, DirectionsBus,
  Verified, TrendingUp, LocalOffer,
  CheckCircle, AdminPanelSettings, Shield,
  ManageAccounts, Analytics, PeopleAlt,
  Route, Star, Wc, Fingerprint
} from '@mui/icons-material';
import { Award, Briefcase, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// ─── Role config ──────────────────────────────────────────────────────────────

const ROLE_CONFIG = {
  CUSTOMER: {
    label: 'Customer',
    gradient: 'from-primary via-orange-500 to-amber-500',
    icon: <DirectionsBus className="w-4 h-4 text-white" />,
    tagline: 'Premium Traveler',
  },
  TRAVELER: {
    label: 'Traveler / Driver',
    gradient: 'from-blue-600 via-blue-500 to-cyan-400',
    icon: <Route className="w-4 h-4 text-white" />,
    tagline: 'Verified Driver',
  },
  ADMIN: {
    label: 'Administrator',
    gradient: 'from-violet-700 via-purple-600 to-fuchsia-500',
    icon: <Shield className="w-4 h-4 text-white" />,
    tagline: 'System Admin',
  },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonBlock = ({ className }) => (
  <div className={cn('animate-pulse rounded-2xl bg-muted', className)} />
);

const ProfileSkeleton = () => (
  <div className="p-8 space-y-8">
    <SkeletonBlock className="h-48 rounded-3xl" />
    <SkeletonBlock className="h-80 rounded-3xl" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SkeletonBlock className="h-40 rounded-3xl" />
      <SkeletonBlock className="h-40 rounded-3xl" />
      <SkeletonBlock className="h-40 rounded-3xl" />
    </div>
    <SkeletonBlock className="h-48 rounded-3xl" />
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, colors, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={cn(
      'p-6 rounded-3xl border hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 group cursor-default',
      colors.bg, colors.border, colors.hover,
    )}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform', colors.iconBg)}>
        {icon}
      </div>
      <TrendingUp className={cn('w-6 h-6', colors.trend)} />
    </div>
    <p className="text-4xl font-black mb-2">{value}</p>
    <p className={cn('text-sm font-bold', colors.label)}>{label}</p>
  </motion.div>
);

// ─── Field ────────────────────────────────────────────────────────────────────

const Field = ({ label, value, icon, editing = false, badge, onChange, type = 'text', maxLength }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-left pl-1">
      {label}
    </label>
    <div className="relative">
      <span className={cn(
        'absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-4 transition-colors pointer-events-none',
        editing ? 'text-primary' : 'text-muted-foreground/70',
      )}>
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        disabled={!editing}
        maxLength={maxLength}
        className={cn(
          'w-full pl-10 py-3 rounded-xl border font-medium text-sm transition-all outline-none',
          editing
            ? 'bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/10 text-foreground'
            : 'bg-muted/60 border-transparent cursor-default text-foreground/80',
          badge ? 'pr-28' : 'pr-4',
        )}
      />
      {badge && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{badge}</div>
      )}
    </div>
  </div>
);

// ─── Role Stats ───────────────────────────────────────────────────────────────

const CustomerStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatCard delay={0.2} value="0" label="Total Bookings"
      icon={<DirectionsBus className="w-7 h-7 text-blue-600 dark:text-blue-400" />}
      colors={{ bg:'bg-blue-500/10', border:'border-blue-500/20', hover:'hover:shadow-blue-500/10',
        iconBg:'bg-blue-500/10', trend:'text-blue-600/50 dark:text-blue-400/50', label:'text-blue-600 dark:text-blue-400' }} />
    <StatCard delay={0.3} value="0" label="Completed Trips"
      icon={<CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />}
      colors={{ bg:'bg-emerald-500/10', border:'border-emerald-500/20', hover:'hover:shadow-emerald-500/10',
        iconBg:'bg-emerald-500/10', trend:'text-emerald-600/50 dark:text-emerald-400/50', label:'text-emerald-600 dark:text-emerald-400' }} />
    <StatCard delay={0.4} value="₹0" label="Total Spent"
      icon={<LocalOffer className="w-7 h-7 text-amber-600 dark:text-amber-400" />}
      colors={{ bg:'bg-amber-500/10', border:'border-amber-500/20', hover:'hover:shadow-amber-500/10',
        iconBg:'bg-amber-500/10', trend:'text-amber-600/50 dark:text-amber-400/50', label:'text-amber-600 dark:text-amber-400' }} />
  </div>
);

const TravelerStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatCard delay={0.2} value="0" label="Trips Driven"
      icon={<Route className="w-7 h-7 text-blue-600 dark:text-blue-400" />}
      colors={{ bg:'bg-blue-500/10', border:'border-blue-500/20', hover:'hover:shadow-blue-500/10',
        iconBg:'bg-blue-500/10', trend:'text-blue-600/50 dark:text-blue-400/50', label:'text-blue-600 dark:text-blue-400' }} />
    <StatCard delay={0.3} value="0" label="Passengers Served"
      icon={<PeopleAlt className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />}
      colors={{ bg:'bg-emerald-500/10', border:'border-emerald-500/20', hover:'hover:shadow-emerald-500/10',
        iconBg:'bg-emerald-500/10', trend:'text-emerald-600/50 dark:text-emerald-400/50', label:'text-emerald-600 dark:text-emerald-400' }} />
    <StatCard delay={0.4} value="⭐ —" label="Average Rating"
      icon={<Star className="w-7 h-7 text-amber-600 dark:text-amber-400" />}
      colors={{ bg:'bg-amber-500/10', border:'border-amber-500/20', hover:'hover:shadow-amber-500/10',
        iconBg:'bg-amber-500/10', trend:'text-amber-600/50 dark:text-amber-400/50', label:'text-amber-600 dark:text-amber-400' }} />
  </div>
);

const AdminStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatCard delay={0.2} value="—" label="Total Users"
      icon={<Users className="w-7 h-7 text-violet-600 dark:text-violet-400" />}
      colors={{ bg:'bg-violet-500/10', border:'border-violet-500/20', hover:'hover:shadow-violet-500/10',
        iconBg:'bg-violet-500/10', trend:'text-violet-600/50 dark:text-violet-400/50', label:'text-violet-600 dark:text-violet-400' }} />
    <StatCard delay={0.3} value="—" label="Active Trips"
      icon={<DirectionsBus className="w-7 h-7 text-fuchsia-600 dark:text-fuchsia-400" />}
      colors={{ bg:'bg-fuchsia-500/10', border:'border-fuchsia-500/20', hover:'hover:shadow-fuchsia-500/10',
        iconBg:'bg-fuchsia-500/10', trend:'text-fuchsia-600/50 dark:text-fuchsia-400/50', label:'text-fuchsia-600 dark:text-fuchsia-400' }} />
    <StatCard delay={0.4} value="—" label="Revenue Today"
      icon={<Analytics className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />}
      colors={{ bg:'bg-indigo-500/10', border:'border-indigo-500/20', hover:'hover:shadow-indigo-500/10',
        iconBg:'bg-indigo-500/10', trend:'text-indigo-600/50 dark:text-indigo-400/50', label:'text-indigo-600 dark:text-indigo-400' }} />
  </div>
);

// ─── Gradient Panel ───────────────────────────────────────────────────────────

const GradientPanel = ({ gradient, title, subtitle, headerIcon, items }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className={cn('mt-8 p-8 rounded-3xl bg-gradient-to-r relative overflow-hidden', gradient)}
  >
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          {headerIcon}
        </div>
        <div>
          <h3 className="text-2xl font-black text-white">{title}</h3>
          <p className="text-white/80 text-sm">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {items.map((item, i) => (
          <motion.div key={i} whileHover={{ scale: 1.05, y: -2 }}
            className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center hover:bg-white/15 transition-colors cursor-default">
            <p className="text-white font-bold text-sm">{item}</p>
          </motion.div>
        ))}
      </div>
    </div>
    <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const UserProfile = () => {
  const { user, loading, updateUser, role } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', mobile_number: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        mobile_number: user.mobile_number || '',
      });
    }
  }, [user]);

  if (loading) return <ProfileSkeleton />;
  if (!user) return null;

  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.CUSTOMER;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await authService.updateProfile(formData);
      updateUser(response.data);
      setEditing(false);
      toast.success('✨ Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ full_name: user.full_name || '', mobile_number: user.mobile_number || '' });
    setEditing(false);
  };

  return (
    <div className="p-8">

      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('relative mb-8 p-8 rounded-3xl overflow-hidden bg-gradient-to-r', cfg.gradient)}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="relative z-10 flex items-center gap-6 flex-wrap">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-24 h-24 rounded-3xl bg-white shadow-2xl shadow-black/20 flex items-center justify-center text-3xl font-black text-primary select-none"
          >
            {getInitials(user.full_name)}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-black text-white truncate">
                {user.full_name || 'Guest User'}
              </h1>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <Verified className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white">Verified</span>
              </div>
              <div className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold',
                user.is_active
                  ? 'bg-emerald-500/20 border-emerald-400/30 text-white'
                  : 'bg-red-500/20 border-red-400/30 text-white',
              )}>
                <span className={cn('w-2 h-2 rounded-full', user.is_active ? 'bg-emerald-400' : 'bg-red-400')} />
                {user.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>

            <p className="text-white/90 mb-3">{user.email}</p>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                {cfg.icon}
                <span>{cfg.tagline}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-bold uppercase tracking-wider">
                <ManageAccounts className="w-4 h-4" />
                <span>{cfg.label}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                <Award className="w-4 h-4" />
                <span>Member since {new Date(user.createdAt || Date.now()).getFullYear()}</span>
              </div>
            </div>
          </div>

          {!editing && (
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setEditing(true)}
              className="p-4 rounded-2xl bg-white hover:bg-white/90 text-primary shadow-xl transition-colors"
            >
              <Edit />
            </motion.button>
          )}
        </div>

        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </motion.div>

      {/* ── Personal Info Card ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10 mb-8"
      >
        <div className="px-6 md:px-8 py-5 border-b border-border/50 flex items-center justify-between">
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

        <form onSubmit={handleUpdate} className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-5 mb-8">

            <Field label="Full Name"
              value={editing ? formData.full_name : user.full_name || ''}
              icon={<Person className="w-4 h-4" />}
              editing={editing}
              onChange={(val) => setFormData(f => ({ ...f, full_name: val }))}
            />

            <Field label="Email Address"
              value={user.email || ''}
              icon={<Email className="w-4 h-4" />}
              badge={
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Verified</span>
                </div>
              }
            />

            <Field label="Mobile Number"
              value={editing ? formData.mobile_number : user.mobile_number || ''}
              icon={<Phone className="w-4 h-4" />}
              editing={editing}
              type="tel"
              maxLength={10}
              onChange={(val) => setFormData(f => ({ ...f, mobile_number: val.replace(/\D/g, '').slice(0, 10) }))}
            />

            <Field label="Date of Birth"
              value={formatDate(user.date_of_birth)}
              icon={<CalendarMonth className="w-4 h-4" />}
            />

            <Field label="Gender"
              value={user.gender || 'Not set'}
              icon={<Wc className="w-4 h-4" />}
            />

            <Field label="Account Role"
              value={cfg.label}
              icon={<ManageAccounts className="w-4 h-4" />}
            />

            <Field label="User ID"
              value={user.user_id || '—'}
              icon={<Fingerprint className="w-4 h-4" />}
            />

            <Field label="Member Since"
              value={formatDate(user.createdAt)}
              icon={<CalendarMonth className="w-4 h-4" />}
            />

          </div>

          {editing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 pt-6 border-t border-border/50"
            >
              <button type="submit" disabled={saving}
                className="flex-1 py-4 px-6 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 group">
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" onClick={handleCancel}
                className="flex-1 py-4 px-6 rounded-2xl border-2 border-border hover:bg-muted font-bold transition-all flex items-center justify-center gap-2">
                <Close className="w-5 h-5" />
                Cancel
              </button>
            </motion.div>
          )}
        </form>
      </motion.div>

      {/* ── Role Stats ───────────────────────────────────────────────────── */}
      {role === 'CUSTOMER' && <CustomerStats />}
      {role === 'TRAVELER' && <TravelerStats />}
      {role === 'ADMIN'    && <AdminStats />}

      {/* ── Role Panel ───────────────────────────────────────────────────── */}
      {role === 'CUSTOMER' && (
        <GradientPanel
          gradient="from-primary via-orange-500 to-amber-500"
          title="Rewards & Benefits"
          subtitle="Unlock exclusive perks as you travel"
          headerIcon={<Award className="w-6 h-6 text-white" />}
          items={['10% Cashback', 'Free Cancellation', 'Priority Boarding', 'Lounge Access']}
        />
      )}
      {role === 'TRAVELER' && (
        <GradientPanel
          gradient="from-blue-600 via-blue-500 to-cyan-400"
          title="Driver Benefits"
          subtitle="Perks for verified drivers on the platform"
          headerIcon={<Briefcase className="w-6 h-6 text-white" />}
          items={['Fuel Allowance', 'Insurance Cover', 'Priority Support', 'Earnings Dashboard']}
        />
      )}
      {role === 'ADMIN' && (
        <GradientPanel
          gradient="from-violet-700 via-purple-600 to-fuchsia-500"
          title="Admin Controls"
          subtitle="Full platform management access"
          headerIcon={<AdminPanelSettings className="w-6 h-6 text-white" />}
          items={['Manage Users', 'View Reports', 'Trip Oversight', 'System Settings']}
        />
      )}

    </div>
  );
};

export default UserProfile;