# GariLink Database Schema

## User Schema
```json
{
  "_id": "ObjectId",
  "email": "String, required, unique",
  "password": "String, hashed, required",
  "firstName": "String, required",
  "lastName": "String, required",
  "phoneNumber": "String, optional",
  "profilePhoto": "String, URL, optional",
  "role": "String, enum: ['user', 'admin', 'service_provider'], default: 'user'",
  "authMethod": "String, enum: ['local', 'google', 'apple'], default: 'local'",
  "authProviderId": "String, optional",
  "mfaEnabled": "Boolean, default: false",
  "mfaMethod": "String, enum: ['app', 'sms', 'email'], optional",
  "mfaSecret": "String, encrypted, optional",
  "lastLogin": "Date, optional",
  "loginAttempts": "Number, default: 0",
  "lockUntil": "Date, optional",
  "passwordResetToken": "String, optional",
  "passwordResetExpires": "Date, optional",
  "emailVerified": "Boolean, default: false",
  "emailVerificationToken": "String, optional",
  "emailVerificationExpires": "Date, optional",
  "preferences": {
    "notifications": {
      "email": "Boolean, default: true",
      "push": "Boolean, default: true",
      "sms": "Boolean, default: false"
    },
    "theme": "String, enum: ['light', 'dark', 'system'], default: 'system'",
    "language": "String, default: 'en'",
    "units": "String, enum: ['metric', 'imperial'], default: 'imperial'"
  },
  "createdAt": "Date, default: Date.now",
  "updatedAt": "Date, default: Date.now"
}
```

## Vehicle Schema
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId, ref: 'User', required",
  "vin": "String, optional",
  "make": "String, required",
  "model": "String, required",
  "year": "Number, required",
  "color": "String, optional",
  "nickname": "String, optional",
  "licensePlate": "String, optional",
  "type": "String, enum: ['sedan', 'suv', 'truck', 'van', 'motorcycle', 'other'], default: 'sedan'",
  "category": "String, enum: ['personal', 'business', 'family'], default: 'personal'",
  "fuelType": "String, enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'plugin_hybrid', 'other'], default: 'gasoline'",
  "transmission": "String, enum: ['automatic', 'manual', 'cvt', 'other'], default: 'automatic'",
  "engineSize": "String, optional",
  "photos": [
    {
      "url": "String, required",
      "type": "String, enum: ['exterior', 'interior', 'document', 'other'], default: 'exterior'",
      "description": "String, optional",
      "uploadedAt": "Date, default: Date.now"
    }
  ],
  "mileage": {
    "current": "Number, required",
    "unit": "String, enum: ['miles', 'kilometers'], default: 'miles'",
    "lastUpdated": "Date, default: Date.now",
    "history": [
      {
        "value": "Number, required",
        "date": "Date, required",
        "source": "String, enum: ['manual', 'obd', 'service'], default: 'manual'"
      }
    ]
  },
  "insurance": {
    "provider": "String, optional",
    "policyNumber": "String, optional",
    "coverageType": "String, optional",
    "startDate": "Date, optional",
    "endDate": "Date, optional",
    "contact": {
      "name": "String, optional",
      "phone": "String, optional",
      "email": "String, optional"
    },
    "documents": [
      {
        "url": "String, required",
        "type": "String, enum: ['policy', 'card', 'claim', 'other'], default: 'policy'",
        "description": "String, optional",
        "uploadedAt": "Date, default: Date.now"
      }
    ]
  },
  "specifications": {
    "weight": "Number, optional",
    "dimensions": {
      "length": "Number, optional",
      "width": "Number, optional",
      "height": "Number, optional"
    },
    "fuelCapacity": "Number, optional",
    "fuelEfficiency": {
      "city": "Number, optional",
      "highway": "Number, optional",
      "combined": "Number, optional",
      "unit": "String, enum: ['mpg', 'kml'], default: 'mpg'"
    },
    "tirePressure": {
      "front": "Number, optional",
      "rear": "Number, optional",
      "unit": "String, enum: ['psi', 'bar', 'kpa'], default: 'psi'"
    },
    "oilType": "String, optional",
    "batteryType": "String, optional"
  },
  "obd": {
    "deviceId": "String, optional",
    "deviceModel": "String, optional",
    "connected": "Boolean, default: false",
    "lastConnected": "Date, optional"
  },
  "createdAt": "Date, default: Date.now",
  "updatedAt": "Date, default: Date.now",
  "isActive": "Boolean, default: true",
  "blockchainId": "String, optional"
}
```

## Maintenance Record Schema
```json
{
  "_id": "ObjectId",
  "vehicleId": "ObjectId, ref: 'Vehicle', required",
  "userId": "ObjectId, ref: 'User', required",
  "type": "String, enum: ['oil_change', 'tire_rotation', 'brake_service', 'inspection', 'repair', 'other'], required",
  "title": "String, required",
  "description": "String, optional",
  "mileage": "Number, required",
  "date": "Date, required",
  "cost": {
    "amount": "Number, required",
    "currency": "String, default: 'USD'"
  },
  "serviceProvider": {
    "name": "String, optional",
    "location": "String, optional",
    "contact": {
      "phone": "String, optional",
      "email": "String, optional",
      "website": "String, optional"
    },
    "serviceProviderId": "ObjectId, ref: 'ServiceProvider', optional"
  },
  "parts": [
    {
      "name": "String, required",
      "partNumber": "String, optional",
      "quantity": "Number, default: 1",
      "cost": "Number, optional",
      "warranty": {
        "duration": "Number, optional",
        "unit": "String, enum: ['days', 'months', 'years', 'miles', 'kilometers'], optional",
        "expiryDate": "Date, optional"
      }
    }
  ],
  "receipts": [
    {
      "url": "String, required",
      "description": "String, optional",
      "uploadedAt": "Date, default: Date.now",
      "extractedData": {
        "vendor": "String, optional",
        "date": "Date, optional",
        "total": "Number, optional",
        "items": ["String, optional"]
      }
    }
  ],
  "documents": [
    {
      "url": "String, required",
      "type": "String, enum: ['invoice', 'warranty', 'report', 'other'], default: 'invoice'",
      "description": "String, optional",
      "uploadedAt": "Date, default: Date.now"
    }
  ],
  "reminder": {
    "enabled": "Boolean, default: false",
    "dueDate": "Date, optional",
    "dueMileage": "Number, optional",
    "frequency": {
      "value": "Number, optional",
      "unit": "String, enum: ['days', 'months', 'years', 'miles', 'kilometers'], optional"
    },
    "notificationType": "String, enum: ['email', 'push', 'sms', 'all'], default: 'push'",
    "notificationSent": "Boolean, default: false",
    "notificationDate": "Date, optional"
  },
  "status": "String, enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], default: 'completed'",
  "warranty": {
    "covered": "Boolean, default: false",
    "provider": "String, optional",
    "claimNumber": "String, optional",
    "expiryDate": "Date, optional"
  },
  "tags": ["String, optional"],
  "notes": "String, optional",
  "createdAt": "Date, default: Date.now",
  "updatedAt": "Date, default: Date.now",
  "verified": "Boolean, default: false",
  "blockchainId": "String, optional",
  "blockchainTransaction": "String, optional"
}
```

## Predictive Maintenance Schema
```json
{
  "_id": "ObjectId",
  "vehicleId": "ObjectId, ref: 'Vehicle', required",
  "userId": "ObjectId, ref: 'User', required",
  "predictionType": "String, enum: ['component_failure', 'maintenance_due', 'performance_issue'], required",
  "component": "String, required",
  "confidence": "Number, min: 0, max: 1, required",
  "severity": "String, enum: ['low', 'medium', 'high', 'critical'], required",
  "details": "String, required",
  "predictedFailureDate": "Date, optional",
  "predictedMileage": "Number, optional",
  "estimatedCost": {
    "min": "Number, optional",
    "max": "Number, optional",
    "currency": "String, default: 'USD'"
  },
  "recommendedAction": "String, required",
  "dataPoints": [
    {
      "type": "String, required",
      "value": "Mixed, required",
      "timestamp": "Date, required",
      "source": "String, enum: ['obd', 'manual', 'service_history', 'manufacturer'], required"
    }
  ],
  "maintenanceId": "ObjectId, ref: 'MaintenanceRecord', optional",
  "status": "String, enum: ['pending', 'acknowledged', 'scheduled', 'completed', 'dismissed'], default: 'pending'",
  "resolutionDate": "Date, optional",
  "userFeedback": {
    "accurate": "Boolean, optional",
    "comments": "String, optional",
    "providedAt": "Date, optional"
  },
  "notifications": [
    {
      "type": "String, enum: ['email', 'push', 'sms'], required",
      "sentAt": "Date, required",
      "status": "String, enum: ['sent', 'delivered', 'read', 'actioned'], required"
    }
  ],
  "createdAt": "Date, default: Date.now",
  "updatedAt": "Date, default: Date.now"
}
```

## OBD Data Schema
```json
{
  "_id": "ObjectId",
  "vehicleId": "ObjectId, ref: 'Vehicle', required",
  "userId": "ObjectId, ref: 'User', required",
  "timestamp": "Date, required",
  "mileage": "Number, required",
  "location": {
    "latitude": "Number, optional",
    "longitude": "Number, optional",
    "accuracy": "Number, optional"
  },
  "engineData": {
    "rpm": "Number, optional",
    "temperature": "Number, optional",
    "load": "Number, optional",
    "runtime": "Number, optional"
  },
  "fuelData": {
    "level": "Number, optional",
    "consumption": "Number, optional",
    "range": "Number, optional",
    "pressure": "Number, optional"
  },
  "batteryData": {
    "voltage": "Number, optional",
    "current": "Number, optional",
    "temperature": "Number, optional",
    "stateOfCharge": "Number, optional"
  },
  "diagnosticCodes": [
    {
      "code": "String, required",
      "description": "String, optional",
      "severity": "String, enum: ['low', 'medium', 'high', 'critical'], optional",
      "status": "String, enum: ['active', 'pending', 'permanent', 'cleared'], required"
    }
  ],
  "sensorData": {
    "oxygenSensor": "Number, optional",
    "massAirFlow": "Number, optional",
    "intakeAirTemp": "Number, optional",
    "throttlePosition": "Number, optional",
    "barometricPressure": "Number, optional"
  },
  "transmissionData": {
    "fluidTemp": "Number, optional",
    "gearPosition": "String, optional"
  },
  "brakingData": {
    "padWear": "Number, optional",
    "fluidLevel": "Number, optional",
    "pressure": "Number, optional"
  },
  "tireData": [
    {
      "position": "String, enum: ['frontLeft', 'frontRight', 'rearLeft', 'rearRight'], required",
      "pressure": "Number, optional",
      "temperature": "Number, optional",
      "treadDepth": "Number, optional"
    }
  ],
  "emissionsData": {
    "o2": "Number, optional",
    "co2": "Number, optional",
    "nox": "Number, optional",
    "particulates": "Number, optional"
  },
  "trip": {
    "id": "String, optional",
    "startTime": "Date, optional",
    "endTime": "Date, optional",
    "duration": "Number, optional",
    "distance": "Number, optional",
    "avgSpeed": "Number, optional",
    "maxSpeed": "Number, optional",
    "fuelUsed": "Number, optional",
    "energyUsed": "Number, optional"
  },
  "rawData": "Mixed, optional",
  "createdAt": "Date, default: Date.now"
}
```

## Service Provider Schema
```json
{
  "_id": "ObjectId",
  "name": "String, required",
  "type": "String, enum: ['dealer', 'independent', 'chain', 'specialty', 'mobile'], required",
  "specialties": ["String, optional"],
  "address": {
    "street": "String, required",
    "city": "String, required",
    "state": "String, required",
    "zipCode": "String, required",
    "country": "String, required",
    "coordinates": {
      "latitude": "Number, optional",
      "longitude": "Number, optional"
    }
  },
  "contact": {
    "phone": "String, optional",
    "email": "String, optional",
    "website": "String, optional"
  },
  "hours": [
    {
      "day": "String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], required",
      "open": "String, optional",
      "close": "String, optional",
      "closed": "Boolean, default: false"
    }
  ],
  "services": [
    {
      "name": "String, required",
      "description": "String, optional",
      "estimatedDuration": "Number, optional",
      "estimatedCost": {
        "min": "Number, optional",
        "max": "Number, optional",
        "currency": "String, default: 'USD'"
      }
    }
  ],
  "ratings": {
    "average": "Number, min: 0, max: 5, default: 0",
    "count": "Number, default: 0"
  },
  "reviews": [
    {
      "userId": "ObjectId, ref: 'User', required",
      "rating": "Number, min: 1, max: 5, required",
      "title": "String, optional",
      "comment": "String, optional",
      "date": "Date, default: Date.now",
      "serviceType": "String, optional",
      "vehicleId": "ObjectId, ref: 'Vehicle', optional",
      "helpfulCount": "Number, default: 0",
      "verified": "Boolean, default: false"
    }
  ],
  "certifications": ["String, optional"],
  "brands": ["String, optional"],
  "photos": [
    {
      "url": "String, required",
      "type": "String, enum: ['exterior', 'interior', 'logo', 'staff', 'other'], default: 'other'",
      "description": "String, optional",
      "uploadedAt": "Date, default: Date.now"
    }
  ],
  "amenities": ["String, optional"],
  "verified": "Boolean, default: false",
  "partnershipLevel": "String, enum: ['none', 'basic', 'premium', 'exclusive'], default: 'none'",
  "partnerSince": "Date, optional",
  "createdAt": "Date, default: Date.now",
  "updatedAt": "Date, default: Date.now"
}
```

## Blockchain Schema
```json
{
  "_id": "ObjectId",
  "entityType": "String, enum: ['vehicle', 'maintenance', 'user'], required",
  "entityId": "ObjectId, required",
  "blockchainId": "String, required",
  "transactionHash": "String, required",
  "blockNumber": "Number, required",
  "timestamp": "Date, required",
  "status": "String, enum: ['pending', 'confirmed', 'failed'], required",
  "network": "String, required",
  "dataHash": "String, required",
  "metadataUrl": "String, optional",
  "createdAt": "Date, default: Date.now",
  "updatedAt": "Date, default: Date.now"
}
```
