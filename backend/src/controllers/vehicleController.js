const Vehicle = require('../models/Vehicle');
const mongoose = require('mongoose');
const axios = require('axios');

// Utility function to fetch vehicle data from VIN
const getVehicleDataFromVin = async (vin) => {
  try {
    // In a real implementation, use NHTSA API or similar
    // Example: https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json
    const response = await axios.get(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`
    );
    
    const data = response.data.Results[0];
    
    return {
      make: data.Make,
      model: data.Model,
      year: parseInt(data.ModelYear),
      type: mapVehicleType(data.BodyClass),
      engineSize: data.DisplacementL,
      fuelType: mapFuelType(data.FuelTypePrimary)
    };
  } catch (error) {
    console.error('Error fetching VIN data:', error);
    return null;
  }
};

// Helper function to map vehicle types
const mapVehicleType = (bodyClass) => {
  if (!bodyClass) return 'other';
  
  bodyClass = bodyClass.toLowerCase();
  
  if (bodyClass.includes('sedan')) return 'sedan';
  if (bodyClass.includes('suv') || bodyClass.includes('sport utility')) return 'suv';
  if (bodyClass.includes('truck') || bodyClass.includes('pickup')) return 'truck';
  if (bodyClass.includes('van') || bodyClass.includes('minivan')) return 'van';
  if (bodyClass.includes('motorcycle')) return 'motorcycle';
  
  return 'other';
};

// Helper function to map fuel types
const mapFuelType = (fuelType) => {
  if (!fuelType) return 'gasoline';
  
  fuelType = fuelType.toLowerCase();
  
  if (fuelType.includes('gasoline')) return 'gasoline';
  if (fuelType.includes('diesel')) return 'diesel';
  if (fuelType.includes('electric')) return 'electric';
  if (fuelType.includes('hybrid')) {
    if (fuelType.includes('plug-in')) return 'plugin_hybrid';
    return 'hybrid';
  }
  
  return 'other';
};

// Get all vehicles for the current user
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user.id, isActive: true });
    
    res.status(200).json({
      status: 'success',
      results: vehicles.length,
      data: {
        vehicles
      }
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching vehicles',
      error: error.message
    });
  }
};

// Get a single vehicle
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ 
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!vehicle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Vehicle not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        vehicle
      }
    });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching vehicle',
      error: error.message
    });
  }
};

// Create a new vehicle
exports.createVehicle = async (req, res) => {
  try {
    // Add user ID to vehicle data
    req.body.userId = req.user.id;
    
    // If VIN provided, try to fetch vehicle data
    if (req.body.vin) {
      const vinData = await getVehicleDataFromVin(req.body.vin);
      
      // Merge VIN data with request data (request data takes precedence)
      if (vinData) {
        req.body = {
          ...vinData,
          ...req.body
        };
      }
    }
    
    // Add initial mileage history entry if mileage provided
    if (req.body.mileage && req.body.mileage.current) {
      req.body.mileage.history = [{
        value: req.body.mileage.current,
        date: new Date(),
        source: 'manual'
      }];
      req.body.mileage.lastUpdated = new Date();
    }
    
    // Create new vehicle
    const newVehicle = await Vehicle.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        vehicle: newVehicle
      }
    });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating vehicle',
      error: error.message
    });
  }
};

// Update a vehicle
exports.updateVehicle = async (req, res) => {
  try {
    // Prevent updating userId
    if (req.body.userId) {
      delete req.body.userId;
    }
    
    // If updating mileage, add to history
    if (req.body.mileage && req.body.mileage.current) {
      const vehicle = await Vehicle.findById(req.params.id);
      
      if (!vehicle) {
        return res.status(404).json({
          status: 'fail',
          message: 'Vehicle not found'
        });
      }
      
      // Ensure vehicle belongs to user
      if (vehicle.userId.toString() !== req.user.id) {
        return res.status(403).json({
          status: 'fail',
          message: 'You do not have permission to update this vehicle'
        });
      }
      
      // Add mileage entry to history if it's higher than current
      if (req.body.mileage.current > vehicle.mileage.current) {
        req.body.mileage.history = vehicle.mileage.history || [];
        req.body.mileage.history.push({
          value: req.body.mileage.current,
          date: new Date(),
          source: req.body.mileage.source || 'manual'
        });
        req.body.mileage.lastUpdated = new Date();
      }
    }
    
    // Update vehicle
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedVehicle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Vehicle not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        vehicle: updatedVehicle
      }
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating vehicle',
      error: error.message
    });
  }
};

// Delete a vehicle (soft delete)
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isActive: false },
      { new: true }
    );
    
    if (!vehicle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Vehicle not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting vehicle',
      error: error.message
    });
  }
};

// Hard delete a vehicle (admin only)
exports.hardDeleteVehicle = async (req, res) => {
  try {
    // Ensure user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Vehicle not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Error hard deleting vehicle:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error hard deleting vehicle',
      error: error.message
    });
  }
};

// Update vehicle mileage
exports.updateMileage = async (req, res) => {
  try {
    const { mileage, source } = req.body;
    
    if (!mileage) {
      return res.status(400).json({
        status: 'fail',
        message: 'Mileage is required'
      });
    }
    
    const vehicle = await Vehicle.findOne({ 
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!vehicle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Vehicle not found'
      });
    }
    
    // Add mileage entry to history if it's higher than current
    if (mileage > vehicle.mileage.current) {
      // Use addMileageEntry method from model
      await vehicle.addMileageEntry(mileage, source || 'manual');
      
      res.status(200).json({
        status: 'success',
        data: {
          vehicle
        }
      });
    } else {
      res.status(400).json({
        status: 'fail',
        message: 'New mileage must be higher than current mileage'
      });
    }
  } catch (error) {
    console.error('Error updating mileage:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating mileage',
      error: error.message
    });
  }
};

// Add vehicle photo
exports.addVehiclePhoto = async (req, res) => {
  try {
    // In a real implementation, handle file upload
    // For now, just update with the provided URL
    const { url, type, description } = req.body;
    
    if (!url) {
      return res.status(400).json({
        status: 'fail',
        message: 'Photo URL is required'
      });
    }
    
    const vehicle = await Vehicle.findOne({ 
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!vehicle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Vehicle not found'
      });
    }
    
    // Add photo to vehicle
    vehicle.photos.push({
      url,
      type: type || 'exterior',
      description,
      uploadedAt: new Date()
    });
    
    await vehicle.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        vehicle
      }
    });
  } catch (error) {
    console.error('Error adding vehicle photo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error adding vehicle photo',
      error: error.message
    });
  }
};

// Remove vehicle photo
exports.removeVehiclePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    
    if (!photoId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Photo ID is required'
      });
    }
    
    const vehicle = await Vehicle.findOne({ 
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!vehicle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Vehicle not found'
      });
    }
    
    // Remove photo from vehicle
    vehicle.photos = vehicle.photos.filter(
      photo => photo._id.toString() !== photoId
    );
    
    await vehicle.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        vehicle
      }
    });
  } catch (error) {
    console.error('Error removing vehicle photo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error removing vehicle photo',
      error: error.message
    });
  }
};

// Connect OBD device
exports.connectObdDevice = async (req, res) => {
  try {
    const { deviceId, deviceModel } = req.body;
    
    if (!deviceId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Device ID is required'
      });
    }
    
    const vehicle = await Vehicle.findOne({ 
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!vehicle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Vehicle not found'
      });
    }
    
    // Update OBD information
    vehicle.obd = {
      deviceId,
      deviceModel,
      connected: true,
      lastConnected: new Date()
    };
    
    await vehicle.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        vehicle
      }
    });
  } catch (error) {
    console.error('Error connecting OBD device:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error connecting OBD device',
      error: error.message
    });
  }
};

// Disconnect OBD device
exports.disconnectObdDevice = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ 
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!vehicle) {
      return res.status(404).json({
        status: 'fail',
        message: 'Vehicle not found'
      });
    }
    
    // Update OBD connection status
    if (vehicle.obd) {
      vehicle.obd.connected = false;
      await vehicle.save();
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        vehicle
      }
    });
  } catch (error) {
    console.error('Error disconnecting OBD device:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error disconnecting OBD device',
      error: error.message
    });
  }
};
