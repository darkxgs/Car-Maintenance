import sql from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../../../lib/auth';
import { validateAndSanitize, loginSchema } from '../../../lib/validation';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate input
    const { username, password } = validateAndSanitize(req.body, loginSchema);

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

    // Create token payload
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      branchId: user.branch_id
    };

    // Generate tokens
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Set refresh token in HTTP-only cookie
    res.setHeader('Set-Cookie', [
      `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`, // 7 days
      `accessToken=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${15 * 60}` // 15 minutes
    ]);

    // Return session data and access token
    const session = {
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      branchId: user.branch_id,
      branchName: branch ? branch.name : 'غير محدد',
      loginTime: new Date().toISOString(),
      accessToken, // Client will use this for API calls
      expiresIn: 900 // 15 minutes in seconds
    };

    res.status(200).json(session);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
