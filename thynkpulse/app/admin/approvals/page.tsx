'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { apiGet, apiPut } from '@/lib/api'
import { CheckCircle, XCircle, Eye, Clock, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Post } from '@/types'

const GRADIENTS = ['linear-gradient(135deg,#EAF4F0,#C0E6DC)','linear-gradient(135deg,#FEF0EA,#F7CBB8)','linear-gradient(135deg,#EFF0FE,#C9CDF7)','linear-gradient(135deg,#FEF8E8,#F5DFA0)','linear-gradient(135deg,#F5EEF8,#DEC8F0)']

function PostPreviewModal({ post, onClose, onApprove, onReject, loading }: {
  post: Post; onClose: () => void
  onApprove: () => void; onReject: (reason: string) => void; loading: boolean
}) {
  const [rejectReason, setRejectReason] = useState('')
  const [showReject, setShowReject] = useState(false)

  return (
    <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(26,18,8,.7)', backdropFilter:'blur(4px)' }} onClick={onClose} />
      <motion.div initial={{ opacity:0, scale:.97 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:.97 }}
        style={{ background:'#fff', borderRadius:'20px', padding:'32px', width:'100%', maxWidth:'640px', maxHeight:'85vh', overflowY:'auto', position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
          <span style={{ fontSize:'36px' }}>{post.coverEmoji||'📝'}</span>
          <div>
            <span className="badge badge-coral" style={{ fontSize:'10px', marginBottom:'4px', display:'inline-block' }}>{post.category}</span>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--muted)', letterSpacing:'1px' }}>{post.readTime} min read</div>
          </div>
        </div>
        <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'26px', fontWeight:900, color:'var(--ink)', marginBottom:'8px', lineHeight:1.15 }}>{post.title}</h2>
        {post.excerpt && <p style={{ fontSize:'14px', color:'var(--muted)', lineHeight:1.65, marginBottom:'16px', fontWeight:300 }}>{post.excerpt}</p>}
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px', padding:'12px', background:'var(--cream)', borderRadius:'10px' }}>
          <div className="avatar av-teal" style={{ width:32, height:32, fontSize:'12px', borderRadius:'9px' }}>
            {post.author?.fullName?.split(' ').map(n=>n[0]).join('').slice(0,2)||'U'}
          </div>
          <div>
            <div style={{ fontSize:'13px', fontWeight:600, color:'var(--ink)' }}>{post.author?.fullName}</div>
            <div style={{ fontSize:'11px', color:'var(--muted)' }}>{post.author?.designation}</div>
          </div>
        </div>
        <div style={{ fontSize:'14px', color:'var(--ink2)', lineHeight:1.8, fontWeight:300, maxHeight:'280px', overflowY:'auto', padding:'16px', background:'var(--cream2)', borderRadius:'10px', marginBottom:'24px' }}>
          {post.content}
        </div>
        {post.tags?.length > 0 && (
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'20px' }}>
            {post.tags.map(t => <span key={t} className="topic-tag" style={{ fontSize:'11px' }}>{t}</span>)}
          </div>
        )}

        {showReject ? (
          <div>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (will be shown to the author)..."
              rows={3} style={{ width:'100%', padding:'11px 14px', border:'1.5px solid var(--parchment)', borderRadius:'var(--radius)', fontFamily:'var(--font-sans)', fontSize:'13px', outline:'none', marginBottom:'10px', resize:'vertical' }} />
            <div style={{ display:'flex', gap:'8px' }}>
              <button onClick={() => setShowReject(false)} className="btn-outline" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
              <button onClick={() => onReject(rejectReason)} disabled={loading||!rejectReason.trim()} className="btn-coral" style={{ flex:1, justifyContent:'center', display:'flex', alignItems:'center', gap:'6px' }}>
                {loading ? <Loader2 style={{ width:14, height:14, animation:'spin 1s linear infinite' }} /> : <XCircle style={{ width:14, height:14 }} />}Confirm Reject
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={onClose} className="btn-outline" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
            <button onClick={() => setShowReject(true)} disabled={loading} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'12px', borderRadius:'var(--radius)', background:'rgba(232,81,42,.08)', border:'1px solid rgba(232,81,42,.2)', color:'var(--coral)', cursor:'pointer', fontSize:'13px', fontWeight:600, fontFamily:'var(--font-sans)' }}>
              <XCircle style={{ width:15, height:15 }} /> Reject
            </button>
            <button onClick={onApprove} disabled={loading} style={{ flex:2, display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'12px', borderRadius:'var(--radius)', background:'var(--teal)', border:'none', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:600, fontFamily:'var(--font-sans)', opacity:loading?.7:1 }}>
              {loading ? <Loader2 style={{ width:14, height:14, animation:'spin 1s linear infinite' }} /> : <CheckCircle style={{ width:15, height:15 }} />} Approve & Publish
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function AdminApprovalsPage() {
  const qc = useQueryClient()
  const [preview, setPreview] = useState<Post|null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'pending'|'approved'|'rejected'>('pending')

  const { data, isLoading } = useQuery<{ data: Post[]; total: number }>({
    queryKey: ['admin-posts', statusFilter],
    queryFn: () => apiGet(`/admin/posts?status=${statusFilter}&limit=50`),
    staleTime: 1 * 60 * 1000,
  })
  const posts = data?.data || []

  const actionMutation = useMutation({
    mutationFn: ({ id, status, rejectionReason }: { id:string; status:string; rejectionReason?:string }) =>
      apiPut(`/admin/posts/${id}`, { status, rejectionReason }),
    onSuccess: (_, { status }) => {
      toast.success(status==='approved' ? '✅ Post approved and published!' : '❌ Post rejected.')
      qc.invalidateQueries({ queryKey: ['admin-posts'] })
      setPreview(null)
    },
    onError: () => toast.error('Action failed'),
    onSettled: () => setActionLoading(false),
  })

  const handleApprove = (id: string) => { setActionLoading(true); actionMutation.mutate({ id, status:'approved' }) }
  const handleReject  = (id: string, reason: string) => { setActionLoading(true); actionMutation.mutate({ id, status:'rejected', rejectionReason:reason }) }

  return (
    <AdminLayout title="Post Approvals" subtitle="Review and approve or reject submitted posts">

      {/* Status tabs */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
        {(['pending','approved','rejected'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            style={{ padding:'9px 20px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:600, fontFamily:'var(--font-sans)', textTransform:'capitalize', transition:'all .18s',
              background: statusFilter===s ? (s==='approved'?'var(--teal)':s==='rejected'?'var(--coral)':'var(--gold)') : 'var(--cream2)',
              color: statusFilter===s ? '#fff' : 'var(--muted)' }}>
            {s==='pending' && <Clock style={{ width:13, height:13, display:'inline', marginRight:5, verticalAlign:'middle' }} />}
            {s==='approved' && <CheckCircle style={{ width:13, height:13, display:'inline', marginRight:5, verticalAlign:'middle' }} />}
            {s==='rejected' && <XCircle style={{ width:13, height:13, display:'inline', marginRight:5, verticalAlign:'middle' }} />}
            {s} ({s===statusFilter ? (data?.total||0) : '…'})
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {Array.from({length:5}).map((_,i) => <div key={i} className="skeleton" style={{ height:80, borderRadius:'12px' }} />)}
        </div>
      ) : posts.length===0 ? (
        <div style={{ textAlign:'center', padding:'60px', background:'#fff', borderRadius:'14px', border:'1px solid var(--border)', color:'var(--muted)', fontSize:'14px' }}>
          {statusFilter==='pending' ? '🎉 All caught up — no pending posts!' : `No ${statusFilter} posts.`}
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {posts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.05 }}
              style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'14px', padding:'16px 20px', display:'flex', alignItems:'center', gap:'16px' }}>
              <div style={{ width:52, height:52, borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', background:GRADIENTS[i%GRADIENTS.length], flexShrink:0 }}>
                {post.coverEmoji||'📝'}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                  <span className="badge badge-teal" style={{ fontSize:'10px' }}>{post.category}</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--muted)' }}>{post.readTime} min read</span>
                </div>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'16px', fontWeight:700, color:'var(--ink)', lineHeight:1.25, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{post.title}</div>
                <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'3px' }}>by {post.author?.fullName} · {post.author?.designation}</div>
              </div>
              <div style={{ display:'flex', gap:'6px', flexShrink:0 }}>
                <button onClick={() => setPreview(post)} style={{ padding:'8px 14px', borderRadius:'8px', background:'var(--cream)', border:'1px solid var(--border)', color:'var(--muted)', cursor:'pointer', fontSize:'12px', fontFamily:'var(--font-sans)', fontWeight:500, display:'flex', alignItems:'center', gap:'4px' }}>
                  <Eye style={{ width:13, height:13 }} /> Review
                </button>
                {statusFilter==='pending' && (
                  <>
                    <button onClick={() => handleReject(post.id, 'Does not meet community guidelines')}
                      style={{ padding:'8px 14px', borderRadius:'8px', background:'rgba(232,81,42,.08)', border:'1px solid rgba(232,81,42,.2)', color:'var(--coral)', cursor:'pointer', fontSize:'12px', fontFamily:'var(--font-sans)', fontWeight:600, display:'flex', alignItems:'center', gap:'4px' }}>
                      <XCircle style={{ width:13, height:13 }} /> Reject
                    </button>
                    <button onClick={() => handleApprove(post.id)}
                      style={{ padding:'8px 14px', borderRadius:'8px', background:'var(--teal)', border:'none', color:'#fff', cursor:'pointer', fontSize:'12px', fontFamily:'var(--font-sans)', fontWeight:600, display:'flex', alignItems:'center', gap:'4px' }}>
                      <CheckCircle style={{ width:13, height:13 }} /> Approve
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {preview && (
          <PostPreviewModal
            post={preview}
            onClose={() => setPreview(null)}
            onApprove={() => handleApprove(preview.id)}
            onReject={(reason) => handleReject(preview.id, reason)}
            loading={actionLoading}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
