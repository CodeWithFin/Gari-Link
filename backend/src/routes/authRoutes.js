const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-mfa', authController.verifyMfa);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);
router.get('/logout', authController.logout);

// Protected routes
router.use(authMiddleware.protect);

router.post('/update-password', authController.updatePassword);
router.post('/setup-mfa', authController.setupMfa);
router.post('/enable-mfa', authController.enableMfa);
router.post('/disable-mfa', authMiddleware.requireMfa, authController.disableMfa);

module.exports = router;
