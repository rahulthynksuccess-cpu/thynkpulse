// app/api/notifications/route.ts  (ThynkPulse)
export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'
import { ensureNotificationsTable } from '@/lib/notify'

function getUser(req: NextRequest): { userId: string; role: string } | null {
  try {
    const raw   = req.headers.get('authorization') || ''
    const token = getTokenFromHeader(raw) || req.cookies.get('tp_token')?.value || null
    if (!token) return null
    const p = verifyToken(token) as any
    return p ? { userId: p.userId || p.id, role: p.role || 'other' } : null
  } catch { return null }
}

// ── GET /api/notifications  -- fetch notifications for current user ─────────────
export async function GET(req: NextRequest) {
  try {
    await ensureNotificationsTable()
    const user = getUser(req)
    if (!user) return Response.json([])

    // Determine audience filters for this user
    // Writers / Educators see broadcast messages targeted at their group
    const audienceFilters = ['all', 'user']

    // Get user role to include relevant broadcast audience
    const roleRes = await db.query(
      'SELECT role FROM users WHERE id = $1',
      [user.userId]
    ).catch(() => ({ rows: [] }))
    const role = roleRes.rows[0]?.role || 'other'
    if (role === 'educator')  audienceFilters.push('educators')
    if (role !== 'other')     audienceFilters.push('writers')  // educators + edtech_pro

    const { rows } = await db.query(
      `SELECT id, title, body, type, link, is_read, created_at
       FROM tp_notifications
       WHERE
         (user_id = $1)
         OR (user_id IS NULL AND audience = ANY($2))
       ORDER BY created_at DESC
       LIMIT 40`,
      [user.userId, audienceFilters]
    )

    return Response.json(rows.map((r: any) => ({
      id:        r.id,
      title:     r.title,
      body:      r.body || '',
      type:      r.type,
      link:      r.link || null,
      isRead:    r.is_read,
      createdAt: r.created_at,
    })))
  } catch (e: any) {
    console.error('[tp-notifications GET]', e)
    return Response.json([])
  }
}

// ── POST /api/notifications?action=mark-read|mark-all-read ────────────────────
export async function POST(req: NextRequest) {
  try {
    await ensureNotificationsTable()
    const user = getUser(req)
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')

    if (action === 'mark-read') {
      const id = searchParams.get('id')
      if (!id) return Response.json({ error: 'id required' }, { status: 400 })
      await db.query(
        `UPDATE tp_notifications SET is_read = true WHERE id = $1 AND (user_id = $2 OR user_id IS NULL)`,
        [id, user.userId]
      )
      return Response.json({ ok: true })
    }

    if (action === 'mark-all-read') {
      // Mark all user-specific + broadcast notifications as read by inserting read receipts
      // Simple approach: mark all belonging to this user
      await db.query(
        `UPDATE tp_notifications SET is_read = true WHERE user_id = $1`,
        [user.userId]
      )
      return Response.json({ ok: true })
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
