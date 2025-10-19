#!/usr/bin/env tsx

import { createAIProvider } from './utils/provider-factory.js';

async function quickTest() {
  try {
    console.log('🧪 Quick Gemini Test\n');

    const provider = createAIProvider();

    console.log('📡 Calling API...');
    const response = await provider.generate('Say "Hello World"');

    console.log('✅ Success!');
    console.log('📝 Response:', response.text);
    console.log('📊 Tokens:', response.usage);
    console.log('💰 Cost: $' + provider.calculateCost(response.usage.inputTokens, response.usage.outputTokens).toFixed(6));

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

quickTest();
