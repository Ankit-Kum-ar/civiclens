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

## Run

```bash
cd mobile
npm install
npx expo start
```

Then press `i` (iOS simulator), `a` (Android), or scan the QR with Expo Go.

### Point at another backend

Edit `mobile/.env`:

```
EXPO_PUBLIC_API_URL=https://civiclens-seven-taupe.vercel.app
```

For a local Next.js server from a physical device, use your LAN IP (see `allowedDevOrigins` in root `next.config.ts`), e.g. `http://192.168.1.7:3000`.

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
