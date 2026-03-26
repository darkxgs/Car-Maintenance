import sql from '../../../lib/db';
import { verifyAccessToken, extractTokenFromHeader } from '../../../lib/auth';

export default async function handler(req, res) {
  // Verify authentication
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    verifyAccessToken(token);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      const cars = await sql`SELECT * FROM cars ORDER BY brand, model`;
      return res.status(200).json(cars);
    }

    if (req.method === 'POST') {
      // Support both bulk (array) and single insert
      const body = req.body;

      if (Array.isArray(body)) {
        // Bulk insert - iterate and insert each car
        if (body.length === 0) {
          return res.status(400).json({ error: 'No cars to insert' });
        }

        try {
          const promises = body.map(car => sql`
            INSERT INTO cars (brand, model, year_from, year_to, engine_size, oil_type, oil_viscosity, oil_quantity)
            VALUES (${car.brand}, ${car.model}, ${car.year_from}, ${car.year_to}, ${car.engine_size}, ${car.oil_type}, ${car.oil_viscosity}, ${car.oil_quantity})
            RETURNING *
          `);

          const results = await Promise.all(promises);
          return res.status(201).json(results.map(r => r[0]));
        } catch (err) {
          console.error('Bulk insert error:', err);
          throw new Error('Bulk insert failed: ' + err.message);
        }
      } else {
        // Single insert
        const { brand, model, year_from, year_to, engine_size, oil_type, oil_viscosity, oil_quantity } = body;

        if (!brand || !model || !year_from || !year_to || !engine_size || !oil_type || !oil_viscosity || !oil_quantity) {
          return res.status(400).json({ error: 'All fields are required' });
        }

        const result = await sql`
          INSERT INTO cars (brand, model, year_from, year_to, engine_size, oil_type, oil_viscosity, oil_quantity)
          VALUES (${brand}, ${model}, ${year_from}, ${year_to}, ${engine_size}, ${oil_type}, ${oil_viscosity}, ${oil_quantity})
          RETURNING *
        `;
        return res.status(201).json(result[0]);
      }
    }

    if (req.method === 'DELETE') {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'IDs array is required' });
      }

      await sql`DELETE FROM cars WHERE id = ANY(${ids})`;
      return res.status(200).json({ success: true, count: ids.length });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Cars API error:', error);
    res.status(500).json({ error: error.message });
  }
}

