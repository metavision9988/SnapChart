#!/usr/bin/env tsx

import { config } from 'dotenv';

config();

const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
  console.log('🔑 API Key:', apiKey?.substring(0, 15) + '...');

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    console.log('\n📡 Fetching available models...');

    const response = await fetch(url);

    console.log('📊 Status:', response.status, response.statusText);

    const data = await response.json();

    if (response.ok) {
      console.log('\n✅ Available models:\n');

      if (data.models && Array.isArray(data.models)) {
        data.models.forEach((model: any) => {
          console.log(`🤖 ${model.name}`);
          console.log(`   Display: ${model.displayName}`);
          console.log(`   Methods: ${model.supportedGenerationMethods?.join(', ')}`);
          console.log('');
        });

        console.log(`📊 Total: ${data.models.length} models`);
      } else {
        console.log('📦 Response:', JSON.stringify(data, null, 2));
      }
    } else {
      console.log('❌ Error:', JSON.stringify(data, null, 2));
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

listModels();
