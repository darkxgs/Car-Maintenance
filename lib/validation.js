import { z } from 'zod';

/**
 * Validation Schemas for API inputs
 */

// User credentials schema
export const loginSchema = z.object({
    username: z.string().min(3).max(100),
    password: z.string().min(6)
});

// Operation creation schema
export const operationSchema = z.object({
    car_brand: z.string().min(1).max(100),
    car_model: z.string().min(1).max(100),
    car_year: z.number().int().min(1900).max(2100),
    engine_size: z.string().min(1).max(50),
    oil_used: z.string().min(1).max(100),
    oil_viscosity: z.string().min(1).max(50),
    oil_quantity: z.number().positive().max(100),
    oil_filter: z.number().int().min(0).max(1).optional().default(0),
    air_filter: z.number().int().min(0).max(1).optional().default(0),
    cooling_filter: z.number().int().min(0).max(1).optional().default(0),
    is_matching: z.number().int().min(0).max(1).default(1),
    mismatch_reason: z.string().optional().nullable(),
    operation_type: z.string().min(1).max(50),
    user_id: z.number().int().positive(),
    branch_id: z.number().int().positive()
});

// Car schema
export const carSchema = z.object({
    brand: z.string().min(1).max(100),
    model: z.string().min(1).max(100),
    year_from: z.number().int().min(1900).max(2100),
    year_to: z.number().int().min(1900).max(2100),
    engine_size: z.string().min(1).max(50),
    oil_type: z.string().min(1).max(100),
    oil_viscosity: z.string().min(1).max(50),
    oil_quantity: z.number().positive().max(100)
});

// User creation/update schema
export const userSchema = z.object({
    username: z.string().min(3).max(100),
    password: z.string().min(6).max(255).optional(),
    name: z.string().min(1).max(255),
    branch_id: z.number().int().positive(),
    role: z.enum(['admin', 'employee']).default('employee')
});

// Branch schema
export const branchSchema = z.object({
    name: z.string().min(1).max(255),
    location: z.string().min(1).max(255)
});

// Report query parameters schema
export const reportQuerySchema = z.object({
    branchId: z.coerce.number().int().positive().optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()
});

// Password change schema
export const passwordChangeSchema = z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
});

/**
 * Input sanitization functions
 */

/**
 * Sanitize string input to prevent SQL injection
 * @param {string} input - Raw input string
 * @returns {string} Sanitized string
 */
export function sanitizeString(input) {
    if (typeof input !== 'string') return '';

    // Remove null bytes
    let sanitized = input.replace(/\0/g, '');

    // Trim whitespace
    sanitized = sanitized.trim();

    return sanitized;
}

/**
 * Sanitize numeric input
 * @param {any} input - Raw input
 * @returns {number|null} Sanitized number or null
 */
export function sanitizeNumber(input) {
    const num = Number(input);
    return isNaN(num) ? null : num;
}

/**
 * Validate and sanitize request body against schema
 * @param {Object} data - Request body data
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Object} Validated and sanitized data
 * @throws {Error} If validation fails
 */
export function validateAndSanitize(data, schema) {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
            throw new Error(`Validation failed: ${messages.join(', ')}`);
        }
        throw error;
    }
}

/**
 * Middleware wrapper for API routes with validation
 * @param {Function} handler - API route handler
 * @param {z.ZodSchema} schema - Zod schema for request body validation
 * @returns {Function} Wrapped handler with validation
 */
export function withValidation(handler, schema) {
    return async (req, res) => {
        try {
            // Validate request body
            req.validatedBody = validateAndSanitize(req.body, schema);
            return await handler(req, res);
        } catch (error) {
            return res.status(400).json({
                error: error.message || 'Validation failed'
            });
        }
    };
}
