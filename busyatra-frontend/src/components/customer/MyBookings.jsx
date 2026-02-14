import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, LocationOn, EventSeat, DirectionsBus,
  Cancel, ExpandMore, CheckCircle, Schedule,
  ConfirmationNumber, ArrowForward, Person,
  AccessTime, FiberManualRecord, Download,
  Print, Share, MapPin, Clock, Ticket,
  Info, AlertCircle, ChevronDown, ChevronUp,
  TrendingUp, Award
} from '@mui/icons-material';
import bookingService from '../../services/bookingService';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialog, setCancelDialog] = useState({ open: false, bookingId: null });
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      const bookingsData = response.data || [];
      setBookings(bookingsData);
    } catch (error) {
      console.error('Fetch bookings error:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await bookingService.cancelBooking(cancelDialog.bookingId);
      toast.success('🎉 Booking cancelled successfully');
      setCancelDialog({ open: false, bookingId: null });
      fetchBookings();
    } catch (error) {
      toast.error(error.message || 'Failed to cancel booking');
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      CONFIRMED: {
        color: 'emerald',
        icon: CheckCircle,
        bg: 'from-emerald-500/10 to-emerald-600/10',
        border: 'border-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400'
      },
      CANCELLED: {
        color: 'red',
        icon: Cancel,
        bg: 'from-red-500/10 to-red-600/10',
        border: 'border-red-500/20',
        text: 'text-red-600 dark:text-red-400'
      },
      PENDING: {
        color: 'amber',
        icon: Schedule,
        bg: 'from-amber-500/10 to-amber-600/10',
        border: 'border-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400'
      },
      COMPLETED: {
        color: 'blue',
        icon: CheckCircle,
        bg: 'from-blue-500/10 to-blue-600/10',
        border: 'border-blue-500/20',
        text: 'text-blue-600 dark:text-blue-400'
      },
    };
    return configs[status] || configs.PENDING;
  };

  const toggleExpand = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  const filteredBookings = filterStatus === 'ALL' 
    ? bookings 
    : bookings.filter(b => (b.booking?.booking_status || b.booking_status) === filterStatus);

  if (loading) {
    return (
      <div className="p-8">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-muted/30 animate-pulse rounded-3xl border border-border/50" />
          ))}
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[500px]">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center relative">
            <Ticket className="w-16 h-16 text-muted-foreground/30" />
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-muted-foreground/10" />
          </div>
          <h3 className="text-2xl font-black text-foreground mb-2">No Bookings Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start your journey by booking your first bus ticket
          </p>
          <button className="px-6 py-3 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-teal-500/25 transition-all">
            Book Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-2">
              My <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-pink-500">Bookings</span>
            </h2>
            <p className="text-muted-foreground">
              {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'} found
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED'].map(status => {
              const count = status === 'ALL' ? bookings.length : bookings.filter(b => (b.booking?.booking_status || b.booking_status) === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "px-4 py-2 rounded-full font-medium text-sm transition-all",
                    filterStatus === status
                      ? "bg-foreground text-background shadow-lg"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  )}
                >
                  {status} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-linear-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{bookings.length}</p>
                <p className="text-xs text-muted-foreground font-medium">Total</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-linear-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {bookings.filter(b => (b.booking?.booking_status || b.booking_status) === 'CONFIRMED').length}
                </p>
                <p className="text-xs text-muted-foreground font-medium">Active</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-linear-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(bookings.reduce((sum, b) => sum + (b.booking?.total_amount || b.total_amount || 0), 0))}
                </p>
                <p className="text-xs text-muted-foreground font-medium">Total Spent</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-linear-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {bookings.filter(b => (b.booking?.booking_status || b.booking_status) === 'COMPLETED').length}
                </p>
                <p className="text-xs text-muted-foreground font-medium">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredBookings.map((booking, index) => {
            const journeyDetails = booking.journey_details || {};
            const bookingInfo = booking.booking || {};
            
            const fromLocation = journeyDetails.from || bookingInfo.from_location || 'Unknown';
            const toLocation = journeyDetails.to || bookingInfo.to_location || 'Unknown';
            const departureTime = journeyDetails.departure_time || bookingInfo.departure_time;
            const arrivalTime = journeyDetails.arrival_time || bookingInfo.arrival_time;
            const journeyDate = journeyDetails.journey_date || bookingInfo.journey_date;
            const busType = journeyDetails.bus_type || bookingInfo.bus_type || 'Standard';
            
            const bookingId = bookingInfo.booking_id || booking.booking_id;
            const bookingReference = bookingInfo.booking_reference || booking.booking_reference || 'N/A';
            const bookingStatus = bookingInfo.booking_status || booking.booking_status || 'PENDING';
            const numberOfSeats = bookingInfo.number_of_seats || booking.number_of_seats || 0;
            const seatNumbers = bookingInfo.seat_numbers || booking.seat_numbers || [];
            const totalAmount = bookingInfo.total_amount || booking.total_amount || 0;
            const passengers = booking.passengers || [];
            
            const statusConfig = getStatusConfig(bookingStatus);
            const isExpanded = expandedBooking === bookingId;
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={bookingId || index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border/50 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:border-primary/20"
              >
                {/* Header */}
                <div className={cn(
                  "p-6 border-b border-border/50 bg-linear-to-r",
                  statusConfig.bg
                )}>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className={cn(
                        "px-4 py-2 rounded-2xl border-2 font-mono font-bold text-sm",
                        statusConfig.border,
                        statusConfig.text,
                        "bg-background"
                      )}>
                        {bookingReference}
                      </div>
                      {journeyDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{formatDate(journeyDate)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-2xl border",
                      statusConfig.border,
                      statusConfig.bg
                    )}>
                      <StatusIcon className={cn("w-4 h-4", statusConfig.text)} />
                      <span className={cn("font-bold text-sm", statusConfig.text)}>
                        {bookingStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Journey Info */}
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">From</p>
                        <p className="text-lg font-bold truncate">{fromLocation}</p>
                        {departureTime && (
                          <p className="text-sm text-muted-foreground font-medium">
                            {formatTime(departureTime)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">To</p>
                        <p className="text-lg font-bold truncate">{toLocation}</p>
                        {arrivalTime && (
                          <p className="text-sm text-muted-foreground font-medium">
                            {formatTime(arrivalTime)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center shrink-0">
                        <DirectionsBus className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Bus Type</p>
                        <p className="text-lg font-bold truncate">{busType}</p>
                        <p className="text-sm text-muted-foreground font-medium">
                          {numberOfSeats} {numberOfSeats === 1 ? 'Seat' : 'Seats'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Seats */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Seats</p>
                    <div className="flex flex-wrap gap-2">
                      {seatNumbers && seatNumbers.length > 0 ? (
                        seatNumbers.map((seat, idx) => (
                          <div
                            key={idx}
                            className="px-4 py-2 rounded-xl border-2 border-primary/20 bg-linear-to-br from-primary/5 to-primary/10 font-bold text-primary min-w-[60px] text-center"
                          >
                            {seat}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 rounded-xl bg-muted text-muted-foreground font-medium">
                          {numberOfSeats} {numberOfSeats === 1 ? 'Seat' : 'Seats'} Booked
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-4 pt-6 border-t border-border/50">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Fare</p>
                      <p className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-emerald-600">
                        {formatCurrency(totalAmount)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {bookingStatus === 'CONFIRMED' && (
                        <>
                          <button className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors group">
                            <Download className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </button>
                          <button 
                            onClick={() => setCancelDialog({ open: true, bookingId })}
                            className="px-6 py-3 rounded-xl border-2 border-red-500/20 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => toggleExpand(bookingId)}
                        className="px-6 py-3 rounded-xl bg-muted hover:bg-muted/80 font-bold transition-colors flex items-center gap-2"
                      >
                        {isExpanded ? 'Less' : 'More'} Details
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pt-6 mt-6 border-t border-border/50"
                      >
                        {passengers && passengers.length > 0 && (
                          <div>
                            <p className="text-sm font-bold mb-4">Passenger Details</p>
                            <div className="grid gap-3">
                              {passengers.map((passenger, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {idx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-bold">{passenger.passenger_name || passenger.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {passenger.passenger_age || passenger.age} years • {passenger.passenger_gender || passenger.gender}
                                    </p>
                                  </div>
                                  {seatNumbers && seatNumbers[idx] && (
                                    <div className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                                      Seat {seatNumbers[idx]}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Cancel Dialog */}
      <AnimatePresence>
        {cancelDialog.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setCancelDialog({ open: false, bookingId: null })}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-black text-center mb-2">Cancel Booking?</h3>
              <p className="text-muted-foreground text-center mb-8">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelDialog({ open: false, bookingId: null })}
                  className="flex-1 px-6 py-3 rounded-2xl bg-muted hover:bg-muted/80 font-bold transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="flex-1 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;