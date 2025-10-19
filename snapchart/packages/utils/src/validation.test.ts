import { describe, it, expect } from 'vitest';
import { isValidDiagramType, validatePrompt, validateMermaidCode } from './validation';

describe('isValidDiagramType', () => {
  it('should return true for valid diagram types', () => {
    const validTypes = [
      'flowchart',
      'sequence',
      'pie',
      'gantt',
      'er',
      'state',
      'journey',
      'graph'
    ];

    validTypes.forEach(type => {
      expect(isValidDiagramType(type)).toBe(true);
    });
  });

  it('should return false for invalid diagram types', () => {
    expect(isValidDiagramType('invalid')).toBe(false);
    expect(isValidDiagramType('chart')).toBe(false);
    expect(isValidDiagramType('')).toBe(false);
    expect(isValidDiagramType('FLOWCHART')).toBe(false); // case sensitive
  });
});

describe('validatePrompt', () => {
  it('should validate non-empty prompts', () => {
    const result = validatePrompt('Valid prompt');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject empty prompts', () => {
    const result = validatePrompt('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should reject whitespace-only prompts', () => {
    const result = validatePrompt('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('empty');
  });

  it('should reject prompts over 2000 characters', () => {
    const longPrompt = 'a'.repeat(2001);
    const result = validatePrompt(longPrompt);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('2000');
  });

  it('should accept prompts exactly 2000 characters', () => {
    const maxPrompt = 'a'.repeat(2000);
    const result = validatePrompt(maxPrompt);
    expect(result.valid).toBe(true);
  });

  it('should reject non-string inputs', () => {
    const result = validatePrompt(null as any);
    expect(result.valid).toBe(false);
  });
});

describe('validateMermaidCode', () => {
  it('should validate clean Mermaid code', () => {
    const code = 'graph TD\n  A-->B';
    const result = validateMermaidCode(code);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject empty code', () => {
    const result = validateMermaidCode('');
    expect(result.valid).toBe(false);
  });

  it('should reject whitespace-only code', () => {
    const result = validateMermaidCode('   \n  ');
    expect(result.valid).toBe(false);
  });

  it('should reject code with markdown blocks', () => {
    const code = '```mermaid\ngraph TD\n  A-->B\n```';
    const result = validateMermaidCode(code);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('markdown');
  });

  it('should reject non-string inputs', () => {
    const result = validateMermaidCode(undefined as any);
    expect(result.valid).toBe(false);
  });
});
