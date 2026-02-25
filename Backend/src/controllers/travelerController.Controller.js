import Bus from "../models/bus.models.js"
import BusSchedule from "../models/busSchedule.models.js"
import Seat from "../models/seat.models.js"
import Booking from "../models/booking.models.js"
import Traveler from "../models/travelers.models.js"
import SupportTicket from "../models/supportTickets.models.js"
import asyncHandler from "../utils/asyncHandler.utils.js";
import ErrorResponse from "../utils/errorResponse.utils.js";
import mongoose from "mongoose";
// import busScheduleModels from "../models/busSchedule.models.js"


// @desc    Add new bus
// @route   POST /api/traveler/buses
// @access  Private (Traveler only)

export const addBus = asyncHandler(async (req, res, next) => {
    const { bus_number,
        bus_type,
        bus_model,
        from_location,
        to_location,
        total_seats,
        fare,
        amenities
    } = req.body;

    const traveler = await Traveler.findOne({ user_id: req.user.user_id });

    if (!traveler) {
        return next(new ErrorResponse("Traveler profile not found", 404));
    }

    if (traveler.verification_status !== "APPROVED") {
        return next(new ErrorResponse("Your account is not approved yet. Please wait for admin approvel.", 403));
    }

    if (!bus_number || !bus_type || !bus_model || !from_location || !to_location || !total_seats || !fare || !amenities) {
        return next(new ErrorResponse("Please provide all required fields", 400));
    }

    const existingBus = await Bus.findOne({ bus_number: bus_number.toUpperCase() });
    if (existingBus) {
        return next(new ErrorResponse("Bus number already exists", 400))
    }

    const bus = await Bus.create({
        traveler_id: traveler.traveler_id,
        bus_number: bus_number.toUpperCase(),
        bus_type,
        bus_model,
        from_location,
        to_location,
        total_seats,
        fare,
        amenities: amenities || []
    });

    res.status(201).json({
        success: true,
        message: "Bus added Successfully",
        data: Bus
    });
})


// @desc    Get all buses for logged-in traveler
// @route   GET /api/traveler/buses
// @access  Private (Traveler only)


export const getMyBuses = asyncHandler(async (req, res, next) => {
    const traveler = await Traveler.findOne({ user_id: req.user.user_id });

    if (!traveler) {
        return next(new ErrorResponse("Traveler profile not found", 404));
    }

    const buses = await Bus.find({ traveler_id: traveler.traveler_id }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: buses.length,
        data: buses
    })
})


// @desc    Get single bus details
// @route   GET /api/traveler/buses/:busId
// @access  Private (Traveler only)

export const getBusDetails = asyncHandler(async (req, res, next) => {
    const { busId } = req.params;
    const traveler = await Traveler.findOne({ user_id: req.user.user_id });


    if (!traveler) {
        return next(new ErrorResponse("Traveler profile not found", 404));
    }

    const bus = await Bus.findOne({ bus_Id: busId });

    if (!bus) {
        return next(new ErrorResponse("Bus not found", 404));
    }

    if (bus.traveler_id !== traveler.traveler_id) {
        return next(new ErrorResponse("Not authorized to view this bus", 403));
    }

    const schedules = await BusSchedule.findOne({ bus_id: busId }).sort({ journey_date: -1 })

    res.status(200).json({
        success: true,
        data: {
            bus,
            schedules_count: schedules.length,
            upcoming_schedules: schedules.filter(s => new Date(s.journey_date) >= new Date()).length
        }
    });

})


// @desc    Update bus
// @route   PUT /api/traveler/buses/:busId
// @access  Private (Traveler only)

export const updateBus = asyncHandler(async (req, res, next) => {
    const { busId } = req.params;

    const traveler = await Traveler.findOne({ user_id: req.user.user_id });

    if (!traveler) {
        return next(new ErrorResponse("Traveler profile not found", 404));
    }

    const bus = await Bus.findOne({ bus_id: busId });

    if (!bus) {
        return next(new ErrorResponse("Bus not found", 404));
    }

    if (bus.traveler_id !== traveler.traveler_id) {
        return next(new ErrorResponse("Not authorized to view the bus", 403));
    }

    const allowedUpdates = ['bus_type', 'bus_model', 'fare', 'amenities', 'is_active'];
    const updates = {};

    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    bus = await Bus.findOneAndUpdate({ bus_id: busId }, updates, { new: true, runValidators: true });

    res.status(200).json({
        success: true,
        message: "Bus updated successfully",
        data: bus
    });
});



// @desc    Delete bus (soft delete by setting is_active to false)
// @route   DELETE /api/traveler/buses/:busId
// @access  Private (Traveler only)


export const deleteBus = asyncHandler(async (req, res, next) => {
  const { busId } = req.params;
  const traveler = await Traveler.findOne({ user_id: req.user.user_id });

  if (!traveler) {
    return next(new ErrorResponse('Traveler profile not found', 404));
  }

  const bus = await Bus.findOne({ bus_id: busId });

  if (!bus) {
    return next(new ErrorResponse('Bus not found', 404));
  }

  // Check ownership
  if (bus.traveler_id !== traveler.traveler_id) {
    return next(new ErrorResponse('Not authorized to delete this bus', 403));
  }

  // Check if bus has upcoming schedules
  const upcomingSchedules = await BusSchedule.countDocuments({
    bus_id: busId,
    journey_date: { $gte: new Date() },
    schedule_status: 'ACTIVE'
  });

  if (upcomingSchedules > 0) {
    return next(new ErrorResponse('Cannot delete bus with upcoming schedules. Cancel schedules first.', 400));
  }

  // Soft delete
  bus.is_active = false;
  await bus.save();

  res.status(200).json({
    success: true,
    message: 'Bus deleted successfully',
    data: {}
  });
});


// ================================================================
// SCHEDULE MANAGEMENT
// ================================================================


// @desc    Create bus schedule (auto-generates seats)
// @route   POST /api/traveler/schedules
// @access  Private (Traveler only)

export const createSchedule = asyncHandler(async (req, res, next) => {
  const { bus_id, journey_date, departure_time, arrival_time } = req.body;

  const traveler = await Traveler.findOne({ user_id: req.user.user_id });

  if (!traveler) {
    return next(new ErrorResponse('Traveler profile not found', 404));
  }

  // Validate required fields
  if (!bus_id || !journey_date || !departure_time || !arrival_time) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }

  // Get bus details
  const bus = await Bus.findOne({ bus_id });

  if (!bus) {
    return next(new ErrorResponse('Bus not found', 404));
  }

  // Check ownership
  if (bus.traveler_id !== traveler.traveler_id) {
    return next(new ErrorResponse('Not authorized to create schedule for this bus', 403));
  }

  if (!bus.is_active) {
    return next(new ErrorResponse('Cannot create schedule for inactive bus', 400));
  }

  // Validate journey date
  const scheduleDate = new Date(journey_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (scheduleDate < today) {
    return next(new ErrorResponse('Journey date cannot be in the past', 400));
  }

  // Check if schedule already exists for this bus on this date
  const existingSchedule = await BusSchedule.findOne({
    bus_id,
    journey_date: {
      $gte: new Date(journey_date + 'T00:00:00.000Z'),
      $lt: new Date(journey_date + 'T23:59:59.999Z')
    }
  });

  if (existingSchedule) {
    return next(new ErrorResponse('Schedule already exists for this bus on this date', 400));
  }

  // Start transaction for creating schedule and seats
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create schedule
    const schedule = await BusSchedule.create([{
      bus_id,
      journey_date: new Date(journey_date),
      departure_time,
      arrival_time,
      total_seats: bus.total_seats,
      available_seats: bus.total_seats,
      booked_seats: 0,
      schedule_status: 'ACTIVE'
    }], { session });

    const scheduleId = schedule[0].schedule_id;

    // Get current seat count for proper seat_id generation
    const currentSeatCount = await Seat.countDocuments();

    // Auto-generate seats based on total_seats
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 5;
    const totalRows = Math.ceil(bus.total_seats / seatsPerRow);

    let seatCounter = 1;

    for (let rowIndex = 0; rowIndex < totalRows && seatCounter <= bus.total_seats; rowIndex++) {
      const row = rows[rowIndex];
      
      for (let col = 1; col <= seatsPerRow && seatCounter <= bus.total_seats; col++) {
        // Generate seat_id manually for insertMany
        const seat_id = `SEAT${String(currentSeatCount + seatCounter).padStart(6, '0')}`;
        
        seats.push({
          seat_id, // ✅ Manually generated seat_id
          schedule_id: scheduleId,
          seat_number: `${row}${col}`,
          seat_type: rowIndex < 4 ? 'SLEEPER' : 'SEATER', // First 4 rows SLEEPER, rest SEATER
          seat_position: {
            row: row,
            column: col,
            level: col <= 2 ? 'LOWER' : 'UPPER'
          },
          is_booked: false,
          booking_id: null
        });
        seatCounter++;
      } 
    }

    // Insert all seats with manually generated seat_ids 
    await Seat.insertMany(seats, { session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: `Schedule created successfully with ${seats.length} seats`,
      data: {
        schedule: schedule[0],
        seats_generated: seats.length
      }
    });

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});





// @desc    Get all schedules for traveler's buses
// @route   GET /api/traveler/schedules
// @access  Private (Traveler only)


export const getMySchedules = asyncHandler(async (req, res, next) => {
  const traveler = await Traveler.findOne({ user_id: req.user.user_id });

  if (!traveler) {
    return next(new ErrorResponse('Traveler profile not found', 404));
  }

  const { status, date_from, date_to } = req.query;

  // Get all buses for this traveler
  const buses = await Bus.find({ traveler_id: traveler.traveler_id });
  const busIds = buses.map(b => b.bus_id);

  // Build query
  const query = { bus_id: { $in: busIds } };

  if (status) {
    query.schedule_status = status.toUpperCase();
  }

  if (date_from || date_to) {
    query.journey_date = {};
    if (date_from) {
      query.journey_date.$gte = new Date(date_from);
    }
    if (date_to) {
      query.journey_date.$lte = new Date(date_to);
    }
  }

  const schedules = await BusSchedule.find(query).sort({ journey_date: -1 });

  // Enrich with bus details
  const enrichedSchedules = schedules.map(schedule => {
    const bus = buses.find(b => b.bus_id === schedule.bus_id);
    return {
      schedule_id: schedule.schedule_id,
      journey_date: schedule.journey_date,
      departure_time: schedule.departure_time,
      arrival_time: schedule.arrival_time,
      total_seats: schedule.total_seats,
      available_seats: schedule.available_seats,
      booked_seats: schedule.booked_seats,
      schedule_status: schedule.schedule_status,
      bus: {
        bus_id: bus?.bus_id,
        bus_number: bus?.bus_number,
        bus_type: bus?.bus_type,
        from_location: bus?.from_location,
        to_location: bus?.to_location,
        fare: bus?.fare
      }
    };
  });

  res.status(200).json({
    success: true,
    count: enrichedSchedules.length,
    data: enrichedSchedules
  });
});



// @desc    Update schedule
// @route   PUT /api/traveler/schedules/:scheduleId
// @access  Private (Traveler only)


export const updateSchedule = asyncHandler(async (req, res, next) => {
  const { scheduleId } = req.params;
  const traveler = await Traveler.findOne({ user_id: req.user.user_id });

  if (!traveler) {
    return next(new ErrorResponse('Traveler profile not found', 404));
  }

  const schedule = await BusSchedule.findOne({ schedule_id: scheduleId });

  if (!schedule) {
    return next(new ErrorResponse('Schedule not found', 404));
  }

  // Check ownership
  const bus = await Bus.findOne({ bus_id: schedule.bus_id });
  if (!bus || bus.traveler_id !== traveler.traveler_id) {
    return next(new ErrorResponse('Not authorized to update this schedule', 403));
  }

  // Can only update future schedules
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(schedule.journey_date) < today) {
    return next(new ErrorResponse('Cannot update past schedules', 400));
  }

  // Fields that can be updated
  const allowedUpdates = ['departure_time', 'arrival_time'];
  const updates = {};

  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const updatedSchedule = await BusSchedule.findOneAndUpdate(
    { schedule_id: scheduleId },
    updates,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Schedule updated successfully',
    data: updatedSchedule
  });
});



// @desc    Cancel schedule
// @route   PUT /api/traveler/schedules/:scheduleId/cancel
// @access  Private (Traveler only)


export const cancelSchedule = asyncHandler(async (req, res, next) => {
  const { scheduleId } = req.params;
  const traveler = await Traveler.findOne({ user_id: req.user.user_id });

  if (!traveler) {
    return next(new ErrorResponse('Traveler profile not found', 404));
  }

  const schedule = await BusSchedule.findOne({ schedule_id: scheduleId });

  if (!schedule) {
    return next(new ErrorResponse('Schedule not found', 404));
  }

  // Check ownership
  const bus = await Bus.findOne({ bus_id: schedule.bus_id });
  if (!bus || bus.traveler_id !== traveler.traveler_id) {
    return next(new ErrorResponse('Not authorized to cancel this schedule', 403));
  }

  if (schedule.schedule_status === 'CANCELLED') {
    return next(new ErrorResponse('Schedule is already cancelled', 400));
  }

  // Check if there are bookings
  if (schedule.booked_seats > 0) {
    return next(new ErrorResponse('Cannot cancel schedule with active bookings. Please contact admin.', 400));
  }

  schedule.schedule_status = 'CANCELLED';
  await schedule.save();

  res.status(200).json({
    success: true,
    message: 'Schedule cancelled successfully',
    data: schedule
  });
});


// ================================================================
// BOOKING MANAGEMENT (View Only)
// ================================================================



// @desc    Get all bookings for traveler's buses
// @route   GET /api/traveler/bookings
// @access  Private (Traveler only)


export const getMyBookings = asyncHandler(async (req, res, next) => {
  const traveler = await Traveler.findOne({ user_id: req.user.user_id });

  if (!traveler) {
    return next(new ErrorResponse('Traveler profile not found', 404));
  }

  const { status, date_from, date_to } = req.query;

  // Build query
  const query = { traveler_id: traveler.traveler_id };

  if (status) {
    query.booking_status = status.toUpperCase();
  }

  if (date_from || date_to) {
    query.booking_date = {};
    if (date_from) {
      query.booking_date.$gte = new Date(date_from);
    }
    if (date_to) {
      query.booking_date.$lte = new Date(date_to);
    }
  }

  const bookings = await Booking.find(query).sort({ booking_date: -1 });

  // Enrich with details
  const enrichedBookings = await Promise.all(
    bookings.map(async (booking) => {
      const schedule = await BusSchedule.findOne({ schedule_id: booking.schedule_id });
      const bus = schedule ? await Bus.findOne({ bus_id: schedule.bus_id }) : null;

      return {
        booking_id: booking.booking_id,
        booking_reference: booking.booking_reference,
        booking_date: booking.booking_date,
        booking_status: booking.booking_status,
        payment_status: booking.payment_status,
        number_of_seats: booking.number_of_seats,
        seat_numbers: booking.seat_numbers,
        total_amount: booking.total_amount,
        journey: schedule ? {
          journey_date: schedule.journey_date,
          departure_time: schedule.departure_time,
          from: bus?.from_location,
          to: bus?.to_location,
          bus_number: bus?.bus_number
        } : null
      };
    })
  );

  // Calculate statistics
  const stats = {
    total_bookings: bookings.length,
    confirmed: bookings.filter(b => b.booking_status === 'CONFIRMED').length,
    cancelled: bookings.filter(b => b.booking_status === 'CANCELLED').length,
    total_revenue: bookings
      .filter(b => b.booking_status === 'CONFIRMED')
      .reduce((sum, b) => sum + b.total_amount, 0)
  };

  res.status(200).json({
    success: true,
    count: enrichedBookings.length,
    stats,
    data: enrichedBookings
  });
});



// ================================================================
// SUPPORT TICKET MANAGEMENT
// ================================================================


// @desc    Create support ticket
// @route   POST /api/traveler/tickets
// @access  Private (Traveler only)


export const createSupportTicket = asyncHandler(async (req, res, next) => {
  const { subject, description, ticket_type, priority } = req.body;

  const traveler = await Traveler.findOne({ user_id: req.user.user_id });

  if (!traveler) {
    return next(new ErrorResponse('Traveler profile not found', 404));
  }

  // Validate input
  if (!subject || !description || !ticket_type) {
    return next(new ErrorResponse('Please provide subject, description, and ticket type', 400));
  }

  const ticket = await SupportTicket.create({
    traveler_id: traveler.traveler_id,
    subject,
    description,
    ticket_type: ticket_type.toUpperCase(),
    priority: priority?.toUpperCase() || 'MEDIUM',
    ticket_status: 'OPEN'
  });

  res.status(201).json({
    success: true,
    message: 'Support ticket created successfully',
    data: ticket
  });
});



// @desc    Get all support tickets for traveler
// @route   GET /api/traveler/tickets
// @access  Private (Traveler only)


export const getMySupportTickets = asyncHandler(async (req, res, next) => {
  const traveler = await Traveler.findOne({ user_id: req.user.user_id });

  if (!traveler) {
    return next(new ErrorResponse('Traveler profile not found', 404));
  }

  const { status } = req.query;

  const query = { traveler_id: traveler.traveler_id };
  if (status) {
    query.ticket_status = status.toUpperCase();
  }

  const tickets = await SupportTicket.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tickets.length,
    data: tickets
  });
});



// @desc    Get single support ticket
// @route   GET /api/traveler/tickets/:ticketId
// @access  Private (Traveler only)


export const getSupportTicketDetails = asyncHandler(async (req, res, next) => {
  const { ticketId } = req.params;
  const traveler = await Traveler.findOne({ user_id: req.user.user_id });

  if (!traveler) {
    return next(new ErrorResponse('Traveler profile not found', 404));
  }

  const ticket = await SupportTicket.findOne({ ticket_id: ticketId });

  if (!ticket) {
    return next(new ErrorResponse('Ticket not found', 404));
  }

  // Check ownership
  if (ticket.traveler_id !== traveler.traveler_id) {
    return next(new ErrorResponse('Not authorized to view this ticket', 403));
  }

  res.status(200).json({
    success: true,
    data: ticket
  });
});