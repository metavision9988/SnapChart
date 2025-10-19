#!/usr/bin/env tsx

import { config } from 'dotenv';

config();

const apiKey = process.env.GEMINI_API_KEY;

async function testRestAPI() {
  console.log('🔑 API Key:', apiKey?.substring(0, 15) + '...');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  try {
    console.log('\n📡 Calling REST API...');
    console.log('🌐 URL:', url.replace(apiKey!, 'API_KEY'));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Say "Hello World"'
          }]
        }]
      })
    });

    console.log('📊 Status:', response.status, response.statusText);

    const data = await response.json();
    console.log('📦 Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Success!');
      console.log('📝 Text:', data.candidates?.[0]?.content?.parts?.[0]?.text);
    } else {
      console.log('\n❌ Failed!');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

testRestAPI();
