import mongoose from "mongoose"

const busScheduleSchema = new mongoose.Schema({
  schedule_id: {
    type: String,
    // required: true,
    unique: true,
    trim: true
  },
  bus_id: {
    type: String,
    required: [true, 'Bus ID is required'],
    ref: 'Bus'
  },
  journey_date: {
    type: Date,
    required: [true, 'Journey date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Journey date cannot be in the past'
    }
  },
  departure_time: {
    type: String,
    required: [true, 'Departure time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
  },
  arrival_time: {
    type: String,
    required: [true, 'Arrival time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
  },
  total_seats: {
    type: Number,
    required: [true, 'Total seats is required']
  },
  available_seats: {
    type: Number,
    required: [true, 'Available seats is required']
  },
  booked_seats: {
    type: Number,
    default: 0
  },
  schedule_status: {
    type: String,
    enum: ['ACTIVE', 'CANCELLED', 'COMPLETED'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true
});

// Auto-generate schedule_id
busScheduleSchema.pre('save', async function(next) {
  if (this.schedule_id) return next();
  
  const count = await this.constructor.countDocuments();
  this.schedule_id = `SCH${String(count + 1).padStart(6, '0')}`;
  // next();
});

// Validate available_seats <= total_seats
busScheduleSchema.pre('save', function(next) {
  if (this.available_seats > this.total_seats) {
    next(new Error('Available seats cannot exceed total seats'));
  }
  // next();
});

export default mongoose.model('BusSchedule', busScheduleSchema);
