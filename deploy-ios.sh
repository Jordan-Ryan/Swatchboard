#!/bin/bash

# iOS App Store Deployment Script for Collage Maker
# Run this script step by step in your terminal

echo "🚀 Starting iOS App Store Deployment for Collage Maker"
echo "=================================================="

# Step 1: Check if EAS CLI is installed
echo "📋 Step 1: Checking EAS CLI installation..."
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
else
    echo "✅ EAS CLI is installed"
fi

# Step 2: Login to EAS
echo ""
echo "📋 Step 2: Login to EAS"
echo "You'll need to enter your Expo account credentials"
echo "If you don't have an Expo account, create one at https://expo.dev"
echo ""
read -p "Press Enter when you're ready to login..."
eas login

# Step 3: Build for iOS
echo ""
echo "📋 Step 3: Building iOS app for App Store"
echo "This will take 10-15 minutes..."
echo ""
read -p "Press Enter to start the build..."
eas build --platform ios --profile production

echo ""
echo "🎉 Build completed! Check the output above for the download link."
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://appstoreconnect.apple.com"
echo "2. Create a new app with bundle ID: com.jordanryan.collagemaker"
echo "3. Download your .ipa file from the build output"
echo "4. Upload to App Store Connect or run: eas submit --platform ios"
echo ""
echo "Need help? The assistant can guide you through App Store Connect setup!"

