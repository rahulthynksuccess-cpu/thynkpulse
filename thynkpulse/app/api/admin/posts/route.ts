export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'pending'
  const search = searchParams.get('search') || ''
  const limit  = Math.min(100, Number(searchParams.get('limit') || 50))
  const page   = Math.max(1, Number(searchParams.get('page') || 1))
  const offset = (page - 1) * limit

  try {
    const [rows, countRes] = await Promise.all([
      db.query(
        `SELECT p.*, up.full_name, up.designation
         FROM posts p
         LEFT JOIN user_profiles up ON up.user_id = p.author_id
         WHERE p.status = $1
         ${search ? "AND (p.title ILIKE $4 OR p.category ILIKE $4 OR up.full_name ILIKE $4)" : ""}
         ORDER BY p.created_at DESC LIMIT $2 OFFSET $3`,
        search ? [status, limit, offset, `%${search}%`] : [status, limit, offset]
      ),
      db.query(
        `SELECT COUNT(*) FROM posts p LEFT JOIN user_profiles up ON up.user_id = p.author_id
         WHERE p.status = $1 ${search ? "AND (p.title ILIKE $2 OR p.category ILIKE $2 OR up.full_name ILIKE $2)" : ""}`,
        search ? [status, `%${search}%`] : [status]
      ),
    ])

    return Response.json({
      data: rows.rows.map(r => ({
        id:r.id, slug:r.slug, title:r.title, excerpt:r.excerpt,
        content:r.content, coverEmoji:r.cover_emoji, category:r.category,
        tags:r.tags||[], status:r.status, readTime:r.read_time,
        isFeatured:r.is_featured, authorId:r.author_id,
        createdAt:r.created_at, publishedAt:r.published_at,
        author:{ fullName:r.full_name, designation:r.designation },
      })),
      total: Number(countRes.rows[0].count), page, limit,
    })
  } catch (err) {
    console.error('[GET /admin/posts]', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
