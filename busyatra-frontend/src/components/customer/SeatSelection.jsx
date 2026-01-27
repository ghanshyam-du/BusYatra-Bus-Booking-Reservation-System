import React, { useState, useEffect } from 'react';
import { X, User, Calendar, MapPin } from 'lucide-react';
import bookingService from '../../services/bookingService';
import { formatCurrency, formatTime, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const SeatSelection = ({ bus, onClose, onBookingComplete }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await bookingService.getSeats(bus.schedule_id);
      setSeats(response.data || []);
    } catch (error) {
      toast.error('Failed to load seats');
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seat) => {
    if (seat.is_booked) return;

    const isSelected = selectedSeats.find((s) => s.seat_id === seat.seat_id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.seat_id !== seat.seat_id));
      setPassengers(passengers.filter((_, i) => i !== selectedSeats.indexOf(isSelected)));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
      setPassengers([...passengers, { name: '', age: '', gender: '' }]);
    }
  };

  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleBooking = async () => {
    // Validation
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name || !passengers[i].age || !passengers[i].gender) {
        toast.error(`Please fill all details for passenger ${i + 1}`);
        return;
      }
    }

    setBooking(true);
    try {
      const bookingData = {
        schedule_id: bus.schedule_id,
        seat_ids: selectedSeats.map((s) => s.seat_id),
        passengers: passengers
      };

      await bookingService.createBooking(bookingData);
      onBookingComplete();
    } catch (error) {
      toast.error(error.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const totalAmount = selectedSeats.length * bus.fare;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Select Seats</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {bus.from_location} → {bus.to_location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(bus.journey_date)}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Seat Layout */}
            <div>
              <h3 className="font-bold mb-4">Select Your Seats</h3>
              
              {/* Legend */}
              <div className="flex gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border-2 border-green-500 rounded"></div>
                  Available
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded"></div>
                  Selected
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  Booked
                </div>
              </div>

              {/* Seats Grid */}
              {loading ? (
                <p>Loading seats...</p>
              ) : (
                <div className="grid grid-cols-5 gap-3">
                  {seats.map((seat) => {
                    const isSelected = selectedSeats.find((s) => s.seat_id === seat.seat_id);
                    return (
                      <button
                        key={seat.seat_id}
                        onClick={() => toggleSeat(seat)}
                        disabled={seat.is_booked}
                        className={`h-12 rounded font-semibold transition ${
                          seat.is_booked
                            ? 'bg-gray-300 cursor-not-allowed'
                            : isSelected
                            ? 'bg-blue-500 text-white'
                            : 'border-2 border-green-500 hover:bg-green-50'
                        }`}
                      >
                        {seat.seat_number}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Passenger Details */}
            <div>
              <h3 className="font-bold mb-4">Passenger Details</h3>
              
              {selectedSeats.length === 0 ? (
                <p className="text-gray-500">Select seats to enter passenger details</p>
              ) : (
                <div className="space-y-4">
                  {selectedSeats.map((seat, index) => (
                    <div key={seat.seat_id} className="border rounded-lg p-4">
                      <p className="font-semibold mb-3">Seat {seat.seat_number}</p>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Passenger Name"
                          value={passengers[index]?.name || ''}
                          onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            placeholder="Age"
                            value={passengers[index]?.age || ''}
                            onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                          />
                          <select
                            value={passengers[index]?.gender || ''}
                            onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                          >
                            <option value="">Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total & Book */}
              {selectedSeats.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <button
                    onClick={handleBooking}
                    disabled={booking}
                    className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                  >
                    {booking ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
