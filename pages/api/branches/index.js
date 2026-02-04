import sql from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const branches = await sql`SELECT * FROM branches ORDER BY id`;
      return res.status(200).json(branches);
    }

    if (req.method === 'POST') {
      const { name, location } = req.body;
      
      const result = await sql`
        INSERT INTO branches (name, location)
        VALUES (${name}, ${location})
        RETURNING *
      `;
      
      return res.status(201).json(result[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Branches API error:', error);
    res.status(500).json({ error: error.message });
  }
}
