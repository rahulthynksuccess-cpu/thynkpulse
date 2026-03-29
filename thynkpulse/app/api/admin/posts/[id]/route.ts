export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'
import { logActivity } from '@/lib/activity'

function authAdmin(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return null
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') return null
  return payload
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!authAdmin(req)) return Response.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await req.json()
    const { status, rejectionReason, isFeatured, title, excerpt, content, coverEmoji, category, readTime } = body

    const updates: string[] = ['updated_at = NOW()']
    const vals: unknown[] = []
    let idx = 1

    if (title         !== undefined) { updates.push(`title = $${idx++}`);            vals.push(title) }
    if (excerpt       !== undefined) { updates.push(`excerpt = $${idx++}`);          vals.push(excerpt) }
    if (content       !== undefined) { updates.push(`content = $${idx++}`);          vals.push(content) }
    if (coverEmoji    !== undefined) { updates.push(`cover_emoji = $${idx++}`);      vals.push(coverEmoji) }
    if (category      !== undefined) { updates.push(`category = $${idx++}`);         vals.push(category) }
    if (readTime      !== undefined) { updates.push(`read_time = $${idx++}`);        vals.push(readTime) }
    if (isFeatured    !== undefined) { updates.push(`is_featured = $${idx++}`);      vals.push(isFeatured) }
    if (rejectionReason !== undefined) { updates.push(`rejection_reason = $${idx++}`); vals.push(rejectionReason) }
    if (status !== undefined) {
      if (!['approved','rejected','pending','draft'].includes(status))
        return Response.json({ error: 'Invalid status' }, { status: 400 })
      updates.push(`status = $${idx++}`)
      vals.push(status)
      if (status === 'approved') updates.push(`published_at = NOW()`)
    }

    vals.push(params.id)
    const res = await db.query(
      `UPDATE posts SET ${updates.join(', ')} WHERE id = $${idx} RETURNING author_id, status`,
      vals
    )
    if (res.rows.length === 0) return Response.json({ error: 'Post not found' }, { status: 404 })

    if (status === 'approved') {
      await db.query('UPDATE user_profiles SET post_count = post_count + 1 WHERE user_id = $1', [res.rows[0].author_id]).catch(() => {})
      await logActivity(res.rows[0].author_id, 'post_approved', `Post ID: ${params.id}`)
    }
    if (status === 'rejected') {
      await logActivity(res.rows[0].author_id, 'post_rejected', `Post ID: ${params.id}`)
    }

    return Response.json({ message: 'Post updated' })
  } catch (err) {
    console.error('[PUT /admin/posts/id]', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!authAdmin(req)) return Response.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const res = await db.query('DELETE FROM posts WHERE id = $1 RETURNING id', [params.id])
    if (res.rows.length === 0) return Response.json({ error: 'Post not found' }, { status: 404 })
    return Response.json({ message: 'Post deleted' })
  } catch (err) {
    console.error('[DELETE /admin/posts/id]', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
