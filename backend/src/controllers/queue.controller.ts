import { Response } from 'express';
import pool from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getAllQueues = asyncHandler(async (req: AuthRequest, res: Response) => {
  const queues = await pool.query(
    `SELECT q.*, tz.zone_name 
     FROM queues q
     JOIN temple_zones tz ON q.zone_id = tz.zone_id
     WHERE q.status = 'active'
     ORDER BY q.queue_name`
  );

  res.json({
    success: true,
    data: { queues: queues.rows },
  });
});

export const getQueueStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { queueId } = req.params;

  const queue = await pool.query(
    'SELECT * FROM queues WHERE queue_id = $1',
    [queueId]
  );

  res.json({
    success: true,
    data: { queue: queue.rows[0] },
  });
});

export const joinQueue = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { queueId } = req.params;
  const userId = req.user?.userId;

  const position = await pool.query(
    'SELECT COALESCE(MAX(position), 0) + 1 as next_position FROM queue_entries WHERE queue_id = $1',
    [queueId]
  );

  await pool.query(
    'INSERT INTO queue_entries (queue_id, user_id, position) VALUES ($1, $2, $3)',
    [queueId, userId, position.rows[0].next_position]
  );

  res.json({
    success: true,
    message: 'Joined queue successfully',
    data: { position: position.rows[0].next_position },
  });
});

export const leaveQueue = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { queueId } = req.params;
  const userId = req.user?.userId;

  await pool.query(
    'UPDATE queue_entries SET status = $1 WHERE queue_id = $2 AND user_id = $3',
    ['cancelled', queueId, userId]
  );

  res.json({
    success: true,
    message: 'Left queue successfully',
  });
});

export const updateQueueStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { queueId } = req.params;
  const { status } = req.body;

  await pool.query(
    'UPDATE queues SET status = $1 WHERE queue_id = $2',
    [status, queueId]
  );

  res.json({
    success: true,
    message: 'Queue status updated',
  });
});
