import mongoose from "mongoose"

const busSchema = new mongoose.Schema({
  bus_id: {
    type: String,
    unique: true,
    trim: true
  },
  traveler_id: {
    type: String,
    required: [true, 'Traveler ID is required'],
    ref: 'Traveler'
  },
  bus_number: {
    type: String,
    required: [true, 'Bus number is required'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/, 'Please enter a valid bus number (e.g., GJ01AB1234)']
  },
  bus_type: {
    type: String,
    required: [true, 'Bus type is required'],
    enum: ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Non-AC Seater', 'Semi Sleeper']
  },
  bus_model: {
    type: String,
    trim: true
  },
  from_location: {
    type: String,
    required: [true, 'From location is required'],
    trim: true
  },
  to_location: {
    type: String,
    required: [true, 'To location is required'],
    trim: true
  },
  total_seats: {
    type: Number,
    required: [true, 'Total seats is required'],
    min: [10, 'Bus must have at least 10 seats'],
    max: [60, 'Bus cannot have more than 60 seats']
  },
  fare: {
    type: Number,
    required: [true, 'Fare is required'],
    min: [100, 'Fare must be at least ₹100']
  },
  amenities: [{
    type: String,
    enum: ['WiFi', 'Charging Port', 'Water Bottle', 'Blanket', 'TV', 'Reading Light', 'Emergency Exit']
  }],
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-generate bus_id
busSchema.pre('save', async function(next) {
  // if (this.bus_id) return next();
  
  const count = await this.constructor.countDocuments();
  this.bus_id = `BUS${String(count + 1).padStart(6, '0')}`;
  // next();
});

// Validate from and to locations are different
busSchema.pre('save', function(next) {
  if (this.from_location === this.to_location) {
    next(new Error('From and To locations must be different'));
  }
  // next();
});

export default mongoose.model('Bus', busSchema);