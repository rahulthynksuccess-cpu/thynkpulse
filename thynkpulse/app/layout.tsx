// app/layout.tsx  (ThynkPulse)
// Updated: added ChatbotWidget (AI chatbot) + WhatsApp floating button
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from './providers'
import { config } from '@/lib/config'
import { ContentStyleInjector } from '@/components/ContentStyleInjector'
import SessionTrackerWrapper from './SessionTrackerWrapper'
import ChatbotWidget from '@/components/chatbot/ChatbotWidget'

export const dynamic  = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: { default: `${config.app.name} -- ${config.app.tagline}`, template: `%s | ${config.app.name}` },
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

// ── WhatsApp config -- loaded from site_settings ───────────────────────────────
async function getWhatsAppNumber(): Promise<string | null> {
  try {
    const { default: db } = await import('@/lib/db')
    const res = await db.query("SELECT value FROM site_settings WHERE key = 'chatbot.whatsapp_number'")
    if (!res.rows.length) return null
    const val = JSON.parse(res.rows[0].value)
    return typeof val === 'string' && val.trim() ? val.trim() : null
  } catch {
    return null
  }
}

/* Load active theme from DB -- runs on every server render */
async function getThemeCSSVars(): Promise<string> {
  try {
    const { default: db } = await import('@/lib/db')
    const res = await db.query("SELECT value FROM site_settings WHERE key = 'theme'")
    if (!res.rows.length) return ''
    const t = JSON.parse(res.rows[0].value)
    const px = (v: any, d: number) => `${v ?? d}px`
    const co = (v: any, d: string) => v ?? d
    const nu = (v: any, d: number) => v ?? d

    return `:root:root {
  /* ── Global colours ── */
  --cream:      ${co(t.cream,      '#FDF6EC')};
  --cream2:     ${co(t.cream2,     '#F5ECD8')};
  --parchment:  ${co(t.parchment,  '#EDE0C8')};
  --teal:       ${co(t.teal,       '#0A5F55')};
  --teal2:      ${co(t.teal2,      '#0D7A6D')};
  --teal3:      ${co(t.teal3,      '#12A090')};
  --coral:      ${co(t.coral,      '#E8512A')};
  --coral2:     ${co(t.coral2,     '#F07250')};
  --gold:       ${co(t.gold,       '#C9922A')};
  --gold2:      ${co(t.gold2,      '#E5B64A')};
  --plum:       ${co(t.plum,       '#3D1F5E')};
  --ink:        ${co(t.ink,        '#1A1208')};
  --ink2:       ${co(t.ink2,       '#2D2416')};
  --muted:      ${co(t.muted,      '#7A6A52')};
  --border:     rgba(26,18,8,0.1);
  --border2:    rgba(26,18,8,0.06);

  /* ── Fonts ── */
  --font-serif: '${co(t.fontSerif,'Fraunces')}', Georgia, serif;
  --font-sans:  '${co(t.fontSans, 'Outfit')}', system-ui, sans-serif;
  --font-mono:  '${co(t.fontMono, 'JetBrains Mono')}', monospace;
  --radius:     ${px(t.radius,    12)};
  --radius-lg:  ${px(t.radiusLg,  20)};
  --radius-xl:  ${px(t.radiusLg ? t.radiusLg + 4 : 24, 24)};

  /* ── Typography ── */
  --size-base:      ${px(t.sizeBase,    15)};
  --size-h1:        ${px(t.sizeH1,      56)};
  --size-h2:        ${px(t.sizeH2,      42)};
  --size-h3:        ${px(t.sizeH3,      28)};
  --size-h4:        ${px(t.sizeH4,      20)};
  --size-small:     ${px(t.sizeSmall,   13)};
  --weight-body:    ${nu(t.weightBody,    300)};
  --weight-heading: ${nu(t.weightHeading, 900)};
  --line-height:    ${((t.lineHeight ?? 170) / 100)};

  /* ── Navbar ── */
  --nav-bg:     ${co(t.navBg,    'rgba(253,246,236,0.97)')};
  --nav-size:   ${px(t.navSize,  13)};
  --nav-color:  ${co(t.navColor, '#7A6A52')};
  --nav-weight: ${nu(t.navWeight, 500)};

  /* ── Hero ── */
  --hero-bg:         ${co(t.heroBg,       '#FDF6EC')};
  --hero-h1-size:    ${px(t.heroH1Size,   84)};
  --hero-h1-color:   ${co(t.heroH1Color,  '#1A1208')};
  --hero-sub-size:   ${px(t.heroSubSize,  17)};
  --hero-sub-color:  ${co(t.heroSubColor, '#7A6A52')};
  --hero-sub-weight: ${nu(t.heroSubWeight, 300)};

  /* ── Stats ── */
  --stats-bg:        ${co(t.statsBg,        '#ffffff')};
  --stat-num-size:   ${px(t.statNumSize,    40)};
  --stat-num-color:  ${co(t.statNumColor,   '#1A1208')};
  --stat-label-size: ${px(t.statLabelSize,  12)};
  --stat-label-color:${co(t.statLabelColor, '#7A6A52')};

  /* ── Posts feed ── */
  --posts-bg:          ${co(t.postsBg,          '#FDF6EC')};
  --post-card-bg:      ${co(t.postCardBg,        '#ffffff')};
  --post-title-size:   ${px(t.postTitleSize,     20)};
  --post-title-color:  ${co(t.postTitleColor,    '#1A1208')};
  --post-excerpt-size: ${px(t.postExcerptSize,   13)};
  --post-excerpt-color:${co(t.postExcerptColor,  '#7A6A52')};
  --post-cat-color:    ${co(t.postCatColor,      '#0A5F55')};
  --post-card-radius:  ${px(t.postCardRadius,    18)};
  --post-card-shadow:  0 ${nu(t.postCardShadow,1)}px ${nu(t.postCardShadow,1)*8}px rgba(26,18,8,0.06);

  /* ── Trending ── */
  --trending-bg:         ${co(t.trendingBg,         '#ffffff')};
  --trending-num-color:  ${co(t.trendingNumColor,   '#EDE0C8')};
  --trending-title-size: ${px(t.trendingTitleSize,   17)};
  --trending-title-color:${co(t.trendingTitleColor,  '#1A1208')};

  /* ── Community ── */
  --community-bg:         ${co(t.communityBg,         '#ffffff')};
  --community-title-size: ${px(t.communityTitleSize,   17)};
  --community-title-color:${co(t.communityTitleColor,  '#1A1208')};
  --community-desc-size:  ${px(t.communityDescSize,    13)};
  --community-desc-color: ${co(t.communityDescColor,   '#7A6A52')};

  /* ── CTA ── */
  --cta-section-bg: ${co(t.ctaSectionBg, '#FDF6EC')};
  --cta-bg:         ${co(t.ctaBg,        '#0A5F55')};
  --cta-color:      ${co(t.ctaColor,     '#ffffff')};
  --cta-size:       ${px(t.ctaSize,      15)};
  --cta-h2-size:    ${px(t.ctaH2Size,    38)};
  --cta-h2-color:   ${co(t.ctaH2Color,   '#1A1208')};

  /* ── Footer ── */
  --footer-bg:           ${co(t.footerBg,          '#0A5F55')};
  --footer-text-color:   ${co(t.footerTextColor,   'rgba(255,255,255,0.6)')};
  --footer-link-color:   ${co(t.footerLinkColor,   '#E5B64A')};
  --footer-heading-color:${co(t.footerHeadingColor,'rgba(255,255,255,0.35)')};
  --footer-text-size:    ${px(t.footerTextSize,     13)};

  /* ── Login ── */
  --login-bg:           ${co(t.loginBg,          '#FDF6EC')};
  --login-card-bg:      ${co(t.loginCardBg,       '#ffffff')};
  --login-h1-size:      ${px(t.loginH1Size,       30)};
  --login-h1-color:     ${co(t.loginH1Color,      '#1A1208')};
  --login-label-size:   ${px(t.loginLabelSize,    10)};
  --login-label-color:  ${co(t.loginLabelColor,   '#7A6A52')};
  --login-input-bg:     ${co(t.loginInputBg,      '#ffffff')};
  --login-input-border: ${co(t.loginInputBorder,  '#EDE0C8')};

  /* ── Register ── */
  --register-bg:      ${co(t.registerBg,       '#FDF6EC')};
  --register-h1-size: ${px(t.registerH1Size,   28)};
  --register-h1-color:${co(t.registerH1Color,  '#1A1208')};

  /* ── Write ── */
  --write-bg:         ${co(t.writeBg,         '#FDF6EC')};
  --write-title-size: ${px(t.writeTitleSize,   36)};
  --write-title-color:${co(t.writeTitleColor,  '#1A1208')};

  /* ── Post detail ── */
  --post-page-bg:          ${co(t.postPageBg,          '#FDF6EC')};
  --post-page-title-size:  ${px(t.postPageTitleSize,    40)};
  --post-page-title-color: ${co(t.postPageTitleColor,   '#1A1208')};
  --post-page-body-size:   ${px(t.postPageBodySize,     16)};
  --post-page-body-color:  ${co(t.postPageBodyColor,    '#1A1208')};
  --post-page-body-weight: ${nu(t.postPageBodyWeight,   300)};

  /* ── Profile ── */
  --profile-bg:        ${co(t.profileBg,        '#FDF6EC')};
  --profile-edit-bg:   ${co(t.profileEditBg,    '#FDF6EC')};
  --profile-name-size: ${px(t.profileNameSize,   28)};
  --profile-name-color:${co(t.profileNameColor,  '#1A1208')};
  --profile-bio-size:  ${px(t.profileBioSize,    14)};
  --profile-bio-color: ${co(t.profileBioColor,   '#7A6A52')};

  /* ── Profile Setup ── */
  --profile-setup-bg:     ${co(t.profileSetupBg,     '#0D1117')};
  --profile-setup-card:   ${co(t.profileSetupCardBg, 'rgba(255,255,255,0.06)')};
  --profile-setup-accent: ${co(t.profileSetupAccent, '#64DCBE')};

  /* ── Forgot / Reset ── */
  --forgot-bg:       ${co(t.forgotBg,      '#FDF6EC')};
  --forgot-card-bg:  ${co(t.forgotCardBg,  '#ffffff')};
  --forgot-h1-color: ${co(t.forgotH1Color, '#1A1208')};
  --reset-bg:        ${co(t.resetBg,       '#FDF6EC')};
  --reset-card-bg:   ${co(t.resetCardBg,   '#ffffff')};

  /* ── Admin ── */
  --admin-bg:                   ${co(t.adminBg,                 '#F8F4EE')};
  --admin-sidebar-bg:           ${co(t.adminSidebarBg,          '#ffffff')};
  --admin-sidebar-active:       ${co(t.adminSidebarActive,      'rgba(10,95,85,0.08)')};
  --admin-sidebar-active-color: ${co(t.adminSidebarActiveColor, '#0A5F55')};
  --admin-header-bg:            ${co(t.adminHeaderBg,           '#ffffff')};

  /* ── Error ── */
  --error-bg:       ${co(t.errorBg,      '#FDF6EC')};
  --error-h1-color: ${co(t.errorH1Color, '#1A1208')};

  /* ── Latest Posts page ── */
  --latest-posts-bg:            ${co(t.latestPostsBg,           '#FDF6EC')};
  --latest-posts-hero-bg:       ${co(t.latestPostsHeroBg,       '#0A5F55')};
  --latest-posts-hero-color:    ${co(t.latestPostsHeroColor,    '#ffffff')};
  --latest-posts-filter-bg:     ${co(t.latestPostsFilterBg,     '#ffffff')};
  --latest-posts-filter-active: ${co(t.latestPostsFilterActive, '#0A5F55')};

  /* ── Trending page ── */
  --trending-page-bg:    ${co(t.trendingPageBg,    '#ffffff')};
  --trending-hero-bg:    ${co(t.trendingHeroBg,    '#E8512A')};
  --trending-hero-color: ${co(t.trendingHeroColor, '#ffffff')};
  --trending-rank-color: ${co(t.trendingRankColor, '#EDE0C8')};
  --trending-tag-color:  ${co(t.trendingTagColor,  '#E8512A')};

  /* ── EdTech Articles page ── */
  --edtech-articles-bg:  ${co(t.edtechArticlesBg,  '#FDF6EC')};
  --edtech-hero-bg:      ${co(t.edtechHeroBg,      '#0A5F55')};
  --edtech-hero-color:   ${co(t.edtechHeroColor,   '#ffffff')};
  --edtech-pill-bg:      ${co(t.edtechPillBg,      '#ffffff')};
  --edtech-pill-border:  ${co(t.edtechPillBorder,  '#EDE0C8')};

  /* ── EdTech Stories page ── */
  --edtech-stories-bg:         ${co(t.edtechStoriesBg,         '#ffffff')};
  --edtech-stories-hero-bg:    ${co(t.edtechStoriesHeroBg,    '#3D1F5E')};
  --edtech-stories-hero-color: ${co(t.edtechStoriesHeroColor, '#ffffff')};
  --edtech-stories-accent:     ${co(t.edtechStoriesAccent,     '#3D1F5E')};
  --edtech-featured-bg:        ${co(t.edtechFeaturedBg,        '#ffffff')};

  /* ── School Leadership page ── */
  --leadership-bg:          ${co(t.leadershipBg,         '#FDF6EC')};
  --leadership-hero-bg:     ${co(t.leadershipHeroBg,     '#C9922A')};
  --leadership-hero-color:  ${co(t.leadershipHeroColor,  '#ffffff')};
  --leadership-pillar-bg:   ${co(t.leadershipPillarBg,   '#ffffff')};
  --leadership-accent:      ${co(t.leadershipAccent,      '#C9922A')};

  /* ── Innovation page ── */
  --innovation-bg:             ${co(t.innovationBg,            '#FDF6EC')};
  --innovation-hero-bg:        ${co(t.innovationHeroBg,        '#3D1F5E')};
  --innovation-hero-color:     ${co(t.innovationHeroColor,     '#ffffff')};
  --innovation-accent:         ${co(t.innovationAccent,         '#3D1F5E')};
  --innovation-tag-active-bg:  ${co(t.innovationTagActiveBg,   '#0A5F55')};

  /* ── Community page ── */
  --community-page-bg:         ${co(t.communityPageBg,         '#ffffff')};
  --community-hero-bg:         ${co(t.communityHeroBg,         '#0A5F55')};
  --community-hero-color:      ${co(t.communityHeroColor,      '#ffffff')};
  --community-stats-bg:        ${co(t.communityStatsBg,        '#ffffff')};
  --community-stats-num-color: ${co(t.communityStatsNumColor,  '#0A5F55')};

  /* ── Writers page ── */
  --writers-bg:           ${co(t.writersBg,          '#FDF6EC')};
  --writers-hero-bg:      ${co(t.writersHeroBg,      '#0A5F55')};
  --writers-hero-color:   ${co(t.writersHeroColor,   '#ffffff')};
  --writers-card-bg:      ${co(t.writersCardBg,      '#ffffff')};
  --writers-card-border:  ${co(t.writersCardBorder,  '#EDE0C8')};

  /* ── Privacy page ── */
  --privacy-bg:            ${co(t.privacyBg,           '#ffffff')};
  --privacy-hero-bg:       ${co(t.privacyHeroBg,       '#0A5F55')};
  --privacy-hero-color:    ${co(t.privacyHeroColor,    '#ffffff')};
  --privacy-heading-color: ${co(t.privacyHeadingColor, '#1A1208')};
  --privacy-body-color:    ${co(t.privacyBodyColor,    '#7A6A52')};

  /* ── Terms page ── */
  --terms-bg:            ${co(t.termsBg,           '#ffffff')};
  --terms-hero-bg:       ${co(t.termsHeroBg,       '#1A1208')};
  --terms-hero-color:    ${co(t.termsHeroColor,    '#ffffff')};
  --terms-heading-color: ${co(t.termsHeadingColor, '#1A1208')};
  --terms-body-color:    ${co(t.termsBodyColor,    '#7A6A52')};
}`
  } catch {
    return ''
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [themeVars, waNumber] = await Promise.all([
    getThemeCSSVars(),
    getWhatsAppNumber(),
  ])

  let contentCSS = ''
  try {
    const { default: db } = await import('@/lib/db')
    const res = await db.query("SELECT value FROM site_settings WHERE key = 'content.css'")
    if (res.rows.length) contentCSS = JSON.parse(res.rows[0].value)
  } catch {}

  // Build WhatsApp URL -- support plain numbers or full URLs
  const waHref = waNumber
    ? waNumber.startsWith('http')
      ? waNumber
      : `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi! I found you on ThynkPulse.')}`
    : null

  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,900;1,600&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
        {themeVars && <style id="tp-live-theme" dangerouslySetInnerHTML={{ __html: themeVars }} />}
        {contentCSS && <style id="tp-content-styles" dangerouslySetInnerHTML={{ __html: contentCSS }} />}

        {/* WhatsApp + Chatbot button spacing */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* When both WA and Chatbot are visible, offset them vertically */
          .tp-wa-btn  { position: fixed; bottom: 90px; right: 24px; z-index: 9998; }
          .tp-wa-btn  { transition: transform .2s; }
          .tp-wa-btn:hover { transform: scale(1.08); }
          @media (max-width: 480px) {
            .tp-wa-btn { bottom: 86px; right: 16px; }
          }
        `}} />
      </head>
      <body>
        <ContentStyleInjector />
        <SessionTrackerWrapper />
        <Providers>{children}</Providers>

        {/* ── AI Chatbot widget (appears on every public page) ── */}
        <ChatbotWidget />

        {/* ── WhatsApp floating button -- only when number configured in Admin → Integrations ── */}
        {waHref && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="tp-wa-btn"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              boxShadow: '0 4px 20px rgba(37,211,102,0.40)',
              textDecoration: 'none',
            }}>
            {/* WhatsApp SVG logo */}
            <svg viewBox="0 0 32 32" width="26" height="26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.67 4.61 1.833 6.504L4 29l7.699-1.816A11.93 11.93 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/>
              <path d="M16 4.8c-5.629 0-10.2 4.571-10.2 10.2 0 2.19.696 4.22 1.883 5.884L6.6 25.4l4.631-1.073A10.16 10.16 0 0016 25.2c5.629 0 10.2-4.571 10.2-10.2S21.629 4.8 16 4.8zm5.21 14.542c-.217.607-1.263 1.158-1.733 1.197-.47.04-.912.211-3.079-.643-2.61-1.04-4.28-3.71-4.41-3.882-.13-.173-1.057-1.41-1.057-2.69s.672-1.91.91-2.173c.237-.261.518-.326.69-.326h.497c.16 0 .375-.06.586.447.215.52.727 1.783.79 1.913.063.13.105.282.02.453-.086.173-.13.28-.26.43-.13.15-.274.337-.39.453-.13.13-.265.27-.114.53.15.26.668 1.105 1.435 1.79.985.878 1.817 1.15 2.077 1.28.26.13.41.108.56-.065.15-.173.643-.75.813-1.007.173-.26.345-.217.58-.13.237.087 1.503.709 1.762.838.26.13.433.195.497.303.065.108.065.62-.152 1.226z" fill="#25D366"/>
            </svg>
          </a>
        )}
      </body>
    </html>
  )
}
