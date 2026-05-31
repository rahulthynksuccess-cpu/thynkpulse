// components/layout/PageHeroSection.tsx
// Shared hero used by ALL listing pages — same gradient as the Community page.
// Change --page-hero-bg in the theme controller once to update every page.

import React from 'react'

interface PageHeroSectionProps {
  eyebrow: string
  title: string
  accent?: string            // italic gold part of the h1
  subtitle?: string
  children?: React.ReactNode // search bars, filter buttons, CTAs
}

export function PageHeroSection({
  eyebrow,
  title,
  accent,
  subtitle,
  children,
}: PageHeroSectionProps) {
  return (
    <div
      className="page-hero"
      style={{
        background: 'var(--page-hero-bg, linear-gradient(135deg,var(--teal) 0%,#0D7A6D 60%,var(--plum) 100%))',
        padding: '80px 5% 72px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles — same as community page */}
      <div style={{ position:'absolute', top:-100, right:-100, width:400, height:400, borderRadius:'50%', background:'rgba(255,255,255,.04)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-80, left:'30%', width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,.03)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'20%', right:'15%', width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,.02)', pointerEvents:'none' }} />

      <div style={{ maxWidth:800, position:'relative', zIndex:1 }}>
        {/* Eyebrow label */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,.55)',
          marginBottom: 16,
        }}>
          {eyebrow}
        </div>

        {/* Main heading */}
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(32px,5vw,60px)',
          fontWeight: 900,
          color: '#fff',
          lineHeight: 1.1,
          marginBottom: 16,
          letterSpacing: '-1px',
        }}>
          {title}
          {accent && (
            <><br /><em style={{ fontStyle:'italic', color:'var(--gold2,#E5B64A)' }}>{accent}</em></>
          )}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p style={{
            fontSize: '17px',
            color: 'rgba(255,255,255,.75)',
            lineHeight: 1.75,
            maxWidth: 580,
            marginBottom: children ? 32 : 0,
            fontWeight: 300,
          }}>
            {subtitle}
          </p>
        )}

        {/* Slot: search bars, CTAs, filter pills */}
        {children && (
          <div style={{ marginTop: subtitle ? 0 : 24 }}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
