// lib/adminAuth.ts
// Replaces all inline role checks across admin routes.
// Properly distinguishes 401 (invalid token) from 403 (wrong role).

import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

export type AdminCheckOk = { ok: true; userId: string; payload: Record<string, unknown> }
export type AdminCheck   = AdminCheckOk | Response

export async function requireAdmin(req: NextRequest): Promise<AdminCheck> {
  // ── Step 1: extract token ─────────────────────────────────────────
  const raw   = req.headers.get('authorization') || ''
  const token = getTokenFromHeader(raw) || req.cookies.get('tp_token')?.value || null

  if (!token) {
    return Response.json(
      { error: 'Not logged in — please sign in at /login' },
      { status: 401 }
    )
  }

  // ── Step 2: verify JWT signature ──────────────────────────────────
  const payload = verifyToken(token)

  if (!payload) {
    // Token is present but invalid — decode raw to give helpful message
    let expiredAt = ''
    try {
      const raw64  = token.split('.')[1]
      const decoded = JSON.parse(Buffer.from(raw64, 'base64url').toString())
      if (decoded.exp) expiredAt = ` (expired ${new Date(decoded.exp * 1000).toLocaleString()})`
    } catch {}

    return Response.json(
      {
        error: `Session expired${expiredAt} — please log out and sign in again.`,
        action: 'RELOGIN',
      },
      { status: 401 }
    )
  }

  // ── Step 3: get userId ────────────────────────────────────────────
  const userId = (payload.userId || payload.id) as string
  if (!userId) {
    return Response.json(
      { error: 'Malformed token — please log out and sign in again.', action: 'RELOGIN' },
      { status: 401 }
    )
  }

  // ── Step 4: check CURRENT role from DB (not stale JWT claim) ─────
  // This is the root fix: even if the token has an old role, we check
  // what the database says right now.
  try {
    const res = await db.query(
      'SELECT role, is_active, email FROM users WHERE id = $1',
      [userId]
    )

    if (!res.rows.length) {
      return Response.json(
        { error: 'Account not found — please contact support.', action: 'RELOGIN' },
        { status: 401 }
      )
    }

    const { role, is_active, email } = res.rows[0]

    if (!is_active) {
      return Response.json(
        { error: 'Your account is deactivated.', action: 'CONTACT_SUPPORT' },
        { status: 403 }
      )
    }

    if (role !== 'admin') {
      return Response.json(
        {
          error: `Your account role is "${role}", not "admin". To fix, run this SQL in your Neon console then log out and back in:\n\nUPDATE users SET role = 'admin' WHERE id = '${userId}';`,
          action: 'FIX_ROLE',
          userId,
          currentRole: role,
        },
        { status: 403 }
      )
    }

    return { ok: true, userId, payload }

  } catch (dbErr: any) {
    console.error('[requireAdmin] DB error:', dbErr)

    // Fallback to JWT claim if DB is unreachable — avoids lockout during outages
    if (payload.role === 'admin') {
      return { ok: true, userId, payload }
    }

    return Response.json(
      { error: `DB check failed: ${dbErr.message}`, action: 'RETRY' },
      { status: 500 }
    )
  }
}

export function isAdminError(result: AdminCheck): result is Response {
  return result instanceof Response
}
