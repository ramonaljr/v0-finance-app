# Mobile App Setup Script for v0 Finance App (PowerShell)
# This script sets up the mobile development environment

Write-Host "🚀 Setting up mobile development environment for v0 Finance App..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

# Install Capacitor dependencies
Write-Host "📦 Installing Capacitor dependencies..." -ForegroundColor Yellow
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

# Install additional plugins
Write-Host "📦 Installing additional Capacitor plugins..." -ForegroundColor Yellow
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
if (-not (Test-Path "capacitor.config.ts")) {
    Write-Host "🔧 Initializing Capacitor..." -ForegroundColor Yellow
    npx cap init "v0 Finance" "com.v0finance.app"
} else {
    Write-Host "✅ Capacitor already initialized" -ForegroundColor Green
}

# Add Android platform
Write-Host "🤖 Adding Android platform..." -ForegroundColor Yellow
npx cap add android

# Add iOS platform (only on macOS - skip on Windows)
Write-Host "⚠️  iOS platform not added (requires macOS)" -ForegroundColor Yellow

# Create necessary directories
Write-Host "📁 Creating necessary directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "public\icons"
New-Item -ItemType Directory -Force -Path "public\screenshots"
New-Item -ItemType Directory -Force -Path "android\app\src\main\res\drawable"
New-Item -ItemType Directory -Force -Path "android\app\src\main\res\mipmap-hdpi"
New-Item -ItemType Directory -Force -Path "android\app\src\main\res\mipmap-mdpi"
New-Item -ItemType Directory -Force -Path "android\app\src\main\res\mipmap-xhdpi"
New-Item -ItemType Directory -Force -Path "android\app\src\main\res\mipmap-xxhdpi"
New-Item -ItemType Directory -Force -Path "android\app\src\main\res\mipmap-xxxhdpi"

Write-Host "✅ Mobile development environment setup complete!" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Create app icons in public\icons\ directory" -ForegroundColor White
Write-Host "2. Build your Next.js app: npm run build" -ForegroundColor White
Write-Host "3. Sync with Capacitor: npx cap sync" -ForegroundColor White
Write-Host "4. Open in Android Studio: npx cap open android" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation: https://capacitorjs.com/docs" -ForegroundColor Cyan
Write-Host "🎯 Roadmap: docs\mobile-deployment-roadmap.md" -ForegroundColor Cyan
