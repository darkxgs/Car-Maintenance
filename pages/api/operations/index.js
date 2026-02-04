import sql from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const operations = await sql`
        SELECT * FROM operations 
        ORDER BY created_at DESC
      `;
      return res.status(200).json(operations);
    }

    if (req.method === 'POST') {
      const {
        car_brand, car_model, car_year, engine_size,
        oil_used, oil_viscosity, oil_quantity,
        oil_filter, air_filter, cooling_filter,
        is_matching, mismatch_reason, operation_type,
        user_id, branch_id
      } = req.body;
      
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
          ${is_matching}, ${mismatch_reason}, ${operation_type},
          ${user_id}, ${branch_id}, NOW()
        )
        RETURNING *
      `;
      
      return res.status(201).json(result[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Operations API error:', error);
    res.status(500).json({ error: error.message });
  }
}
