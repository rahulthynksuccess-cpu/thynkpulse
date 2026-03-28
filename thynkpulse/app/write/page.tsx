'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Save, Send, Eye, ArrowLeft, Loader2 } from 'lucide-react'
import { apiPost } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import toast from 'react-hot-toast'

const CATEGORIES = ['EdTech','Educator','Sales Pro','Research','Leadership','Career','Innovation','Policy','Higher Education','Vocational Ed','STEM','Other']
const EMOJIS = ['📝','🤖','🌱','📈','🔬','🏫','💼','💡','📊','🏆','🎓','🌍','📱','🎯','✍️','💻','🔑','🚀']

export default function WritePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  // ALL hooks must be called before any conditional return
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', category: 'EdTech',
    tags: '' as string, coverEmoji: '📝', status: 'draft' as 'draft' | 'pending',
  })
  const [preview, setPreview] = useState(false)
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const mutation = useMutation({
    mutationFn: (status: 'draft' | 'pending') => apiPost('/posts', {
      ...form,
      status,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }),
    onSuccess: (_, status) => {
      toast.success(status === 'pending' ? 'Submitted for approval! We\'ll review it shortly.' : 'Draft saved!')
      if (status === 'pending') router.push('/')
    },
    onError: (err: any) => toast.error(err.response?.data?.error || err.message || 'Failed to save'),
  })

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length
  const readTime  = Math.max(1, Math.ceil(wordCount / 200))

  // Conditional renders AFTER all hooks
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'28px', fontWeight:900, color:'var(--ink)', marginBottom:'12px' }}>Sign in to write</div>
          <Link href="/login" className="btn-teal">Sign In →</Link>
        </div>
      </div>
    )
  }

  if (!user?.profile?.profileCompleted) {
    return (
      <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>
        <div style={{ textAlign:'center', maxWidth:'420px' }}>
          <div style={{ fontSize:'56px', marginBottom:'16px' }}>✍️</div>
          <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'28px', fontWeight:900, color:'var(--ink)', marginBottom:'12px' }}>Complete Your Profile First</h2>
          <p style={{ fontSize:'14px', color:'var(--muted)', lineHeight:1.7, marginBottom:'24px' }}>
            You need to complete your profile before you can publish posts. It only takes 2 minutes.
          </p>
          <a href="/profile/setup" style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'12px 28px', borderRadius:'var(--radius)', background:'var(--teal)', color:'#fff', textDecoration:'none', fontFamily:'var(--font-sans)', fontWeight:600, fontSize:'15px' }}>
            Complete Profile →
          </a>
          <div style={{ marginTop:'12px' }}>
            <a href="/" style={{ fontSize:'13px', color:'var(--muted)', textDecoration:'none', fontFamily:'var(--font-sans)' }}>← Back to feed</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)' }}>
      {/* Top bar */}
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(253,246,236,.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)', padding:'0 5%', height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'var(--muted)', textDecoration:'none' }}>
            <ArrowLeft style={{ width:15, height:15 }} /> Back
          </Link>
          <div style={{ width:1, height:20, background:'var(--border)' }} />
          <span style={{ fontFamily:'var(--font-serif)', fontSize:'16px', fontWeight:700, color:'var(--ink)' }}>Write a Post</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--muted)', letterSpacing:'1px' }}>{wordCount} words · ~{readTime} min read</span>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <button onClick={() => setPreview(!preview)} className="btn-outline" style={{ padding:'8px 16px', fontSize:'13px', display:'flex', alignItems:'center', gap:'6px' }}>
            <Eye style={{ width:14, height:14 }} /> {preview ? 'Edit' : 'Preview'}
          </button>
          <button onClick={() => mutation.mutate('draft')} className="btn-ghost" disabled={mutation.isPending} style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px' }}>
            <Save style={{ width:14, height:14 }} /> Save Draft
          </button>
          <button
            onClick={() => { if (!form.title || !form.content) { toast.error('Title and content are required'); return } mutation.mutate('pending') }}
            className="btn-teal" disabled={mutation.isPending} style={{ padding:'9px 20px', fontSize:'13px', display:'flex', alignItems:'center', gap:'6px' }}>
            {mutation.isPending ? <Loader2 style={{ width:14, height:14, animation:'spin 1s linear infinite' }} /> : <Send style={{ width:14, height:14 }} />}
            Submit for Review
          </button>
        </div>
      </div>

      <div style={{ maxWidth:'780px', margin:'0 auto', padding:'48px 20px' }}>
        {!preview ? (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
            <div style={{ marginBottom:'24px' }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--muted)', marginBottom:'10px' }}>Cover Emoji</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => set('coverEmoji', e)}
                    style={{ width:40, height:40, borderRadius:'10px', fontSize:'20px', border: form.coverEmoji===e ? '2px solid var(--teal)' : '1.5px solid var(--parchment)', background: form.coverEmoji===e ? 'rgba(10,95,85,.06)' : '#fff', cursor:'pointer', transition:'all .15s' }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <textarea placeholder="Your post title..." value={form.title}
              onChange={e => set('title', e.target.value.slice(0,160))} rows={2}
              style={{ width:'100%', fontFamily:'var(--font-serif)', fontSize:'clamp(28px,4vw,44px)', fontWeight:900, color:'var(--ink)', letterSpacing:'-1px', lineHeight:1.15, border:'none', outline:'none', background:'transparent', resize:'none', marginBottom:'12px', boxSizing:'border-box' }} />
            <input placeholder="Add a short excerpt / subtitle (optional)..."
              value={form.excerpt} onChange={e => set('excerpt', e.target.value.slice(0,300))}
              style={{ width:'100%', fontFamily:'var(--font-sans)', fontSize:'18px', color:'var(--muted)', border:'none', outline:'none', background:'transparent', marginBottom:'24px', fontWeight:300 }} />
            <div style={{ display:'flex', gap:'12px', marginBottom:'28px', flexWrap:'wrap' }}>
              <div style={{ flex:1, minWidth:'160px' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--muted)', marginBottom:'6px' }}>Category *</div>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  style={{ width:'100%', padding:'9px 12px', border:'1.5px solid var(--parchment)', borderRadius:'var(--radius)', fontFamily:'var(--font-sans)', fontSize:'13px', color:'var(--ink)', background:'#fff', outline:'none', cursor:'pointer' }}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex:2, minWidth:'200px' }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--muted)', marginBottom:'6px' }}>Tags (comma separated)</div>
                <input value={form.tags} onChange={e => set('tags', e.target.value)}
                  placeholder="e.g. AI, EdTech, Teaching"
                  style={{ width:'100%', padding:'9px 12px', border:'1.5px solid var(--parchment)', borderRadius:'var(--radius)', fontFamily:'var(--font-sans)', fontSize:'13px', color:'var(--ink)', background:'#fff', outline:'none' }} />
              </div>
            </div>
            <div style={{ width:'100%', height:1, background:'var(--border)', marginBottom:'28px' }} />
            <textarea
              placeholder={`Start writing your post...\n\nShare your experiences, insights, and ideas with India's education community.`}
              value={form.content} onChange={e => set('content', e.target.value)}
              style={{ width:'100%', minHeight:'480px', fontFamily:'var(--font-sans)', fontSize:'17px', color:'var(--ink)', lineHeight:1.8, border:'none', outline:'none', background:'transparent', resize:'none', fontWeight:300, boxSizing:'border-box' }} />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ padding:'32px', background:'#fff', borderRadius:'var(--radius-xl)', border:'1px solid var(--border)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
              <span style={{ fontSize:'40px' }}>{form.coverEmoji}</span>
              <span className="badge badge-teal">{form.category}</span>
              <span style={{ fontSize:'12px', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{readTime} min read</span>
            </div>
            <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'40px', fontWeight:900, color:'var(--ink)', lineHeight:1.1, letterSpacing:'-1.5px', marginBottom:'14px' }}>{form.title || 'Your title here'}</h1>
            {form.excerpt && <p style={{ fontSize:'18px', color:'var(--muted)', marginBottom:'24px', fontWeight:300 }}>{form.excerpt}</p>}
            <div style={{ height:1, background:'var(--border)', marginBottom:'24px' }} />
            <div style={{ fontSize:'16px', color:'var(--ink)', lineHeight:1.8, whiteSpace:'pre-wrap', fontWeight:300 }}>{form.content || 'Your content will appear here...'}</div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
