export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await req.json()
    const { isActive, isVerified, role } = body

    const updates: string[] = ['updated_at = NOW()']
    const vals: unknown[] = []
    let idx = 1

    if (isActive   !== undefined) { updates.push(`is_active = $${idx++}`);   vals.push(isActive) }
    if (isVerified !== undefined) { updates.push(`is_verified = $${idx++}`); vals.push(isVerified) }
    if (role       !== undefined) { updates.push(`role = $${idx++}`);         vals.push(role) }

    if (updates.length === 1) return Response.json({ error: 'Nothing to update' }, { status: 400 })

    vals.push(params.id)
    await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${idx}`, vals)

    return Response.json({ message: 'User updated' })
  } catch (err) {
    console.error('[PUT /admin/users/id]', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
