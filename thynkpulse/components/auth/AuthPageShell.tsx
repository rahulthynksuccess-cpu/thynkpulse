'use client'
// Shared wrapper for Login, Register, and Forgot-Password pages.
// Keeps background, dot-grid, logo, footer, and card styling 100% identical.
import Link from 'next/link'

interface AuthPageShellProps {
  children: React.ReactNode
  maxWidth?: number       // card max-width (default 460)
  footerText?: React.ReactNode
}

export function AuthPageShell({ children, maxWidth = 460, footerText }: AuthPageShellProps) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--auth-page-bg, var(--cream))',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Subtle dot grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, var(--teal) 1px, transparent 1px)',
        backgroundSize: '28px 28px', opacity: 0.04,
      }} />

      {/* Soft glow top-left */}
      <div style={{
        position: 'fixed', top: '-120px', left: '-80px',
        width: '400px', height: '400px', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(10,95,85,0.08) 0%, transparent 70%)',
      }} />

      <div style={{ width: '100%', maxWidth, position: 'relative', zIndex: 1 }}>

        {/* Logo — identical on every auth page */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 42, height: 42, borderRadius: '12px',
              background: 'var(--teal)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(10,95,85,0.25)',
            }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '19px', color: '#fff' }}>TP</span>
            </div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '23px', fontWeight: 900, color: 'var(--ink)' }}>
              Thynk <em style={{ fontStyle: 'normal', color: 'var(--teal)' }}>Pulse</em>
            </span>
          </Link>
        </div>

        {/* Card — same border, shadow, radius on every auth page */}
        <div style={{
          background: '#fff',
          border: '1.5px solid var(--parchment)',
          borderRadius: '20px',
          boxShadow: '0 4px 32px rgba(26,18,8,0.08)',
          padding: '36px 32px',
        }}>
          {children}
        </div>

        {/* Footer slot */}
        {footerText && (
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '20px', lineHeight: 1.6 }}>
            {footerText}
          </p>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
