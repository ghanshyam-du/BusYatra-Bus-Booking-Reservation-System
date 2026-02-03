// View all bookings for traveler's buses with analytics
// ----------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, IndianRupee, TrendingUp, Ticket } from 'lucide-react';
import travelerService from '../../services/travelerService';
import { formatCurrency, formatDate, formatTime, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';

const BookingAnalytics = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await travelerService.getBookings();
      setBookings(response.data?.bookings || []);
      setStats(response.data?.stats || null);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.booking_status === filter.toUpperCase();
  });

  if (loading) {
    return <div className="bg-white rounded-lg shadow-sm p-8 text-center">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Booking Analytics</h2>
        <p className="text-gray-600 mt-1">View and manage bookings for your buses</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <Ticket className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold">{stats.total_bookings || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Total Bookings</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold">{stats.confirmed || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Confirmed</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold">{stats.total_passengers || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Total Passengers</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <IndianRupee className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold">{formatCurrency(stats.total_revenue || 0).replace('₹', '')}</span>
            </div>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          All ({bookings.length})
        </button>
        <button
          onClick={() => setFilter('confirmed')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'confirmed' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'cancelled' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">Bookings will appear here once customers start booking</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.booking_id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{booking.booking_reference}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.booking_status)}`}>
                      {booking.booking_status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.payment_status)}`}>
                      {booking.payment_status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Booked on {formatDate(booking.booking_date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(booking.total_amount)}</p>
                  <p className="text-sm text-gray-600">{booking.number_of_seats} seats</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Route</p>
                    <p className="font-medium">{booking.from_location} → {booking.to_location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Journey Date</p>
                    <p className="font-medium">{formatDate(booking.journey_date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Seats</p>
                    <p className="font-medium">{booking.seat_numbers?.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              {booking.passengers && booking.passengers.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Passengers:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {booking.passengers.map((passenger, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {passenger.passenger_name} ({passenger.passenger_age}yrs, {passenger.passenger_gender})
                      </div>
                    ))}
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

export default BookingAnalytics;
