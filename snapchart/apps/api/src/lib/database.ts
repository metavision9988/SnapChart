import { Database } from 'bun:sqlite';
import { mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

const DB_PATH = process.env.DATABASE_PATH || './data/snapchart.db';

let db: Database | null = null;

export function initDatabase() {
  // Create data directory if not exists
  const dir = dirname(DB_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // Open database
  db = new Database(DB_PATH, { create: true });
  db.exec('PRAGMA journal_mode = WAL');

  // Create tables
  createTables();

  console.log('✅ Database initialized:', DB_PATH);

  return db;
}

export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

function createTables() {
  if (!db) return;

  // Diagrams table
  db.exec(`
    CREATE TABLE IF NOT EXISTS diagrams (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      prompt TEXT NOT NULL,
      code TEXT NOT NULL,
      duration INTEGER NOT NULL,
      cached INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Index for type and created_at
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_diagrams_type
    ON diagrams(type);
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_diagrams_created_at
    ON diagrams(created_at DESC);
  `);

  console.log('✅ Database tables created');
}

export function closeDatabase() {
  if (db) {
    db.close();
    console.log('✅ Database closed');
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});
