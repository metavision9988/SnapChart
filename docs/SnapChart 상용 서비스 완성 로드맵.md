# SnapChart 상용 서비스 완성 로드맵

> **문서 버전**: v2.0 - Production Ready  
> **작성일**: 2025-10-17  
> **대상**: MVP → 상용 서비스 전환  
> **예상 기간**: 12주 (MVP 이후)

---

## 📊 Executive Summary

### 현재 상태 (MVP)
```
✅ 기술 검증: 100% 완료
✅ 다이어그램 타입: 8개 작동
✅ 평균 응답 시간: 5.5초
⚠️ 상용 서비스 기능: 30% 완료
```

### 상용 서비스로 가기 위한 Gap
```
❌ 사용자 인증/권한 (0%)
❌ 결제 시스템 (0%)
❌ 히스토리 관리 (0%)
❌ 팀 협업 기능 (0%)
❌ API 관리 (0%)
❌ 모니터링/로깅 (20%)
❌ 보안/컴플라이언스 (0%)
❌ 성능 최적화 (50%)
━━━━━━━━━━━━━━━━━━━━━━━━
전체 상용 준비도: 30%
```

---

## 🎯 Part 1: 필수 기능 (Phase 1 - 8주)

### 1.1 사용자 인증 시스템 (Week 1-2)

#### 요구사항
```
✅ 이메일/비밀번호 가입
✅ 소셜 로그인 (Google, GitHub)
✅ 이메일 인증
✅ 비밀번호 재설정
✅ 세션 관리
✅ JWT 토큰 인증
```

#### 기술 스택
```typescript
// 추천: Clerk.com (All-in-One 솔루션)
{
  "service": "Clerk",
  "features": [
    "소셜 로그인 (Google, GitHub, Microsoft)",
    "이메일 인증",
    "비밀번호 재설정",
    "다중 인증(MFA)",
    "세션 관리",
    "Webhook 지원"
  ],
  "pricing": {
    "free": "10,000 MAU",
    "pro": "$25/월 (시작 시)"
  }
}

// 대안: Supabase Auth (오픈소스)
{
  "service": "Supabase",
  "features": [
    "PostgreSQL 통합",
    "Row Level Security",
    "실시간 기능",
    "저장소 포함"
  ],
  "pricing": {
    "free": "50,000 MAU",
    "pro": "$25/월"
  }
}
```

#### 구현 예제

```typescript
// apps/api/src/middleware/auth.ts

import { Hono } from 'hono';
import { createClerkClient } from '@clerk/backend';

type Variables = {
  userId: string;
  user: User;
};

export function authMiddleware() {
  return async (c: Context<{ Variables: Variables }>, next: Next) => {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const token = authHeader.substring(7);
    
    try {
      const clerk = createClerkClient({
        secretKey: c.env.CLERK_SECRET_KEY
      });
      
      const verified = await clerk.verifyToken(token);
      
      if (!verified) {
        return c.json({ error: 'Invalid token' }, 401);
      }
      
      // 사용자 정보 조회
      const user = await clerk.users.getUser(verified.sub);
      
      c.set('userId', user.id);
      c.set('user', {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName + ' ' + user.lastName,
        plan: user.publicMetadata.plan || 'free'
      });
      
      await next();
    } catch (error) {
      return c.json({ error: 'Authentication failed' }, 401);
    }
  };
}

// 사용 예
app.post('/api/diagrams/generate', authMiddleware(), async (c) => {
  const user = c.get('user');
  
  // 플랜 체크
  if (user.plan === 'free') {
    const usage = await checkUsage(user.id);
    if (usage.monthly >= 10) {
      return c.json({
        error: 'Free tier limit reached',
        limit: 10,
        used: usage.monthly
      }, 429);
    }
  }
  
  // 다이어그램 생성...
});
```

#### 프론트엔드 통합

```typescript
// apps/web/src/App.tsx

import { ClerkProvider, SignIn, SignUp, useUser } from '@clerk/clerk-react';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AppContent />
    </ClerkProvider>
  );
}

function AppContent() {
  const { isSignedIn, user } = useUser();
  
  if (!isSignedIn) {
    return <SignIn />;
  }
  
  return (
    <div>
      <header>
        <span>환영합니다, {user.firstName}님!</span>
        <span>플랜: {user.publicMetadata.plan || 'Free'}</span>
      </header>
      <DiagramGenerator />
    </div>
  );
}
```

---

### 1.2 결제 시스템 (Week 3-4)

#### 요구사항
```
✅ Stripe 통합
✅ 구독 관리 (Free/Pro/Team)
✅ 자동 결제
✅ 영수증 발행
✅ 플랜 업그레이드/다운그레이드
✅ 환불 처리
✅ 사용량 추적
```

#### Stripe 구독 모델 설계

```typescript
// Stripe Products 설정

const STRIPE_PRODUCTS = {
  free: {
    priceId: null,
    features: {
      diagramsPerMonth: 10,
      diagramTypes: 'all',
      exportFormats: ['svg'],
      history: false,
      priority: false,
      api: false
    }
  },
  
  pro: {
    priceId: 'price_pro_monthly_7usd',
    price: 7,
    currency: 'USD',
    interval: 'month',
    features: {
      diagramsPerMonth: 'unlimited',
      diagramTypes: 'all',
      exportFormats: ['svg', 'png', 'pdf'],
      history: true,
      priority: true,
      api: false,
      storage: '1GB'
    }
  },
  
  team: {
    priceId: 'price_team_monthly_20usd',
    price: 20,
    currency: 'USD',
    interval: 'month',
    seats: 5,
    features: {
      diagramsPerMonth: 'unlimited',
      diagramTypes: 'all',
      exportFormats: ['svg', 'png', 'pdf'],
      history: true,
      priority: true,
      api: true,
      storage: '10GB',
      teamWorkspace: true,
      versionControl: true
    }
  }
};
```

#### Webhook 처리

```typescript
// apps/api/src/routes/webhooks.ts

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

app.post('/webhooks/stripe', async (c) => {
  const signature = c.req.header('stripe-signature');
  const body = await c.req.text();
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      c.env.STRIPE_WEBHOOK_SECRET
    );
    
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCancel(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
    }
    
    return c.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: 'Webhook processing failed' }, 400);
  }
});

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  const plan = subscription.items.data[0].price.metadata.plan;
  
  // Clerk 메타데이터 업데이트
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: {
      plan,
      subscriptionId: subscription.id,
      customerId: subscription.customer as string
    }
  });
  
  // DB 업데이트
  await db.prepare(`
    UPDATE users 
    SET plan = ?, subscription_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(plan, subscription.id, userId).run();
}
```

#### 프론트엔드 결제 UI

```typescript
// apps/web/src/components/PricingPage.tsx

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function PricingPage() {
  const { user } = useUser();
  const currentPlan = user?.publicMetadata.plan || 'free';
  
  const handleUpgrade = async (priceId: string) => {
    const response = await fetch('/api/checkout/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        userId: user?.id
      })
    });
    
    const { sessionId } = await response.json();
    
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId });
  };
  
  return (
    <div className="grid grid-cols-3 gap-8">
      {/* Free */}
      <PricingCard
        title="Free"
        price="$0"
        features={[
          '월 10개 다이어그램',
          '모든 타입 지원',
          'SVG 다운로드'
        ]}
        current={currentPlan === 'free'}
      />
      
      {/* Pro */}
      <PricingCard
        title="Pro"
        price="$7"
        features={[
          '무제한 다이어그램',
          '우선 처리',
          'PNG/PDF 내보내기',
          '히스토리 저장'
        ]}
        onUpgrade={() => handleUpgrade('price_pro_monthly_7usd')}
        current={currentPlan === 'pro'}
        popular
      />
      
      {/* Team */}
      <PricingCard
        title="Team"
        price="$20"
        features={[
          'Pro 모든 기능',
          '5명 팀원',
          'API 액세스',
          '팀 워크스페이스'
        ]}
        onUpgrade={() => handleUpgrade('price_team_monthly_20usd')}
        current={currentPlan === 'team'}
      />
    </div>
  );
}
```

---

### 1.3 사용량 추적 & 제한 (Week 3)

#### Rate Limiting 구현

```typescript
// apps/api/src/middleware/rate-limit.ts

interface RateLimitConfig {
  windowMs: number;    // 시간 윈도우 (밀리초)
  maxRequests: number; // 최대 요청 수
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  free: {
    windowMs: 24 * 60 * 60 * 1000, // 24시간
    maxRequests: 10
  },
  pro: {
    windowMs: 60 * 1000, // 1분
    maxRequests: 60
  },
  team: {
    windowMs: 60 * 1000,
    maxRequests: 300
  }
};

export function rateLimitMiddleware() {
  return async (c: Context, next: Next) => {
    const user = c.get('user');
    const plan = user.plan;
    const config = RATE_LIMITS[plan];
    
    // Redis에서 현재 사용량 확인
    const key = `rate-limit:${user.id}:${Date.now() / config.windowMs | 0}`;
    const current = await c.env.REDIS.get(key);
    const count = current ? parseInt(current) : 0;
    
    if (count >= config.maxRequests) {
      const resetTime = Math.ceil((Date.now() / config.windowMs + 1) * config.windowMs);
      
      return c.json({
        error: 'Rate limit exceeded',
        limit: config.maxRequests,
        used: count,
        resetAt: new Date(resetTime).toISOString()
      }, 429);
    }
    
    // 카운트 증가
    await c.env.REDIS.set(key, (count + 1).toString(), {
      ex: Math.ceil(config.windowMs / 1000)
    });
    
    // 헤더에 사용량 정보 추가
    c.res.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    c.res.headers.set('X-RateLimit-Remaining', (config.maxRequests - count - 1).toString());
    
    await next();
  };
}
```

#### 사용량 대시보드

```typescript
// apps/web/src/components/UsageDashboard.tsx

export function UsageDashboard() {
  const { data: usage } = useQuery({
    queryKey: ['usage'],
    queryFn: async () => {
      const res = await fetch('/api/usage');
      return res.json();
    }
  });
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">사용량</h2>
      
      <div className="grid grid-cols-3 gap-6">
        <StatCard
          title="이번 달 생성"
          value={usage?.monthly || 0}
          max={usage?.limit === 'unlimited' ? '∞' : usage?.limit}
          percentage={usage?.limit === 'unlimited' ? 0 : (usage?.monthly / usage?.limit * 100)}
        />
        
        <StatCard
          title="총 생성"
          value={usage?.total || 0}
        />
        
        <StatCard
          title="저장된 다이어그램"
          value={usage?.saved || 0}
          max={usage?.storageLimit}
        />
      </div>
      
      {/* 차트 */}
      <UsageChart data={usage?.history} />
      
      {/* 업그레이드 CTA */}
      {usage?.monthly >= usage?.limit * 0.8 && (
        <Alert variant="warning">
          <AlertTitle>사용량이 80%에 도달했습니다</AlertTitle>
          <AlertDescription>
            Pro 플랜으로 업그레이드하여 무제한으로 사용하세요.
            <Button onClick={() => navigate('/pricing')}>
              업그레이드
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
```

---

### 1.4 히스토리 & 버전 관리 (Week 4-5)

#### 데이터베이스 스키마

```sql
-- Cloudflare D1

CREATE TABLE diagrams (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT,
  prompt TEXT NOT NULL,
  code TEXT NOT NULL,
  svg TEXT,
  version INTEGER DEFAULT 1,
  parent_id TEXT, -- 이전 버전 참조
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES diagrams(id)
);

CREATE INDEX idx_diagrams_user ON diagrams(user_id, created_at DESC);
CREATE INDEX idx_diagrams_type ON diagrams(type);
CREATE INDEX idx_diagrams_parent ON diagrams(parent_id);

CREATE TABLE diagram_shares (
  id TEXT PRIMARY KEY,
  diagram_id TEXT NOT NULL,
  shared_by TEXT NOT NULL,
  shared_with TEXT, -- NULL = public link
  permission TEXT CHECK(permission IN ('view', 'edit')),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (diagram_id) REFERENCES diagrams(id)
);

CREATE TABLE teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  plan TEXT DEFAULT 'team',
  subscription_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_members (
  team_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT CHECK(role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (team_id, user_id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);
```

#### API 엔드포인트

```typescript
// apps/api/src/routes/diagrams.ts

// 히스토리 조회
app.get('/api/diagrams', authMiddleware(), async (c) => {
  const user = c.get('user');
  const { page = 1, limit = 20, type } = c.req.query();
  
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  let query = `
    SELECT id, type, title, created_at, updated_at
    FROM diagrams
    WHERE user_id = ?
  `;
  
  const params = [user.id];
  
  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }
  
  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);
  
  const diagrams = await c.env.DB.prepare(query).bind(...params).all();
  
  return c.json({
    diagrams: diagrams.results,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: diagrams.results.length
    }
  });
});

// 다이어그램 저장
app.post('/api/diagrams', authMiddleware(), async (c) => {
  const user = c.get('user');
  const { type, title, prompt, code, svg } = await c.req.json();
  
  const id = nanoid();
  
  await c.env.DB.prepare(`
    INSERT INTO diagrams (id, user_id, type, title, prompt, code, svg)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(id, user.id, type, title, prompt, code, svg).run();
  
  return c.json({ id, message: 'Diagram saved' });
});

// 버전 생성 (수정)
app.put('/api/diagrams/:id', authMiddleware(), async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();
  const { code, prompt } = await c.req.json();
  
  // 기존 다이어그램 조회
  const original = await c.env.DB.prepare(
    'SELECT version FROM diagrams WHERE id = ? AND user_id = ?'
  ).bind(id, user.id).first();
  
  if (!original) {
    return c.json({ error: 'Diagram not found' }, 404);
  }
  
  const newId = nanoid();
  const newVersion = (original.version as number) + 1;
  
  // 새 버전 생성
  await c.env.DB.prepare(`
    INSERT INTO diagrams (id, user_id, type, title, prompt, code, version, parent_id)
    SELECT ?, user_id, type, title, ?, ?, ?, ?
    FROM diagrams WHERE id = ?
  `).bind(newId, prompt, code, newVersion, id, id).run();
  
  return c.json({ id: newId, version: newVersion });
});

// 버전 히스토리 조회
app.get('/api/diagrams/:id/versions', authMiddleware(), async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();
  
  const versions = await c.env.DB.prepare(`
    WITH RECURSIVE versions AS (
      SELECT * FROM diagrams WHERE id = ? AND user_id = ?
      UNION ALL
      SELECT d.* FROM diagrams d
      INNER JOIN versions v ON d.parent_id = v.id
    )
    SELECT id, version, created_at, prompt
    FROM versions
    ORDER BY version DESC
  `).bind(id, user.id).all();
  
  return c.json({ versions: versions.results });
});
```

---

### 1.5 팀 협업 기능 (Week 5-6)

#### 팀 워크스페이스

```typescript
// apps/api/src/routes/teams.ts

// 팀 생성
app.post('/api/teams', authMiddleware(), async (c) => {
  const user = c.get('user');
  
  // Team 플랜 체크
  if (user.plan !== 'team') {
    return c.json({
      error: 'Team plan required',
      upgrade: '/pricing'
    }, 403);
  }
  
  const { name } = await c.req.json();
  const teamId = nanoid();
  
  await c.env.DB.batch([
    c.env.DB.prepare(
      'INSERT INTO teams (id, name, owner_id) VALUES (?, ?, ?)'
    ).bind(teamId, name, user.id),
    
    c.env.DB.prepare(
      'INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, ?)'
    ).bind(teamId, user.id, 'owner')
  ]);
  
  return c.json({ teamId, name });
});

// 팀원 초대
app.post('/api/teams/:teamId/invite', authMiddleware(), async (c) => {
  const user = c.get('user');
  const { teamId } = c.req.param();
  const { email, role = 'member' } = await c.req.json();
  
  // 권한 체크
  const member = await c.env.DB.prepare(
    'SELECT role FROM team_members WHERE team_id = ? AND user_id = ?'
  ).bind(teamId, user.id).first();
  
  if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
    return c.json({ error: 'Permission denied' }, 403);
  }
  
  // 이메일로 사용자 찾기 (Clerk)
  const invitedUser = await clerk.users.getUserList({ emailAddress: [email] });
  
  if (!invitedUser.length) {
    // 초대 이메일 발송
    await sendInviteEmail(email, teamId);
    return c.json({ message: 'Invitation sent' });
  }
  
  // 팀원 추가
  await c.env.DB.prepare(
    'INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, ?)'
  ).bind(teamId, invitedUser[0].id, role).run();
  
  return c.json({ message: 'Member added' });
});

// 팀 다이어그램 조회
app.get('/api/teams/:teamId/diagrams', authMiddleware(), async (c) => {
  const user = c.get('user');
  const { teamId } = c.req.param();
  
  // 팀원인지 확인
  const member = await c.env.DB.prepare(
    'SELECT role FROM team_members WHERE team_id = ? AND user_id = ?'
  ).bind(teamId, user.id).first();
  
  if (!member) {
    return c.json({ error: 'Not a team member' }, 403);
  }
  
  // 팀의 모든 다이어그램 조회
  const diagrams = await c.env.DB.prepare(`
    SELECT d.id, d.type, d.title, d.created_at, u.email as creator
    FROM diagrams d
    JOIN team_members tm ON d.user_id = tm.user_id
    LEFT JOIN users u ON d.user_id = u.id
    WHERE tm.team_id = ?
    ORDER BY d.created_at DESC
  `).bind(teamId).all();
  
  return c.json({ diagrams: diagrams.results });
});
```

#### 실시간 협업 (선택)

```typescript
// WebSocket을 이용한 실시간 편집 (Cloudflare Durable Objects 사용)

export class DiagramSession {
  state: DurableObjectState;
  sessions: Map<string, WebSocket>;
  currentCode: string;
  
  constructor(state: DurableObjectState) {
    this.state = state;
    this.sessions = new Map();
    this.currentCode = '';
  }
  
  async fetch(request: Request) {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    
    server.accept();
    
    const userId = new URL(request.url).searchParams.get('userId');
    this.sessions.set(userId!, server);
    
    // 현재 코드 전송
    server.send(JSON.stringify({
      type: 'sync',
      code: this.currentCode
    }));
    
    server.addEventListener('message', (msg) => {
      const data = JSON.parse(msg.data as string);
      
      if (data.type === 'update') {
        this.currentCode = data.code;
        
        // 다른 모든 세션에 브로드캐스트
        this.sessions.forEach((session, id) => {
          if (id !== userId) {
            session.send(JSON.stringify({
              type: 'update',
              code: data.code,
              userId
            }));
          }
        });
      }
    });
    
    return new Response(null, {
      status: 101,
      webSocket: client
    });
  }
}
```

---

## 🔧 Part 2: 성능 최적화 & 리팩토링 (Phase 2 - 4주)

### 2.1 코드 리팩토링

#### 병목 지점 분석

```typescript
// 현재 병목 지점:
// 1. Mermaid 렌더링 (클라이언트)
// 2. API 응답 시간 (5.5초)
// 3. 캐시 미스 시 재생성

// 개선 방안:

// 1️⃣ 서버 사이드 렌더링 (Puppeteer)
async function renderDiagramServer(code: string): Promise<string> {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
      </head>
      <body>
        <div class="mermaid">${code}</div>
        <script>
          mermaid.initialize({ startOnLoad: true });
        </script>
      </body>
    </html>
  `);
  
  await page.waitForSelector('.mermaid svg');
  
  const svg = await page.$eval('.mermaid svg', el => el.outerHTML);
  
  await browser.close();
  
  return svg;
}

// 2️⃣ 스트리밍 응답
app.post('/api/diagrams/generate/stream', authMiddleware(), async (c) => {
  const { type, prompt } = await c.req.json();
  
  const stream = new ReadableStream({
    async start(controller) {
      // 1. 즉시 "생성 시작" 전송
      controller.enqueue(
        new TextEncoder().encode(JSON.stringify({
          status: 'started',
          timestamp: Date.now()
        }) + '\n')
      );
      
      // 2. AI 코드 생성
      const generator = new DiagramGenerator(/*...*/);
      const { code } = await generator.generate(type, prompt);
      
      controller.enqueue(
        new TextEncoder().encode(JSON.stringify({
          status: 'code-generated',
          code,
          timestamp: Date.now()
        }) + '\n')
      );
      
      // 3. SVG 렌더링 (서버)
      const svg = await renderDiagramServer(code);
      
      controller.enqueue(
        new TextEncoder().encode(JSON.stringify({
          status: 'completed',
          code,
          svg,
          timestamp: Date.now()
        }) + '\n')
      );
      
      controller.close();
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
});

// 3️⃣ 프롬프트 최적화 (토큰 수 감소)
function optimizePrompt(userPrompt: string): string {
  // 불필요한 단어 제거
  const stopWords = ['그', '이', '저', '것', '수', '등', '및', '또는'];
  
  let optimized = userPrompt
    .split(' ')
    .filter(word => !stopWords.includes(word))
    .join(' ');
  
  // 축약
  optimized = optimized
    .replace(/프로세스/g, '프로')
    .replace(/다이어그램/g, '도')
    .replace(/사용자/g, '유저');
  
  return optimized;
}

// 4️⃣ 배치 처리
app.post('/api/diagrams/batch', authMiddleware(), async (c) => {
  const { diagrams } = await c.req.json(); // 최대 10개
  
  const results = await Promise.all(
    diagrams.map(async ({ type, prompt }) => {
      try {
        return await generator.generate(type, prompt);
      } catch (error) {
        return { error: error.message };
      }
    })
  );
  
  return c.json({ results });
});
```

#### 에러 처리 개선

```typescript
// apps/api/src/lib/error-handler.ts

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string,
    public details?: any
  ) {
    super(message);
  }
}

// 에러 타입 정의
export const ErrorCodes = {
  // 인증
  UNAUTHORIZED: { code: 'UNAUTHORIZED', status: 401 },
  FORBIDDEN: { code: 'FORBIDDEN', status: 403 },
  
  // 사용량
  RATE_LIMIT_EXCEEDED: { code: 'RATE_LIMIT_EXCEEDED', status: 429 },
  QUOTA_EXCEEDED: { code: 'QUOTA_EXCEEDED', status: 429 },
  
  // 생성
  GENERATION_FAILED: { code: 'GENERATION_FAILED', status: 500 },
  INVALID_DIAGRAM_TYPE: { code: 'INVALID_DIAGRAM_TYPE', status: 400 },
  INVALID_PROMPT: { code: 'INVALID_PROMPT', status: 400 },
  
  // 시스템
  API_UNAVAILABLE: { code: 'API_UNAVAILABLE', status: 503 },
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', status: 500 }
};

// 글로벌 에러 핸들러
export function errorHandler() {
  return async (c: Context, next: Next) => {
    try {
      await next();
    } catch (error) {
      if (error instanceof AppError) {
        return c.json({
          error: {
            code: error.code,
            message: error.message,
            details: error.details
          }
        }, error.statusCode);
      }
      
      // 예상치 못한 에러
      console.error('Unexpected error:', error);
      
      return c.json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred'
        }
      }, 500);
    }
  };
}

// 사용 예
app.use('*', errorHandler());

app.post('/api/diagrams/generate', authMiddleware(), async (c) => {
  const { type, prompt } = await c.req.json();
  
  if (!SUPPORTED_TYPES.includes(type)) {
    throw new AppError(
      'Invalid diagram type',
      400,
      'INVALID_DIAGRAM_TYPE',
      { supportedTypes: SUPPORTED_TYPES }
    );
  }
  
  if (!prompt || prompt.length < 10) {
    throw new AppError(
      'Prompt too short',
      400,
      'INVALID_PROMPT',
      { minLength: 10 }
    );
  }
  
  // ...생성 로직
});
```

---

### 2.2 모니터링 & 로깅

#### Sentry 통합

```typescript
// apps/api/src/index.ts

import * as Sentry from '@sentry/cloudflare';

Sentry.init({
  dsn: 'your-sentry-dsn',
  tracesSampleRate: 0.1, // 10% 트랜잭션 추적
  environment: process.env.ENVIRONMENT
});

// 에러 캡처
app.onError((err, c) => {
  Sentry.captureException(err, {
    contexts: {
      request: {
        method: c.req.method,
        url: c.req.url,
        headers: Object.fromEntries(c.req.headers)
      },
      user: c.get('user') ? {
        id: c.get('user').id,
        email: c.get('user').email
      } : undefined
    }
  });
  
  return c.json({ error: 'Internal server error' }, 500);
});

// 성능 추적
app.use('*', async (c, next) => {
  const transaction = Sentry.startTransaction({
    op: 'http.server',
    name: `${c.req.method} ${c.req.path}`
  });
  
  const startTime = Date.now();
  
  await next();
  
  transaction.setHttpStatus(c.res.status);
  transaction.setData('duration', Date.now() - startTime);
  transaction.finish();
});
```

#### 구조화된 로깅

```typescript
// apps/api/src/lib/logger.ts

export class Logger {
  constructor(private env: string) {}
  
  info(message: string, metadata?: any) {
    this.log('INFO', message, metadata);
  }
  
  error(message: string, error?: Error, metadata?: any) {
    this.log('ERROR', message, {
      ...metadata,
      error: {
        message: error?.message,
        stack: error?.stack
      }
    });
  }
  
  warn(message: string, metadata?: any) {
    this.log('WARN', message, metadata);
  }
  
  private log(level: string, message: string, metadata?: any) {
    const log = {
      timestamp: new Date().toISOString(),
      level,
      message,
      env: this.env,
      ...metadata
    };
    
    console.log(JSON.stringify(log));
  }
}

// 사용 예
const logger = new Logger(c.env.ENVIRONMENT);

logger.info('Diagram generated', {
  userId: user.id,
  type,
  duration: Date.now() - startTime,
  cached: false
});
```

#### 메트릭 대시보드

```typescript
// apps/api/src/routes/admin.ts

app.get('/api/admin/metrics', async (c) => {
  // API 키 인증
  const apiKey = c.req.header('X-API-Key');
  if (apiKey !== c.env.ADMIN_API_KEY) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const metrics = await c.env.DB.prepare(`
    SELECT
      DATE(created_at) as date,
      type,
      COUNT(*) as count,
      AVG(duration) as avg_duration,
      SUM(CASE WHEN cached = 1 THEN 1 ELSE 0 END) as cache_hits
    FROM diagrams
    WHERE created_at >= DATE('now', '-30 days')
    GROUP BY DATE(created_at), type
    ORDER BY date DESC, count DESC
  `).all();
  
  return c.json({ metrics: metrics.results });
});
```

---

## 🎨 Part 3: 2차 고도화 - 추가 다이어그램 (Phase 3 - 4주)

### 3.1 신규 다이어그램 타입 검증

#### 추가 가능 타입 (7개)

```typescript
const NEW_DIAGRAM_TYPES = {
  // 1. 마인드맵
  mindmap: {
    priority: 'HIGH',
    complexity: 'MEDIUM',
    estimatedDevelopment: '3 days',
    marketDemand: 'HIGH',
    use cases: ['브레인스토밍', '학습 노트', '프로젝트 기획']
  },
  
  // 2. 클래스 다이어그램
  class: {
    priority: 'HIGH',
    complexity: 'HIGH',
    estimatedDevelopment: '5 days',
    marketDemand: 'MEDIUM',
    useCase: ['소프트웨어 설계', 'UML', 'OOP 문서화']
  },
  
  // 3. 타임라인
  timeline: {
    priority: 'MEDIUM',
    complexity: 'LOW',
    estimatedDevelopment: '2 days',
    marketDemand: 'MEDIUM',
    useCases: ['프로젝트 히스토리', '회사 연혁', '로드맵']
  },
  
  // 4. Git 그래프
  gitGraph: {
    priority: 'MEDIUM',
    complexity: 'MEDIUM',
    estimatedDevelopment: '3 days',
    marketDemand: 'LOW',
    useCases: ['Git 워크플로우 설명', '브랜치 전략 문서화']
  },
  
  // 5. C4 다이어그램
  c4: {
    priority: 'LOW',
    complexity: 'HIGH',
    estimatedDevelopment: '7 days',
    marketDemand: 'LOW',
    useCases: ['아키텍처 설계', 'MSA 문서화']
  },
  
  // 6. 사분면 차트
  quadrant: {
    priority: 'HIGH',
    complexity: 'LOW',
    estimatedDevelopment: '2 days',
    marketDemand: 'HIGH',
    useCases: ['SWOT 분석', '우선순위 매트릭스', '포지셔닝 맵']
  },
  
  // 7. 요구사항 다이어그램
  requirement: {
    priority: 'LOW',
    complexity: 'MEDIUM',
    estimatedDevelopment: '4 days',
    marketDemand: 'LOW',
    useCases: ['시스템 요구사항 분석', 'SysML']
  }
};
```

#### 우선순위 결정

```
🥇 Phase 3A: 즉시 추가 (2주)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 마인드맵 (수요 높음 + 개발 쉬움)
2. 사분면 차트 (수요 높음 + 개발 쉬움)
3. 타임라인 (수요 보통 + 개발 쉬움)

🥈 Phase 3B: 후속 추가 (2주)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. 클래스 다이어그램 (수요 보통 + 개발 복잡)
5. Git 그래프 (수요 낮음 + 개발 보통)

⏸️ 보류
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. C4 다이어그램 (수요 낮음 + 개발 매우 복잡)
7. 요구사항 다이어그램 (수요 낮음)
```

### 3.2 마인드맵 구현 예제

```typescript
// Few-Shot 프롬프트
const MINDMAP_CONFIG = {
  systemPrompt: `당신은 Mermaid 마인드맵 전문가입니다.

**중요 규칙**:
1. \`mindmap\`로 시작
2. root로 중심 주제 시작
3. 들여쓰기로 계층 표현
4. 한국어 사용
5. 코드만 출력

**출력 예제**:
mindmap
  root((중심 주제))
    주제 1
      세부 1-1
      세부 1-2
    주제 2
      세부 2-1`,
  
  fewShotExamples: [
    {
      input: '웹 개발 학습 계획',
      output: `mindmap
  root((웹 개발))
    프론트엔드
      HTML/CSS
      JavaScript
      React
    백엔드
      Node.js
      Express
      데이터베이스
    배포
      Git
      Docker
      AWS`
    },
    {
      input: '마케팅 전략',
      output: `mindmap
  root((마케팅))
    온라인
      SEO
      SNS 마케팅
      이메일 마케팅
    오프라인
      이벤트
      전시회
      네트워킹`
    }
  ]
};

// 테스트
async function testMindmap() {
  const generator = new DiagramGenerator(/*...*/);
  
  const test = await generator.generate(
    'mindmap',
    '프로젝트 관리 프로세스'
  );
  
  console.log('✅ 마인드맵 생성 성공');
  console.log(test.code);
  
  // 예상 출력:
  // mindmap
  //   root((프로젝트 관리))
  //     계획
  //       목표 설정
  //       일정 수립
  //     실행
  //       작업 배분
  //       진행 추적
  //     종료
  //       결과 분석
  //       문서화
}
```

### 3.3 사분면 차트 구현

```typescript
const QUADRANT_CONFIG = {
  systemPrompt: `당신은 Mermaid 사분면 차트 전문가입니다.

**중요 규칙**:
1. \`quadrantChart\`로 시작
2. title 라인 추가
3. x-axis "레이블1" --> "레이블2" 형식
4. y-axis "레이블1" --> "레이블2" 형식
5. quadrant-1~4 정의
6. 데이터: 항목: [x, y] 형식

**출력 예제**:
quadrantChart
    title SWOT 분석
    x-axis 내부 요인 --> 외부 요인
    y-axis 부정적 --> 긍정적
    quadrant-1 기회
    quadrant-2 강점
    quadrant-3 위협
    quadrant-4 약점
    A: [0.3, 0.6]
    B: [0.45, 0.23]`,
  
  fewShotExamples: [
    {
      input: '우선순위 매트릭스',
      output: `quadrantChart
    title 작업 우선순위
    x-axis 낮은 중요도 --> 높은 중요도
    y-axis 낮은 긴급도 --> 높은 긴급도
    quadrant-1 지금 해야 할 일
    quadrant-2 계획이 필요한 일
    quadrant-3 위임할 일
    quadrant-4 하지 말아야 할 일
    버그 수정: [0.8, 0.9]
    리팩토링: [0.7, 0.3]
    회의: [0.2, 0.5]`
    }
  ]
};
```

---

## 📊 Part 4: 출시 전 체크리스트

### 4.1 기술적 체크리스트

```markdown
## 인프라
- [ ] Cloudflare Workers 배포 완료
- [ ] Cloudflare D1 프로덕션 DB 설정
- [ ] Cloudflare KV 캐시 설정
- [ ] CDN 설정 (정적 자산)
- [ ] 도메인 연결 (snapchart.io)
- [ ] SSL 인증서 자동 갱신

## 보안
- [ ] API 키 환경 변수 관리
- [ ] CORS 설정
- [ ] Rate Limiting 적용
- [ ] XSS 방어
- [ ] CSRF 방어
- [ ] SQL Injection 방어 (Prepared Statements)

## 성능
- [ ] Redis 캐싱 구현 (60% 적중률 목표)
- [ ] SVG 압축 (gzip)
- [ ] 이미지 최적화 (WebP)
- [ ] 코드 스플리팅
- [ ] Lazy Loading
- [ ] Lighthouse 점수 90+ (Performance)

## 모니터링
- [ ] Sentry 에러 추적
- [ ] Cloudflare Analytics
- [ ] Custom 메트릭 (API 사용량)
- [ ] 알림 설정 (에러율 > 5%)
- [ ] 로그 보관 정책 (30일)

## 백업
- [ ] DB 일일 백업
- [ ] 백업 복구 테스트
- [ ] 재해 복구 계획 (DR)

## 테스트
- [ ] 단위 테스트 커버리지 80%+
- [ ] E2E 테스트 20개 시나리오
- [ ] 부하 테스트 (1,000 req/min)
- [ ] 보안 스캔 (OWASP)
- [ ] 브라우저 호환성 (Chrome, Safari, Firefox)
- [ ] 모바일 테스트 (iOS, Android)
```

### 4.2 법적 체크리스트

```markdown
## 약관 및 정책
- [ ] 이용약관 작성
- [ ] 개인정보 처리방침
- [ ] 환불 정책
- [ ] 저작권 정책
- [ ] 쿠키 정책

## 컴플라이언스
- [ ] GDPR 준수 (EU 사용자 대상 시)
- [ ] CCPA 준수 (캘리포니아 사용자 대상 시)
- [ ] 한국 개인정보보호법 준수

## 지적 재산권
- [ ] 상표권 출원 완료
- [ ] 도메인 소유권 확인
- [ ] 로고 저작권 등록
```

### 4.3 비즈니스 체크리스트

```markdown
## 결제 시스템
- [ ] Stripe 프로덕션 계정
- [ ] 가격 정책 확정
- [ ] 세금 설정 (VAT 등)
- [ ] 영수증 이메일 템플릿
- [ ] 구독 갱신 알림

## 고객 지원
- [ ] 고객 지원 이메일 (support@snapchart.io)
- [ ] FAQ 페이지 작성
- [ ] 튜토리얼 영상 제작
- [ ] 챗봇 설정 (선택)

## 마케팅
- [ ] Product Hunt 등록
- [ ] Twitter/X 계정
- [ ] LinkedIn 페이지
- [ ] 블로그 포스트 3개
- [ ] 데모 영상 (2분)
- [ ] 프레스 킷
```

---

## 💰 Part 5: 비용 예측 (상용 서비스)

### 5.1 인프라 비용

```
월간 비용 (5,000 DAU 기준)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cloudflare Workers:    $0 (무료 100k req/일)
Cloudflare D1:         $0 (무료 5GB)
Cloudflare KV:         $5 (100k read/일)
Cloudflare R2:         $5 (10GB 저장)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
인프라 소계:           $10/월

API 비용
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Gemini API:            $540/월 (90%)
Claude API (Fallback): $50/월 (5%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API 소계:              $590/월

서비스 비용
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Clerk (인증):          $25/월
Stripe (결제):         ~$105/월 (3% of $3,500)
Sentry (모니터링):     $26/월
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
서비스 소계:           $156/월

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
총 월간 비용:          $756/월

예상 수익:             $3,500/월
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
순이익:                $2,744/월 (78% 마진)
```

---

## 🎯 최종 요약

### 상용 서비스 완성 로드맵

```
Phase 1: 필수 기능 (8주)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Week 1-2: 사용자 인증 (Clerk)
Week 3-4: 결제 시스템 (Stripe)
Week 4-5: 히스토리 & 버전 관리
Week 5-6: 팀 협업 기능
Week 7-8: 통합 테스트

Phase 2: 최적화 (4주)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Week 9: 코드 리팩토링
Week 10: 성능 최적화
Week 11: 모니터링 & 로깅
Week 12: 보안 강화

Phase 3: 2차 고도화 (4주)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Week 13-14: 신규 다이어그램 3개
  - 마인드맵
  - 사분면 차트
  - 타임라인
Week 15-16: 베타 테스트 & 수정

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
총 소요 기간: 16주 (4개월)
정식 출시: 2026년 2월
```

### 개발 우선순위

```
🔴 Critical (즉시):
- 사용자 인증
- 결제 시스템
- Rate Limiting

🟡 High (2주 내):
- 히스토리 저장
- 에러 처리 개선
- 모니터링

🟢 Medium (4주 내):
- 팀 협업
- 성능 최적화
- 추가 다이어그램

🔵 Low (보류):
- 실시간 협업
- C4 다이어그램
- 모바일 앱
```

---

**로드맵 작성 완료**  
**작성자**: 덱스 (풀스택) + 레오 (디자이너) + 서펜트 (시스템)  
**다음 단계**: Phase 1 착수 승인 대기