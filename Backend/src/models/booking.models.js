import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
  booking_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  booking_reference: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  user_id: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User'
  },
  schedule_id: {
    type: String,
    required: [true, 'Schedule ID is required'],
    ref: 'BusSchedule'
  },
  traveler_id: {
    type: String,
    required: [true, 'Traveler ID is required'],
    ref: 'Traveler'
  },
  number_of_seats: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: [1, 'At least 1 seat must be booked'],
    max: [6, 'Cannot book more than 6 seats at once']
  },
  seat_numbers: [{
    type: String,
    required: true
  }],
  total_amount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  booking_status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    default: 'PENDING'
  },
  payment_status: {
    type: String,
    enum: ['UNPAID', 'PAID', 'REFUNDED'],
    default: 'UNPAID'
  },
  payment_method: {
    type: String,
    enum: ['UPI', 'Card', 'Net Banking', 'Cash', 'Wallet']
  },
  payment_id: {
    type: String
  },
  booking_date: {
    type: Date,
    default: Date.now
  },
  cancellation_date: {
    type: Date
  },
  refund_amount: {
    type: Number,
    default: 0,
    min: [0, 'Refund amount cannot be negative']
  }
}, {
  timestamps: true
});

// NO PRE-SAVE HOOKS - IDs are generated in the controller

// Indexes for better query performance
bookingSchema.index({ user_id: 1, createdAt: -1 });
bookingSchema.index({ booking_status: 1 });
bookingSchema.index({ schedule_id: 1 });
bookingSchema.index({ booking_reference: 1 });

export default mongoose.model('Booking', bookingSchema);