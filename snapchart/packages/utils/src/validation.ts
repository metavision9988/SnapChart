import type { DiagramType } from '@snapchart/types';

/**
 * Validates if a string is a valid diagram type
 */
export function isValidDiagramType(type: string): type is DiagramType {
  const validTypes: DiagramType[] = [
    'flowchart',
    'sequence',
    'pie',
    'gantt',
    'er',
    'state',
    'journey',
    'graph'
  ];
  return validTypes.includes(type as DiagramType);
}

/**
 * Validates prompt length and content
 */
export function validatePrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt must be a non-empty string' };
  }

  const trimmed = prompt.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Prompt cannot be empty' };
  }

  if (trimmed.length > 2000) {
    return { valid: false, error: 'Prompt cannot exceed 2000 characters' };
  }

  return { valid: true };
}

/**
 * Validates Mermaid code syntax (basic check)
 */
export function validateMermaidCode(code: string): { valid: boolean; error?: string } {
  if (!code || typeof code !== 'string') {
    return { valid: false, error: 'Code must be a non-empty string' };
  }

  const trimmed = code.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Code cannot be empty' };
  }

  // Basic syntax checks
  if (trimmed.includes('```')) {
    return { valid: false, error: 'Code should not contain markdown code blocks' };
  }

  return { valid: true };
}
