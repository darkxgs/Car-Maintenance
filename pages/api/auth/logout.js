export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Clear authentication cookies
        res.setHeader('Set-Cookie', [
            'refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
            'accessToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
        ]);

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
