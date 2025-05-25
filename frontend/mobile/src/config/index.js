// API Configuration
export const API_URL = 'http://localhost:5000/api/v1';

// App Theme Colors
export const COLORS = {
  primary: '#2C6BED',
  secondary: '#31B057',
  warning: '#FFC107',
  danger: '#DC3545',
  success: '#28A745',
  info: '#17A2B8',
  light: '#F8F9FA',
  dark: '#343A40',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6C757D',
  grayLight: '#E9ECEF',
  grayDark: '#495057',
  background: '#F5F5F5',
};

// App Theme Fonts
export const FONTS = {
  regular: 'System',
  medium: 'System-Medium',
  bold: 'System-Bold',
  light: 'System-Light',
};

// App Theme Sizes
export const SIZES = {
  // font sizes
  largeTitle: 24,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  h5: 16,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,

  // app dimensions
  width: '100%',
  height: '100%',

  // spacing
  padding: 16,
  margin: 16,
  radius: 8,
};

// Timeouts and Limits
export const TIMEOUTS = {
  apiRequest: 30000, // 30 seconds
  locationUpdate: 60000, // 1 minute
  tokenRefresh: 3600000, // 1 hour
};

// Feature Flags
export const FEATURES = {
  mfaEnabled: true,
  blockchainEnabled: false,
  predictiveMaintenanceEnabled: true,
  obdIntegrationEnabled: true,
};

// Storage Keys
export const STORAGE_KEYS = {
  user: 'user',
  token: 'authToken',
  theme: 'theme',
  language: 'language',
  onboarded: 'onboarded',
  vehicles: 'vehicles',
  selectedVehicle: 'selectedVehicle',
};
