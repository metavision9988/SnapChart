import { describe, it, expect } from 'vitest';
import { cleanMermaidCode, truncate, escapeHtml } from './string';

describe('cleanMermaidCode', () => {
  it('should remove markdown code blocks', () => {
    const input = '```mermaid\ngraph TD\n  A-->B\n```';
    const result = cleanMermaidCode(input);
    expect(result).toBe('graph TD\nA-->B');
  });

  it('should remove leading/trailing whitespace from lines', () => {
    const input = '  graph TD  \n    A-->B  \n  C-->D  ';
    const result = cleanMermaidCode(input);
    expect(result).toBe('graph TD\nA-->B\nC-->D');
  });

  it('should remove empty lines', () => {
    const input = 'graph TD\n\nA-->B\n\n\nC-->D\n';
    const result = cleanMermaidCode(input);
    expect(result).toBe('graph TD\nA-->B\nC-->D');
  });

  it('should handle already clean code', () => {
    const input = 'graph TD\nA-->B';
    const result = cleanMermaidCode(input);
    expect(result).toBe('graph TD\nA-->B');
  });

  it('should handle mixed case mermaid blocks', () => {
    const input = '```MERMAID\ngraph TD\n```';
    const result = cleanMermaidCode(input);
    expect(result).toBe('graph TD');
  });
});

describe('truncate', () => {
  it('should not truncate strings shorter than maxLength', () => {
    const result = truncate('short', 10);
    expect(result).toBe('short');
  });

  it('should truncate strings longer than maxLength', () => {
    const result = truncate('this is a long string', 10);
    expect(result).toBe('this is...');
    expect(result).toHaveLength(10);
  });

  it('should handle strings exactly at maxLength', () => {
    const result = truncate('exactly10!', 10);
    expect(result).toBe('exactly10!');
  });

  it('should handle very short maxLength', () => {
    const result = truncate('test', 3);
    expect(result).toBe('...');
  });
});

describe('escapeHtml', () => {
  it('should escape ampersands', () => {
    expect(escapeHtml('A & B')).toBe('A &amp; B');
  });

  it('should escape less-than signs', () => {
    expect(escapeHtml('A < B')).toBe('A &lt; B');
  });

  it('should escape greater-than signs', () => {
    expect(escapeHtml('A > B')).toBe('A &gt; B');
  });

  it('should escape double quotes', () => {
    expect(escapeHtml('"quoted"')).toBe('&quot;quoted&quot;');
  });

  it('should escape single quotes', () => {
    expect(escapeHtml("'quoted'")).toBe('&#039;quoted&#039;');
  });

  it('should escape multiple special characters', () => {
    expect(escapeHtml('<div class="test">A & B</div>'))
      .toBe('&lt;div class=&quot;test&quot;&gt;A &amp; B&lt;/div&gt;');
  });

  it('should not modify strings without special characters', () => {
    expect(escapeHtml('normal text')).toBe('normal text');
  });
});
