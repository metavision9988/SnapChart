import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGenerateDiagram } from './useGenerateDiagram';
import { ReactNode } from 'react';

// Mock fetch
global.fetch = vi.fn();

describe('useGenerateDiagram', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should make POST request to /api/diagrams/generate', async () => {
    const mockResponse = {
      id: '123',
      type: 'flowchart',
      code: 'graph TD',
      duration: 1000,
      provider: 'gemini',
      attempts: 1,
      cached: false,
      timestamp: '2025-01-15T00:00:00Z'
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useGenerateDiagram(), { wrapper });

    result.current.mutate({
      type: 'flowchart',
      prompt: 'test prompt'
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/diagrams/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'flowchart',
        prompt: 'test prompt'
      })
    });
  });

  it('should return data on success', async () => {
    const mockResponse = {
      id: '123',
      type: 'flowchart',
      code: 'graph TD',
      duration: 1000,
      provider: 'gemini' as const,
      attempts: 1,
      cached: false,
      timestamp: '2025-01-15T00:00:00Z'
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { result } = renderHook(() => useGenerateDiagram(), { wrapper });

    result.current.mutate({
      type: 'flowchart',
      prompt: 'test prompt'
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockResponse);
    });
  });

  it('should handle errors', async () => {
    const errorMessage = 'Generation failed';

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: errorMessage })
    });

    const { result } = renderHook(() => useGenerateDiagram(), { wrapper });

    result.current.mutate({
      type: 'flowchart',
      prompt: 'test prompt'
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
  });

  it('should set loading state during request', async () => {
    (global.fetch as any).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    const { result } = renderHook(() => useGenerateDiagram(), { wrapper });

    result.current.mutate({
      type: 'flowchart',
      prompt: 'test prompt'
    });

    expect(result.current.isPending).toBe(true);
  });
});
