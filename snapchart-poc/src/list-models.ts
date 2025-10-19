#!/usr/bin/env tsx

import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';

config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ No API key found!');
  process.exit(1);
}

const client = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log('📋 Listing available models...\n');

    const models = await client.listModels();

    for await (const model of models) {
      console.log('🤖 Model:', model.name);
      console.log('   Display name:', model.displayName);
      console.log('   Description:', model.description);
      console.log('   Supported methods:', model.supportedGenerationMethods);
      console.log('');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

listModels();
