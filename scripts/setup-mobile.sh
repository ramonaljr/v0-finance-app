#!/bin/bash

# Mobile App Setup Script for v0 Finance App
# This script sets up the mobile development environment

set -e

echo "🚀 Setting up mobile development environment for v0 Finance App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install Capacitor dependencies
echo "📦 Installing Capacitor dependencies..."
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

# Install additional plugins
echo "📦 Installing additional Capacitor plugins..."
npm install @capacitor/splash-screen
npm install @capacitor/status-bar
npm install @capacitor/keyboard
npm install @capacitor/push-notifications
npm install @capacitor/local-notifications
npm install @capacitor/camera
npm install @capacitor/filesystem
npm install @capacitor/network
npm install @capacitor/device
npm install @capacitor/app

# Initialize Capacitor if not already done
if [ ! -f "capacitor.config.ts" ]; then
    echo "🔧 Initializing Capacitor..."
    npx cap init "v0 Finance" "com.v0finance.app"
else
    echo "✅ Capacitor already initialized"
fi

# Add Android platform
echo "🤖 Adding Android platform..."
npx cap add android

# Add iOS platform (only on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Adding iOS platform..."
    npx cap add ios
else
    echo "⚠️  iOS platform not added (requires macOS)"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p public/icons
mkdir -p public/screenshots
mkdir -p android/app/src/main/res/drawable
mkdir -p android/app/src/main/res/mipmap-hdpi
mkdir -p android/app/src/main/res/mipmap-mdpi
mkdir -p android/app/src/main/res/mipmap-xhdpi
mkdir -p android/app/src/main/res/mipmap-xxhdpi
mkdir -p android/app/src/main/res/mipmap-xxxhdpi

if [[ "$OSTYPE" == "darwin"* ]]; then
    mkdir -p ios/App/App/Assets.xcassets/AppIcon.appiconset
fi

echo "✅ Mobile development environment setup complete!"

echo ""
echo "📋 Next steps:"
echo "1. Create app icons in public/icons/ directory"
echo "2. Build your Next.js app: npm run build"
echo "3. Sync with Capacitor: npx cap sync"
echo "4. Open in IDE:"
echo "   - Android: npx cap open android"
echo "   - iOS: npx cap open ios (macOS only)"
echo ""
echo "📚 Documentation: https://capacitorjs.com/docs"
echo "🎯 Roadmap: docs/mobile-deployment-roadmap.md"
