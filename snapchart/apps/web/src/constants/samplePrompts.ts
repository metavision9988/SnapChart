import type { DiagramType } from '@snapchart/types';

export const SAMPLE_PROMPTS: Record<DiagramType, string> = {
  flowchart: '회원가입 프로세스 - 이메일 입력, 비밀번호 입력, 유효성 검사 (성공/실패), 가입 완료',

  sequence: '사용자가 API를 호출하는 과정 - 사용자, 클라이언트, API Gateway, 인증 서버, 백엔드 서버, 데이터베이스',

  pie: '2024년 분기별 매출 비중 - 1분기 20%, 2분기 25%, 3분기 30%, 4분기 25%',

  gantt: '웹사이트 리뉴얼 프로젝트 - 기획 2주, UI/UX 디자인 3주, 프론트엔드 개발 4주, 백엔드 개발 4주, 테스트 2주, 배포 1주',

  er: '온라인 쇼핑몰 데이터베이스 - User(회원), Product(상품), Order(주문), OrderItem(주문상세), Review(리뷰) 테이블의 관계',

  state: '주문 상태 변화 - 주문접수 → 결제완료 → 상품준비 → 배송중 → 배송완료 → 구매확정 (취소/환불 경로 포함)',

  journey: '온라인 쇼핑 사용자 여정 - 홈페이지 방문, 상품 검색, 상품 상세보기, 장바구니 담기, 결제하기, 주문 완료, 배송 추적',

  graph: '스타트업 조직도 - CEO, CTO(개발팀, 디자인팀), CFO(재무팀, 인사팀), CMO(마케팅팀, 영업팀)'
};

export const SAMPLE_DESCRIPTIONS: Record<DiagramType, string> = {
  flowchart: '업무 프로세스나 의사결정 흐름을 보여주는 다이어그램',
  sequence: '시스템 간 또는 객체 간 메시지 교환을 시간 순서로 보여주는 다이어그램',
  pie: '전체에서 각 항목이 차지하는 비율을 원형으로 보여주는 차트',
  gantt: '프로젝트 일정과 작업 기간을 막대 그래프로 보여주는 차트',
  er: '데이터베이스 테이블 간의 관계를 보여주는 다이어그램',
  state: '시스템이나 객체의 상태 변화를 보여주는 다이어그램',
  journey: '사용자의 경험 흐름을 감정 상태와 함께 보여주는 다이어그램',
  graph: '계층 구조나 네트워크 관계를 보여주는 다이어그램'
};
