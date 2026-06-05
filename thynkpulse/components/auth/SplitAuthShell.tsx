'use client'
// ═══════════════════════════════════════════════════════
//  THYNK PULSE — SplitAuthShell
//  Direction A: Illustrated left panel + white form right
//  components/auth/SplitAuthShell.tsx
//
//  Props:
//   - children     : form content (right panel)
//   - variant      : 'login' | 'register' | 'forgot'
//   - maxWidth     : card max-width (default 460, right panel only)
//   - footerText   : optional footer below the card
// ═══════════════════════════════════════════════════════
import Link from 'next/link'

type Variant = 'login' | 'register' | 'forgot'

interface SplitAuthShellProps {
  children:    React.ReactNode
  variant:     Variant
  maxWidth?:   number
  footerText?: React.ReactNode
}

// ── Per-variant config ──────────────────────────────────
const CONFIG: Record<Variant, {
  bg:       string
  headline: string
  tagline:  string
  accentBorder: string
}> = {
  login: {
    bg:           '#0A5F55',
    headline:     "India's educator community",
    tagline:      '1,000+ schools · 15 countries',
    accentBorder: 'rgba(93,202,165,.35)',
  },
  register: {
    bg:           '#3D1F5E',
    headline:     'Join 50,000+ educators',
    tagline:      'Write · Connect · Grow',
    accentBorder: 'rgba(175,169,236,.35)',
  },
  forgot: {
    bg:           '#7A4A10',
    headline:     "We've got you covered",
    tagline:      'Reset takes under a minute',
    accentBorder: 'rgba(239,159,39,.35)',
  },
}

// ── Illustrations ───────────────────────────────────────

function LoginIllustration() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 260 600"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Chalkboard */}
      <rect x="28" y="48" width="200" height="130" rx="4" fill="white" opacity=".1"/>
      <rect x="28" y="48" width="200" height="130" rx="4" stroke="white" strokeWidth="1.5" fill="none" opacity=".18"/>
      <text x="48" y="112" fontSize="44" fontWeight="900" fill="white" opacity=".16" fontFamily="Georgia,serif">ABC</text>
      <line x1="44" y1="134" x2="214" y2="134" stroke="white" strokeWidth=".8" opacity=".14"/>
      <text x="52" y="163" fontSize="18" fill="white" opacity=".14" fontFamily="Georgia,serif">1 + 1 = 2</text>
      <rect x="28" y="180" width="200" height="8" rx="2" fill="white" opacity=".12"/>
      {/* Chalk sticks */}
      <rect x="40"  y="183" width="28" height="5" rx="2" fill="white" opacity=".18"/>
      <rect x="74"  y="183" width="22" height="5" rx="2" fill="white" opacity=".15"/>

      {/* Teacher figure — stylised */}
      <circle cx="130" cy="258" r="18" fill="white" opacity=".55"/>
      {/* body */}
      <line x1="130" y1="276" x2="130" y2="345" stroke="white" strokeWidth="4" strokeLinecap="round" opacity=".5"/>
      {/* arms */}
      <line x1="130" y1="296" x2="96"  y2="318" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity=".45"/>
      <line x1="130" y1="296" x2="164" y2="315" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity=".45"/>
      {/* legs */}
      <line x1="130" y1="345" x2="108" y2="390" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity=".45"/>
      <line x1="130" y1="345" x2="152" y2="390" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity=".45"/>

      {/* Pencil top-right */}
      <g transform="rotate(-28, 210, 90)">
        <rect x="196" y="30" width="14" height="76" rx="2" fill="white" opacity=".14"/>
        <polygon points="196,106 210,106 203,122" fill="white" opacity=".16"/>
        <rect x="196" y="30" width="14" height="14" rx="2" fill="white" opacity=".08"/>
        <rect x="197" y="90" width="12" height="14" fill="white" opacity=".1"/>
      </g>

      {/* Scattered dots */}
      <circle cx="40"  cy="440" r="3"   fill="white" opacity=".2"/>
      <circle cx="75"  cy="490" r="2"   fill="white" opacity=".16"/>
      <circle cx="200" cy="430" r="2.5" fill="white" opacity=".18"/>
      <circle cx="220" cy="470" r="2"   fill="white" opacity=".14"/>
      <circle cx="55"  cy="540" r="1.5" fill="white" opacity=".12"/>
      <circle cx="185" cy="555" r="2"   fill="white" opacity=".12"/>

      {/* Bottom book stack */}
      <rect x="24"  y="530" width="110" height="14" rx="2" fill="white" opacity=".12"/>
      <rect x="28"  y="512" width="96"  height="14" rx="2" fill="white" opacity=".1"/>
      <rect x="32"  y="494" width="80"  height="14" rx="2" fill="white" opacity=".08"/>
    </svg>
  )
}

function RegisterIllustration() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 260 600"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Open book */}
      <path d="M130 50 Q130 44 138 44 L230 64 L230 220 Q138 200 130 206 Z" fill="white" opacity=".1"/>
      <path d="M130 50 Q130 44 122 44 L30 64 L30 220 Q122 200 130 206 Z" fill="white" opacity=".07"/>
      <line x1="130" y1="50" x2="130" y2="206" stroke="white" strokeWidth="1.5" opacity=".18"/>
      {/* lines on left page */}
      <line x1="44"  y1="90"  x2="122" y2="87"  stroke="white" strokeWidth=".8" opacity=".14"/>
      <line x1="44"  y1="108" x2="122" y2="105" stroke="white" strokeWidth=".8" opacity=".14"/>
      <line x1="44"  y1="126" x2="122" y2="123" stroke="white" strokeWidth=".8" opacity=".14"/>
      <line x1="44"  y1="144" x2="108" y2="142" stroke="white" strokeWidth=".8" opacity=".12"/>
      {/* lines on right page */}
      <line x1="138" y1="90"  x2="216" y2="87"  stroke="white" strokeWidth=".8" opacity=".14"/>
      <line x1="138" y1="108" x2="216" y2="105" stroke="white" strokeWidth=".8" opacity=".14"/>
      <line x1="138" y1="126" x2="200" y2="123" stroke="white" strokeWidth=".8" opacity=".12"/>

      {/* Graduation cap */}
      <polygon points="130,278 192,306 130,334 68,306" fill="white" opacity=".55"/>
      <rect x="127" y="306" width="6" height="46" rx="1" fill="white" opacity=".45"/>
      <path d="M127 352 Q111 365 108 385 Q120 390 133 390 Q146 390 158 385 Q155 365 139 352 Z" fill="white" opacity=".42"/>
      {/* tassel */}
      <line x1="192" y1="306" x2="192" y2="334" stroke="white" strokeWidth="2" opacity=".45"/>
      <circle cx="192" cy="337" r="4" fill="white" opacity=".4"/>

      {/* Star sparkles */}
      <path d="M44 430  L46 436  L52 436  L47 440  L49 446  L44 442  L39 446  L41 440  L36 436  L42 436  Z" fill="white" opacity=".28"/>
      <path d="M210 400 L212 406 L218 406 L213 410 L215 416 L210 412 L205 416 L207 410 L202 406 L208 406 Z" fill="white" opacity=".22"/>
      <circle cx="36"  cy="490" r="2.5" fill="white" opacity=".18"/>
      <circle cx="224" cy="470" r="2"   fill="white" opacity=".15"/>
      <circle cx="60"  cy="555" r="2"   fill="white" opacity=".13"/>
      <circle cx="196" cy="545" r="1.5" fill="white" opacity=".12"/>

      {/* Bottom pencil */}
      <g transform="rotate(20, 50, 530)">
        <rect x="36" y="505" width="12" height="62" rx="1.5" fill="white" opacity=".14"/>
        <polygon points="36,567 48,567 42,583" fill="white" opacity=".16"/>
        <rect x="36" y="505" width="12" height="12" rx="1" fill="white" opacity=".08"/>
      </g>
    </svg>
  )
}

function ForgotIllustration() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 260 600"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Large lightbulb */}
      <path d="M130 44 C180 44 206 80 198 116 C193 138 178 152 176 168 L84 168 C82 152 67 138 62 116 C54 80 80 44 130 44 Z" fill="white" opacity=".16"/>
      <rect x="84"  y="172" width="92" height="14" rx="3" fill="white" opacity=".14"/>
      <rect x="90"  y="189" width="80" height="12" rx="3" fill="white" opacity=".12"/>
      <rect x="96"  y="204" width="68" height="11" rx="3" fill="white" opacity=".1"/>
      {/* filament */}
      <path d="M110 90 Q130 120 150 90" stroke="white" strokeWidth="2.5" fill="none" opacity=".2"/>
      <line x1="130" y1="84" x2="130" y2="158" stroke="white" strokeWidth="1.5" opacity=".16"/>
      {/* glow rays */}
      <line x1="130" y1="32" x2="130" y2="20" stroke="white" strokeWidth="3" strokeLinecap="round" opacity=".5"/>
      <line x1="170" y1="52" x2="178" y2="44" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity=".44"/>
      <line x1="90"  y1="52" x2="82"  y2="44" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity=".44"/>
      <line x1="200" y1="96" x2="212" y2="90" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".36"/>
      <line x1="60"  y1="96" x2="48"  y2="90" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".36"/>
      <line x1="210" y1="144" x2="222" y2="142" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".28"/>
      <line x1="50"  y1="144" x2="38"  y2="142" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".28"/>

      {/* Compass */}
      <circle cx="130" cy="330" r="58" stroke="white" strokeWidth="2"   fill="none" opacity=".3"/>
      <circle cx="130" cy="330" r="42" stroke="white" strokeWidth="1"   fill="none" opacity=".18"/>
      <circle cx="130" cy="330" r="24" stroke="white" strokeWidth=".6"  fill="none" opacity=".12"/>
      {/* N/S needle */}
      <polygon points="130,274 127,330 133,330" fill="white" opacity=".55"/>
      <polygon points="130,386 127,330 133,330" fill="white" opacity=".28"/>
      {/* E/W ticks */}
      <line x1="74"  y1="330" x2="86"  y2="330" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".35"/>
      <line x1="174" y1="330" x2="186" y2="330" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".35"/>
      {/* N label */}
      <text x="126" y="268" fontSize="11" fill="white" opacity=".45" fontFamily="monospace" fontWeight="700">N</text>
      <text x="126" y="400" fontSize="11" fill="white" opacity=".3"  fontFamily="monospace" fontWeight="700">S</text>

      {/* Ruler bottom-left */}
      <g transform="rotate(-18, 60, 500)">
        <rect x="20" y="490" width="180" height="22" rx="2" fill="white" opacity=".1"/>
        <line x1="36"  y1="490" x2="36"  y2="502" stroke="white" strokeWidth="1" opacity=".14"/>
        <line x1="56"  y1="490" x2="56"  y2="498" stroke="white" strokeWidth="1" opacity=".12"/>
        <line x1="76"  y1="490" x2="76"  y2="502" stroke="white" strokeWidth="1" opacity=".14"/>
        <line x1="96"  y1="490" x2="96"  y2="498" stroke="white" strokeWidth="1" opacity=".12"/>
        <line x1="116" y1="490" x2="116" y2="502" stroke="white" strokeWidth="1" opacity=".14"/>
        <line x1="136" y1="490" x2="136" y2="498" stroke="white" strokeWidth="1" opacity=".12"/>
        <line x1="156" y1="490" x2="156" y2="502" stroke="white" strokeWidth="1" opacity=".14"/>
        <line x1="176" y1="490" x2="176" y2="498" stroke="white" strokeWidth="1" opacity=".12"/>
      </g>

      {/* Dots */}
      <circle cx="38"  cy="440" r="2.5" fill="white" opacity=".2"/>
      <circle cx="220" cy="420" r="2"   fill="white" opacity=".16"/>
      <circle cx="48"  cy="560" r="2"   fill="white" opacity=".14"/>
      <circle cx="212" cy="558" r="1.5" fill="white" opacity=".12"/>
    </svg>
  )
}

const ILLUSTRATIONS: Record<Variant, React.FC> = {
  login:    LoginIllustration,
  register: RegisterIllustration,
  forgot:   ForgotIllustration,
}

// ── Main shell ──────────────────────────────────────────
export function SplitAuthShell({ children, variant, footerText }: SplitAuthShellProps) {
  const cfg   = CONFIG[variant]
  const Illus = ILLUSTRATIONS[variant]

  return (
    <div style={{
      minHeight:      '100vh',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      background:     'var(--cream)',
      padding:        '24px 20px',
      fontFamily:     'var(--font-sans)',
    }}>
      {/* Outer wrapper: max width for the whole split card */}
      <div style={{ width: '100%', maxWidth: 900, position: 'relative', zIndex: 1 }}>

        {/* ── Split card ── */}
        <div style={{
          display:      'flex',
          borderRadius: '20px',
          overflow:     'hidden',
          boxShadow:    '0 12px 56px rgba(26,18,8,.14)',
          border:       `1.5px solid ${cfg.accentBorder}`,
          minHeight:    560,
        }}>

          {/* ── LEFT: illustrated panel ── */}
          <div style={{
            width:    '42%',
            background: cfg.bg,
            position:   'relative',
            overflow:   'hidden',
            display:    'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding:   '32px 28px',
            flexShrink: 0,
          }}>
            {/* Illustration */}
            <Illus />

            {/* Bottom caption — above everything */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* ThynkPulse logo */}
              <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '9px',
                  background: 'rgba(255,255,255,.15)',
                  border:     '1px solid rgba(255,255,255,.22)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '14px', color: '#fff' }}>TP</span>
                </div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 900, color: '#fff', opacity: .9 }}>
                  Thynk <em style={{ fontStyle: 'normal', opacity: .75 }}>Pulse</em>
                </span>
              </Link>

              <div style={{
                width:   36,
                height:  3,
                background: 'rgba(255,255,255,.4)',
                borderRadius: 2,
                marginBottom: 14,
              }} />

              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: 8, letterSpacing: '-.3px' }}>
                {cfg.headline}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)', fontWeight: 300 }}>
                {cfg.tagline}
              </div>
            </div>
          </div>

          {/* ── RIGHT: form panel ── */}
          <div style={{
            flex:       1,
            background: '#fff',
            padding:    '44px 40px',
            display:    'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflowY:  'auto',
          }}>
            {children}
          </div>

        </div>

        {/* Footer */}
        {footerText && (
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '18px', lineHeight: 1.6 }}>
            {footerText}
          </p>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
