const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const photoSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['exterior', 'interior', 'document', 'other'],
    default: 'exterior'
  },
  description: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const mileageEntrySchema = new Schema({
  value: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  source: {
    type: String,
    enum: ['manual', 'obd', 'service'],
    default: 'manual'
  }
});

const insuranceDocumentSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['policy', 'card', 'claim', 'other'],
    default: 'policy'
  },
  description: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const vehicleSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vin: {
    type: String,
    trim: true
  },
  make: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    trim: true
  },
  nickname: {
    type: String,
    trim: true
  },
  licensePlate: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['sedan', 'suv', 'truck', 'van', 'motorcycle', 'other'],
    default: 'sedan'
  },
  category: {
    type: String,
    enum: ['personal', 'business', 'family'],
    default: 'personal'
  },
  fuelType: {
    type: String,
    enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'plugin_hybrid', 'other'],
    default: 'gasoline'
  },
  transmission: {
    type: String,
    enum: ['automatic', 'manual', 'cvt', 'other'],
    default: 'automatic'
  },
  engineSize: String,
  photos: [photoSchema],
  mileage: {
    current: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['miles', 'kilometers'],
      default: 'miles'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    history: [mileageEntrySchema]
  },
  insurance: {
    provider: String,
    policyNumber: String,
    coverageType: String,
    startDate: Date,
    endDate: Date,
    contact: {
      name: String,
      phone: String,
      email: String
    },
    documents: [insuranceDocumentSchema]
  },
  specifications: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    fuelCapacity: Number,
    fuelEfficiency: {
      city: Number,
      highway: Number,
      combined: Number,
      unit: {
        type: String,
        enum: ['mpg', 'kml'],
        default: 'mpg'
      }
    },
    tirePressure: {
      front: Number,
      rear: Number,
      unit: {
        type: String,
        enum: ['psi', 'bar', 'kpa'],
        default: 'psi'
      }
    },
    oilType: String,
    batteryType: String
  },
  obd: {
    deviceId: String,
    deviceModel: String,
    connected: {
      type: Boolean,
      default: false
    },
    lastConnected: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  blockchainId: String
}, {
  timestamps: true
});

// Virtual for vehicle's full name
vehicleSchema.virtual('fullName').get(function() {
  return `${this.year} ${this.make} ${this.model}${this.nickname ? ` (${this.nickname})` : ''}`;
});

// Index for faster queries
vehicleSchema.index({ userId: 1 });
vehicleSchema.index({ vin: 1 });

// Method to add mileage entry
vehicleSchema.methods.addMileageEntry = function(value, source = 'manual') {
  const entry = {
    value,
    date: new Date(),
    source
  };
  
  this.mileage.history.push(entry);
  this.mileage.current = value;
  this.mileage.lastUpdated = new Date();
  
  return this.save();
};

// Method to check if maintenance is due based on mileage
vehicleSchema.methods.isMaintenanceDue = function(maintenanceType) {
  // This would be a more complex implementation with actual maintenance schedules
  // Just a simplified example
  const currentMileage = this.mileage.current;
  
  const maintenanceSchedules = {
    oil_change: 5000,
    tire_rotation: 7500,
    brake_inspection: 12000
  };
  
  // Get the last maintenance record of this type
  // This would need to query the MaintenanceRecord collection
  
  // For now, just return a placeholder
  return {
    isDue: true,
    milesOverdue: 1500,
    nextDue: currentMileage + maintenanceSchedules[maintenanceType] || 0
  };
};

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
