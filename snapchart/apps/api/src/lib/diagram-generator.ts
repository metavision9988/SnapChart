import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { DIAGRAM_CONFIGS, DiagramConfig } from './configs';

export interface GenerateResult {
  code: string;
  provider: 'gemini' | 'claude';
  attempts: number;
}

export class DiagramGenerator {
  private gemini: GoogleGenerativeAI;
  private claude?: Anthropic;

  constructor(geminiKey: string, claudeKey?: string) {
    this.gemini = new GoogleGenerativeAI(geminiKey);
    if (claudeKey) {
      this.claude = new Anthropic({ apiKey: claudeKey });
    }
  }

  async generate(type: string, prompt: string): Promise<GenerateResult> {
    const config = DIAGRAM_CONFIGS[type];
    if (!config) {
      throw new Error(`Unknown diagram type: ${type}`);
    }

    // Build Few-Shot prompt
    const systemPrompt = this.buildPrompt(config);

    // Primary: Gemini (3회 재시도)
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const code = await this.callGemini(systemPrompt, prompt);

        // 기본 검증
        if (this.isValidCode(code, type)) {
          return {
            code,
            provider: 'gemini',
            attempts: attempt
          };
        }

        console.warn(`Gemini attempt ${attempt}: Invalid code generated`);
      } catch (error: any) {
        console.error(`Gemini attempt ${attempt} failed:`, error.message);
      }

      // Exponential backoff
      if (attempt < 3) {
        await this.sleep(1000 * Math.pow(2, attempt - 1));
      }
    }

    // Fallback: Claude (optional)
    if (this.claude) {
      console.log('🔄 Falling back to Claude...');
      try {
        const code = await this.callClaude(systemPrompt, prompt);

        if (this.isValidCode(code, type)) {
          return {
            code,
            provider: 'claude',
            attempts: 1
          };
        }

        throw new Error('Claude generated invalid code');
      } catch (error: any) {
        console.error('Claude fallback failed:', error.message);
      }
    }

    throw new Error('All generation attempts failed (Gemini only mode)');
  }

  private buildPrompt(config: DiagramConfig): string {
    let prompt = config.systemPrompt;

    if (config.fewShotExamples && config.fewShotExamples.length > 0) {
      prompt += '\n\n**학습 예제**:\n';
      config.fewShotExamples.forEach((ex, i) => {
        prompt += `\n예제 ${i + 1}:\n`;
        prompt += `입력: "${ex.input}"\n`;
        prompt += `출력:\n${ex.output}\n`;
      });
    }

    return prompt;
  }

  private async callGemini(system: string, user: string): Promise<string> {
    const model = this.gemini.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: system
    });

    const result = await model.generateContent(user);
    const text = result.response.text();

    return this.cleanCode(text);
  }

  private async callClaude(system: string, user: string): Promise<string> {
    if (!this.claude) {
      throw new Error('Claude API not configured');
    }

    const response = await this.claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system,
      messages: [{ role: 'user', content: user }]
    });

    const text = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    return this.cleanCode(text);
  }

  private cleanCode(text: string): string {
    return text
      .replace(/```mermaid\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
  }

  private isValidCode(code: string, type: string): boolean {
    // 기본 검증
    if (code.length < 10) {
      return false;
    }

    // 타입별 키워드 확인
    const validStarts: Record<string, string[]> = {
      flowchart: ['flowchart TD', 'flowchart LR', 'flowchart'],
      sequence: ['sequenceDiagram'],
      pie: ['pie'],
      gantt: ['gantt'],
      er: ['erDiagram'],
      state: ['stateDiagram'],
      journey: ['journey'],
      graph: ['graph TD', 'graph LR', 'graph']
    };

    const keywords = validStarts[type];
    if (!keywords) {
      return true; // Unknown type, skip validation
    }

    return keywords.some(keyword =>
      code.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
