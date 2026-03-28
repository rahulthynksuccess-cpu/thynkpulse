export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
    + '-' + Date.now().toString(36)
}

/* GET /api/posts */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status   = searchParams.get('status')   || 'approved'
    const category = searchParams.get('category')
    const authorId = searchParams.get('authorId')
    const limit    = Math.min(50, Number(searchParams.get('limit')  || 20))
    const page     = Math.max(1,  Number(searchParams.get('page')   || 1))
    const offset   = (page - 1) * limit

    const conditions: string[] = ['p.status = $1']
    const params: unknown[]    = [status]
    let idx = 2

    if (category) { conditions.push(`p.category = $${idx++}`); params.push(category) }
    if (authorId) { conditions.push(`p.author_id = $${idx++}`); params.push(authorId) }

    const where = conditions.join(' AND ')

    const [postsRes, countRes] = await Promise.all([
      db.query(
        `SELECT p.*, up.full_name, up.designation, up.company_name, up.institute_name, up.avatar_url
         FROM posts p
         LEFT JOIN user_profiles up ON up.user_id = p.author_id
         WHERE ${where}
         ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
         LIMIT $${idx} OFFSET $${idx + 1}`,
        [...params, limit, offset]
      ),
      db.query(`SELECT COUNT(*) FROM posts p WHERE ${where}`, params),
    ])

    const posts = postsRes.rows.map(r => ({
      id: r.id, slug: r.slug, title: r.title, excerpt: r.excerpt,
      content: r.content, coverEmoji: r.cover_emoji, category: r.category,
      tags: r.tags || [], status: r.status, isFeatured: r.is_featured,
      readTime: r.read_time, viewCount: r.view_count, likeCount: r.like_count,
      commentCount: r.comment_count, authorId: r.author_id,
      publishedAt: r.published_at, createdAt: r.created_at,
      author: { fullName: r.full_name, designation: r.designation, companyName: r.company_name, instituteName: r.institute_name, avatarUrl: r.avatar_url },
    }))

    return Response.json({ data: posts, total: Number(countRes.rows[0].count), page, limit })
  } catch (err) {
    console.error('[GET /posts]', err)
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

/* POST /api/posts */
export async function POST(req: NextRequest) {
  // Check profile complete before allowing post creation
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return Response.json({ error: 'Invalid token' }, { status: 401 })
  const profileCheck = await db.query('SELECT profile_completed FROM user_profiles WHERE user_id=$1', [payload.userId])
  if (!profileCheck.rows[0]?.profile_completed) {
    return Response.json({ error: 'Complete your profile before publishing posts.', code: 'PROFILE_INCOMPLETE' }, { status: 403 })
  }
  // Re-verify token for the rest of handler

  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return Response.json({ error: 'Invalid token' }, { status: 401 })

  try {
    const { title, excerpt, content, category, tags, coverEmoji, status } = await req.json()
    if (!title?.trim()) return Response.json({ error: 'Title is required' }, { status: 400 })
    if (!content?.trim()) return Response.json({ error: 'Content is required' }, { status: 400 })

    const wordCount = content.trim().split(/\s+/).length
    const readTime  = Math.max(1, Math.ceil(wordCount / 200))
    const slug      = slugify(title)
    const postStatus = status === 'pending' ? 'pending' : 'draft'

    const res = await db.query(
      `INSERT INTO posts
       (slug, title, excerpt, content, cover_emoji, category, tags, status,
        is_featured, read_time, view_count, like_count, comment_count, author_id,
        published_at, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,false,$9,0,0,0,$10,
               ${postStatus === 'pending' ? 'NOW()' : 'NULL'},NOW(),NOW())
       RETURNING *`,
      [slug, title, excerpt||null, content, coverEmoji||'📝', category||'Other',
       JSON.stringify(tags||[]), postStatus, readTime, payload.userId]
    )

    return Response.json({ data: res.rows[0] }, { status: 201 })
  } catch (err) {
    console.error('[POST /posts]', err)
    return Response.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
