import { Router } from 'express';
import { param } from 'express-validator';
import {
  getUserProfile,
  updateUserProfile,
  getUserNotifications,
  markNotificationAsRead,
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Get user profile
router.get('/profile', getUserProfile);

// Update user profile
router.put('/profile', updateUserProfile);

// Get user notifications
router.get('/notifications', getUserNotifications);

// Mark notification as read
router.put(
  '/notifications/:notificationId/read',
  [param('notificationId').isUUID().withMessage('Valid notification ID is required')],
  markNotificationAsRead
);

export default router;
