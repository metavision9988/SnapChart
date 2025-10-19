/**
 * AI Provider 추상 인터페이스
 * 나중에 Claude, GPT 등 다른 provider 추가 가능
 */

export interface AIResponse {
  text: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface AIProvider {
  name: string;

  /**
   * 텍스트 생성 요청
   */
  generate(prompt: string, systemPrompt?: string, maxTokens?: number): Promise<AIResponse>;

  /**
   * 비용 계산 (USD)
   */
  calculateCost(inputTokens: number, outputTokens: number): number;
}

export interface AIProviderConfig {
  provider: 'gemini' | 'claude';
  apiKey: string;
}
