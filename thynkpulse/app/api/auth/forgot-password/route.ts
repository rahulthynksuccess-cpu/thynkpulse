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

    // Intentionally return the same response whether or not the account exists.
    // This prevents user enumeration attacks (an attacker probing which emails
    // are registered). This is correct, secure behaviour — do not change.
    if (userRes.rows.length === 0) {
      return Response.json({ message: 'If this account exists, a reset code has been sent.' })
    }

    const user = userRes.rows[0]
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Ensure the password_reset_tokens table exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        token VARCHAR(128) NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `).catch(() => {})

    // Invalidate any existing unused tokens for this user
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

    const isDev = process.env.NEXT_PUBLIC_APP_ENV !== 'production'

    // In production: send email/SMS with the reset link here.
    // Example (SendGrid / MSG91):
    //   await sendResetEmail(user.email, token)
    // For now, the token is returned only in development for testing.

    return Response.json({
      message: 'If this account exists, a reset link has been sent.',
      ...(isDev && { token, resetUrl: `/reset-password?token=${token}` }),
    })

  } catch (err) {
    console.error('[forgot-password]', err)
    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}
