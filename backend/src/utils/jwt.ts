import jwt from 'jsonwebtoken';
import { ApiError } from '../middleware/errorHandler';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || '', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || '', {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || '') as TokenPayload;
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || '') as TokenPayload;
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
};

export const verifySocketToken = async (token: string): Promise<TokenPayload> => {
  return verifyAccessToken(token);
};
