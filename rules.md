# AI Coding Rules

When assisting with this codebase, the AI must strictly adhere to the following rules:

## Database Interactions (Neon DB)
1. **No `sql.unsafe()`**: The project uses the `@neondatabase/serverless` driver with tagged template literals (e.g., `` sql`SELECT * FROM users` ``). Never use `sql.unsafe()` as it is incompatible with the serverless driver and causes 500 Internal Server Errors.
2. **Dynamic Queries**: Build dynamic queries safely by pushing tagged template literals into an array of conditions and using `reduce` to combine them with `AND` / `OR`, or similar safe fragment strategies. Do not arbitrarily interpolate strings into SQL.
3. **Verify Columns**: Always verify that the columns you are querying or inserting exist in the database schema. (e.g., Do not insert columns like `mileage` or `notes` into the `operations` table unless explicitly added).

## AI Supervisor Integration
1. **OpenRouter Only**: The project exclusively uses OpenRouter for its AI capabilities (`lib/openrouter-service.js`). Do not attempt to integrate or fallback to Gemini directly unless explicitly requested.
2. **Timeout Handling**: The AI service calls have a built-in 30-second abort controller timeout in frontend scripts like `public/js/ai-supervisor.js`. Respect this architecture to prevent hanging requests.
3. **Response Structure**: Ensure API endpoint responses perfectly match what the client-side JavaScript expects (`success`, `data`, `source`, `message`, etc.). Common bugs arise from structural mismatches between the frontend and backend.

## Frontend & Styling
1. **Vanilla CSS**: The project uses standard CSS (found in `public/css/style.css` and page components) rather than Tailwind or another CSS framework. Maintain this aesthetic unless a migration is requested.
2. **Arabic UI**: The user interface is primarily in Arabic. All newly added user-facing text, alerts, toasts, and labels should be in Arabic. Error logs, variable names, and code comments should remain in English.
3. **Client-Side Scripts**: The application leans heavily on vanilla JS files in `public/js/` for specific client-side abstractions (like `database-api.js` and `ai-supervisor.js`). Ensure you utilize these existing abstractions rather than duplicating logic inside the React components.

## Next.js Conventions
1. **Pages Router**: This app uses the Next.js Pages router (`pages/` directory), *not* the App router (`app/`). Do not create `page.js` or `route.js` files. Stick to the `pages/*.js` and `pages/api/*.js` conventions.
2. **Middleware**: Authentication is handled at the edge in `middleware.js`. Ensure newly created protected routes correctly hook into the existing `/api/*` protection or are added to the public paths if public access is intended.
