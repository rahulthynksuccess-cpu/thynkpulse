export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { requireAdmin, isAdminError } from '@/lib/adminAuth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth

  try {
    const { searchParams } = new URL(req.url)
    const limit = Math.min(50, Number(searchParams.get('limit') || 20))

    const res = await db.query(
      `SELECT id, action, detail, ip_address, user_agent, created_at
       FROM user_activity_logs
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [params.id, limit]
    )

    return Response.json({ logs: res.rows })
  } catch (err) {
    console.error('[GET /admin/users/:id/activity]', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
