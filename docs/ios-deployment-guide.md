# iOS Deployment Guide

## Prerequisites

### 1. Development Environment
- **macOS** (required for iOS development)
- **Xcode** (latest version from App Store)
- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **CocoaPods** (for iOS dependencies)

### 2. Accounts Required
- **Apple Developer Account** ($99/year)
- **Apple ID** for App Store Connect access

## Step 1: Environment Setup

### 1.1 Install Xcode
1. Open App Store on macOS
2. Search for "Xcode"
3. Install (requires ~15GB space)
4. Open Xcode and accept license agreement
5. Install additional components when prompted

### 1.2 Install CocoaPods
```bash
# Install CocoaPods
sudo gem install cocoapods

# Verify installation
pod --version
```

### 1.3 Verify Installation
```bash
# Check Xcode
xcode-select --print-path

# Check Node.js
node --version

# Check npm
npm --version
```

## Step 2: Project Setup

### 2.1 Run Setup Script
```bash
# On macOS
./scripts/setup-mobile.sh
```

### 2.2 Manual Setup (if script fails)
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios

# Initialize Capacitor
npx cap init "v0 Finance" "com.v0finance.app"

# Add iOS platform
npx cap add ios
```

### 2.3 Install iOS Dependencies
```bash
# Navigate to iOS directory
cd ios

# Install pods
pod install

# Return to root
cd ..
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
    iosScheme: 'v0finance'
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#111111',
    allowsLinkPreview: false,
    handleApplicationURL: false,
    scheme: 'v0finance',
    preferredContentMode: 'mobile',
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
- 20x20 (iPhone)
- 29x29 (Settings)
- 40x40 (Spotlight)
- 58x58 (Settings @2x)
- 60x60 (iPhone @2x)
- 80x80 (Spotlight @2x)
- 87x87 (Settings @3x)
- 120x120 (iPhone @3x)
- 180x180 (iPhone @3x)
- 1024x1024 (App Store)

### 4.2 Place Icons
```
public/icons/
├── icon-20x20.png
├── icon-29x29.png
├── icon-40x40.png
├── icon-58x58.png
├── icon-60x60.png
├── icon-80x80.png
├── icon-87x87.png
├── icon-120x120.png
├── icon-180x180.png
└── icon-1024x1024.png
```

### 4.3 Generate iOS Icons
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
npx cap sync ios
```

### 5.2 Open in Xcode
```bash
npx cap open ios
```

### 5.3 Configure Build Settings
In Xcode:
1. Select project in navigator
2. Go to **Build Settings**
3. Set **iOS Deployment Target** to 13.0
4. Configure **Code Signing**
5. Set **Bundle Identifier** to `com.v0finance.app`

### 5.4 Configure App Icons
1. Select **App** target
2. Go to **General** tab
3. Under **App Icons and Launch Images**
4. Drag icons to appropriate slots
5. Ensure all required sizes are filled

## Step 6: Apple Developer Account Setup

### 6.1 Enroll in Developer Program
1. Go to [Apple Developer](https://developer.apple.com/programs/)
2. Click **Enroll**
3. Sign in with Apple ID
4. Complete enrollment process
5. Pay $99 annual fee

### 6.2 Create App ID
1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers**
4. Click **+** to create new
5. Select **App IDs**
6. Fill in details:
   - **Description**: v0 Finance
   - **Bundle ID**: com.v0finance.app
   - **Capabilities**: Enable required features

### 6.3 Create Provisioning Profile
1. Go to **Profiles**
2. Click **+** to create new
3. Select **iOS App Development**
4. Choose App ID
5. Select certificates
6. Select devices
7. Download and install profile

## Step 7: App Store Connect Setup

### 7.1 Create App
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps**
3. Click **+** to create new app
4. Fill in details:
   - **Platform**: iOS
   - **Name**: v0 Finance
   - **Primary Language**: English
   - **Bundle ID**: com.v0finance.app
   - **SKU**: v0-finance-ios

### 7.2 App Information
```
App Name: v0 Finance
Subtitle: Smart Money Management
Description: 
Take control of your finances with v0 Finance - the smart way to manage your money. 
Features include:
• AI-powered budgeting and insights
• Transaction tracking and categorization
• Smart financial recommendations
• Offline support
• Secure cloud sync

Keywords: finance, budget, money, personal finance, AI, insights
```

### 7.3 Store Listing
- **App icon**: 1024x1024 PNG
- **Screenshots**: Required for all device sizes
  - iPhone 6.7" (1290x2796)
  - iPhone 6.5" (1242x2688)
  - iPhone 5.5" (1242x2208)
  - iPad Pro 12.9" (2048x2732)
  - iPad Pro 11" (1668x2388)

### 7.4 App Review Information
- **Contact Information**: Your contact details
- **Demo Account**: Test account credentials
- **Notes**: Instructions for reviewers

## Step 8: Code Signing

### 8.1 Create Certificates
1. Go to **Certificates, Identifiers & Profiles**
2. Click **Certificates**
3. Create **iOS App Development** certificate
4. Create **iOS Distribution** certificate
5. Download and install certificates

### 8.2 Configure Signing in Xcode
1. Select project in Xcode
2. Go to **Signing & Capabilities**
3. Select **Automatically manage signing**
4. Choose your team
5. Verify bundle identifier

### 8.3 Manual Signing (if needed)
1. Uncheck **Automatically manage signing**
2. Select **Provisioning Profile**
3. Choose **Signing Certificate**
4. Verify settings

## Step 9: Testing

### 9.1 Internal Testing
1. Build and archive app in Xcode
2. Upload to App Store Connect
3. Create internal testing group
4. Add testers
5. Test on various devices

### 9.2 Device Testing
Test on:
- **iOS 13.0+**
- **Various iPhone models**
- **iPad models**
- **Different screen sizes**

### 9.3 Performance Testing
- **App startup time**: < 3 seconds
- **Memory usage**: < 100MB
- **Battery usage**: Minimal
- **Network usage**: Optimized

## Step 10: Release

### 10.1 Production Release
1. Build and archive app
2. Upload to App Store Connect
3. Complete store listing
4. Submit for review
5. Wait for approval (1-7 days)

### 10.2 Post-Launch
- **Monitor crashes** with Xcode Organizer
- **Track performance** with App Store Connect
- **Respond to reviews**
- **Plan updates**

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clean and rebuild
cd ios
pod deintegrate
pod install
cd ..
npx cap sync ios
```

#### Signing Issues
- Verify certificates are installed
- Check provisioning profiles
- Ensure bundle identifier matches
- Verify team selection

#### Performance Issues
- Optimize images
- Reduce bundle size
- Implement lazy loading
- Use efficient data structures

#### Network Issues
- Check CORS settings
- Verify API endpoints
- Test offline functionality
- Configure App Transport Security

### Debug Commands
```bash
# Check iOS Simulator
xcrun simctl list devices

# Install app on simulator
xcrun simctl install booted ios/App/App.app

# Launch app on simulator
xcrun simctl launch booted com.v0finance.app

# View device logs
xcrun simctl spawn booted log stream --predicate 'process == "App"'
```

## Resources

### Documentation
- [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [iOS Developer Guide](https://developer.apple.com/ios/)

### Tools
- [Xcode](https://developer.apple.com/xcode/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [TestFlight](https://developer.apple.com/testflight/)

### Communities
- [Capacitor Discord](https://discord.gg/capacitor)
- [iOS Developers](https://developer.apple.com/community/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/capacitor)

## Additional Considerations

### iOS-Specific Features
- **Push Notifications**: Configure APNs
- **Background App Refresh**: Optimize for battery
- **App Transport Security**: Configure network security
- **Privacy Permissions**: Request appropriately

### App Store Guidelines
- **Human Interface Guidelines**: Follow iOS design patterns
- **App Store Review Guidelines**: Ensure compliance
- **Privacy Policy**: Required for data collection
- **Age Rating**: Appropriate for financial apps

### Performance Optimization
- **Memory Management**: Avoid leaks
- **Battery Usage**: Minimize background activity
- **Network Efficiency**: Optimize API calls
- **Storage Management**: Efficient data storage
