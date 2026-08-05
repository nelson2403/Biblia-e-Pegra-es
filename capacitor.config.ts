import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bibliaepregacoes.app',
  appName: 'Bíblia & Pregações',
  webDir: 'out',
  server: {
    url: 'https://biblia-e-pegra-ejo5j995s-nelsonhenriquebrisa-8411s-projects.vercel.app',
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#1E1B4B',
  },
};

export default config;
