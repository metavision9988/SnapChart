import { useMutation } from '@tanstack/react-query';
import type { GenerateRequest, GenerateResponse } from '@snapchart/types';

export function useGenerateDiagram() {
  return useMutation<GenerateResponse, Error, GenerateRequest>({
    mutationFn: async ({ type, prompt }) => {
      const response = await fetch('/api/diagrams/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, prompt })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Generation failed');
      }

      return response.json();
    }
  });
}
