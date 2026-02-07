# Project Overview
This project is a Next.js application that retrieves Facebook Page data from the Graph API and renders it in a structured dashboard. It aggregates profile information, page feed posts, comments, and page tags into a single UI for quick review.

# Problem Statement
Facebook Page managers need a simple way to view page metadata, recent posts, and comment activity in one place without manually navigating the Graph API responses.

# Solution Summary
- A server-side API route queries the Facebook Graph API for profile info, feed posts, page tags, and comments.
- The client fetches the aggregated API response and renders it with React state.
- The UI supports refresh, loading/error states, and expandable comment sections per post.

# Technical Architecture
- **Next.js App Router** handles routing and server components.
- **API Route (`src/app/api/facebook-comments/route.ts`)**:
  - Calls Graph API endpoints for accounts, feed, tags, and profile pictures.
  - Paginates through comment responses to collect all comments per post.
  - Returns a consolidated JSON payload.
- **Client Page (`src/app/page.tsx`)**:
  - Fetches `/api/facebook-comments` on load and on demand.
  - Stores profile data, feed entries, comments-by-post, and tags in state.
  - Expands/collapses comment lists per post.
- **Styling** uses Tailwind CSS via PostCSS with global theme variables.
- **Assets** are configured to allow Facebook CDN images in `next.config.ts`.

# Key Features
- Fetches Facebook Page profile data and renders name/ID with profile picture.
- Displays page feed posts with created time, story/message, and post ID.
- Aggregates and toggles comments per post.
- Collects and shows page tag entries.
- Provides loading and error messaging during API calls.

# Tech Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS + PostCSS
- ESLint (Next.js core-web-vitals config)
- Facebook Graph API via `fetch`

# Setup and Run Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Update the access tokens in `src/app/api/facebook-comments/route.ts` with valid Facebook Graph API tokens.
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in the browser.

Optional production build:
```bash
npm run build
npm run start
```

# Challenges Faced
- Paginating comment data using Graph API `paging.next` links to gather full comment threads.
- Coordinating sequential Graph API calls (profile → feed → comments → tags) inside a single route handler.
- Managing multiple related datasets in React state while keeping UI responsive.

# Key Learnings
- Building aggregated API endpoints with Next.js route handlers.
- Handling paginated REST responses and grouping results by post ID.
- Structuring client state for nested data (feed, comments, tags) in React.
