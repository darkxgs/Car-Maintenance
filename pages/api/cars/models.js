import sql from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const { brand } = req.query;

    if (!brand) {
      return res.status(400).json({ error: 'Brand parameter required' });
    }

    const models = await sql`
      SELECT DISTINCT model FROM cars 
      WHERE LOWER(brand) = LOWER(${brand})
      ORDER BY model
    `;
    
    return res.status(200).json(models.map(m => m.model));
  } catch (error) {
    console.error('Models API error:', error);
    res.status(500).json({ error: error.message });
  }
}
