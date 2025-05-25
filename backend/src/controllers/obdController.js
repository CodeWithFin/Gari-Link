const ObdData = require('../models/ObdData');
const Vehicle = require('../models/Vehicle');
const mongoose = require('mongoose');

// Store OBD data for a vehicle
exports.storeObdData = async (req, res) => {
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
    
    // Add user ID to OBD data
    req.body.userId = req.user.id;
    req.body.vehicleId = vehicleId;
    
    // Ensure timestamp is present
    if (!req.body.timestamp) {
      req.body.timestamp = new Date();
    }
    
    // Create new OBD data entry
    const newObdData = await ObdData.create(req.body);
    
    // Update vehicle mileage if OBD mileage is higher
    if (req.body.mileage && req.body.mileage > vehicle.mileage.current) {
      await vehicle.addMileageEntry(req.body.mileage, 'obd');
    }
    
    // Update vehicle OBD connection status
    if (!vehicle.obd.connected) {
      vehicle.obd.connected = true;
      vehicle.obd.lastConnected = new Date();
      await vehicle.save();
    }
    
    res.status(201).json({
      status: 'success',
      data: {
        obdData: newObdData
      }
    });
  } catch (error) {
    console.error('Error storing OBD data:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error storing OBD data',
      error: error.message
    });
  }
};

// Get latest OBD data for a vehicle
exports.getLatestObdData = async (req, res) => {
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
    
    // Get latest OBD data
    const latestObdData = await ObdData.findOne({ 
      vehicleId
    }).sort({ timestamp: -1 });
    
    if (!latestObdData) {
      return res.status(404).json({
        status: 'fail',
        message: 'No OBD data found for this vehicle'
      });
    }
    
    // Calculate vehicle health score
    const healthScore = latestObdData.calculateHealthScore();
    
    // Get maintenance recommendations
    const recommendations = latestObdData.getMaintenanceRecommendations();
    
    res.status(200).json({
      status: 'success',
      data: {
        obdData: latestObdData,
        healthScore,
        recommendations
      }
    });
  } catch (error) {
    console.error('Error fetching OBD data:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching OBD data',
      error: error.message
    });
  }
};

// Get OBD data history for a vehicle
exports.getObdDataHistory = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { startDate, endDate, limit = 100 } = req.query;
    
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
    
    // Build query
    const query = { vehicleId };
    
    // Add date range if provided
    if (startDate || endDate) {
      query.timestamp = {};
      
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }
    
    // Get OBD data history
    const obdDataHistory = await ObdData.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    
    res.status(200).json({
      status: 'success',
      results: obdDataHistory.length,
      data: {
        obdDataHistory
      }
    });
  } catch (error) {
    console.error('Error fetching OBD data history:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching OBD data history',
      error: error.message
    });
  }
};

// Get diagnostic trouble codes for a vehicle
exports.getDiagnosticCodes = async (req, res) => {
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
    
    // Get latest OBD data
    const latestObdData = await ObdData.findOne({ 
      vehicleId
    }).sort({ timestamp: -1 });
    
    if (!latestObdData) {
      return res.status(404).json({
        status: 'fail',
        message: 'No OBD data found for this vehicle'
      });
    }
    
    // Extract diagnostic codes
    const diagnosticCodes = latestObdData.diagnosticCodes || [];
    
    res.status(200).json({
      status: 'success',
      results: diagnosticCodes.length,
      data: {
        diagnosticCodes,
        timestamp: latestObdData.timestamp
      }
    });
  } catch (error) {
    console.error('Error fetching diagnostic codes:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching diagnostic codes',
      error: error.message
    });
  }
};

// Get trip history for a vehicle
exports.getTripHistory = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { limit = 20 } = req.query;
    
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
    
    // Get trips from OBD data
    const trips = await ObdData.find({
      vehicleId,
      'trip.id': { $exists: true, $ne: null },
      'trip.startTime': { $exists: true },
      'trip.endTime': { $exists: true }
    })
    .sort({ 'trip.endTime': -1 })
    .limit(parseInt(limit));
    
    // Process trips to extract only relevant data
    const tripHistory = trips.map(data => ({
      id: data.trip.id,
      startTime: data.trip.startTime,
      endTime: data.trip.endTime,
      duration: data.trip.duration,
      distance: data.trip.distance,
      avgSpeed: data.trip.avgSpeed,
      maxSpeed: data.trip.maxSpeed,
      fuelUsed: data.trip.fuelUsed,
      energyUsed: data.trip.energyUsed,
      startLocation: data.location,
      timestamp: data.timestamp
    }));
    
    res.status(200).json({
      status: 'success',
      results: tripHistory.length,
      data: {
        tripHistory
      }
    });
  } catch (error) {
    console.error('Error fetching trip history:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching trip history',
      error: error.message
    });
  }
};

// Get vehicle health status
exports.getVehicleHealth = async (req, res) => {
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
    
    // Get latest OBD data
    const latestObdData = await ObdData.findOne({ 
      vehicleId
    }).sort({ timestamp: -1 });
    
    if (!latestObdData) {
      return res.status(404).json({
        status: 'fail',
        message: 'No OBD data found for this vehicle'
      });
    }
    
    // Calculate vehicle health score
    const healthScore = latestObdData.calculateHealthScore();
    
    // Get maintenance recommendations
    const recommendations = latestObdData.getMaintenanceRecommendations();
    
    // Extract key system statuses
    const systemStatuses = {
      engine: {
        status: healthScore.deductions.some(d => d.reason.includes('engine')) ? 'warning' : 'ok',
        data: latestObdData.engineData || {}
      },
      battery: {
        status: healthScore.deductions.some(d => d.reason.includes('battery')) ? 'warning' : 'ok',
        data: latestObdData.batteryData || {}
      },
      fuel: {
        status: 'ok',
        data: latestObdData.fuelData || {}
      },
      tires: {
        status: healthScore.deductions.some(d => d.reason.includes('tire')) ? 'warning' : 'ok',
        data: latestObdData.tireData || []
      },
      brakes: {
        status: 'ok',
        data: latestObdData.brakingData || {}
      },
      emissions: {
        status: healthScore.deductions.some(d => d.reason.includes('emissions')) ? 'warning' : 'ok',
        data: latestObdData.emissionsData || {}
      }
    };
    
    res.status(200).json({
      status: 'success',
      data: {
        healthScore: healthScore.score,
        deductions: healthScore.deductions,
        recommendations,
        systemStatuses,
        lastUpdated: latestObdData.timestamp
      }
    });
  } catch (error) {
    console.error('Error fetching vehicle health:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching vehicle health',
      error: error.message
    });
  }
};
