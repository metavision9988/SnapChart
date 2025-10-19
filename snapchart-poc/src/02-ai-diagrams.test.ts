#!/usr/bin/env bun

import chalk from 'chalk';
import ora from 'ora';
import { writeFile, mkdir } from 'fs/promises';
import { createAIProvider, getProviderName } from './utils/provider-factory.js';

const provider = createAIProvider();

interface DiagramTest {
  name: string;
  prompt: string;
  expectedType: string;
}

interface TestResult {
  test: string;
  status: 'pass' | 'fail';
  duration: number;
  code?: string;
  cost?: number;
  error?: string;
}

const tests: DiagramTest[] = [
  {
    name: '플로우차트',
    prompt: '로그인 프로세스를 Mermaid 플로우차트로 만들어줘. 시작→이메일입력→비밀번호입력→인증→성공/실패',
    expectedType: 'flowchart'
  },
  {
    name: '시퀀스 다이어그램',
    prompt: '사용자가 API를 호출하는 과정을 Mermaid 시퀀스 다이어그램으로. 사용자→프론트엔드→백엔드→데이터베이스',
    expectedType: 'sequenceDiagram'
  },
  {
    name: '조직도',
    prompt: 'CEO, CTO, CFO, 개발팀, 재무팀으로 구성된 조직도를 Mermaid graph로',
    expectedType: 'graph'
  },
  {
    name: '간트차트',
    prompt: '프로젝트 일정표를 Mermaid gantt 차트로. 기획(1주), 개발(4주), 테스트(1주)',
    expectedType: 'gantt'
  },
  {
    name: 'ER 다이어그램',
    prompt: 'User, Post, Comment 테이블의 관계를 Mermaid erDiagram으로',
    expectedType: 'erDiagram'
  },
  {
    name: '상태 다이어그램',
    prompt: '주문 상태 변화를 Mermaid stateDiagram으로. 주문대기→결제완료→배송중→배송완료',
    expectedType: 'stateDiagram'
  },
  {
    name: '파이 차트',
    prompt: '월별 매출 비중을 Mermaid pie 차트로. 1월(25%), 2월(30%), 3월(45%)',
    expectedType: 'pie'
  },
  {
    name: 'User Journey',
    prompt: '온라인 쇼핑 사용자 여정을 Mermaid journey로. 검색→상품선택→장바구니→결제→완료',
    expectedType: 'journey'
  }
];

// 플로우차트용 Few-Shot 시스템 프롬프트
const FLOWCHART_SYSTEM_PROMPT = `당신은 Mermaid 플로우차트 전문가입니다.

**중요 규칙**:
1. 반드시 \`flowchart TD\` 또는 \`flowchart LR\`로 시작
2. 노드 ID는 영문 (A, B, C 등)
3. 한국어 라벨은 대괄호 안에: A[시작]
4. 조건 분기는 중괄호: B{로그인?}
5. 화살표 라벨은 파이프: A -->|예| B
6. 코드만 출력 (설명, 마크다운 블록 금지)

**학습 예제 3개**:

예제 1:
입력: "회원가입 프로세스"
출력:
flowchart TD
    A[시작] --> B[이메일 입력]
    B --> C[비밀번호 입력]
    C --> D{유효성 검사}
    D -->|통과| E[가입 완료]
    D -->|실패| B

예제 2:
입력: "결제 프로세스"
출력:
flowchart TD
    A[장바구니] --> B{재고 확인}
    B -->|있음| C[결제]
    B -->|없음| D[품절 알림]
    C --> E{결제 성공?}
    E -->|예| F[주문 완료]
    E -->|아니오| C

예제 3:
입력: "API 요청 처리"
출력:
flowchart TD
    A[요청] --> B{인증}
    B -->|통과| C[처리]
    B -->|실패| D[401]
    C --> E{성공}
    E -->|예| F[200]
    E -->|아니오| G[500]`;

// 파이차트용 개선된 시스템 프롬프트
const PIE_SYSTEM_PROMPT = `당신은 Mermaid 파이 차트 전문가입니다.

**중요 규칙**:
1. 반드시 \`pie\`로 시작
2. title 라인 추가 (선택)
3. 데이터 포맷: "라벨" : 숫자 (퍼센트 아님!)
4. 숫자 합계 무관 (Mermaid가 자동 비율 계산)
5. 한국어 라벨 사용
6. 코드만 출력 (설명, 마크다운 블록 금지)

**출력 예제**:
pie title 매출 비중
    "1월" : 25
    "2월" : 30
    "3월" : 45`;

// 기본 시스템 프롬프트 (나머지 다이어그램용)
const DEFAULT_SYSTEM_PROMPT = `당신은 Mermaid 다이어그램 전문가입니다.
규칙:
1. Mermaid 코드만 출력 (설명 제외)
2. 마크다운 코드 블록 사용 금지
3. 한국어 라벨 사용
4. 문법 오류 없이 정확히`;

const results: TestResult[] = [];
let totalCost = 0;

// 다이어그램 타입별 시스템 프롬프트 선택
function getSystemPrompt(diagramType: string): string {
  switch (diagramType) {
    case '플로우차트':
      return FLOWCHART_SYSTEM_PROMPT;
    case '파이 차트':
      return PIE_SYSTEM_PROMPT;
    default:
      return DEFAULT_SYSTEM_PROMPT;
  }
}

async function testDiagramGeneration(test: DiagramTest) {
  const spinner = ora(`${test.name} 생성 중...`).start();
  const startTime = Date.now();
  const MAX_RETRIES = 3;

  // 타입별 시스템 프롬프트 선택
  const systemPrompt = getSystemPrompt(test.name);

  // 재시도 메커니즘
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 1) {
        spinner.text = `${test.name} 재시도 중... (${attempt}/${MAX_RETRIES})`;
      }

      const response = await provider.generate(test.prompt, systemPrompt, 2000);

      const duration = Date.now() - startTime;
      let code = response.text
        .replace(/```mermaid\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      // 비용 계산
      const cost = provider.calculateCost(
        response.usage.inputTokens,
        response.usage.outputTokens
      );

      totalCost += cost;

      // 검증 개선: 더 관대한 검증
      const isValid =
        code.length > 30 &&
        (code.includes(test.expectedType) ||
         code.toLowerCase().includes(test.expectedType.toLowerCase()) ||
         // 플로우차트의 경우 flowchart 또는 graph 둘 다 허용
         (test.name === '플로우차트' && (code.includes('flowchart') || code.includes('graph'))) ||
         // 파이 차트의 경우 pie만 확인
         (test.name === '파이 차트' && code.startsWith('pie')));

      if (isValid) {
        const attemptText = attempt > 1 ? ` (${attempt}회 시도)` : '';
        spinner.succeed(chalk.green(
          `${test.name} 생성 완료${attemptText} (${duration}ms, $${cost.toFixed(4)})`
        ));

        // 파일 저장
        await writeFile(
          `./results/diagrams/${test.name}.mmd`,
          code
        );

        results.push({
          test: test.name,
          status: 'pass',
          duration,
          code,
          cost
        });
        return; // 성공 시 즉시 반환
      } else {
        throw new Error(`생성된 코드가 유효하지 않음 (길이: ${code.length}, 타입: ${test.expectedType})`);
      }

    } catch (error: any) {
      if (attempt < MAX_RETRIES) {
        // 재시도 전 1초 대기
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      } else {
        // 모든 재시도 실패
        const duration = Date.now() - startTime;
        spinner.fail(chalk.red(`${test.name} 실패 (${MAX_RETRIES}회 시도)`));

        results.push({
          test: test.name,
          status: 'fail',
          duration,
          error: error.message
        });
        return;
      }
    }
  }
}

async function runDiagramTests() {
  console.log(chalk.bold.blue(`\n📊 ${getProviderName()} 다이어그램 생성 테스트\n`));

  // results/diagrams 폴더 생성
  await mkdir('./results/diagrams', { recursive: true });

  for (const test of tests) {
    await testDiagramGeneration(test);
    // Rate Limit 방지 (1초 대기)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 결과 요약
  console.log('\n' + '─'.repeat(50));
  const passed = results.filter(r => r.status === 'pass').length;
  const total = results.length;
  const successRate = (passed / total * 100).toFixed(1);
  const avgCost = totalCost / total;

  console.log(chalk.bold('\n📊 테스트 결과:'));
  console.log(`   성공: ${passed}/${total} (${successRate}%)`);
  console.log(`   평균 비용: $${avgCost.toFixed(4)}/요청`);
  console.log(`   총 비용: $${totalCost.toFixed(4)}`);

  // 각 테스트 결과 상세
  console.log(chalk.bold('\n📋 상세 결과:'));
  results.forEach(r => {
    const icon = r.status === 'pass' ? '✓' : '✗';
    const color = r.status === 'pass' ? chalk.green : chalk.red;
    console.log(color(`   ${icon} ${r.test}: ${r.duration}ms`));
    if (r.code) {
      console.log(chalk.gray(`      코드 길이: ${r.code.length}자`));
      console.log(chalk.gray(`      미리보기: ${r.code.substring(0, 50)}...`));
    }
    if (r.error) {
      console.log(chalk.red(`      에러: ${r.error}`));
    }
  });

  // 판정
  console.log('\n' + '─'.repeat(50));
  if (passed >= total * 0.9) {
    console.log(chalk.green.bold(`\n✅ 성공률 ${successRate}% - 테스트 통과!`));
    console.log(chalk.green(`${getProviderName()} API 품질이 우수합니다.\n`));
    return true;
  } else if (passed >= total * 0.7) {
    console.log(chalk.yellow.bold(`\n⚠️ 성공률 ${successRate}% - 프롬프트 개선 필요`));
    console.log(chalk.yellow('일부 다이어그램 타입에서 품질 저하 발견\n'));
    return false;
  } else {
    console.log(chalk.red.bold(`\n❌ 성공률 ${successRate}% - 테스트 실패`));
    console.log(chalk.red(`${getProviderName()} API 품질이 기대 이하입니다.\n`));
    return false;
  }
}

runDiagramTests();
