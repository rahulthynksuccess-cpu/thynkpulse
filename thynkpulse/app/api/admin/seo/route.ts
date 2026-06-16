// app/api/admin/seo/route.ts  (ThynkPulse)
// Stores and retrieves per-page SEO meta parameters in seo_settings table.
export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { requireAdmin, isAdminError } from '@/lib/adminAuth'

async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS seo_settings (
      id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
      page_key    VARCHAR(120) NOT NULL,
      param_key   VARCHAR(200) NOT NULL,
      param_value TEXT         NOT NULL DEFAULT '',
      updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      UNIQUE (page_key, param_key)
    )
  `).catch(() => {})
  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_seo_page_key ON seo_settings(page_key)
  `).catch(() => {})
}

// GET /api/admin/seo?page=<page_key>
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth

  await ensureTable()

  const pageKey = new URL(req.url).searchParams.get('page') || 'global'
  const { rows } = await db.query(
    'SELECT param_key, param_value FROM seo_settings WHERE page_key = $1 ORDER BY param_key ASC',
    [pageKey]
  )

  const data: Record<string, string> = {}
  rows.forEach((r: any) => { data[r.param_key] = r.param_value })

  return Response.json({ data })
}

// POST /api/admin/seo  -- upsert all params for a page
// Body: { pageKey: string, params: Record<string, string> }
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth

  await ensureTable()

  const { pageKey, params } = await req.json()
  if (!pageKey) return Response.json({ error: 'pageKey required' }, { status: 400 })

  for (const [k, v] of Object.entries(params as Record<string, string>)) {
    await db.query(
      `INSERT INTO seo_settings (page_key, param_key, param_value, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (page_key, param_key)
       DO UPDATE SET param_value = $3, updated_at = NOW()`,
      [pageKey, k, v]
    )
  }

  return Response.json({ message: 'SEO settings saved' })
}

// DELETE /api/admin/seo?page=<page_key>&param=<param_key>  -- remove one param
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth

  await ensureTable()

  const url = new URL(req.url)
  const pageKey  = url.searchParams.get('page')
  const paramKey = url.searchParams.get('param')

  if (!pageKey || !paramKey) return Response.json({ error: 'page and param required' }, { status: 400 })

  await db.query(
    'DELETE FROM seo_settings WHERE page_key = $1 AND param_key = $2',
    [pageKey, paramKey]
  )

  return Response.json({ ok: true })
}
