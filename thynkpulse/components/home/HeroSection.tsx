'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { useContent } from '@/hooks/useContent'

export function HeroSection() {
  const { isAuthenticated } = useAuthStore()
  const c = useContent('content.hero')

  // Apply content-driven CSS vars so font size/colour/family override theme defaults
  const heroVars: React.CSSProperties = {
    ['--hero-h1-size' as any]:    c?.h1FontSize   ? `${c.h1FontSize}px`    : undefined,
    ['--hero-h1-color' as any]:   c?.h1Color      ? c.h1Color              : undefined,
    ['--hero-sub-size' as any]:   c?.subFontSize  ? `${c.subFontSize}px`   : undefined,
    ['--hero-sub-color' as any]:  c?.subColor     ? c.subColor             : undefined,
    ['--hero-bg' as any]:         c?.heroBg       ? c.heroBg               : undefined,
    ['--hero-h1-font' as any]:    c?.h1FontFamily ? `'${c.h1FontFamily}', Georgia, serif` : undefined,
    ['--hero-sub-font' as any]:   c?.subFontFamily? `'${c.subFontFamily}', system-ui, sans-serif` : undefined,
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
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 5%;
          width: 100%;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 80px;
          align-items: center;
        }
        .hero-h1 {
          font-family: var(--hero-h1-font, var(--font-serif));
          font-weight: 900;
          font-size: var(--hero-h1-size, 84px);
          line-height: 0.95;
          letter-spacing: -4px;
          color: var(--hero-h1-color, var(--ink));
          margin-bottom: 24px;
        }
        .hero-sub {
          font-family: var(--hero-sub-font, var(--font-sans));
          font-size: var(--hero-sub-size, 17px);
          font-weight: var(--hero-sub-weight, 300);
          color: var(--hero-sub-color, var(--muted));
          line-height: 1.75;
          max-width: 480px;
          margin-bottom: 40px;
        }
        .hero-card { display: block; }

        /* Tablet — scale H1 relative to the theme value but never override with !important */
        @media (max-width: 1024px) {
          .hero-h1 { font-size: clamp(52px, calc(var(--hero-h1-size, 84px) * 0.82), var(--hero-h1-size, 84px)); letter-spacing: -3px; }
          .hero-grid { gap: 48px; grid-template-columns: 1fr 360px; }
        }
        /* Mobile */
        @media (max-width: 768px) {
          .hero-section { min-height: auto; padding-top: 96px; padding-bottom: 56px; }
          .hero-grid { grid-template-columns: 1fr; gap: 0; }
          .hero-card { display: none; }
          .hero-h1 { font-size: clamp(36px, calc(var(--hero-h1-size, 84px) * 0.62), var(--hero-h1-size, 84px)); letter-spacing: -2px; line-height: 1.0; }
          .hero-sub { font-size: 15px; max-width: 100%; }
          .hero-btns { flex-direction: column; }
          .hero-btns a { width: 100%; text-align: center; justify-content: center; box-sizing: border-box; }
        }
        @media (max-width: 480px) {
          .hero-h1 { font-size: clamp(30px, calc(var(--hero-h1-size, 84px) * 0.52), var(--hero-h1-size, 84px)); letter-spacing: -1.5px; }
          .hero-inner { padding: 0 20px; }
        }
      `}</style>

      <section className="hero-section" style={heroVars}>
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

              <motion.h1 className="hero-h1" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.18}}>
                {c.h1Line1}<br />
                <em style={{ fontStyle:'italic', color:'var(--gold)' }}>{c.h1Line2}</em>
              </motion.h1>

              <motion.p className="hero-sub" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.26}}>
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
              style={{ background:'#fff', borderRadius:'24px', border:'1px solid var(--border)', overflow:'hidden', boxShadow:'0 24px 80px rgba(26,18,8,.12)' }}>
              <div style={{ background:'linear-gradient(135deg,var(--teal),var(--teal3))', padding:'32px 28px', position:'relative' }}>
                <div style={{ position:'absolute', top:0, right:0, width:'180px', height:'180px', background:'radial-gradient(ellipse,rgba(255,255,255,.1),transparent 70%)' }} />
                <div style={{ fontSize:'44px', marginBottom:'14px' }}>🤖</div>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:700, color:'#fff', lineHeight:1.3, marginBottom:'8px' }}>How AI is Quietly Rewriting Classroom Engagement</div>
                <div style={{ fontSize:'12px', color:'rgba(255,255,255,.65)' }}>EdTech · 8 min read</div>
              </div>
              <div style={{ padding:'20px 24px' }}>
                <p style={{ fontSize:'13px', color:'var(--muted)', lineHeight:1.7, fontWeight:300, marginBottom:'16px' }}>From adaptive learning paths to AI-powered feedback loops — what's actually working in Indian classrooms.</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <div style={{ width:32, height:32, borderRadius:'8px', background:'linear-gradient(135deg,#EAF4F0,#C0E6DC)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'13px', color:'var(--teal)' }}>R</div>
                    <div><div style={{ fontSize:'12px', fontWeight:600, color:'var(--ink)' }}>Rajesh Kumar</div><div style={{ fontSize:'10px', color:'var(--muted)' }}>EdTech Founder</div></div>
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
