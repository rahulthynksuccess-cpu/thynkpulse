'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, PenSquare, User, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'

export default function ProfileSetupPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  const name = user?.profile?.fullName?.split(' ')[0] || 'there'

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>
      <div style={{ position:'fixed', inset:0, backgroundImage:'radial-gradient(circle, var(--teal) 1px, transparent 1px)', backgroundSize:'28px 28px', opacity:.04, pointerEvents:'none' }} />

      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6 }}
        style={{ width:'100%', maxWidth:'520px', textAlign:'center', position:'relative', zIndex:1 }}>

        {/* Success icon */}
        <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(10,95,85,.1)', border:'3px solid rgba(10,95,85,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
          <CheckCircle style={{ width:40, height:40, color:'var(--teal)' }} />
        </div>

        <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'40px', fontWeight:900, color:'var(--ink)', letterSpacing:'-1px', marginBottom:'12px' }}>
          Welcome, {name}! 🎉
        </h1>
        <p style={{ fontSize:'16px', color:'var(--muted)', lineHeight:1.7, maxWidth:'400px', margin:'0 auto 40px', fontWeight:300 }}>
          Your account is live on Thynk Pulse. You&apos;re now part of India&apos;s fastest-growing education community.
        </p>

        {/* Next steps */}
        <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'20px', padding:'28px', marginBottom:'24px', textAlign:'left' }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--muted)', marginBottom:'18px' }}>What to do next</div>
          {[
            { icon:'✍️', title:'Write your first post', desc:'Share your experience, an insight or a story with 10,000+ education professionals.', href:'/write', cta:'Write Now', primary:true },
            { icon:'👤', title:'Complete your profile',  desc:'Add your photo, LinkedIn, and bio so the community can discover you.', href:`/profile/${user?.id}`, cta:'Edit Profile', primary:false },
            { icon:'🔍', title:'Explore the community',  desc:'Browse trending posts, follow top writers and find your people.', href:'/', cta:'Explore', primary:false },
          ].map(step => (
            <div key={step.title} style={{ display:'flex', alignItems:'flex-start', gap:'14px', padding:'14px 0', borderBottom:'1px solid var(--border2)' }}>
              <div style={{ width:40, height:40, borderRadius:'10px', background:'rgba(10,95,85,.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>{step.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'14px', fontWeight:600, color:'var(--ink)', marginBottom:'3px' }}>{step.title}</div>
                <div style={{ fontSize:'12px', color:'var(--muted)', lineHeight:1.6, fontWeight:300 }}>{step.desc}</div>
              </div>
              <Link href={step.href}
                style={{ flexShrink:0, padding:'8px 16px', borderRadius:'9px', fontSize:'12px', fontWeight:600, fontFamily:'var(--font-sans)', textDecoration:'none', transition:'all .2s', background: step.primary ? 'var(--teal)' : 'transparent', color: step.primary ? '#fff' : 'var(--teal)', border: step.primary ? 'none' : '1.5px solid rgba(10,95,85,.25)' }}>
                {step.cta}
              </Link>
            </div>
          ))}
        </div>

        <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'14px', color:'var(--muted)', textDecoration:'none', fontFamily:'var(--font-sans)' }}>
          Go to homepage <ArrowRight style={{ width:14, height:14 }} />
        </Link>
      </motion.div>
    </div>
  )
}
