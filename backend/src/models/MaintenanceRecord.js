const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  partNumber: String,
  quantity: {
    type: Number,
    default: 1
  },
  cost: Number,
  warranty: {
    duration: Number,
    unit: {
      type: String,
      enum: ['days', 'months', 'years', 'miles', 'kilometers']
    },
    expiryDate: Date
  }
});

const receiptSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  description: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  extractedData: {
    vendor: String,
    date: Date,
    total: Number,
    items: [String]
  }
});

const documentSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['invoice', 'warranty', 'report', 'other'],
    default: 'invoice'
  },
  description: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const maintenanceRecordSchema = new Schema({
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
  type: {
    type: String,
    enum: ['oil_change', 'tire_rotation', 'brake_service', 'inspection', 'repair', 'other'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  mileage: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  cost: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  serviceProvider: {
    name: String,
    location: String,
    contact: {
      phone: String,
      email: String,
      website: String
    },
    serviceProviderId: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceProvider'
    }
  },
  parts: [partSchema],
  receipts: [receiptSchema],
  documents: [documentSchema],
  reminder: {
    enabled: {
      type: Boolean,
      default: false
    },
    dueDate: Date,
    dueMileage: Number,
    frequency: {
      value: Number,
      unit: {
        type: String,
        enum: ['days', 'months', 'years', 'miles', 'kilometers']
      }
    },
    notificationType: {
      type: String,
      enum: ['email', 'push', 'sms', 'all'],
      default: 'push'
    },
    notificationSent: {
      type: Boolean,
      default: false
    },
    notificationDate: Date
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'completed'
  },
  warranty: {
    covered: {
      type: Boolean,
      default: false
    },
    provider: String,
    claimNumber: String,
    expiryDate: Date
  },
  tags: [String],
  notes: String,
  verified: {
    type: Boolean,
    default: false
  },
  blockchainId: String,
  blockchainTransaction: String
}, {
  timestamps: true
});

// Indexes for faster queries
maintenanceRecordSchema.index({ vehicleId: 1 });
maintenanceRecordSchema.index({ userId: 1 });
maintenanceRecordSchema.index({ date: -1 });
maintenanceRecordSchema.index({ type: 1 });
maintenanceRecordSchema.index({ 'reminder.dueDate': 1 });

// Method to calculate cost savings
maintenanceRecordSchema.methods.calculateCostSavings = function() {
  // This would need to compare against average costs for this type of service
  // Simplified example for demonstration
  const averageCosts = {
    oil_change: 75,
    tire_rotation: 50,
    brake_service: 300,
    inspection: 150,
    repair: 500,
    other: 200
  };
  
  const avgCost = averageCosts[this.type] || 0;
  const actualCost = this.cost.amount;
  
  return avgCost - actualCost;
};

// Method to check if warranty is valid
maintenanceRecordSchema.methods.isWarrantyValid = function() {
  if (!this.warranty.expiryDate) return false;
  return new Date() < this.warranty.expiryDate;
};

// Method to schedule next maintenance
maintenanceRecordSchema.methods.scheduleNextMaintenance = function(interval, unit) {
  const reminder = {
    enabled: true,
    frequency: {
      value: interval,
      unit
    }
  };
  
  if (unit === 'miles' || unit === 'kilometers') {
    reminder.dueMileage = this.mileage + interval;
  } else {
    // Calculate due date based on time interval
    const dueDate = new Date(this.date);
    
    switch (unit) {
      case 'days':
        dueDate.setDate(dueDate.getDate() + interval);
        break;
      case 'months':
        dueDate.setMonth(dueDate.getMonth() + interval);
        break;
      case 'years':
        dueDate.setFullYear(dueDate.getFullYear() + interval);
        break;
    }
    
    reminder.dueDate = dueDate;
  }
  
  this.reminder = reminder;
  return this.save();
};

const MaintenanceRecord = mongoose.model('MaintenanceRecord', maintenanceRecordSchema);

module.exports = MaintenanceRecord;
