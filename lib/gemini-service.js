/**
 * Gemini AI Service
 * Server-side integration with Google Gemini AI for intelligent car maintenance analysis
 * Provides structured oil recommendations and data validation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze car data and get oil recommendations using Gemini AI
 * @param {Object} carData - { brand, model, year, engineSize }
 * @returns {Promise<Object>} - { success, oilType, oilViscosity, oilQuantity, reasoning }
 */
export async function analyzeCarOil(carData) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `You are a car maintenance expert. Analyze the following car data and suggest the appropriate oil:

Car Brand: ${carData.brand}
Model: ${carData.model}
Year: ${carData.year}
Engine Size: ${carData.engineSize}

Respond ONLY with valid JSON in this exact format (no extra text):
{
  "oilType": "Recommended oil type (e.g., Synthetic 5W-30)",
  "oilViscosity": "Viscosity only (e.g., 5W-30)",
  "oilQuantity": number only (e.g., 4.5),
  "reasoning": "Brief explanation in English"
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('AI response not in JSON format');
        }

        const aiResponse = JSON.parse(jsonMatch[0]);

        return {
            success: true,
            oilType: aiResponse.oilType,
            oilViscosity: aiResponse.oilViscosity,
            oilQuantity: parseFloat(aiResponse.oilQuantity),
            reasoning: aiResponse.reasoning,
            source: 'gemini-ai'
        };
    } catch (error) {
        console.error('Gemini AI Error:', error);
        return {
            success: false,
            error: error.message,
            source: 'gemini-ai'
        };
    }
}

/**
 * Compare service data with recommended data using Gemini AI
 * Provides intelligent mismatch detection with reasoning
 * @param {Object} serviceData - User input data
 * @param {Object} recommended - Recommended data from database or AI
 * @returns {Promise<Object>} - { success, isMatching, mismatches, analysis }
 */
export async function compareServiceData(serviceData, recommended) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `أنت مشرف صيانة سيارات. قارن بين البيانات المدخلة والبيانات المقترحة:

البيانات المدخلة:
- نوع الزيت: ${serviceData.oilUsed}
- اللزوجة: ${serviceData.oilViscosity}
- الكمية: ${serviceData.oilQuantity} لتر

البيانات المقترحة:
- نوع الزيت: ${recommended.oilType}
- اللزوجة: ${recommended.oilViscosity}
- الكمية: ${recommended.oilQuantity} لتر

معلومات السيارة: ${serviceData.brand} ${serviceData.model} ${serviceData.year}

حلل الاختلافات وأعط رأيك. الرد يجب أن يكون JSON فقط:
{
  "isMatching": true أو false,
  "mismatches": [
    {
      "field": "اسم الحقل",
      "expected": "القيمة المقترحة",
      "actual": "القيمة المدخلة",
      "severity": "high" أو "medium" أو "low"
    }
  ],
  "analysis": "تحليل قصير بالعربية عن سبب الاختلاف وهل مقبول",
  "recommendation": "نصيحة قصيرة"
}

ملاحظة: الرد يجب أن يكون JSON فقط بدون أي نص إضافي.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('AI response not in JSON format');
        }

        const aiResponse = JSON.parse(jsonMatch[0]);

        return {
            success: true,
            isMatching: aiResponse.isMatching,
            mismatches: aiResponse.mismatches || [],
            analysis: aiResponse.analysis,
            recommendation: aiResponse.recommendation,
            source: 'gemini-ai'
        };
    } catch (error) {
        console.error('Gemini AI Comparison Error:', error);
        return {
            success: false,
            error: error.message,
            source: 'gemini-ai'
        };
    }
}
