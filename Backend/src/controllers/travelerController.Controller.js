import Bus from "../models/bus.models.js"
import BusSchedule from "../models/busSchedule.models.js"
import Seat from "../models/seat.models.js"
import Booking from "../models/booking.models.js"
import Traveler from "../models/travelers.models.js"
import SupportTicket from "../models/supportTickets.models.js"
import asyncHandler from "../utils/asyncHandler.utils.js";
import ErrorResponse from "../utils/errorResponse.utils.js";
import mongoose from "mongoose";
import busScheduleModels from "../models/busSchedule.models.js"


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

    const buses = await Bus.findOne({ traveler_id: traveler.traveler_id }).sort({ createdAt: -1 });

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


