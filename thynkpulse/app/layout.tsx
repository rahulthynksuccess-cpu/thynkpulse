import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from './providers'
import { config } from '@/lib/config'

export const metadata: Metadata = {
  title: { default: `${config.app.name} — ${config.app.tagline}`, template: `%s | ${config.app.name}` },
  description: 'The free community platform for educators, EdTech professionals, innovators and school leaders to share experiences and shape the future of education.',
  keywords: ['education community', 'EdTech', 'educators India', 'teaching', 'school leadership'],
  metadataBase: new URL(config.app.url),
  openGraph: { type: 'website', siteName: config.app.name },
}

export const viewport: Viewport = {
  themeColor: '#FDF6EC',
  width: 'device-width',
  initialScale: 1,
}

/* Load active theme from DB — runs on every server render */
async function getThemeCSSVars(): Promise<string> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/admin/theme`, {
      next: { revalidate: 60 }, // cache for 60s, revalidates automatically
    })
    if (!res.ok) return ''
    const data = await res.json()
    if (!data.theme) return ''

    const t = data.theme
    return `:root {
  --cream:      ${t.cream      || '#FDF6EC'};
  --cream2:     ${t.cream2     || '#F5ECD8'};
  --parchment:  ${t.parchment  || '#EDE0C8'};
  --teal:       ${t.teal       || '#0A5F55'};
  --teal2:      ${t.teal2      || '#0D7A6D'};
  --teal3:      ${t.teal3      || '#12A090'};
  --coral:      ${t.coral      || '#E8512A'};
  --coral2:     ${t.coral2     || '#F07250'};
  --gold:       ${t.gold       || '#C9922A'};
  --gold2:      ${t.gold2      || '#E5B64A'};
  --plum:       ${t.plum       || '#3D1F5E'};
  --ink:        ${t.ink        || '#1A1208'};
  --ink2:       ${t.ink2       || '#2D2416'};
  --muted:      ${t.muted      || '#7A6A52'};
  --font-serif: '${t.fontSerif || 'Fraunces'}', Georgia, serif;
  --font-sans:  '${t.fontSans  || 'Outfit'}', system-ui, sans-serif;
  --radius:     ${t.radius     || 12}px;
  --radius-lg:  ${t.radiusLg   || 20}px;
  --radius-xl:  ${(t.radiusLg  || 20) + 4}px;
}`
  } catch {
    return '' // silently fall back to globals.css defaults
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const themeVars = await getThemeCSSVars()

  return (
    <html lang="en">
      <head>
        {themeVars && (
          <style
            id="tp-live-theme"
            dangerouslySetInnerHTML={{ __html: themeVars }}
          />
        )}
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
