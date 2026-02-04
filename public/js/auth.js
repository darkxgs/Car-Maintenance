// ===== Authentication Manager =====

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.SESSION_KEY = 'car_maintenance_session';
    }

    async login(username, password) {
        const user = await db.getOneByIndex('users', 'username', username);

        if (!user) throw new Error('اسم المستخدم غير موجود');
        if (user.password !== password) throw new Error('كلمة المرور غير صحيحة');

        const branch = await db.get('branches', user.branch_id);

        const session = {
            userId: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            branchId: user.branch_id,
            branchName: branch ? branch.name : 'غير محدد',
            loginTime: new Date().toISOString()
        };

        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        this.currentUser = session;
        return session;
    }

    logout() {
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
}

const auth = new AuthManager();

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => auth.logout());

    if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
        auth.updateUserUI();
    }
});
