/**
 * Cleans Mermaid code by removing markdown code blocks and extra whitespace
 */
export function cleanMermaidCode(code: string): string {
  let cleaned = code.trim();

  // Remove markdown code blocks
  cleaned = cleaned.replace(/```mermaid\n?/gi, '');
  cleaned = cleaned.replace(/```\n?/g, '');

  // Remove leading/trailing whitespace from each line
  cleaned = cleaned
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');

  return cleaned;
}

/**
 * Truncates a string to a maximum length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Escapes special characters for safe display
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, char => map[char]);
}
