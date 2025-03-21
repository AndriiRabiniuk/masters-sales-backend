const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * Middleware to protect routes by verifying JWT token
 * @route Middleware for protected routes
 * @access Public -> Private
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if token is expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        res.status(401);
        throw new Error('Token expired, please login again');
      }

      // Get user from the token
      const user = await User.findById(decoded.id).select('-password');

      // Check if user still exists
      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error(`Authentication error: ${error.message}`);
      
      if (error.name === 'JsonWebTokenError') {
        res.status(401);
        throw new Error('Invalid token');
      } else if (error.name === 'TokenExpiredError') {
        res.status(401);
        throw new Error('Token expired, please login again');
      } else {
        res.status(401);
        throw new Error('Not authorized, authentication failed');
      }
    }
  } else if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

/**
 * Middleware to restrict access to super_admin users
 * @route Middleware for super_admin-only routes
 * @access Private -> Super Admin only
 */
const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as a super admin');
  }
};

/**
 * Middleware to restrict access to admin users
 * @route Middleware for admin-only routes
 * @access Private -> Admin only
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

/**
 * Middleware to restrict access to company admins or super admins
 * @route Middleware for company admin routes
 * @access Private -> Company Admin or Super Admin
 */
const isCompanyAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    if (req.user.role === 'admin' && req.params.id) {
      // For admins, ensure they are accessing their own company
      if (req.user.company_id && req.user.company_id.toString() === req.params.id) {
        next();
      } else {
        res.status(403);
        throw new Error('Not authorized to access this company');
      }
    } else if (req.user.role === 'super_admin') {
      // Super admins can access any company
      next();
    } else {
      res.status(403);
      throw new Error('Company ID is required');
    }
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

/**
 * Middleware to restrict access based on user roles
 * @param {Array} roles - Array of allowed roles
 * @route Middleware for role-based access control
 * @access Private -> Role-based
 */
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, authentication required');
    }

    if (roles.length && !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Role ${req.user.role} is not authorized to access this route`);
    }

    next();
  };
};

module.exports = { protect, isSuperAdmin, isAdmin, isCompanyAdmin, authorize }; 