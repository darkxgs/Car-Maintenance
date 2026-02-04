# Neon PostgreSQL Integration - Setup Guide

## ✅ What's Been Added

### Backend Infrastructure
- **Neon PostgreSQL Database** - Cloud-hosted PostgreSQL
- **Next.js API Routes** - RESTful API endpoints
- **Password Hashing** - bcryptjs for secure authentication
- **Database Schema** - PostgreSQL tables matching original structure

### API Endpoints Created

**Authentication:**
- `POST /api/auth/login` - User login

**Branches:**
- `GET /api/branches` - List all branches
- `POST /api/branches` - Create branch
- `GET /api/branches/[id]` - Get single branch
- `PUT /api/branches/[id]` - Update branch
- `DELETE /api/branches/[id]` - Delete branch

**Users:**
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get single user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

**Cars:**
- `GET /api/cars` - List all cars
- `POST /api/cars` - Create car
- `GET /api/cars/[id]` - Get single car
- `PUT /api/cars/[id]` - Update car
- `DELETE /api/cars/[id]` - Delete car
- `GET /api/cars/search` - Search for specific car
- `GET /api/cars/brands` - Get all brands
- `GET /api/cars/models?brand=X` - Get models by brand
- `GET /api/cars/engines?brand=X&model=Y` - Get engine sizes

**Operations:**
- `GET /api/operations` - List all operations
- `POST /api/operations` - Create operation

**Reports:**
- `GET /api/reports/stats` - Get statistics with filters

## 🚀 Setup Instructions

### Step 1: Database Setup

Run the database setup script to create tables and seed initial data:

```bash
npm run setup-db
```

This will:
- ✅ Create all PostgreSQL tables
- ✅ Add indexes for performance
- ✅ Seed initial data (branches, users, cars)
- ✅ Hash passwords securely

### Step 2: Start the Application

```bash
npm run dev
```

### Step 3: Login

Open http://localhost:3000 and login with:
- **Admin:** `admin` / `admin123`
- **Employee:** `employee1` / `123456`

## 🔄 Migration from IndexedDB

### What Changed:

**Before (IndexedDB):**
- Data stored locally in browser
- Each user has their own data
- No sync between devices

**After (Neon PostgreSQL):**
- Data stored in cloud database
- All users share the same data
- Real-time sync across devices
- Data persists forever

### Code Changes:

**Frontend:**
- `database.js` → `database-api.js` (API calls instead of IndexedDB)
- `auth.js` → `auth-api.js` (API-based authentication)
- All existing page scripts work unchanged!

**Backend:**
- Added `/pages/api/*` - API route handlers
- Added `/lib/db.js` - Neon connection
- Added `/lib/setup-db.js` - Database initialization

## 📊 Database Schema

### Tables:

**branches**
- id (SERIAL PRIMARY KEY)
- name (VARCHAR UNIQUE)
- location (VARCHAR)
- created_at (TIMESTAMP)

**users**
- id (SERIAL PRIMARY KEY)
- username (VARCHAR UNIQUE)
- password (VARCHAR - hashed)
- name (VARCHAR)
- branch_id (INTEGER FK)
- role (VARCHAR)
- created_at (TIMESTAMP)

**cars**
- id (SERIAL PRIMARY KEY)
- brand, model, year_from, year_to
- engine_size, oil_type, oil_viscosity, oil_quantity
- created_at (TIMESTAMP)

**operations**
- id (SERIAL PRIMARY KEY)
- car_brand, car_model, car_year, engine_size
- oil_used, oil_viscosity, oil_quantity
- oil_filter, air_filter, cooling_filter
- is_matching, mismatch_reason, operation_type
- user_id (FK), branch_id (FK)
- created_at (TIMESTAMP)

## 🔒 Security Features

- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ SQL injection protection (parameterized queries)
- ✅ HTTPS connection to Neon (SSL required)
- ✅ Session management via localStorage
- ✅ Role-based access control (admin/employee)

## 🎯 Benefits

### Multi-User Access
- All employees see the same data
- Changes sync instantly
- No data duplication

### Data Persistence
- Survives browser cache clears
- Automatic backups by Neon
- Never lose data

### Scalability
- Handle thousands of operations
- Fast queries with indexes
- Cloud-based infrastructure

### Advanced Features
- Complex reports and analytics
- Date range filtering
- Branch-based filtering
- Real-time statistics

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check your .env.local file
DATABASE_URL=postgresql://...
```

### Tables Not Created
```bash
# Re-run setup
npm run setup-db
```

### Login Not Working
- Check that setup-db ran successfully
- Verify users table has data
- Check browser console for errors

## 📝 Environment Variables

Required in `.env.local`:
```
DATABASE_URL=postgresql://neondb_owner:npg_8dWuTotCKpq7@ep-royal-queen-aha4sx2a-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## 🚀 Deployment

For production deployment:

1. **Vercel** (Recommended):
   ```bash
   vercel deploy
   ```
   - Add DATABASE_URL to environment variables in Vercel dashboard

2. **Other Platforms**:
   - Ensure DATABASE_URL is set in environment
   - Run `npm run build` then `npm start`

## ✨ Next Steps

Your application is now fully integrated with Neon PostgreSQL! All data is stored in the cloud and accessible by all users.

Try:
1. Login from different browsers - see the same data
2. Add operations - they appear for all users
3. Generate reports - data persists across sessions
4. Clear browser cache - data still there!
