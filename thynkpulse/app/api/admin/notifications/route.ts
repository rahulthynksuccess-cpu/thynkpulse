// app/api/admin/notifications/route.ts  (ThynkPulse)
export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { requireAdmin, isAdminError } from '@/lib/adminAuth'
import { ensureNotificationsTable } from '@/lib/notify'

// GET  -- list recent broadcast notifications (admin only)
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth

  await ensureNotificationsTable()

  const { rows } = await db.query(
    `SELECT id, audience, title, body, type, link, created_at
     FROM tp_notifications
     WHERE user_id IS NULL
     ORDER BY created_at DESC
     LIMIT 60`
  ).catch(() => ({ rows: [] }))

  return Response.json({ notifications: rows })
}

// POST -- send a broadcast notification (admin only)
// Body: { audience: 'all' | 'writers' | 'educators', title, body, link? }
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth

  await ensureNotificationsTable()

  const { audience, title, body, link } = await req.json()
  if (!title?.trim()) return Response.json({ error: 'Title required' }, { status: 400 })

  const validAudiences = ['all', 'writers', 'educators']
  const aud = validAudiences.includes(audience) ? audience : 'all'

  await db.query(
    `INSERT INTO tp_notifications (user_id, audience, title, body, type, link, is_read, created_at)
     VALUES (NULL, $1, $2, $3, 'broadcast', $4, false, NOW())`,
    [aud, title.trim(), body?.trim() || '', link?.trim() || null]
  )

  return Response.json({ ok: true })
}

// DELETE -- remove a broadcast notification
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth

  const { id } = await req.json()
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })
  await db.query('DELETE FROM tp_notifications WHERE id = $1 AND user_id IS NULL', [id])
  return Response.json({ ok: true })
}
