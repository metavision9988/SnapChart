// Diagram Types
export type DiagramType =
  | 'flowchart'
  | 'sequence'
  | 'pie'
  | 'gantt'
  | 'er'
  | 'state'
  | 'journey'
  | 'graph';

// API Request/Response Types
export interface GenerateRequest {
  type: DiagramType;
  prompt: string;
}

export interface GenerateResponse {
  id: string;
  type: DiagramType;
  code: string;
  duration: number;
  provider: 'gemini' | 'claude';
  attempts: number;
  cached: boolean;
  timestamp: string;
}

export interface DiagramStats {
  total: number;
  byType: Record<DiagramType, number>;
  byProvider: Record<'gemini' | 'claude', number>;
  cacheHitRate: number;
  avgDuration: number;
}

// Database Types
export interface DiagramRecord {
  id: string;
  type: DiagramType;
  prompt: string;
  code: string;
  provider: 'gemini' | 'claude';
  attempts: number;
  duration: number;
  created_at: string;
}

// Cache Types
export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
}

// Diagram Configuration Types
export interface DiagramConfig {
  systemPrompt: string;
  fewShotExamples?: FewShotExample[];
  maxTokens?: number;
}

export interface FewShotExample {
  prompt: string;
  code: string;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Health Check Types
export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  database: 'connected' | 'disconnected';
  cache: 'active' | 'inactive';
}
