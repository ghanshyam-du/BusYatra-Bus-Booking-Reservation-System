import api from './api';

const travelerService = {
  // ============ BUS MANAGEMENT ============
  
  // Get all my buses
  getBuses: async () => {
    const response = await api.get('/traveler/buses');
    return response.data;
  },

  // Add new bus
  addBus: async (busData) => {
    const response = await api.post('/traveler/buses', busData);
    return response.data;
  },

  // Update bus
  updateBus: async (busId, busData) => {
    const response = await api.put(`/traveler/buses/${busId}`, busData);
    return response.data;
  },

  // Delete bus
  deleteBus: async (busId) => {
    const response = await api.delete(`/traveler/buses/${busId}`);
    return response.data;
  },

  // ============ SCHEDULE MANAGEMENT ============
  
  // Get all my schedules
  getSchedules: async (filters) => {
    const response = await api.get('/traveler/schedules', {
      params: filters
    });
    return response.data;
  },

  // Create schedule (auto-generates seats)
  createSchedule: async (scheduleData) => {
    const response = await api.post('/traveler/schedules', scheduleData);
    return response.data;
  },

  // ✅ ADDED: Alias for backward compatibility
  addSchedule: async (scheduleData) => {
    return travelerService.createSchedule(scheduleData);
  },

  // Update schedule
  updateSchedule: async (scheduleId, scheduleData) => {
    const response = await api.put(`/traveler/schedules/${scheduleId}`, scheduleData);
    return response.data;
  },

  // Cancel schedule
  cancelSchedule: async (scheduleId) => {
    const response = await api.put(`/traveler/schedules/${scheduleId}/cancel`);
    return response.data;
  },

  // ============ BOOKING MANAGEMENT ============
  
  // Get all bookings for my buses
  getBookings: async (filters) => {
    const response = await api.get('/traveler/bookings', {
      params: filters
    });
    return response.data;
  },

  // ============ SUPPORT TICKETS ============
  
  // Create support ticket
  createTicket: async (ticketData) => {
    const response = await api.post('/traveler/tickets', ticketData);
    return response.data;
  },

  // Get my tickets
  getTickets: async () => {
    const response = await api.get('/traveler/tickets');
    return response.data;
  },

  // Get ticket details
  getTicketDetails: async (ticketId) => {
    const response = await api.get(`/traveler/tickets/${ticketId}`);
    return response.data;
  },
};

export default travelerService;