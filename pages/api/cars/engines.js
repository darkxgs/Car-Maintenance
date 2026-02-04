import sql from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const { brand, model } = req.query;

    if (!brand || !model) {
      return res.status(400).json({ error: 'Brand and model parameters required' });
    }

    const engines = await sql`
      SELECT DISTINCT engine_size FROM cars 
      WHERE LOWER(brand) = LOWER(${brand})
        AND LOWER(model) = LOWER(${model})
      ORDER BY engine_size
    `;
    
    return res.status(200).json(engines.map(e => e.engine_size));
  } catch (error) {
    console.error('Engines API error:', error);
    res.status(500).json({ error: error.message });
  }
}
