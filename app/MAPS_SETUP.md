# Google Maps Setup for Gari-Link

This document provides instructions for setting up Google Maps integration in the Gari-Link mobile app.

## Getting Google Maps API Keys

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API (if you need geocoding or places search)

### Obtaining API Keys

#### For Android:
1. In the Google Cloud Console, go to "Credentials"
2. Click "Create Credentials" → "API Key"
3. Restrict the key to Android apps:
   - Add your app's package name: `com.garilink.app`
   - Add your app's SHA-1 signing certificate fingerprint

#### For iOS:
1. In the Google Cloud Console, go to "Credentials"
2. Click "Create Credentials" → "API Key"
3. Restrict the key to iOS apps:
   - Add your app's bundle identifier: `com.garilink.app`

## Configuring Your App

Once you have your API keys, update the `app.json` file with the keys:

```json
{
  "expo": {
    // ... other expo config
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.garilink.app",
      "config": {
        "googleMapsApiKey": "YOUR_IOS_API_KEY_HERE"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.garilink.app",
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ANDROID_API_KEY_HERE"
        }
      }
    }
  }
}
```

## Testing Maps Integration

After setting up your API keys:

1. Rebuild your app:
   ```bash
   expo prebuild --clean
   expo run:android   # For Android
   expo run:ios       # For iOS
   ```

2. If you're using the Expo Go app, be aware that maps might not work correctly since custom native code isn't supported in Expo Go. You'll need to build a development build or standalone app.

## Troubleshooting

If you encounter "RNMapsAirModule could not be found" or similar errors:

1. Make sure you've installed all required dependencies:
   ```bash
   npx expo install react-native-maps
   ```

2. If you're using Expo, ensure you're using a development build or standalone app, not Expo Go.

3. Check that your API keys are correctly configured in app.json.

4. If the issue persists, try cleaning your build:
   ```bash
   npx expo prebuild --clean
   ```

## Additional Notes

- Keep your API keys secure and don't commit them to public repositories
- Consider using environment variables for API keys in production
- Set appropriate API key restrictions in the Google Cloud Console
