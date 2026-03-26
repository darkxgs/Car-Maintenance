// ===== AI Supervisor =====
// Acts as work supervisor - validates data, compares with database, prevents incomplete entries

class AISupervisor {
    constructor() {
        this.requiredFields = {
            inquiry: ['brand', 'model', 'year', 'engineSize'],
            service: ['brand', 'model', 'year', 'engineSize', 'oilUsed', 'oilViscosity', 'oilQuantity']
        };
    }

    // Validate input completeness
    validateInput(data, operationType) {
        const required = this.requiredFields[operationType];
        const missing = [];

        required.forEach(field => {
            if (!data[field] || data[field].toString().trim() === '') {
                missing.push(this.getFieldLabel(field));
            }
        });

        if (missing.length > 0) {
            return {
                valid: false,
                message: `⚠️ بيانات ناقصة! يرجى إدخال: ${missing.join('، ')}`
            };
        }

        return { valid: true };
    }

    getFieldLabel(field) {
        const labels = {
            brand: 'نوع العربية',
            model: 'الموديل',
            year: 'سنة الصنع',
            engineSize: 'حجم المحرك',
            oilUsed: 'نوع الزيت',
            oilViscosity: 'اللزوجة',
            oilQuantity: 'الكمية'
        };
        return labels[field] || field;
    }

    // Compare with database
    async compareWithDatabase(carData) {
        const car = await db.findCar(carData.brand, carData.model, parseInt(carData.year), carData.engineSize);

        if (!car) {
            return {
                found: false,
                message: '⚠️ لا توجد بيانات لهذه السيارة في قاعدة البيانات'
            };
        }

        return {
            found: true,
            recommended: {
                oilType: car.oil_type,
                oilViscosity: car.oil_viscosity,
                oilQuantity: car.oil_quantity
            }
        };
    }

    // Try OpenRouter AI analysis (with timeout and fallback)
    async tryOpenRouterAI(carData, operation = 'analyze') {
        try {
            console.log('🤖 Trying OpenRouter AI...');

            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const endpoint = operation === 'analyze' ? '/api/ai/analyze' : '/api/ai/compare';

            // Get auth token for API call
            const session = auth.getSession();

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.token}`
                },
                body: JSON.stringify(operation === 'analyze' ? carData : { serviceData: carData.serviceData, recommended: carData.recommended }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const result = await response.json();

            if (result.success) {
                console.log('✅ OpenRouter AI succeeded');
                return { success: true, data: result, source: 'ai' };
            } else {
                console.warn('⚠️ OpenRouter AI failed, using fallback');
                return { success: false, error: result.error };
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.warn('⏱️ OpenRouter AI timeout, using fallback');
            } else {
                console.warn('❌ OpenRouter AI error:', error.message, '- using fallback');
            }
            return { success: false, error: error.message };
        }
    }

    // Check if service data matches recommendation
    checkMatch(serviceData, recommended) {
        const mismatches = [];

        if (serviceData.oilUsed.toLowerCase() !== recommended.oilType.toLowerCase()) {
            mismatches.push({
                field: 'نوع الزيت',
                expected: recommended.oilType,
                actual: serviceData.oilUsed
            });
        }

        const recViscosities = recommended.oilViscosity.split(',').map(v => v.trim().toLowerCase());
        if (!recViscosities.includes(serviceData.oilViscosity.toLowerCase())) {
            mismatches.push({
                field: 'اللزوجة',
                expected: recommended.oilViscosity,
                actual: serviceData.oilViscosity
            });
        }

        const qtyDiff = Math.abs(parseFloat(serviceData.oilQuantity) - recommended.oilQuantity);
        if (qtyDiff > 0.5) {
            mismatches.push({
                field: 'الكمية',
                expected: `${recommended.oilQuantity} لتر`,
                actual: `${serviceData.oilQuantity} لتر`
            });
        }

        return {
            isMatching: mismatches.length === 0,
            mismatches
        };
    }

    // Process inquiry (Case 1) - HYBRID AI
    async processInquiry(carData) {
        const validation = this.validateInput(carData, 'inquiry');
        if (!validation.valid) return { success: false, ...validation };

        let recommendedData = null;
        let dataSource = 'fallback';

        // Try OpenRouter AI first
        const aiResult = await this.tryOpenRouterAI(carData, 'analyze');

        if (aiResult.success && aiResult.data.data) {
            // Use AI recommendation
            recommendedData = aiResult.data.data;
            dataSource = 'openrouter-ai';
            console.log('💡 Using OpenRouter AI recommendation');
        } else {
            // Fallback to database lookup
            console.log('🔄 Falling back to database lookup');
            const comparison = await this.compareWithDatabase(carData);
            if (!comparison.found) return { success: false, ...comparison };
            recommendedData = comparison.recommended;
            dataSource = 'database';
        }

        // Record the inquiry
        const session = auth.getSession();
        await db.add('operations', {
            car_brand: carData.brand,
            car_model: carData.model,
            car_year: parseInt(carData.year),
            engine_size: carData.engineSize,
            oil_used: recommendedData.oilType,
            oil_viscosity: recommendedData.oilViscosity,
            oil_quantity: recommendedData.oilQuantity,
            oil_filter: 0,
            air_filter: 0,
            cooling_filter: 0,
            is_matching: 1,
            mismatch_reason: null,
            operation_type: 'inquiry',
            user_id: session.userId,
            branch_id: session.branchId,
            created_at: new Date().toISOString()
        });

        return {
            success: true,
            operation: 'inquiry',
            data: recommendedData,
            dataSource,
            message: `✅ تم تسجيل الاستعلام ${dataSource === 'openrouter-ai' ? '(AI)' : ''}`
        };
    }

    // Process service (Case 2) - HYBRID AI
    async processService(serviceData, mismatchReason = null) {
        const validation = this.validateInput(serviceData, 'service');
        if (!validation.valid) return { success: false, ...validation };

        const comparison = await this.compareWithDatabase(serviceData);

        let isMatching = true;
        let needsReason = false;
        let matchResult = null;
        let aiAnalysis = null;

        if (comparison.found) {
            // Try AI comparison first
            const aiCompareResult = await this.tryOpenRouterAI({
                serviceData: serviceData,
                recommended: comparison.recommended
            }, 'compare');

            if (aiCompareResult.success && aiCompareResult.data) {
                // Use AI comparison
                console.log('💡 Using OpenRouter AI comparison');
                isMatching = aiCompareResult.data.isMatching;
                matchResult = {
                    isMatching: aiCompareResult.data.isMatching,
                    mismatches: aiCompareResult.data.mismatches || []
                };
                aiAnalysis = aiCompareResult.data.analysis;
            } else {
                // Fallback to rule-based comparison
                console.log('🔄 Falling back to rule-based comparison');
                matchResult = this.checkMatch(serviceData, comparison.recommended);
                isMatching = matchResult.isMatching;
            }

            if (!isMatching && !mismatchReason) {
                return {
                    success: false,
                    needsReason: true,
                    mismatches: matchResult.mismatches,
                    recommended: comparison.recommended,
                    analysis: aiAnalysis,
                    message: '⚠️ البيانات المدخلة تختلف عن المقترح. يرجى توضيح السبب.'
                };
            }
        }

        const session = auth.getSession();
        await db.add('operations', {
            car_brand: serviceData.brand,
            car_model: serviceData.model,
            car_year: parseInt(serviceData.year),
            engine_size: serviceData.engineSize,
            oil_used: serviceData.oilUsed,
            oil_viscosity: serviceData.oilViscosity,
            oil_quantity: parseFloat(serviceData.oilQuantity),
            oil_filter: serviceData.oilFilter ? 1 : 0,
            air_filter: serviceData.airFilter ? 1 : 0,
            cooling_filter: serviceData.coolingFilter ? 1 : 0,
            is_matching: isMatching ? 1 : 0,
            mismatch_reason: mismatchReason || (aiAnalysis ? `AI: ${aiAnalysis}` : null),
            operation_type: 'service',
            user_id: session.userId,
            branch_id: session.branchId,
            created_at: new Date().toISOString()
        });

        return {
            success: true,
            type: 'service',
            isMatching,
            message: `✅ تم تسجيل العملية بنجاح ${aiAnalysis ? '(AI)' : ''}`
        };
    }
}

const aiSupervisor = new AISupervisor();
