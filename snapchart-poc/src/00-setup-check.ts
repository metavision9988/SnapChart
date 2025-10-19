#!/usr/bin/env bun

import chalk from 'chalk';
import { config } from 'dotenv';

config();

interface SetupCheck {
  name: string;
  check: () => boolean | Promise<boolean>;
  required: boolean;
}

// AI Provider 확인
const aiProvider = process.env.AI_PROVIDER || 'gemini';

const checks: SetupCheck[] = [
  {
    name: 'Node.js/Bun 버전',
    check: () => {
      const version = process.version;
      const major = parseInt(version.slice(1).split('.')[0]);
      return major >= 20;
    },
    required: true
  },
  {
    name: `AI Provider 설정 (현재: ${aiProvider})`,
    check: () => {
      const provider = process.env.AI_PROVIDER || 'gemini';
      return ['gemini', 'claude'].includes(provider.toLowerCase());
    },
    required: true
  },
  {
    name: `${aiProvider === 'gemini' ? 'GEMINI_API_KEY' : 'ANTHROPIC_API_KEY'} 환경 변수`,
    check: () => {
      if (aiProvider === 'gemini') {
        const key = process.env.GEMINI_API_KEY;
        return !!key && key.length > 0;
      } else {
        const key = process.env.ANTHROPIC_API_KEY;
        return !!key && key.startsWith('sk-ant-');
      }
    },
    required: true
  },
  {
    name: 'results 폴더',
    check: async () => {
      try {
        await Bun.write('./results/diagrams/.gitkeep', '');
        return true;
      } catch {
        return false;
      }
    },
    required: false
  }
];

async function runSetupCheck() {
  console.log(chalk.bold.blue('\n🔍 SnapChart PoC - 환경 검증\n'));

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    try {
      const result = await check.check();

      if (result) {
        console.log(chalk.green('✓'), check.name);
        passed++;
      } else {
        console.log(
          check.required
            ? chalk.red('✗')
            : chalk.yellow('⚠'),
          check.name
        );

        if (check.required) {
          failed++;
        }
      }
    } catch (error) {
      console.log(chalk.red('✗'), check.name);
      if (check.required) failed++;
    }
  }

  console.log('\n' + '─'.repeat(50));
  console.log(chalk.bold(`통과: ${passed} / 실패: ${failed}`));

  if (failed > 0) {
    console.log(chalk.red.bold('\n❌ 필수 항목이 충족되지 않았습니다.'));
    console.log(chalk.yellow('\n해결 방법:'));
    console.log('1. .env 파일을 생성하고 API 키를 설정하세요');
    console.log(`   - Gemini 사용 시: GEMINI_API_KEY 설정`);
    console.log(`   - Claude 사용 시: ANTHROPIC_API_KEY 설정`);
    console.log('2. AI_PROVIDER 환경 변수를 "gemini" 또는 "claude"로 설정하세요');
    console.log('3. Node.js 20+ 또는 Bun 1.1+를 설치하세요');
    process.exit(1);
  }

  console.log(chalk.green.bold('\n✅ 환경 검증 완료! 테스트를 시작할 수 있습니다.\n'));
}

runSetupCheck();
