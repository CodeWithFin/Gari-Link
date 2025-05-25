const express = require('express');
const maintenanceController = require('../controllers/maintenanceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);

// Get upcoming maintenance across all vehicles
router.get('/upcoming', maintenanceController.getUpcomingMaintenance);

// Routes for specific vehicle maintenance records
router
  .route('/:vehicleId')
  .get(maintenanceController.getAllMaintenanceRecords)
  .post(maintenanceController.createMaintenanceRecord);

// Routes for specific maintenance record
router
  .route('/record/:id')
  .get(maintenanceController.getMaintenanceRecord)
  .patch(maintenanceController.updateMaintenanceRecord)
  .delete(maintenanceController.deleteMaintenanceRecord);

// Receipt management
router
  .route('/record/:id/receipts')
  .post(maintenanceController.addReceipt);

router
  .route('/record/:id/receipts/:receiptId')
  .delete(maintenanceController.removeReceipt);

// Document management
router
  .route('/record/:id/documents')
  .post(maintenanceController.addDocument);

router
  .route('/record/:id/documents/:documentId')
  .delete(maintenanceController.removeDocument);

// Schedule next maintenance
router
  .route('/record/:id/schedule')
  .post(maintenanceController.scheduleNextMaintenance);

module.exports = router;
