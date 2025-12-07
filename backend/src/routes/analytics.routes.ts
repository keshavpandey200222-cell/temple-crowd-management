import { Router } from 'express';
import { query } from 'express-validator';
import {
  getDailyAnalytics,
  getCrowdPredictions,
  getRevenueReport,
  getVisitorTrends,
} from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All analytics routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Daily analytics
router.get(
  '/daily',
  [
    query('date').optional().isISO8601(),
  ],
  getDailyAnalytics
);

// Crowd predictions
router.get('/predictions', getCrowdPredictions);

// Revenue report
router.get(
  '/revenue',
  [
    query('startDate').isISO8601().withMessage('Valid start date is required'),
    query('endDate').isISO8601().withMessage('Valid end date is required'),
  ],
  getRevenueReport
);

// Visitor trends
router.get(
  '/trends',
  [
    query('period').isIn(['week', 'month', 'year']).withMessage('Valid period is required'),
  ],
  getVisitorTrends
);

export default router;
