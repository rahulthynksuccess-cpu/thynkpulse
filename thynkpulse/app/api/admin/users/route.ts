export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

function adminGuard(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return null
  const p = verifyToken(token)
  return p?.role === 'admin' ? p : null
}

export async function GET(req: NextRequest) {
  if (!adminGuard(req)) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const role     = searchParams.get('role')
  const isActive = searchParams.get('isActive')
  const search   = searchParams.get('search') || ''
  const limit    = Math.min(50, Number(searchParams.get('limit') || 20))
  const page     = Math.max(1, Number(searchParams.get('page') || 1))
  const offset   = (page - 1) * limit

  const conditions = ["u.role != 'admin'"]
  const params: unknown[] = []
  let idx = 1

  if (role)     { conditions.push(`u.role = $${idx++}`);     params.push(role) }
  if (isActive === 'false') { conditions.push(`u.is_active = $${idx++}`); params.push(false) }
  if (search)   {
    conditions.push(`(up.full_name ILIKE $${idx} OR u.email ILIKE $${idx} OR u.phone ILIKE $${idx} OR up.company_name ILIKE $${idx} OR up.institute_name ILIKE $${idx})`)
    params.push(`%${search}%`)
    idx++
  }

  const where = conditions.join(' AND ')

  try {
    const [rows, countRes] = await Promise.all([
      db.query(
        `SELECT u.id, u.email, u.phone, u.role, u.is_active, u.is_verified,
                u.created_at, u.last_login_at, u.last_ip,
                up.full_name, up.designation, up.company_name, up.institute_name,
                up.contact_number, up.total_exp, up.linkedin_url,
                up.location, up.interests,
                up.post_count, up.profile_completed, up.avatar_url
         FROM users u LEFT JOIN user_profiles up ON up.user_id = u.id
         WHERE ${where}
         ORDER BY u.created_at DESC LIMIT $${idx} OFFSET $${idx+1}`,
        [...params, limit, offset]
      ),
      db.query(
        `SELECT COUNT(*) FROM users u LEFT JOIN user_profiles up ON up.user_id = u.id WHERE ${where}`,
        params
      ),
    ])

    return Response.json({
      data: rows.rows.map(r => ({
        id: r.id, email: r.email, phone: r.phone, role: r.role,
        isActive: r.is_active, isVerified: r.is_verified,
        createdAt: r.created_at, lastLoginAt: r.last_login_at,
        fullName: r.full_name, designation: r.designation,
        companyName: r.company_name, instituteName: r.institute_name,
        contactNumber: r.contact_number, totalExp: r.total_exp,
        linkedinUrl: r.linkedin_url, location: r.location,
        interests: r.interests, postCount: r.post_count,
        profileCompleted: r.profile_completed, avatarUrl: r.avatar_url,
      })),
      total: Number(countRes.rows[0].count), page, limit,
    })
  } catch (err) {
    console.error('[GET /admin/users]', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
