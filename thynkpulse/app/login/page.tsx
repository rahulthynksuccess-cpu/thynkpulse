'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { apiPost } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const mutation = useMutation({
    mutationFn: () => apiPost('/auth/login', form),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      toast.success(`Welcome back, ${data.user.profile?.fullName || 'there'}!`)
      router.push(data.user.role === 'admin' ? '/admin' : '/')
    },
    onError: (err: any) => toast.error(err.message || 'Invalid credentials'),
  })

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>
      {/* Bg dots */}
      <div style={{ position:'fixed', inset:0, backgroundImage:'radial-gradient(circle, var(--teal) 1px, transparent 1px)', backgroundSize:'28px 28px', opacity:.04, pointerEvents:'none' }} />

      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}
        style={{ width:'100%', maxWidth:'440px', position:'relative', zIndex:1 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'36px' }}>
          <Link href="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:42, height:42, borderRadius:'12px', background:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'19px', color:'#fff' }}>TP</span>
            </div>
            <span style={{ fontFamily:'var(--font-serif)', fontSize:'23px', fontWeight:900, color:'var(--ink)' }}>
              Thynk <em style={{ fontStyle:'normal', color:'var(--teal)' }}>Pulse</em>
            </span>
          </Link>
        </div>

        <div className="card" style={{ padding:'36px' }}>
          <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'30px', fontWeight:900, color:'var(--ink)', marginBottom:'6px', letterSpacing:'-0.5px' }}>Welcome back</h1>
          <p style={{ fontSize:'14px', color:'var(--muted)', marginBottom:'28px', fontWeight:300 }}>Sign in to your Thynk Pulse account</p>

          <form onSubmit={e => { e.preventDefault(); mutation.mutate() }} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label className="label">Email or Phone</label>
              <input className="input" type="text" placeholder="you@example.com or 9800000000"
                value={form.identifier} onChange={e => set('identifier', e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div style={{ position:'relative' }}>
                <input className="input" type={showPw ? 'text' : 'password'} placeholder="Your password"
                  value={form.password} onChange={e => set('password', e.target.value)} required
                  style={{ paddingRight:'42px' }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--muted)', display:'flex' }}>
                  {showPw ? <EyeOff style={{ width:16, height:16 }} /> : <Eye style={{ width:16, height:16 }} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-teal" disabled={mutation.isPending}
              style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:'15px', opacity: mutation.isPending ? .7 : 1 }}>
              {mutation.isPending ? <><Loader2 style={{ width:16, height:16, animation:'spin 1s linear infinite' }} /> Signing in…</> : 'Sign In →'}
            </button>
          </form>

          <div style={{ textAlign:'center', marginTop:'20px', fontSize:'13px', color:'var(--muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color:'var(--teal)', fontWeight:600, textDecoration:'none' }}>Join free today</Link>
          </div>
        </div>

        <p style={{ textAlign:'center', fontSize:'12px', color:'var(--muted)', marginTop:'20px' }}>
          A free platform by <a href="https://thynksuccess.com" style={{ color:'var(--teal)', textDecoration:'none' }}>Thynk Success</a>
        </p>
      </motion.div>
    </div>
  )
}
