import sql from '../../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Get user
    const users = await sql`
      SELECT * FROM users WHERE username = ${username}
    `;

    if (users.length === 0) {
      return res.status(401).json({ error: 'اسم المستخدم غير موجود' });
    }

    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
    }

    // Get branch info
    const branches = await sql`
      SELECT * FROM branches WHERE id = ${user.branch_id}
    `;

    const branch = branches[0];

    // Return session data
    const session = {
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      branchId: user.branch_id,
      branchName: branch ? branch.name : 'غير محدد',
      loginTime: new Date().toISOString()
    };

    res.status(200).json(session);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
