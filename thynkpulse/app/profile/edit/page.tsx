'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, Save, Linkedin } from 'lucide-react'
import Link from 'next/link'
import { apiPut } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { PhotoUpload } from '@/components/ui/PhotoUpload'
import toast from 'react-hot-toast'

const lbl: React.CSSProperties = { display:'block', fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--muted)', marginBottom:'7px' }
const inp: React.CSSProperties = { width:'100%', padding:'11px 14px', border:'1.5px solid var(--parchment)', borderRadius:'var(--radius)', fontSize:'14px', fontFamily:'var(--font-sans)', color:'var(--ink)', outline:'none', background:'#fff', boxSizing:'border-box', transition:'border-color .2s' }

export default function EditProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, updateUser } = useAuthStore()
  const [form, setForm] = useState({
    fullName: '', designation: '', instituteName: '', companyName: '',
    introduction: '', linkedinUrl: '', websiteUrl: '', avatarUrl: '',
  })

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return }
    if (user?.profile) {
      setForm({
        fullName:     user.profile.fullName     || '',
        designation:  user.profile.designation  || '',
        instituteName:user.profile.instituteName|| '',
        companyName:  user.profile.companyName  || '',
        introduction: user.profile.introduction || '',
        linkedinUrl:  user.profile.linkedinUrl  || '',
        websiteUrl:   user.profile.websiteUrl   || '',
        avatarUrl:    user.profile.avatarUrl    || '',
      })
    }
  }, [isAuthenticated, user, router])

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const mutation = useMutation({
    mutationFn: () => apiPut(`/users/${user?.id}/profile`, form),
    onSuccess: () => {
      updateUser({ profile: { ...user?.profile, ...form } as any })
      toast.success('Profile updated!')
      router.push(`/profile/${user?.id}`)
    },
    onError: () => toast.error('Update failed. Please try again.'),
  })

  const role = user?.role

  return (
    <div style={{ minHeight:'100vh', background:'var(--profile-edit-bg,var(--cream))', paddingTop:'80px' }}>
      <div style={{ maxWidth:'640px', margin:'0 auto', padding:'40px 20px 80px' }}>
        <Link href={`/profile/${user?.id}`} style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'var(--muted)', textDecoration:'none', marginBottom:'28px' }}>
          <ArrowLeft style={{ width:14, height:14 }} /> Back to Profile
        </Link>

        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
          <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'34px', fontWeight:900, color:'var(--ink)', letterSpacing:'-.5px', marginBottom:'6px' }}>Edit Profile</h1>
          <p style={{ fontSize:'14px', color:'var(--muted)', marginBottom:'32px', fontWeight:300 }}>Update your public profile on Thynk Pulse</p>

          <form onSubmit={e => { e.preventDefault(); mutation.mutate() }}>
            {/* Photo upload card */}
            <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'28px', marginBottom:'16px' }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--coral)', marginBottom:'16px' }}>Profile Photo</div>
              <div style={{ display:'flex', alignItems:'center', gap:'24px' }}>
                <PhotoUpload
                  currentUrl={form.avatarUrl}
                  name={form.fullName || 'U'}
                  size={88}
                  onUpload={url => set('avatarUrl', url)}
                />
                <div>
                  <div style={{ fontSize:'15px', fontWeight:600, color:'var(--ink)', marginBottom:'5px', fontFamily:'var(--font-sans)' }}>Professional Photograph</div>
                  <div style={{ fontSize:'13px', color:'var(--muted)', lineHeight:1.65, fontWeight:300, maxWidth:'320px' }}>
                    Click the photo to upload a new headshot. Use a clear, professional photo — it builds trust with the community.
                  </div>
                  <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'6px' }}>JPEG · PNG · WebP · Max 5 MB</div>
                </div>
              </div>
            </div>

            <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'28px', display:'flex', flexDirection:'column', gap:'18px', marginBottom:'16px' }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--coral)' }}>Basic Info</div>

              <div>
                <label style={lbl}>Full Name *</label>
                <input style={inp} value={form.fullName} onChange={e => set('fullName', e.target.value)} required placeholder="Your full name" />
              </div>
              <div>
                <label style={lbl}>Designation *</label>
                <input style={inp} value={form.designation} onChange={e => set('designation', e.target.value)} required placeholder="e.g. Senior Teacher, EdTech Founder" />
              </div>

              {(role === 'educator') && (
                <div>
                  <label style={lbl}>Institute / School Name</label>
                  <input style={inp} value={form.instituteName} onChange={e => set('instituteName', e.target.value)} placeholder="Your school or university" />
                </div>
              )}
              {(role === 'edtech_pro' || role === 'other') && (
                <div>
                  <label style={lbl}>Company / Organisation</label>
                  <input style={inp} value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Your company or organisation" />
                </div>
              )}

              <div>
                <label style={lbl}>About You <span style={{ color:'var(--muted)', fontWeight:400, textTransform:'none', letterSpacing:0 }}>(max 3000 chars)</span></label>
                <textarea style={{ ...inp, resize:'vertical', minHeight:'120px', lineHeight:1.6 }}
                  value={form.introduction}
                  onChange={e => set('introduction', e.target.value.slice(0,3000))}
                  placeholder="Tell the community who you are, what you do and what you write about..." />
                <div style={{ fontSize:'11px', color:'var(--muted)', textAlign:'right', marginTop:'3px' }}>{form.introduction.length}/3000</div>
              </div>
            </div>

            <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'28px', display:'flex', flexDirection:'column', gap:'18px', marginBottom:'24px' }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--coral)' }}>Links</div>
              <div>
                <label style={lbl}>LinkedIn Profile URL</label>
                <div style={{ position:'relative' }}>
                  <div style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', display:'flex' }}>
                    <Linkedin style={{ width:15, height:15, color:'#0A66C2' }} />
                  </div>
                  <input style={{ ...inp, paddingLeft:'36px' }} type="url"
                    value={form.linkedinUrl} onChange={e => set('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/yourname" />
                </div>
                <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'3px' }}>Shown on your public profile — helps verify your expertise</div>
              </div>
              <div>
                <label style={lbl}>Website / Portfolio</label>
                <input style={inp} type="url" value={form.websiteUrl} onChange={e => set('websiteUrl', e.target.value)} placeholder="https://yourwebsite.com" />
              </div>
            </div>

            <button type="submit" className="btn-teal" disabled={mutation.isPending}
              style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:'15px', opacity: mutation.isPending ? .7 : 1 }}>
              {mutation.isPending
                ? <><Loader2 style={{ width:16, height:16, animation:'spin 1s linear infinite' }} /> Saving…</>
                : <><Save style={{ width:16, height:16 }} /> Save Changes</>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
