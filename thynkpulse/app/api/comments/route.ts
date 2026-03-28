import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('postId')
  if (!postId) return Response.json({ error: 'postId required' }, { status: 400 })

  try {
    const res = await db.query(
      `SELECT c.*, up.full_name, up.designation, up.avatar_url
       FROM comments c
       LEFT JOIN user_profiles up ON up.user_id = c.author_id
       WHERE c.post_id = $1 AND c.parent_id IS NULL
       ORDER BY c.created_at ASC`,
      [postId]
    )
    const repliesRes = await db.query(
      `SELECT c.*, up.full_name, up.designation, up.avatar_url
       FROM comments c
       LEFT JOIN user_profiles up ON up.user_id = c.author_id
       WHERE c.post_id = $1 AND c.parent_id IS NOT NULL
       ORDER BY c.created_at ASC`,
      [postId]
    )

    const mapComment = (r: any) => ({
      id: r.id, postId: r.post_id, authorId: r.author_id, parentId: r.parent_id,
      content: r.content, likeCount: r.like_count, createdAt: r.created_at,
      author: { fullName: r.full_name, designation: r.designation, avatarUrl: r.avatar_url },
    })

    const comments = res.rows.map(mapComment)
    const replies  = repliesRes.rows.map(mapComment)

    // Nest replies under parents
    comments.forEach((c: any) => {
      c.replies = replies.filter((r: any) => r.parentId === c.id)
    })

    return Response.json(comments)
  } catch (err) {
    console.error('[GET /comments]', err)
    return Response.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return Response.json({ error: 'Invalid token' }, { status: 401 })

  try {
    const { postId, content, parentId } = await req.json()
    if (!postId || !content?.trim())
      return Response.json({ error: 'postId and content required' }, { status: 400 })

    const res = await db.query(
      `INSERT INTO comments (post_id, author_id, parent_id, content, like_count, created_at)
       VALUES ($1,$2,$3,$4,0,NOW()) RETURNING *`,
      [postId, payload.userId, parentId || null, content]
    )

    // Increment comment count
    await db.query('UPDATE posts SET comment_count = comment_count + 1 WHERE id = $1', [postId])

    const profileRes = await db.query('SELECT * FROM user_profiles WHERE user_id=$1', [payload.userId])
    const p = profileRes.rows[0]
    const c = res.rows[0]

    return Response.json({
      id: c.id, postId: c.post_id, authorId: c.author_id, parentId: c.parent_id,
      content: c.content, likeCount: c.like_count, createdAt: c.created_at,
      replies: [],
      author: { fullName: p?.full_name, designation: p?.designation, avatarUrl: p?.avatar_url },
    }, { status: 201 })
  } catch (err) {
    console.error('[POST /comments]', err)
    return Response.json({ error: 'Failed to post comment' }, { status: 500 })
  }
}
