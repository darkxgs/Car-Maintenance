# Project Context: Car Maintenance System

## Overview
This is a web-based Car Maintenance Management System designed to handle vehicle service records, manage car data, branches, and users. The application incorporates an "AI Supervisor" using OpenRouter to recommend appropriate oil types, viscosities, and quantities based on the vehicle's specifications, comparing entered data with manufacturer recommendations.

## Technology Stack
- **Framework:** Next.js (Pages Router)
- **Frontend:** React, HTML, Vanilla CSS (in `public/css/style.css`), FontAwesome for icons, Google Fonts (Cairo).
- **Backend:** Next.js API Routes (`pages/api/*`)
- **Database:** PostgreSQL hosted on Neon (`@neondatabase/serverless`)
- **AI Integration:** OpenRouter API (`arcee-ai/trinity-large-preview:free` model)
- **Deployment/Environment:** Node.js environment

## Project Structure
- `pages/`: Contains Next.js React pages (e.g., `dashboard.js`, `reports.js`, `operation.js`).
- `pages/api/`: Backend API endpoints handling database operations, AI requests, auth, etc.
- `public/js/`: Contains client-side vanilla JavaScript abstractions supporting the application (e.g., `ai-supervisor.js`, `database-api.js`, `auth.js`).
- `lib/`: Contains server-side utility files like database connection (`db.js`) and AI service (`openrouter-service.js`).
- `middleware.js`: Next.js edge middleware handling JWT authentication and route protection.

## Key Features & Workflows
1. **Authentication & Authorization**: JWT-based auth protecting API routes and pages. Includes role-based access control (Admin vs. User).
2. **Operations Management**: Users can log maintenance inquiries and actual service operations.
3. **AI Supervisor (Hybrid Approach)**: 
   - Uses OpenRouter AI for intelligent oil and service recommendations.
   - Fallback to exact-match database lookups if the AI fails or times out.
   - Evaluates "mismatches" between what the AI/DB recommends and what the user actually entered.
4. **Data Management**: Admin interfaces for managing users, branches, and the master database of cars/oil types.
5. **Reports**: Paginated reports with filtering, and the ability to export to Excel/CSV.

## Database Schema (Key Entities)
- `operations`: Logs of maintenance inquiries and services (car details, oil used, filters changed, match status, etc.)
- `cars`: Master catalog of cars, supported years, and recommended oil specifications.
- `users`: System users with hashed passwords and roles.
- `branches`: Shop branch locations.
