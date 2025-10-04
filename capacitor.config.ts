import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.v0finance.app',
  appName: 'v0 Finance',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#111111",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#111111',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    Camera: {
      permissions: ["camera", "photos"],
    },
    Filesystem: {
      iosIsDocumentPickerEnabled: true,
      androidIsDocumentPickerEnabled: true,
    },
    Network: {
      networkStatus: true,
    },
    Device: {
      deviceInfo: true,
    },
    App: {
      appState: true,
    },
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
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    appendUserAgent: 'v0finance-mobile',
    overrideUserAgent: 'v0finance-mobile',
    backgroundColor: '#111111',
    initialFocus: false,
    mixedContentMode: 'compatibility',
    useLegacyBridge: false,
  },
};

export default config;
