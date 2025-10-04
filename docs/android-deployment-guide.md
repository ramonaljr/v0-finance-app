# Android Deployment Guide

## Prerequisites

### 1. Development Environment
- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **Android Studio** (latest version)
- **Java Development Kit (JDK)** 11 or higher
- **Android SDK** (API level 22+)

### 2. Accounts Required
- **Google Play Developer Account** ($25 one-time fee)
- **Google Account** for Play Console access

## Step 1: Environment Setup

### 1.1 Install Android Studio
1. Download from [developer.android.com](https://developer.android.com/studio)
2. Install with default settings
3. Open Android Studio and complete setup wizard
4. Install Android SDK (API 34 recommended)

### 1.2 Configure Environment Variables
Add to your system environment variables:
```bash
ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
```

Add to PATH:
```bash
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

### 1.3 Verify Installation
```bash
# Check Android SDK
adb version

# Check Java
java -version

# Check Node.js
node --version
```

## Step 2: Project Setup

### 2.1 Run Setup Script
```powershell
# On Windows
.\scripts\setup-mobile.ps1

# On macOS/Linux
./scripts/setup-mobile.sh
```

### 2.2 Manual Setup (if script fails)
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# Initialize Capacitor
npx cap init "v0 Finance" "com.v0finance.app"

# Add Android platform
npx cap add android
```

## Step 3: Build Configuration

### 3.1 Update capacitor.config.ts
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.v0finance.app',
  appName: 'v0 Finance',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#111111',
    appendUserAgent: 'v0finance-mobile',
  },
};

export default config;
```

### 3.2 Configure Next.js for Static Export
Update `next.config.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // ... existing config
};

export default nextConfig;
```

## Step 4: App Icons and Assets

### 4.1 Create App Icons
Create icons in these sizes:
- 48x48 (mdpi)
- 72x72 (hdpi)
- 96x96 (xhdpi)
- 144x144 (xxhdpi)
- 192x192 (xxxhdpi)

### 4.2 Place Icons
```
public/icons/
├── icon-48x48.png
├── icon-72x72.png
├── icon-96x96.png
├── icon-144x144.png
└── icon-192x192.png
```

### 4.3 Generate Android Icons
```bash
# Use Capacitor to generate icons
npx cap-assets generate --iconBackgroundColor '#111111' --iconBackgroundColorDark '#111111' --splashBackgroundColor '#111111' --splashBackgroundColorDark '#111111'
```

## Step 5: Build Process

### 5.1 Build Web App
```bash
# Build Next.js app
npm run build

# Sync with Capacitor
npx cap sync android
```

### 5.2 Open in Android Studio
```bash
npx cap open android
```

### 5.3 Configure Build Variants
In Android Studio:
1. Go to **Build > Select Build Variant**
2. Choose **debug** for testing
3. Choose **release** for production

### 5.4 Generate Signed APK/AAB
1. Go to **Build > Generate Signed Bundle/APK**
2. Choose **Android App Bundle** (recommended)
3. Create or select keystore
4. Configure signing
5. Build release version

## Step 6: Google Play Console Setup

### 6.1 Create Developer Account
1. Go to [Google Play Console](https://play.google.com/console)
2. Pay $25 registration fee
3. Complete account verification

### 6.2 Create App
1. Click **Create app**
2. Fill in app details:
   - **App name**: v0 Finance
   - **Default language**: English
   - **App or game**: App
   - **Free or paid**: Free
   - **Declarations**: Check all applicable boxes

### 6.3 App Information
```
App name: v0 Finance
Short description: AI-powered personal finance management
Full description: 
Take control of your finances with v0 Finance - the smart way to manage your money. 
Features include:
• AI-powered budgeting and insights
• Transaction tracking and categorization
• Smart financial recommendations
• Offline support
• Secure cloud sync
```

### 6.4 Store Listing
- **App icon**: 512x512 PNG
- **Feature graphic**: 1024x500 PNG
- **Screenshots**: 320-3840px wide, 2:1 aspect ratio
- **Phone screenshots**: 320-3840px wide, 16:9 or 9:16 aspect ratio

### 6.5 Content Rating
Complete content rating questionnaire:
- **Violence**: None
- **Sexual content**: None
- **Profanity**: None
- **Controlled substances**: None
- **Simulated gambling**: None
- **User-generated content**: None

### 6.6 Target Audience
- **Primary target age**: 18+
- **Secondary target age**: 25-34
- **Content guidelines**: Follow all policies

## Step 7: App Signing

### 7.1 Generate Keystore
```bash
# Generate keystore
keytool -genkey -v -keystore v0-finance-key.keystore -alias v0-finance -keyalg RSA -keysize 2048 -validity 10000
```

### 7.2 Configure Signing
In `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('../../v0-finance-key.keystore')
            storePassword 'your-store-password'
            keyAlias 'v0-finance'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## Step 8: Testing

### 8.1 Internal Testing
1. Upload AAB to Play Console
2. Create internal testing track
3. Add testers
4. Test on various devices

### 8.2 Device Testing
Test on:
- **Android 5.1+** (API 22+)
- **Various screen sizes**
- **Different manufacturers** (Samsung, Google, OnePlus, etc.)

### 8.3 Performance Testing
- **App startup time**: < 3 seconds
- **Memory usage**: < 100MB
- **Battery usage**: Minimal
- **Network usage**: Optimized

## Step 9: Release

### 9.1 Production Release
1. Upload signed AAB
2. Complete store listing
3. Submit for review
4. Wait for approval (1-3 days)

### 9.2 Post-Launch
- **Monitor crashes** with Firebase Crashlytics
- **Track performance** with Google Play Console
- **Respond to reviews**
- **Plan updates**

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx cap sync android
```

#### Signing Issues
- Verify keystore path
- Check passwords
- Ensure keystore is in correct location

#### Performance Issues
- Optimize images
- Reduce bundle size
- Implement lazy loading

#### Network Issues
- Check CORS settings
- Verify API endpoints
- Test offline functionality

### Debug Commands
```bash
# Check device connection
adb devices

# View logs
adb logcat

# Install APK
adb install app-release.apk

# Uninstall app
adb uninstall com.v0finance.app
```

## Resources

### Documentation
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android Developer Guide](https://developer.android.com/guide)

### Tools
- [Android Studio](https://developer.android.com/studio)
- [APK Analyzer](https://developer.android.com/studio/build/apk-analyzer)
- [Play Console](https://play.google.com/console)

### Communities
- [Capacitor Discord](https://discord.gg/capacitor)
- [Android Developers](https://developer.android.com/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/capacitor)
