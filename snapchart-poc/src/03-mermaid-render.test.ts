#!/usr/bin/env bun

import chalk from 'chalk';
import ora from 'ora';
import mermaid from 'mermaid';

interface RenderTest {
  name: string;
  code: string;
  nodeCount: number;
}

const tests: RenderTest[] = [
  {
    name: '간단한 플로우차트 (5 노드)',
    code: `flowchart TD
      A[시작] --> B{로그인?}
      B -->|예| C[대시보드]
      B -->|아니오| D[로그인 페이지]
      D --> E[완료]`,
    nodeCount: 5
  },
  {
    name: '중간 복잡도 (20 노드)',
    code: `flowchart TD
      ${Array.from({ length: 19 }, (_, i) =>
        `N${i} --> N${i+1}`
      ).join('\n      ')}`,
    nodeCount: 20
  },
  {
    name: '높은 복잡도 (50 노드)',
    code: `flowchart TD
      ${Array.from({ length: 49 }, (_, i) =>
        `N${i} --> N${i+1}`
      ).join('\n      ')}`,
    nodeCount: 50
  },
  {
    name: '매우 높은 복잡도 (100 노드)',
    code: `flowchart TD
      ${Array.from({ length: 99 }, (_, i) =>
        `N${i} --> N${i+1}`
      ).join('\n      ')}`,
    nodeCount: 100
  }
];

interface TestResult {
  test: string;
  status: 'pass' | 'fail';
  duration: number;
  svgSize?: number;
  error?: string;
}

const results: TestResult[] = [];

async function testRender(test: RenderTest) {
  const spinner = ora(`${test.name} 렌더링 중...`).start();
  const startTime = Date.now();

  try {
    const { svg } = await mermaid.render(
      `test-${Date.now()}`,
      test.code
    );

    const duration = Date.now() - startTime;
    const svgSize = svg.length;

    // 판정 기준: 3초 이내, SVG 생성 성공
    if (duration < 3000 && svgSize > 0) {
      spinner.succeed(chalk.green(
        `${test.name} 렌더링 성공 (${duration}ms, ${(svgSize/1024).toFixed(1)}KB)`
      ));

      results.push({
        test: test.name,
        status: 'pass',
        duration,
        svgSize
      });
    } else if (duration >= 3000) {
      throw new Error(`렌더링 시간 초과 (${duration}ms)`);
    } else {
      throw new Error('SVG 생성 실패');
    }

  } catch (error: any) {
    const duration = Date.now() - startTime;
    spinner.fail(chalk.red(`${test.name} 렌더링 실패`));

    results.push({
      test: test.name,
      status: 'fail',
      duration,
      error: error.message
    });
  }
}

async function runRenderTests() {
  console.log(chalk.bold.blue('\n🎨 Mermaid 렌더링 테스트\n'));

  for (const test of tests) {
    await testRender(test);
  }

  // 결과 요약
  console.log('\n' + '─'.repeat(50));
  const passed = results.filter(r => r.status === 'pass').length;
  const total = results.length;
  const avgTime = results
    .filter(r => r.status === 'pass')
    .reduce((sum, r) => sum + r.duration, 0) / (passed || 1);

  console.log(chalk.bold('\n🎨 렌더링 결과:'));
  console.log(`   성공: ${passed}/${total}`);
  console.log(`   평균 시간: ${avgTime.toFixed(0)}ms`);

  // 상세 결과
  results.forEach(r => {
    const icon = r.status === 'pass' ? '✓' : '✗';
    const color = r.status === 'pass' ? chalk.green : chalk.red;
    console.log(color(`   ${icon} ${r.test}`));
  });

  // 판정
  console.log('\n' + '─'.repeat(50));
  if (passed === total && avgTime < 2000) {
    console.log(chalk.green.bold('\n✅ 렌더링 성능 우수!'));
    console.log(chalk.green('모든 복잡도에서 빠른 렌더링 확인\n'));
    return true;
  } else if (passed === total) {
    console.log(chalk.yellow.bold('\n⚠️ 렌더링 성능 보통'));
    console.log(chalk.yellow('복잡한 다이어그램에서 속도 저하\n'));
    return false;
  } else {
    console.log(chalk.red.bold('\n❌ 렌더링 실패'));
    console.log(chalk.red('일부 다이어그램 렌더링 불가\n'));
    return false;
  }
}

runRenderTests();
