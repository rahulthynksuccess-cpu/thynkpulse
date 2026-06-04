// ═══════════════════════════════════════════════════
//  THYNK PULSE — Badges API
//  app/api/users/[username]/badges/route.ts
// ═══════════════════════════════════════════════════

export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { computeEarnedBadges, computeEliteTag, UserBadgeStats, getNextBadge } from '@/lib/badges'

export async function GET(_req: NextRequest, { params }: { params: { username: string } }) {
  try {
    const identifier = decodeURIComponent(params.username)

    // ── Fetch user + profile stats ──────────────────
    const userRes = await db.query(
      `SELECT
         u.id,
         u.is_verified,
         u.role,
         p.follower_count,
         p.post_count,
         COALESCE(
           (SELECT COUNT(*) FROM comments WHERE author_id = u.id),
           0
         ) AS comment_count,
         COALESCE(
           (SELECT SUM(like_count) FROM posts WHERE author_id = u.id AND status = 'approved'),
           0
         ) AS likes_received,
         COALESCE(
           (SELECT COUNT(*) FROM posts
            WHERE author_id = u.id
              AND status = 'approved'
              AND (
                LOWER(category) LIKE '%educat%'
                OR LOWER(category) LIKE '%teacher%'
                OR LOWER(category) LIKE '%school%'
                OR LOWER(category) LIKE '%learning%'
                OR LOWER(category) = 'edtech'
              )
           ),
           0
         ) AS edu_post_count
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE u.email=$1 OR u.phone=$1 OR u.id::text=$1`,
      [identifier]
    )

    if (!userRes.rows.length) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    const r = userRes.rows[0]

    const stats: UserBadgeStats = {
      isVerified:    r.is_verified     === true,
      postCount:     Number(r.post_count)      || 0,
      commentCount:  Number(r.comment_count)   || 0,
      likesReceived: Number(r.likes_received)  || 0,
      followerCount: Number(r.follower_count)  || 0,
      eduPostCount:  Number(r.edu_post_count)  || 0,
    }

    const earned   = computeEarnedBadges(stats)
    const eliteTag = computeEliteTag(stats)

    // Progress toward next badges
    const nextBadges = [
      getNextBadge('posts',          stats.postCount),
      getNextBadge('comments',       stats.commentCount),
      getNextBadge('likes_received', stats.likesReceived),
      getNextBadge('connections',    stats.followerCount),
      getNextBadge('edu_posts',      stats.eduPostCount),
    ].filter(Boolean)

    return Response.json({
      userId:    r.id,
      stats,
      earned:    earned.map(b => b.id),
      badgeDefs: earned,
      eliteTag,
      nextBadges,
    })
  } catch (err) {
    console.error('[GET /users/badges]', err)
    return Response.json({ error: 'Failed to load badges' }, { status: 500 })
  }
}
