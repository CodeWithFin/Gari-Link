const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const diagnosticCodeSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  description: String,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical']
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'permanent', 'cleared'],
    required: true
  }
});

const tireDataSchema = new Schema({
  position: {
    type: String,
    enum: ['frontLeft', 'frontRight', 'rearLeft', 'rearRight'],
    required: true
  },
  pressure: Number,
  temperature: Number,
  treadDepth: Number
});

const obdDataSchema = new Schema({
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  mileage: {
    type: Number,
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number,
    accuracy: Number
  },
  engineData: {
    rpm: Number,
    temperature: Number,
    load: Number,
    runtime: Number
  },
  fuelData: {
    level: Number,
    consumption: Number,
    range: Number,
    pressure: Number
  },
  batteryData: {
    voltage: Number,
    current: Number,
    temperature: Number,
    stateOfCharge: Number
  },
  diagnosticCodes: [diagnosticCodeSchema],
  sensorData: {
    oxygenSensor: Number,
    massAirFlow: Number,
    intakeAirTemp: Number,
    throttlePosition: Number,
    barometricPressure: Number
  },
  transmissionData: {
    fluidTemp: Number,
    gearPosition: String
  },
  brakingData: {
    padWear: Number,
    fluidLevel: Number,
    pressure: Number
  },
  tireData: [tireDataSchema],
  emissionsData: {
    o2: Number,
    co2: Number,
    nox: Number,
    particulates: Number
  },
  trip: {
    id: String,
    startTime: Date,
    endTime: Date,
    duration: Number,
    distance: Number,
    avgSpeed: Number,
    maxSpeed: Number,
    fuelUsed: Number,
    energyUsed: Number
  },
  rawData: Schema.Types.Mixed
});

// Indexes for faster queries
obdDataSchema.index({ vehicleId: 1, timestamp: -1 });
obdDataSchema.index({ userId: 1 });
obdDataSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
obdDataSchema.index({ 'diagnosticCodes.code': 1 });

// Calculate vehicle health score (0-100)
obdDataSchema.methods.calculateHealthScore = function() {
  let score = 100;
  const deductions = [];
  
  // Check for diagnostic codes
  if (this.diagnosticCodes && this.diagnosticCodes.length > 0) {
    const activeCodes = this.diagnosticCodes.filter(code => 
      code.status === 'active' || code.status === 'permanent'
    );
    
    activeCodes.forEach(code => {
      switch(code.severity) {
        case 'critical':
          deductions.push({ reason: `DTC ${code.code}`, points: 30 });
          break;
        case 'high':
          deductions.push({ reason: `DTC ${code.code}`, points: 20 });
          break;
        case 'medium':
          deductions.push({ reason: `DTC ${code.code}`, points: 10 });
          break;
        case 'low':
          deductions.push({ reason: `DTC ${code.code}`, points: 5 });
          break;
        default:
          deductions.push({ reason: `DTC ${code.code}`, points: 5 });
      }
    });
  }
  
  // Check engine temperature
  if (this.engineData && this.engineData.temperature) {
    if (this.engineData.temperature > 230) {
      deductions.push({ 
        reason: 'High engine temperature', 
        points: Math.min(25, (this.engineData.temperature - 230) * 0.5) 
      });
    }
  }
  
  // Check battery voltage
  if (this.batteryData && this.batteryData.voltage) {
    if (this.batteryData.voltage < 12.0) {
      deductions.push({ 
        reason: 'Low battery voltage', 
        points: Math.min(20, (12.0 - this.batteryData.voltage) * 10) 
      });
    }
  }
  
  // Check tire pressure
  if (this.tireData && this.tireData.length > 0) {
    this.tireData.forEach(tire => {
      if (tire.pressure && (tire.pressure < 28 || tire.pressure > 38)) {
        deductions.push({ 
          reason: `Abnormal tire pressure (${tire.position})`, 
          points: 5 
        });
      }
    });
  }
  
  // Apply deductions
  deductions.forEach(deduction => {
    score -= deduction.points;
  });
  
  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));
  
  return {
    score,
    deductions
  };
};

// Get maintenance recommendations based on OBD data
obdDataSchema.methods.getMaintenanceRecommendations = function() {
  const recommendations = [];
  
  // Check diagnostic codes
  if (this.diagnosticCodes && this.diagnosticCodes.length > 0) {
    const activeCodes = this.diagnosticCodes.filter(code => 
      code.status === 'active' || code.status === 'permanent'
    );
    
    // Map common OBD codes to maintenance recommendations
    activeCodes.forEach(code => {
      // This would be a more comprehensive mapping in production
      if (code.code.startsWith('P0')) {
        if (code.code.startsWith('P00')) {
          recommendations.push({
            type: 'fuel_system',
            title: 'Fuel System Service',
            description: `Check fuel system components based on code ${code.code}`,
            urgency: code.severity || 'medium'
          });
        } else if (code.code.startsWith('P01')) {
          recommendations.push({
            type: 'air_fuel_ratio',
            title: 'Air-Fuel Mixture Service',
            description: `Check air-fuel ratio components based on code ${code.code}`,
            urgency: code.severity || 'medium'
          });
        } else if (code.code.startsWith('P03')) {
          recommendations.push({
            type: 'ignition_system',
            title: 'Ignition System Service',
            description: `Check ignition system components based on code ${code.code}`,
            urgency: code.severity || 'medium'
          });
        } else if (code.code.startsWith('P04')) {
          recommendations.push({
            type: 'auxiliary_emissions',
            title: 'Emissions System Service',
            description: `Check auxiliary emissions controls based on code ${code.code}`,
            urgency: code.severity || 'medium'
          });
        }
      }
    });
  }
  
  // Check engine temperature
  if (this.engineData && this.engineData.temperature > 230) {
    recommendations.push({
      type: 'cooling_system',
      title: 'Cooling System Service',
      description: 'Engine temperature is higher than normal, check cooling system',
      urgency: this.engineData.temperature > 245 ? 'critical' : 'high'
    });
  }
  
  // Check battery voltage
  if (this.batteryData && this.batteryData.voltage < 12.0) {
    recommendations.push({
      type: 'electrical_system',
      title: 'Electrical System Service',
      description: 'Battery voltage is low, check charging system and battery',
      urgency: this.batteryData.voltage < 11.0 ? 'high' : 'medium'
    });
  }
  
  // Check tire pressure
  if (this.tireData && this.tireData.length > 0) {
    const lowPressureTires = this.tireData.filter(tire => tire.pressure && tire.pressure < 28);
    const highPressureTires = this.tireData.filter(tire => tire.pressure && tire.pressure > 38);
    
    if (lowPressureTires.length > 0) {
      recommendations.push({
        type: 'tire_pressure',
        title: 'Tire Pressure Service',
        description: `Low tire pressure detected in ${lowPressureTires.length} tire(s)`,
        urgency: 'medium'
      });
    }
    
    if (highPressureTires.length > 0) {
      recommendations.push({
        type: 'tire_pressure',
        title: 'Tire Pressure Service',
        description: `High tire pressure detected in ${highPressureTires.length} tire(s)`,
        urgency: 'medium'
      });
    }
  }
  
  return recommendations;
};

const ObdData = mongoose.model('ObdData', obdDataSchema);

module.exports = ObdData;
