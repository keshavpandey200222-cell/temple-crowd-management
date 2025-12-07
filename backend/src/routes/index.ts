import { Router } from 'express';
import authRoutes from './auth.routes';
import bookingRoutes from './booking.routes';
import crowdRoutes from './crowd.routes';
import queueRoutes from './queue.routes';
import analyticsRoutes from './analytics.routes';
import userRoutes from './user.routes';
import zoneRoutes from './zone.routes';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/crowd', crowdRoutes);
router.use('/queues', queueRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/users', userRoutes);
router.use('/zones', zoneRoutes);

// API Info
router.get('/', (req, res) => {
  res.json({
    message: 'Temple Crowd Management API',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      bookings: '/bookings',
      crowd: '/crowd',
      queues: '/queues',
      analytics: '/analytics',
      users: '/users',
      zones: '/zones',
    },
  });
});

export default router;
