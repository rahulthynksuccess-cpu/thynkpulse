export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: { username: string } }) {
  try {
    const identifier = decodeURIComponent(params.username)
    const res = await db.query(
      `SELECT u.id, u.email, u.phone, u.role, u.is_verified,
              p.full_name, p.gender, p.designation, p.institute_name, p.company_name,
              p.contact_number, p.email_id, p.total_exp, p.introduction,
              p.avatar_url, p.linkedin_url, p.website_url,
              p.post_count, p.follower_count, p.following_count, p.total_reads,
              p.profile_completed
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE u.email=$1 OR u.phone=$1 OR u.id::text=$1`,
      [identifier]
    )
    if (!res.rows.length) return Response.json({ error: 'User not found' }, { status: 404 })
    const r = res.rows[0]
    // Return flat UserProfile shape the page expects
    return Response.json({
      id:              r.id,
      userId:          r.id,
      email:           r.email,
      phone:           r.phone,
      role:            r.role,
      isVerified:      r.is_verified,
      fullName:        r.full_name  || '',
      gender:          r.gender,
      designation:     r.designation,
      instituteName:   r.institute_name,
      companyName:     r.company_name,
      contactNumber:   r.contact_number,
      emailId:         r.email_id,
      totalExp:        r.total_exp,
      introduction:    r.introduction,
      avatarUrl:       r.avatar_url,
      linkedinUrl:     r.linkedin_url,
      websiteUrl:      r.website_url,
      postCount:       r.post_count       || 0,
      followerCount:   r.follower_count   || 0,
      followingCount:  r.following_count  || 0,
      totalReads:      r.total_reads      || 0,
      profileCompleted: r.profile_completed || false,
    })
  } catch (err) {
    console.error('[GET /users/profile]', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { username: string } }) {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return Response.json({ error: 'Invalid token' }, { status: 401 })

  try {
    const { fullName, gender, designation, instituteName, companyName,
            contactNumber, emailId, totalExp, introduction,
            avatarUrl, linkedinUrl, websiteUrl, profileCompleted } = await req.json()

    const isComplete = profileCompleted === true ||
      !!(fullName && designation && (instituteName || companyName) && introduction)

    await db.query(
      `INSERT INTO user_profiles
         (user_id, full_name, gender, designation, institute_name, company_name,
          contact_number, email_id, total_exp, introduction, avatar_url,
          linkedin_url, website_url, profile_completed,
          post_count, follower_count, following_count, total_reads)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,0,0,0,0)
       ON CONFLICT (user_id) DO UPDATE SET
         full_name        = COALESCE(NULLIF($2,''),  user_profiles.full_name),
         gender           = COALESCE($3,             user_profiles.gender),
         designation      = COALESCE(NULLIF($4,''),  user_profiles.designation),
         institute_name   = COALESCE(NULLIF($5,''),  user_profiles.institute_name),
         company_name     = COALESCE(NULLIF($6,''),  user_profiles.company_name),
         contact_number   = COALESCE(NULLIF($7,''),  user_profiles.contact_number),
         email_id         = COALESCE(NULLIF($8,''),  user_profiles.email_id),
         total_exp        = COALESCE(NULLIF($9,''),  user_profiles.total_exp),
         introduction     = COALESCE(NULLIF($10,''), user_profiles.introduction),
         avatar_url       = COALESCE(NULLIF($11,''), user_profiles.avatar_url),
         linkedin_url     = COALESCE(NULLIF($12,''), user_profiles.linkedin_url),
         website_url      = COALESCE(NULLIF($13,''), user_profiles.website_url),
         profile_completed = $14`,
      [payload.userId, fullName||null, gender||null, designation||null,
       instituteName||null, companyName||null, contactNumber||null, emailId||null,
       totalExp||null, introduction||null, avatarUrl||null, linkedinUrl||null,
       websiteUrl||null, isComplete]
    )

    const updated = await db.query('SELECT * FROM user_profiles WHERE user_id=$1', [payload.userId])
    const p = updated.rows[0]
    return Response.json({
      fullName: p.full_name, designation: p.designation,
      instituteName: p.institute_name, companyName: p.company_name,
      introduction: p.introduction, avatarUrl: p.avatar_url,
      linkedinUrl: p.linkedin_url, profileCompleted: p.profile_completed,
    })
  } catch (err) {
    console.error('[PUT /users/profile]', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
