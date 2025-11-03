import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.neuroflow.focuscalm',
    appName: 'NeuroFlow',
    webDir: 'dist',
    server: {
        androidScheme: 'https',
        cleartext: true
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: '#f472b6',
            showSpinner: false
        }
    }
};

export default config;
