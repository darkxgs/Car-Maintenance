/**
 * AI Analysis API Endpoint
 * Uses OpenRouter AI to analyze car data and provide oil recommendations
 */

import { analyzeCarOil } from '../../../lib/openrouter-service.js';
import sql from '../../../lib/db.js';

export default async function handler(req, res) {
    console.log('🎯 [AI Analyze API] Request received');

    if (req.method !== 'POST') {
        console.log('❌ [AI Analyze API] Method not allowed:', req.method);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { brand, model, year, engineSize } = req.body;
        console.log('📝 [AI Analyze API] Request body:', { brand, model, year, engineSize });

        // Validate input
        if (!brand || !model || !year || !engineSize) {
            console.log('⚠️ [AI Analyze API] Missing required fields');
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Query database for valid options
        console.log('🔍 [AI Analyze API] Querying database for options...');
        const dbOptions = await sql`
            SELECT id, oil_type, oil_viscosity as viscosity, oil_quantity as quantity, year_from, year_to 
            FROM cars 
            WHERE LOWER(brand) = LOWER(${brand}) 
            AND LOWER(model) = LOWER(${model}) 
            AND LOWER(engine_size) = LOWER(${engineSize})
            AND ${parseInt(year)} >= year_from 
            AND ${parseInt(year)} <= year_to
        `;

        console.log(`📊 [AI Analyze API] Found ${dbOptions.length} database options`);

        if (dbOptions.length === 0) {
            console.log('❌ [AI Analyze API] No database options found');
            return res.status(200).json({
                success: false,
                error: 'Car not found in database. AI restricted to database options only.',
                usesFallback: true
            });
        }

        // Call AI service with restricted options
        console.log('🤖 [AI Analyze API] Calling OpenRouter AI service...');
        const result = await analyzeCarOil({ brand, model, year, engineSize }, dbOptions);
        console.log('📬 [AI Analyze API] AI service result:', result);

        if (!result.success) {
            console.log('⚠️ [AI Analyze API] AI service failed, returning error');
            return res.status(200).json({
                success: false,
                error: result.error,
                usesFallback: true
            });
        }

        console.log('✅ [AI Analyze API] Success, returning result');
        return res.status(200).json({
            success: true,
            data: {
                oilType: result.oilType,
                oilViscosity: result.oilViscosity,
                oilQuantity: result.oilQuantity,
                reasoning: result.reasoning
            },
            source: 'openrouter-ai'
        });
    } catch (error) {
        console.error('🔴 [AI Analyze API] Error:', error);
        return res.status(200).json({
            success: false,
            error: error.message,
            usesFallback: true
        });
    }
}
