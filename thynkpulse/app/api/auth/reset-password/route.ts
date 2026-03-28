export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token) return Response.json({ error: 'Reset token required' }, { status: 400 })
    if (!password || password.length < 8)
      return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 })

    // Validate token
    const tokenRes = await db.query(
      `SELECT t.id, t.user_id, t.expires_at, t.used
       FROM password_reset_tokens t
       WHERE t.token = $1`,
      [token]
    )

    if (tokenRes.rows.length === 0)
      return Response.json({ error: 'Invalid or expired reset link. Please request a new one.' }, { status: 400 })

    const row = tokenRes.rows[0]

    if (row.used)
      return Response.json({ error: 'This reset link has already been used. Please request a new one.' }, { status: 400 })

    if (new Date(row.expires_at) < new Date())
      return Response.json({ error: 'This reset link has expired. Please request a new one.' }, { status: 400 })

    // Update password
    const passwordHash = await hashPassword(password)
    await db.query('UPDATE users SET password_hash=$1, updated_at=NOW() WHERE id=$2', [passwordHash, row.user_id])

    // Mark token as used
    await db.query('UPDATE password_reset_tokens SET used=true WHERE id=$1', [row.id])

    return Response.json({ message: 'Password updated successfully. You can now log in.' })

  } catch (err) {
    console.error('[reset-password]', err)
    return Response.json({ error: 'Reset failed' }, { status: 500 })
  }
}

// Validate token without resetting (used on page load to verify link)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) return Response.json({ valid: false })

  try {
    const res = await db.query(
      `SELECT id, expires_at, used FROM password_reset_tokens WHERE token=$1`,
      [token]
    )
    if (!res.rows.length) return Response.json({ valid: false, error: 'Invalid link' })
    const row = res.rows[0]
    if (row.used) return Response.json({ valid: false, error: 'Already used' })
    if (new Date(row.expires_at) < new Date()) return Response.json({ valid: false, error: 'Expired' })
    return Response.json({ valid: true })
  } catch {
    return Response.json({ valid: false })
  }
}
