import User from "../models/user.models.js";
import Traveler from "../models/travelers.models.js"
import Admin from "../models/admin.models.js"
import Bus from "../models/bus.models.js"
import BusSchedule from "../models/busSchedule.models.js"
import Booking from "../models/booking.models.js"
import SupportTicket from "../models/supportTickets.models.js"
import ErrorResponse from "../utils/errorResponse.utils.js"
import asyncHandler from "../utils/asyncHandler.utils.js"




// ================================================================
// TRAVELER MANAGEMENT
// ================================================================

// @desc    Get all travelers (pending, approved, rejected)
// @route   GET /api/admin/travelers
// @access  Private/Admin


export const getAllTravelers = asyncHandler(async (req, res, next) => {
  const { status, search, page = 1, limit = 10 } = req.query;

  
  let query = {};
  
  if (status) {
    query.verification_status = status.toUpperCase();
  }

  // Search by company name or contact
  if (search) {
    query.$or = [
      { company_name: { $regex: search, $options: 'i' } },
      { business_contact: { $regex: search, $options: 'i' } }
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;

  const travelers = await Traveler.find(query)
    .populate('user_id', 'full_name email mobile_number')
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Traveler.countDocuments(query);

  res.status(200).json({
    success: true,
    count: travelers.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: travelers
  });
});

// @desc    Get traveler details
// @route   GET /api/admin/travelers/:id
// @access  Private/Admin
export const getTravelerDetails = asyncHandler(async (req, res, next) => {
  const traveler = await Traveler.findOne({ traveler_id: req.params.id })
    .populate('user_id', 'full_name email mobile_number role');

  if (!traveler) {
    return next(new ErrorResponse('Traveler not found', 404));
  }

  // Get traveler's buses count
  const busCount = await Bus.countDocuments({ traveler_id: traveler.traveler_id });

  // Get traveler's total revenue
  const revenueStats = await Booking.aggregate([
    {
      $lookup: {
        from: 'busschedules',
        localField: 'schedule_id',
        foreignField: 'schedule_id',
        as: 'schedule'
      }
    },
    { $unwind: '$schedule' },
    {
      $lookup: {
        from: 'buses',
        localField: 'schedule.bus_id',
        foreignField: 'bus_id',
        as: 'bus'
      }
    },
    { $unwind: '$bus' },
    {
      $match: {
        'bus.traveler_id': traveler.traveler_id,
        booking_status: 'CONFIRMED'
      }
    },
    {
      $group: {
        _id: null,
        total_revenue: { $sum: '$total_amount' },
        total_bookings: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      traveler,
      stats: {
        buses: busCount,
        revenue: revenueStats[0]?.total_revenue || 0,
        bookings: revenueStats[0]?.total_bookings || 0
      }
    }
  });
});

// @desc    Onboard new traveler (Create traveler profile for existing user)
// @route   POST /api/admin/travelers/onboard
// @access  Private/Admin
export const onboardTraveler = asyncHandler(async (req, res, next) => {
  const { user_id, company_name, business_contact, address } = req.body;

  // Check if user exists
  const user = await User.findOne({ user_id });
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Check if user is already a traveler
  const existingTraveler = await Traveler.findOne({ user_id });
  if (existingTraveler) {
    return next(new ErrorResponse('User is already a traveler', 400));
  }

  // Update user role to TRAVELER
  user.role = 'TRAVELER';
  await user.save();

  // Create traveler profile
  const traveler = await Traveler.create({
    user_id,
    company_name,
    business_contact,
    address,
    verification_status: 'APPROVED' // Auto-approve when admin creates
  });

  res.status(201).json({
    success: true,
    message: 'Traveler onboarded successfully',
    data: traveler
  });
});

// @desc    Update traveler verification status
// @route   PUT /api/admin/travelers/:id/status
// @access  Private/Admin
export const updateTravelerStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
    return next(new ErrorResponse('Invalid status value', 400));
  }

  const traveler = await Traveler.findOne({ traveler_id: req.params.id });
  
  if (!traveler) {
    return next(new ErrorResponse('Traveler not found', 404));
  }

  traveler.verification_status = status;
  await traveler.save();

  // If rejected, change user role back to CUSTOMER
  if (status === 'REJECTED') {
    await User.findOneAndUpdate(
      { user_id: traveler.user_id },
      { role: 'CUSTOMER' }
    );
  }

  res.status(200).json({
    success: true,
    message: `Traveler ${status.toLowerCase()} successfully`,
    data: traveler
  });
});

// ================================================================
// SUPPORT TICKET MANAGEMENT
// ================================================================


// @desc    Get all support tickets
// @route   GET /api/admin/tickets
// @access  Private/Admin

export const getAllTickets = asyncHandler(async (req, res, next) => {
  const { status, priority, type, page = 1, limit = 10 } = req.query;

  let query = {};
  
  if (status) query.ticket_status = status.toUpperCase();
  if (priority) query.priority = priority.toUpperCase();
  if (type) query.ticket_type = type.toUpperCase();

  const skip = (page - 1) * limit;

  const tickets = await SupportTicket.find(query)
    .populate('traveler_id', 'company_name business_contact')
    .populate('admin_id', 'user_id')
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await SupportTicket.countDocuments(query);

  res.status(200).json({
    success: true,
    count: tickets.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: tickets
  });
});


// @desc    Get ticket details
// @route   GET /api/admin/tickets/:id
// @access  Private/Admin


export const getTicketDetails = asyncHandler(async (req, res, next) => {
  const ticket = await SupportTicket.findOne({ ticket_id: req.params.id })
    .populate('traveler_id', 'company_name business_contact user_id')
    .populate('admin_id', 'user_id');

  if (!ticket) {
    return next(new ErrorResponse('Ticket not found', 404));
  }

  res.status(200).json({
    success: true,
    data: ticket
  });
});


// @desc    Assign ticket to admin
// @route   PUT /api/admin/tickets/:id/assign
// @access  Private/Admin

export const assignTicket = asyncHandler(async (req, res, next) => {
  const ticket = await SupportTicket.findOne({ ticket_id: req.params.id });
  
  if (!ticket) {
    return next(new ErrorResponse('Ticket not found', 404));
  }

  // Get admin profile from req.user
  const admin = await Admin.findOne({ user_id: req.user.user_id });
  
  if (!admin) {
    return next(new ErrorResponse('Admin profile not found', 404));
  }

  ticket.admin_id = admin.admin_id;
  ticket.ticket_status = 'IN_PROGRESS';
  await ticket.save();

  res.status(200).json({
    success: true,
    message: 'Ticket assigned successfully',
    data: ticket
  });
});


// @desc    Resolve/Close ticket
// @route   PUT /api/admin/tickets/:id/resolve
// @access  Private/Admin

export const resolveTicket = asyncHandler(async (req, res, next) => {
  const { resolution_notes } = req.body;

  if (!resolution_notes) {
    return next(new ErrorResponse('Resolution notes are required', 400));
  }

  const ticket = await SupportTicket.findOne({ ticket_id: req.params.id });
  
  if (!ticket) {
    return next(new ErrorResponse('Ticket not found', 404));
  }

  ticket.ticket_status = 'RESOLVED';
  ticket.resolution_notes = resolution_notes;
  await ticket.save();

  res.status(200).json({
    success: true,
    message: 'Ticket resolved successfully',
    data: ticket
  });
});



// ================================================================
// SYSTEM ANALYTICS & REPORTS
// ================================================================

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin


export const getDashboardStats = asyncHandler(async (req, res, next) => {
  // Total counts
  const totalUsers = await User.countDocuments({ role: 'CUSTOMER' });
  const totalTravelers = await Traveler.countDocuments({ verification_status: 'APPROVED' });
  const totalBuses = await Bus.countDocuments({ is_active: true });
  const totalBookings = await Booking.countDocuments();

  // Revenue stats
  const revenueStats = await Booking.aggregate([
    {
      $match: {
        booking_status: 'CONFIRMED',
        payment_status: 'PAID'
      }
    },
    {
      $group: {
        _id: null,
        total_revenue: { $sum: '$total_amount' },
        confirmed_bookings: { $sum: 1 }
      }
    }
  ]);

  // Recent bookings (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentBookings = await Booking.countDocuments({
    booking_date: { $gte: sevenDaysAgo }
  });

  // Pending tickets
  const pendingTickets = await SupportTicket.countDocuments({
    ticket_status: 'OPEN'
  });

  // Pending traveler approvals
  const pendingTravelers = await Traveler.countDocuments({
    verification_status: 'PENDING'
  });

  res.status(200).json({
    success: true,
    data: {
      users: totalUsers,
      travelers: totalTravelers,
      buses: totalBuses,
      bookings: totalBookings,
      revenue: revenueStats[0]?.total_revenue || 0,
      confirmed_bookings: revenueStats[0]?.confirmed_bookings || 0,
      recent_bookings: recentBookings,
      pending_tickets: pendingTickets,
      pending_approvals: pendingTravelers
    }
  });
});



// @desc    Get revenue report
// @route   GET /api/admin/reports/revenue
// @access  Private/Admin


export const getRevenueReport = asyncHandler(async (req, res, next) => {
  const { start_date, end_date, groupBy = 'day' } = req.query;

  let matchStage = {
    booking_status: 'CONFIRMED',
    payment_status: 'PAID'
  };

  // Add date filter if provided
  if (start_date && end_date) {
    matchStage.booking_date = {
      $gte: new Date(start_date),
      $lte: new Date(end_date)
    };
  }

  // Group format based on groupBy parameter
  let dateFormat;
  switch(groupBy) {
    case 'month':
      dateFormat = '%Y-%m';
      break;
    case 'week':
      dateFormat = '%Y-W%V';
      break;
    default:
      dateFormat = '%Y-%m-%d';
  }

  const revenueReport = await Booking.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          $dateToString: {
            format: dateFormat,
            date: '$booking_date'
          }
        },
        total_revenue: { $sum: '$total_amount' },
        total_bookings: { $sum: 1 },
        total_seats: { $sum: '$number_of_seats' }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: '$_id',
        revenue: '$total_revenue',
        bookings: '$total_bookings',
        seats: '$total_seats',
        _id: 0
      }
    }
  ]);

  res.status(200).json({
    success: true,
    count: revenueReport.length,
    data: revenueReport
  });
});



// @desc    Get top travelers by revenue
// @route   GET /api/admin/reports/top-travelers
// @access  Private/Admin


export const getTopTravelers = asyncHandler(async (req, res, next) => {
  const { limit = 10 } = req.query;

  const topTravelers = await Booking.aggregate([
    {
      $match: {
        booking_status: 'CONFIRMED',
        payment_status: 'PAID'
      }
    },
    {
      $lookup: {
        from: 'busschedules',
        localField: 'schedule_id',
        foreignField: 'schedule_id',
        as: 'schedule'
      }
    },
    { $unwind: '$schedule' },
    {
      $lookup: {
        from: 'buses',
        localField: 'schedule.bus_id',
        foreignField: 'bus_id',
        as: 'bus'
      }
    },
    { $unwind: '$bus' },
    {
      $lookup: {
        from: 'travelers',
        localField: 'bus.traveler_id',
        foreignField: 'traveler_id',
        as: 'traveler'
      }
    },
    { $unwind: '$traveler' },
    {
      $group: {
        _id: '$traveler.traveler_id',
        company_name: { $first: '$traveler.company_name' },
        total_revenue: { $sum: '$total_amount' },
        total_bookings: { $sum: 1 },
        total_seats: { $sum: '$number_of_seats' }
      }
    },
    { $sort: { total_revenue: -1 } },
    { $limit: parseInt(limit) }
  ]);

  res.status(200).json({
    success: true,
    count: topTravelers.length,
    data: topTravelers
  });
});


// @desc    Get booking statistics
// @route   GET /api/admin/reports/bookings
// @access  Private/Admin

export const getBookingStats = asyncHandler(async (req, res, next) => {
  const stats = await Booking.aggregate([
    {
      $group: {
        _id: '$booking_status',
        count: { $sum: 1 },
        total_amount: { $sum: '$total_amount' }
      }
    }
  ]);

  const paymentStats = await Booking.aggregate([
    {
      $group: {
        _id: '$payment_status',
        count: { $sum: 1 },
        total_amount: { $sum: '$total_amount' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      by_status: stats,
      by_payment: paymentStats
    }
  });
});


// ================================================================
// USER MANAGEMENT
// ================================================================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin


export const getAllUsers = asyncHandler(async (req, res, next) => {
  const { role, search, page = 1, limit = 10 } = req.query;

  let query = {};
  
  if (role) query.role = role.toUpperCase();
  
  if (search) {
    query.$or = [
      { full_name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { mobile_number: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .select('-password')
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: users
  });
});


// @desc    Deactivate/Activate user
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private/Admin

export const toggleUserStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ user_id: req.params.id });
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  user.is_active = !user.is_active;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.is_active ? 'activated' : 'deactivated'} successfully`,
    data: user
  });
});


// ================================================================
// BUS & SCHEDULE MANAGEMENT (OVERRIDE CAPABILITIES)
// ================================================================

// @desc    Get all buses (across all travelers)
// @route   GET /api/admin/buses
// @access  Private/Admin

export const getAllBuses = asyncHandler(async (req, res, next) => {
  const { status, search, page = 1, limit = 10 } = req.query;

  let query = {};
  
  if (status) query.is_active = status === 'active';
  
  if (search) {
    query.$or = [
      { bus_number: { $regex: search, $options: 'i' } },
      { from_location: { $regex: search, $options: 'i' } },
      { to_location: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const buses = await Bus.find(query)
    .populate('traveler_id', 'company_name')
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Bus.countDocuments(query);

  res.status(200).json({
    success: true,
    count: buses.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: buses
  });
});


// @desc    Deactivate any bus (admin override)
// @route   PUT /api/admin/buses/:id/deactivate
// @access  Private/Admin

export const deactivateBus = asyncHandler(async (req, res, next) => {
  const bus = await Bus.findOne({ bus_id: req.params.id });
  
  if (!bus) {
    return next(new ErrorResponse('Bus not found', 404));
  }

  bus.is_active = false;
  await bus.save();

  // Also cancel all future schedules
  await BusSchedule.updateMany(
    {
      bus_id: bus.bus_id,
      journey_date: { $gte: new Date() },
      schedule_status: 'ACTIVE'
    },
    {
      schedule_status: 'CANCELLED'
    }
  );

  res.status(200).json({
    success: true,
    message: 'Bus deactivated and future schedules cancelled',
    data: bus
  });
});