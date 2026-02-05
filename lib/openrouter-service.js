/**
 * OpenRouter AI Service
 * Server-side integration with OpenRouter for access to multiple AI models
 * Uses free models for intelligent car maintenance analysis
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'arcee-ai/trinity-large-preview:free'; // More reliable free tier model

/**
 * Analyze car data and get oil recommendations using OpenRouter AI
 * @param {Object} carData - { brand, model, year, engineSize }
 * @returns {Promise<Object>} - { success, oilType, oilViscosity, oilQuantity, reasoning }
 */
export async function analyzeCarOil(carData, dbOptions) {
    // Format options for AI
    const optionsText = dbOptions.map((opt, i) =>
        `Option ${i + 1}: Oil Type: ${opt.oil_type}, Viscosity: ${opt.viscosity}, Quantity: ${opt.quantity}L (Year Range: ${opt.year_from}-${opt.year_to})`
    ).join('\n');

    const prompt = `بصفتك خبيرًا متخصصًا في صيانة السيارات، مهمتك هي تحليل البيانات التالية واختيار الزيت الأنسب حصريًا من خيارات قاعدة البيانات المرفقة.
    
تحذير هام: لا تقم أبدًا باختراع بيانات أو استخدام معلومات خارجية. يجب أن يكون اختيارك من ضمن الخيارات المحددة في الأسفل فقط.

معلومات السيارة:
الشركة المصنعة (Brand): ${carData.brand}
الموديل (Model): ${carData.model}
سنة الصنع (Year): ${carData.year}
حجم المحرك (Engine Size): ${carData.engineSize}

خيارات قاعدة البيانات المتاحة (Database Options):
${optionsText}

المطلوب:
1. قم بدراسة الخيارات المتاحة بعناية.
2. اختر الخيار الذي يطابق مواصفات السيارة أعلاه (تأكد من توافق سنة الصنع مع نطاق السنوات في الخيار).
3. قدم النتيجة بصيغة JSON فقط.

صيغة الرد المطلوبة (JSON Format):
يجب أن يكون الرد كائن JSON صالح تمامًا، ويحتوي على المفاتيح التالية باللغة الإنجليزية حصريًا:
{
  "oilType": "نوع الزيت من الخيار الذي اخترته",
  "oilViscosity": "درجة اللزوجة من الخيار الذي اخترته",
  "oilQuantity": رقم يمثل الكمية باللتر (مثال: 4.5),
  "reasoning": "اشرح باختصار ووضوح باللغة العربية لماذا اخترت هذا الخيار تحديدًا (مثال: 'هذا الزيت موصى به لموديلات 2018-2022')"
}`;



    // Retry logic for rate limiting
    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'Car Maintenance System'
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                const error = await response.text();

                // If rate limited and we have retries left, wait and retry
                if (response.status === 429 && attempt < 2) {
                    console.log('OpenRouter rate limited, retrying in 2s...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    continue;
                }

                throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
            }

            const data = await response.json();
            const text = data.choices[0].message.content;

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
                source: 'openrouter-ai'
            };
        } catch (error) {
            // If this was our last attempt, return error
            if (attempt === 2) {
                console.error('OpenRouter AI Error:', error);
                return {
                    success: false,
                    error: error.message,
                    source: 'openrouter-ai'
                };
            }
        }
    }
}

/**
 * Compare service data with recommended data using OpenRouter AI
 * Provides intelligent mismatch detection with reasoning
 * @param {Object} serviceData - User input data
 * @param {Object} recommended - Recommended data from database or AI
 * @returns {Promise<Object>} - { success, isMatching, mismatches, analysis }
 */
export async function compareServiceData(serviceData, recommended) {
    try {
        const prompt = `You are a car maintenance supervisor. Compare the entered data with the recommended data:

Entered Data:
- Oil Type: ${serviceData.oilUsed}
- Viscosity: ${serviceData.oilViscosity}
- Quantity: ${serviceData.oilQuantity} liters

Recommended Data:
- Oil Type: ${recommended.oilType}
- Viscosity: ${recommended.oilViscosity}
- Quantity: ${recommended.oilQuantity} liters

Car Info: ${serviceData.brand} ${serviceData.model} ${serviceData.year}

Analyze the differences and give your opinion. Respond ONLY with JSON:
{
  "isMatching": true or false,
  "mismatches": [
    {
      "field": "field name",
      "expected": "recommended value",
      "actual": "entered value",
      "severity": "high" or "medium" or "low"
    }
  ],
  "analysis": "brief analysis in English about why different and if acceptable",
  "recommendation": "short advice"
}`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'Car Maintenance System'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
        }

        const data = await response.json();
        const text = data.choices[0].message.content;

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
            source: 'openrouter-ai'
        };
    } catch (error) {
        console.error('OpenRouter AI Comparison Error:', error);
        return {
            success: false,
            error: error.message,
            source: 'openrouter-ai'
        };
    }
}
