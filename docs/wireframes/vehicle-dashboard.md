# GariLink Vehicle Dashboard

## Wireframes for Vehicle Dashboard and Maintenance Tracking

### 1. Main Dashboard
```
┌────────────────────────────────────────┐
│                                        │
│  GariLink                  🔔  👤     │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ [Vehicle Selector Dropdown]    │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │                                │    │
│  │     [Current Vehicle Image]    │    │
│  │                                │    │
│  │   2022 Toyota Camry (My Ride)  │    │
│  │                                │    │
│  └────────────────────────────────┘    │
│                                        │
│  Vehicle Health                        │
│  ┌────────────────────────────────┐    │
│  │ ███████░░░  85%                │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │         │ │         │ │         │   │
│  │ 25,482  │ │  Oct 5  │ │  $345   │   │
│  │ Mileage │ │Last Serv│ │Next Serv│   │
│  │         │ │         │ │Estimate │   │
│  └─────────┘ └─────────┘ └─────────┘   │
│                                        │
│  Alerts & Notifications (2)            │
│  ┌────────────────────────────────┐    │
│  │ ⚠️ Oil change needed in ~300   │    │
│  │   miles                        │    │
│  └────────────────────────────────┘    │
│  ┌────────────────────────────────┐    │
│  │ 🔧 Tire rotation recommended   │    │
│  │   based on driving patterns    │    │
│  └────────────────────────────────┘    │
│                                        │
│  [ Home ]  [Maintain]  [Track]  [More] │
└────────────────────────────────────────┘
```

### 2. Vehicle Details Screen
```
┌────────────────────────────────────────┐
│                                        │
│  ← Back     Vehicle Details            │
│                                        │
│  ┌────────────────────────────────┐    │
│  │                                │    │
│  │     [Vehicle Image Gallery]    │    │
│  │          [Swipeable]           │    │
│  │                                │    │
│  └────────────────────────────────┘    │
│                                        │
│  2022 Toyota Camry XSE                 │
│  Nickname: My Ride                     │
│  VIN: 1HGCM82633A123456                │
│                                        │
│  ┌──────────────┐ ┌──────────────┐     │
│  │              │ │              │     │
│  │ Edit Details │ │ Share        │     │
│  │              │ │              │     │
│  └──────────────┘ └──────────────┘     │
│                                        │
│  Vehicle Information                   │
│  License Plate: ABC-1234               │
│  Color: Pearl White                    │
│  Type: Sedan                           │
│  Category: Personal                    │
│  Current Mileage: 25,482 mi            │
│  Last Updated: Today at 2:30 PM        │
│                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │          │ │          │ │          ││
│  │ Update   │ │ Service  │ │ OBD-II   ││
│  │ Mileage  │ │ History  │ │ Connect  ││
│  │          │ │          │ │          ││
│  └──────────┘ └──────────┘ └──────────┘│
│                                        │
│  [ Home ]  [Maintain]  [Track]  [More] │
└────────────────────────────────────────┘
```

### 3. Maintenance Dashboard
```
┌────────────────────────────────────────┐
│                                        │
│  GariLink                  🔔  👤     │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ 2022 Toyota Camry (My Ride)    ▼    │
│  └────────────────────────────────┘    │
│                                        │
│  Maintenance Dashboard                 │
│                                        │
│  Upcoming Maintenance                  │
│  ┌────────────────────────────────┐    │
│  │ ⚠️ Oil Change                   │    │
│  │ Due in: 300 miles or 15 days   │    │
│  │ Est. Cost: $45-65              │    │
│  │ [Schedule Service] [Remind Me] │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ 🔧 Tire Rotation               │    │
│  │ Due in: 1,200 miles            │    │
│  │ Est. Cost: $25-40              │    │
│  │ [Schedule Service] [Remind Me] │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ 🔍 60,000-Mile Service         │    │
│  │ Due in: 4,518 miles            │    │
│  │ Est. Cost: $350-450            │    │
│  │ [Details]      [Remind Me]     │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌──────────────┐ ┌──────────────┐     │
│  │              │ │              │     │
│  │ Add Service  │ │ View History │     │
│  │              │ │              │     │
│  └──────────────┘ └──────────────┘     │
│                                        │
│  [ Home ]  [Maintain]  [Track]  [More] │
└────────────────────────────────────────┘
```

### 4. Service History Screen
```
┌────────────────────────────────────────┐
│                                        │
│  ← Back     Service History            │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ 2022 Toyota Camry (My Ride)    ▼    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────┐ ┌────────────┐         │
│  │            │ │            │         │
│  │ All        │ │ Filter     │         │
│  │            │ │            │         │
│  └────────────┘ └────────────┘         │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ 🔧 Oil Change & Filter         │    │
│  │ October 5, 2024                │    │
│  │ Mileage: 24,350                │    │
│  │ Cost: $65.99                   │    │
│  │ Location: QuickLube Express    │    │
│  │ [Receipt] [Details] [Share]    │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ 🔧 Tire Rotation & Balance     │    │
│  │ August 12, 2024                │    │
│  │ Mileage: 22,815                │    │
│  │ Cost: $45.00                   │    │
│  │ Location: Discount Tire        │    │
│  │ [Receipt] [Details] [Share]    │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ 🔧 Brake Pad Replacement       │    │
│  │ July 3, 2024                   │    │
│  │ Mileage: 21,450                │    │
│  │ Cost: $325.75                  │    │
│  │ Location: Toyota of Smithville │    │
│  │ [Receipt] [Details] [Share]    │    │
│  └────────────────────────────────┘    │
│                                        │
│  [ Home ]  [Maintain]  [Track]  [More] │
└────────────────────────────────────────┘
```

### 5. Add Service Record Screen
```
┌────────────────────────────────────────┐
│                                        │
│  ← Back     Add Service Record         │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ 2022 Toyota Camry (My Ride)    ▼    │
│  └────────────────────────────────┘    │
│                                        │
│  Service Type:                         │
│  ┌────────────────────────────────┐    │
│  │ Oil Change                     ▼    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Service Title                  │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Service Date         📅        │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Odometer Reading (miles)       │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Cost ($)                       │    │
│  └────────────────────────────────┘    │
│                                        │
│  Service Provider:                     │
│  ┌────────────────────────────────┐    │
│  │ Select or enter provider name  ▼    │
│  └────────────────────────────────┘    │
│                                        │
│  Add Documents:                        │
│  ┌────────────────────────────────┐    │
│  │ Upload Receipt or Photo  📷    │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌─────────────┐ ┌─────────────────┐   │
│  │             │ │                 │   │
│  │  Cancel     │ │  Save Record    │   │
│  │             │ │                 │   │
│  └─────────────┘ └─────────────────┘   │
│                                        │
└────────────────────────────────────────┘
```

### 6. Service Details Screen
```
┌────────────────────────────────────────┐
│                                        │
│  ← Back     Service Details            │
│                                        │
│  Oil Change & Filter                   │
│  October 5, 2024                       │
│                                        │
│  ┌────────────────────────────────┐    │
│  │                                │    │
│  │    [Receipt Image Thumbnail]   │    │
│  │                                │    │
│  └────────────────────────────────┘    │
│                                        │
│  Service Information:                  │
│  Vehicle: 2022 Toyota Camry            │
│  Mileage: 24,350 miles                 │
│  Service Date: 10/05/2024              │
│  Cost: $65.99                          │
│                                        │
│  Service Provider:                     │
│  QuickLube Express                     │
│  123 Main Street, Anytown, CA          │
│  (555) 555-1234                        │
│  Rating: ★★★★☆ (4.2)                  │
│                                        │
│  Parts & Details:                      │
│  - Full Synthetic Oil (5W-30)          │
│  - OEM Oil Filter                      │
│  - Multi-point inspection              │
│                                        │
│  Notes:                                │
│  Technician recommended checking       │
│  brake pads in next 5,000 miles.       │
│                                        │
│  ┌────────────┐ ┌────────────┐         │
│  │            │ │            │         │
│  │  Edit      │ │  Share     │         │
│  │            │ │            │         │
│  └────────────┘ └────────────┘         │
│                                        │
│  [ Home ]  [Maintain]  [Track]  [More] │
└────────────────────────────────────────┘
```

### 7. Predictive Maintenance Screen
```
┌────────────────────────────────────────┐
│                                        │
│  ← Back     Predictive Insights        │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ 2022 Toyota Camry (My Ride)    ▼    │
│  └────────────────────────────────┘    │
│                                        │
│  AI Maintenance Predictions            │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ ⚠️ Battery Performance Decline │    │
│  │ Confidence: 83%                │    │
│  │ Predicted Failure: 3-5 weeks   │    │
│  │ Est. Replacement Cost: $180-250│    │
│  │ [Details] [Schedule] [Dismiss] │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ 🔍 Brake Pad Wear (Front)      │    │
│  │ Confidence: 92%                │    │
│  │ Remaining Life: ~2,500 miles   │    │
│  │ Est. Replacement Cost: $250-350│    │
│  │ [Details] [Schedule] [Dismiss] │    │
│  └────────────────────────────────┘    │
│                                        │
│  Maintenance Cost Projections          │
│  ┌────────────────────────────────┐    │
│  │                                │    │
│  │  [Cost Projection Graph]       │    │
│  │  Next 6 months: $550-750       │    │
│  │                                │    │
│  └────────────────────────────────┘    │
│                                        │
│  Based on your driving patterns and    │
│  vehicle condition, we predict these   │
│  maintenance needs. Schedule service   │
│  early to avoid higher costs.          │
│                                        │
│  [ Home ]  [Maintain]  [Track]  [More] │
└────────────────────────────────────────┘
```

### 8. OBD-II Data Dashboard
```
┌────────────────────────────────────────┐
│                                        │
│  ← Back     Vehicle Diagnostics        │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ 2022 Toyota Camry (My Ride)    ▼    │
│  └────────────────────────────────┘    │
│                                        │
│  OBD-II Connection: Connected ✓        │
│  Last Updated: 2 minutes ago           │
│                                        │
│  Current Diagnostics:                  │
│  ┌───────────────┐ ┌───────────────┐   │
│  │ Engine        │ │ Fuel System   │   │
│  │ Status: OK    │ │ Status: OK    │   │
│  │ Temp: 194°F   │ │ Level: 65%    │   │
│  └───────────────┘ └───────────────┘   │
│                                        │
│  ┌───────────────┐ ┌───────────────┐   │
│  │ Battery       │ │ Emission      │   │
│  │ Status: Warn  │ │ Status: OK    │   │
│  │ Voltage: 12.2V│ │ Sensors: Pass │   │
│  └───────────────┘ └───────────────┘   │
│                                        │
│  Diagnostic Trouble Codes:             │
│  ┌────────────────────────────────┐    │
│  │ P0456 - EVAP System Leak       │    │
│  │ Severity: Low                  │    │
│  │ Description: Small leak in     │    │
│  │ evaporative emission system    │    │
│  │ [More Info] [Find Service]     │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────┐ ┌────────────────┐ │
│  │                │ │                │ │
│  │ Scan Vehicle   │ │ View History   │ │
│  │                │ │                │ │
│  └────────────────┘ └────────────────┘ │
│                                        │
│  [ Home ]  [Maintain]  [Track]  [More] │
└────────────────────────────────────────┘
```
