import { describe, it, expect, beforeAll } from 'vitest';
import { Hono } from 'hono';
import { healthRouter } from './health';

describe('Health API', () => {
  let app: Hono;

  beforeAll(() => {
    app = new Hono();
    app.route('/health', healthRouter);
  });

  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const res = await app.request('/health');
      expect(res.status).toBe(200);
    });

    it('should return JSON response', async () => {
      const res = await app.request('/health');
      const contentType = res.headers.get('content-type');
      expect(contentType).toContain('application/json');
    });

    it('should return health status object', async () => {
      const res = await app.request('/health');
      const data = await res.json();

      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('timestamp');
      expect(data.status).toBe('ok');
    });

    it('should return valid ISO timestamp', async () => {
      const res = await app.request('/health');
      const data = await res.json();

      const timestamp = new Date(data.timestamp);
      expect(timestamp.toISOString()).toBe(data.timestamp);
    });
  });
});
