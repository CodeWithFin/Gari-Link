const express = require('express');
const obdController = require('../controllers/obdController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);

// Store OBD data for a vehicle
router.post('/:vehicleId', obdController.storeObdData);

// Get latest OBD data for a vehicle
router.get('/:vehicleId/latest', obdController.getLatestObdData);

// Get OBD data history for a vehicle
router.get('/:vehicleId/history', obdController.getObdDataHistory);

// Get diagnostic trouble codes for a vehicle
router.get('/:vehicleId/dtc', obdController.getDiagnosticCodes);

// Get trip history for a vehicle
router.get('/:vehicleId/trips', obdController.getTripHistory);

// Get vehicle health status
router.get('/:vehicleId/health', obdController.getVehicleHealth);

module.exports = router;
