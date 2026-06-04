import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.Civic.civicpremium',
  appName: 'Civic Premium',
  webDir: 'dist/apps/civic-premium-app',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
};

export default config;
