import sql from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const branches = await sql`SELECT * FROM branches WHERE id = ${id}`;
      if (branches.length === 0) {
        return res.status(404).json({ error: 'Branch not found' });
      }
      return res.status(200).json(branches[0]);
    }

    if (req.method === 'PUT') {
      const { name, location } = req.body;
      
      const result = await sql`
        UPDATE branches
        SET name = ${name}, location = ${location}
        WHERE id = ${id}
        RETURNING *
      `;
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Branch not found' });
      }
      
      return res.status(200).json(result[0]);
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM branches WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Branch API error:', error);
    res.status(500).json({ error: error.message });
  }
}
