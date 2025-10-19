# SnapChart UI/UX 디자인 가이드 & 영감 모음

> **작성**: 레오 (UI/UX 디자이너) + 덱스 (풀스택)  
> **목적**: 시각화 중심 서비스의 UI/UX 설계 가이드  
> **작성일**: 2025-10-17

---

## 🎨 Part 1: 참고할 최고의 다이어그램/시각화 도구들

### 1. Figma (Industry Standard)
```
URL: https://www.figma.com
왜 참고해야 하는가:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 클린하고 미니멀한 인터페이스
✅ 직관적인 툴바 배치
✅ 실시간 협업 UI의 교과서
✅ 드래그 앤 드롭의 정석
✅ 레이어 패널의 완벽한 설계

배울 점:
- 왼쪽 사이드바: 레이어/에셋 구조
- 상단 툴바: 자주 쓰는 기능만 노출
- 오른쪽 패널: 속성 인스펙터
- 중앙 캔버스: 무한 스크롤
- 컬러 코드: #0D99FF (브랜드 블루)
```

**Figma 스크린샷 참고 요소**:
- 툴바 아이콘 디자인 (16x16px, 단색)
- 패널 분할 레이아웃
- 속성 그룹핑 방식
- 드롭다운 메뉴 스타일

---

### 2. Miro (Collaborative Whiteboard)
```
URL: https://miro.com
왜 참고해야 하는가:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 무한 캔버스 UX의 선구자
✅ 줌/패닝의 부드러운 애니메이션
✅ 실시간 커서 표시 (협업)
✅ 스티커 노트 UI
✅ 밝고 친근한 디자인

배울 점:
- 줌 컨트롤 (우하단 고정)
- 미니맵 (좌하단)
- 플로팅 툴바 (상황별 표시)
- 템플릿 갤러리 UI
- 컬러 팔레트: 파스텔 톤
```

**Miro 스타일 적용**:
- 다이어그램 배경: 그리드 또는 도트 패턴
- 노드 스타일: 둥근 모서리 (border-radius: 8px)
- 연결선: Bezier 곡선 (부드러운 느낌)
- 드래그 시 가이드라인 표시

---

### 3. Mermaid Live Editor
```
URL: https://mermaid.live
왜 참고해야 하는가:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 코드-프리뷰 분할 레이아웃
✅ 실시간 렌더링 피드백
✅ 테마 전환 (Light/Dark)
✅ 내보내기 옵션 (SVG/PNG/PDF)
✅ 에러 메시지 표시 (빨간 밑줄)

배울 점:
- 좌우 분할 (50:50 또는 40:60)
- 코드 에디터: Monaco Editor 스타일
- 줌 슬라이더 (프리뷰 영역)
- 예제 갤러리 드롭다운
- 다운로드 버튼 배치
```

**SnapChart 적용 방안**:
```typescript
// 레이아웃 구조
<div className="grid grid-cols-2 h-screen">
  {/* 왼쪽: 입력 영역 */}
  <div className="bg-gray-50 p-6">
    <textarea 
      placeholder="다이어그램 설명을 입력하세요..."
      className="w-full h-full"
    />
  </div>
  
  {/* 오른쪽: 미리보기 */}
  <div className="bg-white p-6 relative">
    <div className="mermaid-preview">
      {/* 생성된 다이어그램 */}
    </div>
    
    {/* 줌 컨트롤 */}
    <div className="absolute bottom-4 right-4">
      <button>🔍 -</button>
      <span>100%</span>
      <button>🔍 +</button>
    </div>
  </div>
</div>
```

---

### 4. Excalidraw (Hand-Drawn Style)
```
URL: https://excalidraw.com
왜 참고해야 하는가:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 손그림 느낌의 독특한 스타일
✅ 색상 선택기 (8색 팔레트)
✅ 간단한 툴바 (6-8개 도구)
✅ 캔버스 중심 디자인
✅ 협업 시 실시간 애니메이션

배울 점:
- 미니멀 툴바 (상단 중앙)
- 색상 팔레트: 8색으로 제한
- 손그림 효과 (RoughJS 라이브러리)
- 파일 메뉴 (좌상단 햄버거)
```

**SnapChart 차별화 포인트**:
```typescript
// Excalidraw 스타일 옵션 제공
const STYLE_OPTIONS = {
  clean: {
    label: '클린',
    example: '━━━ ▣ ━━━'
  },
  handDrawn: {
    label: '손그림',
    example: '~~~~ ▢ ~~~~'
  },
  minimal: {
    label: '미니멀',
    example: '─── □ ───'
  }
};
```

---

### 5. Lucidchart (Enterprise Standard)
```
URL: https://www.lucidchart.com
왜 참고해야 하는가:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 전문적인 기업용 UI
✅ 왼쪽 셰이프 라이브러리
✅ 템플릿 갤러리 (카테고리별)
✅ 협업 기능 (댓글, 멘션)
✅ 버전 히스토리 UI

배울 점:
- 3단 레이아웃 (도구-캔버스-속성)
- 셰이프 검색 기능
- 스마트 컨테이너
- 프레젠테이션 모드
```

---

### 6. Draw.io (오픈소스)
```
URL: https://app.diagrams.net
왜 참고해야 하는가:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 무료 + 기능 풍부
✅ 오프라인 작동
✅ 다양한 저장 옵션 (Google Drive 등)
✅ 레거시 UI 참고용
✅ 키보드 단축키 완벽 지원

배울 점:
- 파일 메뉴 구조
- 내보내기 옵션 (10+ 포맷)
- 자동 저장 인디케이터
```

---

## 🎯 Part 2: SnapChart 핵심 UI/UX 원칙

### 원칙 1: "3초 안에 첫 다이어그램"

**목표**: 사용자가 랜딩 후 3초 안에 다이어그램 생성 시작

```typescript
// 랜딩 페이지 즉시 시작
<Hero>
  <h1>말로 설명하면 다이어그램이 됩니다</h1>
  <QuickStartInput
    placeholder="예: 로그인 프로세스"
    autoFocus
  />
</Hero>
```

**UX 플로우**:
```
1. 랜딩 → 입력창 자동 포커스
2. 플레이스홀더 예제 클릭 가능
3. 타이핑 즉시 타입 제안
4. 엔터 → 즉시 생성 시작
━━━━━━━━━━━━━━━━━━━━━━━━
총 시간: < 3초
```

---

### 원칙 2: "시각적 피드백 우선"

**모든 액션에 즉각적 피드백**

```typescript
// 생성 단계별 표시
const GENERATION_STATES = {
  idle: '대기 중',
  analyzing: '입력 분석 중... 🧠',
  generating: 'AI가 코드 생성 중... 🤖',
  rendering: '다이어그램 렌더링 중... 🎨',
  complete: '완료! ✅'
};

// UI 컴포넌트
<ProgressBar>
  <Step state="analyzing">
    <Spinner />
    <Text>입력을 분석하고 있습니다...</Text>
    <Time>2.1초</Time>
  </Step>
</ProgressBar>
```

**애니메이션 가이드**:
```css
/* 부드러운 트랜지션 */
.diagram-appear {
  animation: fadeInScale 0.3s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

### 원칙 3: "에러는 선생님"

**실패를 학습 기회로**

```typescript
// 나쁜 예
<Error>생성 실패</Error>

// 좋은 예
<Error variant="helpful">
  <Icon>💡</Icon>
  <Title>더 구체적으로 설명해주세요</Title>
  <Description>
    "프로세스"보다는 "로그인 프로세스: 
    이메일 입력 → 비밀번호 입력 → 인증"처럼 
    단계를 명시하면 더 정확합니다.
  </Description>
  <SuggestedExamples>
    <Example>회원가입 프로세스</Example>
    <Example>결제 흐름도</Example>
  </SuggestedExamples>
  <Button>다시 시도</Button>
</Error>
```

---

### 원칙 4: "모바일 퍼스트는 아니지만, 모바일 프렌들리"

**데스크톱 최적화, 모바일 지원**

```typescript
// 반응형 레이아웃
<Layout>
  {/* 데스크톱: 좌우 분할 */}
  <div className="hidden md:grid md:grid-cols-2">
    <InputPanel />
    <PreviewPanel />
  </div>
  
  {/* 모바일: 상하 스택 + 탭 */}
  <div className="md:hidden">
    <Tabs>
      <Tab>입력</Tab>
      <Tab>미리보기</Tab>
    </Tabs>
    <TabContent />
  </div>
</Layout>
```

---

### 원칙 5: "다크 모드는 필수"

**밤샘 개발자들을 위한 배려**

```typescript
// Tailwind 다크 모드
<div className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-gray-100
">
  {/* 콘텐츠 */}
</div>

// 다크 모드 토글
<button onClick={toggleDarkMode}>
  {isDark ? '☀️' : '🌙'}
</button>
```

**컬러 팔레트**:
```css
:root {
  /* Light Mode */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --border: #E5E7EB;
  --accent: #3B82F6;
}

[data-theme="dark"] {
  /* Dark Mode */
  --bg-primary: #111827;
  --bg-secondary: #1F2937;
  --text-primary: #F9FAFB;
  --text-secondary: #9CA3AF;
  --border: #374151;
  --accent: #60A5FA;
}
```

---

## 🎨 Part 3: 구체적 UI 컴포넌트 설계

### 3.1 메인 입력창 (Hero Input)

```typescript
// apps/web/src/components/HeroInput.tsx

export function HeroInput() {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* 메인 입력창 */}
      <div className="
        relative
        bg-white dark:bg-gray-800
        rounded-2xl
        shadow-2xl
        border-2 border-transparent
        focus-within:border-blue-500
        transition-all
      ">
        {/* 타입 선택 (좌측 아이콘) */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <TypeSelector />
        </div>
        
        {/* 입력창 */}
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="다이어그램을 설명하세요... (예: 로그인 프로세스)"
          className="
            w-full
            pl-16 pr-32
            py-6
            text-lg
            bg-transparent
            resize-none
            focus:outline-none
          "
          rows={3}
        />
        
        {/* 생성 버튼 (우측) */}
        <button className="
          absolute right-4 top-1/2 -translate-y-1/2
          px-8 py-3
          bg-gradient-to-r from-blue-500 to-blue-600
          text-white
          rounded-xl
          font-semibold
          hover:shadow-lg
          transition-all
        ">
          생성 ✨
        </button>
      </div>
      
      {/* 타입 제안 (하단) */}
      {value.length > 5 && (
        <div className="mt-2 text-sm text-gray-500">
          💡 "{value}"는 
          <TypeBadge>플로우차트</TypeBadge>로 
          만드는 게 좋을 것 같아요
        </div>
      )}
      
      {/* 예제 (처음만) */}
      {value === '' && (
        <div className="mt-4 flex gap-2 flex-wrap">
          <ExampleChip>로그인 프로세스</ExampleChip>
          <ExampleChip>API 시퀀스</ExampleChip>
          <ExampleChip>조직도</ExampleChip>
          <ExampleChip>프로젝트 타임라인</ExampleChip>
        </div>
      )}
    </div>
  );
}
```

**시각적 참고**:
```
┌────────────────────────────────────────────┐
│ 📊▼  다이어그램을 설명하세요...         [ 생성 ✨ ] │
│                                            │
│     (예: 로그인 프로세스)                   │
└────────────────────────────────────────────┘
  💡 "로그인 프로세스"는 플로우차트로...
  
  [ 로그인 프로세스 ] [ API 시퀀스 ] [ 조직도 ]
```

---

### 3.2 다이어그램 미리보기 (Preview Panel)

```typescript
// apps/web/src/components/DiagramPreview.tsx

export function DiagramPreview({ data, isLoading }) {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* 헤더 */}
      <div className="
        flex items-center justify-between
        px-6 py-4
        border-b border-gray-200 dark:border-gray-700
      ">
        <div className="flex items-center gap-3">
          <TypeIcon type={data?.type} />
          <h3 className="font-semibold">{data?.title || '미리보기'}</h3>
          {data?.cached && (
            <Badge variant="blue">캐시됨 ⚡</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* 줌 컨트롤 */}
          <ZoomControl />
          
          {/* 다운로드 */}
          <DownloadMenu />
          
          {/* 공유 */}
          <ShareButton />
        </div>
      </div>
      
      {/* 캔버스 */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <LoadingState />
        ) : data ? (
          <MermaidRenderer code={data.code} />
        ) : (
          <EmptyState />
        )}
      </div>
      
      {/* 푸터 (통계) */}
      {data && (
        <div className="
          flex items-center gap-6
          px-6 py-3
          bg-gray-50 dark:bg-gray-800
          border-t border-gray-200 dark:border-gray-700
          text-sm text-gray-500
        ">
          <span>⚡ {data.duration}ms</span>
          <span>📝 {data.code.length}자</span>
          <span>🎨 {data.nodeCount}개 노드</span>
        </div>
      )}
    </div>
  );
}
```

---

### 3.3 로딩 상태 (Loading State)

```typescript
// apps/web/src/components/LoadingState.tsx

export function LoadingState({ stage, duration }) {
  return (
    <div className="
      flex flex-col items-center justify-center
      h-full
      text-center
    ">
      {/* 애니메이션 */}
      <div className="relative w-32 h-32 mb-8">
        {/* 회전하는 원 */}
        <div className="
          absolute inset-0
          border-4 border-blue-200
          border-t-blue-600
          rounded-full
          animate-spin
        " />
        
        {/* 중앙 아이콘 */}
        <div className="
          absolute inset-0
          flex items-center justify-center
          text-4xl
        ">
          {stage === 'analyzing' && '🧠'}
          {stage === 'generating' && '🤖'}
          {stage === 'rendering' && '🎨'}
        </div>
      </div>
      
      {/* 상태 텍스트 */}
      <h3 className="text-xl font-semibold mb-2">
        {STAGE_MESSAGES[stage]}
      </h3>
      
      {/* 진행 바 */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* 시간 표시 */}
      <p className="mt-4 text-sm text-gray-500">
        {duration.toFixed(1)}초 경과
        {' '}·{' '}
        평균 5초 소요
      </p>
      
      {/* 팁 */}
      <div className="
        mt-8 p-4
        bg-blue-50 dark:bg-blue-900/20
        rounded-lg
        max-w-md
      ">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          💡 <strong>팁:</strong> 다음에는 더 구체적으로 설명하면 더 정확한 결과를 얻을 수 있어요!
        </p>
      </div>
    </div>
  );
}
```

---

### 3.4 히스토리 사이드바

```typescript
// apps/web/src/components/HistorySidebar.tsx

export function HistorySidebar() {
  const { data: history } = useQuery(['history']);
  
  return (
    <aside className="
      w-80
      h-full
      bg-gray-50 dark:bg-gray-900
      border-r border-gray-200 dark:border-gray-800
      flex flex-col
    ">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">최근 생성</h2>
      </div>
      
      {/* 필터 */}
      <div className="p-4 border-b">
        <TypeFilter />
      </div>
      
      {/* 히스토리 리스트 */}
      <div className="flex-1 overflow-auto">
        {history?.map((item) => (
          <HistoryCard
            key={item.id}
            item={item}
            onClick={() => loadDiagram(item.id)}
          />
        ))}
      </div>
      
      {/* 업그레이드 CTA (Free 플랜) */}
      {user.plan === 'free' && (
        <div className="p-4 border-t">
          <UpgradeCTA />
        </div>
      )}
    </aside>
  );
}

function HistoryCard({ item }) {
  return (
    <div className="
      p-4 border-b
      hover:bg-gray-100 dark:hover:bg-gray-800
      cursor-pointer
      transition-colors
    ">
      {/* 썸네일 */}
      <div className="
        w-full h-32
        bg-white dark:bg-gray-800
        rounded-lg
        overflow-hidden
        mb-3
      ">
        <img 
          src={item.thumbnail} 
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* 정보 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">
            {item.title || '제목 없음'}
          </h4>
          <p className="text-sm text-gray-500 truncate">
            {item.prompt}
          </p>
        </div>
        
        <TypeBadge type={item.type} />
      </div>
      
      {/* 메타 */}
      <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
        <span>{formatDate(item.createdAt)}</span>
        <span>·</span>
        <span>{item.nodeCount}개 노드</span>
      </div>
    </div>
  );
}
```

---

## 🎨 Part 4: 컬러 시스템

### Primary 컬러 (브랜드)

```css
/* Blue - 신뢰, 전문성 */
--blue-50:  #EFF6FF;
--blue-100: #DBEAFE;
--blue-500: #3B82F6; /* Primary */
--blue-600: #2563EB;
--blue-700: #1D4ED8;
--blue-900: #1E3A8A;

/* 사용처 */
.primary-button {
  background: var(--blue-600);
}

.primary-text {
  color: var(--blue-600);
}

.primary-border {
  border-color: var(--blue-500);
}
```

### Secondary 컬러 (타입별)

```css
/* 다이어그램 타입별 컬러 코딩 */
--flowchart: #3B82F6;   /* 파란색 */
--sequence:  #8B5CF6;   /* 보라색 */
--pie:       #10B981;   /* 초록색 */
--gantt:     #F59E0B;   /* 주황색 */
--er:        #EF4444;   /* 빨간색 */
--state:     #06B6D4;   /* 청록색 */
--journey:   #EC4899;   /* 핑크색 */
--graph:     #6366F1;   /* 인디고 */
```

### Neutral 컬러 (UI)

```css
/* Gray Scale */
--gray-50:  #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-500: #6B7280;
--gray-700: #374151;
--gray-900: #111827;
```

---

## 🎯 Part 5: 타이포그래피

### 폰트 선택

```css
/* 한글 + 영문 조합 */
font-family: 
  'Pretendard', /* 한글 - 모던하고 가독성 좋음 */
  'Inter',      /* 영문 - 산세리프 */
  -apple-system,
  BlinkMacSystemFont,
  sans-serif;

/* 코드 (Mermaid 코드 표시용) */
font-family:
  'JetBrains Mono', /* 코드 전용 */
  'Fira Code',
  monospace;
```

### 타이포그래피 스케일

```css
/* Heading */
.text-5xl { font-size: 3rem; line-height: 1; }      /* 48px - Hero */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; } /* 36px - Page Title */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* 30px - Section */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }    /* 24px - Card Title */
.text-xl  { font-size: 1.25rem; line-height: 1.75rem; } /* 20px - Subtitle */

/* Body */
.text-lg  { font-size: 1.125rem; line-height: 1.75rem; } /* 18px - Large Body */
.text-base { font-size: 1rem; line-height: 1.5rem; }     /* 16px - Body */
.text-sm  { font-size: 0.875rem; line-height: 1.25rem; } /* 14px - Small */
.text-xs  { font-size: 0.75rem; line-height: 1rem; }     /* 12px - Caption */
```

---

## 📱 Part 6: 반응형 브레이크포인트

```css
/* Tailwind 기본 브레이크포인트 */
/* Mobile First 접근 */

/* sm: 640px - 작은 태블릿 */
@media (min-width: 640px) {
  /* 1열 → 2열 */
}

/* md: 768px - 태블릿 */
@media (min-width: 768px) {
  /* 사이드바 표시 */
  /* 좌우 분할 시작 */
}

/* lg: 1024px - 작은 데스크톱 */
@media (min-width: 1024px) {
  /* 3단 레이아웃 */
  /* 히스토리 사이드바 */
}

/* xl: 1280px - 데스크톱 */
@media (min-width: 1280px) {
  /* 최적 레이아웃 */
}

/* 2xl: 1536px - 대형 모니터 */
@media (min-width: 1536px) {
  /* 여백 확대 */
}
```

---

## 🎨 Part 7: 실제 적용 예시

### 완성된 메인 화면 구조

```
┌───────────────────────────────────────────────────────────┐
│  🏠 SnapChart        🌙  👤 John   💎 Pro   ⚙️            │ ← Header (64px)
├───────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────────────────────┐ ┌──────────────┐│
│ │         │ │                         │ │              ││
│ │ 📁      │ │    📊▼ 다이어그램        │ │  미리보기     ││
│ │ History │ │    설명을 입력...        │ │              ││
│ │         │ │                         │ │  [생성됨]     ││
│ │ 최근생성 │ │    ┌────────────────┐  │ │              ││
│ │ ────────│ │    │ 로그인 프로세스 │  │ │  100%  🔍    ││
│ │ [썸네일] │ │    │ API 시퀀스      │  │ │              ││
│ │ 플로우   │ │    │ 조직도          │  │ │  [ ⬇️ 💾 🔗 ]││
│ │         │ │    └────────────────┘  │ │              ││
│ │ [썸네일] │ │                         │ │              ││
│ │ 시퀀스   │ │    [ 생성 ✨ ]         │ │              ││
│ │         │ │                         │ │              ││
│ └─────────┘ └─────────────────────────┘ └──────────────┘│
│    280px              960px                  680px        │
└───────────────────────────────────────────────────────────┘
                    1920px (Full HD)
```

---

## 🎯 Part 8: 핵심 인터랙션 패턴

### 8.1 다이어그램 생성 플로우

```
1. 입력 시작
   ↓ (onChange)
2. 타입 자동 추천 (debounce 300ms)
   ↓ (사용자가 타입 선택 또는 엔터)
3. 생성 버튼 클릭
   ↓ (API 호출)
4. 로딩 상태 표시 (3-5초)
   ├─ 애니메이션
   ├─ 진행률 표시
   └─ 예상 시간 표시
   ↓ (완료)
5. 미리보기 페이드인 (300ms)
   ├─ 다이어그램 렌더링
   ├─ 통계 표시
   └─ 액션 버튼 활성화
   ↓
6. 자동 저장 (히스토리)
```

### 8.2 호버 효과

```css
/* 버튼 호버 */
.button {
  transition: all 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

/* 카드 호버 */
.card:hover {
  border-color: var(--blue-500);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

/* 다이어그램 노드 호버 */
.diagram-node:hover {
  filter: brightness(1.1);
  cursor: pointer;
}
```

### 8.3 드래그 앤 드롭 (향후)

```typescript
// 히스토리에서 드래그하여 재사용
<Draggable
  draggableId={item.id}
  index={index}
>
  {(provided) => (
    <HistoryCard
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    />
  )}
</Draggable>
```

---

## 🎨 Part 9: 접근성 (A11y)

### 필수 체크리스트

```typescript
// 1. 키보드 네비게이션
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>

// 2. ARIA 레이블
<button aria-label="다이어그램 생성">
  ✨
</button>

// 3. Focus 스타일
.focus-visible:focus {
  outline: 2px solid var(--blue-500);
  outline-offset: 2px;
}

// 4. 색상 대비 (WCAG AA)
/* 최소 4.5:1 대비 */
.text-gray-600 { /* 대비: 4.6:1 ✅ */ }

// 5. Skip to Content
<a href="#main" className="sr-only focus:not-sr-only">
  본문으로 건너뛰기
</a>
```

---

## 🎯 Part 10: 최종 체크리스트

### 출시 전 UI/UX 검증

```markdown
## 시각 디자인
- [ ] 브랜드 컬러 일관성 (모든 페이지)
- [ ] 타이포그래피 스케일 준수
- [ ] 아이콘 일관성 (16x16, 24x24)
- [ ] 이미지 최적화 (WebP)
- [ ] 다크 모드 완벽 지원

## 인터랙션
- [ ] 모든 버튼에 호버 효과
- [ ] 로딩 상태 명확
- [ ] 에러 메시지 친절
- [ ] 성공 피드백 (토스트)
- [ ] 애니메이션 부드러움 (60fps)

## 반응형
- [ ] 모바일 (320px~)
- [ ] 태블릿 (768px~)
- [ ] 데스크톱 (1024px~)
- [ ] 대형 모니터 (1920px~)

## 접근성
- [ ] 키보드 네비게이션
- [ ] 스크린 리더 지원
- [ ] ARIA 레이블
- [ ] 색상 대비 4.5:1+
- [ ] Focus 스타일

## 성능
- [ ] Lighthouse Performance 90+
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] 이미지 Lazy Loading
- [ ] 코드 스플리팅
```

---

## 💡 최종 요약

### SnapChart UI/UX의 핵심

```
1. 🎯 3초 안에 첫 다이어그램
2. 👀 즉각적 시각 피드백
3. 💬 친절한 에러 메시지
4. 🎨 깔끔하고 모던한 디자인
5. 🌓 다크 모드 필수
6. 📱 모바일 프렌들리
7. ♿ 접근성 준수
8. ⚡ 빠른 성능 (Lighthouse 90+)
```

**참고 사이트 우선순위**:
1. **Figma** - 전체 레이아웃 참고
2. **Mermaid Live** - 코드-프리뷰 분할
3. **Miro** - 무한 캔버스 UX
4. **Excalidraw** - 손그림 스타일 옵션

---

**디자인 가이드 완료!**  
**다음 단계**: Figma 목업 제작 → 프론트엔드 구현