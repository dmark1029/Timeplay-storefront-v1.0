import react from '@vitejs/plugin-react-swc';
import * as path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    const env = loadEnv(mode, process.cwd(), '');
    console.log('ships-service url:', env.SHIPS_SERVICE_URL);
    return {
      base: '/frontend/ships-client',
      plugins: [react()],
      resolve: {
        alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
      },
      server: {
        proxy: {
          '/ships-service': {
            target: env.SHIPS_SERVICE_URL
              ? env.SHIPS_SERVICE_URL
              : 'http://localhost/ships-service',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/ships-service/, ''),
          },
        },
      },
    };
  } else {
    return {
      base: '/frontend/ships-client',
      plugins: [react()],
      build: {
        outDir: 'build',
      },
      resolve: {
        alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
      },
      server: {
        proxy: {
          '/ships-service': {
            target: 'http://ships-service',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/ships-service/, ''),
          },
        },
      },
    };
  }
});
