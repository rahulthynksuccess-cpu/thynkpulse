'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { useContent } from '@/hooks/useContent'

export function HeroSection() {
  const { isAuthenticated } = useAuthStore()
  const raw = useContent('content.hero')
  const c = {
    eyebrow:     raw?.eyebrow     || "India's Education Community Platform",
    h1Line1:     raw?.h1Line1     || 'Where Ideas',
    h1Line2:     raw?.h1Line2     || 'Shape Education',
    subtitle:    raw?.subtitle    || 'Thynk Pulse is the free, open community for educators, EdTech professionals, innovators and school leaders.',
    ctaPrimary:  raw?.ctaPrimary  || 'Start Writing Free',
    ctaSecondary:raw?.ctaSecondary|| 'Explore Posts',
    socialProof: raw?.socialProof || 'Join 10,000+ professionals already on Thynk Pulse',
  }

  return (
    <>
      <style>{`
        .hero-section {
          background: var(--hero-bg, var(--cream));
          min-height: 92vh;
          display: flex;
          align-items: center;
          padding-top: 88px;
          padding-bottom: 60px;
          position: relative;
          overflow: hidden;
        }
        .hero-inner {
          max-width: 100%;
          margin: 0 auto;
          padding: 0 4%;
          width: 100%;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5%;
          align-items: center;
        }
        /* .hero-h1 styles applied via inline style on the element */
        .hero-sub {
          font-family: var(--hero-sub-font, var(--font-sans));
          font-size: var(--hero-sub-size, 17px);
          font-weight: var(--hero-sub-weight, 300);
          color: var(--hero-sub-color, var(--muted));
          line-height: 1.75;
          max-width: 540px;
          margin-bottom: 40px;
        }
        .hero-card { display: block; }

        /* Tablet */
        @media (max-width: 1024px) {
          .hero-grid { gap: 4%; grid-template-columns: 1fr 1fr; }
        }
        /* Small tablet */
        @media (max-width: 768px) {
          .hero-section { min-height: auto; padding-top: 88px; padding-bottom: 48px; }
          .hero-grid { grid-template-columns: 1fr; gap: 32px; }
          .hero-card { display: block; width: 100%; max-width: 480px; margin: 0 auto; }
          .hero-sub { font-size: 16px; max-width: 100%; }
          .hero-btns { flex-direction: row; flex-wrap: wrap; }
        }
        /* Mobile */
        @media (max-width: 480px) {
          .hero-inner { padding: 0 5%; }
          .hero-card { max-width: 100%; }
          .hero-btns { flex-direction: column; }
          .hero-btns a { width: 100%; text-align: center; justify-content: center; box-sizing: border-box; }
        }
      `}</style>

      <section className="hero-section">
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,var(--teal) 1px,transparent 1px)', backgroundSize:'30px 30px', opacity:.03, pointerEvents:'none' }} />

        <div className="hero-inner">
          <div className="hero-grid">

            {/* Text */}
            <div>
              <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.1}}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'28px' }}>
                  <div style={{ width:'32px', height:'2px', background:'var(--coral)' }} />
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', color:'var(--coral)' }}>{c.eyebrow}</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.18}}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 900,
                  fontSize: 'var(--hero-h1-size, 84px)',
                  lineHeight: 1.0,
                  letterSpacing: '-3px',
                  color: 'var(--hero-h1-color, var(--ink))',
                  marginBottom: '24px',
                }}>
                {c.h1Line1}<br />
                <em style={{ fontStyle:'italic', color:'var(--gold)' }}>{c.h1Line2}</em>
              </motion.h1>

              <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.26}} style={{ fontFamily:'var(--hero-sub-font,var(--font-sans))', fontSize:'var(--hero-sub-size,17px)', fontWeight:'var(--hero-sub-weight,300)' as any, color:'var(--hero-sub-color,var(--muted))', lineHeight:1.75, maxWidth:'540px', marginBottom:'40px' }}>
                {c.subtitle}
              </motion.p>

              <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.32}}
                className="hero-btns" style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'32px' }}>
                <Link href={isAuthenticated ? '/write' : '/register'} className="btn-teal" style={{ padding:'14px 32px', fontSize:'16px', fontWeight:600 }}>
                  🚀 {isAuthenticated ? 'Write a Post' : (c.ctaPrimary || 'Join Free Today')}
                </Link>
                <Link href="/#posts" className="btn-outline" style={{ padding:'13px 28px', fontSize:'15px' }}>
                  {c.ctaSecondary || 'Explore Posts'}
                </Link>
              </motion.div>

              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.4}}
                style={{ display:'flex', alignItems:'center', gap:'12px', fontSize:'13px', color:'var(--muted)', fontFamily:'var(--font-sans)', flexWrap:'wrap' }}>
                <div style={{ display:'flex' }}>
                  {['🧑‍🏫','👩‍💼','🧑‍💻','👨‍🔬','👩‍🏫'].map((e,i) => (
                    <div key={i} style={{ width:30, height:30, borderRadius:'50%', background:`hsl(${i*40+160},40%,85%)`, border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px', marginLeft:i?'-9px':0 }}>{e}</div>
                  ))}
                </div>
                <span>{c.socialProof}</span>
              </motion.div>
            </div>

            {/* Card */}
            <motion.div className="hero-card" initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{duration:.8,delay:.3}}
              style={{ background:'#fff', borderRadius:'24px', border:'1px solid var(--border)', overflow:'hidden', boxShadow:'0 24px 80px rgba(26,18,8,.12)', width:'100%' }}>
              <div style={{ background:'linear-gradient(135deg,var(--teal),var(--teal3))', padding:'32px 28px', position:'relative' }}>
                <div style={{ position:'absolute', top:0, right:0, width:'180px', height:'180px', background:'radial-gradient(ellipse,rgba(255,255,255,.1),transparent 70%)' }} />
                <div style={{ fontSize:'44px', marginBottom:'14px' }}>🤖</div>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:700, color:'#fff', lineHeight:1.3, marginBottom:'8px' }}>{c.cardTitle || 'How AI is Quietly Rewriting Classroom Engagement'}</div>
                <div style={{ fontSize:'12px', color:'rgba(255,255,255,.65)' }}>{c.cardCategory || 'EdTech'} · {c.cardReadTime || '8 min read'}</div>
              </div>
              <div style={{ padding:'20px 24px' }}>
                <p style={{ fontSize:'13px', color:'var(--muted)', lineHeight:1.7, fontWeight:300, marginBottom:'16px' }}>From adaptive learning paths to AI-powered feedback loops — what's actually working in Indian classrooms.</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <div style={{ width:32, height:32, borderRadius:'8px', background:'linear-gradient(135deg,#EAF4F0,#C0E6DC)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'13px', color:'var(--teal)' }}>R</div>
                    <div><div style={{ fontSize:'12px', fontWeight:600, color:'var(--ink)' }}>{c.cardAuthor || 'Rajesh Kumar'}</div><div style={{ fontSize:'10px', color:'var(--muted)' }}>{c.cardAuthorRole || 'EdTech Founder'}</div></div>
                  </div>
                  <div style={{ display:'flex', gap:'10px', fontSize:'11px', color:'var(--muted)' }}><span>👁 12K</span><span>❤️ 284</span></div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  )
}
