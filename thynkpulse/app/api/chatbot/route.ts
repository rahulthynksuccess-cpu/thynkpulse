// app/api/chatbot/route.ts  (ThynkPulse)
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { requireAdmin, isAdminError } from '@/lib/adminAuth'

// ── Migration guard ───────────────────────────────────────────────────────────
const _migrated = new Set<string>()
async function runOnce(key: string, fn: () => Promise<void>) {
  if (_migrated.has(key)) return
  await fn()
  _migrated.add(key)
}

async function ensureTables() {
  await runOnce('tp_chatbot', async () => {
    // Config
    await db.query(`
      CREATE TABLE IF NOT EXISTS tp_chatbot_config (
        id         SERIAL PRIMARY KEY,
        key        VARCHAR(100) NOT NULL UNIQUE,
        value      TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await db.query(`
      INSERT INTO tp_chatbot_config (key, value) VALUES
        ('bot_name',         'Pulse Assistant'),
        ('brand_color',      '#0A5F55'),
        ('greeting_message', 'Hi! 👋 Welcome to ThynkPulse -- the knowledge platform for educators. What''s your name?'),
        ('fallback_message', 'Thanks for reaching out! Our team will get back to you shortly. You can also explore our Community section for peer answers.'),
        ('contact_email',    'hello@thynkpulse.in'),
        ('bot_enabled',      'true')
      ON CONFLICT (key) DO NOTHING
    `)

    // FAQs
    await db.query(`
      CREATE TABLE IF NOT EXISTS tp_chatbot_faqs (
        id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
        question   TEXT    NOT NULL,
        answer     TEXT    NOT NULL,
        keywords   TEXT[]  NOT NULL DEFAULT '{}',
        is_active  BOOLEAN NOT NULL DEFAULT true,
        sort_order INT     NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await db.query(`CREATE INDEX IF NOT EXISTS idx_tp_chatbot_faqs_active ON tp_chatbot_faqs(is_active)`)

    const { rows } = await db.query('SELECT COUNT(*) FROM tp_chatbot_faqs')
    if (parseInt(rows[0].count) === 0) {
      await db.query(`
        INSERT INTO tp_chatbot_faqs (question, answer, keywords, sort_order) VALUES
          ('How do I publish a post on ThynkPulse?',
           'To publish: log in → click "Write" in the navbar → write your post with our rich editor → hit "Submit for Review". Our editorial team usually reviews within 24-48 hours. Once approved, it goes live instantly!',
           ARRAY['publish','post','write','submit','how to post','article','create post'], 1),

          ('Who can write on ThynkPulse?',
           'ThynkPulse is open to educators, school leaders, EdTech professionals, and education innovators. Register with your professional email to get started. All posts go through a quick quality review.',
           ARRAY['who can write','eligibility','who can post','educator','edtech','school leader','can i write'], 2),

          ('How long does post approval take?',
           'Our editorial team reviews all submissions within 24-48 hours. You''ll receive an in-app notification as soon as your post is approved or if we need any changes.',
           ARRAY['approval','review','how long','pending','waiting','status','review time'], 3),

          ('What are the community guidelines?',
           'ThynkPulse is a professional, respectful community. Keep content original, educational, and constructive. No plagiarism, spam, or self-promotion without context. Posts violating guidelines will be removed.',
           ARRAY['guidelines','rules','policy','community rules','content policy','what is allowed'], 4),

          ('How do I grow my followers on ThynkPulse?',
           'Publish consistently, engage with comments, follow peers in your domain, and share your posts on LinkedIn & WhatsApp. Posts featured on the homepage or trending section see 5-10× more followers.',
           ARRAY['followers','grow','audience','reach','engagement','how to grow','tips'], 5),

          ('Is ThynkPulse free to use?',
           'Yes! ThynkPulse is completely free for all educators and education professionals -- reading, writing, and community participation. We may introduce premium features in future.',
           ARRAY['free','cost','paid','subscription','price','free to use','charge'], 6),

          ('How do I reset my password?',
           'Click "Login" → "Forgot Password" → enter your registered email or phone. You''ll receive a reset link within a few minutes. Check your spam folder if you don''t see it.',
           ARRAY['password','reset password','forgot','change password','login issue'], 7),

          ('How do I contact the ThynkPulse team?',
           'You can email us at hello@thynkpulse.in or use the Contact page. For partnerships, reach out to partnerships@thynkpulse.in. We usually respond within 1 business day.',
           ARRAY['contact','email','support','help','team','reach out','get in touch'], 8)
      `)
    }

    // Sessions
    await db.query(`
      CREATE TABLE IF NOT EXISTS tp_chatbot_sessions (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_name   VARCHAR(200),
        user_email  VARCHAR(200),
        page_url    TEXT,
        started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_msg_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        msg_count   INT NOT NULL DEFAULT 0
      )
    `)
    await db.query(`CREATE INDEX IF NOT EXISTS idx_tp_chatbot_sessions ON tp_chatbot_sessions(started_at DESC)`)

    // Messages
    await db.query(`
      CREATE TABLE IF NOT EXISTS tp_chatbot_messages (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID NOT NULL REFERENCES tp_chatbot_sessions(id) ON DELETE CASCADE,
        role       VARCHAR(10) NOT NULL CHECK (role IN ('user','bot')),
        content    TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await db.query(`CREATE INDEX IF NOT EXISTS idx_tp_chatbot_messages_session ON tp_chatbot_messages(session_id, created_at)`)
  })
}

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  await ensureTables()
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')

  // Public: widget init
  if (action === 'widget-init') {
    const [cfgRows, faqRows] = await Promise.all([
      db.query('SELECT key, value FROM tp_chatbot_config'),
      db.query('SELECT id, question, answer, keywords FROM tp_chatbot_faqs WHERE is_active = true ORDER BY sort_order ASC'),
    ])
    const config: Record<string, string> = {}
    for (const row of cfgRows.rows) config[row.key] = row.value
    return NextResponse.json({ config, faqs: faqRows.rows })
  }

  // Admin routes
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth

  if (action === 'config') {
    const { rows } = await db.query('SELECT key, value FROM tp_chatbot_config ORDER BY key')
    const config: Record<string, string> = {}
    for (const row of rows) config[row.key] = row.value
    return NextResponse.json(config)
  }

  if (action === 'faqs') {
    const { rows } = await db.query('SELECT * FROM tp_chatbot_faqs ORDER BY sort_order ASC, created_at ASC')
    return NextResponse.json(rows)
  }

  if (action === 'sessions') {
    const page   = parseInt(searchParams.get('page')  || '1')
    const limit  = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const offset = (page - 1) * limit

    const [dataRes, countRes] = search
      ? await Promise.all([
          db.query(`SELECT * FROM tp_chatbot_sessions WHERE user_name ILIKE $3 OR user_email ILIKE $3 ORDER BY started_at DESC LIMIT $1 OFFSET $2`, [limit, offset, `%${search}%`]),
          db.query(`SELECT COUNT(*) FROM tp_chatbot_sessions WHERE user_name ILIKE $1 OR user_email ILIKE $1`, [`%${search}%`]),
        ])
      : await Promise.all([
          db.query(`SELECT * FROM tp_chatbot_sessions ORDER BY started_at DESC LIMIT $1 OFFSET $2`, [limit, offset]),
          db.query(`SELECT COUNT(*) FROM tp_chatbot_sessions`),
        ])

    return NextResponse.json({ data: dataRes.rows, total: parseInt(countRes.rows[0].count) })
  }

  if (action === 'messages') {
    const sessionId = searchParams.get('sessionId')
    if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
    const { rows } = await db.query(
      'SELECT * FROM tp_chatbot_messages WHERE session_id = $1 ORDER BY created_at ASC',
      [sessionId]
    )
    return NextResponse.json(rows)
  }

  if (action === 'stats') {
    const [total, today, identified, faqCount] = await Promise.all([
      db.query('SELECT COUNT(*) FROM tp_chatbot_sessions'),
      db.query("SELECT COUNT(*) FROM tp_chatbot_sessions WHERE started_at >= CURRENT_DATE"),
      db.query("SELECT COUNT(*) FROM tp_chatbot_sessions WHERE user_name IS NOT NULL"),
      db.query('SELECT COUNT(*) FROM tp_chatbot_faqs WHERE is_active = true'),
    ])
    return NextResponse.json({
      totalSessions:   parseInt(total.rows[0].count),
      todaySessions:   parseInt(today.rows[0].count),
      identifiedLeads: parseInt(identified.rows[0].count),
      activeFaqs:      parseInt(faqCount.rows[0].count),
    })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  await ensureTables()
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  const body   = await req.json()

  // Public: start session
  if (action === 'session-start') {
    const { userName, userEmail, pageUrl } = body
    const { rows } = await db.query(
      `INSERT INTO tp_chatbot_sessions (user_name, user_email, page_url) VALUES ($1, $2, $3) RETURNING id`,
      [userName || null, userEmail || null, pageUrl || null]
    )
    return NextResponse.json({ sessionId: rows[0].id })
  }

  // Public: save message
  if (action === 'message') {
    const { sessionId, role, content } = body
    if (!sessionId || !role || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    await db.query(
      `INSERT INTO tp_chatbot_messages (session_id, role, content) VALUES ($1, $2, $3)`,
      [sessionId, role, content]
    )
    await db.query(
      `UPDATE tp_chatbot_sessions SET last_msg_at = NOW(), msg_count = msg_count + 1 WHERE id = $1`,
      [sessionId]
    )
    return NextResponse.json({ ok: true })
  }

  // Admin routes
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth

  if (action === 'config') {
    const { updates } = body
    for (const [key, value] of Object.entries(updates)) {
      await db.query(
        `INSERT INTO tp_chatbot_config (key, value, updated_at) VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, value]
      )
    }
    return NextResponse.json({ ok: true })
  }

  if (action === 'faq-upsert') {
    const { id, question, answer, keywords, isActive, sortOrder } = body
    if (id) {
      await db.query(
        `UPDATE tp_chatbot_faqs SET question=$1, answer=$2, keywords=$3, is_active=$4, sort_order=$5, updated_at=NOW() WHERE id=$6`,
        [question, answer, keywords, isActive ?? true, sortOrder ?? 0, id]
      )
    } else {
      const { rows } = await db.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM tp_chatbot_faqs')
      await db.query(
        `INSERT INTO tp_chatbot_faqs (question, answer, keywords, is_active, sort_order) VALUES ($1, $2, $3, $4, $5)`,
        [question, answer, keywords, isActive ?? true, rows[0].n]
      )
    }
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (isAdminError(auth)) return auth

  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  const id     = searchParams.get('id')

  if (action === 'faq' && id) {
    await db.query('DELETE FROM tp_chatbot_faqs WHERE id = $1', [id])
    return NextResponse.json({ ok: true })
  }
  if (action === 'session' && id) {
    await db.query('DELETE FROM tp_chatbot_sessions WHERE id = $1', [id])
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
