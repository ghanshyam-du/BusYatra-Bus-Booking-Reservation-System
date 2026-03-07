import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, CheckCircle, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import adminService from '../../services/adminService';
import { formatDateTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      const response = await adminService.getTickets(params);
      setTickets(response.data || []);
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (ticketId) => {
    try {
      await adminService.assignTicket(ticketId);
      toast.success('Ticket assigned to you!');
      fetchTickets();
    } catch (error) {
      toast.error(error.message || 'Failed to assign ticket');
    }
  };

  const handleResolve = async (ticketId) => {
    if (!resolutionNotes.trim()) { toast.error('Please enter resolution notes'); return; }
    try {
      await adminService.resolveTicket(ticketId, resolutionNotes);
      toast.success('Ticket resolved successfully!');
      setSelectedTicket(null);
      setResolutionNotes('');
      fetchTickets();
    } catch (error) {
      toast.error(error.message || 'Failed to resolve ticket');
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'URGENT': case 'HIGH':  return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'MEDIUM':               return <Clock className="w-5 h-5 text-amber-500" />;
      default:                     return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filterButtons = [
    { key: 'all',         label: 'All Tickets'  },
    { key: 'OPEN',        label: 'Open'         },
    { key: 'IN_PROGRESS', label: 'In Progress'  },
    { key: 'RESOLVED',    label: 'Resolved'     },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Support <span className="text-orange-500">Tickets</span></h2>
        <p className="text-gray-500 text-sm mt-1">Manage and resolve customer support inquiries</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-sm inline-flex flex-wrap gap-1">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === btn.key
                ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No tickets found</h3>
          <p className="text-gray-400 text-sm">No support tickets match your filter</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket.ticket_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 border border-gray-200">
                          {getPriorityIcon(ticket.priority)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 text-base">{ticket.subject}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                              {ticket.ticket_number}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              ticket.ticket_status === 'OPEN'        ? 'bg-red-100 text-red-700 border border-red-200' :
                              ticket.ticket_status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                                       'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}>
                              {ticket.ticket_status.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDateTime(ticket.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed mb-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      {ticket.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        <span className="text-gray-500">Type:</span>
                        <span className="text-gray-800 font-semibold">{ticket.ticket_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        <span className="text-gray-500">Priority:</span>
                        <span className={`font-semibold ${ticket.priority === 'URGENT' || ticket.priority === 'HIGH' ? 'text-red-600' : 'text-gray-800'}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        <span className="text-gray-500">Company:</span>
                        <span className="text-gray-800 font-semibold">{ticket.traveler_id?.company_name || 'N/A'}</span>
                      </div>
                    </div>

                    {ticket.resolution_notes && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" /> Resolution
                          </p>
                          <p className="text-sm text-emerald-800">{ticket.resolution_notes}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="lg:w-72 lg:border-l border-gray-200 lg:pl-6 flex flex-col justify-center">
                    {ticket.ticket_status === 'OPEN' && (
                      <button
                        onClick={() => handleAssign(ticket.ticket_id)}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-200"
                      >
                        <User className="w-4 h-4" />
                        Assign to Me
                      </button>
                    )}

                    {ticket.ticket_status === 'IN_PROGRESS' && !selectedTicket && (
                      <button
                        onClick={() => setSelectedTicket(ticket.ticket_id)}
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-200"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Resolve Ticket
                      </button>
                    )}

                    {selectedTicket === ticket.ticket_id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                      >
                        <label className="block text-xs font-semibold text-gray-600 mb-2">Resolution Action</label>
                        <textarea
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          rows="4"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-orange-300 outline-none mb-3 resize-none"
                          placeholder="Describe the steps taken..."
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleResolve(ticket.ticket_id)}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition">
                            Submit
                          </button>
                          <button onClick={() => { setSelectedTicket(null); setResolutionNotes(''); }}
                            className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-bold transition">
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {ticket.ticket_status === 'RESOLVED' && (
                      <div className="text-center py-4 px-6 bg-emerald-50 rounded-xl border border-emerald-200">
                        <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-emerald-700">Ticket Closed</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TicketManagement;