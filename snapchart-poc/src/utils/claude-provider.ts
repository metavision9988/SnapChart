import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider, AIResponse } from './ai-provider.js';

/**
 * Anthropic Claude API Provider
 * 나중에 사용할 수 있도록 미리 구현
 */
export class ClaudeProvider implements AIProvider {
  name = 'Claude';
  private client: Anthropic;

  // Claude 가격 (Sonnet 4 기준)
  // Input: $3/1M tokens, Output: $15/1M tokens
  private readonly INPUT_COST_PER_MILLION = 3.0;
  private readonly OUTPUT_COST_PER_MILLION = 15.0;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async generate(
    prompt: string,
    systemPrompt?: string,
    maxTokens: number = 2000
  ): Promise<AIResponse> {
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '';

    return {
      text,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  }

  calculateCost(inputTokens: number, outputTokens: number): number {
    const inputCost = (inputTokens / 1_000_000) * this.INPUT_COST_PER_MILLION;
    const outputCost = (outputTokens / 1_000_000) * this.OUTPUT_COST_PER_MILLION;
    return inputCost + outputCost;
  }
}
