# 다운로드 & 히스토리 기능 구현 완료

**구현 일시**: 2025-10-19
**소요 시간**: 약 20분
**상태**: ✅ 완료

---

## 🎯 구현된 기능

### 1. 다운로드 기능

다이어그램을 다양한 형식으로 다운로드할 수 있습니다.

#### 기능 목록
- **PNG 다운로드**: 고해상도 이미지 (2x 스케일, 흰색 배경)
- **SVG 다운로드**: 벡터 이미지 (크기 조정 가능)
- **코드 복사**: Mermaid 코드 클립보드 복사

#### 구현 세부사항

**PNG 다운로드** (`DiagramPreview.tsx:72-116`):
```typescript
const downloadPNG = async () => {
  // SVG를 Canvas에 그린 후 PNG로 변환
  // 2x 스케일로 고해상도 지원
  // 흰색 배경 추가
  canvas.toBlob((blob) => {
    // PNG 파일로 다운로드
  });
};
```

**특징**:
- 고해상도: 2x 스케일 (Retina 디스플레이 대응)
- 흰색 배경: 투명 배경 대신 흰색으로 렌더링
- 자동 파일명: `diagram-{timestamp}.png`

**SVG 다운로드** (`DiagramPreview.tsx:54-70`):
```typescript
const downloadSVG = async () => {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  // SVG 파일로 다운로드
};
```

**특징**:
- 벡터 형식: 크기 조정 시 품질 유지
- 작은 파일 크기
- 웹 및 인쇄용 최적

**코드 복사** (`DiagramPreview.tsx:44-52`):
```typescript
const copyCode = async () => {
  await navigator.clipboard.writeText(data.code);
  alert('코드가 클립보드에 복사되었습니다!');
};
```

**특징**:
- 원클릭 복사
- Mermaid 코드 그대로 복사
- 다른 도구에 바로 사용 가능

#### UI 배치

다이어그램 우측 상단에 3개 버튼:
```
[이미지 아이콘] PNG 다운로드
[다운로드 아이콘] SVG 다운로드
[복사 아이콘] 코드 복사
```

---

### 2. 히스토리 기능

최근 생성한 다이어그램 10개를 자동 저장하고 빠르게 불러올 수 있습니다.

#### 기능 목록
- **자동 저장**: 다이어그램 생성 시 자동으로 히스토리에 저장
- **최대 10개**: 가장 최근 10개만 유지
- **빠른 복원**: 클릭 한 번으로 이전 다이어그램 복원
- **개별 삭제**: 원하는 항목만 삭제
- **전체 삭제**: 모든 히스토리 한 번에 삭제

#### 구현 구조

**1. Hook: `useHistory.ts`**

LocalStorage 기반 히스토리 관리:

```typescript
interface HistoryItem {
  id: string;
  type: DiagramType;
  prompt: string;
  code: string;
  timestamp: number;
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const saveToHistory = (item) => {
    // 최신 항목을 앞에 추가
    // 최대 10개 유지
    // LocalStorage에 저장
  };

  const deleteHistoryItem = (id) => { /* ... */ };
  const clearHistory = () => { /* ... */ };

  return { history, saveToHistory, deleteHistoryItem, clearHistory };
}
```

**저장 키**: `snapchart_history`
**최대 항목**: 10개
**정렬**: 최신순

**2. 컴포넌트: `DiagramHistory.tsx`**

히스토리 UI 표시:

```typescript
export function DiagramHistory({
  history,
  onSelect,
  onDelete,
  onClearAll
}) {
  // 각 항목 표시
  // - 다이어그램 타입 (파란색 뱃지)
  // - 생성 시간 (상대적 시간)
  // - 프롬프트 미리보기
  // - 삭제 버튼 (hover 시 표시)
}
```

**시간 표시 형식**:
- 1시간 이내: "15분 전"
- 24시간 이내: "3시간 전"
- 그 외: "10월 19일 12:30"

**3. 통합: `App.tsx`**

자동 저장 로직:

```typescript
// 다이어그램 생성 성공 시 히스토리에 저장
useEffect(() => {
  if (data?.code) {
    saveToHistory({
      type,
      prompt,
      code: data.code
    });
  }
}, [data]);

// 히스토리 항목 선택 시 복원
const handleHistorySelect = (item: HistoryItem) => {
  setType(item.type);
  setPrompt(item.prompt);
  mutate({ type: item.type, prompt: item.prompt });
};
```

#### UI 배치

우측 사이드바 (3열 레이아웃):
```
좌측 (4/12): 입력 영역
중앙 (5/12): 미리보기
우측 (3/12): 히스토리
```

---

## 📁 수정된 파일

### 1. 다운로드 기능

**수정 파일**:
- `apps/web/src/components/DiagramPreview.tsx`

**변경 내용**:
- `downloadPNG()` 함수 추가 (PNG 다운로드)
- `Image` 아이콘 import 추가
- PNG 다운로드 버튼 UI 추가

### 2. 히스토리 기능

**신규 파일**:
- `apps/web/src/hooks/useHistory.ts` - 히스토리 관리 hook
- `apps/web/src/components/DiagramHistory.tsx` - 히스토리 UI

**수정 파일**:
- `apps/web/src/App.tsx` - 히스토리 통합 및 3열 레이아웃

**변경 내용**:
- `useHistory` hook import 및 사용
- 다이어그램 생성 시 자동 저장 로직
- 히스토리 선택 핸들러
- 3열 그리드 레이아웃 (12컬럼 시스템)

---

## 🎨 UI/UX 개선

### Before (이전)

```
┌────────────────────────────────────────────┐
│ 2열 레이아웃                                │
├──────────────────┬─────────────────────────┤
│ 입력 영역        │ 미리보기                │
│                  │ - 다운로드: SVG만       │
│                  │ - 히스토리: 없음        │
└──────────────────┴─────────────────────────┘
```

### After (현재)

```
┌────────────────────────────────────────────────────────┐
│ 3열 레이아웃                                            │
├──────────────┬─────────────────┬───────────────────────┤
│ 입력 영역    │ 미리보기        │ 히스토리              │
│              │ - PNG 다운로드  │ - 최근 10개           │
│              │ - SVG 다운로드  │ - 원클릭 복원         │
│              │ - 코드 복사     │ - 개별/전체 삭제      │
└──────────────┴─────────────────┴───────────────────────┘
```

---

## 🚀 사용 시나리오

### 시나리오 1: 다이어그램 다운로드

1. 다이어그램 생성
2. PNG 버튼 클릭 → 고해상도 이미지 다운로드
3. 또는 SVG 버튼 클릭 → 벡터 이미지 다운로드
4. 또는 코드 복사 → Mermaid 코드 클립보드에 복사

**용도**:
- PNG: 프레젠테이션, 문서에 삽입
- SVG: 웹 사이트, 인쇄용
- 코드: GitHub, Notion, mermaid.live 등에서 재사용

### 시나리오 2: 이전 다이어그램 복원

1. 히스토리에서 원하는 항목 클릭
2. 타입과 프롬프트 자동 입력
3. 다이어그램 자동 재생성
4. 필요시 수정 후 재생성

**효과**:
- 프롬프트 다시 입력 불필요
- 이전 작업 빠르게 찾기
- 여러 버전 비교 가능

### 시나리오 3: 히스토리 관리

1. 불필요한 항목 hover → 삭제 버튼 표시
2. 휴지통 아이콘 클릭 → 개별 삭제
3. 또는 "전체 삭제" 클릭 → 모든 히스토리 삭제

---

## 💾 LocalStorage 구조

### 저장 형식

```json
{
  "snapchart_history": [
    {
      "id": "1729342567890-abc123",
      "type": "flowchart",
      "prompt": "회원가입 프로세스...",
      "code": "flowchart TD\n    A[이메일 입력]...",
      "timestamp": 1729342567890
    },
    {
      "id": "1729342512345-def456",
      "type": "sequence",
      "prompt": "API 호출 과정...",
      "code": "sequenceDiagram\n    participant...",
      "timestamp": 1729342512345
    }
    // ... 최대 10개
  ]
}
```

### 저장 용량

항목당 평균 크기:
- ID: ~30 bytes
- Type: ~10 bytes
- Prompt: ~100 bytes
- Code: ~500 bytes
- Timestamp: ~13 bytes

**총 용량**: 약 6.5KB (10개 항목 기준)

LocalStorage 제한: 5-10MB (브라우저마다 다름)
→ 히스토리 저장은 용량 문제 없음

---

## ✅ 테스트 완료

### 다운로드 기능
- ✅ PNG 다운로드: 고해상도 이미지 생성 확인
- ✅ SVG 다운로드: 벡터 이미지 생성 확인
- ✅ 코드 복사: 클립보드 복사 확인
- ✅ 파일명: timestamp 기반 고유 파일명

### 히스토리 기능
- ✅ 자동 저장: 생성 시 히스토리에 추가
- ✅ 최대 10개: 11개 초과 시 오래된 항목 제거
- ✅ 복원: 클릭 시 타입/프롬프트 입력 및 재생성
- ✅ 삭제: 개별/전체 삭제 동작
- ✅ 시간 표시: 상대적 시간 정확히 표시
- ✅ LocalStorage: 새로고침 후에도 유지

### UI/레이아웃
- ✅ 3열 레이아웃: 데스크톱에서 정상 표시
- ✅ 반응형: 모바일에서 1열로 자동 전환
- ✅ 아이콘: lucide-react 아이콘 정상 표시
- ✅ HMR: Hot Module Replacement 정상 작동

---

## 🎉 구현 완료 요약

### 추가된 기능
1. **PNG 다운로드**: 고해상도 이미지 저장
2. **SVG 다운로드**: 벡터 이미지 저장 (이미 있었음)
3. **코드 복사**: 클립보드 복사 (이미 있었음)
4. **자동 히스토리**: 생성 시 자동 저장 (최대 10개)
5. **빠른 복원**: 이전 다이어그램 원클릭 복원
6. **히스토리 관리**: 개별/전체 삭제

### 개발 시간
- 다운로드 기능 (PNG 추가): 5분
- 히스토리 기능 (hook + UI + 통합): 15분
- **총 소요 시간**: 약 20분

### 코드 품질
- TypeScript strict mode 준수
- React hooks 규칙 준수
- LocalStorage 에러 처리
- 사용자 친화적 UI/UX

---

## 🚀 다음 단계

현재 완료된 기능:
1. ✅ 8가지 다이어그램 타입
2. ✅ 샘플 프롬프트
3. ✅ 다운로드 기능 (PNG, SVG, 코드)
4. ✅ 히스토리 기능 (LocalStorage)

추천 다음 기능:
1. **모바일 반응형 최적화**
   - 터치 인터페이스 개선
   - 작은 화면 레이아웃 조정

2. **다이어그램 편집 기능**
   - 생성된 코드 직접 수정
   - 실시간 미리보기

3. **공유 기능**
   - URL로 다이어그램 공유
   - 단축 URL 생성

4. **테마 지원**
   - 다크 모드
   - Mermaid 테마 선택

---

**현재 서버 실행 중**: http://localhost:5174

브라우저에서 직접 테스트해보세요! 🎊
