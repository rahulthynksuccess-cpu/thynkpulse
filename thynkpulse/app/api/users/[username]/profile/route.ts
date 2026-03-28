export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: { username: string } }) {
  try {
    // username can be userId or slug (fullName-based)
    const res = await db.query(
      `SELECT up.*, u.role, u.is_verified, u.created_at as joined_at
       FROM user_profiles up
       JOIN users u ON u.id = up.user_id
       WHERE up.user_id = $1 OR LOWER(REPLACE(up.full_name,' ','-')) = LOWER($1)`,
      [params.username]
    )
    if (res.rows.length === 0)
      return Response.json({ error: 'Profile not found' }, { status: 404 })

    const p = res.rows[0]
    return Response.json({
      id: p.id, userId: p.user_id, fullName: p.full_name,
      gender: p.gender, designation: p.designation,
      instituteName: p.institute_name, companyName: p.company_name,
      contactNumber: p.contact_number, emailId: p.email_id,
      totalExp: p.total_exp, introduction: p.introduction,
      avatarUrl: p.avatar_url, linkedinUrl: p.linkedin_url, websiteUrl: p.website_url,
      postCount: p.post_count, followerCount: p.follower_count,
      followingCount: p.following_count, totalReads: p.total_reads,
      role: p.role, isVerified: p.is_verified, joinedAt: p.joined_at,
    })
  } catch (err) {
    console.error('[GET /users/profile]', err)
    return Response.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { username: string } }) {
  try {
    const body = await req.json()
    const { fullName, designation, instituteName, companyName, introduction, linkedinUrl, websiteUrl } = body

    const res = await db.query(
      `UPDATE user_profiles SET
         full_name=$1, designation=$2, institute_name=$3, company_name=$4,
         introduction=$5, linkedin_url=$6, website_url=$7
       WHERE user_id=$8 RETURNING *`,
      [fullName, designation, instituteName||null, companyName||null,
       introduction||null, linkedinUrl||null, websiteUrl||null, params.username]
    )
    if (res.rows.length === 0)
      return Response.json({ error: 'Profile not found' }, { status: 404 })

    const p = res.rows[0]
    return Response.json({ fullName: p.full_name, designation: p.designation, introduction: p.introduction })
  } catch (err) {
    console.error('[PUT /users/profile]', err)
    return Response.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
