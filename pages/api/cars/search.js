import sql from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const { brand, model, year, engineSize } = req.query;

    if (!brand || !model || !year || !engineSize) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const cars = await sql`
      SELECT * FROM cars
      WHERE LOWER(brand) = LOWER(${brand})
        AND LOWER(model) = LOWER(${model})
        AND ${parseInt(year)} >= year_from
        AND ${parseInt(year)} <= year_to
        AND LOWER(engine_size) = LOWER(${engineSize})
      LIMIT 1
    `;

    if (cars.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }

    return res.status(200).json(cars[0]);
  } catch (error) {
    console.error('Car search error:', error);
    res.status(500).json({ error: error.message });
  }
}
