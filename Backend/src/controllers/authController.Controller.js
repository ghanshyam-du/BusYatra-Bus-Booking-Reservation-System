import User from "../models/user.models.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import ErrorResponse from "../utils/errorResponse.utils.js"
import sendTokenResponse from "../utils/sendTokenResponse.utils.js"

import crypto from "crypto"


// @desc    Register user
// @route   POST /api/auth/register
// @access  Public

export const register = asyncHandler(async (req, res, next) => {
  const { full_name, email, mobile_number, password, gender, date_of_birth } = req.body;

  // Validate input
  if (!full_name || !email || !mobile_number || !password || !gender || !date_of_birth) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ 
    $or: [{ email }, { mobile_number }] 
  });

  if (existingUser) {
    if (existingUser.email === email) {
      return next(new ErrorResponse('Email already registered', 400));
    }
    if (existingUser.mobile_number === mobile_number) {
      return next(new ErrorResponse('Mobile number already registered', 400));
    }
  }

  // Create user
  const user = await User.create({
    full_name,
    email,
    mobile_number,
    password,
    gender,
    date_of_birth,
    role: 'CUSTOMER' // Default role
  });

  // Send token response
  sendTokenResponse(user, 201, res, 'Registration successful');
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  // Check for user (include password field)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if account is active
  if (!user.is_active) {
    return next(new ErrorResponse('Account is deactivated. Contact support.', 403));
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Send token response
  sendTokenResponse(user, 200, res, 'Login successful');
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private


export const getMe = asyncHandler(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private


export const updateProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    full_name: req.body.full_name,
    mobile_number: req.body.mobile_number,
    gender: req.body.gender,
    date_of_birth: req.body.date_of_birth
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findOneAndUpdate(
    { user_id: req.user.user_id },
    fieldsToUpdate,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

// @desc    Change password
// @route   PUT /api/auth/changepassword
// @access  Private


export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Please provide current and new password', 400));
  }

  // Get user with password
  const user = await User.findOne({ user_id: req.user.user_id }).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Send token response
  sendTokenResponse(user, 200, res, 'Password changed successfully');
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public


export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('User not found with this email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();  //-----<<<<<--------------------

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

  // For now, just return the token (in production, send email)
  res.status(200).json({
    success: true,
    message: 'Password reset token generated',
    resetToken, // Remove this in production
    resetUrl,   // Remove this in production
    note: 'In production, this will be sent via email'
  });
});



// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public


export const resetPassword = asyncHandler(async (req, res, next) => {
 

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Send token response
  sendTokenResponse(user, 200, res, 'Password reset successful');
});

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private


export const logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    data: {}
  });
});
