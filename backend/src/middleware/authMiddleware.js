const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1) Get token from headers or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from Authorization header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      // Get token from cookie
      token = req.cookies.jwt;
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 4) Check if MFA verification is required but not completed
    if (decoded.mfaRequired && currentUser.mfaEnabled) {
      return res.status(401).json({
        status: 'fail',
        message: 'MFA verification required. Please complete the MFA process.'
      });
    }

    // 5) Check if user changed password after the token was issued
    if (currentUser.passwordChangedAt) {
      const changedTimestamp = parseInt(
        currentUser.passwordChangedAt.getTime() / 1000,
        10
      );

      if (decoded.iat < changedTimestamp) {
        return res.status(401).json({
          status: 'fail',
          message: 'User recently changed password. Please log in again.'
        });
      }
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Authentication failed',
      error: error.message
    });
  }
};

// Middleware to restrict access to certain roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }

    next();
  };
};

// Middleware to check if email is verified
exports.requireEmailVerified = (req, res, next) => {
  if (!req.user.emailVerified) {
    return res.status(403).json({
      status: 'fail',
      message: 'Please verify your email before accessing this resource'
    });
  }

  next();
};

// Middleware to ensure MFA is enabled for sensitive operations
exports.requireMfa = (req, res, next) => {
  if (!req.user.mfaEnabled) {
    return res.status(403).json({
      status: 'fail',
      message: 'Multi-factor authentication is required for this operation'
    });
  }

  next();
};

// Middleware to prevent account locking attacks
exports.rateLimiter = (maxAttempts, timeWindowMs) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Clean up old entries
    if (requests.has(ip)) {
      const requestTimes = requests.get(ip).filter(time => now - time < timeWindowMs);
      requests.set(ip, requestTimes);
      
      if (requestTimes.length >= maxAttempts) {
        return res.status(429).json({
          status: 'fail',
          message: 'Too many requests, please try again later'
        });
      }
      
      requestTimes.push(now);
    } else {
      requests.set(ip, [now]);
    }
    
    next();
  };
};
