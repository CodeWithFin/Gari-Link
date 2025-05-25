const MaintenanceRecord = require('../models/MaintenanceRecord');
const Vehicle = require('../models/Vehicle');
const mongoose = require('mongoose');

// Get all maintenance records for a vehicle
exports.getAllMaintenanceRecords = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    
    // Verify vehicle belongs to user
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      userId: req.user.id
    });
    
    if (!vehicle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Vehicle not found or does not belong to you'
      });
    }
    
    // Get maintenance records
    const maintenanceRecords = await MaintenanceRecord.find({ 
      vehicleId,
      userId: req.user.id
    }).sort({ date: -1 });
    
    res.status(200).json({
      status: 'success',
      results: maintenanceRecords.length,
      data: {
        maintenanceRecords
      }
    });
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching maintenance records',
      error: error.message
    });
  }
};

// Get a single maintenance record
exports.getMaintenanceRecord = async (req, res) => {
  try {
    const maintenanceRecord = await MaintenanceRecord.findOne({ 
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!maintenanceRecord) {
      return res.status(404).json({
        status: 'fail',
        message: 'Maintenance record not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        maintenanceRecord
      }
    });
  } catch (error) {
    console.error('Error fetching maintenance record:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching maintenance record',
      error: error.message
    });
  }
};

// Create a new maintenance record
exports.createMaintenanceRecord = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    
    // Verify vehicle belongs to user
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      userId: req.user.id
    });
    
    if (!vehicle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Vehicle not found or does not belong to you'
      });
    }
    
    // Add user ID to maintenance data
    req.body.userId = req.user.id;
    req.body.vehicleId = vehicleId;
    
    // If mileage is greater than current vehicle mileage, update vehicle mileage
    if (req.body.mileage > vehicle.mileage.current) {
      await vehicle.addMileageEntry(req.body.mileage, 'service');
    }
    
    // Create new maintenance record
    const newMaintenanceRecord = await MaintenanceRecord.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        maintenanceRecord: newMaintenanceRecord
      }
    });
  } catch (error) {
    console.error('Error creating maintenance record:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating maintenance record',
      error: error.message
    });
  }
};

// Update a maintenance record
exports.updateMaintenanceRecord = async (req, res) => {
  try {
    // Prevent updating userId or vehicleId
    if (req.body.userId) delete req.body.userId;
    if (req.body.vehicleId) delete req.body.vehicleId;
    
    // Update maintenance record
    const updatedMaintenanceRecord = await MaintenanceRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedMaintenanceRecord) {
      return res.status(404).json({
        status: 'fail',
        message: 'Maintenance record not found'
      });
    }
    
    // If mileage is updated, check if vehicle mileage needs update
    if (req.body.mileage) {
      const vehicle = await Vehicle.findById(updatedMaintenanceRecord.vehicleId);
      if (vehicle && req.body.mileage > vehicle.mileage.current) {
        await vehicle.addMileageEntry(req.body.mileage, 'service');
      }
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        maintenanceRecord: updatedMaintenanceRecord
      }
    });
  } catch (error) {
    console.error('Error updating maintenance record:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating maintenance record',
      error: error.message
    });
  }
};

// Delete a maintenance record
exports.deleteMaintenanceRecord = async (req, res) => {
  try {
    const maintenanceRecord = await MaintenanceRecord.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!maintenanceRecord) {
      return res.status(404).json({
        status: 'fail',
        message: 'Maintenance record not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Error deleting maintenance record:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting maintenance record',
      error: error.message
    });
  }
};

// Add receipt to maintenance record
exports.addReceipt = async (req, res) => {
  try {
    const { url, description } = req.body;
    
    if (!url) {
      return res.status(400).json({
        status: 'fail',
        message: 'Receipt URL is required'
      });
    }
    
    const maintenanceRecord = await MaintenanceRecord.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!maintenanceRecord) {
      return res.status(404).json({
        status: 'fail',
        message: 'Maintenance record not found'
      });
    }
    
    // Add receipt to maintenance record
    maintenanceRecord.receipts.push({
      url,
      description,
      uploadedAt: new Date(),
      extractedData: req.body.extractedData || {}
    });
    
    await maintenanceRecord.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        maintenanceRecord
      }
    });
  } catch (error) {
    console.error('Error adding receipt:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error adding receipt',
      error: error.message
    });
  }
};

// Remove receipt from maintenance record
exports.removeReceipt = async (req, res) => {
  try {
    const { receiptId } = req.params;
    
    if (!receiptId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Receipt ID is required'
      });
    }
    
    const maintenanceRecord = await MaintenanceRecord.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!maintenanceRecord) {
      return res.status(404).json({
        status: 'fail',
        message: 'Maintenance record not found'
      });
    }
    
    // Remove receipt from maintenance record
    maintenanceRecord.receipts = maintenanceRecord.receipts.filter(
      receipt => receipt._id.toString() !== receiptId
    );
    
    await maintenanceRecord.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        maintenanceRecord
      }
    });
  } catch (error) {
    console.error('Error removing receipt:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error removing receipt',
      error: error.message
    });
  }
};

// Add document to maintenance record
exports.addDocument = async (req, res) => {
  try {
    const { url, type, description } = req.body;
    
    if (!url) {
      return res.status(400).json({
        status: 'fail',
        message: 'Document URL is required'
      });
    }
    
    const maintenanceRecord = await MaintenanceRecord.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!maintenanceRecord) {
      return res.status(404).json({
        status: 'fail',
        message: 'Maintenance record not found'
      });
    }
    
    // Add document to maintenance record
    maintenanceRecord.documents.push({
      url,
      type: type || 'invoice',
      description,
      uploadedAt: new Date()
    });
    
    await maintenanceRecord.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        maintenanceRecord
      }
    });
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error adding document',
      error: error.message
    });
  }
};

// Remove document from maintenance record
exports.removeDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    
    if (!documentId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Document ID is required'
      });
    }
    
    const maintenanceRecord = await MaintenanceRecord.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!maintenanceRecord) {
      return res.status(404).json({
        status: 'fail',
        message: 'Maintenance record not found'
      });
    }
    
    // Remove document from maintenance record
    maintenanceRecord.documents = maintenanceRecord.documents.filter(
      document => document._id.toString() !== documentId
    );
    
    await maintenanceRecord.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        maintenanceRecord
      }
    });
  } catch (error) {
    console.error('Error removing document:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error removing document',
      error: error.message
    });
  }
};

// Schedule next maintenance
exports.scheduleNextMaintenance = async (req, res) => {
  try {
    const { interval, unit, notificationType } = req.body;
    
    if (!interval || !unit) {
      return res.status(400).json({
        status: 'fail',
        message: 'Interval and unit are required'
      });
    }
    
    const maintenanceRecord = await MaintenanceRecord.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!maintenanceRecord) {
      return res.status(404).json({
        status: 'fail',
        message: 'Maintenance record not found'
      });
    }
    
    // Schedule next maintenance using the model method
    await maintenanceRecord.scheduleNextMaintenance(
      interval, 
      unit
    );
    
    // Update notification type if provided
    if (notificationType) {
      maintenanceRecord.reminder.notificationType = notificationType;
      await maintenanceRecord.save();
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        maintenanceRecord
      }
    });
  } catch (error) {
    console.error('Error scheduling next maintenance:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error scheduling next maintenance',
      error: error.message
    });
  }
};

// Get upcoming maintenance due
exports.getUpcomingMaintenance = async (req, res) => {
  try {
    // Find all maintenance records for user's vehicles with enabled reminders
    const records = await MaintenanceRecord.find({
      userId: req.user.id,
      'reminder.enabled': true,
      $or: [
        // Due by date
        { 'reminder.dueDate': { $ne: null, $gte: new Date() } },
        // Due by mileage - need to check against current vehicle mileage
        { 'reminder.dueMileage': { $ne: null } }
      ]
    }).sort({ 'reminder.dueDate': 1 });
    
    // Get all user's vehicles
    const vehicles = await Vehicle.find({ userId: req.user.id });
    const vehicleMap = {};
    vehicles.forEach(vehicle => {
      vehicleMap[vehicle._id.toString()] = vehicle;
    });
    
    // Filter and enrich records with vehicle info
    const upcomingMaintenance = records
      .filter(record => {
        const vehicle = vehicleMap[record.vehicleId.toString()];
        if (!vehicle) return false;
        
        // Include if due by date or mileage is within threshold
        return (
          (record.reminder.dueDate && new Date(record.reminder.dueDate) >= new Date()) ||
          (record.reminder.dueMileage && 
           record.reminder.dueMileage - vehicle.mileage.current <= 1000)
        );
      })
      .map(record => {
        const vehicle = vehicleMap[record.vehicleId.toString()];
        return {
          ...record.toObject(),
          vehicle: {
            _id: vehicle._id,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            nickname: vehicle.nickname,
            currentMileage: vehicle.mileage.current
          },
          milesRemaining: record.reminder.dueMileage 
            ? record.reminder.dueMileage - vehicle.mileage.current
            : null
        };
      });
    
    res.status(200).json({
      status: 'success',
      results: upcomingMaintenance.length,
      data: {
        upcomingMaintenance
      }
    });
  } catch (error) {
    console.error('Error fetching upcoming maintenance:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching upcoming maintenance',
      error: error.message
    });
  }
};
