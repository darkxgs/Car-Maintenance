import sql from '../../../lib/db';
import { reportQuerySchema } from '../../../lib/validation';

/**
 * GET /api/reports/trends
 * Get trend data for charts (operations by day, branch, oil types, etc.)
 */
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { branchId, startDate, endDate, days = '30' } = req.query;

        // Validate inputs
        const validatedQuery = reportQuerySchema.parse({
            branchId: branchId ? parseInt(branchId) : undefined,
            startDate,
            endDate
        });

        // Calculate date range
        const daysNum = parseInt(days);
        const endDateObj = validatedQuery.endDate ? new Date(validatedQuery.endDate) : new Date();
        const startDateObj = validatedQuery.startDate
            ? new Date(validatedQuery.startDate)
            : new Date(endDateObj.getTime() - (daysNum * 24 * 60 * 60 * 1000));

        // Get all operations in date range
        let operations;
        if (validatedQuery.branchId) {
            operations = await sql`
        SELECT * FROM operations 
        WHERE branch_id = ${validatedQuery.branchId}
          AND created_at >= ${startDateObj.toISOString()}
          AND created_at <= ${endDateObj.toISOString()}
        ORDER BY created_at DESC
      `;
        } else {
            operations = await sql`
        SELECT * FROM operations 
        WHERE created_at >= ${startDateObj.toISOString()}
          AND created_at <= ${endDateObj.toISOString()}
        ORDER BY created_at DESC
      `;
        }

        // Group operations by date
        const operationsByDate = {};
        for (let i = 0; i < daysNum; i++) {
            const date = new Date(endDateObj);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            operationsByDate[dateStr] = 0;
        }

        operations.forEach(op => {
            const dateStr = new Date(op.created_at).toISOString().split('T')[0];
            if (operationsByDate.hasOwnProperty(dateStr)) {
                operationsByDate[dateStr]++;
            }
        });

        // Convert to array and sort
        const timelineData = Object.entries(operationsByDate)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Group by branch
        const branchData = {};
        const branchStats = await sql`
      SELECT 
        b.name as branch_name,
        COUNT(o.id) as operation_count
      FROM branches b
      LEFT JOIN operations o ON b.id = o.branch_id
        AND o.created_at >= ${startDateObj.toISOString()}
        AND o.created_at <= ${endDateObj.toISOString()}
      GROUP BY b.id, b.name
      ORDER BY operation_count DESC
    `;

        branchStats.forEach(stat => {
            branchData[stat.branch_name] = stat.operation_count;
        });

        // Group by oil type
        const oilTypeData = {};
        operations.forEach(op => {
            const oilType = op.oil_used || 'غير محدد';
            oilTypeData[oilType] = (oilTypeData[oilType] || 0) + 1;
        });

        // Group by viscosity
        const viscosityData = {};
        operations.forEach(op => {
            const viscosity = op.oil_viscosity || 'غير محدد';
            viscosityData[viscosity] = (viscosityData[viscosity] || 0) + 1;
        });

        // Group by filter type
        const filterData = {};
        operations.forEach(op => {
            const filter = op.filter_used || 'لا يوجد';
            filterData[filter] = (filterData[filter] || 0) + 1;
        });

        // Calculate KPIs
        const totalOps = operations.length;
        const matchingOps = operations.filter(op => op.is_matching).length;
        const mismatchedOps = totalOps - matchingOps;
        const totalOilUsed = operations.reduce((sum, op) => sum + (parseFloat(op.oil_quantity) || 0), 0);

        const uniqueDays = new Set(operations.map(op =>
            new Date(op.created_at).toISOString().split('T')[0]
        )).size;

        const kpis = {
            totalOperations: totalOps,
            matchingOperations: matchingOps,
            mismatchedOperations: mismatchedOps,
            totalOilUsed: Math.round(totalOilUsed * 10) / 10,
            avgOperationsPerDay: uniqueDays > 0 ? Math.round((totalOps / uniqueDays) * 10) / 10 : 0,
            mismatchRate: totalOps > 0 ? Math.round((mismatchedOps / totalOps) * 100 * 10) / 10 : 0,
            daysActive: uniqueDays
        };

        return res.status(200).json({
            timeline: timelineData,
            branches: branchData,
            oilTypes: oilTypeData,
            viscosity: viscosityData,
            filters: filterData,
            kpis,
            dateRange: {
                start: startDateObj.toISOString().split('T')[0],
                end: endDateObj.toISOString().split('T')[0],
                days: daysNum
            }
        });

    } catch (error) {
        console.error('Error fetching trends:', error);

        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: 'Invalid input',
                details: error.errors
            });
        }

        return res.status(500).json({ error: 'Failed to fetch trends' });
    }
}
