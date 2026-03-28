export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'
import { logActivity } from '@/lib/activity'

async function resolveUserId(username: string): Promise<string | null> {
  const res = await db.query(
    'SELECT id FROM users WHERE email=$1 OR phone=$1 OR id::text=$1',
    [decodeURIComponent(username)]
  )
  return res.rows[0]?.id || null
}

/* POST /api/users/:username/follow — follow or unfollow */
export async function POST(req: NextRequest, { params }: { params: { username: string } }) {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return Response.json({ error: 'Login to follow writers' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return Response.json({ error: 'Invalid token' }, { status: 401 })

  const targetId = await resolveUserId(params.username)
  if (!targetId) return Response.json({ error: 'User not found' }, { status: 404 })

  if (targetId === payload.userId)
    return Response.json({ error: 'You cannot follow yourself' }, { status: 400 })

  try {
    // Check if already following
    const existing = await db.query(
      'SELECT id FROM user_follows WHERE follower_id=$1 AND following_id=$2',
      [payload.userId, targetId]
    )

    if (existing.rows.length > 0) {
      // Unfollow
      await db.query(
        'DELETE FROM user_follows WHERE follower_id=$1 AND following_id=$2',
        [payload.userId, targetId]
      )
      // Decrement counts
      await db.query('UPDATE user_profiles SET follower_count = GREATEST(0, follower_count - 1) WHERE user_id=$1', [targetId])
      await db.query('UPDATE user_profiles SET following_count = GREATEST(0, following_count - 1) WHERE user_id=$1', [payload.userId])

      return Response.json({ following: false, message: 'Unfollowed' })
    } else {
      // Follow
      await db.query(
        'INSERT INTO user_follows (follower_id, following_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
        [payload.userId, targetId]
      )
      // Increment counts
      await db.query('UPDATE user_profiles SET follower_count = follower_count + 1 WHERE user_id=$1', [targetId])
      await db.query('UPDATE user_profiles SET following_count = following_count + 1 WHERE user_id=$1', [payload.userId])

      await logActivity(payload.userId as string, 'followed_user', `Followed user ${params.username}`)

      return Response.json({ following: true, message: 'Following' })
    }
  } catch (err) {
    console.error('[follow]', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}

/* GET /api/users/:username/follow — check if current user follows this person */
export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return Response.json({ following: false })
  const payload = verifyToken(token)
  if (!payload) return Response.json({ following: false })

  const targetId = await resolveUserId(params.username)
  if (!targetId) return Response.json({ following: false })

  try {
    const res = await db.query(
      'SELECT id FROM user_follows WHERE follower_id=$1 AND following_id=$2',
      [payload.userId, targetId]
    )
    return Response.json({ following: res.rows.length > 0 })
  } catch {
    return Response.json({ following: false })
  }
}
