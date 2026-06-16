// app/api/analytics/session/route.ts  (ThynkPulse)
// POST /api/analytics/session  — records a session ping from SessionTracker
// GET  /api/analytics/session  — returns aggregated stats (admin only)

export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

// ── Auto-migration — runs once per server process ────────────────────────────
let _migrated = false
async function ensureTable() {
  if (_migrated) return
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id       UUID    REFERENCES users(id) ON DELETE SET NULL,
        session_id    TEXT    NOT NULL,
        page_path     TEXT    NOT NULL DEFAULT '/',
        duration_sec  INTEGER NOT NULL DEFAULT 0,
        is_bounced    BOOLEAN NOT NULL DEFAULT false,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await db.query(`CREATE INDEX IF NOT EXISTS idx_sessions_user    ON user_sessions(user_id)`)
    await db.query(`CREATE INDEX IF NOT EXISTS idx_sessions_created ON user_sessions(created_at)`)
    await db.query(`CREATE INDEX IF NOT EXISTS idx_sessions_path    ON user_sessions(page_path)`)
    _migrated = true
  } catch (e) {
    console.error('[analytics] ensureTable failed:', e)
  }
}

// ── POST: record a session ping ───────────────────────────────────────────────
export async function POST(req: NextRequest) {
  await ensureTable()
  try {
    const body = await req.json()
    const { sessionId, pagePath, durationSec, isBounced } = body

    if (!sessionId || typeof durationSec !== 'number') {
      return Response.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Optionally attach logged-in user
    const token   = getTokenFromHeader(req.headers.get('authorization') || '')
    const payload = token ? verifyToken(token) : null
    const userId  = (payload as any)?.id || null

    await db.query(
      `INSERT INTO user_sessions (user_id, session_id, page_path, duration_sec, is_bounced)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING`,
      [userId, sessionId, pagePath || '/', Math.max(0, Math.round(durationSec)), !!isBounced]
    )

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[POST /analytics/session]', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}

// ── GET: aggregate stats (admin only) ────────────────────────────────────────
export async function GET(req: NextRequest) {
  await ensureTable()

  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return Response.json({ error: 'Unauthorised' }, { status: 401 })

  const payload = verifyToken(token) as any
  if (!payload || payload.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const range = searchParams.get('range') || '7d'

  const intervalMap: Record<string, string> = {
    '1d':  `NOW() - INTERVAL '1 day'`,
    '7d':  `NOW() - INTERVAL '7 days'`,
    '30d': `NOW() - INTERVAL '30 days'`,
    'all': `NOW() - INTERVAL '10 years'`,
  }
  const since = intervalMap[range] || intervalMap['7d']

  try {
    const [overview, byDay, byPage, distribution] = await Promise.all([
      // Overall totals and averages
      db.query(`
        SELECT
          COUNT(*)                                                                    AS total_sessions,
          ROUND(AVG(duration_sec))                                                   AS avg_duration_sec,
          ROUND(AVG(duration_sec) FILTER (WHERE NOT is_bounced))                    AS avg_engaged_sec,
          COUNT(*) FILTER (WHERE is_bounced)                                         AS bounced,
          COUNT(DISTINCT session_id)                                                  AS unique_sessions,
          ROUND(COUNT(*) FILTER (WHERE is_bounced) * 100.0 / NULLIF(COUNT(*), 0), 1) AS bounce_rate
        FROM user_sessions
        WHERE created_at >= ${since}
      `),

      // Sessions + avg duration per day (IST)
      db.query(`
        SELECT
          DATE(created_at AT TIME ZONE 'Asia/Kolkata') AS day,
          COUNT(*)                                      AS sessions,
          ROUND(AVG(duration_sec))                      AS avg_sec
        FROM user_sessions
        WHERE created_at >= ${since}
        GROUP BY 1
        ORDER BY 1 ASC
      `),

      // Top pages by avg time spent
      db.query(`
        SELECT
          page_path,
          COUNT(*)                 AS visits,
          ROUND(AVG(duration_sec)) AS avg_sec
        FROM user_sessions
        WHERE created_at >= ${since}
        GROUP BY page_path
        ORDER BY avg_sec DESC
        LIMIT 10
      `),

      // Duration distribution buckets
      db.query(`
        SELECT
          CASE
            WHEN duration_sec < 15  THEN '0-14s'
            WHEN duration_sec < 30  THEN '15-29s'
            WHEN duration_sec < 60  THEN '30-59s'
            WHEN duration_sec < 120 THEN '1-2 min'
            WHEN duration_sec < 300 THEN '2-5 min'
            ELSE '5+ min'
          END AS bucket,
          COUNT(*) AS count
        FROM user_sessions
        WHERE created_at >= ${since}
        GROUP BY 1
        ORDER BY MIN(duration_sec)
      `),
    ])

    const ov = overview.rows[0]

    return Response.json({
      range,
      overview: {
        totalSessions:   Number(ov.total_sessions),
        avgDurationSec:  Number(ov.avg_duration_sec)  || 0,
        avgEngagedSec:   Number(ov.avg_engaged_sec)   || 0,
        bouncedSessions: Number(ov.bounced),
        uniqueSessions:  Number(ov.unique_sessions),
        bounceRate:      Number(ov.bounce_rate)        || 0,
      },
      byDay:        byDay.rows.map((r: any) => ({ day: r.day, sessions: Number(r.sessions), avgSec: Number(r.avg_sec) })),
      byPage:       byPage.rows.map((r: any) => ({ path: r.page_path, visits: Number(r.visits), avgSec: Number(r.avg_sec) })),
      distribution: distribution.rows.map((r: any) => ({ bucket: r.bucket, count: Number(r.count) })),
    })
  } catch (err) {
    console.error('[GET /analytics/session]', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
