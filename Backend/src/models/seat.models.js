import mongoose from "mongoose"

const seatSchema = new mongoose.Schema({
  seat_id: {
    type: String,
    // required: true,
    unique: true,
    trim: true
  },
  schedule_id: {
    type: String,
    required: [true, 'Schedule ID is required'],
    ref: 'BusSchedule'
  },
  seat_number: {
    type: String,
    required: [true, 'Seat number is required'],
    trim: true
  },
  seat_type: {
    type: String,
    enum: ['SLEEPER', 'SEATER', 'SEMI_SLEEPER'],
    required: [true, 'Seat type is required']
  },
  seat_position: {
    row: {
      type: String,
      required: true
    },
    column: {
      type: Number,
      required: true
    },
    level: {
      type: String,
      enum: ['LOWER', 'UPPER'],
      required: true
    }
  },
  is_booked: {
    type: Boolean,
    default: false
  },
  booking_id: {
    type: String,
    ref: 'Booking',
    default: null
  }
}, {
  timestamps: true
});

// Auto-generate seat_id
seatSchema.pre('save', async function(next) {
  if (this.seat_id) return next();
  
  const count = await this.constructor.countDocuments();
  this.seat_id = `SEAT${String(count + 1).padStart(6, '0')}`;
  next();
});

// Compound index for schedule and seat number uniqueness
seatSchema.index({ schedule_id: 1, seat_number: 1 }, { unique: true });

export default mongoose.model('Seat', seatSchema);