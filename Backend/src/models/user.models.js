import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import crypto from "crypto"
const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    unique: true,
    trim: true
  },
  full_name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  mobile_number: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['CUSTOMER', 'TRAVELER', 'ADMIN'],
    default: 'CUSTOMER'
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
  date_of_birth: {
    type: Date, 
    required: [true, 'Date of birth is required']
  },
  is_active: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return ;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
});

// Generate user_id
userSchema.pre('save', async function() {
  if (this.user_id) return ;
  
  const count = await this.constructor.countDocuments();
  this.user_id = `USR${String(count + 1).padStart(6, '0')}`;
  
});

// Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      user_id: this.user_id,
      email: this.email,
      role: this.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  
  
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default mongoose.model('User', userSchema);