import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署在仓库子路径下，必须设置 base
  base: '/Fine-Arts-Pavilion/',
  assetsInclude: ['**/*.glb'],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
