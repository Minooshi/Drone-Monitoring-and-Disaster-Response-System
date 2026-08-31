import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': {
          target: `http://localhost:${env.PORT || 5000}`,
          changeOrigin: true,
        },
        '/partner-proxy': {
          target: env.VITE_PARTNER_FEED_URL || env.NEXT_PUBLIC_PARTNER_FEED_URL || 'https://srs.naveennuwantha.lk',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/partner-proxy/, ''),
          secure: false,
        },
      },
    },
  };
});
