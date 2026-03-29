'use client'
import { useEffect } from 'react'

export function ContentStyleInjector() {
  useEffect(() => {
    async function inject() {
      try {
        const res = await fetch('/api/admin/content', { cache: 'no-store' })
        const data = await res.json()
        
        // Inject content CSS vars
        if (data['content.css']) {
          let el = document.getElementById('tp-content-styles')
          if (!el) { el = document.createElement('style'); el.id = 'tp-content-styles'; document.head.appendChild(el) }
          el.textContent = data['content.css']
        }

        // Inject theme CSS vars  
        if (data['theme']) {
          const t = data['theme']
          const px = (v: any, d: number) => `${v ?? d}px`
          const co = (v: any, d: string) => v ?? d
          const nu = (v: any, d: number) => v ?? d
          const css = `:root {
  --cream: ${co(t.cream,'#FDF6EC')};
  --teal: ${co(t.teal,'#0A5F55')};
  --teal2: ${co(t.teal2,'#0D7A6D')};
  --teal3: ${co(t.teal3,'#12A090')};
  --coral: ${co(t.coral,'#E8512A')};
  --gold: ${co(t.gold,'#C9922A')};
  --gold2: ${co(t.gold2,'#E5B64A')};
  --plum: ${co(t.plum,'#3D1F5E')};
  --ink: ${co(t.ink,'#1A1208')};
  --muted: ${co(t.muted,'#7A6A52')};
  --font-serif: '${co(t.fontSerif,'Fraunces')}', Georgia, serif;
  --font-sans: '${co(t.fontSans,'Outfit')}', system-ui, sans-serif;
  --radius: ${px(t.radius,12)};
  --hero-bg: ${co(t.heroBg,'#FDF6EC')};
  --hero-h1-size: ${px(t.heroH1Size,84)};
  --hero-h1-color: ${co(t.heroH1Color,'#1A1208')};
  --hero-sub-size: ${px(t.heroSubSize,17)};
  --hero-sub-color: ${co(t.heroSubColor,'#7A6A52')};
  --nav-bg: ${co(t.navBg,'rgba(253,246,236,0.97)')};
  --nav-size: ${px(t.navSize,13)};
  --nav-color: ${co(t.navColor,'#7A6A52')};
  --stats-bg: ${co(t.statsBg,'#ffffff')};
  --stat-num-size: ${px(t.statNumSize,40)};
  --stat-num-color: ${co(t.statNumColor,'#1A1208')};
  --stat-label-color: ${co(t.statLabelColor,'#7A6A52')};
  --posts-bg: ${co(t.postsBg,'#FDF6EC')};
  --post-card-bg: ${co(t.postCardBg,'#ffffff')};
  --post-title-size: ${px(t.postTitleSize,20)};
  --post-title-color: ${co(t.postTitleColor,'#1A1208')};
  --post-excerpt-size: ${px(t.postExcerptSize,13)};
  --post-excerpt-color: ${co(t.postExcerptColor,'#7A6A52')};
  --post-cat-color: ${co(t.postCatColor,'#0A5F55')};
  --trending-bg: ${co(t.trendingBg,'#ffffff')};
  --trending-num-color: ${co(t.trendingNumColor,'#EDE0C8')};
  --community-bg: ${co(t.communityBg,'#ffffff')};
  --community-title-size: ${px(t.communityTitleSize,17)};
  --community-title-color: ${co(t.communityTitleColor,'#1A1208')};
  --cta-bg: ${co(t.ctaBg,'#0A5F55')};
  --cta-h2-size: ${px(t.ctaH2Size,38)};
  --cta-h2-color: ${co(t.ctaH2Color,'#1A1208')};
  --footer-bg: ${co(t.footerBg,'#0A5F55')};
  --footer-text-color: ${co(t.footerTextColor,'rgba(255,255,255,0.6)')};
  --footer-link-color: ${co(t.footerLinkColor,'#E5B64A')};
  --login-bg: ${co(t.loginBg,'#FDF6EC')};
  --login-card-bg: ${co(t.loginCardBg,'#ffffff')};
  --login-h1-size: ${px(t.loginH1Size,30)};
  --login-h1-color: ${co(t.loginH1Color,'#1A1208')};
  --register-bg: ${co(t.registerBg,'#FDF6EC')};
  --write-bg: ${co(t.writeBg,'#FDF6EC')};
  --post-page-bg: ${co(t.postPageBg,'#FDF6EC')};
  --post-page-title-size: ${px(t.postPageTitleSize,40)};
  --post-page-title-color: ${co(t.postPageTitleColor,'#1A1208')};
  --post-page-body-size: ${px(t.postPageBodySize,16)};
  --post-page-body-color: ${co(t.postPageBodyColor,'#1A1208')};
  --profile-bg: ${co(t.profileBg,'#FDF6EC')};
  --profile-name-size: ${px(t.profileNameSize,28)};
  --profile-name-color: ${co(t.profileNameColor,'#1A1208')};
  --admin-bg: ${co(t.adminBg,'#F8F4EE')};
  --admin-sidebar-bg: ${co(t.adminSidebarBg,'#1A1208')};
  --admin-sidebar-active: ${co(t.adminSidebarActive,'rgba(10,95,85,0.08)')};
  --admin-sidebar-active-color: ${co(t.adminSidebarActiveColor,'#0A5F55')};
  --error-bg: ${co(t.errorBg,'#FDF6EC')};
  --latest-posts-hero-bg: ${co(t.latestPostsHeroBg,'#0A5F55')};
  --trending-hero-bg: ${co(t.trendingHeroBg,'#E8512A')};
  --community-hero-bg: ${co(t.communityHeroBg,'#0A5F55')};
  --writers-hero-bg: ${co(t.writersHeroBg,'#0A5F55')};
  --edtech-hero-bg: ${co(t.edtechHeroBg,'#0A5F55')};
  --leadership-hero-bg: ${co(t.leadershipHeroBg,'#C9922A')};
  --innovation-hero-bg: ${co(t.innovationHeroBg,'#3D1F5E')};
  --profile-setup-bg: ${co(t.profileSetupBg,'#0D1117')};
  --profile-setup-accent: ${co(t.profileSetupAccent,'#64DCBE')};
}`
          let tel = document.getElementById('tp-live-theme')
          if (!tel) { tel = document.createElement('style'); tel.id = 'tp-live-theme'; document.head.appendChild(tel) }
          tel.textContent = css
        }
      } catch(e) { console.error('Style inject error:', e) }
    }
    inject()
  }, [])
  return null
}
