import mongoose from "mongoose";

const travelerSchema = new mongoose.Schema({
  traveler_id: {
    type: String,
    unique: true,
    trim: true
  },
  user_id: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User'
  },
  company_name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  business_contact: {
    type: String,
    required: [true, 'Business contact is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit contact number']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    }
  },
  verification_status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  verification_date: {
    type: Date
  },
  approved_by: {
    type: String,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Pre-save hook to auto-generate traveler_id
travelerSchema.pre('save', async function(next) {
  // Only generate for new documents
  if (!this.isNew || this.traveler_id) {
    return next();
  }
  
  try {
    // Find the last traveler by sorting traveler_id descending
    const lastTraveler = await this.constructor
      .findOne()
      .sort({ traveler_id: -1 })
      .select('traveler_id')
      .lean();
    
    let nextNumber = 1;
    
    if (lastTraveler && lastTraveler.traveler_id) {
      const lastNumber = parseInt(lastTraveler.traveler_id.replace('TRV', ''), 10);
      nextNumber = lastNumber + 1;
    }
    
    this.traveler_id = `TRV${String(nextNumber).padStart(6, '0')}`;
    // next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Traveler', travelerSchema);