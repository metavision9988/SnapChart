import { Hono } from 'hono';
import { getDatabase } from '../lib/database';
import { cacheManager } from '../lib/cache-manager';

export const healthRouter = new Hono();

healthRouter.get('/', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

healthRouter.get('/detailed', (c) => {
  try {
    // Database check
    const db = getDatabase();
    const dbCheck = db.prepare('SELECT 1 as result').get();

    // Cache check
    const cacheStats = cacheManager.getStats();

    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbCheck ? 'ok' : 'error',
        cache: {
          status: 'ok',
          size: cacheStats.size
        }
      }
    });
  } catch (error: any) {
    return c.json({
      status: 'error',
      message: error.message
    }, 500);
  }
});
