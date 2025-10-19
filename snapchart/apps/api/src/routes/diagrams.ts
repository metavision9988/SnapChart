import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import type { DiagramType, GenerateResponse } from '@snapchart/types';
import { DiagramGenerator } from '../lib/diagram-generator';
import { getDatabase } from '../lib/database';
import { cacheManager } from '../lib/cache-manager';

export const diagramsRouter = new Hono();

// Validation schema
const generateSchema = z.object({
  type: z.enum([
    'flowchart',
    'sequence',
    'pie',
    'gantt',
    'er',
    'state',
    'journey',
    'graph'
  ]),
  prompt: z.string().min(1).max(2000)
});

// POST /api/diagrams/generate
diagramsRouter.post('/generate', async (c) => {
  try {
    // Parse and validate request
    const body = await c.req.json();
    const parsed = generateSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({
        error: 'Validation failed',
        details: parsed.error.errors
      }, 400);
    }

    const { type, prompt } = parsed.data;

    // Check cache
    const cacheKey = cacheManager.generateKey(type, prompt);
    const cached = await cacheManager.get(cacheKey);

    if (cached) {
      console.log('✅ Cache hit:', cacheKey);
      return c.json({
        ...cached,
        cached: true
      });
    }

    // Generate diagram
    const geminiKey = process.env.GEMINI_API_KEY;
    const claudeKey = process.env.ANTHROPIC_API_KEY;

    if (!geminiKey) {
      return c.json({
        error: 'Gemini API key not configured'
      }, 500);
    }

    const generator = new DiagramGenerator(geminiKey, claudeKey);

    const startTime = Date.now();
    const result = await generator.generate(type, prompt);
    const duration = Date.now() - startTime;

    // Create response
    const response: GenerateResponse = {
      id: nanoid(),
      type,
      code: result.code,
      duration,
      provider: result.provider,
      attempts: result.attempts,
      cached: false,
      timestamp: new Date().toISOString()
    };

    // Save to cache
    await cacheManager.set(cacheKey, response, 86400); // 24 hours

    // Save to database
    try {
      const db = getDatabase();
      const stmt = db.prepare(`
        INSERT INTO diagrams (id, type, prompt, code, duration, cached)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        response.id,
        type,
        prompt,
        result.code,
        duration,
        0
      );
    } catch (dbError: any) {
      console.error('Database save error:', dbError);
      // Continue even if DB save fails
    }

    return c.json(response);

  } catch (error: any) {
    console.error('Generate error:', error);
    return c.json({
      error: 'Generation failed',
      message: error.message
    }, 500);
  }
});

// GET /api/diagrams/stats
diagramsRouter.get('/stats', async (c) => {
  try {
    const db = getDatabase();

    const stats = db.prepare(`
      SELECT
        type,
        COUNT(*) as count,
        AVG(duration) as avg_duration,
        MIN(duration) as min_duration,
        MAX(duration) as max_duration
      FROM diagrams
      WHERE created_at > datetime('now', '-7 days')
      GROUP BY type
      ORDER BY count DESC
    `).all();

    const totalCount = db.prepare(`
      SELECT COUNT(*) as total
      FROM diagrams
      WHERE created_at > datetime('now', '-7 days')
    `).get() as { total: number };

    return c.json({
      period: '7 days',
      total: totalCount.total,
      by_type: stats
    });

  } catch (error: any) {
    console.error('Stats error:', error);
    return c.json({
      error: 'Failed to fetch stats',
      message: error.message
    }, 500);
  }
});

// GET /api/diagrams/recent
diagramsRouter.get('/recent', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '10');
    const db = getDatabase();

    const recent = db.prepare(`
      SELECT id, type, duration, created_at
      FROM diagrams
      ORDER BY created_at DESC
      LIMIT ?
    `).all(limit);

    return c.json({ diagrams: recent });

  } catch (error: any) {
    console.error('Recent error:', error);
    return c.json({
      error: 'Failed to fetch recent diagrams',
      message: error.message
    }, 500);
  }
});
