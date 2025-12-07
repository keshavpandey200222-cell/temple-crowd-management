import { Router } from 'express';
import { param } from 'express-validator';
import {
  getAllZones,
  getZoneDetails,
  createZone,
  updateZone,
  deleteZone,
} from '../controllers/zone.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllZones);
router.get(
  '/:zoneId',
  [param('zoneId').isUUID().withMessage('Valid zone ID is required')],
  getZoneDetails
);

// Admin only routes
router.post('/', authenticate, authorize('admin'), createZone);
router.put(
  '/:zoneId',
  authenticate,
  authorize('admin'),
  [param('zoneId').isUUID().withMessage('Valid zone ID is required')],
  updateZone
);
router.delete(
  '/:zoneId',
  authenticate,
  authorize('admin'),
  [param('zoneId').isUUID().withMessage('Valid zone ID is required')],
  deleteZone
);

export default router;
