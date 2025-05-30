# GariLink App

## Overview
GariLink is a comprehensive automotive companion app designed specifically for Nairobi's unique driving environment. The app connects car owners with trusted local automotive services while building a community around shared vehicle experiences and local expertise.

## Features
- Vehicle maintenance tracking
- Service provider directory with reviews
- Interactive maps for finding nearby services
- Community forums and discussions
- User profiles and preferences

## Setup

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- iOS/Android development environment

### Installation
1. Clone this repository
2. Navigate to the app directory: `cd app`
3. Install dependencies: `npm install` or `yarn install`
4. Start the development server: `npm start` or `yarn start`

### Google Maps Setup
This app uses Google Maps for location services. To properly configure maps:

1. Run the setup script from the project root:
   ```bash
   ./setup-maps.sh
   ```

2. Or follow the manual setup in `app/MAPS_SETUP.md`

3. Make sure to add your Google Maps API keys to `app/app.json`

## Development
- The app is built with React Native and Expo
- TypeScript is used for type safety
- File structure follows a feature-based organization

## Troubleshooting
If you encounter the error "RNMapsAirModule could not be found":
1. Make sure you've configured Google Maps API keys in app.json
2. Run the setup script to install and configure maps properly
3. Rebuild the app with `npx expo prebuild --clean`

## License
This project is licensed under the MIT License - see the LICENSE file for details.
