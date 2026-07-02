# Recipe Manager - Full Stack Take-Home Exercise

## Overview

Create a recipe management application that allows users to view, search, and organize recipes. This exercise tests your ability to build a full-stack web application with a focus on data relationships and user experience.

## Tips

- Use whatever frameworks/tools you're most comfortable with
- Focus on creating a working MVP before adding advanced features
- Be sure to document any assumptions or known limitations
- Test your application with different scenarios

## Setup Instructions

#### Backend setup

```
cd backend
npm install
npm run dev # Starts express server on port 8080
```

#### Frontend setup

```
cd frontend
npm install
npm run dev # Starts nextjs frontend server on port 3000
```

#### Database setup

```
The application uses a JSON file (`data.json`) as a mock database
```

**Note: Feel free to use whatever frontend or backend framework you want. The sample contains a Next.js + Express server scaffold, but use whatever you're comfortable with.**

## Requirements

#### Core Features (Required)

- Display a list of recipes with their basic information (`/recipes`)
- Implement recipe detail page (`/recipes/:id`) showing:
  - Ingredients with quantities
  - Cooking instructions
  - Tags
  - Nutritional information (calculated from ingredients)
- Add search/filter functionality on (`/recipes`) by:
  - Recipe name
  - Tags
  - Ingredients

#### Example Advanced Features (Bonus Points. Feel free to implement any of these or add your own. Some examples below)

- Implement dietary restriction filters (e.g., vegetarian, vegan, gluten-free)
- Create a calorie calculator based on serving size
- Add recipe scaling functionality (e.g., adjust ingredients for different serving sizes)
- Implement recipe favoriting/saving
- Add sorting options (prep time, difficulty, etc.)
- Add a "shopping list" generator for selected recipes
- Incorporate an LLM feature
- Types

## Evaluation Criteria

- Code organization and clarity
- UI/UX design and responsiveness
- API design and implementation
- Error handling and edge cases
- Performance considerations
- TypeScript/JavaScript best practices

## Submission

1. Update this README with a new section below called `Candidate Notes:
   - Setup instructions if you've added any requirements
   - Brief explanation of your implementation choices
   - List of completed features
   - Any assumptions made
   - Known limitations or bugs
   - Additional features you'd add with more time

2. Send us (via email to scott.nguyen@sprx.tax & anthony.difalco@sprx.tax):
   - A zip file of the entire project (frontend and backend)
   - A link to a deployed version of the application (bonus points)

Good luck! We're excited to see your implementation.

---

## Candidate Notes

### Setup Instructions

- Backend: `cd backend-app && npm install && npm run dev` (runs on port 8080)
- Frontend: `cd frontend-app && npm install && npm run dev` (runs on port 3000)
- AI Feature: create a `.env` file in `backend-app/` with `ANTHROPIC_API_KEY=your_key_here` (get a key at console.anthropic.com) — see `backend-app/.env.example`
- Both servers must be running simultaneously

### Implementation Choices

- Next.js App Router for the frontend with client-side data fetching for responsive filter/search UX
- Express backend with a clean service layer separating route handlers from business logic
- JSON file wrapped in an in-memory cache (read once on startup, no repeated disk reads)
- Server-side filtering and search across recipe name, tags, ingredients, cuisine, and difficulty
- Nutrition calculated server-side by joining ingredient data and scaling to serving size
- Tailwind CSS with a custom Japandi-inspired design system — warm off-white palette, Georgia serif headings, editorial section labels (I chose this to give the app a more content first aesthetic since I am a home baker when I look at websites for recipes, I tend to look at a cleaner and more user friendly aesthetic.)
- AI assistant calls Claude API exclusively from the backend so the API key never reaches the client

### Completed Features

Core:

- Recipe list page with search and filter
- Recipe detail page with joined ingredients, step-by-step instructions, tags, and nutrition info
- Search by recipe name, tags, and ingredient names
- Filter by difficulty and dietary restrictions

Bonus:

- Dietary restriction filters (vegetarian, vegan, gluten-free)
- Serving size scaler — adjusts ingredient quantities and recalculates nutrition in real time
- Sorting by prep time (low/high) and difficulty (easy/hard first)
- Recipe favoriting with localStorage persistence and "Saved" filter on the list page
- Shopping list generator — select multiple recipes, aggregates and deduplicates ingredients, copy to clipboard
- AI Assistant — three contextual suggestions (substitution ideas, scaling tips, pairing suggestions) powered by Claude API, triggered on demand
- Browse by cuisine quick-filter row
- Tag frequency ranking — shows top 8 tags by usage with expandable "more tags" option
- Deployed version (Vercel for frontend, Railway for backend)
  - (https://recipe-manager-seven.vercel.app/recipes)

### Assumptions

- Nutritional values are stored per ingredient unit in data.json and calculated at request time
- Favorites persist in localStorage — no backend persistence since there is no auth system
- Shopping list is session-only (in-memory) — resets on page refresh by design
- ANTHROPIC_API_KEY is required to use the AI Assistant feature; all other features work without it

### Data Integrity Fix

During development, I identified that 8 ingredient IDs referenced by recipes in the provided data.json had no corresponding entries in the ingredients lookup table, causing blank ingredient names on the detail page. So, I added the missing ingredient definitions (basil, butter, brown_sugar, white_sugar, broccoli, carrot, soy_sauce, ginger) with realistic nutritional values to resolve the join issue. Also added missing cuisine tags to four recipes (Chocolate Chip Cookies, Berry Smoothie Bowl, Quinoa Buddha Bowl, Almond-Crusted Chicken).

### Known Limitations

- JSON file resets to its initial state on server restart — no write/persist operations
- No user authentication — favorites and shopping list are per-browser only
- No image support — data.json does not include recipe images
- AI Assistant requires a valid Anthropic API key to function

### What I Would Add With More Time

- User authentication and server-side favorites persistence
- Recipe creation and editing UI
- Food photography / image upload support
- A proper database (PostgreSQL or SQLite) replacing the JSON mock data
- Unit tests for the service layer (nutrition calculation, search filtering)
- TypeScript migration for stronger type safety across the full stack
