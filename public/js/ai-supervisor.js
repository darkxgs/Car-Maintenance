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

        if (serviceData.oilViscosity.toLowerCase() !== recommended.oilViscosity.toLowerCase()) {
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

    // Process inquiry (Case 1)
    async processInquiry(carData) {
        const validation = this.validateInput(carData, 'inquiry');
        if (!validation.valid) return { success: false, ...validation };

        const comparison = await this.compareWithDatabase(carData);
        if (!comparison.found) return { success: false, ...comparison };

        // Record the inquiry
        const session = auth.getSession();
        await db.add('operations', {
            car_brand: carData.brand,
            car_model: carData.model,
            car_year: parseInt(carData.year),
            engine_size: carData.engineSize,
            oil_used: comparison.recommended.oilType,
            oil_viscosity: comparison.recommended.oilViscosity,
            oil_quantity: comparison.recommended.oilQuantity,
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
            type: 'inquiry',
            message: '✅ تم تسجيل الاستعلام',
            data: comparison.recommended
        };
    }

    // Process service (Case 2)
    async processService(serviceData, mismatchReason = null) {
        const validation = this.validateInput(serviceData, 'service');
        if (!validation.valid) return { success: false, ...validation };

        const comparison = await this.compareWithDatabase(serviceData);

        let isMatching = true;
        let needsReason = false;

        if (comparison.found) {
            const matchResult = this.checkMatch(serviceData, comparison.recommended);
            isMatching = matchResult.isMatching;

            if (!isMatching && !mismatchReason) {
                return {
                    success: false,
                    needsReason: true,
                    mismatches: matchResult.mismatches,
                    recommended: comparison.recommended,
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
            mismatch_reason: mismatchReason,
            operation_type: 'service',
            user_id: session.userId,
            branch_id: session.branchId,
            created_at: new Date().toISOString()
        });

        return {
            success: true,
            type: 'service',
            isMatching,
            message: '✅ تم تسجيل العملية بنجاح'
        };
    }
}

const aiSupervisor = new AISupervisor();
