import { Response } from 'express';
import pool from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  const user = await pool.query(
    'SELECT user_id, name, email, phone, role, language_preference, created_at FROM users WHERE user_id = $1',
    [userId]
  );

  res.json({
    success: true,
    data: { user: user.rows[0] },
  });
});

export const updateUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { name, phone, languagePreference } = req.body;

  const user = await pool.query(
    `UPDATE users 
     SET name = COALESCE($1, name), 
         phone = COALESCE($2, phone),
         language_preference = COALESCE($3, language_preference)
     WHERE user_id = $4
     RETURNING user_id, name, email, phone, role, language_preference`,
    [name, phone, languagePreference, userId]
  );

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: user.rows[0] },
  });
});

export const getUserNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  const notifications = await pool.query(
    'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
    [userId]
  );

  res.json({
    success: true,
    data: { notifications: notifications.rows },
  });
});

export const markNotificationAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { notificationId } = req.params;
  const userId = req.user?.userId;

  await pool.query(
    'UPDATE notifications SET is_read = true WHERE notification_id = $1 AND user_id = $2',
    [notificationId, userId]
  );

  res.json({
    success: true,
    message: 'Notification marked as read',
  });
});
