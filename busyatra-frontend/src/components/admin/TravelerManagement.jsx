import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search, UserCheck, MapPin, Phone, Building, CheckCircle,
  XCircle, Clock, User, RefreshCw, ChevronRight, Bus,
  TrendingUp, AlertCircle, Filter, ArrowUpRight, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

/* ─── helpers ────────────────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  APPROVED: { bg:'bg-emerald-50', text:'text-emerald-700', border:'border-emerald-200', dot:'bg-emerald-500', label:'Approved' },
  PENDING:  { bg:'bg-amber-50',   text:'text-amber-700',   border:'border-amber-200',   dot:'bg-amber-400',  label:'Pending'  },
  REJECTED: { bg:'bg-red-50',     text:'text-red-700',     border:'border-red-200',     dot:'bg-red-500',    label:'Rejected' },
};

const FILTER_BTNS = [
  { key:'all',      label:'All'      },
  { key:'approved', label:'Approved' },
  { key:'pending',  label:'Pending'  },
  { key:'rejected', label:'Rejected' },
];

/* ═══════════════════════════════════════════════════════════════════════════ */
const TravelerManagement = () => {
  const [travelers,    setTravelers]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId,   setUpdatingId]   = useState(null);
  const [viewMode,     setViewMode]     = useState('grid'); // 'grid' | 'list'

  /* ── fetch ── */
  const fetchTravelers = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter.toUpperCase();
      const res = await adminService.getTravelers(params);
      setTravelers(res.data || []);
    } catch {
      toast.error('Failed to load travelers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchTravelers(); }, [fetchTravelers]);

  /* ── status update ── */
  const handleUpdateStatus = async (travelerId, currentStatus) => {
    const newStatus = currentStatus === 'APPROVED' ? 'REJECTED' : 'APPROVED';
    if (!window.confirm(`${newStatus === 'APPROVED' ? 'Approve' : 'Revoke'} this traveler?`)) return;
    setUpdatingId(travelerId);
    try {
      await adminService.updateTravelerStatus(travelerId, newStatus);
      toast.success(`Traveler ${newStatus.toLowerCase()} successfully!`);
      fetchTravelers(true);
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  /* ── filtered list ── */
  const filtered = useMemo(() => {
    if (!searchTerm) return travelers;
    const q = searchTerm.toLowerCase();
    return travelers.filter(t =>
      t.company_name?.toLowerCase().includes(q) ||
      t.user_id?.full_name?.toLowerCase().includes(q) ||
      t.user_id?.email?.toLowerCase().includes(q) ||
      t.business_contact?.toLowerCase().includes(q)
    );
  }, [travelers, searchTerm]);

  /* ── summary counts ── */
  const counts = useMemo(() => ({
    all:      travelers.length,
    approved: travelers.filter(t => t.verification_status === 'APPROVED').length,
    pending:  travelers.filter(t => t.verification_status === 'PENDING').length,
    rejected: travelers.filter(t => t.verification_status === 'REJECTED').length,
  }), [travelers]);

  /* ── loading ── */
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-3 bg-gray-50">
      <div className="w-11 h-11 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"/>
      <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Loading travelers…</p>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5" style={{ fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-orange-500 text-[10px] uppercase tracking-[0.25em] font-bold mb-0.5">
            Admin · Partner Network
          </p>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Traveler{' '}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage:'linear-gradient(90deg,#f97415,#fb923c)' }}>
              Management
            </span>
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">Oversee bus operator partners and approvals</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => fetchTravelers(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-xs font-bold text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-all"
            style={{ color: refreshing ? '#f97415' : undefined }}>
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}/>
            Refresh
          </button>
          <Link to="/admin/travelers/onboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-black shadow-sm hover:shadow-md transition-all"
            style={{ background:'linear-gradient(135deg,#f97415,#ea580c)', boxShadow:'0 2px 10px rgba(249,116,21,0.3)' }}>
            <UserCheck className="w-3.5 h-3.5"/>
            Onboard New
          </Link>
        </div>
      </div>

      {/* ── Summary KPI strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Total Partners',    value: counts.all,      accent:'#f97415', bg:'bg-orange-50', icon:<Building className="w-4 h-4"/> },
          { label:'Approved',          value: counts.approved, accent:'#10b981', bg:'bg-emerald-50',icon:<CheckCircle className="w-4 h-4"/> },
          { label:'Pending Review',    value: counts.pending,  accent:'#f59e0b', bg:'bg-amber-50',  icon:<Clock className="w-4 h-4"/>,   pulse: counts.pending > 0 },
          { label:'Rejected',          value: counts.rejected, accent:'#ef4444', bg:'bg-red-50',    icon:<XCircle className="w-4 h-4"/> },
        ].map((kpi, i) => (
          <motion.div key={i}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
            onClick={() => setStatusFilter(i===0?'all':i===1?'approved':i===2?'pending':'rejected')}
            className={`bg-white rounded-2xl p-4 border shadow-sm cursor-pointer transition-all hover:shadow-md relative overflow-hidden ${
              (statusFilter === (i===0?'all':i===1?'approved':i===2?'pending':'rejected'))
                ? 'border-orange-200 ring-1 ring-orange-100'
                : 'border-gray-100'
            }`}>
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
              style={{ background:`linear-gradient(90deg,${kpi.accent},transparent)` }}/>
            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 rounded-xl ${kpi.bg}`}>
                <span style={{ color:kpi.accent }}>{kpi.icon}</span>
              </div>
              {kpi.pulse && (
                <span className="flex h-2 w-2 mt-1">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"/>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"/>
                </span>
              )}
            </div>
            <p className="text-gray-400 text-[9px] uppercase tracking-widest font-bold mb-0.5">{kpi.label}</p>
            <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Search & Filter bar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col sm:flex-row gap-3 items-center">
        {/* search */}
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300"/>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by company, name, email, or contact…"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-800 text-xs placeholder:text-gray-300 focus:ring-2 focus:ring-orange-200 focus:border-orange-300 outline-none transition"
          />
        </div>

        {/* filter pills */}
        <div className="flex gap-1.5 bg-gray-50 border border-gray-100 p-1 rounded-xl">
          {FILTER_BTNS.map(btn => (
            <button key={btn.key} onClick={() => setStatusFilter(btn.key)}
              className="px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
              style={statusFilter === btn.key
                ? { background:'linear-gradient(135deg,#f97415,#ea580c)', color:'#fff', boxShadow:'0 2px 8px rgba(249,116,21,0.3)' }
                : { color:'#9ca3af' }}>
              {btn.label}
              <span className={`ml-1.5 text-[9px] px-1 py-0.5 rounded-full font-black ${
                statusFilter === btn.key ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {counts[btn.key]}
              </span>
            </button>
          ))}
        </div>

        {/* view toggle */}
        <div className="flex bg-gray-50 border border-gray-100 rounded-xl p-1 gap-1">
          {[['grid','⊞'],['list','☰']].map(([mode, icon]) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all"
              style={viewMode === mode
                ? { background:'#fff', color:'#f97415', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' }
                : { color:'#9ca3af' }}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results info ── */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] text-gray-400 font-semibold">
          Showing <span className="text-gray-700 font-black">{filtered.length}</span> of{' '}
          <span className="text-gray-700 font-black">{travelers.length}</span> travelers
        </p>
        {searchTerm && (
          <button onClick={() => setSearchTerm('')}
            className="text-[10px] text-orange-500 font-bold hover:underline">
            Clear search
          </button>
        )}
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
            <Building className="w-7 h-7 text-gray-200"/>
          </div>
          <p className="font-black text-gray-300 text-sm">No travelers found</p>
          <p className="text-gray-300 text-xs">Try adjusting your search or filter</p>
        </div>
      )}

      {/* ── GRID view ── */}
      {viewMode === 'grid' && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((traveler, index) => {
              const st  = STATUS_CONFIG[traveler.verification_status] || STATUS_CONFIG.PENDING;
              const isUpdating = updatingId === traveler.traveler_id;
              return (
                <motion.div key={traveler.traveler_id}
                  initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  transition={{ delay: index * 0.04 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group overflow-hidden">

                  {/* top accent */}
                  <div className="h-[3px] w-full"
                    style={{ background:`linear-gradient(90deg,${
                      traveler.verification_status==='APPROVED'?'#10b981':
                      traveler.verification_status==='REJECTED'?'#ef4444':'#f59e0b'
                    },transparent)` }}/>

                  {/* card header */}
                  <div className="p-5 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black text-orange-600 flex-shrink-0"
                        style={{ background:'linear-gradient(135deg,#fff7ed,#ffedd5)', border:'1px solid #fed7aa' }}>
                        {traveler.company_name?.[0]?.toUpperCase() || 'C'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-gray-900 text-sm leading-tight truncate">{traveler.company_name}</h3>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3"/>
                          {traveler.user_id?.full_name || 'No representative'}
                        </p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border flex-shrink-0 ${st.bg} ${st.text} ${st.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}/>
                      {st.label}
                    </span>
                  </div>

                  {/* info rows */}
                  <div className="px-5 pb-4 space-y-2">
                    {[
                      { icon:<Phone className="w-3.5 h-3.5"/>,  val: traveler.business_contact || '—' },
                      { icon:<Mail className="w-3.5 h-3.5"/>,   val: traveler.user_id?.email || '—' },
                      { icon:<MapPin className="w-3.5 h-3.5"/>, val: traveler.address
                          ? `${traveler.address.city}, ${traveler.address.state}`
                          : 'No address' },
                      { icon:<Clock className="w-3.5 h-3.5"/>,  val: `Joined ${new Date(traveler.created_at).toLocaleDateString('en-IN',{ day:'numeric', month:'short', year:'numeric' })}` },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-gray-500">
                        <span className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400">
                          {row.icon}
                        </span>
                        <span className="truncate">{row.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* footer */}
                  <div className="px-5 pb-5 pt-3 border-t border-gray-50 flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(traveler.traveler_id, traveler.verification_status)}
                      disabled={isUpdating}
                      className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all border ${
                        traveler.verification_status === 'APPROVED'
                          ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-100'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100'
                      } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {isUpdating ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin"/>
                      ) : traveler.verification_status === 'APPROVED' ? (
                        <><XCircle className="w-3.5 h-3.5"/> Revoke</>
                      ) : (
                        <><CheckCircle className="w-3.5 h-3.5"/> Approve</>
                      )}
                    </button>
                    <Link to={`/admin/travelers/${traveler.traveler_id}`}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all">
                      <ChevronRight className="w-4 h-4"/>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ── LIST view ── */}
      {viewMode === 'list' && filtered.length > 0 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* table header */}
          <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
            {['Company','Contact','Location','Status','Joined','Action'].map((h, i) => (
              <div key={h} className={`text-[9px] font-black uppercase tracking-widest text-gray-400 ${
                i===0?'col-span-3':i===1?'col-span-2':i===2?'col-span-2':i===3?'col-span-2':i===4?'col-span-2':'col-span-1'
              }`}>{h}</div>
            ))}
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.map((traveler, index) => {
              const st = STATUS_CONFIG[traveler.verification_status] || STATUS_CONFIG.PENDING;
              const isUpdating = updatingId === traveler.traveler_id;
              return (
                <motion.div key={traveler.traveler_id}
                  initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ delay:index*0.03 }}
                  className="grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-orange-50/40 transition-colors group">

                  {/* company */}
                  <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-orange-600 flex-shrink-0"
                      style={{ background:'linear-gradient(135deg,#fff7ed,#ffedd5)', border:'1px solid #fed7aa' }}>
                      {traveler.company_name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{traveler.company_name}</p>
                      <p className="text-[9px] text-gray-400 truncate">{traveler.user_id?.full_name}</p>
                    </div>
                  </div>

                  {/* contact */}
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600 truncate">{traveler.business_contact || '—'}</p>
                    <p className="text-[9px] text-gray-400 truncate">{traveler.user_id?.email || '—'}</p>
                  </div>

                  {/* location */}
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600 truncate">
                      {traveler.address ? `${traveler.address.city}, ${traveler.address.state}` : '—'}
                    </p>
                  </div>

                  {/* status */}
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${st.bg} ${st.text} ${st.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}/>
                      {st.label}
                    </span>
                  </div>

                  {/* joined */}
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">
                      {new Date(traveler.created_at).toLocaleDateString('en-IN',{ day:'numeric', month:'short', year:'numeric' })}
                    </p>
                  </div>

                  {/* action */}
                  <div className="col-span-1 flex gap-1.5 justify-end">
                    <button
                      onClick={() => handleUpdateStatus(traveler.traveler_id, traveler.verification_status)}
                      disabled={isUpdating}
                      title={traveler.verification_status === 'APPROVED' ? 'Revoke' : 'Approve'}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all border ${
                        traveler.verification_status === 'APPROVED'
                          ? 'bg-red-50 text-red-400 hover:bg-red-100 border-red-100'
                          : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100 border-emerald-100'
                      } ${isUpdating ? 'opacity-50' : ''}`}>
                      {isUpdating
                        ? <RefreshCw className="w-3 h-3 animate-spin"/>
                        : traveler.verification_status === 'APPROVED'
                          ? <XCircle className="w-3 h-3"/>
                          : <CheckCircle className="w-3 h-3"/>}
                    </button>
                    <Link to={`/admin/travelers/${traveler.traveler_id}`}
                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-50 border border-gray-100 text-gray-300 hover:text-orange-500 hover:border-orange-200 transition-all">
                      <ChevronRight className="w-3.5 h-3.5"/>
                    </Link>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default TravelerManagement;