
import api from './api';

const bookingService = {
  // Search buses
  searchBuses: async (searchParams) => {
    const { from, to, date } = searchParams;
    const response = await api.get('/bookings/search-buses', {
      params: { from, to, date }
    });
    return response.data;
  },

  // Get available seats for a schedule
  getSeats: async (scheduleId) => {
    const response = await api.get(`/bookings/seats/${scheduleId}`);
    return response.data;
  },

  // Create booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get user bookings
  getMyBookings: async (filters) => {
    const response = await api.get('/bookings/my-bookings', {
      params: filters
    });
    return response.data;
  },

  // Get booking details
  getBookingDetails: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  },
};

export default bookingService;