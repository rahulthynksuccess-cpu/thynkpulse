'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, CheckCircle, Linkedin } from 'lucide-react'
import { apiPost } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { PhotoUpload } from '@/components/ui/PhotoUpload'
import toast from 'react-hot-toast'

type UserType = 'educator' | 'edtech_pro' | 'other'

const TYPE_OPTIONS: { value: UserType; label: string; emoji: string; desc: string }[] = [
  { value:'educator',   label:'Educator / Teacher',        emoji:'🏫', desc:'School teachers, principals, academic professionals' },
  { value:'edtech_pro', label:'EdTech Professional',       emoji:'💡', desc:'EdTech companies, product teams, sales & marketing' },
  { value:'other',      label:'Other / General',           emoji:'🌍', desc:'Researchers, parents, policy makers, general members' },
]

const lbl = { display:'block', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase' as const, color:'var(--muted)', marginBottom:'7px' }
const inp = { fontFamily:'var(--font-sans)', width:'100%', padding:'11px 14px', border:'1.5px solid var(--parchment)', borderRadius:'var(--radius)', fontSize:'14px', color:'var(--ink)', outline:'none', background:'#fff', transition:'border-color .2s' }

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<UserType>('educator')
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({
    email: '', phone: '', password: '',
    fullName:'', gender:'', designation:'', instituteName:'', companyName:'',
    contactNumber:'', emailId:'', totalExp:'', introduction:'',
    linkedinUrl:'', avatarUrl:'',
  })
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const mutation = useMutation({
    mutationFn: () => apiPost('/auth/register', { ...form, role: userType }),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      toast.success('Welcome to Thynk Pulse! 🎉')
      router.push('/profile/setup')
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Registration failed'),
  })

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', padding:'60px 20px' }}>
      <div style={{ position:'fixed', inset:0, backgroundImage:'radial-gradient(circle, var(--teal) 1px, transparent 1px)', backgroundSize:'28px 28px', opacity:.04, pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:'560px', margin:'0 auto', position:'relative', zIndex:1 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <Link href="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:40, height:40, borderRadius:'11px', background:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'18px', color:'#fff' }}>TP</span>
            </div>
            <span style={{ fontFamily:'var(--font-serif)', fontSize:'22px', fontWeight:900, color:'var(--ink)' }}>
              Thynk <em style={{ fontStyle:'normal', color:'var(--teal)' }}>Pulse</em>
            </span>
          </Link>
        </div>

        {/* Steps indicator */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'28px', justifyContent:'center' }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:700, transition:'all .3s',
                background: step >= s ? 'var(--teal)' : 'var(--parchment)',
                color: step >= s ? '#fff' : 'var(--muted)' }}>
                {step > s ? <CheckCircle style={{ width:14, height:14 }} /> : s}
              </div>
              {s < 3 && <div style={{ width:40, height:2, background: step > s ? 'var(--teal)' : 'var(--parchment)', borderRadius:1, transition:'background .3s' }} />}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding:'36px' }}>

          {/* ── STEP 1: Account type ── */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
                <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'28px', fontWeight:900, color:'var(--ink)', marginBottom:'6px' }}>Who are you?</h1>
                <p style={{ fontSize:'14px', color:'var(--muted)', marginBottom:'24px', fontWeight:300 }}>Choose the category that best describes you</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'24px' }}>
                  {TYPE_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setUserType(opt.value)}
                      style={{ display:'flex', alignItems:'center', gap:'14px', padding:'16px 18px', borderRadius:'var(--radius)', border: userType===opt.value ? '2px solid var(--teal)' : '1.5px solid var(--parchment)', background: userType===opt.value ? 'rgba(10,95,85,.04)' : '#fff', cursor:'pointer', textAlign:'left', transition:'all .2s' }}>
                      <span style={{ fontSize:'28px' }}>{opt.emoji}</span>
                      <div>
                        <div style={{ fontSize:'15px', fontWeight:600, color:'var(--ink)', fontFamily:'var(--font-sans)' }}>{opt.label}</div>
                        <div style={{ fontSize:'12px', color:'var(--muted)', marginTop:'2px' }}>{opt.desc}</div>
                      </div>
                      {userType===opt.value && <CheckCircle style={{ width:18, height:18, color:'var(--teal)', marginLeft:'auto', flexShrink:0 }} />}
                    </button>
                  ))}
                </div>
                <button className="btn-teal" onClick={() => setStep(2)} style={{ width:'100%', justifyContent:'center', padding:'13px' }}>
                  Continue →
                </button>
              </motion.div>
            )}

            {/* ── STEP 2: Account credentials ── */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
                <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'28px', fontWeight:900, color:'var(--ink)', marginBottom:'6px' }}>Create your account</h1>
                <p style={{ fontSize:'14px', color:'var(--muted)', marginBottom:'24px', fontWeight:300 }}>Your login credentials</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'24px' }}>
                  <div>
                    <label style={lbl}>Email Address *</label>
                    <input style={inp} type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                  </div>
                  <div>
                    <label style={lbl}>Mobile Number</label>
                    <input style={inp} type="tel" placeholder="+91 98000 00000" value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                  <div>
                    <label style={lbl}>Password *</label>
                    <div style={{ position:'relative' }}>
                      <input style={{ ...inp, paddingRight:'42px' }} type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" value={form.password} onChange={e => set('password', e.target.value)} required minLength={8} />
                      <button type="button" onClick={() => setShowPw(!showPw)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--muted)', display:'flex' }}>
                        {showPw ? <EyeOff style={{ width:16, height:16 }} /> : <Eye style={{ width:16, height:16 }} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:'10px' }}>
                  <button className="btn-outline" onClick={() => setStep(1)} style={{ flex:1, justifyContent:'center' }}>← Back</button>
                  <button className="btn-teal" onClick={() => { if (!form.email || !form.password) { toast.error('Email and password required'); return } setStep(3) }} style={{ flex:2, justifyContent:'center', padding:'13px' }}>Continue →</button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Profile info ── */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
                <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'28px', fontWeight:900, color:'var(--ink)', marginBottom:'6px' }}>Your profile</h1>
                <p style={{ fontSize:'14px', color:'var(--muted)', marginBottom:'24px', fontWeight:300 }}>Tell the community about yourself</p>

                <form onSubmit={e => { e.preventDefault(); mutation.mutate() }} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

                  {/* Photo upload */}
                  <div style={{ display:'flex', alignItems:'center', gap:'20px', padding:'16px', background:'var(--cream2)', borderRadius:'var(--radius)', border:'1px solid var(--border)' }}>
                    <PhotoUpload
                      currentUrl={form.avatarUrl}
                      name={form.fullName || 'U'}
                      size={72}
                      onUpload={url => set('avatarUrl', url)}
                    />
                    <div>
                      <div style={{ fontSize:'14px', fontWeight:600, color:'var(--ink)', marginBottom:'3px', fontFamily:'var(--font-sans)' }}>Professional Photograph</div>
                      <div style={{ fontSize:'12px', color:'var(--muted)', lineHeight:1.6, fontWeight:300 }}>
                        Upload a clear, professional headshot.<br />JPEG / PNG / WebP · Max 5 MB
                      </div>
                    </div>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                    <div>
                      <label style={lbl}>Full Name *</label>
                      <input style={inp} placeholder="Your full name" value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
                    </div>
                    <div>
                      <label style={lbl}>Gender *</label>
                      <select style={{ ...inp, cursor:'pointer' }} value={form.gender} onChange={e => set('gender', e.target.value)} required>
                        <option value="">Select</option>
                        <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={lbl}>Designation *</label>
                    <input style={inp} placeholder={userType==='educator' ? 'e.g. Senior Teacher, Principal' : userType==='edtech_pro' ? 'e.g. Product Manager, Sales Lead' : 'e.g. Researcher, Policy Analyst'} value={form.designation} onChange={e => set('designation', e.target.value)} required />
                  </div>

                  {userType === 'educator' && (
                    <div>
                      <label style={lbl}>Institute Name *</label>
                      <input style={inp} placeholder="Your school / college / university" value={form.instituteName} onChange={e => set('instituteName', e.target.value)} required />
                    </div>
                  )}
                  {userType === 'edtech_pro' && (
                    <div>
                      <label style={lbl}>Company Name *</label>
                      <input style={inp} placeholder="Your EdTech company" value={form.companyName} onChange={e => set('companyName', e.target.value)} required />
                    </div>
                  )}
                  {userType === 'other' && (
                    <div>
                      <label style={lbl}>Organisation / Institute</label>
                      <input style={inp} placeholder="Company or institution (optional)" value={form.companyName} onChange={e => set('companyName', e.target.value)} />
                    </div>
                  )}

                  {userType !== 'other' && (
                    <>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                        <div>
                          <label style={lbl}>Contact Number *</label>
                          <input style={inp} type="tel" placeholder="+91 98000 00000" value={form.contactNumber} onChange={e => set('contactNumber', e.target.value)} required />
                        </div>
                        <div>
                          <label style={lbl}>Total Experience *</label>
                          <select style={{ ...inp, cursor:'pointer' }} value={form.totalExp} onChange={e => set('totalExp', e.target.value)} required>
                            <option value="">Select</option>
                            {['0-1 years','1-3 years','3-5 years','5-10 years','10-15 years','15-20 years','20+ years'].map(o => <option key={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label style={lbl}>Brief Introduction * <span style={{ color:'var(--muted)', fontWeight:400, textTransform:'none', letterSpacing:0 }}>(max 3000 characters)</span></label>
                        <textarea style={{ ...inp, resize:'vertical', minHeight:'100px', lineHeight:1.6 }}
                          placeholder="Tell the community who you are, what you do, and what you write about..."
                          value={form.introduction} onChange={e => set('introduction', e.target.value.slice(0,3000))}
                          required maxLength={3000} />
                        <div style={{ fontSize:'11px', color:'var(--muted)', textAlign:'right', marginTop:'3px' }}>{form.introduction.length}/3000</div>
                      </div>
                      <div>
                        <label style={lbl}>LinkedIn Profile URL</label>
                        <div style={{ position:'relative' }}>
                          <div style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', display:'flex' }}>
                            <Linkedin style={{ width:15, height:15, color:'#0A66C2' }} />
                          </div>
                          <input style={{ ...inp, paddingLeft:'36px' }} type="url"
                            placeholder="https://linkedin.com/in/yourname"
                            value={form.linkedinUrl} onChange={e => set('linkedinUrl', e.target.value)} />
                        </div>
                        <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'3px' }}>Optional — helps the community verify your expertise</div>
                      </div>
                    </>
                  )}

                  <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
                    <button type="button" className="btn-outline" onClick={() => setStep(2)} style={{ flex:1, justifyContent:'center' }}>← Back</button>
                    <button type="submit" className="btn-teal" disabled={mutation.isPending} style={{ flex:2, justifyContent:'center', padding:'13px', opacity: mutation.isPending ? .7 : 1 }}>
                      {mutation.isPending ? <><Loader2 style={{ width:16, height:16, animation:'spin 1s linear infinite' }} /> Creating account…</> : 'Create Account 🚀'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p style={{ textAlign:'center', fontSize:'13px', color:'var(--muted)', marginTop:'16px' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color:'var(--teal)', fontWeight:600, textDecoration:'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
