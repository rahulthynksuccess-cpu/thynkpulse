export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const [users, posts, pending, views, recentUsers, pendingPosts] = await Promise.all([
      db.query('SELECT COUNT(*) FROM users WHERE role != $1', ['admin']),
      db.query("SELECT COUNT(*) FROM posts WHERE status = 'approved'"),
      db.query("SELECT COUNT(*) FROM posts WHERE status = 'pending'"),
      db.query('SELECT COALESCE(SUM(view_count),0) FROM posts'),
      db.query(`SELECT u.id, up.full_name, u.role, up.designation, u.created_at
                FROM users u LEFT JOIN user_profiles up ON up.user_id = u.id
                WHERE u.role != 'admin'
                ORDER BY u.created_at DESC LIMIT 8`),
      db.query(`SELECT p.id, p.title, p.cover_emoji, p.category,
                       up.full_name as author_name
                FROM posts p LEFT JOIN user_profiles up ON up.user_id = p.author_id
                WHERE p.status = 'pending'
                ORDER BY p.created_at DESC LIMIT 5`),
    ])

    return Response.json({
      totalUsers:      Number(users.rows[0].count),
      totalPosts:      Number(posts.rows[0].count),
      pendingPosts:    Number(pending.rows[0].count),
      totalViews:      Number(views.rows[0].coalesce),
      recentUsers:     recentUsers.rows.map(r => ({ id:r.id, fullName:r.full_name, role:r.role, designation:r.designation })),
      pendingPostsList: pendingPosts.rows.map(r => ({ id:r.id, title:r.title, coverEmoji:r.cover_emoji, category:r.category, authorName:r.author_name })),
    })
  } catch (err) {
    console.error('[GET /admin/overview]', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
