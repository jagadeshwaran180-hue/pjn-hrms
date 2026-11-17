import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createApiMiddleware } from '../server/server.ts';

function apiServerPlugin(): Plugin {
  return {
    name: 'api-server-plugin',
    configureServer(server) {
      server.middlewares.use(createApiMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(createApiMiddleware());
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), apiServerPlugin()],
  server: {
    port: 3000,
    open: false
  }
});
