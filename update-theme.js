const fs = require('fs');
let css = fs.readFileSync('public/css/style.css', 'utf8');

// Sidebar menu links
css = css.replace(new RegExp('\\\\.sidebar-menu a \\\\{[\\\\s\\\\S]*?width: 24px;\\\\r?\\\\n\\\\}'), `.sidebar-menu a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    color: var(--gray);
    transition: var(--transition);
    border-radius: var(--radius);
    margin-bottom: 0.25rem;
    font-weight: 600;
}

.sidebar-menu a:hover {
    background: rgba(99, 102, 241, 0.05);
    color: var(--primary);
    transform: translateX(-4px);
}

.sidebar-menu a.active {
    background: var(--white);
    color: var(--primary);
    box-shadow: var(--shadow-sm);
    border: 1px solid rgba(0,0,0,0.02);
}

.sidebar-menu a i {
    font-size: 1.2rem;
    width: 24px;
    transition: var(--transition);
}

.sidebar-menu a.active i {
    transform: scale(1.1);
}`);

// Sidebar user block
css = css.replace(new RegExp('\\\\.sidebar-user \\\\{[\\\\s\\\\S]*?color: var\\\\(--danger\\\\);\\\\r?\\\\n\\\\}'), `.sidebar-user {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1.25rem 1.5rem;
    background: rgba(255, 255, 255, 0.5);
    border-top: 1px solid rgba(0,0,0,0.03);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.sidebar-user .avatar {
    width: 42px;
    height: 42px;
    background: var(--gradient-primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: var(--white);
    box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
}

.sidebar-user .user-info {
    flex: 1;
}

.sidebar-user .user-info h4 {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--dark);
}

.sidebar-user .user-info span {
    font-size: 0.8rem;
    color: var(--gray);
}

.sidebar-user .logout-btn {
    background: var(--white);
    border: 1px solid rgba(0,0,0,0.05);
    color: var(--gray);
    cursor: pointer;
    padding: 0.6rem;
    border-radius: 50%;
    transition: var(--transition);
    box-shadow: var(--shadow-sm);
}

.sidebar-user .logout-btn:hover {
    background: var(--danger-light);
    color: var(--white);
    border-color: transparent;
    transform: rotate(10deg);
}`);

// Cards
css = css.replace(new RegExp('\\\\/\\\\* ===== Cards ===== \\\\*\\\\/[\\\\s\\\\S]*?padding: 1\\\\.5rem;\\\\r?\\\\n\\\\}'), `/* ===== Cards & Panels ===== */
.card, .glass-panel {
    background: var(--glass-bg);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow);
    border: 1px solid var(--glass-border);
    overflow: hidden;
    transition: var(--transition);
    position: relative;
}

.card::after, .glass-panel::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-inner);
    pointer-events: none;
}

.card:hover, .glass-panel:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}

.card-header {
    padding: 1.5rem 1.75rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.03);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.4);
}

.card-header h3 {
    font-size: 1.15rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 700;
    color: var(--dark);
}

.card-header h3 i {
    color: var(--primary);
    background: var(--light);
    padding: 0.5rem;
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-sm);
}

.card-body {
    padding: 1.75rem;
}

/* Overriding any old border tops explicitly */
.glass-panel[style*="border-top"], .card[style*="border-top"] {
    border-top: 1px solid var(--glass-border) !important;
}`);

// Stat cards
css = css.replace(new RegExp('\\\\/\\\\* ===== Stats Cards ===== \\\\*\\\\/[\\\\s\\\\S]*?margin-top: 0\\\\.25rem;\\\\r?\\\\n\\\\}'), `/* ===== Stats Cards ===== */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.75rem;
    margin-bottom: 2.5rem;
}

.stat-card {
    background: var(--glass-bg);
    backdrop-filter: blur(24px);
    border-radius: var(--radius-xl);
    padding: 1.75rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    box-shadow: var(--shadow);
    border: 1px solid var(--glass-border);
    transition: var(--transition);
    position: relative;
    overflow: hidden;
}

.stat-card::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: var(--shadow-inner);
    pointer-events: none;
}

.stat-card::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
    opacity: 0.5;
    pointer-events: none;
}

.stat-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
    background: var(--glass-bg-hover);
}

.stat-card .icon {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    position: relative;
    z-index: 1;
}

.stat-card .icon.blue {
    background: rgba(67, 56, 202, 0.1);
    color: var(--primary);
}

.stat-card .icon.green {
    background: rgba(5, 150, 105, 0.1);
    color: var(--success);
}

.stat-card .icon.orange {
    background: rgba(217, 119, 6, 0.1);
    color: var(--warning);
}

.stat-card .icon.purple {
    background: rgba(147, 51, 234, 0.1);
    color: #9333ea;
}

.stat-card .info {
    position: relative;
    z-index: 1;
}

.stat-card .info h4 {
    font-size: 2rem;
    font-weight: 800;
    color: var(--dark);
    line-height: 1.1;
    letter-spacing: -0.5px;
}

.stat-card .info p {
    color: var(--gray);
    font-size: 0.95rem;
    font-weight: 500;
    margin-top: 0.35rem;
}`);

fs.writeFileSync('public/css/style.css', css);
console.log('Update complete.');
