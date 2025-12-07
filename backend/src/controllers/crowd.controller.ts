import { Response } from 'express';
import pool from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getCurrentCrowdStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const zones = await pool.query(
    `SELECT 
      tz.zone_id, tz.zone_name, tz.zone_type, tz.max_capacity, tz.current_occupancy,
      tz.alert_threshold, tz.status,
      CASE 
        WHEN tz.current_occupancy >= tz.alert_threshold THEN 'red'
        WHEN tz.current_occupancy >= (tz.alert_threshold * 0.7) THEN 'yellow'
        ELSE 'green'
      END as alert_level
    FROM temple_zones tz
    WHERE tz.status = 'active'
    ORDER BY tz.zone_name`
  );

  res.json({
    success: true,
    data: { zones: zones.rows },
  });
});

export const getZoneCrowdStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { zoneId } = req.params;
  
  const zone = await pool.query(
    'SELECT * FROM temple_zones WHERE zone_id = $1',
    [zoneId]
  );

  res.json({
    success: true,
    data: { zone: zone.rows[0] },
  });
});

export const getCrowdHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { zoneId, startDate, endDate } = req.query;
  
  let query = 'SELECT * FROM crowd_monitoring WHERE 1=1';
  const params: any[] = [];
  
  if (zoneId) {
    params.push(zoneId);
    query += ` AND zone_id = $${params.length}`;
  }
  
  const history = await pool.query(query + ' ORDER BY timestamp DESC LIMIT 100', params);

  res.json({
    success: true,
    data: { history: history.rows },
  });
});

export const updateCrowdCount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { zoneId, occupancyCount } = req.body;

  await pool.query(
    'UPDATE temple_zones SET current_occupancy = $1 WHERE zone_id = $2',
    [occupancyCount, zoneId]
  );

  await pool.query(
    'INSERT INTO crowd_monitoring (zone_id, occupancy_count) VALUES ($1, $2)',
    [zoneId, occupancyCount]
  );

  res.json({
    success: true,
    message: 'Crowd count updated',
  });
});

export const getCrowdAlerts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const alerts = await pool.query(
    'SELECT * FROM emergency_alerts WHERE is_resolved = false ORDER BY created_at DESC'
  );

  res.json({
    success: true,
    data: { alerts: alerts.rows },
  });
});
