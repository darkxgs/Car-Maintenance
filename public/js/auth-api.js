// ===== Authentication Manager (JWT-based) =====

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.SESSION_KEY = 'car_maintenance_session';
        this.refreshTimer = null;
    }

    async login(username, password) {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const session = await response.json();
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        this.currentUser = session;

        // Schedule token refresh before expiry (refresh 1 minute before expiry)
        this.scheduleTokenRefresh((session.expiresIn - 60) * 1000);

        return session;
    }

    scheduleTokenRefresh(delayMs) {
        // Clear existing timer
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }

        // Schedule refresh
        this.refreshTimer = setTimeout(async () => {
            try {
                await this.refreshToken();
            } catch (error) {
                console.error('Token refresh failed:', error);
                this.logout();
            }
        }, delayMs);
    }

    async refreshToken() {
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Token refresh failed');
        }

        const data = await response.json();

        // Update access token in session
        const session = this.getSession();
        if (session) {
            session.accessToken = data.accessToken;
            session.expiresIn = data.expiresIn;
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            this.currentUser = session;
        }

        // Schedule next refresh
        this.scheduleTokenRefresh((data.expiresIn - 60) * 1000);
    }

    async logout() {
        // Clear refresh timer
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }

        // Call logout endpoint to clear cookies
        try {
            await fetch('/api/auth/logout', {
                method: 'POST'
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        localStorage.removeItem(this.SESSION_KEY);
        this.currentUser = null;
        window.location.href = '/';
    }

    isLoggedIn() {
        return this.getSession() !== null;
    }

    getSession() {
        const sessionData = localStorage.getItem(this.SESSION_KEY);
        if (sessionData) {
            this.currentUser = JSON.parse(sessionData);
            return this.currentUser;
        }
        return null;
    }

    getAccessToken() {
        const session = this.getSession();
        return session ? session.accessToken : null;
    }

    isAdmin() {
        const session = this.getSession();
        return session && session.role === 'admin';
    }

    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '/';
            return false;
        }
        return true;
    }

    requireAdmin() {
        if (!this.requireAuth()) return false;
        if (!this.isAdmin()) {
            window.location.href = '/dashboard';
            return false;
        }
        return true;
    }

    updateUserUI() {
        const session = this.getSession();
        if (!session) return;

        const userNameEl = document.querySelector('.sidebar-user .user-info h4');
        const userBranchEl = document.querySelector('.sidebar-user .user-info span');
        const avatarEl = document.querySelector('.sidebar-user .avatar');

        if (userNameEl) userNameEl.textContent = session.name;
        if (userBranchEl) userBranchEl.textContent = session.branchName;
        if (avatarEl) avatarEl.textContent = session.name.charAt(0);

        if (!this.isAdmin()) {
            document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
        }
    }

    // Initialize token refresh on page load
    initializeTokenRefresh() {
        const session = this.getSession();
        if (session && session.expiresIn) {
            // Calculate remaining time
            const loginTime = new Date(session.loginTime).getTime();
            const now = Date.now();
            const elapsed = now - loginTime;
            const remaining = (session.expiresIn * 1000) - elapsed;

            if (remaining > 60000) { // If more than 1 minute remaining
                this.scheduleTokenRefresh(remaining - 60000);
            } else {
                // Token expired or about to expire, refresh immediately
                this.refreshToken().catch(() => this.logout());
            }
        }
    }
}

const auth = new AuthManager();

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => auth.logout());

    if (!window.location.pathname.endsWith('/') && window.location.pathname !== '/') {
        auth.updateUserUI();
        auth.initializeTokenRefresh();
    }
});
