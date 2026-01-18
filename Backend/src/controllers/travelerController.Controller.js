import Bus from "../models/bus.models.js"
import BusSchedule from "../models/busSchedule.models.js"
import Seat from "../models/seat.models.js"
import Booking from "../models/booking.models.js"
import Traveler from "../models/travelers.models.js"
import SupportTicket from "../models/supportTickets.models.js"
import asyncHandler from "../utils/asyncHandler.utils.js";
import ErrorResponse from "../utils/errorResponse.utils.js";
import mongoose from "mongoose";


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

// export const getBusDetails