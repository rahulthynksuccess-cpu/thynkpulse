// app/api/admin/comm/test/route.ts
// Tests email SMTP or WhatsApp API without saving config
export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'
import nodemailer from 'nodemailer'

function adminOnly(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return null
  const p = verifyToken(token) as any
  return p?.role === 'admin' ? p : null
}

// POST /api/admin/comm/test
// Body (email):     { type: 'email', to, smtpHost, smtpPort, smtpUser, smtpPass, fromName, fromEmail }
// Body (whatsapp):  { type: 'whatsapp', provider, to, message, ...providerFields }
export async function POST(req: NextRequest) {
  const p = adminOnly(req)
  if (!p) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { type } = body

  // ── EMAIL TEST ───────────────────────────────────────────────
  if (type === 'email') {
    const { to, smtpHost, smtpPort, smtpUser, smtpPass, fromName, fromEmail } = body
    if (!to || !smtpHost || !smtpUser || !smtpPass) {
      return Response.json({ success: false, message: 'Missing required fields: to, smtpHost, smtpUser, smtpPass' })
    }
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || '587'),
        secure: parseInt(smtpPort || '587') === 465,
        auth: { user: smtpUser, pass: smtpPass },
        connectionTimeout: 8000,
        greetingTimeout: 5000,
      })
      await transporter.verify()
      await transporter.sendMail({
        from: `"${fromName || 'ThynkPulse'}" <${fromEmail || smtpUser}>`,
        to,
        subject: '✅ ThynkPulse SMTP Test',
        text: 'This is a test email from your ThynkPulse communications setup. Your SMTP configuration is working correctly!',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
            <h2 style="color:#0A5F55">✅ SMTP Test Successful</h2>
            <p>Your ThynkPulse email configuration is working correctly.</p>
            <p style="color:#7A6A52;font-size:13px">Sent via ${smtpHost}:${smtpPort || 587} · from ${fromEmail || smtpUser}</p>
          </div>
        `,
      })
      return Response.json({ success: true, message: `Test email sent to ${to}` })
    } catch (err: any) {
      return Response.json({ success: false, message: err.message || 'SMTP test failed' })
    }
  }

  // ── WHATSAPP TEST ────────────────────────────────────────────
  if (type === 'whatsapp') {
    const { provider, to, message } = body
    if (!to || !message) return Response.json({ success: false, message: 'to and message required' })

    // Normalise phone: 10-digit Indian numbers → prefix 91
    const norm = (raw: string) => {
      let d = raw.replace(/\D/g, '')
      if (d.length === 10 && d[0] !== '0') d = '91' + d
      if (d.length === 11 && d[0] === '0') d = '91' + d.slice(1)
      return d
    }
    const phone = norm(to)

    try {
      let res: Response
      if (provider === 'thynkcomm') {
        const { tcUrl, tcApiKey, tcApiSecret } = body
        res = await fetch(`${tcUrl.replace(/\/$/, '')}/api/send-message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': tcApiKey, 'x-api-secret': tcApiSecret },
          body: JSON.stringify({ to: phone, message }),
        })
      } else if (provider === 'meta') {
        const { metaToken, metaPhoneId } = body
        res = await fetch(`https://graph.facebook.com/v19.0/${metaPhoneId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${metaToken}` },
          body: JSON.stringify({ messaging_product: 'whatsapp', recipient_type: 'individual', to: phone, type: 'text', text: { preview_url: false, body: message } }),
        })
      } else if (provider === 'twilio') {
        const { accountSid, authToken, fromNumber } = body
        const creds = Buffer.from(`${accountSid}:${authToken}`).toString('base64')
        const from = fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`
        res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
          method: 'POST',
          headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ From: from, To: `whatsapp:${phone}`, Body: message }).toString(),
        })
      } else {
        return Response.json({ success: false, message: 'Unknown provider' })
      }

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        return Response.json({ success: false, message: data.error || data.message || `HTTP ${res.status}`, raw: data })
      }
      return Response.json({ success: true, message: `Message queued → ${phone}`, raw: data })
    } catch (err: any) {
      return Response.json({ success: false, message: 'Network error: ' + err.message })
    }
  }

  return Response.json({ success: false, message: 'type must be email or whatsapp' })
}
