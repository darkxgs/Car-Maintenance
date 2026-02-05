import sql from '../../lib/db';

/**
 * GET /api/operations
 * Get all operations with optional filtering, sorting, and pagination
 */
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
