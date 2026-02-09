import sql from '../../lib/db';

/**
 * /api/operations
 * GET: Get all operations with optional filtering, sorting, and pagination
 * POST: Create a new operation
 */
export default async function handler(req, res) {
    if (req.method === 'GET') {
        return handleGet(req, res);
    } else if (req.method === 'POST') {
        return handlePost(req, res);
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}

async function handleGet(req, res) {

    try {
        const {
            page = '1',
            limit = '25',
            search = '',
            sortBy = 'created_at',
            sortOrder = 'desc',
            branchId,
            startDate,
            endDate,
            isMatching
        } = req.query;

        console.log('Operations API Request:', { page, limit, search, branchId, startDate, endDate, isMatching });

        const currentPage = Math.max(parseInt(page), 1);
        const pageLimit = Math.min(Math.max(parseInt(limit), 10), 100);
        const offset = (currentPage - 1) * pageLimit;

        // Build filtering conditions dynamically
        const conditions = [];

        if (branchId) {
            conditions.push(sql`branch_id = ${parseInt(branchId)}`);
        }

        if (startDate) {
            conditions.push(sql`DATE(created_at) >= ${startDate}`);
        }

        if (endDate) {
            conditions.push(sql`DATE(created_at) <= ${endDate}`);
        }

        if (isMatching !== undefined && isMatching !== null && isMatching !== '') {
            conditions.push(sql`is_matching = ${parseInt(isMatching)}`);
        }

        if (search && search.trim()) {
            const searchTerm = `%${search.trim()}%`;
            conditions.push(sql`(
                car_brand ILIKE ${searchTerm} OR
                car_model ILIKE ${searchTerm} OR
                oil_used ILIKE ${searchTerm} OR
                oil_viscosity ILIKE ${searchTerm} OR
                engine_size ILIKE ${searchTerm} OR
                CAST(car_year AS TEXT) LIKE ${searchTerm}
            )`);
        }

        // Combine conditions
        const whereClause = conditions.length > 0
            ? conditions.reduce((acc, curr, i) => i === 0 ? sql`WHERE ${curr}` : sql`${acc} AND ${curr}`, sql``)
            : sql``;

        // Safe sort column mapping
        let sortColumnFragment;
        switch (sortBy) {
            case 'car_brand': sortColumnFragment = sql`car_brand`; break;
            case 'car_model': sortColumnFragment = sql`car_model`; break;
            case 'car_year': sortColumnFragment = sql`car_year`; break;
            case 'oil_used': sortColumnFragment = sql`oil_used`; break;
            case 'oil_viscosity': sortColumnFragment = sql`oil_viscosity`; break;
            case 'oil_quantity': sortColumnFragment = sql`oil_quantity`; break;
            case 'is_matching': sortColumnFragment = sql`is_matching`; break;
            default: sortColumnFragment = sql`created_at`;
        }

        const sortOrderFragment = sortOrder.toLowerCase() === 'asc' ? sql`ASC` : sql`DESC`;

        // Get total count
        const countResult = await sql`
            SELECT COUNT(*) as total
            FROM operations
            ${whereClause}
        `;
        const total = parseInt(countResult[0].total);
        const totalPages = Math.ceil(total / pageLimit);

        // Get paginated data
        const operations = await sql`
            SELECT *
            FROM operations
            ${whereClause}
            ORDER BY ${sortColumnFragment} ${sortOrderFragment}
            LIMIT ${pageLimit}
            OFFSET ${offset}
        `;

        return res.status(200).json({
            data: operations,
            pagination: {
                page: currentPage,
                limit: pageLimit,
                total,
                totalPages,
                hasNext: currentPage < totalPages,
                hasPrev: currentPage > 1
            },
            filters: {
                search,
                branchId: branchId ? parseInt(branchId) : null,
                startDate: startDate || null,
                endDate: endDate || null,
                isMatching: isMatching !== undefined ? parseInt(isMatching) : null,
                sortBy: sortBy,
                sortOrder: sortOrder.toLowerCase()
            }
        });

    } catch (error) {
        console.error('Error fetching operations:', error);
        return res.status(500).json({ error: 'Failed to fetch operations' });
    }
}

async function handlePost(req, res) {
    try {
        console.log('POST /api/operations - Request body:', req.body);

        const {
            car_brand, car_model, car_year, engine_size,
            oil_used, oil_viscosity, oil_quantity,
            oil_filter, air_filter, cooling_filter,
            is_matching, mismatch_reason, operation_type,
            user_id, branch_id
        } = req.body;

        console.log('Attempting to insert operation with data:', {
            car_brand, car_model, car_year, engine_size,
            oil_used, oil_viscosity, oil_quantity,
            oil_filter, air_filter, cooling_filter,
            is_matching, mismatch_reason, operation_type,
            user_id, branch_id
        });

        const result = await sql`
            INSERT INTO operations (
                car_brand, car_model, car_year, engine_size,
                oil_used, oil_viscosity, oil_quantity,
                oil_filter, air_filter, cooling_filter,
                is_matching, mismatch_reason, operation_type,
                user_id, branch_id, created_at
            )
            VALUES (
                ${car_brand}, ${car_model}, ${car_year}, ${engine_size},
                ${oil_used}, ${oil_viscosity}, ${oil_quantity},
                ${oil_filter || 0}, ${air_filter || 0}, ${cooling_filter || 0},
                ${is_matching}, ${mismatch_reason || null}, ${operation_type},
                ${user_id}, ${branch_id}, NOW()
            )
            RETURNING *
        `;

        console.log('Operation created successfully:', result[0]);
        return res.status(201).json(result[0]);
    } catch (error) {
        console.error('Error creating operation:', error);
        console.error('Error stack:', error.stack);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            detail: error.detail,
            constraint: error.constraint
        });
        return res.status(500).json({
            error: 'Failed to create operation',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
