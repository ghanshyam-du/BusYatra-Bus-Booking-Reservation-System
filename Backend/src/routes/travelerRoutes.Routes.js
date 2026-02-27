import express from "express";
import {
  // Bus Management
  addBus,
  getMyBuses,
  getBusDetails,
  updateBus,
  deleteBus,

  // Schedule Management
  createSchedule,
  getMySchedules,
  updateSchedule,
  cancelSchedule,

  // Booking Management
  getMyBookings,

  // Support Tickets
  createSupportTicket,
  getMySupportTickets,
  getSupportTicketDetails,

  // Dashboard Diagnostics
  getDashboardStats
} from "../controllers/travelerController.Controller.js";


import { authorize, protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// All routes require TRAVELER role
router.use(protect, authorize('TRAVELER'));

// Dashboard Stats
router.get('/dashboard-stats', getDashboardStats);

// Bus Management Routes
router.route('/buses')
  .post(addBus)           // Create bus
  .get(getMyBuses);       // Get all buses

router.route('/buses/:busId')
  .get(getBusDetails)     // Get single bus
  .put(updateBus)         // Update bus
  .delete(deleteBus);     // Delete bus

// Schedule Management Routes
router.route('/schedules')
  .post(createSchedule)   // Create schedule (auto-generates seats)
  .get(getMySchedules);   // Get all schedules

router.route('/schedules/:scheduleId')
  .put(updateSchedule);   // Update schedule

router.put('/schedules/:scheduleId/cancel', cancelSchedule);

// Booking Management Routes (View Only)
router.get('/bookings', getMyBookings);

// Support Ticket Routes
router.route('/tickets')
  .post(createSupportTicket)
  .get(getMySupportTickets);

router.get('/tickets/:ticketId', getSupportTicketDetails);

export default router;