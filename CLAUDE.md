@AGENTS.md

# LinkMint - URL Shortener with Ad Steps

## Overview
A monetized URL shortener where visitors must complete configurable timed ad-step pages before reaching the destination URL. Includes a publisher dashboard and an admin panel.

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Custom JWT with HTTP-only cookies (bcryptjs for hashing)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript (strict mode)

## Project Structure
```
url-shortener/
├── app/                        # Next.js App Router pages & API routes
│   ├── page.tsx                # Landing page (public URL shortener form)
│   ├── login/page.tsx          # Login page
│   ├── register/page.tsx       # Registration page
│   ├── dashboard/              # Publisher dashboard (auth required)
│   │   ├── page.tsx            # Links list, stats, shorten form
│   │   └── links/[id]/page.tsx # Per-link detail: step config, click analytics
│   ├── admin/                  # Admin panel (admin role required)
│   │   ├── page.tsx            # Admin dashboard with stats
│   │   ├── links/page.tsx      # All links management (search, toggle, delete)
│   │   ├── users/page.tsx      # User management (roles, ban/unban)
│   │   └── settings/page.tsx   # Global settings (steps, timer, limits)
│   ├── go/[code]/page.tsx      # Interstitial step page (server component)
│   └── api/
│       ├── auth/               # POST login, POST register, GET me, DELETE logout
│       ├── links/              # CRUD for user's links + [id] for detail/update/delete
│       ├── admin/              # Admin-only: links, users, users/[id], settings
│       └── go/verify/          # POST - server-side step completion verification
├── components/
│   ├── Navbar.tsx              # Nav with public/dashboard/admin variants
│   ├── ShortenForm.tsx         # URL shortening form
│   ├── LinkTable.tsx           # Links table with actions
│   ├── StepPage.tsx            # Interstitial step UI (timer + ads + CTA)
│   ├── CountdownTimer.tsx      # Circular countdown animation
│   └── AdPlaceholder.tsx       # Placeholder ad slots (banner/rectangle/leaderboard)
├── lib/
│   ├── supabase.ts             # Lazy-init Supabase client + DB type interfaces
│   ├── auth.ts                 # JWT generate/verify, password hash/compare, getCurrentUser, requireAuth, requireAdmin
│   └── utils.ts                # generateShortCode (nanoid), generateSessionToken, isValidUrl, formatDate, formatNumber
├── proxy.ts                    # Next.js proxy: rewrites /abc123 → /go/abc123 for short codes
├── supabase/migrations/
│   └── 001_initial_schema.sql  # Full DB schema with triggers
└── .env.local.example          # Required env vars template
```

## Key Architectural Decisions

### Short Code Routing
`proxy.ts` intercepts requests matching `/[a-zA-Z0-9]{4,10}` and rewrites them to `/go/[code]`. App routes (`/dashboard`, `/admin`, `/api`, etc.) are explicitly excluded.

### Interstitial Flow
1. `/go/[code]/page.tsx` (Server Component) loads link + steps, creates a `visit_session`, logs a `click`, renders `StepPage`
2. `StepPage` (Client Component) shows countdown timer → enables CTA button
3. On CTA click, `POST /api/go/verify` validates server-side (timer elapsed, step order) → advances session or redirects to destination
4. Navigation between steps uses `?s=<sessionToken>` query param

### Authentication
- JWT stored in HTTP-only cookie named `token` (7-day expiry)
- `requireAuth()` / `requireAdmin()` helpers in `lib/auth.ts` for API route protection
- Roles: `admin`, `publisher`

### Database Tables
- `users` — accounts with role-based access
- `links` — short URLs (auto-increments `total_clicks` via DB trigger)
- `link_steps` — per-link ordered steps with timer + button text + optional ad HTML
- `clicks` — append-only click log (IP, user agent, device, referrer)
- `visit_sessions` — tracks visitor progress through steps, expires after 30 min
- `global_settings` — single-row config (default_steps, default_timer_seconds, max_links_per_user, site_name)

## Commands
```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
```

## Environment Variables (required)
```
NEXT_PUBLIC_SUPABASE_URL=<supabase project url>
SUPABASE_SERVICE_ROLE_KEY=<supabase service role key>
JWT_SECRET=<random secret for JWT signing>
```

## Next.js 16 Specifics (Breaking Changes)
- `params` and `searchParams` are **Promises** — always `await params` in pages/routes
- `cookies()` is **async** — always `await cookies()`
- Auth routing uses `proxy.ts` (not `middleware.ts`)
- GET route handlers are dynamic by default
