'use client'
export const dynamic = 'force-dynamic'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Save, Send, Eye, ArrowLeft, Loader2, Bold, Italic, List, Quote, Hash, Type, AlignLeft } from 'lucide-react'
import { apiPost } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import toast from 'react-hot-toast'

const CATEGORIES = ['EdTech','Educator','Sales Pro','Research','Leadership','Career','Innovation','Policy','Higher Education','Vocational Ed','STEM','Other']
const EMOJIS = ['📝','🤖','🌱','📈','🔬','🏫','💼','💡','📊','🏆','🎓','🌍','📱','🎯','✍️','💻','🔑','🚀']
const FONT_SIZES = ['14px','15px','16px','17px','18px','20px','22px']
const FONTS = ['Plus Jakarta Sans','Cormorant Garamond','Georgia','Arial','Verdana']
const LINE_HEIGHTS = ['1.5','1.65','1.8','1.9','2.0','2.2']

const S = {
  serif: '"Cormorant Garamond","Fraunces",Georgia,serif',
  sans:  '"Plus Jakarta Sans","Outfit",system-ui,sans-serif',
}

export default function WritePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const contentRef = useRef<HTMLTextAreaElement>(null)

  const [form, setForm] = useState({
    title:'', excerpt:'', content:'', category:'EdTech',
    tags:'' as string, coverEmoji:'📝', status:'draft' as 'draft'|'pending',
  })
  const [preview, setPreview] = useState(false)
  const [fontSize, setFontSize] = useState('17px')
  const [fontFamily, setFontFamily] = useState('Plus Jakarta Sans')
  const [lineHeight, setLineHeight] = useState('1.85')
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const mutation = useMutation({
    mutationFn: (status: 'draft'|'pending') => apiPost('/posts', {
      ...form, status,
      tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean),
    }),
    onSuccess: (_, status) => {
      toast.success(status==='pending' ? 'Submitted for review!' : 'Draft saved!')
      if (status==='pending') router.push('/')
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to save'),
  })

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length
  const readTime  = Math.max(1, Math.ceil(wordCount/200))

  // Insert formatting at cursor
  const insertFormat = (prefix: string, suffix = '', placeholder = 'text') => {
    const ta = contentRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end   = ta.selectionEnd
    const selected = form.content.slice(start, end) || placeholder
    const newText = form.content.slice(0,start) + prefix + selected + suffix + form.content.slice(end)
    set('content', newText)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(start + prefix.length, start + prefix.length + selected.length)
    }, 10)
  }

  const fontDisplayName = fontFamily.split(',')[0].replace(/"/g,'')

  if (!isAuthenticated) return (
    <div style={{ minHeight:'100vh', background:'#FDF6EC', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'56px', marginBottom:'16px' }}>✍️</div>
        <div style={{ fontFamily:S.serif, fontSize:'28px', fontWeight:900, color:'#1A1208', marginBottom:'12px' }}>Sign in to write</div>
        <Link href="/login" style={{ padding:'11px 28px', borderRadius:'10px', background:'#0A5F55', color:'#fff', textDecoration:'none', fontFamily:S.sans, fontWeight:600 }}>Sign In →</Link>
      </div>
    </div>
  )

  if (!user?.profile?.profileCompleted) return (
    <div style={{ minHeight:'100vh', background:'#FDF6EC', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>
      <div style={{ textAlign:'center', maxWidth:'420px' }}>
        <div style={{ fontSize:'56px', marginBottom:'16px' }}>✍️</div>
        <h2 style={{ fontFamily:S.serif, fontSize:'28px', fontWeight:900, color:'#1A1208', marginBottom:'12px' }}>Complete Your Profile First</h2>
        <p style={{ fontSize:'15px', color:'#7A6A52', lineHeight:1.7, marginBottom:'24px', fontFamily:S.sans, fontWeight:300 }}>You need a complete profile before publishing. It takes 2 minutes.</p>
        <a href="/profile/setup" style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'12px 28px', borderRadius:'10px', background:'#0A5F55', color:'#fff', textDecoration:'none', fontFamily:S.sans, fontWeight:600 }}>Complete Profile →</a>
      </div>
    </div>
  )

  const bodyFont = FONTS.includes(fontFamily) ? `"${fontFamily}",${fontFamily==='Plus Jakarta Sans'?'system-ui':'serif'}` : S.sans

  return (
    <div style={{ minHeight:'100vh', background:'#FDF6EC' }}>

      {/* ── Top bar ── */}
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(253,246,236,.97)', backdropFilter:'blur(20px)', borderBottom:'1.5px solid #EDE0C8', padding:'0 40px', height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'#7A6A52', textDecoration:'none', fontFamily:S.sans, fontWeight:500 }}>
            <ArrowLeft style={{ width:15, height:15 }} /> Back
          </Link>
          <div style={{ width:1, height:20, background:'#EDE0C8' }} />
          <span style={{ fontFamily:S.serif, fontSize:'18px', fontWeight:900, color:'#1A1208', letterSpacing:'-.3px' }}>Write a Post</span>
          <span style={{ fontFamily:'monospace', fontSize:'11px', color:'#7A6A52', background:'#EDE0C8', padding:'3px 10px', borderRadius:'100px' }}>
            {wordCount} words · {readTime} min read
          </span>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          <button onClick={() => setPreview(!preview)}
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'8px', border:'1.5px solid #EDE0C8', background:'transparent', color:'#1A1208', fontFamily:S.sans, fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
            {preview ? <AlignLeft style={{ width:14, height:14 }} /> : <Eye style={{ width:14, height:14 }} />}
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button onClick={() => mutation.mutate('draft')} disabled={mutation.isPending}
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'8px', border:'1.5px solid #EDE0C8', background:'transparent', color:'#7A6A52', fontFamily:S.sans, fontSize:'13px', fontWeight:500, cursor:'pointer' }}>
            <Save style={{ width:14, height:14 }} /> Save Draft
          </button>
          <button
            onClick={() => { if (!form.title || !form.content) { toast.error('Title and content are required'); return } mutation.mutate('pending') }}
            disabled={mutation.isPending}
            style={{ display:'flex', alignItems:'center', gap:'7px', padding:'9px 22px', borderRadius:'9px', background:'#0A5F55', color:'#fff', border:'none', fontFamily:S.sans, fontSize:'13px', fontWeight:700, cursor:'pointer', opacity:mutation.isPending?0.7:1 }}>
            {mutation.isPending ? <Loader2 style={{ width:14, height:14, animation:'spin 1s linear infinite' }} /> : <Send style={{ width:14, height:14 }} />}
            Submit for Review
          </button>
        </div>
      </div>

      <div style={{ maxWidth:'860px', margin:'0 auto', padding:'40px 24px 80px' }}>
        {!preview ? (
          <div>
            {/* Cover emoji */}
            <div style={{ marginBottom:'28px' }}>
              <div style={{ fontFamily:'monospace', fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' as const, color:'#7A6A52', marginBottom:'12px' }}>Cover</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => set('coverEmoji', e)}
                    style={{ width:44, height:44, borderRadius:'11px', fontSize:'22px', border: form.coverEmoji===e ? '2.5px solid #0A5F55' : '1.5px solid #EDE0C8', background: form.coverEmoji===e ? 'rgba(10,95,85,.07)' : '#fff', cursor:'pointer', transition:'all .15s', transform: form.coverEmoji===e ? 'scale(1.1)' : 'none' }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <textarea placeholder="Your post title..." value={form.title}
              onChange={e => set('title', e.target.value.slice(0,160))} rows={2}
              style={{ width:'100%', fontFamily:S.serif, fontSize:'clamp(32px,5vw,52px)', fontWeight:900, color:'#1A1208', letterSpacing:'-1.5px', lineHeight:1.12, border:'none', outline:'none', background:'transparent', resize:'none', marginBottom:'4px', boxSizing:'border-box' as const, display:'block' }} />
            <div style={{ fontFamily:'monospace', fontSize:'11px', color:'#A0907A', marginBottom:'16px', textAlign:'right' as const }}>{form.title.length}/160</div>

            {/* Excerpt */}
            <input placeholder="Short subtitle or teaser (optional)..."
              value={form.excerpt} onChange={e => set('excerpt', e.target.value.slice(0,280))}
              style={{ width:'100%', fontFamily:S.sans, fontSize:'19px', color:'#7A6A52', border:'none', borderBottom:'1.5px solid #EDE0C8', outline:'none', background:'transparent', marginBottom:'24px', fontWeight:300, padding:'0 0 12px 0', boxSizing:'border-box' as const }} />

            {/* Category + Tags */}
            <div style={{ display:'flex', gap:'12px', marginBottom:'24px', flexWrap:'wrap', padding:'16px 20px', background:'#fff', borderRadius:'14px', border:'1px solid #EDE0C8' }}>
              <div style={{ flex:1, minWidth:'150px' }}>
                <div style={{ fontFamily:'monospace', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase' as const, color:'#7A6A52', marginBottom:'6px' }}>Category *</div>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #EDE0C8', borderRadius:'9px', fontFamily:S.sans, fontSize:'14px', color:'#1A1208', background:'#FDF6EC', outline:'none', cursor:'pointer' }}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex:2, minWidth:'200px' }}>
                <div style={{ fontFamily:'monospace', fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase' as const, color:'#7A6A52', marginBottom:'6px' }}>Tags (comma separated)</div>
                <input value={form.tags} onChange={e => set('tags', e.target.value)}
                  placeholder="AI, EdTech, Teaching..."
                  style={{ width:'100%', padding:'9px 12px', border:'1.5px solid #EDE0C8', borderRadius:'9px', fontFamily:S.sans, fontSize:'14px', color:'#1A1208', background:'#FDF6EC', outline:'none' }} />
              </div>
            </div>

            {/* ── Formatting toolbar ── */}
            <div style={{ background:'#fff', border:'1.5px solid #EDE0C8', borderRadius:'12px 12px 0 0', padding:'10px 16px', display:'flex', gap:'4px', flexWrap:'wrap', alignItems:'center', borderBottom:'1px solid #EDE0C8' }}>
              {/* Format buttons */}
              {[
                { icon:<Bold style={{ width:14, height:14 }} />, label:'Bold', prefix:'**', suffix:'**', ph:'bold text' },
                { icon:<Italic style={{ width:14, height:14 }} />, label:'Italic', prefix:'_', suffix:'_', ph:'italic text' },
                { icon:<Quote style={{ width:14, height:14 }} />, label:'Quote', prefix:'\n> ', suffix:'', ph:'quote' },
                { icon:<List style={{ width:14, height:14 }} />, label:'List', prefix:'\n• ', suffix:'', ph:'list item' },
                { icon:<Hash style={{ width:14, height:14 }} />, label:'Heading', prefix:'\n## ', suffix:'', ph:'heading' },
              ].map(btn => (
                <button key={btn.label} onClick={() => insertFormat(btn.prefix, btn.suffix, btn.ph)} title={btn.label}
                  style={{ display:'flex', alignItems:'center', gap:'4px', padding:'6px 10px', borderRadius:'7px', border:'1px solid #EDE0C8', background:'transparent', color:'#1A1208', cursor:'pointer', fontSize:'12px', fontFamily:S.sans, fontWeight:500, transition:'all .15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='#FDF6EC'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='transparent'}>
                  {btn.icon} {btn.label}
                </button>
              ))}

              <div style={{ width:1, height:20, background:'#EDE0C8', margin:'0 4px' }} />

              {/* Font family */}
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <Type style={{ width:13, height:13, color:'#7A6A52' }} />
                <select value={fontFamily} onChange={e => setFontFamily(e.target.value)}
                  style={{ border:'1px solid #EDE0C8', borderRadius:'7px', padding:'5px 8px', fontSize:'12px', fontFamily:S.sans, color:'#1A1208', background:'#FDF6EC', outline:'none', cursor:'pointer' }}>
                  {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {/* Font size */}
              <select value={fontSize} onChange={e => setFontSize(e.target.value)}
                style={{ border:'1px solid #EDE0C8', borderRadius:'7px', padding:'5px 8px', fontSize:'12px', fontFamily:S.sans, color:'#1A1208', background:'#FDF6EC', outline:'none', cursor:'pointer' }}>
                {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              {/* Line height */}
              <select value={lineHeight} onChange={e => setLineHeight(e.target.value)}
                style={{ border:'1px solid #EDE0C8', borderRadius:'7px', padding:'5px 8px', fontSize:'12px', fontFamily:S.sans, color:'#1A1208', background:'#FDF6EC', outline:'none', cursor:'pointer' }}>
                {LINE_HEIGHTS.map(l => <option key={l} value={l}>LH {l}</option>)}
              </select>
            </div>

            {/* Content textarea */}
            <textarea
              ref={contentRef}
              placeholder={`Start writing your post...\n\nShare your experiences, insights, and ideas with India's education community.\n\nTips:\n• Use **bold** for emphasis\n• Use _italic_ for terms\n• Use > for quotes\n• Use ## for headings\n• Use • for bullet points`}
              value={form.content} onChange={e => set('content', e.target.value)}
              style={{ width:'100%', minHeight:'520px', fontFamily:`"${fontFamily}",${fontFamily.includes('Garamond')||fontFamily==='Georgia'?'serif':'system-ui,sans-serif'}`, fontSize, color:'#1A1208', lineHeight, border:'1.5px solid #EDE0C8', borderTop:'none', borderRadius:'0 0 12px 12px', outline:'none', background:'#fff', resize:'vertical', fontWeight:300, boxSizing:'border-box' as const, padding:'20px 24px' }} />
          </div>
        ) : (
          /* Preview */
          <div style={{ background:'#fff', borderRadius:'20px', border:'1px solid #EDE0C8', overflow:'hidden' }}>
            <div style={{ padding:'32px 40px', borderBottom:'1px solid #EDE0C8' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'20px' }}>
                <span style={{ fontSize:'52px' }}>{form.coverEmoji}</span>
                <div>
                  <span style={{ display:'block', fontSize:'11px', fontWeight:700, color:'#0A5F55', background:'rgba(10,95,85,.08)', border:'1px solid rgba(10,95,85,.2)', borderRadius:'6px', padding:'3px 10px', marginBottom:'6px', fontFamily:'monospace', letterSpacing:'1px', textTransform:'uppercase' as const }}>{form.category}</span>
                  <span style={{ fontSize:'12px', color:'#7A6A52', fontFamily:'monospace' }}>{readTime} min read · {wordCount} words</span>
                </div>
              </div>
              <h1 style={{ fontFamily:S.serif, fontSize:'clamp(28px,4vw,44px)', fontWeight:900, color:'#1A1208', lineHeight:1.1, letterSpacing:'-1.5px', marginBottom:'14px' }}>
                {form.title || <span style={{ color:'#A0907A' }}>Your title here...</span>}
              </h1>
              {form.excerpt && (
                <p style={{ fontSize:'19px', color:'#7A6A52', lineHeight:1.65, fontWeight:300, fontFamily:S.sans, borderLeft:'3px solid #0A5F55', paddingLeft:'16px', margin:'0' }}>
                  {form.excerpt}
                </p>
              )}
            </div>
            <div style={{ padding:'32px 40px' }}>
              <div style={{ fontFamily:`"${fontFamily}",${fontFamily.includes('Garamond')||fontFamily==='Georgia'?'serif':'system-ui,sans-serif'}`, fontSize, color:'#1A1208', lineHeight, whiteSpace:'pre-wrap', fontWeight:300 }}>
                {form.content || <span style={{ color:'#A0907A' }}>Your content will appear here...</span>}
              </div>
              {form.tags && (
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'32px', paddingTop:'24px', borderTop:'1px solid #EDE0C8' }}>
                  {form.tags.split(',').filter(t=>t.trim()).map(t => (
                    <span key={t} style={{ padding:'5px 14px', borderRadius:'100px', background:'#EDE0C8', fontSize:'12px', color:'#1A1208', fontFamily:S.sans }}>{t.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
