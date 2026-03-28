'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useContent } from '@/hooks/useContent'

/* ── MARQUEE ──────────────────────────────────────────────────── */
const MARQUEE_ITEMS = [
  '🎓 For Educators', '💡 For Innovators', '🏢 For EdTech Companies',
  '📊 For Sales Professionals', '🏫 For School Leaders', '🔬 For Researchers',
  '🌍 For Global Educators', '✍️ Share Your Story',
]

export function MarqueeSection() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div style={{ background:'var(--teal)', padding:'14px 0', overflow:'hidden', borderTop:'1px solid rgba(255,255,255,.1)', borderBottom:'1px solid rgba(255,255,255,.1)' }}>
      <div style={{ display:'flex', animation:'marquee 30s linear infinite', whiteSpace:'nowrap' }}>
        {items.map((item, i) => (
          <span key={i} style={{ padding:'0 32px', fontSize:'13px', fontWeight:500, color:'rgba(255,255,255,.8)', display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
            {item} <span style={{ color:'var(--teal3)', fontSize:'16px' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── STATS BAR ────────────────────────────────────────────────── */
const STATS = [
  { n: '10K', sup:'+', l: 'Community Members'   },
  { n: '2.4K', sup:'+', l: 'Articles Published'  },
  { n: '180', sup:'+', l: 'EdTech Companies'    },
  { n: '40', sup:'+', l: 'Countries Represented' },
  { n: '100', sup:'%', l: 'Free Forever'         },
]

export function StatsBar() {
  const rawStats = useContent('content.stats')
  const stats = Array.isArray(rawStats) ? rawStats : STATS
  return (
    <>
      <style>{`
        @media(max-width:640px){.stats-bar{grid-template-columns:1fr 1fr !important;}}
        @media(max-width:400px){.stats-bar{grid-template-columns:1fr !important;}}
      `}</style>
      <div className="stats-bar" style={{ background:'var(--stats-bg,#fff)', borderBottom:'1px solid var(--border)', display:'grid', gridTemplateColumns:`repeat(${stats.length},1fr)` }}>
      {stats.map((s:any, i:number) => (
        <div key={s.l} style={{ padding:'28px 24px', textAlign:'center', borderRight: i<stats.length-1 ? '1px solid var(--border)' : 'none', position:'relative', overflow:'hidden' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'var(--stat-num-size,40px)', fontWeight:900, color:'var(--stat-num-color,var(--ink))', letterSpacing:'-1.5px', lineHeight:1 }}>
            {s.n}<sup style={{ fontSize:'18px', color:'var(--coral)' }}>{s.sup}</sup>
          </div>
          <div style={{ fontSize:'12px', color:'var(--muted)', fontWeight:500, letterSpacing:'.3px', marginTop:'6px' }}>{s.l}</div>
        </div>
      ))}
      </div>
    </>
  )
}

/* ── COMMUNITY SECTION ────────────────────────────────────────── */
const COMMUNITIES = [
  { emoji:'🏫', gradient:'linear-gradient(135deg,#EAF4F1,#D5EDE8)', title:'Educators & Teachers',       desc:'Share classroom innovations, teaching methods, and real challenges. Connect with peers across schools worldwide.', count:'3,200+ educators',  countColor:'var(--teal)',  dotColor:'var(--teal)'  },
  { emoji:'💡', gradient:'linear-gradient(135deg,#FEF0EA,#FAD8CB)', title:'EdTech Companies',           desc:'Publish thought leadership, product insights, and case studies. Build authentic trust with educators.',           count:'180+ companies',   countColor:'var(--coral)', dotColor:'var(--coral)' },
  { emoji:'📊', gradient:'linear-gradient(135deg,#F5F0FD,#E4D7F7)', title:'Sales Professionals',        desc:'Real conversations about selling in education — strategies, objections, and what actually closes deals.',          count:'840+ professionals',countColor:'var(--plum)',  dotColor:'var(--plum)'  },
  { emoji:'🏆', gradient:'linear-gradient(135deg,#FEF9EC,#F7E8BE)', title:'School Leaders',             desc:'Principals and administrators sharing governance insights, procurement decisions, and transformation stories.',    count:'620+ leaders',     countColor:'var(--gold)',  dotColor:'var(--gold)'  },
  { emoji:'🔬', gradient:'linear-gradient(135deg,#EAF4F1,#C4E4DC)', title:'Researchers & Innovators',   desc:'Bridge the gap between academic research and classroom practice. Make findings accessible and actionable.',        count:'290+ researchers', countColor:'var(--teal)',  dotColor:'var(--teal)'  },
  { emoji:'🌍', gradient:'linear-gradient(135deg,#FDF0F0,#F5CBCB)', title:'International Educators',    desc:'Education challenges are global. Connect with practitioners from 40+ countries and diverse education systems.',   count:'40+ countries',    countColor:'var(--coral)', dotColor:'var(--coral)' },
]

export function CommunitySection() {
  return (
    <section id="community" style={{ padding:'96px 5%', background:'#fff' }}>
      <div className="eyebrow"><div className="eyebrow-line" /><span className="eyebrow-text">Built for every education professional</span></div>
      <h2 className="s-title">One Platform,<br /><em>Every Voice</em></h2>
      <p className="s-desc">Whether you teach a class of 30 or run an EdTech company — there&apos;s a place for you in Thynk Pulse.</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginTop:'56px' }} className="comm-grid">
        {COMMUNITIES.map((c, i) => (
          <motion.div key={c.title} initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*.08 }}
            style={{ borderRadius:'22px', padding:'36px 30px', background:c.gradient, position:'relative', overflow:'hidden', cursor:'pointer', border:'1.5px solid transparent', transition:'all .3s' }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'}>
            <div style={{ position:'absolute', right:'-10px', bottom:'-10px', fontSize:'100px', opacity:.12, lineHeight:1 }}>{c.emoji}</div>
            <div style={{ width:'52px', height:'52px', borderRadius:'14px', background:'rgba(255,255,255,.7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', marginBottom:'20px', boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>{c.emoji}</div>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:700, color:'var(--ink)', marginBottom:'10px' }}>{c.title}</div>
            <div style={{ fontSize:'13px', color:'var(--muted)', lineHeight:1.7, marginBottom:'18px' }}>{c.desc}</div>
            <div style={{ fontSize:'12px', fontWeight:600, display:'flex', alignItems:'center', gap:'6px' }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:c.dotColor }} />
              <span style={{ color:c.countColor }}>{c.count}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ── PROFILE SECTION ──────────────────────────────────────────── */
export function ProfileSection() {
  const FEATURES = [
    { icon:'🏅', bg:'rgba(10,95,85,.08)',    title:'Verified Expert Badges',     desc:'Get recognized as an Educator, EdTech Professional, Researcher, or School Leader with community-verified credentials.' },
    { icon:'📊', bg:'rgba(232,81,42,.08)',   title:'Rich Analytics Dashboard',   desc:'Track reads, followers, engagement, and article performance with a detailed writer dashboard built for growth.' },
    { icon:'🔗', bg:'rgba(201,146,42,.1)',   title:'Shareable Public Profile',   desc:'Your Thynk Pulse profile is a living portfolio — share it on LinkedIn, resumes, or with school networks.' },
    { icon:'📣', bg:'rgba(61,31,94,.08)',    title:'Community Amplification',    desc:'Top articles get featured in our weekly newsletter, social channels, and homepage — reaching 10K+ education professionals.' },
  ]

  return (
    <section id="writers" style={{ padding:'96px 5%', background:'var(--cream)' }}>
      <div className="eyebrow"><div className="eyebrow-line" /><span className="eyebrow-text">Your profile, your platform</span></div>
      <h2 className="s-title">Writers Get<br /><em>The Spotlight</em></h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center', marginTop:'60px' }}>

        {/* Mock profile card */}
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', top:'-20px', right:'-32px', background:'var(--coral)', borderRadius:'16px', padding:'14px 18px', boxShadow:'0 8px 32px rgba(232,81,42,.3)', animation:'floatY 3.5s ease-in-out infinite', zIndex:2 }}>
            <div style={{ fontSize:'11px', color:'rgba(255,255,255,.7)' }}>This month</div>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:'26px', fontWeight:900, color:'#fff', lineHeight:1 }}>+1.4K</div>
            <div style={{ fontSize:'11px', color:'rgba(255,255,255,.8)', marginTop:'1px' }}>↑ New followers</div>
          </div>
          <div className="card" style={{ padding:'30px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'14px', marginBottom:'22px' }}>
              <div className="avatar av-coral" style={{ width:60, height:60, fontSize:'24px', borderRadius:'16px' }}>AK</div>
              <div>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:700, color:'var(--ink)' }}>Ananya Krishnan</div>
                <div style={{ fontSize:'12px', color:'var(--muted)', marginTop:'2px' }}>EdTech Product Lead · Mumbai</div>
              </div>
              <span className="badge badge-teal" style={{ marginLeft:'auto', whiteSpace:'nowrap', flexShrink:0 }}>✓ Verified Expert</span>
            </div>
            <div style={{ fontSize:'13px', color:'var(--muted)', lineHeight:1.7, paddingBottom:'20px', borderBottom:'1px solid var(--border2)', marginBottom:'20px' }}>
              &ldquo;Building products for the next 200 million learners. Writing about EdTech, product strategy, and what failure in education tech actually looks like from the inside.&rdquo;
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'20px' }}>
              {[['48','Articles'],['12K','Followers'],['340K','Reads']].map(([n,l]) => (
                <div key={l} style={{ background:'var(--cream)', borderRadius:'12px', padding:'12px', textAlign:'center' }}>
                  <div style={{ fontFamily:'var(--font-serif)', fontSize:'24px', fontWeight:900, color:'var(--ink)', lineHeight:1 }}>{n}</div>
                  <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'3px' }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--muted)', marginBottom:'12px' }}>Recent Posts</div>
            {[
              { icon:'💡', bg:'linear-gradient(135deg,#EAF4F1,#C0E6DC)', title:'Why EdTech Products Fail in Tier-2 Schools', reads:'8.2K reads' },
              { icon:'📱', bg:'linear-gradient(135deg,#FEF0EA,#F7CBB8)', title:'The App That Changed How I Teach Math',       reads:'5.6K reads' },
              { icon:'🎯', bg:'linear-gradient(135deg,#F5F0FD,#DEC8F0)', title:'Retention > Acquisition in EdTech Growth',   reads:'11K reads'  },
            ].map(ri => (
              <div key={ri.title} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 0', borderBottom:'1px solid var(--border2)' }}>
                <div style={{ width:36, height:36, borderRadius:'8px', background:ri.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>{ri.icon}</div>
                <div style={{ flex:1, fontSize:'12px', fontWeight:500, color:'var(--ink)', lineHeight:1.4 }}>{ri.title}</div>
                <div style={{ fontSize:'11px', color:'var(--muted)', flexShrink:0 }}>{ri.reads}</div>
              </div>
            ))}
          </div>
          <div style={{ position:'absolute', bottom:'-22px', left:'-30px', background:'#fff', border:'1px solid var(--border)', borderRadius:'16px', padding:'14px 18px', boxShadow:'var(--shadow)', animation:'floatY 3.5s 1.8s ease-in-out infinite', zIndex:2 }}>
            <div style={{ fontSize:'11px', color:'var(--muted)' }}>Avg. read time</div>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:'24px', fontWeight:900, color:'var(--ink)', lineHeight:1 }}>6.2 <span style={{ fontSize:'14px', color:'var(--muted)' }}>min</span></div>
            <div style={{ fontSize:'11px', color:'var(--teal)', marginTop:'1px' }}>↑ Above platform avg</div>
          </div>
        </div>

        {/* Text + features */}
        <div>
          <p className="s-desc">Every writer on Thynk Pulse gets a rich, professional profile that showcases expertise, audience, and impact — giving your voice the visibility it deserves.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'22px', marginTop:'36px' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ display:'flex', gap:'16px', alignItems:'flex-start' }}>
                <div style={{ width:46, height:46, borderRadius:'12px', background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize:'16px', fontWeight:600, color:'var(--ink)', marginBottom:'4px' }}>{f.title}</div>
                  <div style={{ fontSize:'13px', color:'var(--muted)', lineHeight:1.7 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:'36px' }}>
            <Link href="/register" className="btn-teal" style={{ display:'inline-flex' }}>Create Your Profile →</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── CTA SECTION ──────────────────────────────────────────────── */
export function CTASection() {
  return (
    <section id="join" style={{ padding:'96px 5%', background:'var(--cream)' }}>
      <div style={{ background:'var(--teal)', borderRadius:'32px', padding:'80px 72px', position:'relative', overflow:'hidden', textAlign:'center' }}>
        <div style={{ position:'absolute', top:'-100px', left:'-100px', width:'500px', height:'500px', background:'radial-gradient(ellipse,rgba(255,255,255,.07) 0%,transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:'-80px', right:'-80px', width:'400px', height:'400px', background:'radial-gradient(ellipse,rgba(255,255,255,.05) 0%,transparent 70%)' }} />

        <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)', color:'rgba(255,255,255,.9)', fontSize:'12px', fontWeight:600, letterSpacing:'1.5px', textTransform:'uppercase', padding:'7px 16px', borderRadius:'50px', marginBottom:'28px' }}>
          <div style={{ width:7, height:7, background:'var(--coral)', borderRadius:'50%', animation:'blink 2s infinite' }} />
          Completely Free · No Credit Card
        </div>

        <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(36px,5vw,64px)', fontWeight:900, color:'#fff', letterSpacing:'-2px', lineHeight:1.05, marginBottom:'18px', position:'relative', zIndex:1 }}>
          Join <em style={{ fontStyle:'italic', color:'var(--gold2)' }}>Thynk Pulse</em>.<br />Shape Education&apos;s Future.
        </h2>

        <p style={{ fontSize:'17px', color:'rgba(255,255,255,.75)', maxWidth:'460px', margin:'0 auto 40px', lineHeight:1.7, fontWeight:300, position:'relative', zIndex:1 }}>
          Be part of India&apos;s most vibrant education community. Share your story, build your audience, and connect with thousands of education professionals.
        </p>

        <div style={{ display:'flex', gap:'10px', maxWidth:'460px', margin:'0 auto 20px', position:'relative', zIndex:2 }}>
          <input type="email" placeholder="Enter your work email"
            style={{ flex:1, background:'rgba(255,255,255,.12)', border:'1.5px solid rgba(255,255,255,.2)', color:'#fff', fontFamily:'var(--font-sans)', fontSize:'15px', padding:'14px 20px', borderRadius:'12px', outline:'none' }} />
          <Link href="/register" className="btn-coral" style={{ flexShrink:0, padding:'14px 28px' }}>Join Free →</Link>
        </div>

        <p style={{ fontSize:'12px', color:'rgba(255,255,255,.5)', position:'relative', zIndex:2 }}>
          🔒 No spam. No paywall. <span style={{ color:'rgba(255,255,255,.75)' }}>Free forever.</span>
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginTop:'48px', position:'relative', zIndex:2 }}>
          {[
            { icon:'✍️', title:'Write & Publish',        desc:'Share your experiences and build a readership of 10,000+ education professionals.' },
            { icon:'🤝', title:'Connect & Collaborate',  desc:'Network with educators, EdTech founders, and innovators across India and beyond.' },
            { icon:'📈', title:'Grow Your Brand',        desc:'Build authentic authority in the education space with your verified expert profile.' },
          ].map(f => (
            <div key={f.title} style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)', borderRadius:'16px', padding:'20px', textAlign:'left' }}>
              <div style={{ fontSize:'22px', marginBottom:'8px' }}>{f.icon}</div>
              <div style={{ fontSize:'14px', fontWeight:600, color:'#fff', marginBottom:'4px' }}>{f.title}</div>
              <div style={{ fontSize:'12px', color:'rgba(255,255,255,.6)', lineHeight:1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
