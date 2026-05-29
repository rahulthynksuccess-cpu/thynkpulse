// app/api/admin/comm/templates/route.ts
export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

function adminOnly(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return null
  const p = verifyToken(token) as any
  return p?.role === 'admin' ? p : null
}

// GET /api/admin/comm/templates
export async function GET(req: NextRequest) {
  const p = adminOnly(req)
  if (!p) return Response.json({ error: 'Forbidden' }, { status: 403 })
  const { rows } = await db.query(
    `SELECT * FROM comm_templates ORDER BY created_at DESC`
  )
  return Response.json({ templates: rows })
}

// POST /api/admin/comm/templates  — create
export async function POST(req: NextRequest) {
  const p = adminOnly(req)
  if (!p) return Response.json({ error: 'Forbidden' }, { status: 403 })
  const { name, channel, subject, body, whatsapp_template_name, whatsapp_template_lang, is_active } = await req.json()
  if (!name || !body || !channel) return Response.json({ error: 'name, body and channel required' }, { status: 400 })
  const { rows } = await db.query(
    `INSERT INTO comm_templates (name,channel,subject,body,whatsapp_template_name,whatsapp_template_lang,is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [name, channel, subject || null, body, whatsapp_template_name || null, whatsapp_template_lang || 'en', is_active ?? true]
  )
  return Response.json({ template: rows[0] })
}

// PATCH /api/admin/comm/templates  — update
export async function PATCH(req: NextRequest) {
  const p = adminOnly(req)
  if (!p) return Response.json({ error: 'Forbidden' }, { status: 403 })
  const { id, ...fields } = await req.json()
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })
  const allowed = ['name','channel','subject','body','whatsapp_template_name','whatsapp_template_lang','is_active']
  const sets = Object.keys(fields).filter(k => allowed.includes(k))
  if (!sets.length) return Response.json({ error: 'Nothing to update' }, { status: 400 })
  const setClauses = sets.map((k, i) => `${k} = $${i + 2}`).join(', ')
  const vals = sets.map(k => (fields as any)[k])
  const { rows } = await db.query(
    `UPDATE comm_templates SET ${setClauses}, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id, ...vals]
  )
  return Response.json({ template: rows[0] })
}

// DELETE /api/admin/comm/templates
export async function DELETE(req: NextRequest) {
  const p = adminOnly(req)
  if (!p) return Response.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await req.json()
  await db.query(`DELETE FROM comm_templates WHERE id = $1`, [id])
  return Response.json({ ok: true })
}
