import sql from '../../../lib/db';
import { validateAndSanitize, reportQuerySchema } from '../../../lib/validation';

export default async function handler(req, res) {
  try {
    // Validate query parameters
    const validatedQuery = validateAndSanitize(req.query, reportQuerySchema);
    const { branchId, startDate, endDate } = validatedQuery;

    // Build WHERE clause safely with parameterized queries
    let operations;

    if (branchId && startDate && endDate) {
      operations = await sql`
        SELECT * FROM operations 
        WHERE branch_id = ${branchId}
          AND created_at >= ${startDate}
          AND created_at <= ${endDate}
        ORDER BY created_at DESC
      `;
    } else if (branchId) {
      operations = await sql`
        SELECT * FROM operations 
        WHERE branch_id = ${branchId}
        ORDER BY created_at DESC
      `;
    } else if (startDate && endDate) {
      operations = await sql`
        SELECT * FROM operations 
        WHERE created_at >= ${startDate}
          AND created_at <= ${endDate}
        ORDER BY created_at DESC
      `;
    } else {
      operations = await sql`
        SELECT * FROM operations 
        ORDER BY created_at DESC
      `;
    }

    // Calculate stats
    const totalOperations = operations.length;
    const matchingOperations = operations.filter(op => op.is_matching === 1).length;
    const mismatchedOperations = totalOperations - matchingOperations;

    // Oil types and viscosities
    const oilTypes = {};
    const viscosities = {};
    let totalOilUsed = 0;
    let oilFilterCount = 0;
    let airFilterCount = 0;
    let coolingFilterCount = 0;

    operations.forEach(op => {
      if (op.oil_used) {
        oilTypes[op.oil_used] = (oilTypes[op.oil_used] || 0) + 1;
      }

      if (op.oil_viscosity) {
        viscosities[op.oil_viscosity] = (viscosities[op.oil_viscosity] || 0) + 1;
      }

      totalOilUsed += parseFloat(op.oil_quantity) || 0;

      if (op.oil_filter === 1) oilFilterCount++;
      if (op.air_filter === 1) airFilterCount++;
      if (op.cooling_filter === 1) coolingFilterCount++;
    });

    // Get operations by branch
    const branches = await sql`SELECT * FROM branches`;
    const branchCounts = {};

    for (const branch of branches) {
      const count = operations.filter(op => op.branch_id === branch.id).length;
      branchCounts[branch.name] = count;
    }

    // Get mismatched operations
    const mismatched = operations.filter(op => op.is_matching === 0);

    return res.status(200).json({
      totalOperations,
      matchingOperations,
      mismatchedOperations,
      oilTypes,
      viscosities,
      totalOilUsed: totalOilUsed.toFixed(1),
      filters: {
        oil: oilFilterCount,
        air: airFilterCount,
        cooling: coolingFilterCount
      },
      branchCounts,
      mismatched
    });
  } catch (error) {
    console.error('Reports API error:', error);
    res.status(500).json({ error: error.message });
  }
}
