const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);

// Vehicle routes
router
  .route('/')
  .get(vehicleController.getAllVehicles)
  .post(vehicleController.createVehicle);

router
  .route('/:id')
  .get(vehicleController.getVehicle)
  .patch(vehicleController.updateVehicle)
  .delete(vehicleController.deleteVehicle);

// Hard delete route (admin only)
router
  .route('/:id/hard-delete')
  .delete(
    authMiddleware.restrictTo('admin'),
    vehicleController.hardDeleteVehicle
  );

// Vehicle mileage update
router
  .route('/:id/mileage')
  .patch(vehicleController.updateMileage);

// Vehicle photos
router
  .route('/:id/photos')
  .post(vehicleController.addVehiclePhoto);

router
  .route('/:id/photos/:photoId')
  .delete(vehicleController.removeVehiclePhoto);

// OBD device connection
router
  .route('/:id/obd/connect')
  .post(vehicleController.connectObdDevice);

router
  .route('/:id/obd/disconnect')
  .post(vehicleController.disconnectObdDevice);

module.exports = router;
