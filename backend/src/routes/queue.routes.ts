import { Router } from 'express';
import { param } from 'express-validator';
import {
  getAllQueues,
  getQueueStatus,
  joinQueue,
  leaveQueue,
  updateQueueStatus,
} from '../controllers/queue.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllQueues);
router.get(
  '/:queueId/status',
  [param('queueId').isUUID().withMessage('Valid queue ID is required')],
  getQueueStatus
);

// Protected routes - require authentication
router.post(
  '/:queueId/join',
  authenticate,
  [param('queueId').isUUID().withMessage('Valid queue ID is required')],
  joinQueue
);

router.post(
  '/:queueId/leave',
  authenticate,
  [param('queueId').isUUID().withMessage('Valid queue ID is required')],
  leaveQueue
);

// Admin/Staff only
router.put(
  '/:queueId/status',
  authenticate,
  authorize('admin', 'staff'),
  [param('queueId').isUUID().withMessage('Valid queue ID is required')],
  updateQueueStatus
);

export default router;
