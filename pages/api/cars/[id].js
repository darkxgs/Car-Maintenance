import sql from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const cars = await sql`SELECT * FROM cars WHERE id = ${id}`;
      if (cars.length === 0) {
        return res.status(404).json({ error: 'Car not found' });
      }
      return res.status(200).json(cars[0]);
    }

    if (req.method === 'PUT') {
      const { brand, model, year_from, year_to, engine_size, oil_type, oil_viscosity, oil_quantity } = req.body;
      
      const result = await sql`
        UPDATE cars
        SET brand = ${brand}, model = ${model}, year_from = ${year_from}, 
            year_to = ${year_to}, engine_size = ${engine_size}, oil_type = ${oil_type},
            oil_viscosity = ${oil_viscosity}, oil_quantity = ${oil_quantity}
        WHERE id = ${id}
        RETURNING *
      `;
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Car not found' });
      }
      
      return res.status(200).json(result[0]);
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM cars WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Car API error:', error);
    res.status(500).json({ error: error.message });
  }
}
