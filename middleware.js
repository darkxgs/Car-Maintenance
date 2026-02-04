import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

// List of paths that don't require authentication
const PUBLIC_PATHS = ['/', '/api/auth/login'];

// Paths that require admin role
const ADMIN_ONLY_PATHS = [
    '/admin',
    '/api/users',
    '/api/branches',
    '/api/cars'
];

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Allow public paths without authentication
    if (PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.next();
    }

    // Check for JWT token in Authorization header
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('refreshToken')?.value;

    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }

    // If no token in header and this is a page request (not API), allow through
    // Client-side will handle redirect to login
    if (!token && !pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // For API routes, token is required (except public paths)
    if (pathname.startsWith('/api/') && !token) {
        return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
        );
    }

    // Verify token
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);

        // Check admin-only paths
        if (ADMIN_ONLY_PATHS.some(path => pathname.startsWith(path))) {
            if (payload.role !== 'admin') {
                return NextResponse.json(
                    { error: 'Admin access required' },
                    { status: 403 }
                );
            }
        }

        // Add user info to request headers for API routes to use
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', payload.userId.toString());
        requestHeaders.set('x-user-role', payload.role);
        requestHeaders.set('x-branch-id', payload.branchId.toString());

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

    } catch (error) {
        // Token is invalid or expired
        if (pathname.startsWith('/api/')) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        // For page requests, allow through and let client handle redirect
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files (images, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)',
    ],
};
