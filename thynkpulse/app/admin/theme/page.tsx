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
      { key: 'admin-sidebar',   label: 'Admin Sidebar' },
    ]
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

          {/* Live preview */}
          <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'14px', overflow:'hidden' }}>
            <div style={{ padding:'10px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--muted)' }}>
                <Eye style={{ width:12, height:12 }} /> Live Preview
              </div>
              <div style={{ fontSize:'11px', color:'var(--teal)', fontFamily:'var(--font-sans)', fontWeight:600, background:'rgba(10,95,85,.07)', padding:'3px 10px', borderRadius:'100px' }}>
                {PAGES[activePage]?.label} › {PAGES[activePage]?.sections.find((s:any)=>s.key===activeSection)?.label}
              </div>
            </div>
            <div style={{ padding:'24px', background:'var(--cream)', overflowX:'hidden' }}>
              {/* Nav */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 20px', background:String(theme.navBg||'rgba(253,246,236,0.97)'), borderRadius:'10px', marginBottom:'16px', border:'1px solid var(--border)' }}>
                <span style={{ fontFamily:'var(--font-serif)', fontSize:'18px', fontWeight:900, color:'var(--ink)' }}>Thynk <em style={{ fontStyle:'normal', color:'var(--teal)' }}>Pulse</em></span>
                <div style={{ display:'flex', gap:'16px' }}>
                  {['Explore','Community','Writers'].map(l=>(
                    <span key={l} style={{ fontFamily:'var(--font-sans)', fontSize:`${theme.navSize||13}px`, color:String(theme.navColor||'var(--muted)'), fontWeight:Number(theme.navWeight||500) }}>{l}</span>
                  ))}
                </div>
                <div style={{ padding:'8px 18px', borderRadius:`${theme.radius||12}px`, background:String(theme.ctaBg||'var(--teal)'), color:String(theme.ctaColor||'#fff'), fontSize:`${theme.ctaSize||15}px`, fontWeight:600, fontFamily:'var(--font-sans)' }}>Start Writing</div>
              </div>
              {/* Hero */}
              <div style={{ padding:'24px 20px', background:String(theme.heroBg||'var(--cream)'), borderRadius:'10px', marginBottom:'16px' }}>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:`${theme.heroH1Size||64}px`, fontWeight:Number(theme.weightHeading||900), color:String(theme.heroH1Color||'var(--ink)'), lineHeight:1.04, marginBottom:'10px', letterSpacing:'-2px' }}>
                  Where <span style={{ color:'var(--teal)' }}>Educators</span> &amp; <span style={{ color:'var(--coral)' }}>EdTech</span> Converge
                </div>
                <p style={{ fontFamily:'var(--font-sans)', fontSize:`${theme.heroSubSize||16}px`, color:String(theme.heroSubColor||'var(--muted)'), fontWeight:Number(theme.heroSubWeight||300), lineHeight:1.7, maxWidth:'460px', marginBottom:'16px' }}>
                  The free community platform for education professionals.
                </p>
                <div style={{ display:'flex', gap:'10px' }}>
                  <span style={{ padding:'10px 22px', borderRadius:`${theme.radius||12}px`, background:String(theme.ctaBg||'var(--teal)'), color:String(theme.ctaColor||'#fff'), fontSize:`${theme.ctaSize||15}px`, fontWeight:600, fontFamily:'var(--font-sans)' }}>Join Free</span>
                  <span style={{ padding:'9px 20px', borderRadius:`${theme.radius||12}px`, border:'2px solid var(--parchment)', color:'var(--ink)', fontSize:`${theme.ctaSize||15}px`, fontFamily:'var(--font-sans)' }}>Browse →</span>
                </div>
              </div>
              {/* Stats */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', background:String(theme.statsBg||'#fff'), border:'1px solid var(--border)', borderRadius:`${theme.radius||12}px`, marginBottom:'16px', overflow:'hidden' }}>
                {[['10K+','Members'],['2.4K+','Articles'],['180+','Companies'],['100%','Free']].map(([n,l],i)=>(
                  <div key={l} style={{ padding:'14px 0', textAlign:'center', borderRight:i<3?'1px solid var(--border)':'none' }}>
                    <div style={{ fontFamily:'var(--font-serif)', fontWeight:Number(theme.weightHeading||900), fontSize:`${theme.statNumSize||36}px`, color:String(theme.statNumColor||'var(--ink)'), lineHeight:1 }}>{n}</div>
                    <div style={{ fontSize:`${theme.statLabelSize||11}px`, color:String(theme.statLabelColor||'var(--muted)'), marginTop:'3px', fontFamily:'var(--font-sans)' }}>{l}</div>
                  </div>
                ))}
              </div>
              {/* Post cards */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'16px' }}>
                {[{e:'🤖',c:'EdTech',t:'AI is Rewriting Classroom Engagement',x:'What works across 200 schools in India.'},
                  {e:'🌱',c:'Educator',t:'Experiential Learning: Why It Works',x:'Transforming assessment through projects.'},
                  {e:'📈',c:'Sales',t:'Selling to Schools: What Works',x:'Lessons from 300+ school conversations.'}
                ].map(p=>(
                  <div key={p.t} style={{ background:String(theme.postCardBg||'#fff'), border:'1px solid var(--border)', borderRadius:`${theme.radiusLg||18}px`, overflow:'hidden' }}>
                    <div style={{ height:70, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', background:'linear-gradient(135deg,var(--cream2),var(--parchment))' }}>{p.e}</div>
                    <div style={{ padding:'12px' }}>
                      <div style={{ fontSize:'10px', fontWeight:700, textTransform:'uppercase', color:String(theme.postCatColor||'var(--teal)'), background:'rgba(10,95,85,.08)', display:'inline-block', padding:'2px 7px', borderRadius:'4px', marginBottom:'6px' }}>{p.c}</div>
                      <div style={{ fontFamily:'var(--font-serif)', fontSize:`${theme.postTitleSize||20}px`, fontWeight:Number(theme.weightHeading||900), color:String(theme.postTitleColor||'var(--ink)'), lineHeight:1.3, marginBottom:'5px' }}>{p.t}</div>
                      <div style={{ fontFamily:'var(--font-sans)', fontSize:`${theme.postExcerptSize||13}px`, color:String(theme.postExcerptColor||'var(--muted)'), lineHeight:1.6, fontWeight:Number(theme.weightBody||300) }}>{p.x}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Footer */}
              <div style={{ background:String(theme.footerBg||'var(--teal)'), borderRadius:'10px', padding:'18px 22px' }}>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'16px', fontWeight:900, color:'#fff', marginBottom:'4px' }}>Thynk <em style={{ fontStyle:'normal', color:String(theme.footerLinkColor||'var(--gold2)') }}>Pulse</em></div>
                <div style={{ fontSize:`${theme.footerTextSize||13}px`, color:String(theme.footerTextColor||'rgba(255,255,255,0.6)'), fontFamily:'var(--font-sans)', fontWeight:Number(theme.weightBody||300) }}>
                  The free community for educators, EdTech professionals and school leaders.
                </div>
              </div>

              {/* Page-specific previews shown below main preview */}
              {(activeSection==='login') && (
                <div style={{ marginTop:'14px', background:String(theme.loginBg||'var(--cream)'), borderRadius:'10px', padding:'20px', border:'1px solid var(--border)' }}>
                  <div style={{ textAlign:'center', marginBottom:'14px', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--muted)' }}>LOGIN PAGE PREVIEW</div>
                  <div style={{ fontFamily:'var(--font-serif)', fontSize:`${theme.loginH1Size||30}px`, fontWeight:900, color:String(theme.loginH1Color||'var(--ink)'), marginBottom:'4px' }}>Welcome back</div>
                  <div style={{ fontSize:'13px', color:'var(--muted)', marginBottom:'14px', fontFamily:'var(--font-sans)' }}>Sign in to your Thynk Pulse account</div>
                  <div style={{ marginBottom:'10px' }}>
                    <div style={{ fontSize:`${theme.loginLabelSize||10}px`, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:String(theme.loginLabelColor||'var(--muted)'), marginBottom:'5px', fontFamily:'var(--font-mono)' }}>EMAIL OR PHONE</div>
                    <div style={{ padding:'10px 12px', background:String(theme.loginInputBg||'#fff'), border:`1.5px solid ${String(theme.loginInputBorder||'var(--parchment)')}`, borderRadius:'var(--radius)', fontSize:'13px', color:'var(--muted)', fontFamily:'var(--font-sans)' }}>you@example.com</div>
                  </div>
                </div>
              )}
              {(activeSection==='register') && (
                <div style={{ marginTop:'14px', background:String(theme.registerBg||'var(--cream)'), borderRadius:'10px', padding:'20px', border:'1px solid var(--border)' }}>
                  <div style={{ textAlign:'center', marginBottom:'14px', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--muted)' }}>REGISTER PAGE PREVIEW</div>
                  <div style={{ fontFamily:'var(--font-serif)', fontSize:`${theme.registerH1Size||28}px`, fontWeight:900, color:String(theme.registerH1Color||'var(--ink)'), marginBottom:'16px' }}>Join Thynk Pulse</div>
                  {['🏫 Educator / Teacher','💡 EdTech Professional','🌍 Other / General'].map(opt=>(
                    <div key={opt} style={{ padding:'12px 14px', background:'#fff', border:'1.5px solid var(--parchment)', borderRadius:'10px', fontSize:'13px', fontFamily:'var(--font-sans)', color:'var(--ink)', marginBottom:'8px' }}>{opt}</div>
                  ))}
                </div>
              )}
              {(activeSection==='write') && (
                <div style={{ marginTop:'14px', background:String(theme.writeBg||'var(--cream)'), borderRadius:'10px', padding:'28px', border:'1px solid var(--border)' }}>
                  <div style={{ textAlign:'center', marginBottom:'14px', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--muted)' }}>WRITE PAGE PREVIEW</div>
                  <div style={{ fontFamily:'var(--font-serif)', fontSize:`${theme.writeTitleSize||36}px`, fontWeight:900, color:String(theme.writeTitleColor||'var(--ink)'), opacity:.25, marginBottom:'8px', letterSpacing:'-1px' }}>Your post title here...</div>
                  <div style={{ fontSize:'15px', color:'var(--muted)', opacity:.4, fontFamily:'var(--font-sans)', fontWeight:300 }}>Write your introduction...</div>
                </div>
              )}
              {(activeSection==='post-detail') && (
                <div style={{ marginTop:'14px', background:String(theme.postPageBg||'var(--cream)'), borderRadius:'10px', padding:'28px', border:'1px solid var(--border)' }}>
                  <div style={{ textAlign:'center', marginBottom:'14px', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--muted)' }}>POST DETAIL PREVIEW</div>
                  <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'1px', color:'var(--teal)', background:'rgba(10,95,85,.08)', display:'inline-block', padding:'3px 9px', borderRadius:'5px', marginBottom:'10px' }}>EdTech</div>
                  <div style={{ fontFamily:'var(--font-serif)', fontSize:`${theme.postPageTitleSize||40}px`, fontWeight:900, color:String(theme.postPageTitleColor||'var(--ink)'), lineHeight:1.04, letterSpacing:'-1.5px', marginBottom:'12px' }}>How AI is Rewriting Classroom Engagement</div>
                  <p style={{ fontFamily:'var(--font-sans)', fontSize:`${theme.postPageBodySize||16}px`, color:String(theme.postPageBodyColor||'var(--ink)'), fontWeight:Number(theme.postPageBodyWeight||300), lineHeight:1.8 }}>
                    From adaptive learning paths to AI-powered feedback loops — what's actually working in schools across India and Southeast Asia, and what still needs to change.
                  </p>
                </div>
              )}
              {(activeSection==='profile') && (
                <div style={{ marginTop:'14px', background:String(theme.profileBg||'var(--cream)'), borderRadius:'10px', padding:'28px', border:'1px solid var(--border)' }}>
                  <div style={{ textAlign:'center', marginBottom:'14px', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--muted)' }}>PROFILE PAGE PREVIEW</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                    <div style={{ width:64, height:64, borderRadius:'14px', background:'linear-gradient(135deg,var(--teal),var(--teal3))', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'24px', color:'#fff', flexShrink:0 }}>R</div>
                    <div>
                      <div style={{ fontFamily:'var(--font-serif)', fontSize:`${theme.profileNameSize||28}px`, fontWeight:900, color:String(theme.profileNameColor||'var(--ink)'), letterSpacing:'-0.5px' }}>Rajesh Kumar</div>
                      <div style={{ fontFamily:'var(--font-sans)', fontSize:`${theme.profileBioSize||14}px`, color:String(theme.profileBioColor||'var(--muted)'), marginTop:'3px' }}>EdTech Founder · Bangalore · 48 Articles · 12K Followers</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
