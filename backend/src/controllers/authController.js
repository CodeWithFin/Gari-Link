const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');

// Utility function to create and send JWT token
const createSendToken = (user, statusCode, req, res, mfaRequired = false) => {
  // Generate JWT token
  const token = jwt.sign(
    { 
      id: user._id,
      mfaRequired
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  // Set cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  };

  // Send JWT as cookie
  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    mfaRequired,
    data: {
      user
    }
  });
};

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already in use'
      });
    }

    // Create new user
    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      emailVerified: false,
      authMethod: 'local'
    });

    // Generate email verification token
    const verificationToken = newUser.generateEmailVerificationToken();
    await newUser.save({ validateBeforeSave: false });

    // In a real app, send verification email here
    // For now, just log the token
    console.log(`Verification token: ${verificationToken}`);

    // Create and send JWT
    createSendToken(newUser, 201, req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(401).json({
        status: 'fail',
        message: 'Account locked. Please try again later.'
      });
    }

    // Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      // Increment login attempts
      await user.incrementLoginAttempts();
      
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Check if MFA is enabled
    if (user.mfaEnabled) {
      // Return a special token for MFA
      return createSendToken(user, 200, req, res, true);
    }

    // If MFA not enabled, send regular token
    createSendToken(user, 200, req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Verify MFA token
exports.verifyMfa = async (req, res, next) => {
  try {
    const { email, token } = req.body;

    // Get user based on email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or token'
      });
    }

    // Verify MFA token
    const isValid = user.verifyMfaToken(token);
    if (!isValid) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token'
      });
    }

    // If token is valid, create and send JWT
    createSendToken(user, 200, req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error verifying MFA',
      error: error.message
    });
  }
};

// Setup MFA
exports.setupMfa = async (req, res, next) => {
  try {
    const { mfaMethod } = req.body;
    const userId = req.user.id;

    // Validate MFA method
    if (!['app', 'sms', 'email'].includes(mfaMethod)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid MFA method'
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    // Generate MFA secret
    const secret = user.generateMfaSecret();
    
    // Update user with MFA method
    user.mfaMethod = mfaMethod;
    await user.save({ validateBeforeSave: false });

    // Return MFA setup information
    // In a real app, also generate QR code for TOTP apps
    res.status(200).json({
      status: 'success',
      data: {
        secret,
        mfaMethod
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error setting up MFA',
      error: error.message
    });
  }
};

// Enable MFA after setup
exports.enableMfa = async (req, res, next) => {
  try {
    const { token } = req.body;
    const userId = req.user.id;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    // Verify token
    const isValid = user.verifyMfaToken(token);
    if (!isValid) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token'
      });
    }

    // Enable MFA
    user.mfaEnabled = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'MFA enabled successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error enabling MFA',
      error: error.message
    });
  }
};

// Disable MFA
exports.disableMfa = async (req, res, next) => {
  try {
    const { token } = req.body;
    const userId = req.user.id;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    // Verify token
    const isValid = user.verifyMfaToken(token);
    if (!isValid) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token'
      });
    }

    // Disable MFA
    user.mfaEnabled = false;
    user.mfaMethod = undefined;
    user.mfaSecret = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'MFA disabled successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error disabling MFA',
      error: error.message
    });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
  try {
    // Get user based on email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'There is no user with that email address'
      });
    }

    // Generate random reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // In a real app, send password reset email here
    // For now, just log the token
    console.log(`Reset token: ${resetToken}`);

    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to email'
    });
  } catch (error) {
    console.error(error);
    
    // Clean up if error
    if (user) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Error sending password reset email',
      error: error.message
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    // Get token from request
    const { token, password } = req.body;
    
    // Hash the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with the token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // Check if token is valid and not expired
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log user in with new JWT
    createSendToken(user, 200, req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error resetting password',
      error: error.message
    });
  }
};

// Update password (when logged in)
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user from collection
    const user = await User.findById(req.user.id);

    // Check if current password is correct
    const isCorrect = await user.comparePassword(currentPassword);
    if (!isCorrect) {
      return res.status(401).json({
        status: 'fail',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Log user in with new JWT
    createSendToken(user, 200, req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating password',
      error: error.message
    });
  }
};

// Logout
exports.logout = (req, res) => {
  // Clear JWT cookie
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({ status: 'success' });
};

// Verify email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    // Hash the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with the token
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    // Check if token is valid and not expired
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      });
    }

    // Update user
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error verifying email',
      error: error.message
    });
  }
};
