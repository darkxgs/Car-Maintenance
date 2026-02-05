/**
 * AI Comparison API Endpoint
 * Uses OpenRouter AI to intelligently compare service data with recommendations
 */

import { compareServiceData } from '../../../lib/openrouter-service.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { serviceData, recommended } = req.body;

        // Validate input
        if (!serviceData || !recommended) {
            return res.status(400).json({
                success: false,
                error: 'Missing serviceData or recommended'
            });
        }

        // Call Gemini AI service
        const result = await compareServiceData(serviceData, recommended);

        if (!result.success) {
            return res.status(200).json({
                success: false,
                error: result.error,
                usesFallback: true
            });
        }

        return res.status(200).json({
            success: true,
            isMatching: result.isMatching,
            mismatches: result.mismatches,
            analysis: result.analysis,
            recommendation: result.recommendation,
            source: 'gemini-ai'
        });
    } catch (error) {
        console.error('AI Comparison API Error:', error);
        return res.status(200).json({
            success: false,
            error: error.message,
            usesFallback: true
        });
    }
}
