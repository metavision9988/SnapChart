import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { initDatabase } from './lib/database';
import { healthRouter } from './routes/health';
import { diagramsRouter } from './routes/diagrams';

// Environment variables
const PORT = parseInt(process.env.PORT || '8080');
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Initialize database
initDatabase();

// Create Hono app
const app = new Hono();

// Middleware
app.use('*', cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use('*', logger());

// Routes
app.route('/health', healthRouter);
app.route('/api/diagrams', diagramsRouter);

// Error handling
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: err.message
  }, 500);
});

// 404
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Start Bun server
console.log(`🚀 Server starting on http://localhost:${PORT}`);

export default {
  port: PORT,
  fetch: app.fetch,
};
