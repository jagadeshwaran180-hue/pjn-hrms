import http from 'node:http';
import { handleApiRequest } from './apiHandler.ts';
import { initDB } from './db.ts';

// Ensure DB is initialized
initDB();

/**
 * Connect/Vite compatible middleware
 */
export function createApiMiddleware() {
  return async (req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => {
    try {
      const handled = await handleApiRequest(req, res);
      if (!handled && next) {
        next();
      }
    } catch (err) {
      console.error('[API Middleware Error]', err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    }
  };
}

/**
 * Starts a standalone HTTP server listening on specified port
 */
export function startServer(port: number = 5000): http.Server {
  const middleware = createApiMiddleware();
  const server = http.createServer((req, res) => {
    middleware(req, res, () => {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    });
  });

  server.listen(port, () => {
    console.log(`[PJN Tech HRMS Backend] Server listening on http://localhost:${port}`);
  });

  return server;
}

// Auto-run when executed directly via Node
if (typeof process !== 'undefined' && process.argv[1]?.endsWith('server.ts')) {
  const port = parseInt(process.env.PORT || '5000', 10);
  startServer(port);
}
