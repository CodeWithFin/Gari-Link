# GariLink Onboarding Flow

## Wireframes for User Onboarding

### 1. Welcome Screen
```
┌────────────────────────────────────────┐
│                                        │
│               [GariLink]               │
│               Logo Image               │
│                                        │
│                                        │
│    AI-powered car management system    │
│                                        │
│                                        │
│       ┌────────────────────────┐       │
│       │        Get Started     │       │
│       └────────────────────────┘       │
│                                        │
│       ┌────────────────────────┐       │
│       │     I already have     │       │
│       │       an account       │       │
│       └────────────────────────┘       │
│                                        │
│                                        │
└────────────────────────────────────────┘
```

### 2. Sign Up Screen
```
┌────────────────────────────────────────┐
│                                        │
│  ← Back           Create Account       │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ First Name                     │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Last Name                      │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Email                          │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Password                       │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Confirm Password               │    │
│  └────────────────────────────────┘    │
│                                        │
│  ☐ I agree to the Terms of Service     │
│    and Privacy Policy                  │
│                                        │
│       ┌────────────────────────┐       │
│       │     Create Account     │       │
│       └────────────────────────┘       │
│                                        │
│  Already have an account? Sign In      │
│                                        │
└────────────────────────────────────────┘
```

### 3. MFA Setup Screen
```
┌────────────────────────────────────────┐
│                                        │
│  ← Back        Security Verification   │
│                                        │
│  Protect your account with two-factor  │
│  authentication                        │
│                                        │
│  Choose your verification method:      │
│                                        │
│  ○ Authenticator App (Recommended)     │
│    Use Google Authenticator or similar │
│                                        │
│  ○ SMS Authentication                  │
│    Receive codes via text message      │
│                                        │
│  ○ Email Authentication               │
│    Receive codes via email             │
│                                        │
│                                        │
│       ┌────────────────────────┐       │
│       │         Continue       │       │
│       └────────────────────────┘       │
│                                        │
│       ┌────────────────────────┐       │
│       │       Skip for now     │       │
│       └────────────────────────┘       │
│                                        │
└────────────────────────────────────────┘
```

### 4. MFA Setup - Authenticator App
```
┌────────────────────────────────────────┐
│                                        │
│  ← Back        Authenticator Setup     │
│                                        │
│                                        │
│        ┌──────────────────┐            │
│        │                  │            │
│        │       QR         │            │
│        │      CODE        │            │
│        │                  │            │
│        └──────────────────┘            │
│                                        │
│  1. Open your authenticator app        │
│  2. Scan this QR code                  │
│  3. Enter the 6-digit code below       │
│                                        │
│  Your secret key: ABCDEF123456         │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Enter 6-digit code             │    │
│  └────────────────────────────────┘    │
│                                        │
│       ┌────────────────────────┐       │
│       │         Verify         │       │
│       └────────────────────────┘       │
│                                        │
└────────────────────────────────────────┘
```

### 5. Add Vehicle Screen
```
┌────────────────────────────────────────┐
│                                        │
│  ← Back           Add Your Vehicle     │
│                                        │
│  Add your first vehicle to get started │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Vehicle Nickname (optional)    │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Vehicle VIN                    │    │
│  └────────────────────────────────┘    │
│                                        │
│       ┌────────────────────────┐       │
│       │       Scan VIN         │       │
│       └────────────────────────┘       │
│                                        │
│  - OR -                                │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Year                           │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Make                           │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Model                          │    │
│  └────────────────────────────────┘    │
│                                        │
│       ┌────────────────────────┐       │
│       │      Add Vehicle       │       │
│       └────────────────────────┘       │
│                                        │
└────────────────────────────────────────┘
```

### 6. Vehicle Details Screen
```
┌────────────────────────────────────────┐
│                                        │
│  ← Back       Vehicle Information      │
│                                        │
│  Please add more details:              │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Current Mileage                │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ License Plate (optional)       │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Color                          │    │
│  └────────────────────────────────┘    │
│                                        │
│  Vehicle Type:                         │
│  ○ Sedan  ○ SUV  ○ Truck  ○ Van       │
│  ○ Motorcycle  ○ Other                │
│                                        │
│  Vehicle Category:                     │
│  ○ Personal  ○ Business  ○ Family     │
│                                        │
│  Add vehicle photo:                    │
│       ┌────────────────────────┐       │
│       │   Take Photo / Upload   │       │
│       └────────────────────────┘       │
│                                        │
│       ┌────────────────────────┐       │
│       │         Continue       │       │
│       └────────────────────────┘       │
│                                        │
└────────────────────────────────────────┘
```

### 7. OBD-II Connection Screen (Optional)
```
┌────────────────────────────────────────┐
│                                        │
│  ← Back          Connect OBD-II        │
│                                        │
│  Get real-time diagnostics by          │
│  connecting an OBD-II device           │
│                                        │
│        ┌──────────────────┐            │
│        │                  │            │
│        │   OBD-II Device  │            │
│        │   Illustration   │            │
│        │                  │            │
│        └──────────────────┘            │
│                                        │
│  1. Plug the OBD-II device into your   │
│     vehicle's OBD port                 │
│  2. Turn on your vehicle               │
│  3. Tap "Connect" to pair device       │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Device ID (if known)           │    │
│  └────────────────────────────────┘    │
│                                        │
│       ┌────────────────────────┐       │
│       │        Connect         │       │
│       └────────────────────────┘       │
│                                        │
│       ┌────────────────────────┐       │
│       │       Skip for now     │       │
│       └────────────────────────┘       │
│                                        │
└────────────────────────────────────────┘
```

### 8. Onboarding Complete Screen
```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│           ✓                           │
│          [SUCCESS ICON]                │
│                                        │
│           You're all set!              │
│                                        │
│  Your vehicle has been added to        │
│  GariLink. You're ready to experience  │
│  intelligent car management.           │
│                                        │
│  What's next:                          │
│  • View predictive maintenance alerts  │
│  • Track service history               │
│  • Monitor vehicle health              │
│  • Connect with trusted service        │
│    providers                           │
│                                        │
│                                        │
│       ┌────────────────────────┐       │
│       │   Go to Dashboard      │       │
│       └────────────────────────┘       │
│                                        │
│                                        │
└────────────────────────────────────────┘
```
