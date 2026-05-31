// app/api/admin/comm/settings/route.ts
// Stores email SMTP configs and WhatsApp settings in site_settings table
export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { requireAdmin, isAdminError } from '@/lib/adminAuth'

const KEYS = ['comm.email_smtp_configs', 'comm.whatsapp_settings']

// GET /api/admin/comm/settings  — returns both email and whatsapp settings
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth
  const { rows } = await db.query(
    `SELECT key, value FROM site_settings WHERE key = ANY($1)`,
    [KEYS]
  )
  const out: Record<string, any> = {}
  rows.forEach(r => {
    try { out[r.key] = JSON.parse(r.value) } catch { out[r.key] = r.value }
  })
  return Response.json(out)
}

// POST /api/admin/comm/settings  — upsert one key at a time
// Body: { key: 'comm.email_smtp_configs', value: [...] }
//    or { key: 'comm.whatsapp_settings',  value: {...} }
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth
  const { key, value } = await req.json()
  if (!key || !KEYS.includes(key)) return Response.json({ error: 'Invalid key' }, { status: 400 })
  await db.query(
    `INSERT INTO site_settings (key, value, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
    [key, JSON.stringify(value)]
  )
  return Response.json({ ok: true })
}
