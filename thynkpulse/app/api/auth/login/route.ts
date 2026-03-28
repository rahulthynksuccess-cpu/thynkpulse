export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { verifyPassword, signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json()
    if (!identifier || !password)
      return Response.json({ error: 'Credentials required' }, { status: 400 })

    const userRes = await db.query(
      `SELECT u.*, p.full_name, p.designation, p.company_name, p.institute_name,
              p.introduction, p.avatar_url, p.post_count, p.follower_count,
              p.following_count, p.total_reads, p.profile_completed
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE u.email=$1 OR u.phone=$1`,
      [identifier]
    )

    if (userRes.rows.length === 0)
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })

    const row = userRes.rows[0]

    if (!row.is_active)
      return Response.json({ error: 'Your account has been deactivated. Contact support.' }, { status: 403 })

    const valid = await verifyPassword(password, row.password_hash)
    if (!valid)
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ userId: row.id, role: row.role })

    return Response.json({
      user: {
        id: row.id, email: row.email, phone: row.phone, role: row.role,
        isActive: row.is_active, isVerified: row.is_verified,
        createdAt: row.created_at,
        profile: {
          userId: row.id, fullName: row.full_name, designation: row.designation,
          companyName: row.company_name, instituteName: row.institute_name,
          introduction: row.introduction, avatarUrl: row.avatar_url,
          postCount: row.post_count, followerCount: row.follower_count,
          followingCount: row.following_count, totalReads: row.total_reads,
          profileCompleted: row.profile_completed,
        },
      },
      token,
    })

  } catch (err) {
    console.error('[login]', err)
    return Response.json({ error: 'Login failed' }, { status: 500 })
  }
}
