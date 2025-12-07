import { createClient } from 'redis';
import { logger } from '../utils/logger';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('✅ Redis connected successfully');
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('Redis connection failed:', error);
    throw error;
  }
};

// Cache helper functions
export const cacheGet = async (key: string): Promise<string | null> => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    logger.error(`Cache get error for key ${key}:`, error);
    return null;
  }
};

export const cacheSet = async (
  key: string,
  value: string,
  expirationInSeconds?: number
): Promise<void> => {
  try {
    if (expirationInSeconds) {
      await redisClient.setEx(key, expirationInSeconds, value);
    } else {
      await redisClient.set(key, value);
    }
  } catch (error) {
    logger.error(`Cache set error for key ${key}:`, error);
  }
};

export const cacheDel = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error(`Cache delete error for key ${key}:`, error);
  }
};

export default redisClient;
