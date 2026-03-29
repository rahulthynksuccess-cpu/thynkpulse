'use client'

interface AdSlotProps {
  id: string
  label?: string
  width?: number
  height?: number
  className?: string
}

/**
 * AdSlot — flexible placeholder for future advertising.
 * Currently renders a labelled empty box.
 * When monetisation is enabled, replace this component's internals
 * with your ad network SDK (Google AdSense, etc.) — zero other changes needed.
 */
export function AdSlot({ id, label = 'Advertisement', width, height = 90, className }: AdSlotProps) {
  // In production set NEXT_PUBLIC_ADS_ENABLED=true to show ads
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true'

  if (!adsEnabled) {
    // In dev / free phase — render nothing (invisible placeholder)
    return <div data-ad-slot={id} style={{ display:'none' }} />
  }

  return (
    <div
      data-ad-slot={id}
      className={className}
      style={{
        background: 'var(--ad-bg)',
        border: '1px dashed var(--ad-border)',
        borderRadius: 'var(--radius)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        gap: '4px', margin: '16px 0',
        minHeight: height, width: width ? `${width}px` : '100%',
        fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)',
        letterSpacing: '1px', textTransform: 'uppercase',
      }}>
      <div>{label}</div>
      <div style={{ fontSize:'10px' }}>{id}</div>
    </div>
  )
}
