import Bus from "../models/bus.models.js"
import BusSchedule from "../models/busSchedule.models.js"
import Seat from "../models/seat.models.js"
import Booking from "../models/booking.models.js"
import BookingSeat from "../models/bookingSeat.models.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import ErrorResponse from "../utils/errorResponse.utils.js"
import mongoose from "mongoose";



// @desc    Search buses by route and date
// @route   GET /api/bookings/search-buses
// @access  Public
export const searchBuses = asyncHandler(async (req, res, next) => {
  const { from, to, date } = req.query;

  // Validate input
  if (!from || !to || !date) {
    return next(new ErrorResponse('Please provide from, to, and date', 400));
  }

  // Validate date format and not in past
  const journeyDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(journeyDate.getTime())) {
    return next(new ErrorResponse('Invalid date format. Use YYYY-MM-DD', 400));
  }

  if (journeyDate < today) {
    return next(new ErrorResponse('Journey date cannot be in the past', 400));
  }

  // Search buses
  const schedules = await BusSchedule.aggregate([
    {
      // Match schedules for the date with available seats
      $match: {
        journey_date: {
          $gte: new Date(date + 'T00:00:00.000Z'),
          $lt: new Date(date + 'T23:59:59.999Z')
        },
        schedule_status: 'ACTIVE',
        available_seats: { $gt: 0 }
      }
    },
    {
      // Lookup bus information
      $lookup: {
        from: 'buses',
        localField: 'bus_id',
        foreignField: 'bus_id',
        as: 'bus_info'
      }
    },
    {
      $unwind: '$bus_info'
    },
    {
      // Match route (case-insensitive)
      $match: {
        'bus_info.from_location': new RegExp(from, 'i'),
        'bus_info.to_location': new RegExp(to, 'i'),
        'bus_info.is_active': true
      }
    },
    {
      // Lookup traveler information
      $lookup: {
        from: 'travelers',
        localField: 'bus_info.traveler_id',
        foreignField: 'traveler_id',
        as: 'traveler_info'
      }
    },
    {
      $unwind: '$traveler_info'
    },
    {
      // Format output
      $project: {
        schedule_id: 1,
        journey_date: 1,
        departure_time: 1,
        arrival_time: 1,
        available_seats: 1,
        total_seats: 1,
        bus_number: '$bus_info.bus_number',
        bus_type: '$bus_info.bus_type',
        bus_model: '$bus_info.bus_model',
        fare: '$bus_info.fare',
        amenities: '$bus_info.amenities',
        from_location: '$bus_info.from_location',
        to_location: '$bus_info.to_location',
        company_name: '$traveler_info.company_name',
        traveler_id: '$bus_info.traveler_id'
      }
    },
    {
      // Sort by departure time
      $sort: { departure_time: 1 }
    }
  ]);

  if (schedules.length === 0) {
    return res.status(200).json({
      success: true,
      count: 0,
      message: 'No buses found for this route and date',
      data: []
    });
  }

  res.status(200).json({
    success: true,
    count: schedules.length,
    data: schedules
  });
});



// @desc    Get available seats for a schedule
// @route   GET /api/bookings/seats/:scheduleId
// @access  Public
export const getAvailableSeats = asyncHandler(async (req, res, next) => {
  const { scheduleId } = req.params;

  // Check if schedule exists
  const schedule = await BusSchedule.findOne({ schedule_id: scheduleId });

  if (!schedule) {
    return next(new ErrorResponse('Schedule not found', 404));
  }

  if (schedule.schedule_status !== 'ACTIVE') {
    return next(new ErrorResponse('This schedule is not active', 400));
  }

  // Get all seats for this schedule
  const seats = await Seat.find({ schedule_id: scheduleId }).sort({ seat_number: 1 });

  if (seats.length === 0) {
    return next(new ErrorResponse('No seats found for this schedule', 404));
  }

  // Separate available and booked seats
  const availableSeats = seats.filter(seat => !seat.is_booked);
  const bookedSeats = seats.filter(seat => seat.is_booked);

  res.status(200).json({
    success: true,
    data: {
      schedule_id: scheduleId,
      total_seats: schedule.total_seats,
      available_seats: schedule.available_seats,
      booked_seats: schedule.booked_seats,
      seats: seats.map(seat => ({
        seat_id: seat.seat_id,
        seat_number: seat.seat_number,
        seat_type: seat.seat_type,
        seat_position: seat.seat_position,
        is_booked: seat.is_booked
      })),
      available_seat_list: availableSeats.map(s => s.seat_number),
      booked_seat_list: bookedSeats.map(s => s.seat_number)
    }
  });
});

// @desc    Create booking (Book seats)
// @route   POST /api/bookings
// @access  Private (Customer)
export const createBooking = asyncHandler(async (req, res, next) => {
  const { schedule_id, seat_ids, passengers } = req.body;
  const user_id = req.user.user_id;

  // Validate input
  if (!schedule_id || !seat_ids || !passengers) {
    return next(new ErrorResponse('Please provide schedule_id, seat_ids, and passengers', 400));
  }

  if (!Array.isArray(seat_ids) || seat_ids.length === 0) {
    return next(new ErrorResponse('Please select at least one seat', 400));
  }

  if (!Array.isArray(passengers) || passengers.length !== seat_ids.length) {
    return next(new ErrorResponse('Number of passengers must match number of seats', 400));
  }

//   if (seat_ids.length > 6) {
//     return next(new ErrorResponse('Cannot book more than 6 seats at once', 400));
//   }

  // Validate passenger details
  for (const passenger of passengers) {
    if (!passenger.name || !passenger.age || !passenger.gender) {
      return next(new ErrorResponse('All passenger details (name, age, gender) are required', 400));
    }
  }

  // Start MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check if schedule exists and is active
    const schedule = await BusSchedule.findOne({ schedule_id }).session(session);

    if (!schedule) {
      await session.abortTransaction();
      return next(new ErrorResponse('Schedule not found', 404));
    }

    if (schedule.schedule_status !== 'ACTIVE') {
      await session.abortTransaction();
      return next(new ErrorResponse('This schedule is not active', 400));
    }

    // Check if journey date is in future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const journeyDate = new Date(schedule.journey_date);
    journeyDate.setHours(0, 0, 0, 0);

    if (journeyDate < today) {
      await session.abortTransaction();
      return next(new ErrorResponse('Cannot book seats for past dates', 400));
    }

    // 2. Get bus information
    const bus = await Bus.findOne({ bus_id: schedule.bus_id }).session(session);

    if (!bus) {
      await session.abortTransaction();
      return next(new ErrorResponse('Bus not found', 404));
    }

    // 3. Check if all seats exist and are available
    const seats = await Seat.find({
      seat_id: { $in: seat_ids },
      schedule_id: schedule_id
    }).session(session);

    if (seats.length !== seat_ids.length) {
      await session.abortTransaction();
      return next(new ErrorResponse('One or more seats not found', 404));
    }

    // Check if any seat is already booked
    const bookedSeat = seats.find(seat => seat.is_booked);
    if (bookedSeat) {
      await session.abortTransaction();
      return next(new ErrorResponse(`Seat ${bookedSeat.seat_number} is already booked`, 400));
    }

    // 4. Check if enough seats are available
    if (schedule.available_seats < seat_ids.length) {
      await session.abortTransaction();
      return next(new ErrorResponse('Not enough seats available', 400));
    }

    // 5. Calculate total amount
    const total_amount = bus.fare * seat_ids.length;

    // 6. Create booking
    const booking = await Booking.create([{
      user_id,
      schedule_id,
      traveler_id: bus.traveler_id,
      number_of_seats: seat_ids.length,
      seat_numbers: seats.map(s => s.seat_number),
      total_amount,
      booking_status: 'CONFIRMED',
      payment_status: 'PAID', // In real app, integrate payment gateway
      payment_method: 'UPI'
    }], { session });

    const bookingId = booking[0].booking_id;

    // 7. Create booking seats (link passengers to seats)
    const bookingSeatData = seat_ids.map((seat_id, index) => ({
      booking_id: bookingId,
      seat_id: seat_id,
      passenger_name: passengers[index].name,
      passenger_age: passengers[index].age,
      passenger_gender: passengers[index].gender,
      passenger_id_type: passengers[index].id_type || 'Aadhar',
      passenger_id_number: passengers[index].id_number || 'N/A'
    }));

    await BookingSeat.insertMany(bookingSeatData, { session });

    // 8. Mark seats as booked
    await Seat.updateMany(
      { seat_id: { $in: seat_ids } },
      { 
        $set: { 
          is_booked: true,
          booking_id: bookingId
        } 
      },
      { session }
    );

    // 9. Update schedule availability
    await BusSchedule.updateOne(
      { schedule_id },
      {
        $inc: {
          available_seats: -seat_ids.length,
          booked_seats: seat_ids.length
        }
      },
      { session }
    );

    // Commit transaction
    await session.commitTransaction();

    // Get complete booking details
    const completeBooking = await Booking.findOne({ booking_id: bookingId });
    const bookingSeats = await BookingSeat.find({ booking_id: bookingId });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: completeBooking,
        passengers: bookingSeats,
        bus_details: {
          bus_number: bus.bus_number,
          bus_type: bus.bus_type,
          from: bus.from_location,
          to: bus.to_location,
          journey_date: schedule.journey_date,
          departure_time: schedule.departure_time,
          arrival_time: schedule.arrival_time
        }
      }
    });

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Customer)
export const getMyBookings = asyncHandler(async (req, res, next) => {
  const user_id = req.user.user_id;
  const { status } = req.query; // Filter by status (optional)

  // Build query
  const query = { user_id };
  if (status) {
    query.booking_status = status.toUpperCase();
  }

  // Get bookings
  const bookings = await Booking.find(query).sort({ booking_date: -1 });

  if (bookings.length === 0) {
    return res.status(200).json({
      success: true,
      count: 0,
      message: 'No bookings found',
      data: []
    });
  }

  // Enrich bookings with schedule and bus details
  const enrichedBookings = await Promise.all(
    bookings.map(async (booking) => {
      const schedule = await BusSchedule.findOne({ schedule_id: booking.schedule_id });
      const bus = schedule ? await Bus.findOne({ bus_id: schedule.bus_id }) : null;
      const passengers = await BookingSeat.find({ booking_id: booking.booking_id });

      return {
        booking_id: booking.booking_id,
        booking_reference: booking.booking_reference,
        booking_date: booking.booking_date,
        booking_status: booking.booking_status,
        payment_status: booking.payment_status,
        number_of_seats: booking.number_of_seats,
        seat_numbers: booking.seat_numbers,
        total_amount: booking.total_amount,
        journey_details: schedule ? {
          journey_date: schedule.journey_date,
          departure_time: schedule.departure_time,
          arrival_time: schedule.arrival_time,
          from: bus?.from_location,
          to: bus?.to_location,
          bus_number: bus?.bus_number,
          bus_type: bus?.bus_type
        } : null,
        passengers: passengers.map(p => ({
          name: p.passenger_name,
          age: p.passenger_age,
          gender: p.passenger_gender,
          seat_number: booking.seat_numbers[passengers.indexOf(p)]
        }))
      };
    })
  );

  res.status(200).json({
    success: true,
    count: enrichedBookings.length,
    data: enrichedBookings
  });
});

// @desc    Get single booking details
// @route   GET /api/bookings/:bookingId
// @access  Private (Customer - own bookings only)
export const getBookingDetails = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.params;
  const user_id = req.user.user_id;

  // Get booking
  const booking = await Booking.findOne({ booking_id: bookingId });

  if (!booking) {
    return next(new ErrorResponse('Booking not found', 404));
  }

  // Check ownership
  if (booking.user_id !== user_id && req.user.role !== 'ADMIN') {
    return next(new ErrorResponse('Not authorized to view this booking', 403));
  }

  // Get related data
  const schedule = await BusSchedule.findOne({ schedule_id: booking.schedule_id });
  const bus = schedule ? await Bus.findOne({ bus_id: schedule.bus_id }) : null;
  const passengers = await BookingSeat.find({ booking_id: booking.booking_id });

  res.status(200).json({
    success: true,
    data: {
      booking: {
        booking_id: booking.booking_id,
        booking_reference: booking.booking_reference,
        booking_date: booking.booking_date,
        booking_status: booking.booking_status,
        payment_status: booking.payment_status,
        payment_method: booking.payment_method,
        number_of_seats: booking.number_of_seats,
        seat_numbers: booking.seat_numbers,
        total_amount: booking.total_amount,
        cancellation_date: booking.cancellation_date,
        refund_amount: booking.refund_amount
      },
      journey: schedule ? {
        journey_date: schedule.journey_date,
        departure_time: schedule.departure_time,
        arrival_time: schedule.arrival_time
      } : null,
      bus: bus ? {
        bus_number: bus.bus_number,
        bus_type: bus.bus_type,
        bus_model: bus.bus_model,
        from_location: bus.from_location,
        to_location: bus.to_location,
        amenities: bus.amenities
      } : null,
      passengers: passengers.map(p => ({
        passenger_name: p.passenger_name,
        passenger_age: p.passenger_age,
        passenger_gender: p.passenger_gender,
        passenger_id_type: p.passenger_id_type,
        seat_number: booking.seat_numbers[passengers.indexOf(p)]
      }))
    }
  });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:bookingId/cancel
// @access  Private (Customer)
export const cancelBooking = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.params;
  const user_id = req.user.user_id;

  // Start transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get booking
    const booking = await Booking.findOne({ booking_id: bookingId }).session(session);

    if (!booking) {
      await session.abortTransaction();
      return next(new ErrorResponse('Booking not found', 404));
    }

    // Check ownership
    if (booking.user_id !== user_id) {
      await session.abortTransaction();
      return next(new ErrorResponse('Not authorized to cancel this booking', 403));
    }

    // Check if already cancelled
    if (booking.booking_status === 'CANCELLED') {
      await session.abortTransaction();
      return next(new ErrorResponse('Booking is already cancelled', 400));
    }

    // Check if journey date has passed
    const schedule = await BusSchedule.findOne({ schedule_id: booking.schedule_id }).session(session);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const journeyDate = new Date(schedule.journey_date);
    journeyDate.setHours(0, 0, 0, 0);

    if (journeyDate < today) {
      await session.abortTransaction();
      return next(new ErrorResponse('Cannot cancel booking for past journeys', 400));
    }

    // Calculate refund (100% refund for simplicity - can add refund policy)
    const refund_amount = booking.total_amount;

    // 1. Update booking status
    booking.booking_status = 'CANCELLED';
    booking.payment_status = 'REFUNDED';
    booking.cancellation_date = new Date();
    booking.refund_amount = refund_amount;
    await booking.save({ session });

    // 2. Free up seats
    const seats = await Seat.find({
      schedule_id: booking.schedule_id,
      booking_id: bookingId
    }).session(session);

    await Seat.updateMany(
      { booking_id: bookingId },
      {
        $set: {
          is_booked: false,
          booking_id: null
        }
      },
      { session }
    );

    // 3. Update schedule availability
    await BusSchedule.updateOne(
      { schedule_id: booking.schedule_id },
      {
        $inc: {
          available_seats: booking.number_of_seats,
          booked_seats: -booking.number_of_seats
        }
      },
      { session }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        booking_id: booking.booking_id,
        booking_status: booking.booking_status,
        refund_amount: refund_amount,
        cancellation_date: booking.cancellation_date,
        note: 'Refund will be processed within 5-7 business days'
      }
    });

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});