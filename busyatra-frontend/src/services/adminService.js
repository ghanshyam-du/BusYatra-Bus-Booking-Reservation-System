
import api from './api';

const adminService = {
  // ============ DASHBOARD ============
  
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // ============ TRAVELER MANAGEMENT ============
  
  getTravelers: async (filters) => {
    const response = await api.get('/admin/travelers', {
      params: filters
    });
    return response.data;
  },

  getTravelerDetails: async (travelerId) => {
    const response = await api.get(`/admin/travelers/${travelerId}`);
    return response.data;
  },

  onboardTraveler: async (travelerData) => {
    const response = await api.post('/admin/travelers/onboard', travelerData);
    return response.data;
  },

  updateTravelerStatus: async (travelerId, status) => {
    const response = await api.put(`/admin/travelers/${travelerId}/status`, { status });
    return response.data;
  },

  // ============ TICKET MANAGEMENT ============
  
  getTickets: async (filters) => {
    const response = await api.get('/admin/tickets', {
      params: filters
    });
    return response.data;
  },

  getTicketDetails: async (ticketId) => {
    const response = await api.get(`/admin/tickets/${ticketId}`);
    return response.data;
  },

  assignTicket: async (ticketId) => {
    const response = await api.put(`/admin/tickets/${ticketId}/assign`);
    return response.data;
  },

  resolveTicket: async (ticketId, resolutionNotes) => {
    const response = await api.put(`/admin/tickets/${ticketId}/resolve`, {
      resolution_notes: resolutionNotes
    });
    return response.data;
  },

  // ============ REPORTS ============
  
  getRevenueReport: async (params) => {
    const response = await api.get('/admin/reports/revenue', {
      params
    });
    return response.data;
  },

  getTopTravelers: async (limit = 10) => {
    const response = await api.get('/admin/reports/top-travelers', {
      params: { limit }
    });
    return response.data;
  },

  getBookingStats: async () => {
    const response = await api.get('/admin/reports/bookings');
    return response.data;
  },

  // ============ USER MANAGEMENT ============
  
  getUsers: async (filters) => {
    const response = await api.get('/admin/users', {
      params: filters
    });
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  // ============ BUS MANAGEMENT ============
  
  getAllBuses: async (filters) => {
    const response = await api.get('/admin/buses', {
      params: filters
    });
    return response.data;
  },

  deactivateBus: async (busId) => {
    const response = await api.put(`/admin/buses/${busId}/deactivate`);
    return response.data;
  },
};

export default adminService;