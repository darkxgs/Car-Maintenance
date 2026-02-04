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

        // Parse and validate parameters
        const currentPage = Math.max(parseInt(page), 1);
        const pageLimit = Math.min(Math.max(parseInt(limit), 10), 100);
        const offset = (currentPage - 1) * pageLimit;

        // Valid sort columns
        const validSortColumns = [
            'created_at', 'car_brand', 'car_model', 'car_year',
            'oil_used', 'oil_viscosity', 'oil_quantity', 'is_matching'
        ];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
        const order = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

        // Build WHERE clause conditions
        const conditions = [];
        const params = [];

        if (branchId) {
            conditions.push(`branch_id = $${params.length + 1}`);
            params.push(parseInt(branchId));
        }

        if (startDate) {
            conditions.push(`DATE(created_at) >= $${params.length + 1}`);
            params.push(startDate);
        }

        if (endDate) {
            conditions.push(`DATE(created_at) <= $${params.length + 1}`);
            params.push(endDate);
        }

        if (isMatching !== undefined && isMatching !== null && isMatching !== '') {
            conditions.push(`is_matching = $${params.length + 1}`);
            params.push(parseInt(isMatching));
        }

        // Full-text search across multiple columns
        if (search && search.trim()) {
            const searchTerm = `%${search.trim()}%`;
            conditions.push(`(
                car_brand ILIKE $${params.length + 1} OR
                car_model ILIKE $${params.length + 1} OR
                oil_used ILIKE $${params.length + 1} OR
                oil_viscosity ILIKE $${params.length + 1} OR
                engine_size ILIKE $${params.length + 1} OR
                CAST(car_year AS TEXT) LIKE $${params.length + 1}
            )`);
            params.push(searchTerm);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total
            FROM operations
            ${whereClause}
        `;

        const countResult = await sql.unsafe(countQuery, params);
        const total = parseInt(countResult[0].total);

        // Get paginated data
        const dataQuery = `
            SELECT *
            FROM operations
            ${whereClause}
            ORDER BY ${sortColumn} ${order}
            LIMIT $${params.length + 1}
            OFFSET $${params.length + 2}
        `;

        const operations = await sql.unsafe(dataQuery, [...params, pageLimit, offset]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(total / pageLimit);

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
                sortBy: sortColumn,
                sortOrder: order.toLowerCase()
            }
        });

    } catch (error) {
        console.error('Error fetching operations:', error);
        return res.status(500).json({ error: 'Failed to fetch operations' });
    }
}
