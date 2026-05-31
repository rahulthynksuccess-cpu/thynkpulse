'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useQuery, useMutation } from '@tanstack/react-query'
import { RotateCcw, Loader2, Globe, Eye } from 'lucide-react'
import { apiGet, apiPost } from '@/lib/api'
import toast from 'react-hot-toast'

/* ─── Default theme ─── */
const DEFAULT: Record<string, any> = {
  /* Global colours */
  cream:'#FDF6EC', cream2:'#F5ECD8', parchment:'#EDE0C8',
  teal:'#0A5F55', teal2:'#0D7A6D', teal3:'#12A090',
  coral:'#E8512A', coral2:'#F07250', gold:'#C9922A', gold2:'#E5B64A',
  plum:'#3D1F5E', ink:'#1A1208', ink2:'#2D2416', muted:'#7A6A52',
  fontSerif:'Fraunces', fontSans:'Outfit', radius:12, radiusLg:20,
  /* Global typography */
  sizeBase:15, sizeH1:56, sizeH2:42, sizeH3:28, sizeSmall:13,
  weightBody:300, weightHeading:900, lineHeight:170,
  /* Navbar */
  navBg:'rgba(253,246,236,0.97)', navSize:13, navColor:'#7A6A52', navWeight:500,
  /* Hero */
  heroBg:'#FDF6EC', heroH1Size:64, heroH1Color:'#1A1208',
  heroSubSize:16, heroSubColor:'#7A6A52', heroSubWeight:300,
  /* Stats bar */
  statsBg:'#FFFFFF', statNumSize:36, statNumColor:'#1A1208',
  statLabelSize:11, statLabelColor:'#7A6A52',
  /* Posts section */
  postsBg:'#FDF6EC', postTitleSize:20, postTitleColor:'#1A1208',
  postExcerptSize:13, postExcerptColor:'#7A6A52',
  postCatColor:'#0A5F55', postCardBg:'#FFFFFF',
  /* Trending */
  trendingBg:'#FFFFFF', trendingNumColor:'#EDE0C8',
  trendingTitleSize:17, trendingTitleColor:'#1A1208',
  /* Community section */
  communityBg:'#FFFFFF', communityTitleSize:17, communityTitleColor:'#1A1208',
  communityDescSize:13, communityDescColor:'#7A6A52',
  /* CTA section */
  ctaSectionBg:'#FDF6EC', ctaH2Size:38, ctaH2Color:'#1A1208',
  ctaBg:'#0A5F55', ctaColor:'#FFFFFF', ctaSize:15,
  /* Footer */
  footerBg:'#0A5F55', footerTextColor:'rgba(255,255,255,0.6)',
  footerLinkColor:'#E5B64A', footerHeadingColor:'rgba(255,255,255,0.35)',
  footerTextSize:13,
  /* Login page */
  loginBg:'#FDF6EC', loginCardBg:'#FFFFFF',
  loginH1Size:30, loginH1Color:'#1A1208',
  loginLabelSize:10, loginLabelColor:'#7A6A52',
  loginInputBg:'#FFFFFF', loginInputBorder:'#EDE0C8',
  /* Register page */
  registerBg:'#FDF6EC', registerH1Size:28, registerH1Color:'#1A1208',
  /* Write page */
  writeBg:'#FDF6EC', writeTitleSize:36, writeTitleColor:'#1A1208',
  /* Post detail page */
  postPageBg:'#FDF6EC', postPageTitleSize:40, postPageTitleColor:'#1A1208',
  postPageBodySize:16, postPageBodyColor:'#1A1208', postPageBodyWeight:300,
  /* Profile page */
  profileBg:'#FDF6EC', profileNameSize:28, profileNameColor:'#1A1208',
  profileBioSize:14, profileBioColor:'#7A6A52',
  /* Forgot / Reset password */
  forgotBg:'#FDF6EC', forgotCardBg:'#ffffff', forgotH1Size:28, forgotH1Color:'#1A1208',
  /* Profile Setup */
  profileSetupBg:'#0D1117', profileSetupCardBg:'rgba(255,255,255,0.06)', profileSetupAccent:'#64DCBE',
  /* Profile Edit */
  profileEditBg:'#FDF6EC', profileEditCardBg:'#fff', profileEditH1Color:'#1A1208',
  /* Reset Password */
  resetBg:'#FDF6EC', resetCardBg:'#fff', resetH1Color:'#1A1208',
  /* Admin panel */
  adminBg:'#F8F4EE', adminSidebarBg:'#fff', adminSidebarActive:'rgba(10,95,85,0.08)',
  adminSidebarActiveColor:'#0A5F55', adminHeaderBg:'#fff',
  /* Post cards */
  postCardRadius:18, postCardShadow:1, postCardBorderWidth:1,
  /* Error page */
  errorBg:'#FDF6EC', errorH1Color:'#1A1208',
  /* Latest Posts page */
  latestPostsBg:'#FDF6EC', latestPostsHeroBg:'#0A5F55', latestPostsHeroColor:'#FFFFFF',
  latestPostsFilterBg:'#FFFFFF', latestPostsFilterActive:'#0A5F55',
  /* Trending page */
  trendingPageBg:'#FFFFFF', trendingHeroBg:'#E8512A', trendingHeroColor:'#FFFFFF',
  trendingRankColor:'#EDE0C8', trendingTagColor:'#E8512A',
  /* EdTech Articles page */
  edtechArticlesBg:'#FDF6EC', edtechHeroBg:'#0A5F55', edtechHeroColor:'#FFFFFF',
  edtechPillBg:'#FFFFFF', edtechPillBorder:'#EDE0C8',
  /* EdTech Stories page */
  edtechStoriesBg:'#FFFFFF', edtechStoriesHeroBg:'#3D1F5E', edtechStoriesHeroColor:'#FFFFFF',
  edtechStoriesAccent:'#3D1F5E', edtechFeaturedBg:'#FFFFFF',
  /* School Leadership page */
  leadershipBg:'#FDF6EC', leadershipHeroBg:'#C9922A', leadershipHeroColor:'#FFFFFF',
  leadershipPillarBg:'#FFFFFF', leadershipAccent:'#C9922A',
  /* Innovation page */
  innovationBg:'#FDF6EC', innovationHeroBg:'#3D1F5E', innovationHeroColor:'#FFFFFF',
  innovationAccent:'#3D1F5E', innovationTagActiveBg:'#0A5F55',
  /* Community page */
  communityPageBg:'#FFFFFF', communityHeroBg:'#0A5F55', communityHeroColor:'#FFFFFF',
  communityStatsBg:'#FFFFFF', communityStatsNumColor:'#0A5F55',
  /* Writers page */
  writersBg:'#FDF6EC', writersHeroBg:'#0A5F55', writersHeroColor:'#FFFFFF',
  writersCardBg:'#FFFFFF', writersCardBorder:'#EDE0C8',
  /* Privacy page */
  privacyBg:'#FFFFFF', privacyHeroBg:'#0A5F55', privacyHeroColor:'#FFFFFF',
  privacyHeadingColor:'#1A1208', privacyBodyColor:'#7A6A52',
  /* Terms page */
  termsBg:'#FFFFFF', termsHeroBg:'#1A1208', termsHeroColor:'#FFFFFF',
  termsHeadingColor:'#1A1208', termsBodyColor:'#7A6A52',
}

/* ─── Pages/sections structure ─── */
const PAGES = [
  {
    label: '🌐 Global',
    sections: [
      { key: 'global-colours',    label: 'Colour Palette' },
      { key: 'global-typography', label: 'Typography Scale' },
      { key: 'global-fonts',      label: 'Fonts & Radius' },
    ]
  },
  {
    label: '🏠 Homepage',
    sections: [
      { key: 'navbar',      label: 'Navbar' },
      { key: 'hero',        label: 'Hero Section' },
      { key: 'stats',       label: 'Stats Bar' },
      { key: 'posts',       label: 'Posts Feed' },
      { key: 'trending',    label: 'Trending' },
      { key: 'community',   label: 'Community Cards' },
      { key: 'cta',         label: 'CTA Section' },
      { key: 'footer',      label: 'Footer' },
    ]
  },
  {
    label: '🔐 Login Page',
    sections: [{ key: 'login', label: 'Login Page' }]
  },
  {
    label: '📝 Register Page',
    sections: [{ key: 'register', label: 'Register Page' }]
  },
  {
    label: '✍️ Write Page',
    sections: [{ key: 'write', label: 'Write Page' }]
  },
  {
    label: '📄 Post Detail',
    sections: [{ key: 'post-detail', label: 'Post Detail Page' }]
  },
  {
    label: '👤 Profile Page',
    sections: [{ key: 'profile', label: 'Profile Page' }]
  },
  {
    label: '🔑 Forgot / Reset',
    sections: [{ key: 'forgot-password', label: 'Forgot & Reset Password' }]
  },
  {
    label: '🃏 Post Cards',
    sections: [{ key: 'post-cards', label: 'Post Card Styling' }]
  },
  {
    label: '🚫 Error / 404',
    sections: [{ key: 'error-page', label: 'Error Page' }]
  },
  {
    label: '🆕 Profile Setup',
    sections: [{ key: 'profile-setup', label: 'Profile Setup Page' }]
  },
  {
    label: '✏️ Profile Edit',
    sections: [{ key: 'profile-edit', label: 'Profile Edit Page' }]
  },
  {
    label: '🔑 Reset Password',
    sections: [{ key: 'reset-password', label: 'Reset Password Page' }]
  },
  {
    label: '🛡️ Admin Panel',
    sections: [
      { key: 'admin-dashboard', label: 'Admin Dashboard' },
      { key: 'admin-dashboard', label: 'Admin Dashboard' },
      { key: 'admin-sidebar',   label: 'Admin Sidebar' },
    ]
  },
  {
    label: '📰 Latest Posts Page',
    sections: [{ key: 'latest-posts', label: 'Latest Posts Page' }],
  },
  {
    label: '🔥 Trending Page',
    sections: [{ key: 'trending-page', label: 'Trending Now Page' }],
  },
  {
    label: '💡 EdTech Articles',
    sections: [{ key: 'edtech-articles', label: 'EdTech Articles Page' }],
  },
  {
    label: '✍️ EdTech Stories',
    sections: [{ key: 'edtech-stories-page', label: 'EdTech Stories Page' }],
  },
  {
    label: '🏆 School Leadership',
    sections: [{ key: 'school-leadership', label: 'School Leadership Page' }],
  },
  {
    label: '🚀 Innovation Page',
    sections: [{ key: 'innovation-page', label: 'Innovation Page' }],
  },
  {
    label: '🤝 Community Page',
    sections: [{ key: 'community-page', label: 'Community Hub Page' }],
  },
  {
    label: '📖 Writers Directory',
    sections: [{ key: 'writers-page', label: 'Writers Directory Page' }],
  },
  {
    label: '🔒 Privacy Policy',
    sections: [{ key: 'privacy-page', label: 'Privacy Policy Page' }],
  },
  {
    label: '📋 Terms of Use',
    sections: [{ key: 'terms-page', label: 'Terms of Use Page' }],
  },
]

/* ─── Helpers ─── */
const inp: React.CSSProperties = { width:'100%', padding:'8px 11px', border:'1.5px solid var(--parchment)', borderRadius:'8px', fontSize:'12px', fontFamily:'var(--font-sans)', color:'var(--ink)', outline:'none', background:'#fff', boxSizing:'border-box' as const }
const lbl: React.CSSProperties = { fontSize:'10px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' as const, color:'var(--muted)', fontFamily:'var(--font-mono)', marginBottom:'5px', display:'block' }
const row: React.CSSProperties = { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid rgba(10,95,85,.04)' }

function ColorPicker({ label, k, t, onChange }: { label:string; k:string; t:any; onChange:(k:string,v:any)=>void }) {
  return (
    <div style={row}>
      <span style={{ fontSize:'12px', color:'var(--ink)', fontFamily:'var(--font-sans)' }}>{label}</span>
      <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
        <input type="color" value={String(t[k]||'#000000')} onChange={e=>onChange(k,e.target.value)}
          style={{ width:22, height:22, borderRadius:'5px', border:'1.5px solid var(--parchment)', cursor:'pointer', padding:'1px', background:'none' }} />
        <input type="text" value={String(t[k]||'')} onChange={e=>onChange(k,e.target.value)}
          style={{ ...inp, width:'80px', fontSize:'10px', fontFamily:'monospace', padding:'3px 6px' }} />
      </div>
    </div>
  )
}

function SliderRow({ label, k, min, max, unit='px', t, onChange }: any) {
  return (
    <div style={{ marginBottom:'12px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
        <span style={{ fontSize:'12px', color:'var(--ink)', fontFamily:'var(--font-sans)' }}>{label}</span>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', fontWeight:700, color:'var(--teal)' }}>{t[k]}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={Number(t[k]||min)}
        onChange={e=>onChange(k,Number(e.target.value))} style={{ width:'100%', accentColor:'var(--teal)' }} />
    </div>
  )
}

function WeightSelect({ label, k, t, onChange }: any) {
  return (
    <div style={{ marginBottom:'10px' }}>
      <label style={{ ...lbl, marginBottom:'4px' }}>{label}</label>
      <select value={String(t[k]||300)} onChange={e=>onChange(k,Number(e.target.value))} style={inp}>
        {[300,400,500,600,700,800,900].map(w=><option key={w} value={w}>{w}</option>)}
      </select>
    </div>
  )
}

function SectionControls({ section, t, onChange }: { section:string; t:any; onChange:(k:string,v:any)=>void }) {
  switch(section) {

    case 'global-colours': return (
      <div>
        <p style={{ fontSize:'12px', color:'var(--muted)', marginBottom:'14px', fontFamily:'var(--font-sans)' }}>These colours apply across the entire site unless overridden per-section.</p>
        {[
          ['cream','Page Background'],['cream2','Alt Background'],['parchment','Borders'],
          ['teal','Primary Colour'],['teal2','Primary Hover'],['teal3','Primary Light'],
          ['coral','Accent Colour'],['gold','Highlight'],
          ['ink','Text Primary'],['ink2','Text Secondary'],['muted','Text Muted'],
        ].map(([k,l])=><ColorPicker key={k} label={l} k={k} t={t} onChange={onChange} />)}
      </div>
    )

    case 'global-typography': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
        <div>
          <div style={{ ...lbl, marginBottom:'12px' }}>Font Sizes</div>
          <SliderRow label="Body text"  k="sizeBase" min={12} max={20} t={t} onChange={onChange} />
          <SliderRow label="H1"         k="sizeH1"   min={28} max={96} t={t} onChange={onChange} />
          <SliderRow label="H2"         k="sizeH2"   min={22} max={72} t={t} onChange={onChange} />
          <SliderRow label="H3"         k="sizeH3"   min={16} max={48} t={t} onChange={onChange} />
          <SliderRow label="Small"      k="sizeSmall" min={10} max={16} t={t} onChange={onChange} />
        </div>
        <div>
          <div style={{ ...lbl, marginBottom:'12px' }}>Weights & Spacing</div>
          <WeightSelect label="Body weight"    k="weightBody"    t={t} onChange={onChange} />
          <WeightSelect label="Heading weight" k="weightHeading" t={t} onChange={onChange} />
          <SliderRow label="Line height" k="lineHeight" min={130} max={220} unit="%" t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'global-fonts': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <label style={lbl}>Heading font</label>
          <select value={String(t.fontSerif)} onChange={e=>onChange('fontSerif',e.target.value)} style={{ ...inp, marginBottom:'12px' }}>
            {['Fraunces','Playfair Display','Cormorant Garamond','EB Garamond','Lora','DM Serif Display','Merriweather'].map(f=><option key={f}>{f}</option>)}
          </select>
          <label style={lbl}>Body font</label>
          <select value={String(t.fontSans)} onChange={e=>onChange('fontSans',e.target.value)} style={inp}>
            {['Outfit','Inter','DM Sans','Plus Jakarta Sans','Nunito','Poppins','Manrope'].map(f=><option key={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <SliderRow label="Base corner radius" k="radius"   min={0}  max={24} t={t} onChange={onChange} />
          <SliderRow label="Large corner radius" k="radiusLg" min={8}  max={36} t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'navbar': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Navbar background" k="navBg"    t={t} onChange={onChange} />
          <ColorPicker label="Link colour"        k="navColor" t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="Link font size" k="navSize"   min={11} max={18} t={t} onChange={onChange} />
          <WeightSelect label="Link weight" k="navWeight" t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'hero': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Background"         k="heroBg"         t={t} onChange={onChange} />
          <ColorPicker label="H1 headline colour" k="heroH1Color"    t={t} onChange={onChange} />
          <ColorPicker label="Sub text colour"    k="heroSubColor"   t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="H1 font size"   k="heroH1Size"  min={32} max={96} t={t} onChange={onChange} />
          <SliderRow label="Sub font size"  k="heroSubSize" min={13} max={24} t={t} onChange={onChange} />
          <WeightSelect label="Sub weight"  k="heroSubWeight" t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'stats': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Bar background"  k="statsBg"       t={t} onChange={onChange} />
          <ColorPicker label="Number colour"   k="statNumColor"  t={t} onChange={onChange} />
          <ColorPicker label="Label colour"    k="statLabelColor" t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="Number size" k="statNumSize"   min={20} max={60} t={t} onChange={onChange} />
          <SliderRow label="Label size"  k="statLabelSize" min={9}  max={18} t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'posts': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Section background" k="postsBg"          t={t} onChange={onChange} />
          <ColorPicker label="Card background"    k="postCardBg"       t={t} onChange={onChange} />
          <ColorPicker label="Title colour"       k="postTitleColor"   t={t} onChange={onChange} />
          <ColorPicker label="Excerpt colour"     k="postExcerptColor" t={t} onChange={onChange} />
          <ColorPicker label="Category colour"    k="postCatColor"     t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="Title font size"   k="postTitleSize"   min={14} max={32} t={t} onChange={onChange} />
          <SliderRow label="Excerpt font size" k="postExcerptSize" min={11} max={18} t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'trending': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Section background" k="trendingBg"        t={t} onChange={onChange} />
          <ColorPicker label="Number colour"      k="trendingNumColor"  t={t} onChange={onChange} />
          <ColorPicker label="Title colour"       k="trendingTitleColor" t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="Title font size" k="trendingTitleSize" min={13} max={24} t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'community': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Section background" k="communityBg"         t={t} onChange={onChange} />
          <ColorPicker label="Card title colour"  k="communityTitleColor" t={t} onChange={onChange} />
          <ColorPicker label="Description colour" k="communityDescColor"  t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="Card title size" k="communityTitleSize" min={13} max={24} t={t} onChange={onChange} />
          <SliderRow label="Description size" k="communityDescSize" min={11} max={17} t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'cta': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Section background" k="ctaSectionBg" t={t} onChange={onChange} />
          <ColorPicker label="Headline colour"    k="ctaH2Color"   t={t} onChange={onChange} />
          <ColorPicker label="Button background"  k="ctaBg"        t={t} onChange={onChange} />
          <ColorPicker label="Button text"        k="ctaColor"     t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="Headline size" k="ctaH2Size" min={24} max={60} t={t} onChange={onChange} />
          <SliderRow label="Button size"   k="ctaSize"   min={12} max={22} t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'footer': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Background"      k="footerBg"          t={t} onChange={onChange} />
          <ColorPicker label="Body text"       k="footerTextColor"   t={t} onChange={onChange} />
          <ColorPicker label="Link colour"     k="footerLinkColor"   t={t} onChange={onChange} />
          <ColorPicker label="Heading colour"  k="footerHeadingColor" t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="Text size" k="footerTextSize" min={11} max={16} t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'login': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background"  k="loginBg"          t={t} onChange={onChange} />
          <ColorPicker label="Card background"  k="loginCardBg"      t={t} onChange={onChange} />
          <ColorPicker label="Headline colour"  k="loginH1Color"     t={t} onChange={onChange} />
          <ColorPicker label="Label colour"     k="loginLabelColor"  t={t} onChange={onChange} />
          <ColorPicker label="Input background" k="loginInputBg"     t={t} onChange={onChange} />
          <ColorPicker label="Input border"     k="loginInputBorder" t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="Headline size" k="loginH1Size"    min={20} max={48} t={t} onChange={onChange} />
          <SliderRow label="Label size"    k="loginLabelSize" min={9}  max={14} t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'register': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background" k="registerBg"       t={t} onChange={onChange} />
          <ColorPicker label="Headline colour" k="registerH1Color"  t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="Headline size" k="registerH1Size" min={20} max={48} t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'write': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background"    k="writeBg"         t={t} onChange={onChange} />
          <ColorPicker label="Title placeholder"  k="writeTitleColor" t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="Title font size" k="writeTitleSize" min={24} max={56} t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'post-detail': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background"  k="postPageBg"         t={t} onChange={onChange} />
          <ColorPicker label="Title colour"     k="postPageTitleColor" t={t} onChange={onChange} />
          <ColorPicker label="Body text colour" k="postPageBodyColor"  t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="Title font size"    k="postPageTitleSize"  min={24} max={64} t={t} onChange={onChange} />
          <SliderRow label="Body font size"     k="postPageBodySize"   min={13} max={22} t={t} onChange={onChange} />
          <WeightSelect label="Body weight"     k="postPageBodyWeight" t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'profile': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background" k="profileBg"        t={t} onChange={onChange} />
          <ColorPicker label="Name colour"     k="profileNameColor" t={t} onChange={onChange} />
          <ColorPicker label="Bio colour"      k="profileBioColor"  t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="Name font size" k="profileNameSize" min={20} max={48} t={t} onChange={onChange} />
          <SliderRow label="Bio font size"  k="profileBioSize"  min={12} max={20} t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'forgot-password': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background"  k="forgotBg"      t={t} onChange={onChange} />
          <ColorPicker label="Card background"  k="forgotCardBg"  t={t} onChange={onChange} />
          <ColorPicker label="Heading colour"   k="forgotH1Color" t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="Heading size" k="forgotH1Size" min={20} max={48} t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'post-cards': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Card background"     k="postCardBg"           t={t} onChange={onChange} />
          <ColorPicker label="Title colour"        k="postTitleColor"       t={t} onChange={onChange} />
          <ColorPicker label="Excerpt colour"      k="postExcerptColor"     t={t} onChange={onChange} />
          <ColorPicker label="Category tag colour" k="postCatColor"         t={t} onChange={onChange} />
          <ColorPicker label="Feed background"     k="postsBg"              t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="Title font size"   k="postTitleSize"   min={14} max={32} t={t} onChange={onChange} />
          <SliderRow label="Excerpt font size" k="postExcerptSize" min={11} max={18} t={t} onChange={onChange} />
          <SliderRow label="Card border radius" k="postCardRadius" min={0}  max={32} t={t} onChange={onChange} />
          <SliderRow label="Card shadow"        k="postCardShadow" min={0}  max={5}  t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'error-page': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background" k="errorBg"      t={t} onChange={onChange} />
          <ColorPicker label="Heading colour"  k="errorH1Color" t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'forgot-password': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background" k="forgotBg"      t={t} onChange={onChange} />
          <ColorPicker label="Card background" k="forgotCardBg"  t={t} onChange={onChange} />
          <ColorPicker label="Heading colour"  k="forgotH1Color" t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="Heading size" k="forgotH1Size" min={20} max={48} t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'post-cards': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Card background"     k="postCardBg"       t={t} onChange={onChange} />
          <ColorPicker label="Title colour"        k="postTitleColor"   t={t} onChange={onChange} />
          <ColorPicker label="Excerpt colour"      k="postExcerptColor" t={t} onChange={onChange} />
          <ColorPicker label="Category colour"     k="postCatColor"     t={t} onChange={onChange} />
          <ColorPicker label="Feed background"     k="postsBg"          t={t} onChange={onChange} />
        </div>
        <div>
          <SliderRow label="Title size"    k="postTitleSize"   min={14} max={32} t={t} onChange={onChange} />
          <SliderRow label="Excerpt size"  k="postExcerptSize" min={11} max={18} t={t} onChange={onChange} />
          <SliderRow label="Card radius"   k="postCardRadius"  min={0}  max={32} t={t} onChange={onChange} />
          <SliderRow label="Card shadow"   k="postCardShadow"  min={0}  max={5}  t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'error-page': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background" k="errorBg"      t={t} onChange={onChange} />
          <ColorPicker label="Heading colour"  k="errorH1Color" t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'profile-setup': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background"   k="profileSetupBg"       t={t} onChange={onChange} />
          <ColorPicker label="Card background"   k="profileSetupCardBg"   t={t} onChange={onChange} />
          <ColorPicker label="Accent / highlight" k="profileSetupAccent"  t={t} onChange={onChange} />
        </div>
        <div>
          <p style={{ fontSize:'12px', color:'var(--muted)', fontFamily:'var(--font-sans)', lineHeight:1.6 }}>
            Controls the dark multi-step profile setup page colours.
            The accent colour affects the progress bar, active step, and CTA button.
          </p>
        </div>
      </div>
    )

    case 'profile-edit': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background" k="profileEditBg"       t={t} onChange={onChange} />
          <ColorPicker label="Card background" k="profileEditCardBg"   t={t} onChange={onChange} />
          <ColorPicker label="Heading colour"  k="profileEditH1Color"  t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'reset-password': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background" k="resetBg"      t={t} onChange={onChange} />
          <ColorPicker label="Card background" k="resetCardBg"  t={t} onChange={onChange} />
          <ColorPicker label="Heading colour"  k="resetH1Color" t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'admin-dashboard': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background"  k="adminBg"        t={t} onChange={onChange} />
          <ColorPicker label="Card background"  k="adminHeaderBg"  t={t} onChange={onChange} />
        </div>
        <div>
          <p style={{ fontSize:'12px', color:'var(--muted)', fontFamily:'var(--font-sans)', lineHeight:1.6 }}>
            Controls the admin panel background and card colours across all admin pages.
          </p>
        </div>
      </div>
    )

    case 'admin-sidebar': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Sidebar background"    k="adminSidebarBg"          t={t} onChange={onChange} />
          <ColorPicker label="Active item bg"        k="adminSidebarActive"      t={t} onChange={onChange} />
          <ColorPicker label="Active item text"      k="adminSidebarActiveColor" t={t} onChange={onChange} />
        </div>
      </div>
    )


    case 'latest-posts': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background"    k="latestPostsBg"         t={t} onChange={onChange} />
          <ColorPicker label="Hero background"    k="latestPostsHeroBg"     t={t} onChange={onChange} />
          <ColorPicker label="Hero text colour"   k="latestPostsHeroColor"  t={t} onChange={onChange} />
        </div>
        <div>
          <ColorPicker label="Filter bar background"  k="latestPostsFilterBg"     t={t} onChange={onChange} />
          <ColorPicker label="Active filter colour"   k="latestPostsFilterActive" t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'trending-page': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background"   k="trendingPageBg"    t={t} onChange={onChange} />
          <ColorPicker label="Hero background"   k="trendingHeroBg"    t={t} onChange={onChange} />
          <ColorPicker label="Hero text colour"  k="trendingHeroColor" t={t} onChange={onChange} />
        </div>
        <div>
          <ColorPicker label="Rank number colour"  k="trendingRankColor" t={t} onChange={onChange} />
          <ColorPicker label="Category tag colour" k="trendingTagColor"  t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'edtech-articles': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background"   k="edtechArticlesBg"    t={t} onChange={onChange} />
          <ColorPicker label="Hero background"   k="edtechHeroBg"        t={t} onChange={onChange} />
          <ColorPicker label="Hero text colour"  k="edtechHeroColor"     t={t} onChange={onChange} />
        </div>
        <div>
          <ColorPicker label="Topic pill background" k="edtechPillBg"     t={t} onChange={onChange} />
          <ColorPicker label="Topic pill border"     k="edtechPillBorder" t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'edtech-stories-page': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background"    k="edtechStoriesBg"       t={t} onChange={onChange} />
          <ColorPicker label="Hero background"    k="edtechStoriesHeroBg"   t={t} onChange={onChange} />
          <ColorPicker label="Hero text colour"   k="edtechStoriesHeroColor" t={t} onChange={onChange} />
        </div>
        <div>
          <ColorPicker label="Accent / heading colour" k="edtechStoriesAccent"  t={t} onChange={onChange} />
          <ColorPicker label="Featured card background" k="edtechFeaturedBg"   t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'school-leadership': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background"    k="leadershipBg"       t={t} onChange={onChange} />
          <ColorPicker label="Hero background"    k="leadershipHeroBg"   t={t} onChange={onChange} />
          <ColorPicker label="Hero text colour"   k="leadershipHeroColor" t={t} onChange={onChange} />
        </div>
        <div>
          <ColorPicker label="Pillar card background" k="leadershipPillarBg" t={t} onChange={onChange} />
          <ColorPicker label="Accent colour (gold)"   k="leadershipAccent"   t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'innovation-page': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background"    k="innovationBg"       t={t} onChange={onChange} />
          <ColorPicker label="Hero background"    k="innovationHeroBg"   t={t} onChange={onChange} />
          <ColorPicker label="Hero text colour"   k="innovationHeroColor" t={t} onChange={onChange} />
        </div>
        <div>
          <ColorPicker label="Accent / tag colour"      k="innovationAccent"       t={t} onChange={onChange} />
          <ColorPicker label="Active tag background"    k="innovationTagActiveBg"  t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'community-page': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background"   k="communityPageBg"        t={t} onChange={onChange} />
          <ColorPicker label="Hero background"   k="communityHeroBg"        t={t} onChange={onChange} />
          <ColorPicker label="Hero text colour"  k="communityHeroColor"     t={t} onChange={onChange} />
        </div>
        <div>
          <ColorPicker label="Stats bar background"  k="communityStatsBg"        t={t} onChange={onChange} />
          <ColorPicker label="Stats number colour"   k="communityStatsNumColor"  t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'writers-page': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background"   k="writersBg"       t={t} onChange={onChange} />
          <ColorPicker label="Hero background"   k="writersHeroBg"   t={t} onChange={onChange} />
          <ColorPicker label="Hero text colour"  k="writersHeroColor" t={t} onChange={onChange} />
        </div>
        <div>
          <ColorPicker label="Writer card background" k="writersCardBg"     t={t} onChange={onChange} />
          <ColorPicker label="Writer card border"     k="writersCardBorder" t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'privacy-page': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background"   k="privacyBg"          t={t} onChange={onChange} />
          <ColorPicker label="Hero background"   k="privacyHeroBg"      t={t} onChange={onChange} />
          <ColorPicker label="Hero text colour"  k="privacyHeroColor"   t={t} onChange={onChange} />
        </div>
        <div>
          <ColorPicker label="Section heading colour" k="privacyHeadingColor" t={t} onChange={onChange} />
          <ColorPicker label="Body text colour"       k="privacyBodyColor"    t={t} onChange={onChange} />
        </div>
      </div>
    )

    case 'terms-page': return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <ColorPicker label="Page background"   k="termsBg"          t={t} onChange={onChange} />
          <ColorPicker label="Hero background"   k="termsHeroBg"      t={t} onChange={onChange} />
          <ColorPicker label="Hero text colour"  k="termsHeroColor"   t={t} onChange={onChange} />
        </div>
        <div>
          <ColorPicker label="Section heading colour" k="termsHeadingColor" t={t} onChange={onChange} />
          <ColorPicker label="Body text colour"       k="termsBodyColor"    t={t} onChange={onChange} />
        </div>
      </div>
    )

    default: return <div style={{ color:'var(--muted)', fontSize:'13px', fontFamily:'var(--font-sans)', padding:'20px 0' }}>Select a section from the left.</div>
  }
}

function applyToDom(t: Record<string,any>) {
  if (typeof document === 'undefined') return
  const r = document.documentElement
  const s = (k:string, v:string) => r.style.setProperty(k, v)
  // Colours
  const cols = ['cream','cream2','parchment','teal','teal2','teal3','coral','coral2','gold','gold2','plum','ink','ink2','muted']
  cols.forEach(k => { if (t[k]) s(`--${k}`, String(t[k])) })
  s('--radius',    `${t.radius||12}px`)
  s('--radius-lg', `${t.radiusLg||20}px`)
  s('--radius-xl', `${(t.radiusLg||20)+4}px`)
  if (t.fontSerif) s('--font-serif', `'${t.fontSerif}', Georgia, serif`)
  if (t.fontSans)  s('--font-sans',  `'${t.fontSans}', system-ui, sans-serif`)
  // Typography
  s('--size-base',      `${t.sizeBase||15}px`)
  s('--size-h1',        `${t.sizeH1||56}px`)
  s('--size-h2',        `${t.sizeH2||42}px`)
  s('--size-h3',        `${t.sizeH3||28}px`)
  s('--size-small',     `${t.sizeSmall||13}px`)
  s('--weight-body',    String(t.weightBody||300))
  s('--weight-heading', String(t.weightHeading||900))
  s('--line-height',    String((t.lineHeight||170)/100))
  // Section vars
  s('--nav-bg',            String(t.navBg||'rgba(253,246,236,0.97)'))
  s('--nav-size',          `${t.navSize||13}px`)
  s('--nav-color',         String(t.navColor||'var(--muted)'))
  s('--nav-weight',        String(t.navWeight||500))
  s('--hero-bg',           String(t.heroBg||'var(--cream)'))
  s('--hero-h1-size',      `${t.heroH1Size||64}px`)
  s('--hero-h1-color',     String(t.heroH1Color||'var(--ink)'))
  s('--hero-sub-size',     `${t.heroSubSize||16}px`)
  s('--hero-sub-color',    String(t.heroSubColor||'var(--muted)'))
  s('--hero-sub-weight',   String(t.heroSubWeight||300))
  s('--stats-bg',          String(t.statsBg||'#fff'))
  s('--stat-num-size',     `${t.statNumSize||36}px`)
  s('--stat-num-color',    String(t.statNumColor||'var(--ink)'))
  s('--stat-label-size',   `${t.statLabelSize||11}px`)
  s('--stat-label-color',  String(t.statLabelColor||'var(--muted)'))
  s('--posts-bg',          String(t.postsBg||'var(--cream)'))
  s('--post-card-bg',      String(t.postCardBg||'#fff'))
  s('--post-title-size',   `${t.postTitleSize||20}px`)
  s('--post-title-color',  String(t.postTitleColor||'var(--ink)'))
  s('--post-excerpt-size', `${t.postExcerptSize||13}px`)
  s('--post-excerpt-color',String(t.postExcerptColor||'var(--muted)'))
  s('--post-cat-color',    String(t.postCatColor||'var(--teal)'))
  s('--trending-bg',       String(t.trendingBg||'#fff'))
  s('--trending-num-color',String(t.trendingNumColor||'var(--parchment)'))
  s('--trending-title-size',`${t.trendingTitleSize||17}px`)
  s('--trending-title-color',String(t.trendingTitleColor||'var(--ink)'))
  s('--community-bg',      String(t.communityBg||'#fff'))
  s('--community-title-size',`${t.communityTitleSize||17}px`)
  s('--community-title-color',String(t.communityTitleColor||'var(--ink)'))
  s('--community-desc-size', `${t.communityDescSize||13}px`)
  s('--community-desc-color',String(t.communityDescColor||'var(--muted)'))
  s('--cta-section-bg',    String(t.ctaSectionBg||'var(--cream)'))
  s('--cta-h2-size',       `${t.ctaH2Size||38}px`)
  s('--cta-h2-color',      String(t.ctaH2Color||'var(--ink)'))
  s('--cta-bg',            String(t.ctaBg||'var(--teal)'))
  s('--cta-color',         String(t.ctaColor||'#fff'))
  s('--cta-size',          `${t.ctaSize||15}px`)
  s('--footer-bg',         String(t.footerBg||'var(--teal)'))
  s('--footer-text-color', String(t.footerTextColor||'rgba(255,255,255,0.6)'))
  s('--footer-link-color', String(t.footerLinkColor||'var(--gold2)'))
  s('--footer-heading-color',String(t.footerHeadingColor||'rgba(255,255,255,0.35)'))
  s('--footer-text-size',  `${t.footerTextSize||13}px`)
  s('--login-bg',          String(t.loginBg||'var(--cream)'))
  s('--login-card-bg',     String(t.loginCardBg||'#fff'))
  s('--login-h1-size',     `${t.loginH1Size||30}px`)
  s('--login-h1-color',    String(t.loginH1Color||'var(--ink)'))
  s('--login-label-size',  `${t.loginLabelSize||10}px`)
  s('--login-label-color', String(t.loginLabelColor||'var(--muted)'))
  s('--login-input-bg',    String(t.loginInputBg||'#fff'))
  s('--login-input-border',String(t.loginInputBorder||'var(--parchment)'))
  s('--register-bg',       String(t.registerBg||'var(--cream)'))
  s('--register-h1-size',  `${t.registerH1Size||28}px`)
  s('--register-h1-color', String(t.registerH1Color||'var(--ink)'))
  s('--write-bg',          String(t.writeBg||'var(--cream)'))
  s('--write-title-size',  `${t.writeTitleSize||36}px`)
  s('--write-title-color', String(t.writeTitleColor||'var(--ink)'))
  s('--post-page-bg',      String(t.postPageBg||'var(--cream)'))
  s('--post-page-title-size',`${t.postPageTitleSize||40}px`)
  s('--post-page-title-color',String(t.postPageTitleColor||'var(--ink)'))
  s('--post-page-body-size',`${t.postPageBodySize||16}px`)
  s('--post-page-body-color',String(t.postPageBodyColor||'var(--ink)'))
  s('--post-page-body-weight',String(t.postPageBodyWeight||300))
  s('--profile-bg',        String(t.profileBg||'var(--cream)'))
  s('--profile-name-size', `${t.profileNameSize||28}px`)
  s('--profile-name-color',String(t.profileNameColor||'var(--ink)'))
  s('--profile-bio-size',  `${t.profileBioSize||14}px`)
  s('--profile-bio-color',  String(t.profileBioColor||'var(--muted)'))
  // Forgot/Reset
  s('--forgot-bg',          String(t.forgotBg||'var(--cream)'))
  s('--forgot-card-bg',     String(t.forgotCardBg||'#fff'))
  s('--forgot-h1-size',     `${t.forgotH1Size||28}px`)
  s('--forgot-h1-color',    String(t.forgotH1Color||'var(--ink)'))
  // Post cards extra
  s('--post-card-radius',   `${t.postCardRadius||18}px`)
  s('--post-card-shadow',   `0 ${t.postCardShadow||1}px ${(t.postCardShadow||1)*8}px rgba(26,18,8,0.06)`)
  // Error page
  s('--error-bg',           String(t.errorBg||'var(--cream)'))
  s('--error-h1-color',     String(t.errorH1Color||'var(--ink)'))
  // Profile setup
  s('--profile-setup-bg',     String(t.profileSetupBg||'#0D1117'))
  s('--profile-setup-card',   String(t.profileSetupCardBg||'rgba(255,255,255,0.06)'))
  s('--profile-setup-accent', String(t.profileSetupAccent||'#64DCBE'))
  // Profile edit
  s('--profile-edit-bg',      String(t.profileEditBg||'var(--cream)'))
  s('--profile-edit-card',    String(t.profileEditCardBg||'#fff'))
  // Reset password
  s('--reset-bg',             String(t.resetBg||'var(--cream)'))
  s('--reset-card-bg',        String(t.resetCardBg||'#fff'))
  // Admin panel
  s('--admin-bg',                  String(t.adminBg||'#F8F4EE'))
  s('--admin-sidebar-bg',          String(t.adminSidebarBg||'#fff'))
  s('--admin-sidebar-active',      String(t.adminSidebarActive||'rgba(10,95,85,0.08)'))
  s('--admin-sidebar-active-color',String(t.adminSidebarActiveColor||'var(--teal)'))
  s('--admin-header-bg',           String(t.adminHeaderBg||'#fff'))
  // Latest Posts page
  s('--latest-posts-bg',            String(t.latestPostsBg||'var(--cream)'))
  s('--latest-posts-hero-bg',       String(t.latestPostsHeroBg||'var(--teal)'))
  s('--latest-posts-hero-color',    String(t.latestPostsHeroColor||'#fff'))
  s('--latest-posts-filter-bg',     String(t.latestPostsFilterBg||'#fff'))
  s('--latest-posts-filter-active', String(t.latestPostsFilterActive||'var(--teal)'))
  // Trending page
  s('--trending-page-bg',           String(t.trendingPageBg||'#fff'))
  s('--trending-hero-bg',           String(t.trendingHeroBg||'var(--coral)'))
  s('--trending-hero-color',        String(t.trendingHeroColor||'#fff'))
  s('--trending-rank-color',        String(t.trendingRankColor||'var(--parchment)'))
  s('--trending-tag-color',         String(t.trendingTagColor||'var(--coral)'))
  // EdTech Articles page
  s('--edtech-articles-bg',         String(t.edtechArticlesBg||'var(--cream)'))
  s('--edtech-hero-bg',             String(t.edtechHeroBg||'var(--teal)'))
  s('--edtech-hero-color',          String(t.edtechHeroColor||'#fff'))
  s('--edtech-pill-bg',             String(t.edtechPillBg||'#fff'))
  s('--edtech-pill-border',         String(t.edtechPillBorder||'var(--border)'))
  // EdTech Stories page
  s('--edtech-stories-bg',          String(t.edtechStoriesBg||'#fff'))
  s('--edtech-stories-hero-bg',     String(t.edtechStoriesHeroBg||'var(--plum)'))
  s('--edtech-stories-hero-color',  String(t.edtechStoriesHeroColor||'#fff'))
  s('--edtech-stories-accent',      String(t.edtechStoriesAccent||'var(--plum)'))
  s('--edtech-featured-bg',         String(t.edtechFeaturedBg||'#fff'))
  // School Leadership page
  s('--leadership-bg',              String(t.leadershipBg||'var(--cream)'))
  s('--leadership-hero-bg',         String(t.leadershipHeroBg||'var(--gold)'))
  s('--leadership-hero-color',      String(t.leadershipHeroColor||'#fff'))
  s('--leadership-pillar-bg',       String(t.leadershipPillarBg||'#fff'))
  s('--leadership-accent',          String(t.leadershipAccent||'var(--gold)'))
  // Innovation page
  s('--innovation-bg',              String(t.innovationBg||'var(--cream)'))
  s('--innovation-hero-bg',         String(t.innovationHeroBg||'var(--plum)'))
  s('--innovation-hero-color',      String(t.innovationHeroColor||'#fff'))
  s('--innovation-accent',          String(t.innovationAccent||'var(--plum)'))
  s('--innovation-tag-active-bg',   String(t.innovationTagActiveBg||'var(--teal)'))
  // Community page
  s('--community-page-bg',          String(t.communityPageBg||'#fff'))
  s('--community-hero-bg',          String(t.communityHeroBg||'var(--teal)'))
  s('--community-hero-color',       String(t.communityHeroColor||'#fff'))
  s('--community-stats-bg',         String(t.communityStatsBg||'#fff'))
  s('--community-stats-num-color',  String(t.communityStatsNumColor||'var(--teal)'))
  // Writers page
  s('--writers-bg',                 String(t.writersBg||'var(--cream)'))
  s('--writers-hero-bg',            String(t.writersHeroBg||'var(--teal)'))
  s('--writers-hero-color',         String(t.writersHeroColor||'#fff'))
  s('--writers-card-bg',            String(t.writersCardBg||'#fff'))
  s('--writers-card-border',        String(t.writersCardBorder||'var(--border)'))
  // Privacy page
  s('--privacy-bg',                 String(t.privacyBg||'#fff'))
  s('--privacy-hero-bg',            String(t.privacyHeroBg||'var(--teal)'))
  s('--privacy-hero-color',         String(t.privacyHeroColor||'#fff'))
  s('--privacy-heading-color',      String(t.privacyHeadingColor||'var(--ink)'))
  s('--privacy-body-color',         String(t.privacyBodyColor||'var(--muted)'))
  // Terms page
  s('--terms-bg',                   String(t.termsBg||'#fff'))
  s('--terms-hero-bg',              String(t.termsHeroBg||'var(--ink)'))
  s('--terms-hero-color',           String(t.termsHeroColor||'#fff'))
  s('--terms-heading-color',        String(t.termsHeadingColor||'var(--ink)'))
  s('--terms-body-color',           String(t.termsBodyColor||'var(--muted)'))
}

/* ─── SectionPreview: renders a focused live preview for the active section ─── */
function SectionPreview({ section, t }: { section: string; t: Record<string,any> }) {
  const s = (k: string, d: string) => String(t[k] ?? d)
  const n = (k: string, d: number) => Number(t[k] ?? d)

  const PostCard = ({ e, cat, title, excerpt }: { e:string; cat:string; title:string; excerpt:string }) => (
    <div style={{ background:s('postCardBg','#fff'), border:'1px solid rgba(26,18,8,.08)', borderRadius:`${n('radiusLg',18)}px`, overflow:'hidden' }}>
      <div style={{ height:56, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', background:'linear-gradient(135deg,#EAF4F0,#C0E6DC)' }}>{e}</div>
      <div style={{ padding:'10px' }}>
        <div style={{ fontSize:'9px', fontWeight:700, textTransform:'uppercase' as const, color:s('postCatColor','#0A5F55'), background:'rgba(10,95,85,.08)', display:'inline-block', padding:'2px 6px', borderRadius:'4px', marginBottom:'5px' }}>{cat}</div>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:`${n('postTitleSize',16)}px`, fontWeight:700, color:s('postTitleColor','#1A1208'), lineHeight:1.3 }}>{title}</div>
        <div style={{ fontSize:'11px', color:s('postExcerptColor','#7A6A52'), lineHeight:1.5, marginTop:'4px', fontWeight:n('weightBody',300) }}>{excerpt}</div>
      </div>
    </div>
  )

  const PageHero = ({ bg, textColor, eyebrow, title, subtitle, children }: any) => (
    <div style={{ borderRadius:'12px', overflow:'hidden', marginBottom:'12px', border:'1px solid rgba(0,0,0,.06)' }}>
      <div style={{ padding:'20px 22px', background:bg }}>
        {eyebrow && <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' as const, color:'rgba(255,255,255,.5)', marginBottom:'6px' }}>{eyebrow}</div>}
        <div style={{ fontFamily:'var(--font-serif)', fontSize:'22px', fontWeight:900, color:textColor||'#fff', lineHeight:1.1, marginBottom:'6px' }}>{title}</div>
        {subtitle && <div style={{ fontSize:'12px', color:'rgba(255,255,255,.72)', lineHeight:1.6 }}>{subtitle}</div>}
        {children}
      </div>
    </div>
  )

  const WriterCard = ({ name, role, bg }: { name:string; role:string; bg:string }) => (
    <div style={{ background:s('writersCardBg','#fff'), border:`1px solid ${s('writersCardBorder','rgba(26,18,8,.1)')}`, borderRadius:'12px', padding:'10px', textAlign:'center' as const }}>
      <div style={{ width:32, height:32, borderRadius:'8px', background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'13px', color:'#fff', margin:'0 auto 6px' }}>{name[0]}</div>
      <div style={{ fontFamily:'var(--font-serif)', fontSize:'12px', fontWeight:700, color:'var(--ink)' }}>{name}</div>
      <div style={{ fontSize:'10px', color:'var(--muted)', marginTop:'2px' }}>{role}</div>
    </div>
  )

  const FilterBar = ({ cats }: { cats: string[] }) => (
    <div style={{ background:s('latestPostsFilterBg','#fff'), padding:'8px 12px', display:'flex', gap:'6px', flexWrap:'wrap' as const, borderBottom:'1px solid rgba(26,18,8,.06)' }}>
      {cats.map((cat, i) => (
        <span key={cat} style={{ padding:'5px 12px', borderRadius:'100px', fontSize:'11px', fontWeight:600,
          background: i===0 ? s('latestPostsFilterActive','#0A5F55') : 'transparent',
          color: i===0 ? '#fff' : 'var(--muted)',
          border: i===0 ? 'none' : '1px solid rgba(26,18,8,.12)' }}>{cat}</span>
      ))}
    </div>
  )

  switch (section) {
    /* ── Global ── */
    case 'global-colours': return (
      <div>
        <div style={{ fontSize:'11px', fontWeight:700, color:'var(--muted)', fontFamily:'var(--font-mono)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'12px' }}>Colour Palette</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'6px', marginBottom:'16px' }}>
          {[['cream',s('cream','#FDF6EC')],['teal',s('teal','#0A5F55')],['coral',s('coral','#E8512A')],['gold',s('gold','#C9922A')],['plum',s('plum','#3D1F5E')],['ink',s('ink','#1A1208')],['muted',s('muted','#7A6A52')]].map(([name,color])=>(
            <div key={name} style={{ textAlign:'center' as const }}>
              <div style={{ height:36, borderRadius:'8px', background:color, border:'1px solid rgba(0,0,0,.08)', marginBottom:'4px' }} />
              <div style={{ fontSize:'9px', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{name}</div>
            </div>
          ))}
        </div>
        <div style={{ background:'#fff', borderRadius:'10px', padding:'14px 16px', border:'1px solid rgba(26,18,8,.08)' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:900, color:s('ink','#1A1208'), marginBottom:'4px' }}>Thynk <em style={{ fontStyle:'normal', color:s('teal','#0A5F55') }}>Pulse</em></div>
          <div style={{ fontSize:'13px', color:s('muted','#7A6A52') }}>Community platform for education professionals.</div>
          <div style={{ display:'flex', gap:'8px', marginTop:'10px' }}>
            <span style={{ padding:'7px 16px', borderRadius:`${n('radius',12)}px`, background:s('teal','#0A5F55'), color:'#fff', fontSize:'12px', fontWeight:600 }}>Join Free</span>
            <span style={{ padding:'7px 16px', borderRadius:`${n('radius',12)}px`, background:s('coral','#E8512A'), color:'#fff', fontSize:'12px', fontWeight:600 }}>Explore</span>
            <span style={{ padding:'7px 16px', borderRadius:`${n('radius',12)}px`, background:s('gold','#C9922A'), color:'#fff', fontSize:'12px', fontWeight:600 }}>Premium</span>
          </div>
        </div>
      </div>
    )

    case 'global-typography': case 'global-fonts': return (
      <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', border:'1px solid rgba(26,18,8,.08)' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:`${n('sizeH1',56)*0.55}px`, fontWeight:n('weightHeading',900), color:s('ink','#1A1208'), lineHeight:1.05, marginBottom:'8px', letterSpacing:'-1px' }}>Heading H1</div>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:`${n('sizeH2',42)*0.55}px`, fontWeight:n('weightHeading',900), color:s('ink','#1A1208'), marginBottom:'8px' }}>Heading H2</div>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:`${n('sizeH3',28)*0.65}px`, fontWeight:700, color:s('ink','#1A1208'), marginBottom:'10px' }}>Heading H3</div>
        <div style={{ fontSize:`${n('sizeBase',15)}px`, color:s('muted','#7A6A52'), lineHeight:n('lineHeight',170)/100, fontWeight:n('weightBody',300), marginBottom:'8px' }}>Body text — this is how paragraphs and descriptions appear across the platform.</div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:`${n('sizeSmall',13)}px`, color:s('muted','#7A6A52'), letterSpacing:'1px' }}>MONO SMALL TEXT</div>
      </div>
    )

    /* ── Navbar ── */
    case 'navbar': return (
      <div style={{ borderRadius:'10px', overflow:'hidden', border:'1px solid rgba(26,18,8,.08)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 18px', background:s('navBg','rgba(253,246,236,0.97)'), borderBottom:'1px solid rgba(26,18,8,.08)' }}>
          <span style={{ fontFamily:'var(--font-serif)', fontSize:'18px', fontWeight:900, color:s('ink','#1A1208') }}>Thynk <em style={{ fontStyle:'normal', color:s('teal','#0A5F55') }}>Pulse</em></span>
          <div style={{ display:'flex', gap:'14px' }}>
            {['Latest Posts','Trending','Community'].map(l=>(
              <span key={l} style={{ fontFamily:'var(--font-sans)', fontSize:`${n('navSize',13)}px`, color:s('navColor','#7A6A52'), fontWeight:n('navWeight',500) }}>{l}</span>
            ))}
          </div>
          <div style={{ padding:'8px 16px', borderRadius:`${n('radius',12)}px`, background:s('ctaBg','#0A5F55'), color:s('ctaColor','#fff'), fontSize:`${n('ctaSize',15)}px`, fontWeight:600 }}>Start Writing</div>
        </div>
        <div style={{ padding:'8px 18px', background:'rgba(253,246,236,.5)', fontSize:'11px', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>Sticky header · appears on all pages</div>
      </div>
    )

    /* ── Hero ── */
    case 'hero': return (
      <div style={{ padding:'28px 24px', background:s('heroBg','#FDF6EC'), borderRadius:'12px', border:'1px solid rgba(26,18,8,.08)' }}>
        <div style={{ fontSize:'10px', fontWeight:700, letterSpacing:'2px', color:s('teal','#0A5F55'), textTransform:'uppercase' as const, marginBottom:'12px' }}>India's Education Community Platform</div>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:`${Math.min(n('heroH1Size',64)*0.6,40)}px`, fontWeight:n('weightHeading',900), color:s('heroH1Color','#1A1208'), lineHeight:1.04, letterSpacing:'-2px', marginBottom:'12px' }}>
          Where <span style={{ color:s('teal','#0A5F55') }}>Ideas</span><br />
          <em style={{ fontStyle:'italic', color:s('gold','#C9922A') }}>Shape Education</em>
        </div>
        <p style={{ fontSize:`${n('heroSubSize',16)}px`, color:s('heroSubColor','#7A6A52'), fontWeight:n('heroSubWeight',300), lineHeight:1.7, maxWidth:'380px', marginBottom:'16px' }}>
          The free community platform for educators, EdTech professionals and school leaders.
        </p>
        <div style={{ display:'flex', gap:'8px' }}>
          <span style={{ padding:'10px 20px', borderRadius:`${n('radius',12)}px`, background:s('ctaBg','#0A5F55'), color:s('ctaColor','#fff'), fontSize:`${n('ctaSize',15)}px`, fontWeight:600 }}>Join Free</span>
          <span style={{ padding:'9px 18px', borderRadius:`${n('radius',12)}px`, border:`2px solid ${s('parchment','#EDE0C8')}`, color:s('ink','#1A1208'), fontSize:`${n('ctaSize',15)}px` }}>Explore →</span>
        </div>
      </div>
    )

    /* ── Stats ── */
    case 'stats': return (
      <div style={{ background:s('statsBg','#fff'), border:'1px solid rgba(26,18,8,.08)', borderRadius:`${n('radius',12)}px`, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
          {[['10K','+','Community Members'],['2.4K','+','Articles Published'],['180','+','EdTech Companies'],['100','%','Free Forever']].map(([num,sup,label],i)=>(
            <div key={label} style={{ padding:'20px 0', textAlign:'center' as const, borderRight:i<3?'1px solid rgba(26,18,8,.06)':'none' }}>
              <div style={{ fontFamily:'var(--font-serif)', fontWeight:n('weightHeading',900), fontSize:`${n('statNumSize',36)}px`, color:s('statNumColor','#1A1208'), lineHeight:1 }}>
                {num}<sup style={{ fontSize:'16px', color:s('coral','#E8512A') }}>{sup}</sup>
              </div>
              <div style={{ fontSize:`${n('statLabelSize',11)}px`, color:s('statLabelColor','#7A6A52'), marginTop:'5px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    )

    /* ── Posts Feed ── */
    case 'posts': return (
      <div style={{ background:s('postsBg','#FDF6EC'), borderRadius:'12px', padding:'16px', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:900, color:s('ink','#1A1208'), marginBottom:'12px' }}>Fresh Ideas, <em style={{ fontStyle:'italic', color:s('gold','#C9922A') }}>Real Voices</em></div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          <PostCard e="🤖" cat="EdTech" title="AI in Classroom Engagement" excerpt="What's working in schools across India." />
          <PostCard e="🌱" cat="Educator" title="Experiential Learning at Scale" excerpt="From rote learning to real projects." />
          <PostCard e="📈" cat="Sales Pro" title="Selling to Schools" excerpt="Lessons from 300+ conversations." />
        </div>
      </div>
    )

    /* ── Trending ── */
    case 'trending': return (
      <div style={{ background:s('trendingBg','#fff'), borderRadius:'12px', padding:'16px', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:900, color:s('ink','#1A1208'), marginBottom:'12px' }}>Trending <em style={{ fontStyle:'italic', color:s('coral','#E8512A') }}>This Week</em></div>
        {[['01','EdTech · AI','GPT in the Classroom: 6-Month Review'],['02','Leadership','Why I Turned Down a ₹50L EdTech Deal'],['03','Sales','The Education Sales Playbook Nobody Talks About']].map(([num,tag,title])=>(
          <div key={num} style={{ display:'flex', gap:'12px', padding:'12px 0', borderBottom:'1px solid rgba(26,18,8,.06)', alignItems:'flex-start' }}>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:'28px', fontWeight:900, color:s('trendingNumColor','#EDE0C8'), lineHeight:1, minWidth:'36px' }}>{num}</div>
            <div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' as const, color:s('coral','#E8512A'), marginBottom:'4px' }}>{tag}</div>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:`${n('trendingTitleSize',17)}px`, fontWeight:600, color:s('trendingTitleColor','#1A1208'), lineHeight:1.35 }}>{title}</div>
            </div>
          </div>
        ))}
      </div>
    )

    /* ── Community Cards ── */
    case 'community': return (
      <div style={{ background:s('communityBg','#fff'), borderRadius:'12px', padding:'16px', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:900, color:s('ink','#1A1208'), marginBottom:'12px' }}>One Platform, <em style={{ fontStyle:'italic', color:s('teal','#0A5F55') }}>Every Voice</em></div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          {[['🏫','Educators','3,200+','#EAF4F1','#0A5F55'],['💡','EdTech Cos','180+','#FEF0EA','#E8512A'],['📊','Sales Pros','840+','#F5F0FD','#3D1F5E']].map(([e,t,c,bg,col])=>(
            <div key={t as string} style={{ borderRadius:'14px', padding:'16px 14px', background:bg as string, position:'relative' as const, overflow:'hidden' }}>
              <div style={{ position:'absolute' as const, right:-8, bottom:-8, fontSize:'52px', opacity:.1 }}>{e}</div>
              <div style={{ fontSize:'22px', marginBottom:'8px' }}>{e}</div>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:`${n('communityTitleSize',17)}px`, fontWeight:700, color:s('communityTitleColor','#1A1208'), marginBottom:'4px' }}>{t}</div>
              <div style={{ fontSize:`${n('communityDescSize',13)}px`, color:s('communityDescColor','#7A6A52') }}>Community members</div>
              <div style={{ fontSize:'11px', fontWeight:600, color:col as string, marginTop:'8px' }}>● {c} members</div>
            </div>
          ))}
        </div>
      </div>
    )

    /* ── CTA ── */
    case 'cta': return (
      <div style={{ background:s('ctaSectionBg','#FDF6EC'), borderRadius:'12px', padding:'16px', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ background:s('ctaBg','#0A5F55'), borderRadius:'16px', padding:'28px 24px', textAlign:'center' as const }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:`${n('ctaH2Size',38)*0.65}px`, fontWeight:900, color:s('ctaH2Color','#fff'), lineHeight:1.1, marginBottom:'10px' }}>
            Join <em style={{ fontStyle:'italic', color:s('gold2','#E5B64A') }}>Thynk Pulse</em>.<br />Shape Education's Future.
          </div>
          <div style={{ display:'flex', gap:'8px', maxWidth:'320px', margin:'0 auto' }}>
            <div style={{ flex:1, padding:'10px 12px', background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)', borderRadius:'8px', fontSize:'12px', color:'rgba(255,255,255,.5)' }}>Enter your email</div>
            <div style={{ padding:'10px 16px', background:s('coral','#E8512A'), color:'#fff', borderRadius:'8px', fontSize:'12px', fontWeight:600, flexShrink:0 }}>Join Free →</div>
          </div>
        </div>
      </div>
    )

    /* ── Footer ── */
    case 'footer': return (
      <div style={{ background:s('footerBg','#0A5F55'), borderRadius:'12px', padding:'20px 22px' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:'18px', fontWeight:900, color:'#fff', marginBottom:'6px' }}>
          Thynk <em style={{ fontStyle:'normal', color:s('footerLinkColor','#E5B64A') }}>Pulse</em>
        </div>
        <div style={{ fontSize:`${n('footerTextSize',13)}px`, color:s('footerTextColor','rgba(255,255,255,0.6)'), marginBottom:'14px', fontWeight:n('weightBody',300), lineHeight:1.6, maxWidth:'280px' }}>
          The free community platform for educators, EdTech professionals and school leaders.
        </div>
        <div style={{ display:'flex', gap:'16px', flexWrap:'wrap' as const, paddingTop:'14px', borderTop:'1px solid rgba(255,255,255,.15)' }}>
          {['Explore','Community','Writers','Privacy','Terms'].map(l=>(
            <span key={l} style={{ fontSize:'12px', color:s('footerTextColor','rgba(255,255,255,0.6)'), fontFamily:'var(--font-sans)' }}>{l}</span>
          ))}
        </div>
      </div>
    )

    /* ── Login ── */
    case 'login': return (
      <div style={{ background:s('loginBg','#FDF6EC'), borderRadius:'12px', padding:'16px', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ background:s('loginCardBg','#fff'), borderRadius:'14px', padding:'24px', maxWidth:'360px', margin:'0 auto', boxShadow:'0 4px 20px rgba(0,0,0,.06)' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:`${n('loginH1Size',30)}px`, fontWeight:900, color:s('loginH1Color','#1A1208'), marginBottom:'4px' }}>Welcome back</div>
          <div style={{ fontSize:'13px', color:'var(--muted)', marginBottom:'20px' }}>Sign in to your Thynk Pulse account</div>
          <div style={{ marginBottom:'12px' }}>
            <div style={{ fontSize:`${n('loginLabelSize',10)}px`, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase' as const, color:s('loginLabelColor','#7A6A52'), marginBottom:'5px', fontFamily:'var(--font-mono)' }}>EMAIL OR PHONE</div>
            <div style={{ padding:'10px 12px', background:s('loginInputBg','#fff'), border:`1.5px solid ${s('loginInputBorder','#EDE0C8')}`, borderRadius:`${n('radius',12)}px`, fontSize:'13px', color:'var(--muted)' }}>you@example.com</div>
          </div>
          <div style={{ padding:'11px', background:s('teal','#0A5F55'), borderRadius:`${n('radius',12)}px`, textAlign:'center' as const, color:'#fff', fontWeight:600, fontSize:'13px', marginTop:'16px' }}>Sign In</div>
        </div>
      </div>
    )

    /* ── Register ── */
    case 'register': return (
      <div style={{ background:s('registerBg','#FDF6EC'), borderRadius:'12px', padding:'16px', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:`${n('registerH1Size',28)}px`, fontWeight:900, color:s('registerH1Color','#1A1208'), marginBottom:'4px' }}>Join Thynk Pulse</div>
        <div style={{ fontSize:'13px', color:'var(--muted)', marginBottom:'14px' }}>Free forever — no credit card needed</div>
        {['🏫 Educator / Teacher','💡 EdTech Professional','🌍 Other / General'].map(opt=>(
          <div key={opt} style={{ padding:'12px 14px', background:'#fff', border:`1.5px solid ${s('parchment','#EDE0C8')}`, borderRadius:`${n('radius',12)}px`, fontSize:'13px', color:s('ink','#1A1208'), marginBottom:'8px' }}>{opt}</div>
        ))}
      </div>
    )

    /* ── Write ── */
    case 'write': return (
      <div style={{ background:s('writeBg','#FDF6EC'), borderRadius:'12px', padding:'24px', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:`${n('writeTitleSize',36)*0.65}px`, fontWeight:900, color:s('writeTitleColor','#1A1208'), opacity:.25, marginBottom:'10px', letterSpacing:'-1px' }}>Your article title here…</div>
        <div style={{ height:'1px', background:'rgba(26,18,8,.06)', marginBottom:'10px' }} />
        <div style={{ fontSize:'14px', color:'var(--muted)', opacity:.4, lineHeight:1.7 }}>Start writing your introduction. Share your experience with the Thynk Pulse community of 10,000+ education professionals…</div>
        <div style={{ display:'flex', gap:'8px', marginTop:'16px' }}>
          {['Bold','Italic','Link','Quote','Image'].map(btn=>(
            <span key={btn} style={{ padding:'4px 10px', borderRadius:'6px', background:'rgba(26,18,8,.06)', fontSize:'11px', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{btn}</span>
          ))}
        </div>
      </div>
    )

    /* ── Post Detail ── */
    case 'post-detail': return (
      <div style={{ background:s('postPageBg','#FDF6EC'), borderRadius:'12px', padding:'20px', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ fontSize:'10px', fontWeight:700, letterSpacing:'1px', color:s('teal','#0A5F55'), background:'rgba(10,95,85,.08)', display:'inline-block', padding:'3px 9px', borderRadius:'5px', marginBottom:'10px' }}>EdTech</div>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:`${n('postPageTitleSize',40)*0.65}px`, fontWeight:900, color:s('postPageTitleColor','#1A1208'), lineHeight:1.1, letterSpacing:'-1px', marginBottom:'10px' }}>How AI is Rewriting Classroom Engagement</div>
        <p style={{ fontSize:`${n('postPageBodySize',16)}px`, color:s('postPageBodyColor','#1A1208'), fontWeight:n('postPageBodyWeight',300), lineHeight:1.8, marginBottom:'12px' }}>
          From adaptive learning paths to AI-powered feedback loops — what's actually working in schools across India.
        </p>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', paddingTop:'12px', borderTop:'1px solid rgba(26,18,8,.06)' }}>
          <div style={{ width:36, height:36, borderRadius:'10px', background:s('teal','#0A5F55'), display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'14px' }}>R</div>
          <div>
            <div style={{ fontSize:'13px', fontWeight:600, color:s('ink','#1A1208') }}>Rajesh Kumar</div>
            <div style={{ fontSize:'11px', color:'var(--muted)' }}>EdTech Founder · 8 min read</div>
          </div>
        </div>
      </div>
    )

    /* ── Profile ── */
    case 'profile': return (
      <div style={{ background:s('profileBg','#FDF6EC'), borderRadius:'12px', padding:'20px', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'16px' }}>
          <div style={{ width:64, height:64, borderRadius:'14px', background:`linear-gradient(135deg,${s('teal','#0A5F55')},${s('teal3','#12A090')})`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'24px', color:'#fff', flexShrink:0 }}>R</div>
          <div>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:`${n('profileNameSize',28)*0.75}px`, fontWeight:900, color:s('profileNameColor','#1A1208'), letterSpacing:'-0.5px' }}>Rajesh Kumar</div>
            <div style={{ fontSize:`${n('profileBioSize',14)}px`, color:s('profileBioColor','#7A6A52'), marginTop:'3px' }}>EdTech Founder · Bangalore · 48 Articles · 12K Followers</div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          <PostCard e="🤖" cat="EdTech" title="AI in Education" excerpt="What's working now." />
          <PostCard e="🌱" cat="Teaching" title="Learning Design" excerpt="Frameworks that scale." />
          <PostCard e="📊" cat="Sales" title="EdTech Sales" excerpt="The real playbook." />
        </div>
      </div>
    )

    /* ── Post Cards ── */
    case 'post-cards': return (
      <div style={{ background:'var(--cream)', borderRadius:'12px', padding:'16px', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ fontFamily:'var(--font-sans)', fontSize:'11px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' as const, color:'var(--muted)', marginBottom:'12px' }}>Post card styling preview</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          <PostCard e="🤖" cat="EdTech" title="AI is Rewriting Classroom Engagement" excerpt="What works across 200 schools in India." />
          <PostCard e="🌱" cat="Educator" title="Experiential Learning: Why It Works" excerpt="Transforming assessment through projects." />
          <PostCard e="📈" cat="Sales Pro" title="Selling to Schools: What Works" excerpt="Lessons from 300+ conversations." />
        </div>
      </div>
    )

    /* ── Error page ── */
    case 'error-page': return (
      <div style={{ background:s('errorBg','#FDF6EC'), borderRadius:'12px', padding:'48px 24px', textAlign:'center' as const, border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:'64px', fontWeight:900, color:s('errorH1Color','#1A1208'), opacity:.12, lineHeight:1 }}>404</div>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:'22px', fontWeight:700, color:s('errorH1Color','#1A1208'), marginBottom:'8px' }}>Page Not Found</div>
        <div style={{ fontSize:'13px', color:'var(--muted)' }}>The page you're looking for doesn't exist.</div>
        <div style={{ padding:'10px 20px', background:s('teal','#0A5F55'), color:'#fff', borderRadius:`${n('radius',12)}px`, display:'inline-block', marginTop:'16px', fontSize:'13px', fontWeight:600 }}>← Go Home</div>
      </div>
    )

    /* ── Forgot / Reset ── */
    case 'forgot-password': case 'reset-password': return (
      <div style={{ background:s('forgotBg','#FDF6EC'), borderRadius:'12px', padding:'16px', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ background:s('forgotCardBg','#fff'), borderRadius:'14px', padding:'24px', maxWidth:'360px', margin:'0 auto', boxShadow:'0 4px 20px rgba(0,0,0,.06)' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:`${n('forgotH1Size',28)*0.85}px`, fontWeight:900, color:s('forgotH1Color','#1A1208'), marginBottom:'6px' }}>
            {section==='reset-password' ? 'Set New Password' : 'Reset your password'}
          </div>
          <div style={{ fontSize:'13px', color:'var(--muted)', marginBottom:'16px' }}>{section==='reset-password' ? 'Enter your new password below.' : 'Enter your email to receive a reset link.'}</div>
          <div style={{ padding:'10px 12px', background:'#fff', border:`1.5px solid ${s('parchment','#EDE0C8')}`, borderRadius:`${n('radius',12)}px`, fontSize:'13px', color:'var(--muted)', marginBottom:'10px' }}>
            {section==='reset-password' ? 'New password' : 'you@example.com'}
          </div>
          <div style={{ padding:'11px', background:s('teal','#0A5F55'), borderRadius:`${n('radius',12)}px`, textAlign:'center' as const, color:'#fff', fontWeight:600, fontSize:'13px' }}>
            {section==='reset-password' ? 'Update Password' : 'Send Reset Link'}
          </div>
        </div>
      </div>
    )

    /* ── Profile Setup ── */
    case 'profile-setup': return (
      <div style={{ background:s('profileSetupBg','#0D1117'), borderRadius:'12px', padding:'24px', border:'1px solid rgba(255,255,255,.08)' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:900, color:'#fff', marginBottom:'4px' }}>Complete Your Profile</div>
        <div style={{ fontSize:'13px', color:'rgba(255,255,255,.5)', marginBottom:'18px' }}>Help others know who you are</div>
        {['Full Name','Designation','Institution / Company'].map((field,i) => (
          <div key={field} style={{ marginBottom:'10px' }}>
            <div style={{ fontSize:'10px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' as const, color:'rgba(255,255,255,.4)', marginBottom:'5px', fontFamily:'var(--font-mono)' }}>{field}</div>
            <div style={{ padding:'10px 12px', background:s('profileSetupCardBg','rgba(255,255,255,0.06)'), border:'1px solid rgba(255,255,255,.1)', borderRadius:'8px', fontSize:'13px', color:'rgba(255,255,255,.3)' }}>{['Rajesh Kumar','EdTech Founder','EduTech India'][i]}</div>
          </div>
        ))}
        <div style={{ padding:'11px', background:s('profileSetupAccent','#64DCBE'), borderRadius:'10px', textAlign:'center' as const, color:'#0D1117', fontWeight:700, fontSize:'13px', marginTop:'6px' }}>Save & Continue →</div>
      </div>
    )

    /* ── Profile Edit ── */
    case 'profile-edit': return (
      <div style={{ background:s('profileEditBg','#FDF6EC'), borderRadius:'12px', padding:'16px', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ background:s('profileEditCardBg','#fff'), borderRadius:'14px', padding:'20px' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'18px', fontWeight:900, color:s('profileEditH1Color','#1A1208'), marginBottom:'14px' }}>Edit Profile</div>
          {['Full Name','Designation','Bio'].map(f=>(
            <div key={f} style={{ marginBottom:'10px' }}>
              <div style={{ fontSize:'10px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' as const, color:'var(--muted)', marginBottom:'5px', fontFamily:'var(--font-mono)' }}>{f}</div>
              <div style={{ padding:'9px 12px', background:'var(--cream)', border:'1.5px solid var(--parchment)', borderRadius:`${n('radius',12)}px`, fontSize:'13px', color:'var(--muted)' }}>—</div>
            </div>
          ))}
        </div>
      </div>
    )

    /* ── Admin Dashboard ── */
    case 'admin-dashboard': case 'admin-sidebar': return (
      <div style={{ background:s('adminBg','#F8F4EE'), borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ display:'flex', height:'180px' }}>
          <div style={{ width:'140px', background:s('adminSidebarBg','#fff'), borderRight:'1px solid rgba(26,18,8,.06)', padding:'10px 0' }}>
            {['Dashboard','Posts','Users','Theme','Content'].map((item,i)=>(
              <div key={item} style={{ padding:'9px 14px', fontSize:'12px', fontWeight: i===0?700:400,
                background: i===0 ? s('adminSidebarActive','rgba(10,95,85,0.08)') : 'transparent',
                color: i===0 ? s('adminSidebarActiveColor','#0A5F55') : 'var(--muted)',
                borderLeft: i===0 ? `3px solid ${s('adminSidebarActiveColor','#0A5F55')}` : '3px solid transparent' }}>
                {item}
              </div>
            ))}
          </div>
          <div style={{ flex:1, padding:'14px', background:s('adminBg','#F8F4EE') }}>
            <div style={{ background:s('adminHeaderBg','#fff'), borderRadius:'8px', padding:'10px 12px', marginBottom:'10px', fontSize:'14px', fontWeight:700, color:'var(--ink)' }}>Admin Dashboard</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
              {[['42','Posts'],['1.2K','Users'],['98%','Uptime']].map(([n,l])=>(
                <div key={l} style={{ background:s('adminHeaderBg','#fff'), borderRadius:'8px', padding:'10px', textAlign:'center' as const }}>
                  <div style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'20px', color:s('teal','#0A5F55') }}>{n}</div>
                  <div style={{ fontSize:'11px', color:'var(--muted)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )

    /* ── NEW PAGES ── */
    case 'latest-posts': return (
      <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(26,18,8,.06)' }}>
        <PageHero bg={s('latestPostsHeroBg','#0A5F55')} textColor={s('latestPostsHeroColor','#fff')} eyebrow="Community Feed" title="Latest Posts" subtitle="Fresh articles from educators, EdTech founders, and school leaders." />
        <FilterBar cats={['All','EdTech','Educator','Leadership','Innovation']} />
        <div style={{ padding:'12px', background:s('latestPostsBg','#FDF6EC'), display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          <PostCard e="🤖" cat="EdTech" title="AI in Classrooms" excerpt="What's working now." />
          <PostCard e="🌱" cat="Educator" title="Experiential Learning" excerpt="Real classroom results." />
          <PostCard e="📊" cat="Sales Pro" title="EdTech Sales Guide" excerpt="300+ school conversations." />
        </div>
      </div>
    )

    case 'trending-page': return (
      <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(26,18,8,.06)' }}>
        <PageHero bg={s('trendingHeroBg','#E8512A')} textColor={s('trendingHeroColor','#fff')} eyebrow="🔥 What's Hot" title="Trending Now" subtitle="The articles the community can't stop reading." />
        <div style={{ padding:'12px', background:s('trendingPageBg','#fff') }}>
          {[['01','EdTech · AI','GPT in the Classroom: 6-Month Honest Review'],['02','Leadership','Why I Turned Down a ₹50L EdTech Deal'],['03','Educator','I Quit a Private School for a Govt School']].map(([num,tag,title])=>(
            <div key={num} style={{ display:'flex', gap:'10px', padding:'10px 0', borderBottom:'1px solid rgba(26,18,8,.06)', alignItems:'flex-start' }}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:'24px', fontWeight:900, color:s('trendingRankColor','#EDE0C8'), lineHeight:1, minWidth:'32px' }}>{num}</div>
              <div>
                <div style={{ fontSize:'9px', fontWeight:700, textTransform:'uppercase' as const, color:s('trendingTagColor','#E8512A'), marginBottom:'3px', fontFamily:'var(--font-mono)' }}>{tag}</div>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'13px', fontWeight:600, color:'var(--ink)', lineHeight:1.35 }}>{title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )

    case 'edtech-articles': return (
      <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(26,18,8,.06)' }}>
        <PageHero bg={s('edtechHeroBg','#0A5F55')} textColor={s('edtechHeroColor','#fff')} eyebrow="EdTech Category" title="EdTech Articles" subtitle="Analysis, funding news, and thought leadership." />
        <div style={{ padding:'10px 12px', background:s('edtechPillBg','#fff'), borderBottom:`1px solid ${s('edtechPillBorder','rgba(26,18,8,.08)')}`, display:'flex', gap:'6px', flexWrap:'wrap' as const }}>
          {['🤖 AI & ML','💰 Funding','📱 Products','🚀 Startups'].map(t=>(
            <span key={t} style={{ padding:'5px 10px', borderRadius:'8px', background:s('edtechPillBg','#fff'), border:`1px solid ${s('edtechPillBorder','rgba(26,18,8,.1)')}`, fontSize:'11px', color:'var(--ink)' }}>{t}</span>
          ))}
        </div>
        <div style={{ padding:'10px', background:s('edtechArticlesBg','#FDF6EC'), display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          <PostCard e="🤖" cat="EdTech" title="AI Rewriting Schools" excerpt="What actually works." />
          <PostCard e="💡" cat="EdTech" title="EdTech Funding 2025" excerpt="What investors want." />
          <PostCard e="🎮" cat="EdTech" title="Gamification Done Right" excerpt="Beyond points & badges." />
        </div>
      </div>
    )

    case 'edtech-stories-page': return (
      <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(26,18,8,.06)' }}>
        <PageHero bg={s('edtechStoriesHeroBg','#3D1F5E')} textColor={s('edtechStoriesHeroColor','#fff')} eyebrow="✍️ Real Stories" title="EdTech Stories" subtitle="Personal narratives from educators in their own words." />
        <div style={{ background:s('edtechFeaturedBg','#fff'), padding:'12px', border:'none' }}>
          <div style={{ display:'flex', gap:'12px', padding:'12px', background:s('edtechStoriesAccent','#3D1F5E')+'10', borderRadius:'10px', marginBottom:'10px' }}>
            <div style={{ width:'60px', height:'60px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', background:'linear-gradient(135deg,#EFF0FE,#C9CDF7)', flexShrink:0 }}>💼</div>
            <div>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:'13px', fontWeight:700, color:'var(--ink)', lineHeight:1.3, marginBottom:'4px' }}>From Teacher to EdTech Founder: My Unfiltered Journey</div>
              <div style={{ fontSize:'11px', color:'var(--muted)' }}>Meena Rao · Founder, EduSpark · 7 min read</div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
            <PostCard e="🏫" cat="Educator" title="Quit Private for Govt School" excerpt="Why I did it." />
            <PostCard e="💚" cat="Wellbeing" title="Teacher Burnout Crisis" excerpt="The staffroom truth." />
            <PostCard e="🤖" cat="Teaching" title="6 Months with GPT" excerpt="Honest review." />
          </div>
        </div>
      </div>
    )

    case 'school-leadership': return (
      <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(26,18,8,.06)' }}>
        <PageHero bg={s('leadershipHeroBg','#C9922A')} textColor={s('leadershipHeroColor','#fff')} eyebrow="🏆 School Leadership" title="School Leadership" subtitle="Insights from principals and administrators across India." />
        <div style={{ padding:'10px', background:s('leadershipPillarBg','#fff'), display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', borderBottom:'1px solid rgba(26,18,8,.06)' }}>
          {[['🎯','Vision'],['👥','People'],['📊','Data']].map(([e,l])=>(
            <div key={l} style={{ padding:'10px', borderRadius:'8px', background:'var(--cream)', border:'1px solid rgba(26,18,8,.08)', textAlign:'center' as const }}>
              <div style={{ fontSize:'18px', marginBottom:'4px' }}>{e}</div>
              <div style={{ fontSize:'11px', fontWeight:600, color:s('leadershipAccent','#C9922A') }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ padding:'10px', background:s('leadershipBg','#FDF6EC'), display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          <PostCard e="🏆" cat="Leadership" title="20 Years Running a School" excerpt="Lessons from the top." />
          <PostCard e="💰" cat="Leadership" title="Turned Down ₹50L Deal" excerpt="When to say no." />
          <PostCard e="📋" cat="Leadership" title="EdTech Procurement Guide" excerpt="Buy on your terms." />
        </div>
      </div>
    )

    case 'innovation-page': return (
      <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(26,18,8,.06)' }}>
        <PageHero bg={s('innovationHeroBg','#3D1F5E')} textColor={s('innovationHeroColor','#fff')} eyebrow="💡 Innovation Hub" title="Innovation in Education" subtitle="Cutting-edge ideas reimagining how learning happens." />
        <div style={{ padding:'10px 12px', background:'#fff', borderBottom:'1px solid rgba(26,18,8,.06)', display:'flex', gap:'6px', flexWrap:'wrap' as const }}>
          {['🤖 AI in Education','🎮 Gamification','🥽 AR/VR','🛠️ PBL'].map(tag=>(
            <span key={tag} style={{ padding:'5px 10px', borderRadius:'100px', fontSize:'11px', fontWeight:500, background:'var(--cream)', border:'1px solid rgba(26,18,8,.1)', color:'var(--ink)', cursor:'pointer' }}>{tag}</span>
          ))}
        </div>
        <div style={{ padding:'10px', background:s('innovationBg','#FDF6EC'), display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          <PostCard e="🎮" cat="Innovation" title="Gamification Done Right" excerpt="Beyond points & badges." />
          <PostCard e="🥽" cat="Innovation" title="AR/VR in Class 2025" excerpt="What actually works." />
          <PostCard e="🛠️" cat="Innovation" title="PBL at Scale" excerpt="200 schools, real data." />
        </div>
      </div>
    )

    case 'community-page': return (
      <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ padding:'20px', background:s('communityHeroBg','#0A5F55'), textAlign:'center' as const }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:900, color:s('communityHeroColor','#fff'), marginBottom:'6px' }}>India's Education Community</div>
          <div style={{ fontSize:'12px', color:'rgba(255,255,255,.7)', marginBottom:'12px' }}>Connect with 10,000+ education professionals</div>
          <div style={{ display:'flex', gap:'8px', justifyContent:'center' }}>
            <span style={{ padding:'7px 14px', borderRadius:`${n('radius',12)}px`, background:s('gold2','#E5B64A'), color:s('ink','#1A1208'), fontSize:'12px', fontWeight:700 }}>Join Free →</span>
            <span style={{ padding:'6px 13px', borderRadius:`${n('radius',12)}px`, border:'1px solid rgba(255,255,255,.3)', color:'#fff', fontSize:'12px' }}>Start Writing</span>
          </div>
        </div>
        <div style={{ background:s('communityStatsBg','#fff'), display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderBottom:'1px solid rgba(26,18,8,.06)' }}>
          {[['10K+','Members'],['2.4K+','Articles'],['180+','Companies'],['40+','Countries']].map(([n,l],i)=>(
            <div key={l} style={{ padding:'12px 0', textAlign:'center' as const, borderRight:i<3?'1px solid rgba(26,18,8,.06)':'none' }}>
              <div style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'18px', color:s('communityStatsNumColor','#0A5F55') }}>{n}</div>
              <div style={{ fontSize:'10px', color:'var(--muted)' }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ padding:'10px', background:s('communityPageBg','#fff'), display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          {[{n:'Rajesh K.',r:'EdTech Founder',bg:s('teal','#0A5F55')},{n:'Priya S.',r:'Teacher',bg:s('coral','#E8512A')},{n:'Nalini V.',r:'Researcher',bg:s('gold','#C9922A')}].map(w=>(
            <WriterCard key={w.n} name={w.n} role={w.r} bg={w.bg} />
          ))}
        </div>
      </div>
    )

    case 'writers-page': return (
      <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ padding:'20px', background:s('writersHeroBg','#0A5F55') }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:900, color:s('writersHeroColor','#fff'), marginBottom:'8px' }}>Meet the Writers</div>
          <div style={{ background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.2)', borderRadius:'10px', padding:'9px 12px', fontSize:'12px', color:'rgba(255,255,255,.6)' }}>Search by name or role…</div>
        </div>
        <div style={{ padding:'6px 10px', background:'#fff', borderBottom:'1px solid rgba(26,18,8,.06)', display:'flex', gap:'4px' }}>
          {['All Writers','Educator','EdTech Pro','Leader'].map((r,i)=>(
            <span key={r} style={{ padding:'4px 10px', borderRadius:'100px', fontSize:'11px', fontWeight:600, background:i===0?s('teal','#0A5F55'):'transparent', color:i===0?'#fff':'var(--muted)', border:i===0?'none':'1px solid rgba(26,18,8,.1)' }}>{r}</span>
          ))}
        </div>
        <div style={{ padding:'10px', background:s('writersBg','#FDF6EC'), display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          <WriterCard name="Rajesh K." role="EdTech Founder" bg={s('teal','#0A5F55')} />
          <WriterCard name="Priya S." role="Teacher, Delhi" bg={s('coral','#E8512A')} />
          <WriterCard name="Nalini V." role="Researcher" bg={s('gold','#C9922A')} />
        </div>
      </div>
    )

    case 'privacy-page': return (
      <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ padding:'24px', background:s('privacyHeroBg','#0A5F55') }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' as const, color:'rgba(255,255,255,.4)', marginBottom:'6px' }}>Legal</div>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'22px', fontWeight:900, color:s('privacyHeroColor','#fff') }}>Privacy Policy</div>
        </div>
        <div style={{ padding:'16px', background:s('privacyBg','#fff') }}>
          <div style={{ background:'#EAF4F0', border:'1px solid rgba(10,95,85,.15)', borderRadius:'10px', padding:'12px 14px', fontSize:'12px', color:'var(--muted)', lineHeight:1.7, marginBottom:'14px' }}>
            <strong style={{ color:s('teal','#0A5F55') }}>Summary:</strong> We collect only what we need, never sell your data, and you can delete your account at any time.
          </div>
          {['1. About Thynk Pulse','2. Information We Collect','3. How We Use Your Information'].map(heading=>(
            <div key={heading} style={{ marginBottom:'10px' }}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:'14px', fontWeight:700, color:s('privacyHeadingColor','#1A1208'), paddingBottom:'5px', borderBottom:'2px solid rgba(26,18,8,.06)', marginBottom:'5px' }}>{heading}</div>
              <div style={{ fontSize:'12px', color:s('privacyBodyColor','#7A6A52'), lineHeight:1.7 }}>Section content appears here and is editable in the page file…</div>
            </div>
          ))}
        </div>
      </div>
    )

    case 'terms-page': return (
      <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(26,18,8,.06)' }}>
        <div style={{ padding:'24px', background:s('termsHeroBg','#1A1208') }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' as const, color:'rgba(255,255,255,.35)', marginBottom:'6px' }}>Legal</div>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'22px', fontWeight:900, color:s('termsHeroColor','#fff') }}>Terms of Use</div>
        </div>
        <div style={{ padding:'16px', background:s('termsBg','#fff') }}>
          <div style={{ background:'#FFF9E6', border:'1px solid rgba(201,146,42,.2)', borderRadius:'10px', padding:'12px 14px', fontSize:'12px', color:'var(--muted)', lineHeight:1.7, marginBottom:'14px' }}>
            <strong style={{ color:s('gold','#C9922A') }}>Please read carefully:</strong> By using Thynk Pulse, you agree to these Terms. If you do not agree, please do not use the platform.
          </div>
          {['1. About Thynk Pulse','2. Account Registration','3. Content You Post'].map(heading=>(
            <div key={heading} style={{ marginBottom:'10px' }}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:'14px', fontWeight:700, color:s('termsHeadingColor','#1A1208'), paddingBottom:'5px', borderBottom:'2px solid rgba(26,18,8,.06)', marginBottom:'5px' }}>{heading}</div>
              <div style={{ fontSize:'12px', color:s('termsBodyColor','#7A6A52'), lineHeight:1.7 }}>Section content appears here and is editable in the page file…</div>
            </div>
          ))}
        </div>
      </div>
    )

    default: return (
      <div style={{ textAlign:'center' as const, padding:'32px', color:'var(--muted)', fontSize:'13px' }}>
        <div style={{ fontSize:'32px', marginBottom:'8px' }}>🎨</div>
        Select a section from the left to see its live preview here.
      </div>
    )
  }
}

export default function AdminThemePage() {
  const [theme,       setTheme]       = useState<Record<string,any>>({ ...DEFAULT })
  const [activePage,  setActivePage]  = useState(0)
  const [activeSection, setActiveSection] = useState('global-colours')
  const [unsaved,     setUnsaved]     = useState(false)

  const { data: savedData } = useQuery({
    queryKey: ['admin-theme'],
    queryFn: () => apiGet('/admin/theme'),
    staleTime: Infinity,
  })

  useEffect(() => {
    if (savedData?.theme) {
      const merged = { ...DEFAULT, ...savedData.theme }
      setTheme(merged)
      applyToDom(merged)
    }
  }, [savedData])

  const saveMutation = useMutation({
    mutationFn: () => apiPost('/admin/theme', { theme }),
    onSuccess: () => { toast.success('✅ Theme saved! Site updates in 60 seconds.'); setUnsaved(false) },
    onError: () => toast.error('Failed to save'),
  })

  const handleChange = (key: string, val: any) => {
    setTheme(p => { const n = { ...p, [key]: val }; applyToDom(n); return n })
    setUnsaved(true)
  }

  const handleReset = () => {
    setTheme({ ...DEFAULT })
    applyToDom({ ...DEFAULT })
    setUnsaved(true)
    toast.success('Reset to defaults')
  }

  return (
    <AdminLayout title="Theme Controller" subtitle="Customise colours, fonts and sizes — page by page, section by section">

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px', padding:'12px 16px', background:'#fff', border:'1px solid var(--border)', borderRadius:'12px' }}>
        <div style={{ width:9, height:9, borderRadius:'50%', background: unsaved ? 'var(--gold)' : '#4ADE80', boxShadow: unsaved ? '0 0 8px rgba(201,146,42,.5)' : '0 0 8px rgba(74,222,128,.4)' }} />
        <span style={{ fontSize:'12px', color:'var(--muted)', flex:1, fontFamily:'var(--font-sans)' }}>
          {unsaved ? '⚠ Unsaved — click Save to Site to apply changes' : '✓ All changes saved to site'}
        </span>
        <button onClick={handleReset} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'7px 13px', borderRadius:'8px', background:'var(--cream2)', border:'1px solid var(--border)', color:'var(--muted)', cursor:'pointer', fontSize:'12px', fontFamily:'var(--font-sans)' }}>
          <RotateCcw style={{ width:12, height:12 }} /> Reset All
        </button>
        <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}
          style={{ display:'flex', alignItems:'center', gap:'7px', padding:'9px 22px', borderRadius:'9px', background:'var(--teal)', border:'none', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:700, fontFamily:'var(--font-sans)', opacity: saveMutation.isPending ? .7 : 1, boxShadow:'0 4px 14px rgba(10,95,85,.3)' }}>
          {saveMutation.isPending ? <><Loader2 style={{ width:13, height:13, animation:'spin 1s linear infinite' }} /> Saving…</> : <><Globe style={{ width:13, height:13 }} /> Save to Site</>}
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', gap:'16px' }}>

        {/* LEFT: Page + Section tree */}
        <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'14px', overflow:'hidden' }}>
          {PAGES.map((page, pi) => (
            <div key={page.label}>
              {/* Page header */}
              <button onClick={() => { setActivePage(pi); setActiveSection(page.sections[0].key) }}
                style={{ width:'100%', display:'flex', alignItems:'center', padding:'11px 14px', border:'none', borderBottom:'1px solid var(--border2)', cursor:'pointer', fontFamily:'var(--font-sans)', fontSize:'13px', fontWeight:700, textAlign:'left',
                  background: activePage===pi ? 'rgba(10,95,85,.06)' : 'var(--cream2)',
                  color: activePage===pi ? 'var(--teal)' : 'var(--ink)' }}>
                {page.label}
              </button>
              {/* Sections */}
              {activePage === pi && page.sections.map(sec => (
                <button key={sec.key} onClick={() => setActiveSection(sec.key)}
                  style={{ width:'100%', display:'flex', alignItems:'center', padding:'9px 14px 9px 26px', border:'none', borderBottom:'1px solid var(--border2)', cursor:'pointer', fontFamily:'var(--font-sans)', fontSize:'12px', textAlign:'left', transition:'all .15s',
                    background: activeSection===sec.key ? 'rgba(10,95,85,.1)' : '#fff',
                    color: activeSection===sec.key ? 'var(--teal)' : 'var(--muted)',
                    fontWeight: activeSection===sec.key ? 600 : 400 }}>
                  {activeSection===sec.key && <span style={{ width:3, height:14, background:'var(--teal)', borderRadius:'2px', marginRight:'8px', display:'inline-block', flexShrink:0 }} />}
                  {sec.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* RIGHT: Controls + Live preview */}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

          {/* Controls */}
          <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'14px', padding:'22px' }}>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:'17px', fontWeight:900, color:'var(--ink)', marginBottom:'16px' }}>
              {PAGES[activePage]?.label} — {PAGES[activePage]?.sections.find(s=>s.key===activeSection)?.label}
            </div>
            <SectionControls section={activeSection} t={theme} onChange={handleChange} />
          </div>

          {/* Live preview — section-specific, fully reactive */}
          <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'14px', overflow:'hidden' }}>
            <div style={{ padding:'10px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--muted)' }}>
                <Eye style={{ width:12, height:12 }} /> Live Preview
              </div>
              <div style={{ fontSize:'11px', color:'var(--teal)', fontFamily:'var(--font-sans)', fontWeight:600, background:'rgba(10,95,85,.07)', padding:'3px 10px', borderRadius:'100px' }}>
                {PAGES[activePage]?.label} › {PAGES[activePage]?.sections.find((s:any)=>s.key===activeSection)?.label}
              </div>
            </div>
            <div style={{ padding:'20px', background:'#F9F6F0', overflowX:'hidden', maxHeight:'70vh', overflowY:'auto' }}>
              <SectionPreview section={activeSection} t={theme} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
