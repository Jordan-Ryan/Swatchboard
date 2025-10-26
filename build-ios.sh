#!/bin/bash

# EAS Build Setup Script
# Run this in your terminal to build your iOS app

echo "🏗️  Starting EAS Build Setup..."
echo ""
echo "Step 1: Configure EAS Project"
echo "--------------------------------"
eas project:init

echo ""
echo "Step 2: Build iOS App"
echo "--------------------------------"
echo "When prompted:"
echo "  • Would you like EAS to manage your Apple certificates? → YES"
echo "  • Enter your Apple ID email"
echo "  • Enter your Apple ID password"
echo ""
read -p "Press Enter to start the build..."
eas build --platform ios --profile production

echo ""
echo "✅ Build started! Check your Expo dashboard for progress."
echo "📍 Build URL will be shown after configuration"
