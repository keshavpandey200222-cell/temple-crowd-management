import { Response } from 'express';
import pool from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getAllZones = asyncHandler(async (req: AuthRequest, res: Response) => {
  const zones = await pool.query(
    'SELECT * FROM temple_zones WHERE status = $1 ORDER BY zone_name',
    ['active']
  );

  res.json({
    success: true,
    data: { zones: zones.rows },
  });
});

export const getZoneDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
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

export const createZone = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { zoneName, zoneType, maxCapacity, alertThreshold } = req.body;

  const zone = await pool.query(
    `INSERT INTO temple_zones (zone_name, zone_type, max_capacity, alert_threshold)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [zoneName, zoneType, maxCapacity, alertThreshold]
  );

  res.status(201).json({
    success: true,
    message: 'Zone created successfully',
    data: { zone: zone.rows[0] },
  });
});

export const updateZone = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { zoneId } = req.params;
  const { zoneName, maxCapacity, alertThreshold, status } = req.body;

  const zone = await pool.query(
    `UPDATE temple_zones 
     SET zone_name = COALESCE($1, zone_name),
         max_capacity = COALESCE($2, max_capacity),
         alert_threshold = COALESCE($3, alert_threshold),
         status = COALESCE($4, status)
     WHERE zone_id = $5
     RETURNING *`,
    [zoneName, maxCapacity, alertThreshold, status, zoneId]
  );

  res.json({
    success: true,
    message: 'Zone updated successfully',
    data: { zone: zone.rows[0] },
  });
});

export const deleteZone = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { zoneId } = req.params;

  await pool.query(
    'UPDATE temple_zones SET status = $1 WHERE zone_id = $2',
    ['inactive', zoneId]
  );

  res.json({
    success: true,
    message: 'Zone deleted successfully',
  });
});
