# SnapChart TDD 개발 구현 계획서

> **프로젝트**: SnapChart MVP
> **접근 방식**: Test-Driven Development (TDD)
> **작성일**: 2025-10-18
> **목표**: 디버깅/트러블슈팅 최소화를 위한 단계별 검증

---

## 🎯 TDD 개발 원칙

### 핵심 철학
```
1. RED → GREEN → REFACTOR
   ├─ RED: 실패하는 테스트 작성
   ├─ GREEN: 테스트를 통과하는 최소 코드 작성
   └─ REFACTOR: 코드 품질 개선

2. 각 Task는 독립적으로 테스트 가능
3. 모든 테스트 통과 시에만 다음 단계 진행
4. CI/CD 파이프라인으로 자동화
```

### Gate-Keeping 전략
```yaml
Phase Gate:
  - 해당 Phase의 모든 Task 테스트 통과
  - 통합 테스트 실행 및 통과
  - 코드 리뷰 완료
  - 다음 Phase 진입 승인

Task Gate:
  - 단위 테스트 100% 통과
  - 코드 커버리지 80% 이상
  - ESLint/Prettier 검증 통과
  - 다음 Task 진입 가능
```

---

## 📋 Phase 0: 사전 준비 및 검증 (1-2일)

### Task 0.1: 법적 준비 검증 체크리스트
**목표**: 법적 리스크 제거

```markdown
## 상표권 조사 (필수)

### 체크리스트
- [ ] KIPRIS 검색 완료 (snapchart, 스냅차트)
- [ ] USPTO 검색 완료 (SnapChart)
- [ ] 유사 상표 없음 확인
- [ ] 변호사 자문 (필요 시)

### 출력물
- `legal/trademark-search-report.md`
- 상표권 출원 준비 서류

### 승인 조건
✅ 상표권 충돌 없음 확인
✅ 도메인 구매 가능 확인
```

### Task 0.2: 도메인 구매 및 인프라 준비
**목표**: 기술 인프라 확보

```bash
# 도메인 구매
- [ ] snapchart.io 구매 완료
- [ ] DNS 설정 (Cloudflare)
- [ ] SSL 인증서 발급

# Cloudflare 계정 설정
- [ ] Cloudflare Workers 계정 생성
- [ ] D1 Database 생성
- [ ] KV Namespace 생성
- [ ] API 토큰 발급

# 결과 검증
bun run test:infra
```

**테스트**: `tests/infrastructure/cloudflare.test.ts`
```typescript
import { describe, test, expect } from 'bun:test';

describe('Infrastructure Setup', () => {
  test('Cloudflare Workers 접근 가능', async () => {
    const response = await fetch('https://api.snapchart.io/health');
    expect(response.status).toBe(200);
  });

  test('D1 Database 연결 가능', async () => {
    // D1 연결 테스트
    expect(process.env.DATABASE_URL).toBeDefined();
  });

  test('KV Namespace 접근 가능', async () => {
    // KV 연결 테스트
    expect(process.env.KV_NAMESPACE_ID).toBeDefined();
  });
});
```

**승인 조건**:
- ✅ 모든 인프라 테스트 통과
- ✅ 환경 변수 설정 완료

---

## 🏗️ Phase 1: 프로젝트 초기화 (Week 1)

### Task 1.1: Monorepo 초기화 및 워크스페이스 설정

**목표**: Turborepo 기반 Monorepo 구조 구축

```bash
# 프로젝트 생성
mkdir snapchart && cd snapchart
bun init

# 워크스페이스 생성
mkdir -p apps/{web,api} packages/{shared,ui}

# 의존성 설치
bun add -d turbo typescript @types/node
```

**테스트**: `tests/setup/workspace.test.ts`
```typescript
import { describe, test, expect } from 'bun:test';
import { existsSync } from 'fs';
import { resolve } from 'path';

describe('Workspace Setup', () => {
  test('apps/web 디렉토리 존재', () => {
    expect(existsSync(resolve(__dirname, '../../apps/web'))).toBe(true);
  });

  test('apps/api 디렉토리 존재', () => {
    expect(existsSync(resolve(__dirname, '../../apps/api'))).toBe(true);
  });

  test('packages/shared 디렉토리 존재', () => {
    expect(existsSync(resolve(__dirname, '../../packages/shared'))).toBe(true);
  });

  test('turbo.json 설정 파일 존재', () => {
    expect(existsSync(resolve(__dirname, '../../turbo.json'))).toBe(true);
  });
});
```

**승인 조건**:
- ✅ 워크스페이스 테스트 통과
- ✅ `bun run build` 성공

---

### Task 1.2: Backend 프로젝트 초기화 (Hono + Cloudflare Workers)

**1단계: RED - 실패하는 테스트 작성**

```typescript
// apps/api/tests/api.test.ts

import { describe, test, expect } from 'bun:test';
import app from '../src/index';

describe('API Health Check', () => {
  test('GET /health - 200 응답', async () => {
    const req = new Request('http://localhost/health');
    const res = await app.fetch(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
  });
});
```

**실행**: `bun test` → ❌ **FAIL** (아직 구현 안 됨)

**2단계: GREEN - 최소 코드 작성**

```typescript
// apps/api/src/index.ts

import { Hono } from 'hono';

const app = new Hono();

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

export default app;
```

**실행**: `bun test` → ✅ **PASS**

**3단계: REFACTOR - 개선**

```typescript
// apps/api/src/routes/health.ts
import { Hono } from 'hono';

export const healthRouter = new Hono();

healthRouter.get('/', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});
```

**승인 조건**:
- ✅ Health check 테스트 통과
- ✅ TypeScript 타입 체크 통과
- ✅ ESLint 검증 통과

---

### Task 1.3: Frontend 프로젝트 초기화 (Vite + React)

**1단계: RED - 테스트 작성**

```typescript
// apps/web/tests/App.test.tsx

import { describe, test, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App Component', () => {
  test('SnapChart 타이틀 렌더링', () => {
    render(<App />);
    expect(screen.getByText('SnapChart')).toBeDefined();
  });

  test('다이어그램 타입 선택 UI 존재', () => {
    render(<App />);
    expect(screen.getByLabelText('다이어그램 타입')).toBeDefined();
  });
});
```

**2단계: GREEN - 구현**

```typescript
// apps/web/src/App.tsx

export default function App() {
  return (
    <div>
      <h1>SnapChart</h1>
      <label htmlFor="diagram-type">다이어그램 타입</label>
      <select id="diagram-type">
        <option value="flowchart">플로우차트</option>
      </select>
    </div>
  );
}
```

**3단계: REFACTOR - Tailwind 적용**

```typescript
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <h1 className="text-3xl font-bold">SnapChart</h1>
      </header>
      <main>
        <label className="block text-sm font-medium">다이어그램 타입</label>
        <select className="w-full px-4 py-2 border rounded-lg">
          <option value="flowchart">플로우차트</option>
        </select>
      </main>
    </div>
  );
}
```

**승인 조건**:
- ✅ 컴포넌트 테스트 통과
- ✅ `bun run dev` 실행 성공
- ✅ 브라우저에서 UI 확인

---

### Task 1.4: CI/CD 파이프라인 구축

**목표**: GitHub Actions로 자동화된 테스트 및 배포

```yaml
# .github/workflows/ci.yml

name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Run linter
        run: bun run lint

      - name: Run type check
        run: bun run type-check

      - name: Run tests
        run: bun test

      - name: Build
        run: bun run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  # Phase Gate: 모든 테스트 통과 시에만 다음 단계
  phase-1-gate:
    needs: test
    runs-on: ubuntu-latest
    if: success()

    steps:
      - run: echo "✅ Phase 1 Complete - Ready for Phase 2"
```

**승인 조건**:
- ✅ CI 파이프라인 실행 성공
- ✅ 코드 커버리지 80% 이상

---

## 🔧 Phase 2: Backend API 개발 (Week 2)

### Task 2.1: Diagram Generator 코어 로직 (TDD)

**1단계: RED - 테스트 먼저 작성**

```typescript
// apps/api/tests/diagram-generator.test.ts

import { describe, test, expect } from 'bun:test';
import { DiagramGenerator } from '../src/lib/diagram-generator';

describe('DiagramGenerator', () => {
  const generator = new DiagramGenerator(
    process.env.GEMINI_API_KEY!,
    process.env.ANTHROPIC_API_KEY!
  );

  test('플로우차트 생성 성공', async () => {
    const result = await generator.generate(
      'flowchart',
      '로그인 프로세스: 시작 → 이메일 → 비밀번호 → 인증 → 성공/실패'
    );

    expect(result.code).toContain('flowchart TD');
    expect(result.code.length).toBeGreaterThan(50);
  }, { timeout: 30000 });

  test('파이 차트 생성 성공', async () => {
    const result = await generator.generate(
      'pie',
      '월별 매출: 1월(25%), 2월(30%), 3월(45%)'
    );

    expect(result.code).toContain('pie');
    expect(result.code).toContain('"1월" : 25');
  }, { timeout: 30000 });

  test('잘못된 타입 에러 처리', async () => {
    await expect(
      generator.generate('invalid', 'test')
    ).rejects.toThrow('Unknown diagram type');
  });
});
```

**실행**: `bun test` → ❌ **FAIL**

**2단계: GREEN - 구현**

```typescript
// apps/api/src/lib/diagram-generator.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { DIAGRAM_CONFIGS } from './configs';

export class DiagramGenerator {
  private gemini: GoogleGenerativeAI;
  private claude: Anthropic;

  constructor(geminiKey: string, claudeKey: string) {
    this.gemini = new GoogleGenerativeAI(geminiKey);
    this.claude = new Anthropic({ apiKey: claudeKey });
  }

  async generate(type: string, prompt: string) {
    const config = DIAGRAM_CONFIGS[type];
    if (!config) {
      throw new Error(`Unknown diagram type: ${type}`);
    }

    // Few-Shot 프롬프트 생성
    const systemPrompt = this.buildPrompt(config);

    // Primary: Gemini (3회 재시도)
    for (let i = 0; i < 3; i++) {
      try {
        const code = await this.callGemini(systemPrompt, prompt);
        return { code };
      } catch (error) {
        if (i === 2) throw error;
        await this.sleep(1000 * Math.pow(2, i));
      }
    }

    throw new Error('All attempts failed');
  }

  private buildPrompt(config: any): string {
    let prompt = config.systemPrompt;
    if (config.fewShotExamples) {
      prompt += '\n\n**학습 예제**:\n';
      config.fewShotExamples.forEach((ex: any, i: number) => {
        prompt += `\n예제 ${i + 1}:\n입력: "${ex.input}"\n출력:\n${ex.output}\n`;
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

  private cleanCode(text: string): string {
    return text
      .replace(/```mermaid\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

**실행**: `bun test` → ✅ **PASS**

**승인 조건**:
- ✅ 플로우차트 생성 테스트 통과
- ✅ 파이 차트 생성 테스트 통과
- ✅ 에러 처리 테스트 통과

---

### Task 2.2: API 엔드포인트 구현 (TDD)

**1단계: RED - API 테스트 작성**

```typescript
// apps/api/tests/api/diagrams.test.ts

import { describe, test, expect } from 'bun:test';
import app from '../../src/index';

describe('POST /api/diagrams/generate', () => {
  test('플로우차트 생성 요청 성공', async () => {
    const req = new Request('http://localhost/api/diagrams/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'flowchart',
        prompt: '로그인 프로세스'
      })
    });

    const res = await app.fetch(req, {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
      DB: {} as any,
      CACHE: {} as any
    });

    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('code');
    expect(data).toHaveProperty('type', 'flowchart');
    expect(data.code).toContain('flowchart TD');
  }, { timeout: 30000 });

  test('필수 파라미터 누락 시 400 에러', async () => {
    const req = new Request('http://localhost/api/diagrams/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'flowchart' }) // prompt 누락
    });

    const res = await app.fetch(req);
    expect(res.status).toBe(400);
  });
});
```

**2단계: GREEN - API 구현**

```typescript
// apps/api/src/routes/diagrams.ts

import { Hono } from 'hono';
import { DiagramGenerator } from '../lib/diagram-generator';
import { nanoid } from 'nanoid';

type Bindings = {
  GEMINI_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  DB: D1Database;
  CACHE: KVNamespace;
};

export const diagramsRouter = new Hono<{ Bindings: Bindings }>();

diagramsRouter.post('/generate', async (c) => {
  try {
    const { type, prompt } = await c.req.json();

    // 입력 검증
    if (!type || !prompt) {
      return c.json({ error: 'Missing type or prompt' }, 400);
    }

    // 다이어그램 생성
    const generator = new DiagramGenerator(
      c.env.GEMINI_API_KEY,
      c.env.ANTHROPIC_API_KEY
    );

    const startTime = Date.now();
    const result = await generator.generate(type, prompt);
    const duration = Date.now() - startTime;

    // 응답 구성
    const response = {
      id: nanoid(),
      type,
      code: result.code,
      duration,
      cached: false,
      timestamp: new Date().toISOString()
    };

    return c.json(response);

  } catch (error: any) {
    console.error('Generate error:', error);
    return c.json({ error: error.message }, 500);
  }
});
```

**실행**: `bun test` → ✅ **PASS**

**승인 조건**:
- ✅ API 엔드포인트 테스트 통과
- ✅ 에러 처리 테스트 통과

---

### Task 2.3: 캐싱 시스템 구현 (TDD)

**1단계: RED - 캐시 테스트 작성**

```typescript
// apps/api/tests/cache/cache-manager.test.ts

import { describe, test, expect, beforeEach } from 'bun:test';
import { CacheManager } from '../../src/lib/cache-manager';

describe('CacheManager', () => {
  let cache: CacheManager;
  let mockKV: any;

  beforeEach(() => {
    mockKV = {
      data: new Map(),
      get: async (key: string) => mockKV.data.get(key),
      put: async (key: string, value: string) => {
        mockKV.data.set(key, value);
      }
    };
    cache = new CacheManager(mockKV);
  });

  test('캐시 저장 및 조회', async () => {
    const key = cache.generateKey('flowchart', 'test prompt');
    const value = { code: 'flowchart TD\nA-->B' };

    await cache.set(key, value);
    const retrieved = await cache.get(key);

    expect(retrieved).toEqual(value);
  });

  test('동일 프롬프트는 동일 키 생성', () => {
    const key1 = cache.generateKey('flowchart', 'login process');
    const key2 = cache.generateKey('flowchart', 'login process');

    expect(key1).toBe(key2);
  });

  test('캐시 미스 시 null 반환', async () => {
    const result = await cache.get('nonexistent');
    expect(result).toBeNull();
  });
});
```

**2단계: GREEN - 구현**

```typescript
// apps/api/src/lib/cache-manager.ts

export class CacheManager {
  constructor(private kv: KVNamespace) {}

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.kv.get(key, 'json');
    return cached as T | null;
  }

  async set(key: string, value: any, ttl: number = 86400): Promise<void> {
    await this.kv.put(
      key,
      JSON.stringify(value),
      { expirationTtl: ttl }
    );
  }

  generateKey(type: string, prompt: string): string {
    const hash = this.hashPrompt(prompt);
    return `diagram:${type}:${hash}`;
  }

  private hashPrompt(prompt: string): string {
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      hash = ((hash << 5) - hash) + prompt.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }
}
```

**실행**: `bun test` → ✅ **PASS**

**승인 조건**:
- ✅ 캐시 테스트 통과
- ✅ API에 캐시 통합 완료
- ✅ 캐시 히트/미스 로깅 확인

---

## 🎨 Phase 3: Frontend 개발 (Week 3)

### Task 3.1: DiagramInput 컴포넌트 (TDD)

**1단계: RED - 컴포넌트 테스트**

```typescript
// apps/web/tests/components/DiagramInput.test.tsx

import { describe, test, expect } from 'bun:test';
import { render, screen, fireEvent } from '@testing-library/react';
import { DiagramInput } from '../../src/components/DiagramInput';

describe('DiagramInput', () => {
  test('다이어그램 타입 선택 가능', () => {
    const onTypeChange = jest.fn();
    render(
      <DiagramInput
        type="flowchart"
        prompt=""
        onTypeChange={onTypeChange}
        onPromptChange={() => {}}
        onGenerate={() => {}}
        isLoading={false}
      />
    );

    const select = screen.getByLabelText('다이어그램 타입');
    fireEvent.change(select, { target: { value: 'pie' } });

    expect(onTypeChange).toHaveBeenCalledWith('pie');
  });

  test('프롬프트 입력 시 onChange 호출', () => {
    const onPromptChange = jest.fn();
    render(
      <DiagramInput
        type="flowchart"
        prompt=""
        onTypeChange={() => {}}
        onPromptChange={onPromptChange}
        onGenerate={() => {}}
        isLoading={false}
      />
    );

    const textarea = screen.getByPlaceholderText(/설명을 입력하세요/);
    fireEvent.change(textarea, { target: { value: '로그인 프로세스' } });

    expect(onPromptChange).toHaveBeenCalledWith('로그인 프로세스');
  });

  test('로딩 중에는 버튼 비활성화', () => {
    render(
      <DiagramInput
        type="flowchart"
        prompt="test"
        onTypeChange={() => {}}
        onPromptChange={() => {}}
        onGenerate={() => {}}
        isLoading={true}
      />
    );

    const button = screen.getByRole('button', { name: /생성 중/ });
    expect(button).toBeDisabled();
  });
});
```

**2단계: GREEN - 구현**

```typescript
// apps/web/src/components/DiagramInput.tsx

interface DiagramInputProps {
  type: string;
  prompt: string;
  onTypeChange: (type: string) => void;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export function DiagramInput({
  type,
  prompt,
  onTypeChange,
  onPromptChange,
  onGenerate,
  isLoading
}: DiagramInputProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">다이어그램 생성</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          다이어그램 타입
        </label>
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="flowchart">플로우차트</option>
          <option value="sequence">시퀀스 다이어그램</option>
          <option value="pie">파이 차트</option>
          <option value="gantt">간트 차트</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          설명을 입력하세요
        </label>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="예: 로그인 프로세스를 플로우차트로"
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || !prompt.trim()}
        className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg disabled:bg-gray-300"
      >
        {isLoading ? '생성 중...' : '다이어그램 생성'}
      </button>
    </div>
  );
}
```

**승인 조건**:
- ✅ 컴포넌트 테스트 통과
- ✅ Storybook 시각적 확인
- ✅ 접근성 테스트 통과 (aria-label 등)

---

### Task 3.2: DiagramPreview 컴포넌트 (TDD)

**1단계: RED - 테스트 작성**

```typescript
// apps/web/tests/components/DiagramPreview.test.tsx

import { describe, test, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { DiagramPreview } from '../../src/components/DiagramPreview';

describe('DiagramPreview', () => {
  test('로딩 중 스피너 표시', () => {
    render(<DiagramPreview data={null} isLoading={true} error={null} />);
    expect(screen.getByText(/AI가 다이어그램을 생성하고 있습니다/)).toBeDefined();
  });

  test('에러 발생 시 에러 메시지 표시', () => {
    render(
      <DiagramPreview
        data={null}
        isLoading={false}
        error={new Error('Generation failed')}
      />
    );
    expect(screen.getByText(/생성 실패/)).toBeDefined();
  });

  test('다이어그램 데이터 렌더링', () => {
    const mockData = {
      id: '1',
      type: 'flowchart',
      code: 'flowchart TD\nA-->B',
      duration: 5000,
      cached: false
    };

    render(<DiagramPreview data={mockData} isLoading={false} error={null} />);
    expect(screen.getByText(/생성 완료/)).toBeDefined();
    expect(screen.getByText(/5000ms/)).toBeDefined();
  });
});
```

**2단계: GREEN - 구현** (DiagramPreview.tsx)

**승인 조건**:
- ✅ 모든 상태(로딩/에러/성공) 테스트 통과
- ✅ Mermaid 렌더링 테스트 통과

---

### Task 3.3: API 통합 (useGenerateDiagram Hook)

**1단계: RED - Hook 테스트**

```typescript
// apps/web/tests/hooks/useGenerateDiagram.test.ts

import { describe, test, expect } from 'bun:test';
import { renderHook, waitFor } from '@testing-library/react';
import { useGenerateDiagram } from '../../src/hooks/useGenerateDiagram';

describe('useGenerateDiagram', () => {
  test('다이어그램 생성 성공', async () => {
    const { result } = renderHook(() => useGenerateDiagram());

    result.current.mutate({
      type: 'flowchart',
      prompt: '테스트'
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toHaveProperty('code');
    });
  }, { timeout: 30000 });

  test('API 오류 시 에러 처리', async () => {
    // Mock fetch to return error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500
      })
    ) as any;

    const { result } = renderHook(() => useGenerateDiagram());

    result.current.mutate({
      type: 'flowchart',
      prompt: '테스트'
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
```

**2단계: GREEN - Hook 구현**

**승인 조건**:
- ✅ API 호출 테스트 통과
- ✅ 에러 처리 테스트 통과
- ✅ 재시도 로직 테스트 통과

---

## ⚡ Phase 4: 통합 및 성능 최적화 (Week 4)

### Task 4.1: E2E 테스트 (Playwright)

```typescript
// tests/e2e/diagram-generation.spec.ts

import { test, expect } from '@playwright/test';

test.describe('다이어그램 생성 플로우', () => {
  test('플로우차트 생성 전체 플로우', async ({ page }) => {
    // 1. 홈페이지 접속
    await page.goto('http://localhost:5173');

    // 2. 타입 선택
    await page.selectOption('select', 'flowchart');

    // 3. 프롬프트 입력
    await page.fill('textarea', '로그인 프로세스: 시작 → 이메일 → 비밀번호');

    // 4. 생성 버튼 클릭
    await page.click('button:has-text("다이어그램 생성")');

    // 5. 로딩 상태 확인
    await expect(page.locator('text=생성 중')).toBeVisible();

    // 6. 완료 대기 (최대 30초)
    await expect(page.locator('text=생성 완료')).toBeVisible({ timeout: 30000 });

    // 7. SVG 렌더링 확인
    await expect(page.locator('svg')).toBeVisible();

    // 8. 코드 확인
    await page.click('summary:has-text("Mermaid 코드 보기")');
    await expect(page.locator('code')).toContainText('flowchart TD');
  });

  test('에러 처리 플로우', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 빈 프롬프트로 생성 시도
    await page.click('button:has-text("다이어그램 생성")');

    // 버튼이 비활성화되어야 함
    await expect(page.locator('button:has-text("다이어그램 생성")')).toBeDisabled();
  });
});
```

**승인 조건**:
- ✅ 모든 E2E 테스트 통과
- ✅ 크로스 브라우저 테스트 (Chrome, Firefox, Safari)

---

### Task 4.2: 성능 테스트 및 최적화

```typescript
// tests/performance/load-test.ts

import { describe, test, expect } from 'bun:test';

describe('Performance Tests', () => {
  test('100개 동시 요청 처리', async () => {
    const startTime = Date.now();
    const requests = Array(100).fill(null).map(() =>
      fetch('http://localhost:8787/api/diagrams/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'flowchart',
          prompt: 'test'
        })
      })
    );

    const responses = await Promise.all(requests);
    const duration = Date.now() - startTime;

    const successCount = responses.filter(r => r.ok).length;

    expect(successCount).toBeGreaterThanOrEqual(95); // 95% 이상 성공
    expect(duration).toBeLessThan(60000); // 1분 이내
  }, { timeout: 120000 });

  test('캐시 히트율 60% 이상', async () => {
    const prompt = 'unique-test-prompt-' + Date.now();

    // 첫 번째 요청 (캐시 미스)
    const res1 = await fetch('http://localhost:8787/api/diagrams/generate', {
      method: 'POST',
      body: JSON.stringify({ type: 'flowchart', prompt })
    });
    const data1 = await res1.json();
    expect(data1.cached).toBe(false);

    // 두 번째 요청 (캐시 히트)
    const res2 = await fetch('http://localhost:8787/api/diagrams/generate', {
      method: 'POST',
      body: JSON.stringify({ type: 'flowchart', prompt })
    });
    const data2 = await res2.json();
    expect(data2.cached).toBe(true);
  });
});
```

**승인 조건**:
- ✅ 동시 요청 테스트 통과
- ✅ 캐시 히트율 목표 달성
- ✅ p95 레이턴시 8초 이내

---

## 🧪 Phase 5: 베타 테스트 (Week 5)

### Task 5.1: 모니터링 설정

```typescript
// apps/api/src/middleware/monitoring.ts

import { Hono } from 'hono';

export function setupMonitoring(app: Hono) {
  // 요청 로깅
  app.use('*', async (c, next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;

    console.log(JSON.stringify({
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration,
      timestamp: new Date().toISOString()
    }));
  });

  // 에러 추적
  app.onError((err, c) => {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: c.req.path
    });

    return c.json({ error: 'Internal Server Error' }, 500);
  });
}
```

**테스트**:
```typescript
describe('Monitoring', () => {
  test('모든 요청 로깅 확인', async () => {
    // 로그 수집 확인
  });

  test('에러 발생 시 Sentry에 전송', async () => {
    // Sentry 통합 확인
  });
});
```

---

### Task 5.2: 베타 테스터 피드백 수집 시스템

```typescript
// apps/web/src/components/FeedbackButton.tsx

import { useState } from 'react';

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    await fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({
        feedback,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    });

    setOpen(false);
    setFeedback('');
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button onClick={() => setOpen(true)}>
        피드백 보내기
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50">
          <textarea value={feedback} onChange={e => setFeedback(e.target.value)} />
          <button onClick={handleSubmit}>전송</button>
        </div>
      )}
    </div>
  );
}
```

---

## 🚀 Phase 6: 정식 출시 (Week 6)

### Task 6.1: 프로덕션 배포 체크리스트

```bash
# 배포 전 체크리스트
- [ ] 모든 테스트 통과 (Unit + Integration + E2E)
- [ ] 보안 감사 완료 (npm audit, Snyk)
- [ ] 성능 테스트 통과
- [ ] 모니터링 설정 완료 (Sentry, Cloudflare Analytics)
- [ ] 백업 시스템 구축
- [ ] 롤백 계획 수립
- [ ] DNS 설정 완료
- [ ] SSL 인증서 확인
- [ ] 환경 변수 프로덕션 설정
- [ ] Rate Limiting 설정
```

---

## 🎯 Gate-Keeping 프로세스

### Phase Gate 체크리스트

각 Phase 종료 시 다음을 확인:

```yaml
Phase Completion Checklist:
  - [ ] 모든 Task 테스트 100% 통과
  - [ ] 코드 커버리지 80% 이상
  - [ ] ESLint/Prettier 검증 통과
  - [ ] TypeScript 타입 체크 통과
  - [ ] 코드 리뷰 완료
  - [ ] CI/CD 파이프라인 통과
  - [ ] 성능 기준 충족
  - [ ] 문서화 완료

Next Phase Approval:
  - [ ] Tech Lead 승인
  - [ ] 다음 Phase 준비 완료
```

### 자동화된 Gate

```yaml
# .github/workflows/phase-gate.yml

name: Phase Gate

on:
  workflow_dispatch:
    inputs:
      phase:
        description: 'Phase number to validate'
        required: true
        type: choice
        options:
          - '1'
          - '2'
          - '3'
          - '4'
          - '5'
          - '6'

jobs:
  phase-gate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Run all tests
        run: bun test

      - name: Check coverage
        run: bun run coverage

      - name: Verify coverage threshold
        run: |
          COVERAGE=$(bun run coverage --json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80%"
            exit 1
          fi

      - name: Build
        run: bun run build

      - name: Phase ${{ github.event.inputs.phase }} Gate Passed
        run: echo "✅ Phase ${{ github.event.inputs.phase }} Complete"
```

---

## 📊 진행 상황 대시보드

### 실시간 모니터링

```typescript
// scripts/progress-dashboard.ts

interface PhaseProgress {
  phase: number;
  name: string;
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    blocked: number;
  };
  tests: {
    total: number;
    passing: number;
    failing: number;
  };
  coverage: number;
  status: 'not-started' | 'in-progress' | 'blocked' | 'completed';
}

async function generateDashboard() {
  const phases: PhaseProgress[] = [
    {
      phase: 0,
      name: '사전 준비',
      tasks: { total: 2, completed: 2, inProgress: 0, blocked: 0 },
      tests: { total: 5, passing: 5, failing: 0 },
      coverage: 100,
      status: 'completed'
    },
    {
      phase: 1,
      name: '프로젝트 초기화',
      tasks: { total: 4, completed: 3, inProgress: 1, blocked: 0 },
      tests: { total: 15, passing: 14, failing: 1 },
      coverage: 85,
      status: 'in-progress'
    },
    // ... 나머지 Phase
  ];

  console.log('
┌─────────────────────────────────────────────────┐
│         SnapChart MVP 개발 진행 상황            │
├─────────────────────────────────────────────────┤
│                                                 │
│  Phase 0: ✅ 완료 (100%)                       │
│  Phase 1: 🔄 진행중 (75%)                      │
│  Phase 2: ⏳ 대기중                            │
│  Phase 3: ⏳ 대기중                            │
│  Phase 4: ⏳ 대기중                            │
│  Phase 5: ⏳ 대기중                            │
│  Phase 6: ⏳ 대기중                            │
│                                                 │
├─────────────────────────────────────────────────┤
│  전체 진행률: ███████░░░░░░░░░░░░░░ 36%        │
│  테스트 통과율: 95% (19/20)                    │
│  코드 커버리지: 85%                            │
│                                                 │
│  다음 마일스톤: Phase 1 완료 (1일 남음)        │
└─────────────────────────────────────────────────┘
  ');
}
```

---

## 🔧 트러블슈팅 가이드

### 일반적인 문제 해결

#### 문제 1: 테스트 실패
```bash
# 1. 특정 테스트만 실행
bun test --filter="DiagramGenerator"

# 2. 상세 로그 확인
bun test --verbose

# 3. 캐시 클리어 후 재시도
rm -rf node_modules/.cache
bun test
```

#### 문제 2: API 타임아웃
```typescript
// timeout 늘리기
test('긴 작업 테스트', async () => {
  // ...
}, { timeout: 60000 }); // 60초
```

#### 문제 3: 빌드 실패
```bash
# TypeScript 오류 확인
bun run type-check

# 린트 오류 확인
bun run lint

# 자동 수정
bun run lint --fix
```

---

## 📝 체크리스트 요약

### 개발 시작 전
- [ ] 모든 문서 검토 완료
- [ ] 팀원 역할 분담 완료
- [ ] 개발 환경 세팅 완료
- [ ] Git 브랜치 전략 합의

### 각 Task 시작 전
- [ ] 요구사항 명확히 이해
- [ ] 테스트 케이스 작성 (RED)
- [ ] 최소 구현 (GREEN)
- [ ] 리팩토링 (REFACTOR)

### 각 Task 완료 후
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료
- [ ] 문서 업데이트
- [ ] PR 생성 및 머지

### 각 Phase 완료 후
- [ ] Phase Gate 체크리스트 완료
- [ ] 통합 테스트 실행
- [ ] 성능 측정 및 기록
- [ ] 다음 Phase 계획 리뷰

---

**문서 작성 완료**
**작성자**: Claude Code
**작성일**: 2025-10-18
**다음 액션**: Phase 0 시작 (법적 준비 및 인프라 구축)
