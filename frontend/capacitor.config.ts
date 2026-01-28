import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aigestion.frontend',
  appName: 'AIGestion',
  webDir: 'apps/website-epic/dist',
  server: {
    androidScheme: 'http'
  },
};

export default config;
