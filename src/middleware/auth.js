const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Authentication middleware using JWT strategy
 */
const authenticate = passport.authenticate('jwt', { session: false });

/**
 * Role-based authorization middleware
 * @param {string[]} roles - Array of allowed roles
 */
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Authentication required' 
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: Insufficient permissions' 
      });
    }

    next();
  };
};

/**
 * Middleware to refresh JWT token
 */
const refreshToken = (req, res, next) => {
  // Only refresh if a valid user is authenticated
  if (req.user) {
    const newToken = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.setHeader('X-New-Token', newToken);
  }
  
  next();
};

module.exports = {
  authenticate,
  authorize,
  refreshToken
}; 