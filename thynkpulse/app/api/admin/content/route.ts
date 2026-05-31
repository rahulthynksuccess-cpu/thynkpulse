export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { requireAdmin, isAdminError } from '@/lib/adminAuth'

async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY, value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `).catch(()=>{})
}

export async function GET() {
  await ensureTable()
  try {
    const res = await db.query("SELECT key, value FROM site_settings WHERE key LIKE 'content%' OR key = 'theme'")
    const out: Record<string,any> = {}
    res.rows.forEach(r => { try { out[r.key] = JSON.parse(r.value) } catch { out[r.key] = r.value } })
    return Response.json(out)
  } catch { return Response.json({}) }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth
  await ensureTable()
  try {
    const body = await req.json()
    // body is { key: string, value: any }
    const { key, value } = body
    await db.query(
      `INSERT INTO site_settings (key, value, updated_at) VALUES ($1,$2,NOW())
       ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()`,
      [key, JSON.stringify(value)]
    )
    return Response.json({ message: 'Saved' })
  } catch (err) {
    console.error('[content POST]', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
