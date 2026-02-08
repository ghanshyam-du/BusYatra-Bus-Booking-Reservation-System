import mongoose from "mongoose";

const bookingSeatSchema = new mongoose.Schema({
  booking_seat_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  booking_id: {
    type: String,
    required: [true, 'Booking ID is required'],
    ref: 'Booking'
  },
  seat_id: {
    type: String,
    required: [true, 'Seat ID is required'],
    ref: 'Seat'
  },
  passenger_name: {
    type: String,
    required: [true, 'Passenger name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  passenger_age: {
    type: Number,
    required: [true, 'Passenger age is required'],
    min: [1, 'Age must be at least 1'],
    max: [120, 'Age cannot exceed 120']
  },
  passenger_gender: {
    type: String,
    required: [true, 'Passenger gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  passenger_id_type: {
    type: String,
    enum: ['Aadhar', 'PAN', 'Passport', 'Driving License', 'Voter ID'],
    default: 'Aadhar'
  },
  passenger_id_number: {
    type: String,
    default: 'N/A',
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSeatSchema.index({ booking_id: 1 });
bookingSeatSchema.index({ seat_id: 1 });

export default mongoose.model('BookingSeat', bookingSeatSchema);