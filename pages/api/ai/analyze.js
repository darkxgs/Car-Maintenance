/**
 * AI Analysis API Endpoint
 * Uses OpenRouter AI to analyze car data and provide oil recommendations
 */

import { analyzeCarOil } from '../../../lib/openrouter-service.js';
import sql from '../../../lib/db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { brand, model, year, engineSize } = req.body;

        // Validate input
        if (!brand || !model || !year || !engineSize) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Query database for valid options
        const dbOptions = await sql`
            SELECT id, oil_type, oil_viscosity as viscosity, oil_quantity as quantity, year_from, year_to 
            FROM cars 
            WHERE LOWER(brand) = LOWER(${brand}) 
            AND LOWER(model) = LOWER(${model}) 
            AND LOWER(engine_size) = LOWER(${engineSize})
            AND ${parseInt(year)} >= year_from 
            AND ${parseInt(year)} <= year_to
        `;

        if (dbOptions.length === 0) {
            return res.status(200).json({
                success: false,
                error: 'Car not found in database. AI restricted to database options only.',
                usesFallback: true
            });
        }

        // Call AI service with restricted options
        const result = await analyzeCarOil({ brand, model, year, engineSize }, dbOptions);

        if (!result.success) {
            return res.status(200).json({
                success: false,
                error: result.error,
                usesFallback: true
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                oilType: result.oilType,
                oilViscosity: result.oilViscosity,
                oilQuantity: result.oilQuantity,
                reasoning: result.reasoning
            },
            source: 'gemini-ai'
        });
    } catch (error) {
        console.error('AI Analysis API Error:', error);
        return res.status(200).json({
            success: false,
            error: error.message,
            usesFallback: true
        });
    }
}
