import { verifyRefreshToken, generateAccessToken } from '../../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get refresh token from cookie
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token not found' });
        }

        // Verify refresh token
        const payload = verifyRefreshToken(refreshToken);

        // Generate new access token
        const newAccessToken = generateAccessToken({
            userId: payload.userId,
            username: payload.username,
            role: payload.role,
            branchId: payload.branchId
        });

        // Update access token cookie
        res.setHeader('Set-Cookie',
            `accessToken=${newAccessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${15 * 60}`
        );

        res.status(200).json({
            accessToken: newAccessToken,
            expiresIn: 900 // 15 minutes in seconds
        });
    } catch (error) {
        console.error('Token refresh error:', error);

        // Clear cookies on error
        res.setHeader('Set-Cookie', [
            'refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
            'accessToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
        ]);

        res.status(401).json({ error: error.message || 'Invalid refresh token' });
    }
}
