export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Math.min(10, Number(searchParams.get('limit') || 6))

    const res = await db.query(
      `SELECT u.id, u.email, u.phone, u.role,
              p.full_name, p.designation, p.company_name, p.institute_name,
              p.avatar_url, p.post_count, p.follower_count, p.total_reads
       FROM users u
       JOIN user_profiles p ON p.user_id = u.id
       WHERE u.is_active = true
         AND u.role != 'admin'
         AND p.profile_completed = true
         AND p.post_count > 0
       ORDER BY p.follower_count DESC, p.post_count DESC
       LIMIT $1`,
      [limit]
    )

    const writers = res.rows.map(r => ({
      id: r.id,
      username: r.email || r.phone || r.id,
      fullName: r.full_name || 'Community Member',
      designation: r.designation || '',
      organisation: r.company_name || r.institute_name || '',
      avatarUrl: r.avatar_url || null,
      postCount: r.post_count || 0,
      followerCount: r.follower_count || 0,
      totalReads: r.total_reads || 0,
    }))

    return Response.json({ writers })
  } catch (err) {
    console.error('[top-writers]', err)
    return Response.json({ writers: [] })
  }
}
