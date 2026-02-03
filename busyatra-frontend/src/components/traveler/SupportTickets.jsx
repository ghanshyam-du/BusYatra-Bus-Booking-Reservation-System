// Create and view support tickets
// ----------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import travelerService from '../../services/travelerService';
import { formatDateTime, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    ticket_type: 'TECHNICAL',
    priority: 'MEDIUM'
  });

  const ticketTypes = ['TECHNICAL', 'BOOKING', 'PAYMENT', 'SCHEDULE', 'OTHER'];
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
      await travelerService.createTicket(formData);
      toast.success('Support ticket created successfully!');
      setShowCreateForm(false);
      setFormData({
        subject: '',
        description: '',
        ticket_type: 'TECHNICAL',
        priority: 'MEDIUM'
      });
      fetchTickets();
    } catch (error) {
      toast.error(error.message || 'Failed to create ticket');
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'URGENT':
      case 'HIGH':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'MEDIUM':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  if (loading) {
    return <div className="bg-white rounded-lg shadow-sm p-8 text-center">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Support Tickets</h2>
          <p className="text-gray-600 mt-1">Get help from our support team</p>
        </div>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Create Ticket
          </button>
        )}
      </div>

      {/* Create Ticket Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Create Support Ticket</h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Type *
                </label>
                <select
                  value={formData.ticket_type}
                  onChange={(e) => setFormData({ ...formData, ticket_type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  {ticketTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Please provide detailed information about your issue..."
                required
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Submit Ticket
            </button>
          </form>
        </div>
      )}

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No support tickets</h3>
          <p className="text-gray-600 mb-6">Create a ticket if you need help from our team</p>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              Create Your First Ticket
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.ticket_id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getPriorityIcon(ticket.priority)}
                    <h3 className="font-bold text-lg">{ticket.subject}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{ticket.ticket_number}</p>
                  <p className="text-gray-700">{ticket.description}</p>
                </div>
                <div className="ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.ticket_status)}`}>
                    {ticket.ticket_status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Type:</span> {ticket.ticket_type}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Priority:</span> {ticket.priority}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Created:</span> {formatDateTime(ticket.created_at)}
                </div>
              </div>

              {ticket.resolution_notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-1">Resolution:</p>
                  <p className="text-sm text-gray-600">{ticket.resolution_notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
