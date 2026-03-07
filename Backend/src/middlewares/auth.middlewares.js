import jwt from "jsonwebtoken"
import User from "../models/user.models.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import ErrorResponse from "../utils/errorResponse.utils.js"



export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // FIX: Handle both 'user_id' and 'id' field names in JWT payload
    const userId = decoded.user_id || decoded.id;

    if (!userId) {
      return next(new ErrorResponse('Invalid token payload', 401));
    }

    req.user = await User.findOne({ user_id: userId }).select('-password');

    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (!req.user.is_active) {
      return next(new ErrorResponse('Account is deactivated', 403));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});


// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role?.toUpperCase();
    const allowedRoles = roles.map(r => r.toUpperCase());

    if (!allowedRoles.includes(userRole)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};