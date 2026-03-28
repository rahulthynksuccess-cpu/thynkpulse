export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })

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
