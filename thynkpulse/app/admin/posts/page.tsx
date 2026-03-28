'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { apiGet, apiPut, apiDelete } from '@/lib/api'
import { Search, Eye, CheckCircle, XCircle, Trash2, Star, Pencil, X, Save, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import toast from 'react-hot-toast'

const TABS = ['pending', 'approved', 'rejected', 'draft']
const CATEGORIES = ['Educator','EdTech','Sales & Marketing','Innovation','Leadership','Career','Research','Other']

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending:  { bg: 'rgba(201,146,42,.12)',  color: 'var(--gold)',  label: 'Pending'  },
  approved: { bg: 'rgba(10,95,85,.10)',    color: 'var(--teal)',  label: 'Approved' },
  rejected: { bg: 'rgba(232,81,42,.10)',   color: 'var(--coral)', label: 'Rejected' },
  draft:    { bg: 'rgba(122,106,82,.10)',  color: 'var(--muted)', label: 'Draft'    },
}

const cell: React.CSSProperties = { padding: '12px 14px', fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--ink)', borderBottom: '1px solid var(--border2)' }
const hdCell: React.CSSProperties = { padding: '10px 14px', fontSize: '10px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border)', background: 'var(--cream2)', whiteSpace: 'nowrap' }
const inp: React.CSSProperties = { width: '100%', padding: '10px 13px', border: '1.5px solid var(--parchment)', borderRadius: '9px', fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--ink)', outline: 'none', background: '#fff', boxSizing: 'border-box' }
const lbl: React.CSSProperties = { display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'var(--font-mono)' }

interface Post {
  id: string; slug: string; title: string; excerpt: string; content: string
  coverEmoji: string; category: string; tags: string[]; status: string
  readTime: number; isFeatured: boolean; author: { fullName: string; designation: string }
  createdAt: string
}

function EditModal({ post, onClose, onSave }: { post: Post; onClose: () => void; onSave: (data: Partial<Post>) => void }) {
  const [form, setForm] = useState({
    title:      post.title      || '',
    excerpt:    post.excerpt    || '',
    content:    post.content    || '',
    coverEmoji: post.coverEmoji || '📝',
    category:   post.category   || 'Other',
    readTime:   post.readTime   || 1,
    status:     post.status     || 'pending',
  })
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(26,18,8,0.6)', backdropFilter: 'blur(4px)', padding: '20px' }}>
      <motion.div initial={{ opacity: 0, scale: .96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }}
        style={{ width: '100%', maxWidth: '760px', background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(26,18,8,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 900, color: 'var(--ink)' }}>Edit Post</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>by {post.author?.fullName}</div>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: '9px', border: '1.5px solid var(--parchment)', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--muted)' }}>
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>
        <div style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flexShrink: 0 }}>
              <label style={lbl}>Emoji</label>
              <input value={form.coverEmoji} onChange={e => set('coverEmoji', e.target.value)}
                style={{ ...inp, width: '70px', textAlign: 'center', fontSize: '22px', padding: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={lbl}>Title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Post title..." style={inp} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '12px' }}>
            <div>
              <label style={lbl}>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} style={inp}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} style={inp}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Read Time</label>
              <input type="number" min={1} max={60} value={form.readTime} onChange={e => set('readTime', Number(e.target.value))}
                style={{ ...inp, textAlign: 'center' }} />
            </div>
          </div>
          <div>
            <label style={lbl}>Excerpt / Summary</label>
            <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
              placeholder="Short summary shown on cards..." rows={2}
              style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
          </div>
          <div>
            <label style={lbl}>Full Content</label>
            <textarea value={form.content} onChange={e => set('content', e.target.value)}
              placeholder="Full post content..." rows={10}
              style={{ ...inp, resize: 'vertical', lineHeight: 1.8, fontFamily: 'var(--font-sans)', fontSize: '13px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px 24px', borderTop: '1px solid var(--border)', flexShrink: 0, background: 'var(--cream)' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '9px', border: '1.5px solid var(--parchment)', background: '#fff', color: 'var(--muted)', cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
            Cancel
          </button>
          <button onClick={() => onSave(form)}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 22px', borderRadius: '9px', border: 'none', background: 'var(--teal)', color: '#fff', cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--font-sans)', fontWeight: 600, boxShadow: '0 4px 14px rgba(10,95,85,.25)' }}>
            <Save style={{ width: 14, height: 14 }} /> Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminPostsPage() {
  const qc = useQueryClient()
  const [tab,      setTab]      = useState('approved')
  const [search,   setSearch]   = useState('')
  const [page,     setPage]     = useState(1)
  const [editPost, setEditPost] = useState<Post | null>(null)
  const [seeding,  setSeeding]  = useState(false)
  const [seeded,   setSeeded]   = useState(false)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-posts', tab, search, page],
    queryFn: () => apiGet(`/admin/posts?status=${tab}&search=${search}&page=${page}&limit=20`),
    staleTime: 0,
    retry: false,
  })

  useEffect(() => {
    if (!isLoading && !isError && data?.total === 0 && !seeded) {
      setSeeded(true)
      setSeeding(true)
      const token = typeof window !== 'undefined' ? localStorage.getItem('tp_token') : ''
      fetch('/api/admin/seed', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => { toast.success(d.message || 'Posts seeded!'); refetch() })
        .catch(() => {})
        .finally(() => setSeeding(false))
    }
  }, [isLoading, isError, data, seeded, refetch])

  const posts = data?.data  || []
  const total = data?.total || 0

  const updateMutation = useMutation({
    mutationFn: ({ id, ...body }: any) => apiPut(`/admin/posts/${id}`, body),
    onSuccess: () => { toast.success('Post updated!'); setEditPost(null); qc.invalidateQueries({ queryKey: ['admin-posts'] }); qc.invalidateQueries({ queryKey: ['admin-overview'] }) },
    onError: () => toast.error('Update failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/posts/${id}`),
    onSuccess: () => { toast.success('Post deleted'); qc.invalidateQueries({ queryKey: ['admin-posts'] }) },
    onError: () => toast.error('Delete failed'),
  })

  return (
    <AdminLayout title="Posts Manager" subtitle="Review, edit, approve and manage all community posts">

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
        {TABS.map((t, i) => (
          <motion.div key={t} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*.06 }}
            onClick={() => { setTab(t); setPage(1) }}
            style={{ background: tab===t ? STATUS_STYLE[t].bg : '#fff', border: `2px solid ${tab===t ? STATUS_STYLE[t].color : 'var(--border)'}`, borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'all .15s' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '28px', color: STATUS_STYLE[t].color, lineHeight: 1, marginBottom: '4px' }}>
              {tab === t ? total : '—'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>
              {STATUS_STYLE[t].label}
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flex: 1, background: 'var(--cream)', border: '1.5px solid var(--parchment)', borderRadius: '8px', padding: '7px 11px' }}>
            <Search style={{ width: 13, height: 13, color: 'var(--muted)', flexShrink: 0 }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by title, author, category..."
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: '13px', fontFamily: 'var(--font-sans)', color: 'var(--ink)', flex: 1 }} />
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            {TABS.map(t => (
              <button key={t} onClick={() => { setTab(t); setPage(1) }}
                style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-sans)', transition: 'all .15s',
                  background: tab===t ? STATUS_STYLE[t].color : 'var(--cream2)',
                  color: tab===t ? '#fff' : 'var(--muted)' }}>
                {STATUS_STYLE[t].label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Post', 'Author', 'Category', 'Read Time', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} style={hdCell}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}><td colSpan={7} style={{ padding: '10px 14px' }}>
                      <div style={{ height: '40px', background: 'var(--cream)', borderRadius: '8px' }} />
                    </td></tr>
                  ))
                : posts.length === 0
                  ? <tr><td colSpan={7} style={{ ...cell, textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
                      {seeding ? '⏳ Loading posts from database...' : `No ${tab} posts found.`}
                    </td></tr>
                  : posts.map((p: Post) => {
                      const s = STATUS_STYLE[p.status] || STATUS_STYLE.pending
                      return (
                        <tr key={p.id}
                          onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--cream)'}
                          onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                          <td style={{ ...cell, maxWidth: '260px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'var(--cream2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                                {p.coverEmoji || '📝'}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.excerpt?.slice(0, 55)}...</div>
                              </div>
                            </div>
                          </td>
                          <td style={cell}>
                            <div style={{ fontWeight: 500 }}>{p.author?.fullName || '—'}</div>
                            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{p.author?.designation}</div>
                          </td>
                          <td style={cell}>
                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '100px', background: 'rgba(10,95,85,.08)', color: 'var(--teal)' }}>
                              {p.category}
                            </span>
                          </td>
                          <td style={{ ...cell, color: 'var(--muted)', fontSize: '12px' }}>{p.readTime} min</td>
                          <td style={{ ...cell, fontSize: '11px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                            {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'}
                          </td>
                          <td style={cell}>
                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '100px', background: s.bg, color: s.color }}>
                              {s.label}
                            </span>
                          </td>
                          <td style={cell}>
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                              <Link href={`/post/${p.slug}`} target="_blank"
                                style={{ padding: '5px 8px', borderRadius: '6px', background: 'var(--cream2)', border: '1px solid var(--border)', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none', fontSize: '11px', fontWeight: 500 }}>
                                <Eye style={{ width: 12, height: 12 }} /> View
                              </Link>
                              <button onClick={() => setEditPost(p)}
                                style={{ padding: '5px 8px', borderRadius: '6px', background: 'rgba(201,146,42,.08)', border: '1px solid rgba(201,146,42,.2)', color: 'var(--gold)', cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Pencil style={{ width: 11, height: 11 }} /> Edit
                              </button>
                              {p.status !== 'approved' && (
                                <button onClick={() => updateMutation.mutate({ id: p.id, status: 'approved' })}
                                  style={{ padding: '5px 8px', borderRadius: '6px', background: 'rgba(10,95,85,.08)', border: '1px solid rgba(10,95,85,.15)', color: 'var(--teal)', cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <CheckCircle style={{ width: 11, height: 11 }} /> Approve
                                </button>
                              )}
                              {p.status !== 'rejected' && (
                                <button onClick={() => { const reason = prompt('Reason for rejection (optional):'); updateMutation.mutate({ id: p.id, status: 'rejected', rejectionReason: reason || '' }) }}
                                  style={{ padding: '5px 8px', borderRadius: '6px', background: 'rgba(232,81,42,.06)', border: '1px solid rgba(232,81,42,.15)', color: 'var(--coral)', cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <XCircle style={{ width: 11, height: 11 }} /> Reject
                                </button>
                              )}
                              <button onClick={() => { if (confirm('Delete this post permanently?')) deleteMutation.mutate(p.id) }}
                                style={{ padding: '5px 7px', borderRadius: '6px', background: 'rgba(232,81,42,.06)', border: '1px solid rgba(232,81,42,.12)', color: 'var(--coral)', cursor: 'pointer', display: 'flex' }}>
                                <Trash2 style={{ width: 12, height: 12 }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
              }
            </tbody>
          </table>
        </div>

        {total > 20 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>
              {((page-1)*20)+1}–{Math.min(page*20, total)} of {total} posts
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                style={{ padding: '6px 13px', borderRadius: '8px', background: 'var(--cream2)', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer', fontSize: '12px', opacity: page===1 ? .4 : 1 }}>
                ← Prev
              </button>
              <button onClick={() => setPage(p => p+1)} disabled={page*20>=total}
                style={{ padding: '6px 13px', borderRadius: '8px', background: 'var(--cream2)', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer', fontSize: '12px', opacity: page*20>=total ? .4 : 1 }}>
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editPost && (
          <EditModal
            post={editPost}
            onClose={() => setEditPost(null)}
            onSave={(formData) => updateMutation.mutate({ id: editPost.id, ...formData })}
          />
        )}
      </AnimatePresence>

    </AdminLayout>
  )
}
