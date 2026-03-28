'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .7, delay, ease: [.22, 1, .36, 1] },
})

export function HeroSection() {
  const { isAuthenticated } = useAuthStore()

  return (
    <section style={{ minHeight: '100vh', padding: '140px 5% 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '60px', position: 'relative', overflow: 'hidden', background: 'var(--cream)' }}>

      {/* Bg decorations */}
      <div style={{ position:'absolute', top:'-100px', right:'-150px', width:'700px', height:'700px', background:'radial-gradient(ellipse, rgba(10,95,85,.07) 0%, transparent 65%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'400px', height:'400px', backgroundImage:'radial-gradient(circle, var(--teal) 1px, transparent 1px)', backgroundSize:'28px 28px', opacity:.07, pointerEvents:'none' }} />

      {/* LEFT */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <motion.div {...fade(0)}>
          <div className="pill" style={{ marginBottom: '28px' }}>
            <div style={{ width:7, height:7, background:'var(--coral)', borderRadius:'50%', animation:'blink 2s infinite' }} />
            India&apos;s Education Community Platform
          </div>
        </motion.div>

        <motion.h1 {...fade(.12)} style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(46px,5.5vw,80px)', fontWeight:900, lineHeight:1.04, letterSpacing:'-2px', color:'var(--ink)' }}>
          Where <span style={{ color:'var(--teal)' }}>Educators</span>,<br />
          <span style={{ display:'inline-block', position:'relative' }}>
            Innovators
            <span style={{ position:'absolute', bottom:2, left:0, right:0, height:4, background:'var(--gold2)', borderRadius:2, opacity:.5 }} />
          </span>{' '}&amp;<br />
          <span style={{ color:'var(--coral)' }}>EdTech</span> Converge
        </motion.h1>

        <motion.p {...fade(.25)} style={{ fontSize:'17px', color:'var(--muted)', lineHeight:1.8, maxWidth:'480px', margin:'24px 0 40px', fontWeight:300 }}>
          Thynk Pulse is the free, open community for education professionals to share experiences, insights, and ideas that shape the future of learning — from classrooms to boardrooms.
        </motion.p>

        <motion.div {...fade(.38)} style={{ display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center' }}>
          <Link href={isAuthenticated ? '/write' : '/register'} className="btn-teal" style={{ fontSize:'15px', padding:'14px 32px' }}>
            🚀 {isAuthenticated ? 'Write a Post' : 'Join Free Today'}
          </Link>
          <Link href="/#posts" className="btn-outline" style={{ fontSize:'15px', padding:'14px 28px' }}>
            Browse Articles →
          </Link>
        </motion.div>

        <motion.div {...fade(.5)} style={{ display:'flex', alignItems:'center', gap:'12px', marginTop:'32px' }}>
          <div style={{ display:'flex' }}>
            {[
              { initials:'R', gradient:'linear-gradient(135deg,var(--teal),var(--teal3))' },
              { initials:'P', gradient:'linear-gradient(135deg,var(--coral),#E87A4A)' },
              { initials:'A', gradient:'linear-gradient(135deg,var(--gold),var(--gold2))' },
              { initials:'S', gradient:'linear-gradient(135deg,var(--plum),#6B3A9E)' },
              { initials:'+8K', gradient:'var(--ink)', fontSize:'10px' },
            ].map((av, i) => (
              <div key={i} style={{ width:32, height:32, borderRadius:'50%', border:'2px solid var(--cream)', marginLeft: i===0 ? 0 : '-10px', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-serif)', fontWeight:700, fontSize: av.fontSize || '14px', color:'#fff', background: av.gradient }}>
                {av.initials}
              </div>
            ))}
          </div>
          <p style={{ fontSize:'13px', color:'var(--muted)' }}>
            Join <strong style={{ color:'var(--ink)', fontWeight:600 }}>10,000+ professionals</strong> already on Thynk Pulse
          </p>
        </motion.div>
      </div>

      {/* RIGHT — floating card */}
      <motion.div {...fade(.2)} style={{ position:'relative', zIndex:2 }}>

        {/* Float top-right */}
        <div style={{ position:'absolute', top:'-20px', right:'-24px', background:'#fff', border:'1px solid var(--border)', borderRadius:'16px', padding:'14px 18px', boxShadow:'var(--shadow)', animation:'floatY 4s ease-in-out infinite', zIndex:2 }}>
          <div style={{ fontSize:'11px', color:'var(--muted)' }}>This week</div>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'26px', fontWeight:900, color:'var(--ink)', lineHeight:1 }}>2.4K</div>
          <div style={{ fontSize:'11px', color:'var(--teal3)', marginTop:'2px' }}>↑ New readers</div>
        </div>

        {/* Main card */}
        <div className="card" style={{ padding:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
            <span className="badge badge-coral" style={{ fontSize:'11px', fontWeight:700, letterSpacing:'1px' }}>✦ Featured</span>
            <span style={{ fontSize:'12px', color:'var(--muted)' }}>4 min read · Today</span>
          </div>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'22px', fontWeight:600, color:'var(--ink)', lineHeight:1.35, marginBottom:'14px' }}>
            How AI is Quietly Rewriting Classroom Engagement Across India
          </div>
          <div style={{ fontSize:'13px', color:'var(--muted)', lineHeight:1.7, marginBottom:'20px' }}>
            A deep-dive into adaptive learning, AI feedback loops, and what&apos;s actually working in schools from Tier-1 to Tier-3 cities.
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', paddingTop:'16px', borderTop:'1px solid var(--border2)' }}>
            <div className="avatar av-teal" style={{ width:40, height:40, fontSize:'16px' }}>RK</div>
            <div>
              <div style={{ fontSize:'14px', fontWeight:600, color:'var(--ink)' }}>Rajesh Kumar</div>
              <div style={{ fontSize:'12px', color:'var(--muted)' }}>EdTech Founder · Bangalore</div>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', gap:'12px', fontSize:'12px', color:'var(--muted)' }}>
              <span>❤️ 284</span><span>👁 12K</span>
            </div>
          </div>
        </div>

        {/* Mini cards */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'16px' }}>
          {[
            { icon:'🎓', label:'Educators',  val:'3,200+' },
            { icon:'🏢', label:'EdTech Co.', val:'180+'   },
          ].map(mc => (
            <div key={mc.label} style={{ background:'var(--cream2)', border:'1px solid var(--border2)', borderRadius:'14px', padding:'14px 16px' }}>
              <div style={{ fontSize:'22px', marginBottom:'8px' }}>{mc.icon}</div>
              <div style={{ fontSize:'11px', color:'var(--muted)', fontWeight:500 }}>{mc.label}</div>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:'16px', fontWeight:700, color:'var(--ink)' }}>{mc.val}</div>
            </div>
          ))}
        </div>

        {/* Float bottom-left */}
        <div style={{ position:'absolute', bottom:'-24px', left:'-28px', background:'var(--teal)', borderRadius:'16px', padding:'14px 20px', boxShadow:'0 8px 32px rgba(10,95,85,.3)', animation:'floatY 4s 1.5s ease-in-out infinite', zIndex:2 }}>
          <div style={{ fontSize:'11px', color:'rgba(255,255,255,.6)' }}>Free forever</div>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'22px', fontWeight:900, color:'#fff', lineHeight:1 }}>100%</div>
          <div style={{ fontSize:'11px', color:'rgba(255,255,255,.7)', marginTop:'2px' }}>No paywall · No ads</div>
        </div>
      </motion.div>
    </section>
  )
}
