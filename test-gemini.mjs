/**
 * Direct Gemini AI Test Script
 * Tests the Gemini API directly to verify it's working
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyCqzVp1fct2FOiScQeDSbzOeSmcA4_vXGc';

async function testGemini() {
    console.log('🧪 Testing Gemini AI directly...\n');

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `You are a car maintenance expert. Analyze the following car data and suggest the appropriate oil:

Car Brand: BMW
Model: 320i
Year: 2020
Engine Size: 2.0L

Respond ONLY with valid JSON in this exact format (no extra text):
{
  "oilType": "Recommended oil type (e.g., Synthetic 5W-30)",
  "oilViscosity": "Viscosity only (e.g., 5W-30)",
  "oilQuantity": number only (e.g., 4.5),
  "reasoning": "Brief explanation in English"
}`;

        console.log('📤 Sending request to Gemini...');
        const startTime = Date.now();

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const duration = Date.now() - startTime;
        console.log(`⏱️  Response time: ${duration}ms\n`);

        console.log('📥 Raw Gemini Response:');
        console.log(text);
        console.log('\n---\n');

        // Extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            console.log('✅ Parsed JSON:');
            console.log(JSON.stringify(parsed, null, 2));
        } else {
            console.error('❌ No JSON found in response');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response);
        }
    }
}

testGemini();
