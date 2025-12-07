import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createBooking,
  getBooking,
  getUserBookings,
  cancelBooking,
  getAvailableSlots,
  verifyBooking,
} from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All booking routes require authentication
router.use(authenticate);

// Get available slots
router.get(
  '/slots/available',
  [
    query('date').isISO8601().withMessage('Valid date is required'),
    query('type').optional().isIn(['regular', 'vip', 'senior', 'special']),
  ],
  getAvailableSlots
);

// Create new booking
router.post(
  '/',
  [
    body('slotDate').isISO8601().withMessage('Valid date is required'),
    body('slotTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time is required'),
    body('bookingType').isIn(['regular', 'vip', 'senior', 'special']),
    body('numberOfPeople').isInt({ min: 1, max: 10 }).withMessage('Number of people must be between 1 and 10'),
  ],
  createBooking
);

// Get user's bookings
router.get('/my-bookings', getUserBookings);

// Get specific booking
router.get(
  '/:bookingId',
  [param('bookingId').isUUID().withMessage('Valid booking ID is required')],
  getBooking
);

// Cancel booking
router.put(
  '/:bookingId/cancel',
  [param('bookingId').isUUID().withMessage('Valid booking ID is required')],
  cancelBooking
);

// Verify booking with QR code
router.post(
  '/verify',
  [body('qrCode').notEmpty().withMessage('QR code is required')],
  verifyBooking
);

export default router;
