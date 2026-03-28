'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight, ArrowLeft, Check, MapPin, Briefcase, User, BookOpen, Link2, Phone, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const STEPS = [
  { id: 1, label: 'Identity',     icon: '👤', desc: 'Who are you?' },
  { id: 2, label: 'Organisation', icon: '🏢', desc: 'Where you work' },
  { id: 3, label: 'Your Story',   icon: '✍️', desc: 'Tell your story' },
  { id: 4, label: 'Connect',      icon: '🔗', desc: 'Be discoverable' },
]

const ROLES = ['Teacher / Educator', 'School Principal', 'EdTech Founder', 'EdTech Sales', 'EdTech Marketing', 'Researcher', 'School Counselor', 'Other']

const inp: React.CSSProperties = {
  width: '100%', padding: '13px 16px',
  background: 'rgba(255,255,255,0.06)',
  border: '1.5px solid rgba(255,255,255,0.12)',
  borderRadius: '12px', fontSize: '14px',
  color: '#fff', outline: 'none',
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: 'border-box' as const,
  transition: 'border-color .2s',
}

const lbl: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700,
  letterSpacing: '1.2px', textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.45)', marginBottom: '7px',
  fontFamily: "'DM Mono', monospace",
}

export default function ProfileSetupPage() {
  const router = useRouter()
  const { user, isAuthenticated, updateUser } = useAuthStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: '', designation: '', instituteName: '', companyName: '',
    contactNumber: '', introduction: '', linkedinUrl: '', location: '', interests: '',
  })
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  useEffect(() => { if (!isAuthenticated) router.push('/login') }, [isAuthenticated, router])

  const progress = ((step - 1) / (STEPS.length - 1)) * 100

  async function handleSave() {
    if (!form.fullName.trim()) { toast.error('Full name is required'); return }
    setLoading(true)
    try {
      const token = localStorage.getItem('tp_token')
      const res = await fetch(`/api/users/${user?.email || user?.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, profileCompleted: true }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed to save'); setLoading(false); return }
      updateUser({ profile: { ...user?.profile, ...form, profileCompleted: true } })
      toast.success('Profile saved! Welcome to Thynk Pulse 🎉')
      router.push('/')
    } catch {
      toast.error('Network error — try again')
      setLoading(false)
    }
  }

  async function handleSkip() {
    try {
      const token = localStorage.getItem('tp_token')
      await fetch(`/api/users/${user?.email || user?.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ profileCompleted: false }),
      })
    } catch {}
    toast('You can complete your profile anytime', { icon: '👋' })
    router.push('/')
  }

  function next() { if (step < 4) setStep(s => s + 1); else handleSave() }
  function back() { if (step > 1) setStep(s => s - 1) }

  const canNext = step === 1 ? form.fullName.trim().length > 0 : true
  const name = user?.profile?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'there'

  const PERKS = [
    { icon: '✍️', text: 'Publish articles to 10K+ readers' },
    { icon: '💬', text: 'Comment and join discussions' },
    { icon: '🤝', text: 'Build your professional network' },
    { icon: '📈', text: 'Grow your brand in education' },
    { icon: '🔔', text: 'Get featured in weekly digest' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0D1117', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Fraunces:ital,wght@0,900;1,900&display=swap');
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
        input:focus, textarea:focus, select:focus {
          border-color: rgba(100,220,190,0.5) !important;
          background: rgba(255,255,255,0.08) !important;
          box-shadow: 0 0 0 3px rgba(100,220,190,0.08);
        }
        select option { background: #1a2640; color: #fff; }
        .step-btn:hover { background: rgba(255,255,255,0.08) !important; }
        @media(max-width:768px){ .left-panel{ display:none !important; } .right-panel{ max-width:100% !important; } }
      `}</style>

      {/* ── Left panel ── */}
      <div className="left-panel" style={{
        width: '400px', flexShrink: 0, position: 'sticky', top: 0, height: '100vh',
        background: 'linear-gradient(160deg, #0a1628 0%, #0D2A1E 50%, #0a1628 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', padding: '48px 40px', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:'-80px', left:'-80px', width:'300px', height:'300px', background:'radial-gradient(circle, rgba(10,95,85,0.25) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-100px', right:'-60px', width:'280px', height:'280px', background:'radial-gradient(circle, rgba(201,146,42,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />

        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'56px' }}>
          <div style={{ width:36, height:36, borderRadius:'10px', background:'linear-gradient(135deg,#0A5F55,#12A090)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', boxShadow:'0 8px 24px rgba(10,95,85,0.4)' }}>⚡</div>
          <span style={{ fontFamily:"'Fraunces', serif", fontWeight:900, fontSize:'18px', color:'#fff', letterSpacing:'-0.5px' }}>Thynk Pulse</span>
        </div>

        <div style={{ marginBottom:'40px' }}>
          <div style={{ fontSize:'12px', fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:'rgba(100,220,190,0.7)', marginBottom:'10px', fontFamily:"'DM Mono', monospace" }}>
            Step {step} of {STEPS.length}
          </div>
          <h2 style={{ fontFamily:"'Fraunces', serif", fontWeight:900, fontSize:'36px', lineHeight:1.05, color:'#fff', letterSpacing:'-1px', marginBottom:'10px' }}>
            Welcome,<br /><em style={{ fontStyle:'italic', color:'#64DCBE' }}>{name}</em>
          </h2>
          <p style={{ fontSize:'14px', color:'rgba(255,255,255,0.45)', lineHeight:1.7, fontWeight:300 }}>
            Set up your profile to unlock everything Thynk Pulse has to offer.
          </p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'40px' }}>
          {STEPS.map((s) => (
            <motion.div key={s.id}
              onClick={() => s.id < step && setStep(s.id)}
              style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 12px', borderRadius:'10px', cursor: s.id < step ? 'pointer' : 'default', transition:'all .2s',
                background: step===s.id ? 'rgba(100,220,190,0.1)' : 'transparent',
                border: `1px solid ${step===s.id ? 'rgba(100,220,190,0.25)' : 'transparent'}`,
              }}>
              <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', flexShrink:0, transition:'all .2s',
                background: s.id < step ? '#64DCBE' : step===s.id ? 'rgba(100,220,190,0.2)' : 'rgba(255,255,255,0.06)',
                border: `1.5px solid ${s.id <= step ? 'rgba(100,220,190,0.5)' : 'rgba(255,255,255,0.1)'}`,
              }}>
                {s.id < step
                  ? <Check style={{ width:12, height:12, color:'#0D1117' }} />
                  : <span style={{ color: step===s.id ? '#64DCBE' : 'rgba(255,255,255,0.3)', fontSize:'11px' }}>{s.id}</span>}
              </div>
              <div>
                <div style={{ fontSize:'13px', fontWeight:600, color: step===s.id ? '#fff' : s.id < step ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)' }}>{s.label}</div>
                <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.25)', marginTop:'1px' }}>{s.desc}</div>
              </div>
              {step===s.id && <div style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:'#64DCBE', boxShadow:'0 0 8px #64DCBE' }} />}
            </motion.div>
          ))}
        </div>

        <div style={{ marginBottom:'32px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
            <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.3)', fontFamily:"'DM Mono', monospace" }}>Profile complete</span>
            <span style={{ fontSize:'11px', color:'#64DCBE', fontFamily:"'DM Mono', monospace", fontWeight:600 }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ height:4, background:'rgba(255,255,255,0.07)', borderRadius:'4px', overflow:'hidden' }}>
            <motion.div animate={{ width:`${progress}%` }} transition={{ duration:.5, ease:'easeOut' }}
              style={{ height:'100%', background:'linear-gradient(90deg,#64DCBE,#C9922A)', borderRadius:'4px' }} />
          </div>
        </div>

        <div style={{ marginTop:'auto' }}>
          <div style={{ fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.2)', marginBottom:'12px', fontFamily:"'DM Mono', monospace" }}>What you unlock</div>
          {PERKS.map(p => (
            <div key={p.icon} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
              <span style={{ fontSize:'14px', flexShrink:0 }}>{p.icon}</span>
              <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.4)', lineHeight:1.4 }}>{p.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="right-panel" style={{ flex:1, maxWidth:'640px', display:'flex', flexDirection:'column', justifyContent:'center', padding:'60px 56px', overflowY:'auto' }}>
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
            transition={{ duration:.3, ease:'easeOut' }}>

            <div style={{ marginBottom:'36px' }}>
              <div style={{ fontSize:'32px', marginBottom:'10px' }}>{STEPS[step-1].icon}</div>
              <h2 style={{ fontFamily:"'Fraunces', serif", fontWeight:900, fontSize:'30px', color:'#fff', letterSpacing:'-0.5px', marginBottom:'6px' }}>
                {step===1 && 'Tell us who you are'}
                {step===2 && 'Where do you work?'}
                {step===3 && 'Share your story'}
                {step===4 && 'Get discovered'}
              </h2>
              <p style={{ fontSize:'14px', color:'rgba(255,255,255,0.4)', lineHeight:1.6, fontWeight:300 }}>
                {step===1 && 'Your name and role in the education space.'}
                {step===2 && 'Help others find you by your institution or company.'}
                {step===3 && 'A short bio goes a long way in building trust.'}
                {step===4 && 'Add your links and location so people can connect.'}
              </p>
            </div>

            {step===1 && (
              <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
                <div>
                  <label style={lbl}>Full Name *</label>
                  <input style={inp} autoFocus type="text" placeholder="e.g. Priya Sharma"
                    value={form.fullName} onChange={e=>set('fullName',e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Your Role</label>
                  <select style={{ ...inp, cursor:'pointer', appearance:'none' as any }}
                    value={form.designation} onChange={e=>set('designation',e.target.value)}>
                    <option value="">Select your role...</option>
                    {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Experience</label>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
                    {['0-2 yrs','3-5 yrs','6-10 yrs','10+ yrs'].map(exp=>(
                      <button key={exp} type="button" onClick={()=>set('interests',exp)}
                        style={{ padding:'10px', borderRadius:'10px', border:`1.5px solid ${form.interests===exp?'#64DCBE':'rgba(255,255,255,0.1)'}`,
                          background: form.interests===exp?'rgba(100,220,190,0.1)':'transparent',
                          color: form.interests===exp?'#64DCBE':'rgba(255,255,255,0.4)',
                          cursor:'pointer', fontSize:'12px', fontWeight:600, fontFamily:"'DM Sans',sans-serif", transition:'all .15s' }}>
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step===2 && (
              <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
                <div>
                  <label style={lbl}>School / Institute</label>
                  <div style={{ position:'relative' }}>
                    <BookOpen style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:15, height:15, color:'rgba(255,255,255,0.25)', pointerEvents:'none' }} />
                    <input style={{ ...inp, paddingLeft:'42px' }} type="text" placeholder="e.g. Delhi Public School, IIT Delhi"
                      value={form.instituteName} onChange={e=>set('instituteName',e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Company / Organisation</label>
                  <div style={{ position:'relative' }}>
                    <Briefcase style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:15, height:15, color:'rgba(255,255,255,0.25)', pointerEvents:'none' }} />
                    <input style={{ ...inp, paddingLeft:'42px' }} type="text" placeholder="e.g. EduTech Ventures Pvt Ltd"
                      value={form.companyName} onChange={e=>set('companyName',e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Contact Number</label>
                  <div style={{ position:'relative' }}>
                    <Phone style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:15, height:15, color:'rgba(255,255,255,0.25)', pointerEvents:'none' }} />
                    <input style={{ ...inp, paddingLeft:'42px' }} type="tel" placeholder="+91 98XXXXXXXX"
                      value={form.contactNumber} onChange={e=>set('contactNumber',e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Type of Organisation</label>
                  <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                    {['School','College / University','EdTech Company','NGO','Government','Private Company'].map(type=>(
                      <button key={type} type="button"
                        style={{ padding:'7px 14px', borderRadius:'100px', border:'1.5px solid rgba(255,255,255,0.1)',
                          background:'transparent', color:'rgba(255,255,255,0.4)',
                          cursor:'pointer', fontSize:'12px', fontFamily:"'DM Sans',sans-serif", transition:'all .15s' }}
                        onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(100,220,190,0.4)';(e.currentTarget as HTMLButtonElement).style.color='#64DCBE'}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(255,255,255,0.1)';(e.currentTarget as HTMLButtonElement).style.color='rgba(255,255,255,0.4)'}}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step===3 && (
              <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
                <div>
                  <label style={{ ...lbl, display:'flex', justifyContent:'space-between' }}>
                    <span>Short Bio</span>
                    <span style={{ color:'rgba(255,255,255,0.2)' }}>{form.introduction.length}/400</span>
                  </label>
                  <textarea style={{ ...inp, resize:'vertical', lineHeight:1.75, minHeight:'140px' }} rows={5}
                    maxLength={400}
                    placeholder="Tell the community about yourself — your background, what you're passionate about, and what you write about..."
                    value={form.introduction} onChange={e=>set('introduction',e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Areas of Expertise</label>
                  <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.3)', marginBottom:'10px' }}>Click to add or type your own</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'10px' }}>
                    {['EdTech','AI in Education','School Leadership','Teacher Training','Curriculum Design','STEM','Early Childhood','Higher Education','Vocational Ed','School Sales','Ed Policy'].map(tag=>{
                      const active = form.interests.includes(tag)
                      return (
                        <button key={tag} type="button"
                          onClick={()=>{
                            const tags = form.interests.split(',').map(t=>t.trim()).filter(Boolean)
                            if(active) set('interests', tags.filter(t=>t!==tag).join(', '))
                            else set('interests', [...tags, tag].join(', '))
                          }}
                          style={{ padding:'7px 14px', borderRadius:'100px', border:`1.5px solid ${active?'rgba(100,220,190,0.4)':'rgba(255,255,255,0.1)'}`,
                            background: active?'rgba(100,220,190,0.1)':'transparent',
                            color: active?'#64DCBE':'rgba(255,255,255,0.4)',
                            cursor:'pointer', fontSize:'12px', fontFamily:"'DM Sans',sans-serif", transition:'all .15s', fontWeight: active?600:400 }}>
                          {active && '✓ '}{tag}
                        </button>
                      )
                    })}
                  </div>
                  <input style={{ ...inp, fontSize:'13px' }} type="text" placeholder="Or type comma-separated interests..."
                    value={form.interests} onChange={e=>set('interests',e.target.value)} />
                </div>
              </div>
            )}

            {step===4 && (
              <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
                <div>
                  <label style={lbl}>LinkedIn Profile</label>
                  <div style={{ position:'relative' }}>
                    <Link2 style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:15, height:15, color:'rgba(255,255,255,0.25)', pointerEvents:'none' }} />
                    <input style={{ ...inp, paddingLeft:'42px' }} type="url" placeholder="https://linkedin.com/in/yourname"
                      value={form.linkedinUrl} onChange={e=>set('linkedinUrl',e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Location</label>
                  <div style={{ position:'relative' }}>
                    <MapPin style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:15, height:15, color:'rgba(255,255,255,0.25)', pointerEvents:'none' }} />
                    <input style={{ ...inp, paddingLeft:'42px' }} type="text" placeholder="e.g. Bangalore, Karnataka"
                      value={form.location} onChange={e=>set('location',e.target.value)} />
                  </div>
                </div>
                {(form.fullName || form.designation) && (
                  <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                    style={{ padding:'20px', borderRadius:'14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', marginTop:'8px' }}>
                    <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:'12px', fontFamily:"'DM Mono',monospace" }}>Your profile preview</div>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ width:44, height:44, borderRadius:'12px', background:'linear-gradient(135deg,#0A5F55,#12A090)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Fraunces',serif", fontWeight:900, fontSize:'18px', color:'#fff', flexShrink:0 }}>
                        {(form.fullName||'?')[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight:600, color:'#fff', fontSize:'14px' }}>{form.fullName||'Your Name'}</div>
                        <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.45)', marginTop:'2px' }}>
                          {form.designation}{form.companyName?` · ${form.companyName}`:''}{form.instituteName?` · ${form.instituteName}`:''}
                        </div>
                        {form.location && <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.3)', marginTop:'3px', display:'flex', alignItems:'center', gap:'4px' }}><MapPin style={{width:10,height:10}}/>{form.location}</div>}
                      </div>
                    </div>
                    {form.introduction && <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', marginTop:'10px', lineHeight:1.6, fontWeight:300 }}>{form.introduction.slice(0,100)}{form.introduction.length>100?'…':''}</p>}
                  </motion.div>
                )}
              </div>
            )}

            <div style={{ display:'flex', gap:'10px', marginTop:'36px' }}>
              {step > 1 && (
                <button onClick={back} type="button"
                  style={{ display:'flex', alignItems:'center', gap:'7px', padding:'13px 20px', borderRadius:'12px', border:'1.5px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:'14px', fontFamily:"'DM Sans',sans-serif", transition:'all .15s' }}>
                  <ArrowLeft style={{ width:15, height:15 }} /> Back
                </button>
              )}
              <button onClick={next} disabled={!canNext || loading} type="button"
                style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'14px 28px', borderRadius:'12px', border:'none', cursor:(!canNext||loading)?'not-allowed':'pointer', fontSize:'15px', fontWeight:700, fontFamily:"'DM Sans',sans-serif", transition:'all .2s',
                  background: canNext ? 'linear-gradient(135deg,#64DCBE,#0A5F55)' : 'rgba(255,255,255,0.06)',
                  color: canNext ? '#0D1117' : 'rgba(255,255,255,0.2)',
                  boxShadow: canNext ? '0 8px 28px rgba(100,220,190,0.25)' : 'none',
                  opacity: loading ? .7 : 1,
                }}>
                {loading
                  ? <><Loader2 style={{width:16,height:16,animation:'spin 1s linear infinite'}}/>Saving…</>
                  : step===4
                    ? <><Sparkles style={{width:16,height:16}}/>Complete Profile</>
                    : <>Next: {STEPS[step].label} <ArrowRight style={{width:15,height:15}}/></>}
              </button>
            </div>

            <div style={{ textAlign:'center', marginTop:'16px' }}>
              <button onClick={handleSkip} type="button"
                style={{ background:'none', border:'none', color:'rgba(255,255,255,0.2)', cursor:'pointer', fontSize:'13px', fontFamily:"'DM Sans',sans-serif", padding:'4px 8px' }}>
                Skip for now — complete later
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
```
