import express from "express"
import {
  searchBuses,
  getAvailableSeats,
  createBooking,
  getMyBookings,
  getBookingDetails,
  cancelBooking
} from ('../controllers/booking.Controller.js');

import { protect, authorize } from ('../middlewares/auth.middlewares.js');

const router = express.Router();

// Public routes (anyone can search)
router.get('/search-buses', searchBuses);
router.get('/seats/:scheduleId', getAvailableSeats);

// Protected routes (must be logged in as CUSTOMER)
router.post('/', protect, authorize('CUSTOMER'), createBooking);
router.get('/my-bookings', protect, authorize('CUSTOMER'), getMyBookings);
router.get('/:bookingId', protect, authorize('CUSTOMER', 'ADMIN'), getBookingDetails);
router.put('/:bookingId/cancel', protect, authorize('CUSTOMER'), cancelBooking);

export default router;