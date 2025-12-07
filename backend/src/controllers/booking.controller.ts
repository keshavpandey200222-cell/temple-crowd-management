import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import QRCode from 'qrcode';
import pool from '../config/database';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Get available slots
export const getAvailableSlots = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { date, type = 'regular' } = req.query;

  const slots = await pool.query(
    `SELECT 
      sc.slot_id,
      sc.slot_time,
      sc.slot_type,
      sc.max_bookings,
      sc.price,
      COALESCE(COUNT(b.booking_id), 0) as booked_count,
      (sc.max_bookings - COALESCE(COUNT(b.booking_id), 0)) as available_slots
    FROM slot_configuration sc
    LEFT JOIN bookings b ON 
      b.slot_time = sc.slot_time AND 
      b.booking_type = sc.slot_type AND 
      b.slot_date = $1 AND
      b.status = 'confirmed'
    WHERE sc.slot_type = $2 AND sc.is_active = true
    GROUP BY sc.slot_id, sc.slot_time, sc.slot_type, sc.max_bookings, sc.price
    HAVING (sc.max_bookings - COALESCE(COUNT(b.booking_id), 0)) > 0
    ORDER BY sc.slot_time`,
    [date, type]
  );

  res.json({
    success: true,
    data: {
      date,
      type,
      slots: slots.rows,
    },
  });
});

// Create new booking
export const createBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed');
  }

  const { slotDate, slotTime, bookingType, numberOfPeople } = req.body;
  const userId = req.user?.userId;

  // Check slot availability
  const slotCheck = await pool.query(
    `SELECT 
      sc.max_bookings,
      COALESCE(COUNT(b.booking_id), 0) as booked_count
    FROM slot_configuration sc
    LEFT JOIN bookings b ON 
      b.slot_time = sc.slot_time AND 
      b.booking_type = sc.slot_type AND 
      b.slot_date = $1 AND
      b.status = 'confirmed'
    WHERE sc.slot_time = $2 AND sc.slot_type = $3 AND sc.is_active = true
    GROUP BY sc.max_bookings`,
    [slotDate, slotTime, bookingType]
  );

  if (slotCheck.rows.length === 0) {
    throw new ApiError(404, 'Slot not found or inactive');
  }

  const { max_bookings, booked_count } = slotCheck.rows[0];
  if (booked_count >= max_bookings) {
    throw new ApiError(409, 'Slot is fully booked');
  }

  // Get price
  const priceResult = await pool.query(
    'SELECT price FROM slot_configuration WHERE slot_time = $1 AND slot_type = $2',
    [slotTime, bookingType]
  );
  const price = priceResult.rows[0]?.price || 0;

  // Generate QR code
  const qrData = `TEMPLE-${Date.now()}-${userId}`;
  const qrCode = await QRCode.toDataURL(qrData);

  // Create booking
  const result = await pool.query(
    `INSERT INTO bookings 
      (user_id, slot_date, slot_time, booking_type, number_of_people, qr_code, payment_amount, status, payment_status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [userId, slotDate, slotTime, bookingType, numberOfPeople, qrData, price, 'confirmed', price > 0 ? 'pending' : 'completed']
  );

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: {
      booking: result.rows[0],
      qrCodeImage: qrCode,
    },
  });
});

// Get user's bookings
export const getUserBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  const bookings = await pool.query(
    `SELECT * FROM bookings 
     WHERE user_id = $1 
     ORDER BY slot_date DESC, slot_time DESC`,
    [userId]
  );

  res.json({
    success: true,
    data: {
      bookings: bookings.rows,
    },
  });
});

// Get specific booking
export const getBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { bookingId } = req.params;
  const userId = req.user?.userId;

  const result = await pool.query(
    'SELECT * FROM bookings WHERE booking_id = $1 AND user_id = $2',
    [bookingId, userId]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Booking not found');
  }

  // Generate QR code image
  const qrCode = await QRCode.toDataURL(result.rows[0].qr_code);

  res.json({
    success: true,
    data: {
      booking: result.rows[0],
      qrCodeImage: qrCode,
    },
  });
});

// Cancel booking
export const cancelBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { bookingId } = req.params;
  const userId = req.user?.userId;

  const result = await pool.query(
    `UPDATE bookings 
     SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
     WHERE booking_id = $1 AND user_id = $2 AND status = 'confirmed'
     RETURNING *`,
    [bookingId, userId]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Booking not found or already cancelled');
  }

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: {
      booking: result.rows[0],
    },
  });
});

// Verify booking with QR code
export const verifyBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { qrCode } = req.body;

  const result = await pool.query(
    `SELECT b.*, u.name, u.email, u.phone 
     FROM bookings b
     JOIN users u ON b.user_id = u.user_id
     WHERE b.qr_code = $1`,
    [qrCode]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Invalid QR code');
  }

  const booking = result.rows[0];

  if (booking.status === 'cancelled') {
    throw new ApiError(400, 'Booking has been cancelled');
  }

  if (booking.status === 'completed') {
    throw new ApiError(400, 'Booking already used');
  }

  // Mark as completed
  await pool.query(
    'UPDATE bookings SET status = $1 WHERE booking_id = $2',
    ['completed', booking.booking_id]
  );

  res.json({
    success: true,
    message: 'Booking verified successfully',
    data: {
      booking,
    },
  });
});
