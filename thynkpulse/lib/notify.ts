/**
 * lib/notify.ts  (ThynkPulse)
 * In-app notification helper — call after key events to push notifications
 * to users. Non-throwing: a notification failure never breaks the main flow.
 *
 * Events covered:
 *  - Post approved / rejected by admin
 *  - New follower
 *  - New comment on a post
 *  - New like on a post
 *  - Admin broadcast to all / writers / educators
 */

import db from './db'

// ── Low-level insert ──────────────────────────────────────────────────────────
async function create(
  userId: string | null,
  audience: 'user' | 'writers' | 'educators' | 'all',
  title: string,
  body: string,
  type: string = 'info',
  link?: string,
) {
  try {
    await db.query(
      `INSERT INTO tp_notifications
         (user_id, audience, title, body, type, link, is_read, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, false, NOW())`,
      [userId, audience, title, body, type, link || null],
    )
  } catch (e) {
    // Notifications are non-critical — never throw
    console.error('[tp-notify] failed:', e)
  }
}

// ── Table auto-create (idempotent, runs once per server process) ──────────────
let _ensured = false
export async function ensureNotificationsTable() {
  if (_ensured) return
  await db.query(`
    CREATE TABLE IF NOT EXISTS tp_notifications (
      id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    UUID,
      audience   VARCHAR(30) NOT NULL DEFAULT 'user',
      title      TEXT        NOT NULL,
      body       TEXT,
      type       VARCHAR(30) NOT NULL DEFAULT 'info',
      link       TEXT,
      is_read    BOOLEAN     NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `).catch(() => {})
  await db.query(`CREATE INDEX IF NOT EXISTS idx_tp_notif_user   ON tp_notifications(user_id, created_at DESC)`).catch(() => {})
  await db.query(`CREATE INDEX IF NOT EXISTS idx_tp_notif_audience ON tp_notifications(audience, created_at DESC)`).catch(() => {})
  _ensured = true
}

// ── Event helpers ─────────────────────────────────────────────────────────────

/** Admin approved a writer's post */
export async function notifyPostApproved(userId: string, postTitle: string, postSlug: string) {
  await create(
    userId, 'user',
    '✅ Your post was approved!',
    `"${postTitle}" is now live on ThynkPulse. Share it with your network!`,
    'post_approved',
    `/post/${postSlug}`,
  )
}

/** Admin rejected a writer's post */
export async function notifyPostRejected(userId: string, postTitle: string, reason?: string) {
  await create(
    userId, 'user',
    '📝 Post needs revision',
    reason
      ? `"${postTitle}" was returned for revision: ${reason}`
      : `"${postTitle}" was not approved. Please review and resubmit.`,
    'post_rejected',
  )
}

/** Someone followed this user */
export async function notifyNewFollower(userId: string, followerName: string, followerUsername: string) {
  await create(
    userId, 'user',
    '👤 New follower',
    `${followerName} is now following you on ThynkPulse.`,
    'follow',
    `/profile/${encodeURIComponent(followerUsername)}`,
  )
}

/** New comment on a post owned by userId */
export async function notifyNewComment(userId: string, commenterName: string, postTitle: string, postSlug: string) {
  await create(
    userId, 'user',
    '💬 New comment on your post',
    `${commenterName} commented on "${postTitle}".`,
    'comment',
    `/post/${postSlug}`,
  )
}

/** New like on a post owned by userId */
export async function notifyNewLike(userId: string, likerName: string, postTitle: string, postSlug: string) {
  await create(
    userId, 'user',
    '❤️ Someone liked your post',
    `${likerName} liked "${postTitle}".`,
    'like',
    `/post/${postSlug}`,
  )
}

/** Admin broadcast — audience: 'all' | 'writers' | 'educators' */
export async function notifyBroadcast(
  audience: 'all' | 'writers' | 'educators',
  title: string,
  body: string,
  link?: string,
) {
  await create(null, audience as any, title, body, 'broadcast', link)
}
