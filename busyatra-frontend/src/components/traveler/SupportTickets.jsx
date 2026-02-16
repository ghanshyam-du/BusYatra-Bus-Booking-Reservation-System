
import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, CheckCircle, Clock, Plus, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import travelerService from '../../services/travelerService';
import { formatDateTime, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'MEDIUM',
    ticket_type: 'TECHNICAL_ISSUE' // Default type
  });

  const ticketTypes = [
    { value: 'TECHNICAL_ISSUE', label: 'Technical Issue' },
    { value: 'PAYMENT_ISSUE', label: 'Payment Problem' },
    { value: 'ACCOUNT_MANAGEMENT', label: 'Account Management' },
    { value: 'OTHER', label: 'Other' }
  ];

  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await travelerService.getTickets();
      setTickets(response.data || []);
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await travelerService.createTicket(newTicket);
      toast.success('Ticket created successfully!');
      setShowNewTicketModal(false);
      setNewTicket({ subject: '', description: '', priority: 'MEDIUM', ticket_type: 'TECHNICAL_ISSUE' });
      fetchTickets();
    } catch (error) {
      toast.error(error.message || 'Failed to create ticket');
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'URGENT':
      case 'HIGH': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'MEDIUM': return <Clock className="w-5 h-5 text-amber-500" />;
      default: return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Support <span className="text-primary">Tickets</span></h2>
          <p className="text-gray-600 text-sm mt-1">Get help with your bookings and account</p>
        </div>
        <button
          onClick={() => setShowNewTicketModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-orange-600 text-white rounded-xl transition font-medium shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Create New Ticket
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No tickets yet</h3>
          <p className="text-gray-500 text-sm">Need help? Create a new support ticket.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket.ticket_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary/30 transition-all shadow-sm hover:shadow-md group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center ring-1 ring-orange-100">
                      {getPriorityIcon(ticket.priority)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{ticket.subject}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                          {ticket.ticket_number}
                        </span>
                        <span>•</span>
                        <span>{formatDateTime(ticket.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${ticket.ticket_status === 'OPEN' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    ticket.ticket_status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                    {ticket.ticket_status.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4 max-w-3xl">
                  <p className="text-gray-600 text-sm leading-relaxed">{ticket.description}</p>
                </div>

                {ticket.resolution_notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" /> Resolution
                      </p>
                      <p className="text-sm text-emerald-700">{ticket.resolution_notes}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* New Ticket Modal overlay */}
      <AnimatePresence>
        {showNewTicketModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-2xl border border-gray-200 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">New Support Ticket</h3>
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                  <input
                    type="text"
                    required
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    placeholder="Brief summary of the issue..."
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary/50 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
                    <div className="relative">
                      <select
                        value={newTicket.ticket_type}
                        onChange={(e) => setNewTicket({ ...newTicket, ticket_type: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-1 focus:ring-primary/50 outline-none transition appearance-none"
                      >
                        {ticketTypes.map(type => (
                          <option key={type.value} value={type.value} className="bg-white text-gray-900">
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                    <div className="relative">
                      <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-1 focus:ring-primary/50 outline-none transition appearance-none"
                      >
                        {priorities.map(p => (
                          <option key={p} value={p} className="bg-white text-gray-900">{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    required
                    rows="5"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    placeholder="Detailed explanation of the problem..."
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary/50 outline-none transition resize-none"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewTicketModal(false)}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Submit Ticket
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportTickets;