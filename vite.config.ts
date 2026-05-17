import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/video-game-olympics/',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "variables" as *;\n',
        loadPaths: ['src'],
      },
    },
  },
  plugins: [react()],
});
