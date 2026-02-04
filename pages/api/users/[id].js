import sql from '../../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const users = await sql`
        SELECT id, username, name, branch_id, role, created_at 
        FROM users 
        WHERE id = ${id}
      `;
      if (users.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(users[0]);
    }

    if (req.method === 'PUT') {
      const { username, password, name, branch_id, role } = req.body;
      
      let updateQuery;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateQuery = sql`
          UPDATE users
          SET username = ${username}, password = ${hashedPassword}, 
              name = ${name}, branch_id = ${branch_id}, role = ${role}
          WHERE id = ${id}
          RETURNING id, username, name, branch_id, role, created_at
        `;
      } else {
        updateQuery = sql`
          UPDATE users
          SET username = ${username}, name = ${name}, 
              branch_id = ${branch_id}, role = ${role}
          WHERE id = ${id}
          RETURNING id, username, name, branch_id, role, created_at
        `;
      }
      
      const result = await updateQuery;
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.status(200).json(result[0]);
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM users WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('User API error:', error);
    res.status(500).json({ error: error.message });
  }
}
