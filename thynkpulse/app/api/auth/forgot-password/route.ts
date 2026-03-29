export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import crypto from 'crypto'
import db from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json()
    if (!identifier) return Response.json({ error: 'Email or phone required' }, { status: 400 })

    const userRes = await db.query(
      'SELECT id, email, phone FROM users WHERE email=$1 OR phone=$1',
      [identifier]
    )

    // Always return success to prevent user enumeration
    if (userRes.rows.length === 0) {
      return Response.json({ message: 'If this account exists, a reset code has been sent.' })
    }

    const user = userRes.rows[0]
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Invalidate any existing tokens
    await db.query(
      "UPDATE password_reset_tokens SET used=true WHERE user_id=$1 AND used=false",
      [user.id]
    )

    // Save new token
    await db.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, token, expiresAt]
    )

    // In production you'd send an email/SMS here
    // For now we return the token in dev mode so admin can test
    const isDev = process.env.NEXT_PUBLIC_APP_ENV !== 'production'

    return Response.json({
      message: 'If this account exists, a reset link has been sent.',
      // Only expose token in development
      ...(isDev && { token, resetUrl: `/reset-password?token=${token}` }),
    })

  } catch (err) {
    console.error('[forgot-password]', err)
    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}
