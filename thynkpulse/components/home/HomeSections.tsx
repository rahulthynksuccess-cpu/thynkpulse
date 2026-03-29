'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useContent } from '@/hooks/useContent'

/* ── MARQUEE ──────────────────────────────────────────────────── */
export function MarqueeSection() {
  const cRaw = useContent('content.marquee')
  const c = cRaw ?? { items: ['🎓 For Educators','💡 For Innovators','🏢 For EdTech Companies','📊 For Sales Professionals'] }
  const items = Array.isArray(c?.items) ? c.items : [
    '🎓 For Educators','💡 For Innovators','🏢 For EdTech Companies',
    '📊 For Sales Professionals','🏫 For School Leaders','🔬 For Researchers',
    '🌍 For Global Educators','✍️ Share Your Story',
  ]
  const doubled = [...items, ...items]
  return (
    <div style={{ background:'var(--marquee-bg, var(--teal))', padding:'14px 0', overflow:'hidden', borderTop:'1px solid rgba(255,255,255,.1)', borderBottom:'1px solid rgba(255,255,255,.1)' }}>
      <div style={{ display:'flex', animation:'marquee 30s linear infinite', whiteSpace:'nowrap' }}>
        {doubled.map((item:string, i:number) => (
          <span key={i} style={{ padding:'0 32px', fontSize:'var(--marquee-font-size,13px)', fontWeight:500, color:'var(--marquee-text-color,rgba(255,255,255,.8))', display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
            {item} <span style={{ color:'var(--marquee-dot-color,var(--teal3))', fontSize:'16px' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── STATS BAR ────────────────────────────────────────────────── */
const STATS_DEFAULT = [
  { n:'10K',  sup:'+', l:'Community Members'    },
  { n:'2.4K', sup:'+', l:'Articles Published'   },
  { n:'180',  sup:'+', l:'EdTech Companies'     },
  { n:'40',   sup:'+', l:'Countries Represented' },
  { n:'100',  sup:'%', l:'Free Forever'          },
]
export function StatsBar() {
  const rawStats = useContent('content.stats')
  const stats = Array.isArray(rawStats) ? rawStats : STATS_DEFAULT
  return (
    <>
      <style>{`
        @media(max-width:640px){.stats-bar{grid-template-columns:1fr 1fr !important;}}
        @media(max-width:400px){.stats-bar{grid-template-columns:1fr !important;}}
      `}</style>
      <div className="stats-bar" style={{ background:'var(--stats-bg,#fff)', borderBottom:'1px solid var(--border)', display:'grid', gridTemplateColumns:`repeat(${stats.length},1fr)` }}>
      {stats.map((s:any, i:number) => (
        <div key={i} style={{ padding:'28px 24px', textAlign:'center', borderRight: i<stats.length-1 ? '1px solid var(--border)' : 'none', position:'relative', overflow:'hidden' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'var(--stat-num-size,40px)', fontWeight:900, color:'var(--stat-num-color,var(--ink))', letterSpacing:'-1.5px', lineHeight:1 }}>
            {s.n}<sup style={{ fontSize:'18px', color:'var(--stat-accent-color,var(--coral))' }}>{s.sup}</sup>
          </div>
          <div style={{ fontSize:'var(--stat-label-size,12px)', color:'var(--stat-label-color,var(--muted))', fontWeight:500, letterSpacing:'.3px', marginTop:'6px' }}>{s.l}</div>
        </div>
      ))}
      </div>
    </>
  )
}

/* ── COMMUNITY SECTION ────────────────────────────────────────── */
const COMM_DEFAULT = [
  { emoji:'🏫', gradient:'linear-gradient(135deg,#EAF4F1,#D5EDE8)', title:'Educators & Teachers',     desc:'Share classroom innovations, teaching methods, and real challenges. Connect with peers across schools worldwide.', count:'3,200+ educators',   countColor:'var(--teal)',  dotColor:'var(--teal)'  },
  { emoji:'💡', gradient:'linear-gradient(135deg,#FEF0EA,#FAD8CB)', title:'EdTech Companies',         desc:'Publish thought leadership, product insights, and case studies. Build authentic trust with educators.',           count:'180+ companies',    countColor:'var(--coral)', dotColor:'var(--coral)' },
  { emoji:'📊', gradient:'linear-gradient(135deg,#F5F0FD,#E4D7F7)', title:'Sales Professionals',      desc:'Real conversations about selling in education — strategies, objections, and what actually closes deals.',          count:'840+ professionals',countColor:'var(--plum)',  dotColor:'var(--plum)'  },
  { emoji:'🏆', gradient:'linear-gradient(135deg,#FEF9EC,#F7E8BE)', title:'School Leaders',           desc:'Principals and administrators sharing governance insights, procurement decisions, and transformation stories.',    count:'620+ leaders',      countColor:'var(--gold)',  dotColor:'var(--gold)'  },
  { emoji:'🔬', gradient:'linear-gradient(135deg,#EAF4F1,#C4E4DC)', title:'Researchers & Innovators', desc:'Bridge the gap between academic research and classroom practice. Make findings accessible and actionable.',        count:'290+ researchers',  countColor:'var(--teal)',  dotColor:'var(--teal)'  },
  { emoji:'🌍', gradient:'linear-gradient(135deg,#FDF0F0,#F5CBCB)', title:'International Educators',  desc:'Education challenges are global. Connect with practitioners from 40+ countries and diverse education systems.',   count:'40+ countries',     countColor:'var(--coral)', dotColor:'var(--coral)' },
]
export function CommunitySection() {
  const cRaw = useContent('content.communities')
  const COMM_DEFAULTS = [
    { emoji:'🏫', gradient:'linear-gradient(135deg,#EAF4F1,#D5EDE8)', title:'Educators & Teachers', desc:'Share classroom innovations, teaching methods, and real challenges. Connect with peers across schools worldwide.', count:'3,200+ educators', countColor:'var(--teal)', dotColor:'var(--teal)' },
    { emoji:'💡', gradient:'linear-gradient(135deg,#FEF0EA,#FAD8CB)', title:'EdTech Companies', desc:'Publish thought leadership, product insights, and case studies. Build authentic trust with educators.', count:'180+ companies', countColor:'var(--coral)', dotColor:'var(--coral)' },
    { emoji:'📊', gradient:'linear-gradient(135deg,#F5F0FD,#E4D7F7)', title:'Sales Professionals', desc:'Real conversations about selling in education — strategies, objections, and what actually closes deals.', count:'840+ professionals', countColor:'var(--plum)', dotColor:'var(--plum)' },
    { emoji:'🏆', gradient:'linear-gradient(135deg,#FEF9EC,#F7E8BE)', title:'School Leaders', desc:'Principals and administrators sharing governance insights, procurement decisions, and transformation stories.', count:'620+ leaders', countColor:'var(--gold)', dotColor:'var(--gold)' },
    { emoji:'🔬', gradient:'linear-gradient(135deg,#EAF4F1,#C4E4DC)', title:'Researchers & Innovators', desc:'Bridge the gap between academic research and classroom practice. Make findings accessible and actionable.', count:'290+ researchers', countColor:'var(--teal)', dotColor:'var(--teal)' },
    { emoji:'🌍', gradient:'linear-gradient(135deg,#FDF0F0,#F5CBCB)', title:'International Educators', desc:'Education challenges are global. Connect with practitioners from 40+ countries and diverse education systems.', count:'40+ countries', countColor:'var(--coral)', dotColor:'var(--coral)' },
  ]
  const c = (Array.isArray(cRaw) && cRaw.length > 0) ? cRaw : COMM_DEFAULTS
  const communities = Array.isArray(c) && c.length ? c : COMM_DEFAULT
  return (
    <section id="community" style={{ padding:'96px 5%', background:'var(--community-bg, #fff)' }}>
      <div className="eyebrow"><div className="eyebrow-line" style={{ background:'var(--community-eyebrow-color,var(--coral))' }} /><span className="eyebrow-text" style={{ color:'var(--community-eyebrow-color,var(--coral))' }}>Built for every education professional</span></div>
      <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'var(--community-title-size, 42px)', fontWeight:900, color:'var(--community-title-color, var(--ink))', lineHeight:1.05, letterSpacing:'-1.5px', marginBottom:'14px' }}>One Platform,<br /><em style={{ fontStyle:'italic', color:'var(--community-accent-color, var(--teal))' }}>Every Voice</em></h2>
      <p style={{ fontSize:'var(--community-desc-size, 16px)', color:'var(--community-desc-color, var(--muted))', lineHeight:1.8, maxWidth:'520px', marginTop:'14px', fontWeight:300 }}>Whether you teach a class of 30 or run an EdTech company — there&apos;s a place for you in Thynk Pulse.</p>
      <div className="comm-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginTop:'56px' }}>
        {communities.map((comm:any, i:number) => (
          <motion.div key={i} initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*.08 }}
            style={{ borderRadius:'22px', padding:'36px 30px', background:comm.gradient, position:'relative', overflow:'hidden', cursor:'pointer', border:'1.5px solid transparent', transition:'all .3s' }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'}>
            <div style={{ position:'absolute', right:'-10px', bottom:'-10px', fontSize:'100px', opacity:.12, lineHeight:1 }}>{comm.emoji}</div>
            <div style={{ width:'52px', height:'52px', borderRadius:'14px', background:'rgba(255,255,255,.7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', marginBottom:'20px', boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>{comm.emoji}</div>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:'var(--community-card-title-size, 20px)', fontWeight:700, color:'var(--community-card-title-color, var(--ink))', marginBottom:'10px' }}>{comm.title}</div>
            <div style={{ fontSize:'var(--community-card-desc-size, 13px)', color:'var(--community-card-desc-color, var(--muted))', lineHeight:1.7, marginBottom:'18px' }}>{comm.desc}</div>
            <div style={{ fontSize:'var(--community-count-size, 12px)', fontWeight:600, display:'flex', alignItems:'center', gap:'6px' }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:comm.dotColor }} />
              <span style={{ color:comm.countColor }}>{comm.count}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ── PROFILE / WRITERS SECTION ────────────────────────────────── */
const FEATURES_DEFAULT = [
  { icon:'🏅', bg:'rgba(10,95,85,.08)',  title:'Verified Expert Badges',   desc:'Get recognized as an Educator, EdTech Professional, Researcher, or School Leader with community-verified credentials.' },
  { icon:'📊', bg:'rgba(232,81,42,.08)', title:'Rich Analytics Dashboard', desc:'Track reads, followers, engagement, and article performance with a detailed writer dashboard built for growth.' },
  { icon:'🔗', bg:'rgba(201,146,42,.1)', title:'Shareable Public Profile',  desc:'Your Thynk Pulse profile is a living portfolio — share it on LinkedIn, resumes, or with school networks.' },
  { icon:'📣', bg:'rgba(61,31,94,.08)',  title:'Community Amplification',   desc:'Top articles get featured in our weekly newsletter, social channels, and homepage — reaching 10K+ education professionals.' },
]
export function ProfileSection() {
  const cRaw = useContent('content.writers-spotlight')
  const c = cRaw ?? {}
  const features = Array.isArray(c?.features) && c.features.length ? c.features : [
    { icon:'🏅', bg:'rgba(10,95,85,.08)', title:'Verified Expert Badges', desc:'Get recognized as an Educator, EdTech Professional, Researcher, or School Leader with community-verified credentials.' },
    { icon:'📊', bg:'rgba(232,81,42,.08)', title:'Rich Analytics Dashboard', desc:'Track reads, followers, engagement, and article performance with a detailed writer dashboard built for growth.' },
    { icon:'🔗', bg:'rgba(201,146,42,.1)', title:'Shareable Public Profile', desc:'Your Thynk Pulse profile is a living portfolio — share it on LinkedIn, resumes, or with school networks.' },
    { icon:'📣', bg:'rgba(61,31,94,.08)', title:'Community Amplification', desc:'Top articles get featured in our weekly newsletter, social channels, and homepage — reaching 10K+ education professionals.' },
  ]
  const writerName   = c?.writerName   || 'Ananya Krishnan'
  const writerRole   = c?.writerRole   || 'EdTech Product Lead · Mumbai'
  const writerQuote  = c?.writerQuote  || 'Building products for the next 200 million learners. Writing about EdTech, product strategy, and what failure in education tech actually looks like from the inside.'
  const writerStats  = c?.writerStats  || [['48','Articles'],['12K','Followers'],['340K','Reads']]
  const sectionDesc  = c?.sectionDesc  || 'Every writer on Thynk Pulse gets a rich, professional profile that showcases expertise, audience, and impact — giving your voice the visibility it deserves.'
  const ctaLabel     = c?.ctaLabel     || 'Create Your Profile →'
  const badgeMonth   = c?.badgeMonth   || '+1.4K'
  const badgeLabel   = c?.badgeLabel   || '↑ New followers'

  return (
    <section id="writers" style={{ padding:'96px 5%', background:'var(--writers-section-bg, var(--cta-section-bg,var(--cream)))' }}>
      <div className="eyebrow"><div className="eyebrow-line" style={{ background:'var(--writers-eyebrow-color,var(--coral))' }} /><span className="eyebrow-text" style={{ color:'var(--writers-eyebrow-color,var(--coral))' }}>Your profile, your platform</span></div>
      <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'var(--writers-section-title-size, 42px)', fontWeight:900, color:'var(--writers-section-title, var(--ink))', lineHeight:1.05, letterSpacing:'-1.5px', marginBottom:'14px' }}>Writers Get<br /><em style={{ fontStyle:'italic', color:'var(--writers-accent-color, var(--teal))' }}>The Spotlight</em></h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center', marginTop:'60px' }}>
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', top:'-20px', right:'-32px', background:'var(--coral)', borderRadius:'16px', padding:'14px 18px', boxShadow:'0 8px 32px rgba(232,81,42,.3)', animation:'floatY 3.5s ease-in-out infinite', zIndex:2 }}>
            <div style={{ fontSize:'11px', color:'rgba(255,255,255,.7)' }}>This month</div>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:'26px', fontWeight:900, color:'#fff', lineHeight:1 }}>{badgeMonth}</div>
            <div style={{ fontSize:'11px', color:'rgba(255,255,255,.8)', marginTop:'1px' }}>{badgeLabel}</div>
          </div>
          <div className="card" style={{ padding:'30px', background:'var(--writers-card-bg-home,#fff)' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'14px', marginBottom:'22px' }}>
              <div className="avatar av-coral" style={{ width:60, height:60, fontSize:'24px', borderRadius:'16px' }}>{writerName.split(' ').map((w:string)=>w[0]).join('').slice(0,2)}</div>
              <div>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'var(--writers-name-size,20px)', fontWeight:700, color:'var(--writers-name-color,var(--ink))' }}>{writerName}</div>
                <div style={{ fontSize:'var(--writers-role-size,12px)', color:'var(--writers-role-color,var(--muted))', marginTop:'2px' }}>{writerRole}</div>
              </div>
              <span className="badge badge-teal" style={{ marginLeft:'auto', whiteSpace:'nowrap', flexShrink:0 }}>✓ Verified Expert</span>
            </div>
            <div style={{ fontSize:'13px', color:'var(--muted)', lineHeight:1.7, paddingBottom:'20px', borderBottom:'1px solid var(--border2)', marginBottom:'20px' }}>
              &ldquo;{writerQuote}&rdquo;
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'20px' }}>
              {writerStats.map(([n,l]:string[]) => (
                <div key={l} style={{ background:'var(--cream)', borderRadius:'12px', padding:'12px', textAlign:'center' }}>
                  <div style={{ fontFamily:'var(--font-serif)', fontSize:'var(--writers-stat-num-size,24px)', fontWeight:900, color:'var(--writers-stat-num-color,var(--ink))', lineHeight:1 }}>{n}</div>
                  <div style={{ fontSize:'11px', color:'var(--writers-stat-label-color,var(--muted))', marginTop:'3px' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <p style={{ fontSize:'var(--community-desc-size,16px)', color:'var(--community-desc-color,var(--muted))', lineHeight:1.8, fontWeight:300 }}>{sectionDesc}</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'22px', marginTop:'36px' }}>
            {features.map((f:any) => (
              <div key={f.title} style={{ display:'flex', gap:'16px', alignItems:'flex-start' }}>
                <div style={{ width:46, height:46, borderRadius:'12px', background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize:'var(--writers-feature-title-size,16px)', fontWeight:600, color:'var(--writers-feature-title-color,var(--ink))', marginBottom:'4px' }}>{f.title}</div>
                  <div style={{ fontSize:'var(--writers-feature-desc-size,13px)', color:'var(--writers-feature-desc-color,var(--muted))', lineHeight:1.7 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:'36px' }}>
            <Link href="/register" className="btn-teal" style={{ display:'inline-flex' }}>{ctaLabel}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── CTA SECTION ──────────────────────────────────────────────── */
const CTA_FEATURES_DEFAULT = [
  { icon:'✍️', title:'Write & Publish',       desc:'Share your experiences and build a readership of 10,000+ education professionals.' },
  { icon:'🤝', title:'Connect & Collaborate', desc:'Network with educators, EdTech founders, and innovators across India and beyond.' },
  { icon:'📈', title:'Grow Your Brand',        desc:'Build authentic authority in the education space with your verified expert profile.' },
]
export function CTASection() {
  const cRaw = useContent('content.cta-section')
  const c = cRaw ?? {}
  const badge       = c?.badge       || 'Completely Free · No Credit Card'
  const headline    = c?.headline    || "Join Thynk Pulse.\nShape Education's Future."
  const subtitle    = c?.subtitle    || "Be part of India's most vibrant education community. Share your story, build your audience, and connect with thousands of education professionals."
  const placeholder = c?.placeholder || 'Enter your work email'
  const btnLabel    = c?.btnLabel    || 'Join Free →'
  const footnote    = c?.footnote    || '🔒 No spam. No paywall. Free forever.'
  const ctaFeatures = Array.isArray(c?.features) && c.features.length ? c.features : CTA_FEATURES_DEFAULT
  const [line1, line2] = headline.includes('\n') ? headline.split('\n') : [headline, '']

  return (
    <section id="join" style={{ padding:'96px 5%', background:'var(--cta-section-bg,var(--cream))' }}>
      <div style={{ background:'var(--cta-bg,var(--teal))', borderRadius:'32px', padding:'80px 72px', position:'relative', overflow:'hidden', textAlign:'center' }}>
        <div style={{ position:'absolute', top:'-100px', left:'-100px', width:'500px', height:'500px', background:'radial-gradient(ellipse,rgba(255,255,255,.07) 0%,transparent 70%)' }} />
        <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)', color:'rgba(255,255,255,.9)', fontSize:'12px', fontWeight:600, letterSpacing:'1.5px', textTransform:'uppercase', padding:'7px 16px', borderRadius:'50px', marginBottom:'28px' }}>
          <div style={{ width:7, height:7, background:'var(--coral)', borderRadius:'50%', animation:'blink 2s infinite' }} />
          {badge}
        </div>
        <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'var(--cta-h2-size,clamp(36px,5vw,64px))', fontWeight:900, color:'var(--cta-h2-color,#fff)', letterSpacing:'-2px', lineHeight:1.05, marginBottom:'18px', position:'relative', zIndex:1 }}>
          {line1}{line2 && <><br />{line2}</>}
        </h2>
        <p style={{ fontSize:'17px', color:'var(--cta-subtitle-color,rgba(255,255,255,.75))', maxWidth:'460px', margin:'0 auto 40px', lineHeight:1.7, fontWeight:300, position:'relative', zIndex:1 }}>
          {subtitle}
        </p>
        <div style={{ display:'flex', gap:'10px', maxWidth:'460px', margin:'0 auto 20px', position:'relative', zIndex:2 }}>
          <input type="email" placeholder={placeholder}
            style={{ flex:1, background:'rgba(255,255,255,.12)', border:'1.5px solid rgba(255,255,255,.2)', color:'#fff', fontFamily:'var(--font-sans)', fontSize:'15px', padding:'14px 20px', borderRadius:'12px', outline:'none' }} />
          <Link href="/register" style={{ flexShrink:0, padding:'14px 28px', borderRadius:'var(--radius)', background:'var(--cta-btn-bg,var(--coral))', color:'var(--cta-btn-color,#fff)', fontSize:'var(--cta-btn-size,15px)', fontWeight:600, fontFamily:'var(--font-sans)', textDecoration:'none', display:'inline-flex', alignItems:'center' }}>{btnLabel}</Link>
        </div>
        <p style={{ fontSize:'12px', color:'rgba(255,255,255,.5)', position:'relative', zIndex:2 }}>{footnote}</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginTop:'48px', position:'relative', zIndex:2 }}>
          {ctaFeatures.map((f:any) => (
            <div key={f.title} style={{ background:'var(--cta-feat-card-bg,rgba(255,255,255,.08))', border:'1px solid rgba(255,255,255,.12)', borderRadius:'16px', padding:'20px', textAlign:'left' }}>
              <div style={{ fontSize:'22px', marginBottom:'8px' }}>{f.icon}</div>
              <div style={{ fontSize:'var(--cta-feat-title-size,14px)', fontWeight:600, color:'var(--cta-feat-title-color,#fff)', marginBottom:'4px' }}>{f.title}</div>
              <div style={{ fontSize:'var(--cta-feat-desc-size,12px)', color:'var(--cta-feat-desc-color,rgba(255,255,255,.6))', lineHeight:1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
