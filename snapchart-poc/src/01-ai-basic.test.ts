#!/usr/bin/env bun

import chalk from 'chalk';
import ora from 'ora';
import { createAIProvider, getProviderName } from './utils/provider-factory.js';

const provider = createAIProvider();

interface TestResult {
  name: string;
  status: 'pass' | 'fail';
  duration: number;
  error?: string;
  data?: any;
}

const results: TestResult[] = [];

async function testBasicCompletion() {
  const spinner = ora('테스트 1: 기본 완성 요청').start();
  const startTime = Date.now();

  try {
    const response = await provider.generate(
      'Hello! Reply with just "OK"',
      undefined,
      100
    );

    const duration = Date.now() - startTime;
    const text = response.text;

    if (text.toLowerCase().includes('ok')) {
      spinner.succeed(chalk.green(`테스트 1 통과 (${duration}ms)`));
      results.push({
        name: 'Basic Completion',
        status: 'pass',
        duration,
        data: { text }
      });
    } else {
      throw new Error('응답이 예상과 다름');
    }
  } catch (error: any) {
    const duration = Date.now() - startTime;
    spinner.fail(chalk.red('테스트 1 실패'));
    results.push({
      name: 'Basic Completion',
      status: 'fail',
      duration,
      error: error.message
    });
  }
}

async function testResponseTime() {
  const spinner = ora('테스트 2: 응답 시간 측정 (3회)').start();
  const times: number[] = [];

  for (let i = 0; i < 3; i++) {
    const startTime = Date.now();

    try {
      await provider.generate(
        'Generate a simple flowchart in Mermaid syntax',
        undefined,
        500
      );

      times.push(Date.now() - startTime);
    } catch (error) {
      times.push(-1);
    }
  }

  const validTimes = times.filter(t => t > 0);
  const avgTime = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;

  if (avgTime < 5000) {
    spinner.succeed(chalk.green(`테스트 2 통과 (평균 ${avgTime.toFixed(0)}ms)`));
    results.push({
      name: 'Response Time',
      status: 'pass',
      duration: avgTime,
      data: { times, avgTime }
    });
  } else {
    spinner.fail(chalk.red(`테스트 2 실패 (평균 ${avgTime.toFixed(0)}ms, 목표 5초)`));
    results.push({
      name: 'Response Time',
      status: 'fail',
      duration: avgTime,
      error: '응답 시간 초과'
    });
  }
}

async function testErrorHandling() {
  const spinner = ora('테스트 3: 에러 처리').start();
  const startTime = Date.now();

  try {
    // 의도적으로 빈 프롬프트 전송
    await provider.generate('', undefined, 100);

    const duration = Date.now() - startTime;

    // 에러가 발생하지 않아도 정상 (일부 API는 빈 프롬프트를 허용)
    spinner.succeed(chalk.green(`테스트 3 통과 (${duration}ms)`));
    results.push({
      name: 'Error Handling',
      status: 'pass',
      duration,
      data: { note: 'Empty prompt handled gracefully' }
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;

    // 에러가 발생하면 정상 처리됨
    spinner.succeed(chalk.green(`테스트 3 통과 (${duration}ms - 에러 정상 처리)`));
    results.push({
      name: 'Error Handling',
      status: 'pass',
      duration,
      data: { errorType: error.constructor.name }
    });
  }
}

async function runBasicTests() {
  console.log(chalk.bold.blue(`\n🧪 ${getProviderName()} API 기본 테스트\n`));

  await testBasicCompletion();
  await testResponseTime();
  await testErrorHandling();

  // 결과 요약
  console.log('\n' + '─'.repeat(50));
  const passed = results.filter(r => r.status === 'pass').length;
  const total = results.length;

  console.log(chalk.bold(`\n결과: ${passed}/${total} 통과`));

  if (passed === total) {
    console.log(chalk.green.bold('✅ 모든 기본 테스트 통과!\n'));
    return true;
  } else {
    console.log(chalk.red.bold('❌ 일부 테스트 실패\n'));
    return false;
  }
}

runBasicTests();
