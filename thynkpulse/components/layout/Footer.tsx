'use client'
import Link from 'next/link'
import { config } from '@/lib/config'

const LINKS = {
  Explore: [
    ['Latest Posts',      '/latest-posts'],
    ['Trending Now',      '/trending'],
    ['EdTech Articles',   '/edtech-articles'],
    ['Educator Stories',  '/edtech-stories'],
    ['School Leadership', '/school-leadership'],
    ['Innovation',        '/innovation'],
  ],
  Community: [
    ['Writers Directory', '/writers'],
    ['Community Hub',     '/community'],
    ['Write for Us',      '/write'],
    ['Weekly Newsletter', '/#join'],
    ['Partner with Us',   `${config.app.parentSite}/contact-us/`],
  ],
  Company: [
    ['About Thynk Success',   `${config.app.parentSite}/about-us/`],
    ['Contact Us',            `${config.app.parentSite}/contact-us/`],
    ['Privacy Policy',        '/privacy'],
    ['Terms of Use',          '/terms'],
    ['Main Website',          config.app.parentSite],
  ],
}

export function Footer() {
  return (
    <footer style={{ background: 'var(--teal)', padding: '72px 5% 36px', color: 'rgba(255,255,255,0.6)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '56px' }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '16px', color: '#fff' }}>TP</span>
            </div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 900, color: '#fff' }}>
              Thynk <em style={{ fontStyle: 'normal', color: 'var(--gold2)' }}>Pulse</em>
            </span>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.8, maxWidth: '260px', color: 'rgba(255,255,255,0.6)' }}>
            The free community platform by{' '}
            <a href={config.app.parentSite} style={{ color: 'var(--gold2)', textDecoration: 'none' }}>Thynk Success</a>{' '}
            — bridging the gap in education by connecting educators, innovators, and EdTech companies worldwide.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h4 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px', fontFamily: 'var(--font-mono)' }}>{heading}</h4>
            <ul style={{ listStyle: 'none' }}>
              {links.map(([label, href]) => (
                <li key={href} style={{ marginBottom: '11px' }}>
                  <Link href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color .2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#fff'}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
        <span>
          © {new Date().getFullYear()} Thynk Pulse · A{' '}
          <a href={config.app.parentSite} style={{ color: 'var(--gold2)', textDecoration: 'none' }}>Thynk Success</a>{' '}
          Initiative · Free Forever 🎓
        </span>
        <span>Made with ❤️ for India&apos;s Education Community</span>
      </div>
    </footer>
  )
}
