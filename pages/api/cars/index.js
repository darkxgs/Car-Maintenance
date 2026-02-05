import sql from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const cars = await sql`SELECT * FROM cars ORDER BY brand, model`;
      return res.status(200).json(cars);
    }

    if (req.method === 'POST') {
      if (Array.isArray(req.body)) {



        // Neon driver doesn't support the sql(values) helper in the same way.
        // We'll use Promise.all for parallel insertion which is fast enough for this scale.
        try {
          const promises = values.map(car => sql`
                INSERT INTO cars (brand, model, year_from, year_to, engine_size, oil_type, oil_viscosity, oil_quantity)
                VALUES (${car.brand}, ${car.model}, ${car.year_from}, ${car.year_to}, ${car.engine_size}, ${car.oil_type}, ${car.oil_viscosity}, ${car.oil_quantity})
                RETURNING *
            `);

          const results = await Promise.all(promises);
          // Return array of results
          return res.status(201).json(results.map(r => r[0]));
        } catch (err) {
          console.error('Bulk insert error:', err);
          throw new Error('Bulk insert failed: ' + err.message);
        }
      } else {
        // Single insert
        const { brand, model, year_from, year_to, engine_size, oil_type, oil_viscosity, oil_quantity } = req.body;

        const result = await sql`
            INSERT INTO cars (brand, model, year_from, year_to, engine_size, oil_type, oil_viscosity, oil_quantity)
            VALUES (${brand}, ${model}, ${year_from}, ${year_to}, ${engine_size}, ${oil_type}, ${oil_viscosity}, ${oil_quantity})
            RETURNING *
        `;
        return res.status(201).json(result[0]);
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Cars API error:', error);
    res.status(500).json({ error: error.message });
  }
}
