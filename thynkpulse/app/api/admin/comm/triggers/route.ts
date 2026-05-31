// app/api/admin/comm/triggers/route.ts
export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { requireAdmin, isAdminError } from '@/lib/adminAuth'

// GET /api/admin/comm/triggers
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth
  const { rows } = await db.query(`
    SELECT t.*, tmpl.name AS template_name, tmpl.channel AS template_channel
    FROM comm_triggers t
    LEFT JOIN comm_templates tmpl ON tmpl.id = t.template_id
    ORDER BY t.created_at DESC
  `)
  return Response.json({ triggers: rows })
}

// POST — create trigger
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth
  const { event_type, channel, template_id, recipient_type, is_active } = await req.json()
  if (!event_type || !channel || !template_id) return Response.json({ error: 'event_type, channel and template_id required' }, { status: 400 })
  const { rows } = await db.query(
    `INSERT INTO comm_triggers (event_type, channel, template_id, recipient_type, is_active)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [event_type, channel, template_id, recipient_type || 'user', is_active ?? true]
  )
  return Response.json({ trigger: rows[0] })
}

// PATCH — update trigger
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth
  const { id, ...fields } = await req.json()
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })
  const allowed = ['event_type','channel','template_id','recipient_type','is_active']
  const sets = Object.keys(fields).filter(k => allowed.includes(k))
  if (!sets.length) return Response.json({ error: 'Nothing to update' }, { status: 400 })
  const setClauses = sets.map((k, i) => `${k} = $${i + 2}`).join(', ')
  const vals = sets.map(k => (fields as any)[k])
  const { rows } = await db.query(
    `UPDATE comm_triggers SET ${setClauses}, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id, ...vals]
  )
  return Response.json({ trigger: rows[0] })
}

// DELETE — remove trigger
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth
  const { id } = await req.json()
  await db.query(`DELETE FROM comm_triggers WHERE id = $1`, [id])
  return Response.json({ ok: true })
}
