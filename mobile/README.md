# CivicLens Mobile (Expo)

Frontend-only React Native clone of the CivicLens web app. Talks to the deployed backend:

**API Base URL:** `https://civiclens-seven-taupe.vercel.app`

## Screens (mirrors web)

| Route | Web equivalent |
|---|---|
| `/` | Landing + Citizen Dashboard |
| `/login` | `/login` |
| `/register` | `/register` |
| `/explore` | `/explore` |
| `/report` | `/report` |
| `/report/[id]` | `/report/[id]` |
| `/my-reports` | `/my-reports` |
| `/admin/dashboard` | `/admin/dashboard` |

## Design tokens

Same DashStack colors as web (`src/app/globals.css`):

- Primary `#4880FF`
- Success `#00B69B`
- Warning `#FF9F43`
- Destructive `#EF3826`
- Light bg `#F5F6FA` / Dark bg `#1B2431`

## Zero-env flow (default)

No new Vercel env vars. No `mobile/.env` required.

1. Deploy/push the Next.js app (CORS middleware + production Auth cookies activate automatically on Vercel).
2. `cd mobile && npm install && npx expo start`
3. Open Expo Go / web — API already points at `https://civiclens-seven-taupe.vercel.app`.
4. Sign in with demo credentials below (live Auth.js session cookies).

Local web (`next dev` on :3000) keeps normal Lax cookies so browser login stays safe on HTTP. Cross-origin Expo cookies (`SameSite=None`) turn on only in production/Vercel.

Optional override only if you must hit a different API host:

```
EXPO_PUBLIC_API_URL=https://your-api-host.vercel.app
```

## Run

```bash
cd mobile
npm install
npx expo start
```

Then press `i` (iOS simulator), `a` (Android), or scan the QR with Expo Go.

## Demo logins

Same as web:

- Citizen: `aarav.citizen@civiclens.gov` / `Password123!`
- Officer: `municipalofficer@civiclens.gov` / `Password123!`

## Auth & APIs

Uses NextAuth session cookies against the deployed site (`/api/auth/csrf`, `/api/auth/callback/credentials`, `/api/auth/session`) plus existing REST routes:

- `POST /api/auth/register`
- `GET /api/grievances/:id`
- `POST /api/cloudinary/sign`

Optional mobile helpers (if present on backend): `/api/mobile/*` for dashboard, feed, create, admin triage.
