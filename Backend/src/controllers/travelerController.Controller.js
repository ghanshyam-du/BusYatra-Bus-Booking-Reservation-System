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

export const addBus = 