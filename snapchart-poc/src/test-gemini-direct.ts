#!/usr/bin/env tsx

import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';

config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('🔑 API Key exists:', !!apiKey);
console.log('🔑 API Key starts with:', apiKey?.substring(0, 10) + '...');

if (!apiKey) {
  console.error('❌ No API key found!');
  process.exit(1);
}

const client = new GoogleGenerativeAI(apiKey);

async function testDirect() {
  try {
    console.log('\n📡 Testing Gemini API...');

    // 여러 모델 이름 시도
    const modelNames = [
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
      'gemini-1.0-pro-latest',
      'gemini-pro',
    ];

    let result = null;
    let successModel = null;

    for (const modelName of modelNames) {
      try {
        console.log(`🔄 Trying model: ${modelName}...`);
        const model = client.getGenerativeModel({
          model: modelName,
        });

        result = await model.generateContent('Say "Hello World"');
        successModel = modelName;
        console.log(`✅ Success with: ${modelName}`);
        break;
      } catch (err: any) {
        console.log(`❌ Failed: ${modelName}`);
      }
    }

    if (!result || !successModel) {
      throw new Error('All models failed');
    }
    const response = result.response;
    const text = response.text();

    console.log('✅ Success!');
    console.log('📝 Response:', text);
    console.log('📊 Usage:', response.usageMetadata);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('📋 Full error:', error);
  }
}

testDirect();
