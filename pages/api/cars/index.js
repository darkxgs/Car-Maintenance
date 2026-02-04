import sql from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const cars = await sql`SELECT * FROM cars ORDER BY brand, model`;
      return res.status(200).json(cars);
    }

    if (req.method === 'POST') {
      const { brand, model, year_from, year_to, engine_size, oil_type, oil_viscosity, oil_quantity } = req.body;
      
      const result = await sql`
        INSERT INTO cars (brand, model, year_from, year_to, engine_size, oil_type, oil_viscosity, oil_quantity)
        VALUES (${brand}, ${model}, ${year_from}, ${year_to}, ${engine_size}, ${oil_type}, ${oil_viscosity}, ${oil_quantity})
        RETURNING *
      `;
      
      return res.status(201).json(result[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Cars API error:', error);
    res.status(500).json({ error: error.message });
  }
}
