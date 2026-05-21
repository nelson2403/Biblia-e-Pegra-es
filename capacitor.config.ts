import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bibliaepregacoes.app',
  appName: 'Bíblia & Pregações',
  webDir: 'out',
  server: {
    // URL de produção no Vercel — atualizar após o deploy
    // url: 'https://SEU-APP.vercel.app',
    // Para desenvolvimento local com Android Emulator:
    // url: 'http://10.0.2.2:3000',
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#1E1B4B',
  },
};

export default config;
