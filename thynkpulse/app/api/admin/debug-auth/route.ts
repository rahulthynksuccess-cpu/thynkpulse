// app/api/admin/debug-auth/route.ts
// Visit /api/admin/debug-auth in browser while logged in to see EXACTLY what
// is in your token and what the database says your role is.
// DELETE this file after the issue is resolved.

export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'
import { config } from '@/lib/config'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = getTokenFromHeader(authHeader)

  // Also read from cookie as fallback
  const cookieToken = req.cookies.get('tp_token')?.value

  const activeToken = token || cookieToken || null

  if (!activeToken) {
    return Response.json({
      status: 'NO_TOKEN',
      fix: 'You are not logged in. Go to /login and sign in as admin.',
      authHeader: authHeader || '(empty)',
      hasCookie: !!cookieToken,
    })
  }

  // Decode without verifying (to see what's inside even if secret is wrong)
  let decodedRaw: any = null
  try {
    const parts = activeToken.split('.')
    if (parts.length === 3) {
      decodedRaw = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
    }
  } catch {}

  // Verify with current secret
  const payload = verifyToken(activeToken)
  const secretInUse = config.auth.secret === 'change-this-in-production'
    ? 'DEFAULT (JWT_SECRET env var NOT set on Vercel)'
    : 'CUSTOM (JWT_SECRET env var IS set on Vercel)'

  // Check DB role
  let dbRole = null
  let dbActive = null
  let dbUserId = null
  if (payload || decodedRaw) {
    const uid = payload?.userId || decodedRaw?.userId
    if (uid) {
      try {
        const res = await db.query('SELECT id, role, is_active, email FROM users WHERE id = $1', [uid])
        if (res.rows[0]) {
          dbRole   = res.rows[0].role
          dbActive = res.rows[0].is_active
          dbUserId = res.rows[0].id
        }
      } catch (e: any) {
        dbRole = `DB_ERROR: ${e.message}`
      }
    }
  }

  const tokenValid  = !!payload
  const roleInToken = payload?.role || decodedRaw?.role || 'UNKNOWN'
  const roleInDB    = dbRole

  // Diagnosis
  let diagnosis = ''
  let fix = ''

  if (!tokenValid && decodedRaw) {
    diagnosis = 'TOKEN_INVALID — JWT signature verification failed. Secret mismatch.'
    fix = `Your token was signed with a DIFFERENT JWT_SECRET than the one active now.
ACTION: Log out at /login, then log back in to get a fresh token signed with the current secret.
If this keeps happening after re-login, check your Vercel environment variables and make sure JWT_SECRET is set to a fixed value (not a rotating/random one).`
  } else if (tokenValid && roleInToken !== 'admin') {
    diagnosis = `WRONG_ROLE — Token is valid but role is "${roleInToken}", not "admin".`
    fix = `Run this SQL in your Neon/Postgres console, then log out and back in:
UPDATE users SET role = 'admin' WHERE id = '${dbUserId}';`
  } else if (tokenValid && roleInDB !== 'admin') {
    diagnosis = `DB_ROLE_MISMATCH — Token has role "admin" but DB has role "${roleInDB}".`
    fix = `Run this SQL in your Neon/Postgres console:
UPDATE users SET role = 'admin' WHERE id = '${dbUserId}';
Then log out and back in.`
  } else if (tokenValid && roleInToken === 'admin' && roleInDB === 'admin') {
    diagnosis = 'ALL_OK — Token valid, role is admin in both token and DB. Save should work.'
    fix = 'If saves are still failing, check the browser console for the actual HTTP error and paste it here.'
  } else {
    diagnosis = 'UNKNOWN'
    fix = 'Paste the full output of this page in your support request.'
  }

  return Response.json({
    diagnosis,
    fix,
    token: {
      present:    !!activeToken,
      source:     token ? 'Authorization header' : 'Cookie',
      valid:      tokenValid,
      roleInToken,
      expiresAt:  decodedRaw?.exp ? new Date(decodedRaw.exp * 1000).toISOString() : 'unknown',
      issuedAt:   decodedRaw?.iat ? new Date(decodedRaw.iat * 1000).toISOString() : 'unknown',
      userId:     decodedRaw?.userId || 'unknown',
    },
    database: {
      userId:     dbUserId,
      roleInDB,
      isActive:   dbActive,
    },
    server: {
      jwtSecretStatus: secretInUse,
      nodeEnv: process.env.NODE_ENV,
    },
  }, {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
}
