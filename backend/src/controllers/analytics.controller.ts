import { Response } from 'express';
import pool from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getDailyAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { date = new Date().toISOString().split('T')[0] } = req.query;

  const analytics = await pool.query(
    `SELECT 
      COUNT(DISTINCT b.booking_id) as total_bookings,
      SUM(b.payment_amount) as total_revenue,
      COUNT(DISTINCT b.user_id) as unique_visitors
    FROM bookings b
    WHERE b.slot_date = $1 AND b.status != 'cancelled'`,
    [date]
  );

  res.json({
    success: true,
    data: { analytics: analytics.rows[0] },
  });
});

export const getCrowdPredictions = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Placeholder for ML predictions
  res.json({
    success: true,
    data: {
      predictions: [
        { time: '09:00', predicted_crowd: 450 },
        { time: '12:00', predicted_crowd: 680 },
        { time: '15:00', predicted_crowd: 520 },
      ],
    },
  });
});

export const getRevenueReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { startDate, endDate } = req.query;

  const revenue = await pool.query(
    `SELECT 
      slot_date,
      SUM(payment_amount) as daily_revenue,
      COUNT(*) as bookings_count
    FROM bookings
    WHERE slot_date BETWEEN $1 AND $2 AND payment_status = 'completed'
    GROUP BY slot_date
    ORDER BY slot_date`,
    [startDate, endDate]
  );

  res.json({
    success: true,
    data: { revenue: revenue.rows },
  });
});

export const getVisitorTrends = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { period = 'week' } = req.query;

  const trends = await pool.query(
    `SELECT 
      slot_date,
      COUNT(*) as visitor_count
    FROM bookings
    WHERE slot_date >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY slot_date
    ORDER BY slot_date`
  );

  res.json({
    success: true,
    data: { trends: trends.rows },
  });
});
