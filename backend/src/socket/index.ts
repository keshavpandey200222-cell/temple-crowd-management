import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../utils/logger';
import { verifySocketToken } from '../utils/jwt';

export const initializeSocketHandlers = (io: SocketIOServer): void => {
  // Middleware for socket authentication
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (token) {
        const decoded = await verifySocketToken(token);
        socket.data.user = decoded;
      }
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Join room for real-time updates
    socket.on('join:crowd-updates', () => {
      socket.join('crowd-updates');
      logger.info(`Socket ${socket.id} joined crowd-updates room`);
    });

    socket.on('join:queue-updates', (queueId: string) => {
      socket.join(`queue:${queueId}`);
      logger.info(`Socket ${socket.id} joined queue:${queueId} room`);
    });

    socket.on('join:zone-updates', (zoneId: string) => {
      socket.join(`zone:${zoneId}`);
      logger.info(`Socket ${socket.id} joined zone:${zoneId} room`);
    });

    // Leave rooms
    socket.on('leave:crowd-updates', () => {
      socket.leave('crowd-updates');
    });

    socket.on('leave:queue-updates', (queueId: string) => {
      socket.leave(`queue:${queueId}`);
    });

    socket.on('leave:zone-updates', (zoneId: string) => {
      socket.leave(`zone:${zoneId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.info('✅ Socket.IO handlers initialized');
};

// Helper functions to emit events
export const emitCrowdUpdate = (io: SocketIOServer, data: any): void => {
  io.to('crowd-updates').emit('crowd:update', data);
};

export const emitQueueUpdate = (io: SocketIOServer, queueId: string, data: any): void => {
  io.to(`queue:${queueId}`).emit('queue:update', data);
};

export const emitZoneUpdate = (io: SocketIOServer, zoneId: string, data: any): void => {
  io.to(`zone:${zoneId}`).emit('zone:update', data);
};

export const emitAlert = (io: SocketIOServer, data: any): void => {
  io.emit('alert', data);
};
