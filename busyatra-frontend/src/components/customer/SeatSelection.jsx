import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Calendar, MapPin, Bus, Armchair,
  CheckCircle, AlertCircle, ChevronDown,
  MonitorStop, ArrowRight, Sparkles, Shield
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

  const totalAmount = selectedSeats.length * (bus?.fare || 0);

  if (error && !loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-3xl p-8 max-w-md w-full text-center shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
        >
          <div className="w-20 h-20 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-2xl font-black mb-2">Unable to Load Seats</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-muted hover:bg-muted/80 font-bold transition-colors"
            >
              Close
            </button>
            <button
              onClick={fetchSeats}
              className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/25"
            >
              Retry
            </button>
          </div>
        </motion.div>
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
        className="relative w-full max-w-7xl max-h-[90vh] bg-card rounded-3xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-black/5 dark:ring-white/10"
      >
        {/* Header */}
        <div className="relative bg-linear-to-r from-slate-900 via-gray-900 to-slate-800 p-8 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col lg:flex-row gap-6 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary to-orange-500 flex items-center justify-center shadow-lg shadow-primary/25">
                  <Bus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-white/60 text-sm font-medium mb-1">
                    <Shield className="w-4 h-4" />
                    <span>Secure Booking</span>
                  </div>
                  <h2 className="text-3xl font-black text-white">Select Your Seats</h2>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl text-white/90 text-sm backdrop-blur-md border border-white/10">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium">{bus?.from_location}</span>
                  <ArrowRight className="w-3 h-3 text-white/40" />
                  <span className="font-medium">{bus?.to_location}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl text-white/90 text-sm backdrop-blur-md border border-white/10">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <span className="font-medium">{bus?.journey_date ? formatDate(bus.journey_date) : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="lg:text-right">
              <p className="text-white/60 text-sm mb-2 font-medium">Price per seat</p>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-400">
                {formatCurrency(bus?.fare || 0)}
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Left: Seat Map */}
          <div className="flex-1 overflow-y-auto p-8 bg-muted/30 border-b lg:border-b-0 lg:border-r border-border/50">
            <div className="max-w-md mx-auto">
              {/* Legend */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4 mb-8 p-4 rounded-2xl bg-card ring-1 ring-black/5 dark:ring-white/10"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-6 h-6 rounded-lg border-2 border-primary bg-background animate-pulse" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-6 h-6 rounded-lg bg-linear-to-br from-primary to-orange-500 shadow-lg shadow-primary/30" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-6 h-6 rounded-lg bg-muted" />
                  <span>Booked</span>
                </div>
              </motion.div>

              {/* Driver */}
              <div className="flex justify-end mb-8 pr-4">
                <div className="w-16 h-16 rounded-full border-2 border-border flex items-center justify-center opacity-50">
                  <MonitorStop className="w-7 h-7 rotate-90" />
                </div>
              </div>

              {/* Seat Grid */}
              {loading ? (
                <div className="grid grid-cols-5 gap-3">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="h-14 bg-muted/50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-3">
                  {seats.map((seat) => {
                    const isSelected = selectedSeats.find(s => s.seat_id === seat.seat_id);
                    const isBooked = seat.is_booked;

                    return (
                      <motion.button
                        key={seat.seat_id}
                        onClick={() => toggleSeat(seat)}
                        disabled={isBooked}
                        whileHover={!isBooked ? { scale: 1.05 } : {}}
                        whileTap={!isBooked ? { scale: 0.95 } : {}}
                        className={cn(
                          "relative h-14 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center group",
                          isBooked
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : isSelected
                              ? "bg-linear-to-br from-primary to-orange-500 text-white shadow-lg shadow-primary/30"
                              : "bg-background border-2 border-primary/30 text-primary hover:border-primary hover:bg-primary/5"
                        )}
                      >
                        <Armchair className={cn(
                          "w-5 h-5",
                          isSelected && "fill-current"
                        )} />
                        <span className="absolute -top-2 -right-2 text-[10px] bg-card border border-border px-1.5 rounded-full font-mono">
                          {seat.seat_number}
                        </span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Selected Seats Summary */}
              {selectedSeats.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 rounded-2xl bg-linear-to-br from-primary/10 to-orange-500/10 border border-primary/20"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="font-bold text-primary">Selected Seats:</span>
                    {selectedSeats.map((seat) => (
                      <div
                        key={seat.seat_id}
                        className="flex items-center gap-1 bg-primary/20 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/30"
                      >
                        <span>{seat.seat_number}</span>
                        <button
                          onClick={() => toggleSeat(seat)}
                          className="hover:text-foreground"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right: Passenger Details */}
          <div className="flex-1 overflow-y-auto p-8 bg-background">
            <div className="max-w-md mx-auto h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-black">Passenger Details</h3>
              </div>

              {selectedSeats.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-3xl">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4 relative">
                    <Armchair className="w-10 h-10 text-muted-foreground/30" />
                    <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/15 animate-spin" style={{ animationDuration: '8s' }} />
                    <div className="absolute -inset-2 rounded-full bg-linear-to-br from-primary/5 to-orange-500/5 blur-xl" />
                  </div>
                  <p className="text-muted-foreground font-medium">Select seats to add passengers</p>
                  <p className="text-muted-foreground/50 text-xs mt-1">Click on available seats on the left</p>
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
                        className="bg-muted/30 rounded-2xl p-5 ring-1 ring-black/5 dark:ring-white/10 hover:ring-primary/30 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/25">
                              {index + 1}
                            </div>
                            <span className="text-sm font-bold bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                              Seat {seat.seat_number}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleSeat(seat)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-muted-foreground hover:text-red-600 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={passengers[index]?.name || ''}
                            onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                            className="w-full bg-background border-2 border-border/50 focus:border-primary rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="number"
                              placeholder="Age"
                              value={passengers[index]?.age || ''}
                              onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                              className="w-full bg-background border-2 border-border/50 focus:border-primary rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            />
                            <div className="relative">
                              <select
                                value={passengers[index]?.gender || ''}
                                onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                                className="w-full bg-background border-2 border-border/50 focus:border-primary rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none appearance-none transition-all"
                              >
                                <option value="">Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Footer */}
              {selectedSeats.length > 0 && (
                <div className="border-t border-border/50 pt-6 mt-auto">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Total Amount</p>
                      <h3 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-500">
                        {formatCurrency(totalAmount)}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">
                        {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
                      </p>
                      <p className="text-xs text-muted-foreground">Selected</p>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleBooking}
                    disabled={booking}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-linear-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white font-black rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    {booking ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Booking</span>
                        <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </motion.button>
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