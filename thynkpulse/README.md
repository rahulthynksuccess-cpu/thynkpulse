# Thynk Pulse

India's Education Community Platform — by [Thynk Success](https://thynksuccess.com)

## Stack
- **Frontend:** Next.js 14 · TypeScript · Tailwind CSS · Framer Motion
- **State:** Zustand · TanStack Query
- **Backend:** Next.js API Routes · PostgreSQL
- **Auth:** JWT (bcryptjs)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in DATABASE_URL and JWT_SECRET

# 3. Create database tables
psql $DATABASE_URL < schema.sql

# 4. Run dev server
npm run dev
```

## Environment Variables

| Key | Description |
|-----|-------------|
| `DATABASE_URL` | PostgreSQL connection string (Neon / Supabase / Render) |
| `JWT_SECRET` | Long random string for signing tokens |
| `NEXT_PUBLIC_APP_URL` | Your deployed URL |
| `NEXT_PUBLIC_ADS_ENABLED` | `true` to activate ad slots (monetisation) |

## Default Admin Login
- Email: `admin@thynkpulse.in`
- Password: `Admin@1234` ← **change this immediately**

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — feed, trending, community |
| `/login` | Sign in |
| `/register` | 3-step registration (Educator / EdTech Pro / Other) |
| `/write` | Rich post editor |
| `/post/[slug]` | Single post + comments |
| `/profile/[username]` | Public profile |
| `/profile/edit` | Edit own profile |
| `/profile/setup` | Post-registration welcome |
| `/admin` | Admin overview |
| `/admin/users` | User management |
| `/admin/approvals` | Post approval workflow |
| `/admin/theme` | **Live Theme Controller** |

## Ad Slots (Future Monetisation)
Set `NEXT_PUBLIC_ADS_ENABLED=true` in env and the `<AdSlot>` components activate automatically — no code changes needed.

## Deploy to Vercel
1. Push to GitHub
2. Import repo in Vercel
3. Add env vars in Vercel dashboard
4. Deploy — done ✓
