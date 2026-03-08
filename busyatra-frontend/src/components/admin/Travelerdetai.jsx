import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Building, User, Phone, Mail, MapPin, Clock,
  CheckCircle, XCircle, Edit3, Save, X, Bus, Ticket,
  IndianRupee, RefreshCw, Shield, FileText, Hash,
  TrendingUp, AlertCircle, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

/* ─── status config ──────────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  APPROVED: { bg:'bg-emerald-50', text:'text-emerald-700', border:'border-emerald-200', dot:'bg-emerald-500', label:'Approved' },
  PENDING:  { bg:'bg-amber-50',   text:'text-amber-700',   border:'border-amber-200',   dot:'bg-amber-400',  label:'Pending'  },
  REJECTED: { bg:'bg-red-50',     text:'text-red-700',     border:'border-red-200',     dot:'bg-red-500',    label:'Rejected' },
};

/* ─── sub-components ─────────────────────────────────────────────────────── */
const EditField = ({ label, value, onChange, type = 'text', disabled = false }) => (
  <div>
    <label className="block text-[9px] uppercase tracking-widest font-black text-gray-400 mb-1">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-3 py-2.5 rounded-xl border text-sm text-gray-800 outline-none transition-all ${
        disabled
          ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-white border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100'
      }`}
    />
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5 text-gray-400">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-800 break-all">{value || '—'}</p>
    </div>
  </div>
);

const StatCard = ({ icon, label, value, accent }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
      style={{ background: `linear-gradient(90deg,${accent},transparent)` }}/>
    <div className="p-2 rounded-xl inline-flex mb-2" style={{ background: `${accent}18` }}>
      <span style={{ color: accent }}>{icon}</span>
    </div>
    <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-0.5">{label}</p>
    <p className="text-xl font-black text-gray-900">{value ?? '—'}</p>
  </div>
);

const fmtDate      = v => { if (!v) return 'N/A'; const d = new Date(v); return isNaN(d) ? 'N/A' : d.toLocaleDateString('en-IN',{ day:'numeric', month:'long',  year:'numeric' }); };
const fmtDateShort = v => { if (!v) return 'N/A'; const d = new Date(v); return isNaN(d) ? 'N/A' : d.toLocaleDateString('en-IN',{ day:'numeric', month:'short', year:'numeric' }); };

/* ═══════════════════════════════════════════════════════════════════════════ */
const TravelerDetail = () => {
  const { travelerId } = useParams();
  const navigate = useNavigate();

  const [traveler,   setTraveler]   = useState(null);
  const [stats,      setStats]      = useState({ buses: 0, revenue: 0, bookings: 0 });
  const [loading,    setLoading]    = useState(true);
  const [editMode,   setEditMode]   = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);
  const [editData,   setEditData]   = useState({});

  /* ── fetch ───────────────────────────────────────────────────────────── */
  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getTravelerDetails(travelerId);
      // Backend sends: { success, data: { traveler: {...}, stats: { buses, revenue, bookings } } }
      // adminService already does `return response.data`, so:
      //   res = { success: true, data: { traveler: {...}, stats: {...} } }
      const travelerObj = res?.data?.traveler ?? res?.traveler ?? res?.data ?? res;
      const statsObj    = res?.data?.stats    ?? {};

      setTraveler(travelerObj);
      setStats({
        buses:    statsObj.buses    ?? 0,
        revenue:  statsObj.revenue  ?? 0,
        bookings: statsObj.bookings ?? 0,
      });
      setEditData({
        company_name:     travelerObj.company_name               || '',
        business_contact: travelerObj.business_contact           || '',
        business_email:   travelerObj.business_email             || travelerObj.user_id?.email || '',
        gstin:            travelerObj.gstin                      || '',
        pan_number:       travelerObj.pan_number                 || '',
        street:           travelerObj.address?.street            || '',
        city:             travelerObj.address?.city              || '',
        state:            travelerObj.address?.state             || '',
        pincode:          String(travelerObj.address?.pincode    || ''),
      });
    } catch (err) {
      console.error('TravelerDetail error:', err);
      toast.error('Failed to load traveler details');
    } finally {
      setLoading(false);
    }
  }, [travelerId]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  /* ── save edits locally ── */
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setTraveler(prev => ({
        ...prev,
        company_name:     editData.company_name,
        business_contact: editData.business_contact,
        business_email:   editData.business_email,
        gstin:            editData.gstin,
        pan_number:       editData.pan_number,
        address: { street: editData.street, city: editData.city, state: editData.state, pincode: editData.pincode },
      }));
      setSaving(false);
      setEditMode(false);
      toast.success('Changes saved!');
    }, 600);
  };

  /* ── status toggle ── */
  const handleStatusToggle = async (newStatus) => {
    if (!window.confirm(`${newStatus === 'APPROVED' ? 'Approve' : 'Reject'} this traveler?`)) return;
    setStatusBusy(true);
    try {
      await adminService.updateTravelerStatus(travelerId, newStatus);
      toast.success(`Traveler ${newStatus.toLowerCase()} successfully!`);
      fetchDetail();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusBusy(false);
    }
  };

  const set = key => val => setEditData(prev => ({ ...prev, [key]: val }));

  /* ── loading / not found ── */
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-3 bg-gray-50">
      <div className="w-11 h-11 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"/>
      <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Loading details…</p>
    </div>
  );

  if (!traveler) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <AlertCircle className="w-10 h-10 text-gray-200"/>
      <p className="text-gray-400 text-sm font-semibold">Traveler not found</p>
      <button onClick={() => navigate('/admin/travelers')} className="text-xs text-orange-500 font-bold hover:underline">
        ← Back to list
      </button>
    </div>
  );

  const st      = STATUS_CONFIG[traveler.verification_status] || STATUS_CONFIG.PENDING;
  const repName  = typeof traveler.user_id === 'object' ? traveler.user_id?.full_name  : null;
  const repEmail = typeof traveler.user_id === 'object' ? traveler.user_id?.email      : null;
  const repId    = typeof traveler.user_id === 'object' ? traveler.user_id?._id        : traveler.user_id;

  /* ════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5" style={{ fontFamily:"'DM Sans',sans-serif" }}>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <button onClick={() => navigate('/admin/travelers')}
          className="flex items-center gap-1.5 font-semibold hover:text-orange-500 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5"/> Travelers
        </button>
        <ChevronRight className="w-3 h-3"/>
        <span className="text-gray-700 font-black truncate">{traveler.company_name || travelerId}</span>
      </div>

      {/* Hero card */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-20 relative"
          style={{ background:'linear-gradient(135deg,#fff7ed,#ffedd5,#fed7aa)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage:'radial-gradient(circle,#f97415 1px,transparent 1px)', backgroundSize:'20px 20px' }}/>
        </div>

        <div className="px-6 pb-6">
          <div className="-mt-8 flex items-end justify-between flex-wrap gap-3">
            {/* avatar */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-orange-600 border-4 border-white shadow-md"
              style={{ background:'linear-gradient(135deg,#fff7ed,#ffedd5)' }}>
              {traveler.company_name?.[0]?.toUpperCase() || '?'}
            </div>

            {/* actions */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {editMode ? (
                <>
                  <button onClick={() => setEditMode(false)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-500 hover:text-red-500 hover:border-red-200 transition-all">
                    <X className="w-3.5 h-3.5"/> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-black shadow-sm disabled:opacity-70"
                    style={{ background:'linear-gradient(135deg,#f97415,#ea580c)' }}>
                    {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <Save className="w-3.5 h-3.5"/>}
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button onClick={() => setEditMode(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-black text-gray-600 hover:border-orange-300 hover:text-orange-500 transition-all shadow-sm">
                  <Edit3 className="w-3.5 h-3.5"/> Edit Profile
                </button>
              )}

              {traveler.verification_status === 'APPROVED' ? (
                <button onClick={() => handleStatusToggle('REJECTED')} disabled={statusBusy}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 border border-red-100 text-xs font-black text-red-600 hover:bg-red-100 transition-all disabled:opacity-70">
                  {statusBusy ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <XCircle className="w-3.5 h-3.5"/>}
                  Revoke Access
                </button>
              ) : (
                <button onClick={() => handleStatusToggle('APPROVED')} disabled={statusBusy}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-black text-emerald-600 hover:bg-emerald-100 transition-all disabled:opacity-70">
                  {statusBusy ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <CheckCircle className="w-3.5 h-3.5"/>}
                  Approve
                </button>
              )}
            </div>
          </div>

          {/* name + meta */}
          <div className="mt-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-black text-gray-900">{traveler.company_name || '(No name)'}</h1>
              <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${st.bg} ${st.text} ${st.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}/>
                {st.label}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <User className="w-3 h-3"/>{repName || 'No representative'}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Hash className="w-3 h-3"/>{traveler.traveler_id || travelerId}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3"/>Joined {fmtDate(traveler.created_at)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats — uses stats.buses / stats.revenue / stats.bookings from backend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<Bus className="w-4 h-4"/>}         label="Total Buses"    value={stats.buses}                       accent="#8b5cf6"/>
        <StatCard icon={<Ticket className="w-4 h-4"/>}      label="Total Bookings" value={stats.bookings}                    accent="#f97415"/>
        <StatCard icon={<IndianRupee className="w-4 h-4"/>} label="Total Revenue"  value={formatCurrency(stats.revenue)}     accent="#10b981"/>
        <StatCard icon={<TrendingUp className="w-4 h-4"/>}  label="Active Routes"  value={traveler.routes_count ?? 0}        accent="#6366f1"/>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* LEFT: Company Info + Address */}
        <div className="lg:col-span-2 space-y-4">

          {/* Company Information */}
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-50"><Building className="w-4 h-4 text-orange-500"/></div>
                <h3 className="font-black text-gray-900 text-sm">Company Information</h3>
              </div>
              {editMode && (
                <span className="text-[9px] font-black text-orange-500 bg-orange-50 border border-orange-100 px-2 py-1 rounded-full uppercase tracking-widest">
                  Editing
                </span>
              )}
            </div>
            <div className="p-5">
              <AnimatePresence mode="wait">
                {editMode ? (
                  <motion.div key="edit-co" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <EditField label="Company Name"     value={editData.company_name}     onChange={set('company_name')}/>
                    <EditField label="Business Contact" value={editData.business_contact} onChange={set('business_contact')} type="tel"/>
                    <EditField label="Business Email"   value={editData.business_email}   onChange={set('business_email')}   type="email"/>
                    <EditField label="GSTIN"            value={editData.gstin}            onChange={set('gstin')}/>
                    <EditField label="PAN Number"       value={editData.pan_number}       onChange={set('pan_number')}/>
                    <EditField label="Representative"   value={repName}                   onChange={() => {}} disabled/>
                  </motion.div>
                ) : (
                  <motion.div key="view-co" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                    <InfoRow icon={<Building className="w-3.5 h-3.5"/>} label="Company Name"     value={traveler.company_name}/>
                    <InfoRow icon={<Phone className="w-3.5 h-3.5"/>}    label="Business Contact" value={traveler.business_contact}/>
                    <InfoRow icon={<Mail className="w-3.5 h-3.5"/>}     label="Business Email"   value={traveler.business_email || repEmail}/>
                    <InfoRow icon={<FileText className="w-3.5 h-3.5"/>} label="GSTIN"            value={traveler.gstin}/>
                    <InfoRow icon={<Shield className="w-3.5 h-3.5"/>}   label="PAN Number"       value={traveler.pan_number}/>
                    <InfoRow icon={<User className="w-3.5 h-3.5"/>}     label="Representative"   value={repName}/>
                    <InfoRow icon={<Mail className="w-3.5 h-3.5"/>}     label="Rep Email"        value={repEmail}/>
                    <InfoRow icon={<Phone className="w-3.5 h-3.5"/>}    label="Rep Mobile"       value={typeof traveler.user_id === 'object' ? traveler.user_id?.mobile_number : null}/>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Business Address */}
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
              <div className="p-1.5 rounded-lg bg-blue-50"><MapPin className="w-4 h-4 text-blue-500"/></div>
              <h3 className="font-black text-gray-900 text-sm">Business Address</h3>
            </div>
            <div className="p-5">
              <AnimatePresence mode="wait">
                {editMode ? (
                  <motion.div key="edit-addr" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <EditField label="Street Address" value={editData.street}  onChange={set('street')}/>
                    </div>
                    <EditField label="City"    value={editData.city}    onChange={set('city')}/>
                    <EditField label="State"   value={editData.state}   onChange={set('state')}/>
                    <EditField label="Pincode" value={editData.pincode} onChange={set('pincode')} type="number"/>
                  </motion.div>
                ) : (
                  <motion.div key="view-addr" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                    {traveler.address ? (
                      <>
                        <InfoRow icon={<MapPin className="w-3.5 h-3.5"/>} label="Street"  value={traveler.address.street}/>
                        <InfoRow icon={<MapPin className="w-3.5 h-3.5"/>} label="City"    value={traveler.address.city}/>
                        <InfoRow icon={<MapPin className="w-3.5 h-3.5"/>} label="State"   value={traveler.address.state}/>
                        <InfoRow icon={<Hash className="w-3.5 h-3.5"/>}   label="Pincode" value={String(traveler.address.pincode || '')}/>
                      </>
                    ) : (
                      <p className="text-gray-300 text-sm text-center py-8">No address on record</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Account + Documents + Quick Actions */}
        <div className="space-y-4">

          {/* Account Details */}
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
              <div className="p-1.5 rounded-lg bg-indigo-50"><Shield className="w-4 h-4 text-indigo-500"/></div>
              <h3 className="font-black text-gray-900 text-sm">Account Details</h3>
            </div>
            <div className="p-5">
              <InfoRow icon={<Hash className="w-3.5 h-3.5"/>}  label="Traveler ID"  value={traveler.traveler_id}/>
              <InfoRow icon={<User className="w-3.5 h-3.5"/>}  label="User ID"      value={repId ? String(repId) : null}/>
              <InfoRow icon={<Clock className="w-3.5 h-3.5"/>} label="Registered"   value={fmtDateShort(traveler.created_at)}/>
              <InfoRow icon={<Clock className="w-3.5 h-3.5"/>} label="Last Updated" value={fmtDateShort(traveler.updated_at)}/>

              {/* verification status block */}
              <div className="mt-3 pt-3 border-t border-gray-50">
                <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-2">Verification Status</p>
                <div className={`flex items-center gap-2 p-3 rounded-xl border ${st.bg} ${st.border}`}>
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${st.dot}`}/>
                  <div>
                    <p className={`text-xs font-black ${st.text}`}>{st.label}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">
                      {traveler.verification_status === 'APPROVED' ? 'Cleared to operate on platform'
                        : traveler.verification_status === 'REJECTED' ? 'Access has been denied'
                        : 'Awaiting admin review'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {traveler.verification_status !== 'APPROVED' && (
                    <button onClick={() => handleStatusToggle('APPROVED')} disabled={statusBusy}
                      className="flex-1 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-black text-emerald-600 hover:bg-emerald-100 transition-all flex items-center justify-center gap-1 disabled:opacity-60">
                      <CheckCircle className="w-3.5 h-3.5"/> Approve
                    </button>
                  )}
                  {traveler.verification_status !== 'REJECTED' && (
                    <button onClick={() => handleStatusToggle('REJECTED')} disabled={statusBusy}
                      className="flex-1 py-2 rounded-xl bg-red-50 border border-red-100 text-xs font-black text-red-600 hover:bg-red-100 transition-all flex items-center justify-center gap-1 disabled:opacity-60">
                      <XCircle className="w-3.5 h-3.5"/> Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
              <div className="p-1.5 rounded-lg bg-teal-50"><FileText className="w-4 h-4 text-teal-500"/></div>
              <h3 className="font-black text-gray-900 text-sm">Documents</h3>
            </div>
            <div className="p-5 space-y-2">
              {[
                { label:'GSTIN Certificate', val: traveler.gstin },
                { label:'PAN Card',           val: traveler.pan_number },
                { label:'Business License',   val: traveler.business_license || null },
              ].map((doc, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${
                  doc.val ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${doc.val ? 'bg-emerald-500' : 'bg-gray-300'}`}/>
                    <p className="text-xs font-semibold text-gray-700">{doc.label}</p>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    doc.val ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {doc.val ? 'Provided' : 'Missing'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            className="rounded-2xl p-5 shadow-sm"
            style={{ background:'linear-gradient(135deg,#f97415,#ea580c)' }}>
            <h3 className="font-black text-white text-sm mb-0.5">Quick Actions</h3>
            <p className="text-orange-200 text-[10px] mb-3">Manage this partner</p>
            <div className="space-y-2">
              {[
                { label:'View Their Buses',  href:`/admin/buses?traveler=${travelerId}` },
                { label:'View Bookings',     href:`/admin/bookings?traveler=${travelerId}` },
                { label:'Back to Travelers', href:'/admin/travelers' },
              ].map((a, i) => (
                <a key={i} href={a.href}
                  className="flex items-center justify-between py-2 px-3 bg-white/15 hover:bg-white/25 rounded-xl transition text-xs text-white font-bold group">
                  {a.label}
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition"/>
                </a>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default TravelerDetail;