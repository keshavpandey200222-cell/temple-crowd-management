import { Router } from 'express';
import { param, query } from 'express-validator';
import {
  getCurrentCrowdStatus,
  getZoneCrowdStatus,
  getCrowdHistory,
  updateCrowdCount,
  getCrowdAlerts,
} from '../controllers/crowd.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes - anyone can view crowd status
router.get('/current', getCurrentCrowdStatus);
router.get(
  '/zone/:zoneId',
  [param('zoneId').isUUID().withMessage('Valid zone ID is required')],
  getZoneCrowdStatus
);

// Protected routes - require authentication
router.get(
  '/history',
  authenticate,
  [
    query('zoneId').optional().isUUID(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  getCrowdHistory
);

router.get('/alerts', authenticate, authorize('admin', 'staff'), getCrowdAlerts);

// Admin/Staff only - update crowd count
router.post(
  '/update',
  authenticate,
  authorize('admin', 'staff'),
  updateCrowdCount
);

export default router;
