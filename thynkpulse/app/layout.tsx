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
    // Use DATABASE_URL directly — no self-fetch which fails during Vercel build
    const { default: db } = await import('@/lib/db')
    const res = await db.query("SELECT value FROM site_settings WHERE key = 'theme'")
    if (!res.rows.length) return ''
    const t = JSON.parse(res.rows[0].value)
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
  /* Typography scale */
  --size-base:     ${t.sizeBase    || 15}px;
  --size-h1:       ${t.sizeH1     || 56}px;
  --size-h2:       ${t.sizeH2     || 42}px;
  --size-h3:       ${t.sizeH3     || 28}px;
  --size-h4:       ${t.sizeH4     || 20}px;
  --size-small:    ${t.sizeSmall  || 13}px;
  --weight-body:   ${t.weightBody    || 300};
  --weight-heading:${t.weightHeading || 900};
  --weight-label:  ${t.weightLabel   || 600};
  --line-height:   ${(Number(t.lineHeight)||170)/100};
  /* Section-specific */
  --hero-h1-size:       ${t.heroH1       || 64}px;
  --hero-h1-color:      ${t.heroH1Color  || '#1A1208'};
  --hero-sub-size:      ${t.heroSubSize  || 16}px;
  --hero-sub-color:     ${t.heroSubColor || '#7A6A52'};
  --nav-size:           ${t.navSize      || 13}px;
  --nav-color:          ${t.navColor     || '#7A6A52'};
  --nav-weight:         ${t.navWeight    || 500};
  --post-title-size:    ${t.postTitleSize    || 20}px;
  --post-title-color:   ${t.postTitleColor   || '#1A1208'};
  --post-excerpt-size:  ${t.postExcerptSize  || 13}px;
  --post-excerpt-color: ${t.postExcerptColor || '#7A6A52'};
  --stat-num-size:      ${t.statNumSize   || 36}px;
  --stat-num-color:     ${t.statNumColor  || '#1A1208'};
  --stat-label-size:    ${t.statLabelSize || 11}px;
  --stat-label-color:   ${t.statLabelColor|| '#7A6A52'};
  --footer-bg:          ${t.footerBg         || '#0A5F55'};
  --footer-text-color:  ${t.footerTextColor   || 'rgba(255,255,255,0.6)'};
  --card-bg:            ${t.cardBg            || '#ffffff'};
  --card-border-color:  ${t.cardBorderColor   || 'rgba(10,95,85,0.12)'};
  --card-radius:        ${t.cardRadius        || 18}px;
  --cta-bg:             ${t.ctaBg             || '#0A5F55'};
  --cta-color:          ${t.ctaColor          || '#ffffff'};
  --cta-size:           ${t.ctaSize           || 15}px;
  /* Navbar */
  --nav-bg:             ${t.navBg             || 'rgba(253,246,236,0.97)'};
  --nav-size:           ${t.navSize           || 13}px;
  --nav-color:          ${t.navColor          || '#7A6A52'};
  --nav-weight:         ${t.navWeight         || 500};
  /* Hero */
  --hero-bg:            ${t.heroBg            || '#FDF6EC'};
  --hero-h1-size:       ${t.heroH1Size        || 64}px;
  --hero-h1-color:      ${t.heroH1Color       || '#1A1208'};
  --hero-sub-size:      ${t.heroSubSize       || 16}px;
  --hero-sub-color:     ${t.heroSubColor      || '#7A6A52'};
  --hero-sub-weight:    ${t.heroSubWeight     || 300};
  /* Stats */
  --stats-bg:           ${t.statsBg           || '#ffffff'};
  --stat-num-size:      ${t.statNumSize       || 36}px;
  --stat-num-color:     ${t.statNumColor      || '#1A1208'};
  --stat-label-size:    ${t.statLabelSize     || 11}px;
  --stat-label-color:   ${t.statLabelColor    || '#7A6A52'};
  /* Posts */
  --posts-bg:           ${t.postsBg           || '#FDF6EC'};
  --post-card-bg:       ${t.postCardBg        || '#ffffff'};
  --post-title-size:    ${t.postTitleSize     || 20}px;
  --post-title-color:   ${t.postTitleColor    || '#1A1208'};
  --post-excerpt-size:  ${t.postExcerptSize   || 13}px;
  --post-excerpt-color: ${t.postExcerptColor  || '#7A6A52'};
  --post-cat-color:     ${t.postCatColor      || '#0A5F55'};
  /* Trending */
  --trending-bg:        ${t.trendingBg        || '#ffffff'};
  --trending-num-color: ${t.trendingNumColor  || '#EDE0C8'};
  --trending-title-size:${t.trendingTitleSize || 17}px;
  --trending-title-color:${t.trendingTitleColor|| '#1A1208'};
  /* Community */
  --community-bg:       ${t.communityBg       || '#ffffff'};
  --community-title-size:${t.communityTitleSize|| 17}px;
  --community-title-color:${t.communityTitleColor|| '#1A1208'};
  --community-desc-size:${t.communityDescSize || 13}px;
  --community-desc-color:${t.communityDescColor|| '#7A6A52'};
  /* CTA */
  --cta-section-bg:     ${t.ctaSectionBg      || '#FDF6EC'};
  --cta-h2-size:        ${t.ctaH2Size         || 38}px;
  --cta-h2-color:       ${t.ctaH2Color        || '#1A1208'};
  /* Footer */
  --footer-bg:          ${t.footerBg          || '#0A5F55'};
  --footer-text-color:  ${t.footerTextColor   || 'rgba(255,255,255,0.6)'};
  --footer-link-color:  ${t.footerLinkColor   || '#E5B64A'};
  --footer-heading-color:${t.footerHeadingColor|| 'rgba(255,255,255,0.35)'};
  --footer-text-size:   ${t.footerTextSize    || 13}px;
  /* Login */
  --login-bg:           ${t.loginBg           || '#FDF6EC'};
  --login-card-bg:      ${t.loginCardBg       || '#ffffff'};
  --login-h1-size:      ${t.loginH1Size       || 30}px;
  --login-h1-color:     ${t.loginH1Color      || '#1A1208'};
  --login-label-size:   ${t.loginLabelSize    || 10}px;
  --login-label-color:  ${t.loginLabelColor   || '#7A6A52'};
  --login-input-bg:     ${t.loginInputBg      || '#ffffff'};
  --login-input-border: ${t.loginInputBorder  || '#EDE0C8'};
  /* Register */
  --register-bg:        ${t.registerBg        || '#FDF6EC'};
  --register-h1-size:   ${t.registerH1Size    || 28}px;
  --register-h1-color:  ${t.registerH1Color   || '#1A1208'};
  /* Write */
  --write-bg:           ${t.writeBg           || '#FDF6EC'};
  --write-title-size:   ${t.writeTitleSize    || 36}px;
  --write-title-color:  ${t.writeTitleColor   || '#1A1208'};
  /* Post detail */
  --post-page-bg:       ${t.postPageBg        || '#FDF6EC'};
  --post-page-title-size:${t.postPageTitleSize|| 40}px;
  --post-page-title-color:${t.postPageTitleColor|| '#1A1208'};
  --post-page-body-size:${t.postPageBodySize  || 16}px;
  --post-page-body-color:${t.postPageBodyColor|| '#1A1208'};
  --post-page-body-weight:${t.postPageBodyWeight|| 300};
  /* Profile */
  --profile-bg:         ${t.profileBg         || '#FDF6EC'};
  --profile-name-size:  ${t.profileNameSize   || 28}px;
  --profile-name-color: ${t.profileNameColor  || '#1A1208'};
  --profile-bio-size:   ${t.profileBioSize    || 14}px;
  --profile-bio-color:  ${t.profileBioColor   || '#7A6A52'};
}`
  } catch {
    return '' // fall back to globals.css defaults silently
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const themeVars = await getThemeCSSVars()

  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,900;1,600&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
        {/* Live theme override from DB (only when a custom theme is saved) */}
        {themeVars && (
          <style id="tp-live-theme" dangerouslySetInnerHTML={{ __html: themeVars }} />
        )}
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
