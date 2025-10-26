#!/bin/bash

# App Store Submission Script
# Run this in your terminal to submit your app to the App Store

echo "📱 Submitting to App Store..."
echo ""
echo "This will submit your latest EAS build to App Store Connect"
echo ""
read -p "Press Enter to continue..."
eas submit --platform ios

echo ""
echo "✅ App submitted to App Store Connect!"
echo "Check your App Store Connect dashboard to complete the submission process."
