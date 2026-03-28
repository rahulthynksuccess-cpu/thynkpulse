'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { useContent } from '@/hooks/useContent'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .7, delay, ease: [.22, 1, .36, 1] },
})

export function HeroSection() {
  const { isAuthenticated } = useAuthStore()
  const c = useContent('content.hero')

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-card { display: none !important; }
          .hero-h1 { font-size: clamp(44px, 12vw, 72px) !important; letter-spacing: -2px !important; }
          .hero-section { min-height: auto !important; padding-top: 100px !important; padding-bottom: 60px !important; }
          .hero-btns { flex-wrap: wrap !important; }
          .hero-btns a { width: 100% !important; justify-content: center !important; text-align: center !important; }
        }
      `}</style>
      <section className="hero-section" style={{ background:'var(--cream)', minHeight:'95vh', display:'flex', alignItems:'center', paddingTop:'88px', paddingBottom:'60px', overflow:'hidden', position:'relative' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, var(--teal) 1px, transparent 1px)', backgroundSize:'30px 30px', opacity:.035, pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'-200px', right:'-100px', width:'700px', height:'700px', background:'radial-gradient(ellipse, rgba(10,95,85,.04) 0%, transparent 60%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:'1160px', margin:'0 auto', padding:'0 5%', width:'100%' }}>
          <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 440px', gap:'80px', alignItems:'center' }}>

            {/* Left — text */}
            <div>
              <motion.div {...fade(0.1)}>
                <div className="eyebrow" style={{ marginBottom:'24px' }}>
                  <div className="eyebrow-line" />
                  <span className="eyebrow-text">{c.eyebrow}</span>
                </div>
              </motion.div>

              <motion.h1 className="hero-h1" {...fade(0.18)} style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'clamp(52px,6vw,84px)', lineHeight:.97, letterSpacing:'-3px', color:'var(--ink)', marginBottom:'22px' }}>
                {c.h1Line1}
                <br />
                <em style={{ fontStyle:'italic', color:'var(--gold)' }}>{c.h1Line2}</em>
              </motion.h1>

              <motion.p {...fade(0.26)} style={{ fontFamily:'var(--font-sans)', fontSize:'clamp(15px,1.4vw,17px)', fontWeight:300, color:'var(--muted)', lineHeight:1.75, maxWidth:'500px', marginBottom:'36px' }}>
                {c.subtitle}
              </motion.p>

              <motion.div {...fade(0.32)} className="hero-btns" style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'28px' }}>
                <Link href={isAuthenticated ? '/write' : '/register'} className="btn-teal" style={{ padding:'13px 28px', fontSize:'15px', gap:'8px', display:'inline-flex', alignItems:'center' }}>
                  🚀 {isAuthenticated ? 'Write a Post' : (c.ctaPrimary || 'Join Free Today')}
                </Link>
                <Link href="/#posts" className="btn-outline" style={{ padding:'12px 24px', fontSize:'15px', display:'inline-flex', alignItems:'center' }}>
                  {c.ctaSecondary || 'Explore Posts'}
                </Link>
              </motion.div>

              <motion.div {...fade(0.38)} style={{ display:'flex', alignItems:'center', gap:'10px', fontSize:'13px', color:'var(--muted)', fontFamily:'var(--font-sans)', flexWrap:'wrap' }}>
                <div style={{ display:'flex' }}>
                  {['🧑‍🏫','👩‍💼','🧑‍💻','👨‍🔬','👩‍🏫'].map((e,i) => (
                    <div key={i} style={{ width:28, height:28, borderRadius:'50%', background:`hsl(${i*40+160},40%,85%)`, border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', marginLeft:i?'-8px':0 }}>{e}</div>
                  ))}
                </div>
                <span>{c.socialProof}</span>
              </motion.div>
            </div>

            {/* Right — featured post card */}
            <motion.div className="hero-card" {...fade(0.3)} style={{ background:'#fff', borderRadius:'var(--radius-xl,24px)', border:'1px solid var(--border)', overflow:'hidden', boxShadow:'0 24px 80px rgba(26,18,8,.1)', flexShrink:0 }}>
              <div style={{ background:'linear-gradient(135deg,var(--teal),var(--teal3))', padding:'36px 28px 28px', position:'relative' }}>
                <div style={{ position:'absolute', top:0, right:0, width:'200px', height:'200px', background:'radial-gradient(ellipse,rgba(255,255,255,.08),transparent 70%)' }} />
                <div style={{ fontSize:'48px', marginBottom:'14px' }}>🤖</div>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:700, color:'#fff', lineHeight:1.35, marginBottom:'10px' }}>How AI is Quietly Rewriting Classroom Engagement</div>
                <div style={{ fontSize:'12px', color:'rgba(255,255,255,.65)' }}>EdTech · 8 min read</div>
              </div>
              <div style={{ padding:'20px 28px' }}>
                <p style={{ fontSize:'13px', color:'var(--muted)', lineHeight:1.7, fontWeight:300, marginBottom:'16px' }}>
                  From adaptive learning paths to AI-powered feedback loops — what's actually working in Indian schools.
                </p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <div style={{ width:32, height:32, borderRadius:'8px', background:'linear-gradient(135deg,#EAF4F0,#C0E6DC)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'13px', color:'var(--teal)' }}>R</div>
                    <div>
                      <div style={{ fontSize:'12px', fontWeight:600, color:'var(--ink)' }}>Rajesh Kumar</div>
                      <div style={{ fontSize:'10px', color:'var(--muted)' }}>EdTech Founder</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:'12px', fontSize:'11px', color:'var(--muted)' }}>
                    <span>👁 12K</span><span>❤️ 284</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  )
}
