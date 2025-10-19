#!/usr/bin/env bun

import chalk from 'chalk';
import { writeFile } from 'fs/promises';
import { createAIProvider, getProviderName } from './utils/provider-factory.js';

const provider = createAIProvider();

interface CostAnalysis {
  scenario: string;
  dau: number;
  requestsPerUser: number;
  totalRequests: number;
  cacheHitRate: number;
  actualApiCalls: number;
  costPerRequest: number;
  totalCost: number;
  revenue?: number;
  profit?: number;
}

// 예상 비용 (실제 테스트 후 업데이트됨)
// Gemini: ~$0.0015/요청, Claude: ~$0.0165/요청
const estimatedCostPerRequest = 0.002; // Gemini 기준 예상값

const scenarios: CostAnalysis[] = [
  {
    scenario: '출시 첫 달',
    dau: 100,
    requestsPerUser: 3,
    totalRequests: 100 * 3 * 30,
    cacheHitRate: 0,
    actualApiCalls: 9000,
    costPerRequest: estimatedCostPerRequest,
    totalCost: 9000 * estimatedCostPerRequest
  },
  {
    scenario: '출시 3개월',
    dau: 1000,
    requestsPerUser: 3,
    totalRequests: 1000 * 3 * 30,
    cacheHitRate: 0.4,
    actualApiCalls: 90000 * 0.6,
    costPerRequest: estimatedCostPerRequest,
    totalCost: 54000 * estimatedCostPerRequest,
    revenue: 100 * 7, // 100명 유료 전환 ($7/월)
    profit: 0
  },
  {
    scenario: '출시 6개월',
    dau: 5000,
    requestsPerUser: 3,
    totalRequests: 5000 * 3 * 30,
    cacheHitRate: 0.6,
    actualApiCalls: 450000 * 0.4,
    costPerRequest: estimatedCostPerRequest,
    totalCost: 180000 * estimatedCostPerRequest,
    revenue: 500 * 7, // 500명 유료 전환
    profit: 0
  },
  {
    scenario: '출시 1년',
    dau: 10000,
    requestsPerUser: 3,
    totalRequests: 10000 * 3 * 30,
    cacheHitRate: 0.7,
    actualApiCalls: 900000 * 0.3,
    costPerRequest: estimatedCostPerRequest,
    totalCost: 270000 * estimatedCostPerRequest,
    revenue: 1000 * 7, // 1000명 유료 전환
    profit: 0
  }
];

// 수익 및 이익 계산
scenarios.forEach(s => {
  if (s.revenue) {
    s.profit = s.revenue - s.totalCost;
  }
});

async function analyzeCosts() {
  console.log(chalk.bold.blue(`\n💰 ${getProviderName()} API 비용 분석\n`));

  // 실제 측정값 표시
  console.log(chalk.bold('📊 예상 데이터:'));
  console.log(`   Provider: ${getProviderName()}`);
  console.log(`   요청당 예상 비용: $${estimatedCostPerRequest.toFixed(4)}`);
  console.log(`   평균 응답 시간: 2-4초 (예상)`);
  console.log(`   목표 성공률: 90%+\n`);

  // 시나리오별 분석
  console.log(chalk.bold('📈 성장 시나리오별 비용:\n'));

  scenarios.forEach(s => {
    console.log(chalk.bold.cyan(`${s.scenario}:`));
    console.log(`   DAU: ${s.dau.toLocaleString()}명`);
    console.log(`   총 요청: ${s.totalRequests.toLocaleString()}회/월`);
    console.log(`   캐시 적중률: ${(s.cacheHitRate * 100).toFixed(0)}%`);
    console.log(`   실제 API 호출: ${s.actualApiCalls.toLocaleString()}회/월`);
    console.log(chalk.yellow(`   💵 API 비용: $${s.totalCost.toFixed(2)}/월 (약 ${(s.totalCost * 1333).toLocaleString()}원)`));

    if (s.revenue) {
      console.log(chalk.green(`   💰 예상 수익: $${s.revenue.toFixed(2)}/월`));

      if (s.profit !== undefined) {
        const profitColor = s.profit > 0 ? chalk.green : chalk.red;
        const profitKrw = s.profit * 1333;
        console.log(profitColor(`   📊 순이익: $${s.profit.toFixed(2)}/월 (약 ${profitKrw.toLocaleString()}원)`));

        if (s.profit > 0) {
          const margin = (s.profit / s.revenue * 100).toFixed(1);
          console.log(chalk.green(`   📈 이익률: ${margin}%`));
        }
      }
    }
    console.log('');
  });

  // 비용 절감 전략 효과
  console.log(chalk.bold('💡 비용 절감 전략 효과:\n'));

  const withoutCache = scenarios[2].totalRequests * estimatedCostPerRequest;
  const withCache = scenarios[2].totalCost;
  const savings = withoutCache - withCache;
  const savingsPercent = (savings / withoutCache * 100).toFixed(1);

  console.log(`   캐시 미사용 시: $${withoutCache.toFixed(2)}/월`);
  console.log(`   캐시 사용 시: $${withCache.toFixed(2)}/월`);
  console.log(chalk.green.bold(`   💰 절감액: $${savings.toFixed(2)}/월 (${savingsPercent}%)\n`));

  // Provider 비교
  console.log(chalk.bold('⚖️ Provider 비용 비교 (출시 6개월 기준):\n'));

  const geminiCost = 180000 * 0.002;  // Gemini Flash 예상
  const claudeCost = 180000 * 0.0165; // Claude Sonnet 실측

  console.log(`   Gemini 1.5 Flash: $${geminiCost.toFixed(2)}/월 ✨ 경제적`);
  console.log(`   Claude Sonnet 4: $${claudeCost.toFixed(2)}/월`);
  console.log(chalk.cyan(`   💡 비용 차이: $${(claudeCost - geminiCost).toFixed(2)}/월\n`));

  // 경고 임계값
  console.log(chalk.bold('⚠️ 비용 경고 임계값:\n'));
  console.log(chalk.yellow(`   주의: $1,000/월 이상`));
  console.log(chalk.red(`   위험: $5,000/월 이상`));
  console.log(chalk.gray(`   현재 최대 예상 (${getProviderName()}): $${scenarios[3].totalCost.toFixed(2)}/월 ✅\n`));

  // JSON 저장
  await writeFile(
    './results/cost-estimate.json',
    JSON.stringify({
      provider: getProviderName(),
      scenarios,
      costPerRequest: estimatedCostPerRequest,
      comparison: {
        gemini: geminiCost,
        claude: claudeCost,
        difference: claudeCost - geminiCost
      }
    }, null, 2)
  );

  console.log(chalk.green('✅ 비용 분석 완료! results/cost-estimate.json 저장됨\n'));
}

analyzeCosts();
