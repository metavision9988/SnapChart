import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIProvider, AIResponse } from './ai-provider.js';

/**
 * Google Gemini API Provider
 */
export class GeminiProvider implements AIProvider {
  name = 'Gemini';
  private client: GoogleGenerativeAI;

  // Gemini 가격 (2024년 12월 기준)
  // Gemini 1.5 Flash: Input $0.075/1M tokens, Output $0.30/1M tokens
  private readonly INPUT_COST_PER_MILLION = 0.075;
  private readonly OUTPUT_COST_PER_MILLION = 0.30;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generate(
    prompt: string,
    systemPrompt?: string,
    maxTokens: number = 2000
  ): Promise<AIResponse> {
    const model = this.client.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 1,
      },
    });

    // systemPrompt를 프롬프트에 포함
    const fullPrompt = systemPrompt
      ? `${systemPrompt}\n\n${prompt}`
      : prompt;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    // 토큰 사용량 추출
    const usage = response.usageMetadata || {
      promptTokenCount: 0,
      candidatesTokenCount: 0,
    };

    return {
      text,
      usage: {
        inputTokens: usage.promptTokenCount || 0,
        outputTokens: usage.candidatesTokenCount || 0,
      },
    };
  }

  calculateCost(inputTokens: number, outputTokens: number): number {
    const inputCost = (inputTokens / 1_000_000) * this.INPUT_COST_PER_MILLION;
    const outputCost = (outputTokens / 1_000_000) * this.OUTPUT_COST_PER_MILLION;
    return inputCost + outputCost;
  }
}
