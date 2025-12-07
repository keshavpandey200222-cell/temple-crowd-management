import { Pool } from 'pg';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  logger.info('✅ PostgreSQL connected successfully');
});

pool.on('error', (err) => {
  logger.error('PostgreSQL connection error:', err);
});

// MongoDB Connection
export const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || '');
    logger.info('✅ MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};

// Combined database connection
export const connectDatabase = async (): Promise<void> => {
  try {
    // Test PostgreSQL connection
    await pool.query('SELECT NOW()');
    
    // Connect to MongoDB
    await connectMongoDB();
    
    logger.info('✅ All databases connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

export { pool };
export default pool;
