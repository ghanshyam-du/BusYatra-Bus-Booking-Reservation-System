import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Calendar,
  MapPin,
  Bus,
  Armchair,
  CheckCircle,
  Ban,
  ArrowRight,
  MonitorStop,
  AlertCircle,
  CreditCard,
  Trash2,
  ChevronDown
} from 'lucide-react';
import bookingService from '../../services/bookingService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

const SeatSelection = ({ bus, onClose, onBookingComplete }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);

  // Validate bus data
  useEffect(() => {
    if (!bus || !bus.schedule_id) {
      setError('Bus information is missing');
      setLoading(false);
      return;
    }
    fetchSeats();
  }, [bus]);

  const fetchSeats = async () => {
    try {
      const response = await bookingService.getSeats(bus.schedule_id);

      // Handle different API response structures (Preserved Logic)
      let seatsData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          seatsData = response.data;
        } else if (response.data.seats && Array.isArray(response.data.seats)) {
          seatsData = response.data.seats;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          seatsData = response.data.data;
        } else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
          const possibleSeatsKeys = ['seats', 'seatList', 'seatData', 'availableSeats'];
          for (const key of possibleSeatsKeys) {
            if (response.data[key] && Array.isArray(response.data[key])) {
              seatsData = response.data[key];
              break;
            }
          }
        }
      }

      if (!Array.isArray(seatsData) || seatsData.length === 0) {
        throw new Error('No seats data available');
      }

      setSeats(seatsData);
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to load seats');
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
      setPassengers([...passengers, {
        name: '',
        age: '',
        gender: '',
        id_type: 'Aadhar',
        id_number: 'N/A'
      }]);
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
      if (passengers[i].name.trim().length < 2) {
        toast.error(`Valid name required for passenger ${i + 1}`);
        return;
      }
      const age = parseInt(passengers[i].age);
      if (isNaN(age) || age < 1 || age > 120) {
        toast.error(`Valid age (1-120) required for passenger ${i + 1}`);
        return;
      }
      if (!['Male', 'Female', 'Other'].includes(passengers[i].gender)) {
        toast.error(`Select gender for passenger ${i + 1}`);
        return;
      }
    }

    setBooking(true);
    try {
      const bookingData = {
        schedule_id: bus.schedule_id,
        seat_ids: selectedSeats.map((s) => s.seat_id),
        passengers: passengers.map(p => ({
          name: p.name.trim(),
          age: parseInt(p.age),
          gender: p.gender,
          id_type: p.id_type || 'Aadhar',
          id_number: p.id_number || 'N/A'
        }))
      };

      await bookingService.createBooking(bookingData);
      toast.success('🎉 Booking successful!');
      setTimeout(() => {
        onBookingComplete();
      }, 1000);

    } catch (error) {
      const errorMessage = error.response?.data?.error
        || error.response?.data?.message
        || error.message
        || 'Booking failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setBooking(false);
    }
  };

  // derived state
  const totalAmount = selectedSeats.length * (bus?.fare || 0);

  if (error && !loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Unable to Load Seats</h3>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
          <div className="flex gap-3 justify-center pt-2">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors">Close</button>
            <button onClick={fetchSeats} className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >

        {/* Header */}
        <div className="relative bg-linear-to-r from-gray-900 via-gray-900 to-gray-800 p-6 sm:p-8 shrink-0">
          <div className="absolute top-0 right-0 p-4">
            <button onClick={onClose} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 text-white/60 text-sm font-medium">
                <Bus className="w-4 h-4" />
                <span>Seat Selection</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Select Your Seats</h2>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-white/90 text-sm backdrop-blur-md border border-white/5">
                  <MapPin className="w-4 h-4 text-teal-400" />
                  <span>{bus?.from_location}</span>
                  <ArrowRight className="w-3 h-3 text-white/40" />
                  <span>{bus?.to_location}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-white/90 text-sm backdrop-blur-md border border-white/5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>{bus?.journey_date ? formatDate(bus.journey_date) : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-white/60 text-sm mb-1">Price per seat</p>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-emerald-400">
                {formatCurrency(bus?.fare || 0)}
              </div>
            </div>
          </div>

          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

          {/* Left: Seat Map */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gray-50 dark:bg-gray-900 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800">
            <div className="max-w-md mx-auto">

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-5 h-5 rounded border-2 border-emerald-500 bg-white dark:bg-gray-800" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-5 h-5 rounded bg-teal-500 shadow-md shadow-teal-500/30" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-5 h-5 rounded bg-gray-300 dark:bg-gray-700" />
                  <span>Booked</span>
                </div>
              </div>

              {/* Driver */}
              <div className="flex justify-end mb-6 pr-4">
                <div className="w-14 h-14 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center opacity-50">
                  <MonitorStop className="w-6 h-6 rotate-90" />
                </div>
              </div>

              {/* Grid */}
              {loading ? (
                <div className="grid grid-cols-5 gap-3">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-3">
                  {seats.map((seat, i) => {
                    const isSelected = selectedSeats.find(s => s.seat_id === seat.seat_id);
                    const isBooked = seat.is_booked;

                    return (
                      <button
                        key={seat.seat_id}
                        onClick={() => toggleSeat(seat)}
                        disabled={isBooked}
                        className={cn(
                          "relative h-12 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center group",
                          isBooked
                            ? "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                            : isSelected
                              ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30 scale-105"
                              : "bg-white dark:bg-gray-800 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        )}
                      >
                        <Armchair className={cn(
                          "w-5 h-5",
                          isSelected ? "fill-current" : ""
                        )} />
                        <span className="absolute -top-2 -right-2 text-[10px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-1 rounded-full text-gray-500">
                          {seat.seat_number}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Selected Seats Summary */}
              {selectedSeats.length > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-teal-700 dark:text-teal-300">Selected Seats:</span>
                    {selectedSeats.map((seat) => (
                      <div
                        key={seat.seat_id}
                        className="flex items-center gap-1 bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-200 text-xs font-medium px-2 py-1 rounded-full"
                      >
                        <span>{seat.seat_number}</span>
                        <button onClick={() => toggleSeat(seat)} className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Passenger Details */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white dark:bg-gray-950">
            <div className="max-w-md mx-auto h-full flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-500" />
                Passenger Details
              </h3>

              {selectedSeats.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
                    <Armchair className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Select seats to add passengers</p>
                </div>
              ) : (
                <div className="flex-1 space-y-4 mb-8">
                  <AnimatePresence>
                    {selectedSeats.map((seat, index) => (
                      <motion.div
                        key={seat.seat_id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 hover:border-teal-500/30 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded-md">
                            Seat {seat.seat_number}
                          </span>
                          <button
                            onClick={() => toggleSeat(seat)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <input
                              type="text"
                              placeholder="Passenger Name"
                              value={passengers[index]?.name || ''}
                              onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="number"
                              placeholder="Age"
                              value={passengers[index]?.age || ''}
                              onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                            />
                            <div className="relative">
                              <select
                                value={passengers[index]?.gender || ''}
                                onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none appearance-none"
                              >
                                <option value="">Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Footer / Total */}
              {selectedSeats.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mt-auto">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Total Amount</p>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalAmount)}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-teal-600 font-medium">{selectedSeats.length} Seats Selected</p>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={booking}
                    className="w-full py-4 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {booking ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Booking</span>
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SeatSelection;