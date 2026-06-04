import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.stitch.communitybuilding',
  appName: 'Community Building',
  webDir: 'dist/apps/civic-premium-app',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
};

export default config;
