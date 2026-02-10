
import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, CheckCircle, Clock, User } from 'lucide-react';
import adminService from '../../services/adminService';
import { formatDateTime, getStatusColor } from '../../utils/formatters';
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
    if (!resolutionNotes.trim()) {
      toast.error('Please enter resolution notes');
      return;
    }

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
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Support Ticket Management</h2>
        <p className="text-gray-600 mt-1">Manage and resolve customer support tickets</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
          }`}
        >
          All ({tickets.length})
        </button>
        <button
          onClick={() => setFilter('OPEN')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'OPEN' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
          }`}
        >
          Open
        </button>
        <button
          onClick={() => setFilter('IN_PROGRESS')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'IN_PROGRESS' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter('RESOLVED')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'RESOLVED' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
          }`}
        >
          Resolved
        </button>
      </div>

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-600">No support tickets match your filter</p>
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.ticket_status)}`}>
                      {ticket.ticket_status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{ticket.ticket_number}</p>
                  <p className="text-gray-700 mb-3">{ticket.description}</p>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Type:</span> {ticket.ticket_type}
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span> {ticket.priority}
                    </div>
                    <div>
                      <span className="font-medium">Company:</span> {ticket.traveler_id?.company_name || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {formatDateTime(ticket.created_at)}
                    </div>
                  </div>

                  {ticket.resolution_notes && (
                    <div className="mt-4 pt-4 border-t bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-900 mb-1">Resolution:</p>
                      <p className="text-sm text-green-700">{ticket.resolution_notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  {ticket.ticket_status === 'OPEN' && (
                    <button
                      onClick={() => handleAssign(ticket.ticket_id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                      Assign to Me
                    </button>
                  )}
                  {ticket.ticket_status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => setSelectedTicket(ticket.ticket_id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>

              {/* Resolution Form */}
              {selectedTicket === ticket.ticket_id && (
                <div className="mt-4 pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resolution Notes *
                  </label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Describe how you resolved this issue..."
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleResolve(ticket.ticket_id)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                    >
                      Submit Resolution
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTicket(null);
                        setResolutionNotes('');
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketManagement;