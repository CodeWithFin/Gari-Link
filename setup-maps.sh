#!/bin/bash

# Setup script for Google Maps in Gari-Link app
echo "===== Gari-Link Maps Setup ====="
echo "This script will help you set up Google Maps for your app."

# Check if the app directory exists
if [ ! -d "./app" ]; then
  echo "Error: app directory not found. Please run this script from the project root."
  exit 1
fi

# Check for required dependencies
echo "Checking dependencies..."
cd app

# Install react-native-maps if not already installed
if ! grep -q "\"react-native-maps\"" package.json; then
  echo "Installing react-native-maps..."
  npm install react-native-maps --save
else
  echo "react-native-maps is already installed."
fi

# Prompt for API keys
echo ""
echo "You need to configure Google Maps API keys for the app."
echo "Please get your API keys from the Google Cloud Console."
echo ""
echo "For instructions, see MAPS_SETUP.md"
echo ""

read -p "Enter your iOS Google Maps API key (or press Enter to skip): " ios_key
read -p "Enter your Android Google Maps API key (or press Enter to skip): " android_key

# Update app.json with the API keys
if [ -n "$ios_key" ] || [ -n "$android_key" ]; then
  echo "Updating app.json with your API keys..."
  
  # Create a temporary file to work with
  temp_file=$(mktemp)
  
  # Read each line of app.json and modify as needed
  while IFS= read -r line; do
    # Replace iOS API key
    if [ -n "$ios_key" ] && [[ $line == *"\"googleMapsApiKey\":"* ]]; then
      echo "        \"googleMapsApiKey\": \"$ios_key\"," >> "$temp_file"
    # Replace Android API key
    elif [ -n "$android_key" ] && [[ $line == *"\"apiKey\":"* ]]; then
      echo "          \"apiKey\": \"$android_key\"" >> "$temp_file"
    else
      echo "$line" >> "$temp_file"
    fi
  done < app.json
  
  # Replace the original file with the modified one
  mv "$temp_file" app.json
  
  echo "API keys updated successfully!"
else
  echo "No API keys provided. You'll need to manually update app.json."
fi

# Clean and rebuild
echo ""
echo "Would you like to clean and rebuild the app now? (y/n)"
read -p "> " rebuild

if [ "$rebuild" = "y" ] || [ "$rebuild" = "Y" ]; then
  echo "Cleaning and rebuilding the app..."
  npx expo prebuild --clean
  echo "Rebuild completed. You can now run the app with:"
  echo "  npx expo run:ios     # For iOS"
  echo "  npx expo run:android # For Android"
else
  echo "When you're ready to build, run:"
  echo "  npx expo prebuild --clean"
  echo "  npx expo run:ios     # For iOS"
  echo "  npx expo run:android # For Android"
fi

echo ""
echo "Setup complete! Refer to MAPS_SETUP.md for troubleshooting if needed."
