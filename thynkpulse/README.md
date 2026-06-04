# ThynkPulse — Loyalty Badge System
## Implementation Guide

---

## Files Delivered

| File | Purpose |
|------|---------|
| `lib/badges.ts` | All badge definitions + `computeEarnedBadges()`, `computeEliteTag()`, `getNextBadge()` |
| `components/ui/BadgeDisplay.tsx` | `VerifiedBadge`, `BadgeChip`, `EliteTag`, `BadgeShelf`, `BadgeGrid`, `BadgeProgressBar` |
| `app/api/users/[username]/badges/route.ts` | GET endpoint returning earned badges + progress |
| `app/profile/[username]/page.tsx` | Full patched profile page with Badges tab |
| `migration_badges.sql` | DB migration — `comment_count` column, triggers, `user_badges` table, view |
| `ADMIN_USERS_PATCH.ts` | Step-by-step instructions for admin users page verify button |

---

## Step 1 — Run the Migration

```bash
psql $DATABASE_URL -f migration_badges.sql
```

This adds:
- `user_profiles.comment_count` (with backfill + auto-increment trigger)
- `user_badges` table (optional persistent store for one-time badges)
- `v_user_badge_stats` view for admin queries

---

## Step 2 — Copy files into your project

```
lib/badges.ts                              → thynkpulse/lib/badges.ts
components/ui/BadgeDisplay.tsx             → thynkpulse/components/ui/BadgeDisplay.tsx
app/api/users/[username]/badges/route.ts   → thynkpulse/app/api/users/[username]/badges/route.ts
app/profile/[username]/page.tsx            → thynkpulse/app/profile/[username]/page.tsx  (replaces existing)
```

---

## Step 3 — Apply Admin Users Patch

Open `app/admin/users/page.tsx` and make these changes (detailed in `ADMIN_USERS_PATCH.ts`):

1. Add `verifyMutation` after the existing `toggleMutation`
2. Add **Verified** column to table `<th>`
3. Add ✅/— cell in table row after Status
4. Add **Verify/Unverify** button in the Actions cell
5. Optionally show ✅ emoji beside name

> The backend `PUT /admin/users/[id]` route already supports `isVerified` — no API changes needed.

---

## How Badges Work

### Badge Logic (computed on-the-fly)
Badges are **not stored** — they are computed live from user stats each time the profile loads. This means they automatically update as users hit milestones.

The only stored badges are in `user_badges` (optional) for **one-time event badges** like "First Published Post" — use this if you want to send a notification when the badge is first earned.

### Badge Categories

| Category | Trigger | Top Badge |
|----------|---------|-----------|
| ✅ Verified | Admin approves user | Verified |
| 📝 Content Creator | Posts published | ThynkPulse Icon (500 posts) |
| 💬 Engagement | Comments made | Community Pillar (1,000 comments) |
| ❤️ Appreciation | Likes received on posts | Influential Voice (5,000 likes) |
| 🔗 Networking | Followers (connections) | Ecosystem Builder (1,000) |
| 🎓 Educator | Education-category posts | Education Ambassador |

### Elite Status Tags
Computed from `(postCount, followerCount)` thresholds. Displayed beside the user's name on their profile. The highest qualifying tag is shown.

| Tag | Requirement |
|-----|-------------|
| 🌱 Emerging Voice | 10+ posts |
| ⭐ Thought Leader | 25 posts + 50 followers |
| 🔥 Knowledge Champion | 50 posts + 100 followers |
| 💎 Visionary Author | 250 posts + 500 followers |
| 👑 Community Pillar | 1,000+ followers |
| 🚀 Future Skills Champion | 50 posts + 200 followers |
| 🏆 ThynkPulse Ambassador | 100 posts + 500 followers |
| 👑 ThynkPulse Legend | 500 posts + 1,000 followers |

---

## API Reference

### `GET /api/users/:username/badges`

Returns:
```json
{
  "userId": "...",
  "stats": {
    "isVerified": true,
    "postCount": 27,
    "commentCount": 143,
    "likesReceived": 892,
    "followerCount": 340,
    "eduPostCount": 18
  },
  "earned": ["verified", "thought_leader", "engagement_builder", ...],
  "badgeDefs": [ ...full BadgeDef objects... ],
  "eliteTag": { "id": "thought_leader_tag", "label": "Thought Leader", "emoji": "⭐", ... },
  "nextBadges": [
    { "badge": { "id": "knowledge_champion", ... }, "progress": 54 }
  ]
}
```

---

## Educator Category Matching

Education posts are identified by category containing any of:
- `educat` (Education, Educational, etc.)
- `teacher` / `school` / `learning`
- exact match `edtech`

Adjust the SQL `WHERE` clause in the badges route if your categories differ.

---

## Optional: One-time Badge Notifications

When a user's badge tier upgrades, award a persistent record:

```typescript
// In your post approval API (app/api/admin/posts/[id]/route.ts)
// After approving a post, check for new badges:

import { computeEarnedBadges } from '@/lib/badges'

// ...after incrementing post_count...
const newBadges = computeEarnedBadges(updatedStats)
for (const badge of newBadges) {
  await db.query(
    `INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [userId, badge.id]
  )
  // trigger notification here
}
```
