import db from './db'

export async function logActivity(
  userId: string,
  action: string,
  detail?: string,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await db.query(
      `INSERT INTO user_activity_logs (user_id, action, detail, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, action, detail || null, ipAddress || null, userAgent || null]
    )
  } catch (err) {
    // Never let logging break the main flow
    console.error('[activity log]', err)
  }
}

export function getClientIP(req: Request): string {
  // Check common proxy headers in order of trust
  const headers = req as any
  const forwarded = headers.headers?.get?.('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIp = headers.headers?.get?.('x-real-ip')
  if (realIp) return realIp.trim()
  const cfIp = headers.headers?.get?.('cf-connecting-ip') // Cloudflare
  if (cfIp) return cfIp.trim()
  return 'unknown'
}
