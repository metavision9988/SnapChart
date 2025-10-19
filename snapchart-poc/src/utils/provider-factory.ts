import { config } from 'dotenv';
import type { AIProvider } from './ai-provider.js';
import { GeminiProvider } from './gemini-provider.js';
import { ClaudeProvider } from './claude-provider.js';

config();

/**
 * 환경 변수에 따라 적절한 AI Provider를 생성
 */
export function createAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || 'gemini';

  switch (provider.toLowerCase()) {
    case 'gemini': {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          'GEMINI_API_KEY 환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요.'
        );
      }
      return new GeminiProvider(apiKey);
    }

    case 'claude': {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error(
          'ANTHROPIC_API_KEY 환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요.'
        );
      }
      return new ClaudeProvider(apiKey);
    }

    default:
      throw new Error(
        `알 수 없는 AI Provider: ${provider}. 'gemini' 또는 'claude'를 사용하세요.`
      );
  }
}

/**
 * 현재 선택된 provider 이름 반환
 */
export function getProviderName(): string {
  const provider = process.env.AI_PROVIDER || 'gemini';
  return provider.charAt(0).toUpperCase() + provider.slice(1);
}
