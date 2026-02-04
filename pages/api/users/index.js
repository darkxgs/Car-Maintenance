import sql from '../../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const users = await sql`
        SELECT id, username, name, branch_id, role, created_at 
        FROM users 
        ORDER BY id
      `;
      return res.status(200).json(users);
    }

    if (req.method === 'POST') {
      const { username, password, name, branch_id, role } = req.body;
      
      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const result = await sql`
        INSERT INTO users (username, password, name, branch_id, role)
        VALUES (${username}, ${hashedPassword}, ${name}, ${branch_id}, ${role})
        RETURNING id, username, name, branch_id, role, created_at
      `;
      
      return res.status(201).json(result[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Users API error:', error);
    res.status(500).json({ error: error.message });
  }
}
