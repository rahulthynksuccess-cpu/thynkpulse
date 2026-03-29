export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { hashPassword, signToken } from '@/lib/auth'
import { logActivity, getClientIP } from '@/lib/activity'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, phone, password, role, fullName, gender, designation,
            instituteName, companyName, contactNumber, emailId, totalExp, introduction } = body

    if (!password || password.length < 8)
      return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    if (!email && !phone)
      return Response.json({ error: 'Email or phone is required' }, { status: 400 })
    if (!['educator', 'edtech_pro', 'other'].includes(role))
      return Response.json({ error: 'Invalid role' }, { status: 400 })

    const existing = await db.query(
      'SELECT id FROM users WHERE email=$1 OR phone=$2',
      [email || null, phone || null]
    )
    if (existing.rows.length > 0)
      return Response.json({ error: 'An account with this email or phone already exists' }, { status: 409 })

    const ip = getClientIP(req as any)
    const ua = req.headers.get('user-agent') || undefined
    const passwordHash = await hashPassword(password)

    const userRes = await db.query(
      `INSERT INTO users (email, phone, password_hash, role, is_active, is_verified, last_ip, created_at, updated_at)
       VALUES ($1,$2,$3,$4,true,false,$5,NOW(),NOW()) RETURNING id, email, phone, role`,
      [email || null, phone || null, passwordHash, role, ip]
    )
    const user = userRes.rows[0]

    await db.query(
      `INSERT INTO user_profiles
       (user_id, full_name, gender, designation, institute_name, company_name,
        contact_number, email_id, total_exp, introduction,
        post_count, follower_count, following_count, total_reads)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,0,0,0,0)`,
      [user.id, fullName, gender||null, designation||null, instituteName||null,
       companyName||null, contactNumber||null, emailId||null, totalExp||null, introduction||null]
    )

    // Log registration
    await logActivity(user.id, 'register', `New account — role: ${role}`, ip, ua)

    const profileRes = await db.query('SELECT * FROM user_profiles WHERE user_id=$1', [user.id])
    const profile = profileRes.rows[0]
    const token = signToken({ userId: user.id, role: user.role })

    return Response.json({
      user: { ...user, profile: { ...profile, fullName: profile.full_name } },
      token,
      message: 'Account created successfully',
    }, { status: 201 })

  } catch (err: any) {
    console.error('[register]', err)
    return Response.json({ error: 'Registration failed' }, { status: 500 })
  }
}
