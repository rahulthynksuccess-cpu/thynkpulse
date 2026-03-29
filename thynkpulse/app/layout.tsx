import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from './providers'
import { config } from '@/lib/config'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
  const themeVars = await getThemeCSSVars()

  // Also load content styles (font sizes, colours, button styles set in Content Manager)
  let contentCSS = ''
  try {
    const { default: db } = await import('@/lib/db')
    const res = await db.query("SELECT value FROM site_settings WHERE key = 'content.css'")
    if (res.rows.length) contentCSS = JSON.parse(res.rows[0].value)
  } catch {}

  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,900;1,600&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
        {/* Live theme from Theme Controller */}
        {themeVars && (
          <style id="tp-live-theme" dangerouslySetInnerHTML={{ __html: themeVars }} />
        )}
        {/* Live styles from Content Manager — overrides theme where set */}
        {contentCSS && (
          <style id="tp-content-styles" dangerouslySetInnerHTML={{ __html: contentCSS }} />
        )}
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
