import jwt from 'jsonwebtoken';
import User from '../model/User.js';

const JWT_SECRET = process.env.JWT_SECRET;
const authAttempts = new Map();
const AUTH_WINDOW_MS = 15 * 60 * 1000;
const AUTH_MAX_ATTEMPTS = 10;

export const authRateLimit = (req, res, next) => {
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const attempt = authAttempts.get(key);

  if (!attempt || now > attempt.resetAt) {
    authAttempts.set(key, { count: 1, resetAt: now + AUTH_WINDOW_MS });
    return next();
  }

  if (attempt.count >= AUTH_MAX_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      message: 'Too many login or registration attempts. Please try again in 15 minutes.',
    });
  }

  attempt.count += 1;
  authAttempts.set(key, attempt);
  return next();
};

export const verifyToken = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers['x-auth-token']) {
      token = req.headers['x-auth-token'];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided. Access denied.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by an administrator.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access. Please login first.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}].`,
      });
    }

    next();
  };
};

export const protect = verifyToken;
export const requireAdmin = authorizeRoles('ADMIN');
export const requireFarmer = authorizeRoles('FARMER', 'ADMIN');
export const requireBuyer = authorizeRoles('BUYER');
