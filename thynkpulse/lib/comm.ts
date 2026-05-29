// lib/comm.ts
// Call fireTrigger(event, userData) anywhere in your API routes to
// automatically send emails/WhatsApps based on configured triggers.
//
// Usage examples:
//   await fireTrigger('user.registered', { user_name: 'Priya', user_email: 'priya@gmail.com' })
//   await fireTrigger('post.approved',   { user_name: 'Rajesh', post_title: 'AI in Schools', post_url: 'https://...' })

import db from '@/lib/db'
import nodemailer from 'nodemailer'

// ── Variable substitution ─────────────────────────────────────
function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`)
}

// ── Load settings from site_settings ─────────────────────────
async function loadSettings() {
  const { rows } = await db.query(
    `SELECT key, value FROM site_settings WHERE key IN ('comm.email_smtp_configs','comm.whatsapp_settings')`
  )
  const out: Record<string, any> = {}
  rows.forEach(r => { try { out[r.key] = JSON.parse(r.value) } catch { out[r.key] = r.value } })
  return {
    smtpConfigs:      (out['comm.email_smtp_configs'] ?? []) as any[],
    whatsappSettings: (out['comm.whatsapp_settings']  ?? {}) as any,
  }
}

// ── Send email via SMTP ───────────────────────────────────────
async function sendEmail(cfg: any, to: string, subject: string, body: string) {
  const transporter = nodemailer.createTransport({
    host: cfg.smtpHost,
    port: parseInt(cfg.smtpPort || '587'),
    secure: parseInt(cfg.smtpPort || '587') === 465,
    auth: { user: cfg.smtpUser, pass: cfg.smtpPass },
    connectionTimeout: 8000,
  })
  const isHtml = body.trimStart().startsWith('<')
  await transporter.sendMail({
    from: `"${cfg.fromName || 'ThynkPulse'}" <${cfg.fromEmail || cfg.smtpUser}>`,
    to,
    subject,
    ...(isHtml ? { html: body, text: body.replace(/<[^>]+>/g, '') } : { text: body }),
  })
}

// ── Send WhatsApp ─────────────────────────────────────────────
async function sendWhatsApp(wa: any, phone: string, message: string, templateName?: string, templateLang?: string) {
  if (!wa?.enabled || !phone) return

  // Normalise Indian numbers
  let to = phone.replace(/\D/g, '')
  if (to.length === 10 && to[0] !== '0') to = '91' + to

  if (wa.provider === 'thynkcomm') {
    const url = wa.tcUrl.replace(/\/$/, '') + '/api/send-message'
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': wa.tcApiKey, 'x-api-secret': wa.tcApiSecret },
      body: JSON.stringify({ to, message }),
    })
  } else if (wa.provider === 'meta') {
    const payload = templateName
      ? {
          messaging_product: 'whatsapp', to,
          type: 'template',
          template: { name: templateName, language: { code: templateLang || 'en' } },
        }
      : {
          messaging_product: 'whatsapp', recipient_type: 'individual', to,
          type: 'text', text: { preview_url: false, body: message },
        }
    await fetch(`https://graph.facebook.com/v19.0/${wa.metaPhoneId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${wa.metaToken}` },
      body: JSON.stringify(payload),
    })
  } else if (wa.provider === 'twilio') {
    const creds = Buffer.from(`${wa.accountSid}:${wa.authToken}`).toString('base64')
    const from  = wa.fromNumber.startsWith('whatsapp:') ? wa.fromNumber : `whatsapp:${wa.fromNumber}`
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${wa.accountSid}/Messages.json`, {
      method: 'POST',
      headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ From: from, To: `whatsapp:${to}`, Body: message }).toString(),
    })
  }
}

// ── Log comm attempt ──────────────────────────────────────────
async function logComm(event: string, channel: string, templateId: string | null, recipient: string, status: 'sent' | 'failed' | 'skipped', error?: string) {
  await db.query(
    `INSERT INTO comm_log (event_type, channel, template_id, recipient, status, error) VALUES ($1,$2,$3,$4,$5,$6)`,
    [event, channel, templateId, recipient, status, error || null]
  ).catch(() => {})  // log failures silently
}

// ── Main exported function ────────────────────────────────────
export interface TriggerVars {
  user_name?:            string
  user_email?:           string
  user_phone?:           string   // WhatsApp recipient phone
  user_designation?:     string
  post_title?:           string
  post_url?:             string
  post_category?:        string
  post_excerpt?:         string
  commenter_name?:       string
  comment_text?:         string
  follower_name?:        string
  follower_designation?: string
  site_name?:            string
  site_url?:             string
  admin_url?:            string
  admin_email?:          string   // override: where to send admin-recipient triggers
  [key: string]:         string | undefined
}

export async function fireTrigger(eventType: string, vars: TriggerVars): Promise<void> {
  try {
    // Load active triggers for this event
    const { rows: trigRows } = await db.query(
      `SELECT t.*, tmpl.name, tmpl.channel, tmpl.subject, tmpl.body,
              tmpl.whatsapp_template_name, tmpl.whatsapp_template_lang, tmpl.is_active AS tmpl_active
       FROM comm_triggers t
       JOIN comm_templates tmpl ON tmpl.id = t.template_id
       WHERE t.event_type = $1 AND t.is_active = true AND tmpl.is_active = true`,
      [eventType]
    )
    if (!trigRows.length) return

    const { smtpConfigs, whatsappSettings } = await loadSettings()
    const siteUrl  = vars.site_url  || process.env.NEXT_PUBLIC_APP_URL || 'https://thynkpulse.in'
    const siteName = vars.site_name || 'ThynkPulse'
    const adminUrl = vars.admin_url  || `${siteUrl}/admin`
    const mergedVars = { site_url: siteUrl, site_name: siteName, admin_url: adminUrl, ...vars }

    for (const trig of trigRows) {
      const subject = interpolate(trig.subject || siteName, mergedVars as Record<string, string>)
      const body    = interpolate(trig.body, mergedVars as Record<string, string>)

      if (trig.channel === 'email') {
        // Determine recipient
        const isAdminTrigger = trig.recipient_type === 'admin'
        const to = isAdminTrigger
          ? (vars.admin_email || process.env.ADMIN_EMAIL || '')
          : (vars.user_email || '')
        if (!to) { await logComm(eventType, 'email', trig.template_id, '(none)', 'skipped', 'No recipient email'); continue }

        // Use first enabled SMTP config
        const cfg = smtpConfigs.find((c: any) => c.enabled)
        if (!cfg) { await logComm(eventType, 'email', trig.template_id, to, 'skipped', 'No SMTP configured'); continue }

        try {
          await sendEmail(cfg, to, subject, body)
          await logComm(eventType, 'email', trig.template_id, to, 'sent')
        } catch (e: any) {
          await logComm(eventType, 'email', trig.template_id, to, 'failed', e.message)
          console.error(`[comm] email send failed for ${eventType}:`, e.message)
        }

      } else if (trig.channel === 'whatsapp') {
        const phone = vars.user_phone || ''
        if (!phone) { await logComm(eventType, 'whatsapp', trig.template_id, '(none)', 'skipped', 'No phone number'); continue }
        if (!whatsappSettings?.enabled) { await logComm(eventType, 'whatsapp', trig.template_id, phone, 'skipped', 'WhatsApp disabled'); continue }

        try {
          await sendWhatsApp(whatsappSettings, phone, body, trig.whatsapp_template_name, trig.whatsapp_template_lang)
          await logComm(eventType, 'whatsapp', trig.template_id, phone, 'sent')
        } catch (e: any) {
          await logComm(eventType, 'whatsapp', trig.template_id, phone, 'failed', e.message)
          console.error(`[comm] whatsapp send failed for ${eventType}:`, e.message)
        }
      }
    }
  } catch (e) {
    console.error(`[comm] fireTrigger(${eventType}) error:`, e)
  }
}
