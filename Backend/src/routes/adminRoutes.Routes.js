import express from "express"
import {
  getAllTravelers,
  getTravelerDetails,
  onboardTraveler,
  updateTravelerStatus,
  getAllTickets,
  getTicketDetails,
  assignTicket,
  resolveTicket,
  getDashboardStats,
  getRevenueReport,
  getTopTravelers,
  getBookingStats,
  getAllUsers,
  toggleUserStatus,
  getAllBuses,
  deactivateBus
} from "../controllers/adminController.Controller.js"

const router = express.Router();

import { protect, authorize } from "../middlewares/auth.middlewares.js"

// Apply authentication and admin authorization to all routes
router.use(protect);
router.use(authorize('ADMIN'));

// ================================================================
// TRAVELER MANAGEMENT ROUTES
// ================================================================
router.get('/travelers', getAllTravelers);
router.get('/travelers/:id', getTravelerDetails);
router.post('/travelers/onboard', onboardTraveler);
router.put('/travelers/:id/status', updateTravelerStatus);

// ================================================================
// SUPPORT TICKET ROUTES
// ================================================================
router.get('/tickets', getAllTickets);
router.get('/tickets/:id', getTicketDetails);
router.put('/tickets/:id/assign', assignTicket);
router.put('/tickets/:id/resolve', resolveTicket);

// ================================================================
// DASHBOARD & REPORTS ROUTES
// ================================================================
router.get('/dashboard/stats', getDashboardStats);
router.get('/reports/revenue', getRevenueReport);
router.get('/reports/top-travelers', getTopTravelers);
router.get('/reports/bookings', getBookingStats);

// ================================================================
// USER MANAGEMENT ROUTES
// ================================================================
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);

// ================================================================
// BUS MANAGEMENT ROUTES (OVERRIDE)
// ================================================================
router.get('/buses', getAllBuses);
router.put('/buses/:id/deactivate', deactivateBus);

export default router;
