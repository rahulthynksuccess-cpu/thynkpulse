'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Save, Send, Eye, ArrowLeft, Loader2, Hash, Type } from 'lucide-react'
import { apiPost } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import toast from 'react-hot-toast'

const CATEGORIES = ['EdTech','Educator','Sales Pro','Research','Leadership','Career','Innovation','Policy','Higher Education','Vocational Ed','STEM','Other']
const EMOJIS = ['📝','🤖','🌱','📈','🔬','🏫','💼','💡','📊','🏆','🎓','🌍','📱','🎯','✍️','💻','🔑','🚀']

export default function WritePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', category: 'EdTech',
    tags: '' as string, coverEmoji: '📝', status: 'draft' as 'draft' | 'pending',
  })
  const [preview, setPreview] = useState(false)
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const mutation = useMutation({
    mutationFn: (status: 'draft' | 'pending') => apiPost('/posts', {
      ...form, status,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }),
    onSuccess: (_, status) => {
      toast.success(status === 'pending' ? 'Submitted! We\'ll review it shortly.' : 'Draft saved!')
      if (status === 'pending') router.push('/')
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to save'),
  })

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length
  const readTime  = Math.max(1, Math.ceil(wordCount / 200))

  if (!isAuthenticated) return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'56px', marginBottom:'16px' }}>✍️</div>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:'28px', fontWeight:900, color:'var(--ink)', marginBottom:'12px' }}>Sign in to write</div>
        <Link href="/login" className="btn-teal">Sign In →</Link>
      </div>
    </div>
  )

  if (!user?.profile?.profileCompleted) return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>
      <div style={{ textAlign:'center', maxWidth:'420px' }}>
        <div style={{ fontSize:'56px', marginBottom:'16px' }}>✍️</div>
        <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'28px', fontWeight:900, color:'var(--ink)', marginBottom:'12px' }}>Complete Your Profile First</h2>
        <p style={{ fontSize:'14px', color:'var(--muted)', lineHeight:1.7, marginBottom:'24px', fontFamily:'var(--font-sans)', fontWeight:300 }}>
          You need to complete your profile before you can publish posts. It only takes 2 minutes.
        </p>
        <a href="/profile/setup" style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'12px 28px', borderRadius:'var(--radius)', background:'var(--teal)', color:'#fff', textDecoration:'none', fontFamily:'var(--font-sans)', fontWeight:600, fontSize:'15px' }}>
          Complete Profile →
        </a>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)' }}>
      {/* Top bar */}
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(253,246,236,.96)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)', padding:'0 40px', height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'var(--muted)', textDecoration:'none', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif', fontWeight:500 }}>
            <ArrowLeft style={{ width:15, height:15 }} /> Back
          </Link>
          <div style={{ width:1, height:20, background:'var(--border)' }} />
          <span style={{ fontFamily:'"Cormorant Garamond",Georgia,serif', fontSize:'17px', fontWeight:700, color:'#1A1208' }}>Write a Post</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--muted)', background:'var(--parchment)', padding:'3px 10px', borderRadius:'100px' }}>
            {wordCount} words · {readTime} min read
          </span>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <button onClick={() => setPreview(!preview)}
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'8px', border:'1.5px solid var(--parchment)', background:'transparent', color:'var(--ink)', fontFamily:'var(--font-sans)', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
            {preview ? <Type style={{ width:14, height:14 }} /> : <Eye style={{ width:14, height:14 }} />}
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button onClick={() => mutation.mutate('draft')} disabled={mutation.isPending}
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'8px', border:'1.5px solid var(--parchment)', background:'transparent', color:'var(--muted)', fontFamily:'var(--font-sans)', fontSize:'13px', fontWeight:500, cursor:'pointer' }}>
            <Save style={{ width:14, height:14 }} /> Save Draft
          </button>
          <button
            onClick={() => { if (!form.title || !form.content) { toast.error('Title and content are required'); return } mutation.mutate('pending') }}
            disabled={mutation.isPending}
            style={{ display:'flex', alignItems:'center', gap:'7px', padding:'9px 20px', borderRadius:'9px', background:'var(--teal)', color:'#fff', border:'none', fontFamily:'var(--font-sans)', fontSize:'13px', fontWeight:700, cursor:'pointer', opacity: mutation.isPending ? 0.7 : 1 }}>
            {mutation.isPending ? <Loader2 style={{ width:14, height:14, animation:'spin 1s linear infinite' }} /> : <Send style={{ width:14, height:14 }} />}
            Submit for Review
          </button>
        </div>
      </div>

      <div style={{ maxWidth:'820px', margin:'0 auto', padding:'48px 24px 80px' }}>
        {!preview ? (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>

            {/* Cover emoji picker */}
            <div style={{ marginBottom:'28px' }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' as const, color:'var(--muted)', marginBottom:'12px' }}>Choose a Cover</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => set('coverEmoji', e)}
                    style={{ width:44, height:44, borderRadius:'11px', fontSize:'22px', border: form.coverEmoji===e ? '2.5px solid var(--teal)' : '1.5px solid var(--parchment)', background: form.coverEmoji===e ? 'rgba(10,95,85,.07)' : '#fff', cursor:'pointer', transition:'all .15s', transform: form.coverEmoji===e ? 'scale(1.1)' : 'none' }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <textarea placeholder="Your post title..." value={form.title}
              onChange={e => set('title', e.target.value.slice(0,160))} rows={2}
              style={{ width:'100%', fontFamily:'"Cormorant Garamond",Georgia,serif', fontSize:'clamp(28px,4vw,48px)', fontWeight:900, color:'#1A1208', letterSpacing:'-1.5px', lineHeight:1.15, border:'none', outline:'none', background:'transparent', resize:'none', marginBottom:'4px', boxSizing:'border-box' as const }} />
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--muted)', marginBottom:'20px', textAlign:'right' as const }}>{form.title.length}/160</div>

            {/* Excerpt */}
            <input placeholder="Add a short subtitle or teaser (optional)..."
              value={form.excerpt} onChange={e => set('excerpt', e.target.value.slice(0,280))}
              style={{ width:'100%', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif', fontSize:'19px', color:'#7A6A52', border:'none', outline:'none', background:'transparent', marginBottom:'28px', fontWeight:300 }} />

            {/* Category + Tags */}
            <div style={{ display:'flex', gap:'14px', marginBottom:'28px', flexWrap:'wrap', padding:'16px 20px', background:'#fff', borderRadius:'14px', border:'1px solid var(--border)' }}>
              <div style={{ flex:1, minWidth:'150px' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase' as const, color:'var(--muted)', marginBottom:'6px' }}>Category *</div>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  style={{ width:'100%', padding:'9px 12px', border:'1.5px solid var(--parchment)', borderRadius:'9px', fontFamily:'var(--font-sans)', fontSize:'14px', color:'var(--ink)', background:'#fff', outline:'none', cursor:'pointer' }}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex:2, minWidth:'200px' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase' as const, color:'var(--muted)', marginBottom:'6px', display:'flex', alignItems:'center', gap:'4px' }}>
                  <Hash style={{ width:10, height:10 }} /> Tags (comma separated)
                </div>
                <input value={form.tags} onChange={e => set('tags', e.target.value)}
                  placeholder="AI, EdTech, Teaching..."
                  style={{ width:'100%', padding:'9px 12px', border:'1.5px solid var(--parchment)', borderRadius:'9px', fontFamily:'var(--font-sans)', fontSize:'14px', color:'var(--ink)', background:'#fff', outline:'none' }} />
              </div>
            </div>

            {/* Divider */}
            <div style={{ width:'100%', height:1, background:'var(--border)', marginBottom:'32px' }} />

            {/* Content area */}
            <textarea
              placeholder={`Start writing your post...\n\nShare your experiences, insights, and ideas with India's education community.\n\nTip: Use blank lines to create paragraphs. Your writing will be formatted beautifully on the live page.`}
              value={form.content} onChange={e => set('content', e.target.value)}
              style={{ width:'100%', minHeight:'520px', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif', fontSize:'18px', color:'#1A1208', lineHeight:1.9, border:'none', outline:'none', background:'transparent', resize:'none', fontWeight:300, boxSizing:'border-box' as const }} />

          </motion.div>
        ) : (
          // Preview mode
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div style={{ background:'#fff', borderRadius:'20px', border:'1px solid var(--border)', overflow:'hidden' }}>
              {/* Preview header */}
              <div style={{ padding:'32px 40px', borderBottom:'1px solid var(--border)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'20px' }}>
                  <span style={{ fontSize:'52px' }}>{form.coverEmoji}</span>
                  <div>
                    <span className="badge badge-teal" style={{ fontSize:'11px', marginBottom:'6px', display:'block' }}>{form.category}</span>
                    <span style={{ fontSize:'12px', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{readTime} min read · {wordCount} words</span>
                  </div>
                </div>
                <h1 style={{ fontFamily:'"Cormorant Garamond",Georgia,serif', fontSize:'clamp(28px,4vw,44px)', fontWeight:900, color:'#1A1208', lineHeight:1.1, letterSpacing:'-1.5px', marginBottom:'14px' }}>
                  {form.title || <span style={{ color:'var(--muted)' }}>Your title will appear here...</span>}
                </h1>
                {form.excerpt && (
                  <p style={{ fontSize:'19px', color:'var(--muted)', lineHeight:1.65, fontWeight:300, fontFamily:'var(--font-sans)', borderLeft:'3px solid var(--teal)', paddingLeft:'16px', margin:'0' }}>
                    {form.excerpt}
                  </p>
                )}
              </div>
              {/* Preview body */}
              <div style={{ padding:'36px 40px' }}>
                <div style={{ fontSize:'17px', color:'#1A1208', lineHeight:1.9, whiteSpace:'pre-wrap', fontWeight:300, fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif' }}>
                  {form.content || <span style={{ color:'var(--muted)' }}>Your content will appear here...</span>}
                </div>
                {form.tags && (
                  <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'32px', paddingTop:'24px', borderTop:'1px solid var(--border)' }}>
                    {form.tags.split(',').filter(t=>t.trim()).map(t => (
                      <span key={t} className="topic-tag">{t.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
