import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { status, rejectionReason, isFeatured } = await req.json()

    const updates: string[] = ['updated_at = NOW()']
    const vals: unknown[] = []
    let idx = 1

    if (status !== undefined) {
      if (!['approved','rejected','pending','draft'].includes(status))
        return Response.json({ error: 'Invalid status' }, { status: 400 })
      updates.push(`status = $${idx++}`)
      vals.push(status)
      if (status === 'approved') {
        updates.push(`published_at = NOW()`)
      }
    }
    if (rejectionReason !== undefined) {
      updates.push(`rejection_reason = $${idx++}`)
      vals.push(rejectionReason)
    }
    if (isFeatured !== undefined) {
      updates.push(`is_featured = $${idx++}`)
      vals.push(isFeatured)
    }

    vals.push(params.id)
    const res = await db.query(
      `UPDATE posts SET ${updates.join(', ')} WHERE id = $${idx} RETURNING author_id, status`,
      vals
    )
    if (res.rows.length === 0)
      return Response.json({ error: 'Post not found' }, { status: 404 })

    // If approved, increment author post count
    if (status === 'approved') {
      await db.query(
        'UPDATE user_profiles SET post_count = post_count + 1 WHERE user_id = $1',
        [res.rows[0].author_id]
      ).catch(() => {})
    }

    return Response.json({ message: `Post ${status}` })
  } catch (err) {
    console.error('[PUT /admin/posts/id]', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
