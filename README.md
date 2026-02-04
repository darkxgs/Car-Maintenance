# Car Maintenance System - Next.js Version

This is a Next.js wrapper for the existing car maintenance system. All original JavaScript logic remains unchanged and is served from the `/public` directory.

## What Changed

- HTML files converted to Next.js pages (`.js` files in `/pages`)
- All JavaScript files remain **identical** in `/public/js`
- All CSS files remain **identical** in `/public/css`
- Navigation URLs updated from `.html` to Next.js routes (e.g., `dashboard.html` → `/dashboard`)
- IndexedDB logic completely unchanged

## Project Structure

```
car-maintenance-nextjs/
├── pages/
│   ├── _app.js              # Global app wrapper
│   ├── _document.js         # HTML document structure
│   ├── index.js             # Login page (/)
│   ├── dashboard.js         # Dashboard (/dashboard)
│   ├── operation.js         # Operations (/operation)
│   ├── reports.js           # Reports (/reports)
│   └── admin/
│       ├── users.js         # Users management
│       ├── branches.js      # Branches management
│       └── cars-database.js # Cars database
├── public/
│   ├── js/                  # Original JS files (unchanged)
│   │   ├── auth.js
│   │   ├── database.js
│   │   ├── utils.js
│   │   ├── ai-supervisor.js
│   │   └── pdf-export.js
│   └── css/
│       └── style.css        # Original CSS (unchanged)
└── next.config.mjs
```

## Installation & Running

1. Navigate to the project directory:
```bash
cd car-maintenance-nextjs
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
npm run build
npm start
```

## Login Credentials

- **Admin**: username: `admin`, password: `admin123`
- **Employee**: username: `employee1`, password: `123456`

## Key Features Preserved

✅ IndexedDB local storage (client-side only)
✅ All JavaScript classes and logic unchanged
✅ Arabic RTL interface
✅ PDF export functionality
✅ AI supervisor validation
✅ Authentication system
✅ All CRUD operations

## Technical Notes

- JavaScript files are loaded via `next/script` with `strategy="beforeInteractive"` or `strategy="lazyOnload"`
- No React hooks or state management used
- All DOM manipulation remains vanilla JavaScript
- CSS loaded globally via `_app.js`
- RTL support configured in `next.config.mjs`

## Differences from Original

The only changes are:
1. File extensions: `.html` → `.js` (JSX pages)
2. Navigation: `href="dashboard.html"` → `href="/dashboard"`
3. HTML attributes: `class` → `className`, `for` → `htmlFor`
4. Inline styles: `style="..."` → `style={{...}}`

Everything else is **identical** to the original static version.
