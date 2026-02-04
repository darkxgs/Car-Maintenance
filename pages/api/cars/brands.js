import sql from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const brands = await sql`
      SELECT DISTINCT brand FROM cars ORDER BY brand
    `;
    
    return res.status(200).json(brands.map(b => b.brand));
  } catch (error) {
    console.error('Brands API error:', error);
    res.status(500).json({ error: error.message });
  }
}
