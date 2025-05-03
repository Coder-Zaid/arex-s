
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.022129e1b534464aa63f972b4370e42c',
  appName: 'gadget-haven-market',
  webDir: 'dist',
  server: {
    url: "https://022129e1-b534-464a-a63f-972b4370e42c.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false
    }
  }
};

export default config;
