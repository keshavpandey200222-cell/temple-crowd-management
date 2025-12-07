import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import pool from '../config/database';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

// Register new user
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed');
  }

  const { name, email, phone, password } = req.body;

  // Check if user already exists
  const existingUser = await pool.query(
    'SELECT * FROM users WHERE email = $1 OR phone = $2',
    [email, phone]
  );

  if (existingUser.rows.length > 0) {
    throw new ApiError(409, 'User with this email or phone already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const result = await pool.query(
    `INSERT INTO users (name, email, phone, password_hash, role) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING user_id, name, email, phone, role, created_at`,
    [name, email, phone, passwordHash, 'visitor']
  );

  const user = result.rows[0];

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.user_id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.user_id,
    email: user.email,
    role: user.role,
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      accessToken,
      refreshToken,
    },
  });
});

// Login user
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed');
  }

  const { email, password } = req.body;

  // Find user
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const user = result.rows[0];

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.user_id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.user_id,
    email: user.email,
    role: user.role,
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      accessToken,
      refreshToken,
    },
  });
});

// Logout user
export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  // In a production app, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logout successful',
  });
});

// Refresh access token
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  const decoded = verifyRefreshToken(refreshToken);

  const accessToken = generateAccessToken({
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  });

  res.json({
    success: true,
    data: {
      accessToken,
    },
  });
});

// Get current user
export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await pool.query(
    'SELECT user_id, name, email, phone, role, language_preference, created_at FROM users WHERE user_id = $1',
    [req.user?.userId]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    success: true,
    data: {
      user: result.rows[0],
    },
  });
});
