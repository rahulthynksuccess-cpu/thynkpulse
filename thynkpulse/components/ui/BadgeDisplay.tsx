'use client'
// ═══════════════════════════════════════════════════
//  THYNK PULSE — BadgeDisplay component
//  components/ui/BadgeDisplay.tsx
// ═══════════════════════════════════════════════════

import { BadgeDef, computeEliteTag, UserBadgeStats, ELITE_TAGS } from '@/lib/badges'

// ── Verified tick shown beside name ────────────────
export function VerifiedBadge({ size = 16 }: { size?: number }) {
  return (
    <span
      title="Verified by ThynkPulse"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#0A5F55',
        flexShrink: 0,
        verticalAlign: 'middle',
        marginLeft: 4,
      }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.8 7 9 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

// ── Single badge chip ───────────────────────────────
export function BadgeChip({
  badge,
  size = 'sm',
  showLabel = true,
}: {
  badge: BadgeDef
  size?: 'xs' | 'sm' | 'md'
  showLabel?: boolean
}) {
  const pads: Record<string, string> = { xs: '2px 6px', sm: '3px 8px', md: '5px 12px' }
  const fsize: Record<string, string> = { xs: '10px', sm: '11px', md: '13px' }
  const efsize: Record<string, string> = { xs: '10px', sm: '12px', md: '14px' }

  return (
    <span
      title={badge.description}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: pads[size],
        borderRadius: '100px',
        background: badge.bg,
        border: `1px solid ${badge.color}30`,
        color: badge.color,
        fontSize: fsize[size],
        fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
      }}
    >
      <span style={{ fontSize: efsize[size] }}>{badge.emoji}</span>
      {showLabel && badge.name}
    </span>
  )
}

// ── Elite status tag (displayed beside profile name) ─
export function EliteTag({ stats, size = 'sm' }: { stats: UserBadgeStats; size?: 'xs' | 'sm' | 'md' }) {
  const tag = computeEliteTag(stats)
  if (!tag) return null

  const pads: Record<string, string> = { xs: '2px 6px', sm: '3px 9px', md: '5px 13px' }
  const fsize: Record<string, string> = { xs: '9px', sm: '11px', md: '13px' }

  return (
    <span
      title={tag.label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: pads[size],
        borderRadius: '100px',
        background: tag.bg,
        border: `1.5px solid ${tag.borderColor}`,
        color: tag.color,
        fontSize: fsize[size],
        fontWeight: 700,
        fontFamily: 'var(--font-sans)',
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
      }}
    >
      <span>{tag.emoji}</span>
      {tag.label}
    </span>
  )
}

// ── Badge shelf (row of earned badges on profile) ───
export function BadgeShelf({
  badges,
  isVerified,
  max = 6,
}: {
  badges: BadgeDef[]
  isVerified: boolean
  max?: number
}) {
  if (!isVerified && badges.length === 0) return null

  const visible = badges.slice(0, max)
  const overflow = badges.length - max

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
      {isVerified && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 9px',
            borderRadius: '100px',
            background: '#EAF4F0',
            border: '1.5px solid #0A5F5530',
            color: '#0A5F55',
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: 'var(--font-sans)',
          }}
        >
          ✅ Verified
        </span>
      )}
      {visible
        .filter(b => b.id !== 'verified')
        .map(b => (
          <BadgeChip key={b.id} badge={b} size="sm" />
        ))}
      {overflow > 0 && (
        <span
          style={{
            fontSize: '11px',
            color: 'var(--muted)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
          }}
        >
          +{overflow} more
        </span>
      )}
    </div>
  )
}

// ── Full badge grid (for dedicated Badges tab) ──────
export function BadgeGrid({ badges, isVerified }: { badges: BadgeDef[]; isVerified: boolean }) {
  const all = isVerified ? badges : badges.filter(b => b.id !== 'verified')

  if (all.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: 'var(--muted)',
          fontSize: '14px',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏅</div>
        No badges earned yet — start publishing!
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px',
      }}
    >
      {isVerified && (
        <BadgeCard
          emoji="✅"
          name="Verified"
          description="Account verified by ThynkPulse"
          color="#0A5F55"
          bg="#EAF4F0"
        />
      )}
      {all
        .filter(b => b.id !== 'verified')
        .map(b => (
          <BadgeCard
            key={b.id}
            emoji={b.emoji}
            name={b.name}
            description={b.description}
            color={b.color}
            bg={b.bg}
          />
        ))}
    </div>
  )
}

function BadgeCard({
  emoji,
  name,
  description,
  color,
  bg,
}: {
  emoji: string
  name: string
  description: string
  color: string
  bg: string
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: `1.5px solid ${color}25`,
        borderRadius: '14px',
        padding: '18px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '14px',
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          border: `1px solid ${color}30`,
        }}
      >
        {emoji}
      </div>
      <div
        style={{
          fontSize: '13px',
          fontWeight: 700,
          color,
          fontFamily: 'var(--font-sans)',
          lineHeight: 1.2,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontSize: '11px',
          color: 'var(--muted)',
          fontFamily: 'var(--font-sans)',
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>
    </div>
  )
}

// ── Progress toward next badge ──────────────────────
export function BadgeProgressBar({
  label,
  current,
  next,
  color,
}: {
  label: string
  current: number
  next: number
  color: string
}) {
  const pct = Math.min(100, Math.round((current / next) * 100))
  return (
    <div style={{ marginBottom: '10px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--muted)',
          fontFamily: 'var(--font-sans)',
          marginBottom: '4px',
        }}
      >
        <span>{label}</span>
        <span>
          {current}/{next}
        </span>
      </div>
      <div
        style={{
          height: '6px',
          borderRadius: '100px',
          background: 'var(--parchment)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: '100px',
            background: color,
            transition: 'width .4s ease',
          }}
        />
      </div>
    </div>
  )
}
