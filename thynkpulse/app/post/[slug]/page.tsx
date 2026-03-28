'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, MessageSquare, Eye, Share2, Loader2, ArrowLeft, Send } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { apiGet, apiPost } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { Post, Comment } from '@/types'
import { AdSlot } from '@/components/ui/AdSlot'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

const GRADIENTS = ['linear-gradient(135deg,#EAF4F0,#C0E6DC)','linear-gradient(135deg,#FEF0EA,#F7CBB8)','linear-gradient(135deg,#EFF0FE,#C9CDF7)','linear-gradient(135deg,#FEF8E8,#F5DFA0)']

function CommentItem({ comment, postId, depth=0 }: { comment: Comment; postId: string; depth?: number }) {
  const { isAuthenticated } = useAuthStore()
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const qc = useQueryClient()

  const replyMutation = useMutation({
    mutationFn: () => apiPost('/comments', { postId, content: replyText, parentId: comment.id }),
    onSuccess: () => { setReplyText(''); setReplyOpen(false); qc.invalidateQueries({ queryKey: ['comments', postId] }); toast.success('Reply posted!') },
    onError: () => toast.error('Failed to post reply'),
  })

  const initials = comment.author?.fullName?.split(' ').map(n=>n[0]).join('').slice(0,2) || 'U'
  const avColors = ['av-teal','av-coral','av-gold','av-plum']
  const avColor = avColors[parseInt(comment.authorId) % 4]

  return (
    <div style={{ marginLeft: depth > 0 ? '32px' : 0, paddingLeft: depth > 0 ? '16px' : 0, borderLeft: depth > 0 ? '2px solid var(--border)' : 'none' }}>
      <div style={{ display:'flex', gap:'12px', marginBottom:'8px' }}>
        <div className={`avatar ${avColor}`} style={{ width:36, height:36, fontSize:'14px', borderRadius:'10px', flexShrink:0 }}>{initials}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'5px' }}>
            <span style={{ fontSize:'14px', fontWeight:600, color:'var(--ink)' }}>{comment.author?.fullName || 'User'}</span>
            <span style={{ fontSize:'11px', color:'var(--muted)' }}>
              {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix:true }) : 'just now'}
            </span>
          </div>
          <div style={{ fontSize:'14px', color:'var(--ink2)', lineHeight:1.65, fontWeight:300 }}>{comment.content}</div>
          {isAuthenticated && depth === 0 && (
            <button onClick={() => setReplyOpen(!replyOpen)}
              style={{ fontSize:'12px', color:'var(--teal)', fontWeight:600, background:'none', border:'none', cursor:'pointer', marginTop:'6px', padding:0, fontFamily:'var(--font-sans)' }}>
              {replyOpen ? 'Cancel' : 'Reply'}
            </button>
          )}
        </div>
      </div>
      {replyOpen && (
        <div style={{ marginLeft:'48px', marginBottom:'12px', display:'flex', gap:'8px' }}>
          <input value={replyText} onChange={e => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            style={{ flex:1, padding:'9px 13px', border:'1.5px solid var(--parchment)', borderRadius:'var(--radius)', fontFamily:'var(--font-sans)', fontSize:'13px', outline:'none' }} />
          <button onClick={() => replyMutation.mutate()} disabled={!replyText.trim() || replyMutation.isPending} className="btn-teal" style={{ padding:'9px 14px', fontSize:'13px' }}>
            {replyMutation.isPending ? <Loader2 style={{ width:13, height:13, animation:'spin 1s linear infinite' }} /> : <Send style={{ width:13, height:13 }} />}
          </button>
        </div>
      )}
      {comment.replies?.map(r => <CommentItem key={r.id} comment={r} postId={postId} depth={depth+1} />)}
    </div>
  )
}

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { isAuthenticated } = useAuthStore()
  const qc = useQueryClient()
  const [commentText, setCommentText] = useState('')
  const [liked, setLiked] = useState(false)

  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ['post', slug],
    queryFn: () => apiGet(`/posts/${slug}`),
    staleTime: 5 * 60 * 1000,
  })

  const { data: comments } = useQuery<Comment[]>({
    queryKey: ['comments', post?.id],
    queryFn: () => apiGet(`/comments?postId=${post?.id}`),
    enabled: !!post?.id,
    staleTime: 2 * 60 * 1000,
  })

  const commentMutation = useMutation({
    mutationFn: () => apiPost('/comments', { postId: post?.id, content: commentText }),
    onSuccess: () => { setCommentText(''); qc.invalidateQueries({ queryKey: ['comments', post?.id] }); toast.success('Comment posted!') },
    onError: () => toast.error('Please sign in to comment'),
  })

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth:'780px', margin:'100px auto', padding:'0 20px', display:'flex', flexDirection:'column', gap:'16px' }}>
          <div className="skeleton" style={{ height:40, width:'80%' }} />
          <div className="skeleton" style={{ height:20, width:'50%' }} />
          <div className="skeleton" style={{ height:300 }} />
          <div className="skeleton" style={{ height:16 }} />
          <div className="skeleton" style={{ height:16, width:'70%' }} />
        </div>
        <Footer />
      </>
    )
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign:'center', padding:'120px 20px' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'64px', color:'var(--parchment)' }}>404</div>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'24px', color:'var(--ink)', marginBottom:'16px' }}>Post not found</div>
          <Link href="/" className="btn-teal">← Back to Feed</Link>
        </div>
        <Footer />
      </>
    )
  }

  const gradIdx = parseInt(post.id) % GRADIENTS.length
  const initials = post.author?.fullName?.split(' ').map(n=>n[0]).join('').slice(0,2) || 'U'

  return (
    <>
      <Navbar />
      <main style={{ background:'var(--cream)', paddingTop:'80px' }}>
        {/* Hero cover */}
        <div style={{ height:'320px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'96px', background: GRADIENTS[gradIdx] }}>
          {post.coverEmoji || '📝'}
        </div>

        <div style={{ maxWidth:'780px', margin:'0 auto', padding:'48px 20px 80px' }}>
          <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'var(--muted)', textDecoration:'none', marginBottom:'24px' }}>
            <ArrowLeft style={{ width:14, height:14 }} /> Back to Feed
          </Link>

          {/* Category + read time */}
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
            <span className="badge badge-teal">{post.category}</span>
            <span style={{ fontSize:'12px', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{post.readTime} min read</span>
            {post.isFeatured && <span className="badge badge-coral">✦ Featured</span>}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(32px,5vw,52px)', fontWeight:900, color:'var(--ink)', lineHeight:1.08, letterSpacing:'-1.5px', marginBottom:'16px' }}>
            {post.title}
          </h1>
          {post.excerpt && (
            <p style={{ fontSize:'19px', color:'var(--muted)', lineHeight:1.65, marginBottom:'28px', fontWeight:300 }}>{post.excerpt}</p>
          )}

          {/* Author row */}
          <div style={{ display:'flex', alignItems:'center', gap:'14px', padding:'20px 0', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', marginBottom:'36px' }}>
            <div className="avatar av-teal" style={{ width:48, height:48, fontSize:'18px', borderRadius:'13px' }}>{initials}</div>
            <div>
              <Link href={`/profile/${post.authorId}`} style={{ fontSize:'15px', fontWeight:700, color:'var(--ink)', textDecoration:'none' }}>{post.author?.fullName || 'Author'}</Link>
              <div style={{ fontSize:'12px', color:'var(--muted)' }}>{post.author?.designation} · {post.publishedAt ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix:true }) : 'Recently'}</div>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', gap:'16px', fontSize:'13px', color:'var(--muted)' }}>
              <span>👁 {post.viewCount >= 1000 ? `${(post.viewCount/1000).toFixed(1)}K` : post.viewCount}</span>
              <span>❤️ {post.likeCount + (liked ? 1 : 0)}</span>
              <span>💬 {post.commentCount}</span>
            </div>
          </div>

          {/* Ad slot — top of article */}
          <AdSlot id={`post-top-${post.id}`} label="Sponsored" />

          {/* Content */}
          <div style={{ fontSize:'17px', color:'var(--ink2)', lineHeight:1.85, fontWeight:300, whiteSpace:'pre-wrap', marginBottom:'48px' }}>
            {post.content}
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'36px' }}>
              {post.tags.map(t => <span key={t} className="topic-tag">{t}</span>)}
            </div>
          )}

          {/* Action bar */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'20px', background:'#fff', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)', marginBottom:'48px' }}>
            <button onClick={() => { if (!isAuthenticated) { toast.error('Sign in to like'); return } setLiked(!liked) }}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 18px', borderRadius:'var(--radius)', border:`1.5px solid ${liked ? 'var(--coral)' : 'var(--parchment)'}`, background: liked ? 'rgba(232,81,42,.06)' : 'transparent', color: liked ? 'var(--coral)' : 'var(--muted)', fontFamily:'var(--font-sans)', fontSize:'13px', fontWeight:600, cursor:'pointer', transition:'all .2s' }}>
              <Heart style={{ width:15, height:15, fill: liked ? 'var(--coral)' : 'none' }} /> {post.likeCount + (liked ? 1 : 0)} Likes
            </button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 18px', borderRadius:'var(--radius)', border:'1.5px solid var(--parchment)', background:'transparent', color:'var(--muted)', fontFamily:'var(--font-sans)', fontSize:'13px', fontWeight:500, cursor:'pointer' }}>
              <Share2 style={{ width:14, height:14 }} /> Share
            </button>
            <Link href="/write" className="btn-teal" style={{ marginLeft:'auto', padding:'9px 18px', fontSize:'13px' }}>✍️ Write a Post</Link>
          </div>

          {/* Ad slot — bottom of article */}
          <AdSlot id={`post-bottom-${post.id}`} label="Advertisement" />

          {/* Comments */}
          <div>
            <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'24px', fontWeight:900, color:'var(--ink)', marginBottom:'24px', display:'flex', alignItems:'center', gap:'8px' }}>
              <MessageSquare style={{ width:22, height:22, color:'var(--teal)' }} />
              {(comments?.length || 0) + post.commentCount} Comments
            </h3>

            {/* Comment input */}
            {isAuthenticated ? (
              <div style={{ display:'flex', gap:'10px', marginBottom:'32px' }}>
                <div className="avatar av-teal" style={{ width:38, height:38, fontSize:'14px', borderRadius:'10px', flexShrink:0 }}>U</div>
                <div style={{ flex:1, display:'flex', gap:'8px' }}>
                  <textarea value={commentText} onChange={e => setCommentText(e.target.value)}
                    placeholder="Share your thoughts on this post..."
                    rows={3}
                    style={{ flex:1, padding:'11px 14px', border:'1.5px solid var(--parchment)', borderRadius:'var(--radius)', fontFamily:'var(--font-sans)', fontSize:'14px', color:'var(--ink)', outline:'none', resize:'vertical', lineHeight:1.6, fontWeight:300 }} />
                  <button onClick={() => commentMutation.mutate()} disabled={!commentText.trim() || commentMutation.isPending}
                    className="btn-teal" style={{ padding:'11px 16px', alignSelf:'flex-end', flexShrink:0 }}>
                    {commentMutation.isPending ? <Loader2 style={{ width:15, height:15, animation:'spin 1s linear infinite' }} /> : <Send style={{ width:15, height:15 }} />}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding:'18px', background:'rgba(10,95,85,.05)', borderRadius:'var(--radius)', border:'1px solid var(--border)', marginBottom:'28px', textAlign:'center' }}>
                <span style={{ fontSize:'14px', color:'var(--muted)' }}>
                  <Link href="/login" style={{ color:'var(--teal)', fontWeight:600, textDecoration:'none' }}>Sign in</Link> to join the conversation
                </span>
              </div>
            )}

            {/* Comment list */}
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
              {comments?.map(c => <CommentItem key={c.id} comment={c} postId={post.id} />)}
              {(!comments || comments.length === 0) && (
                <div style={{ textAlign:'center', padding:'40px', color:'var(--muted)', fontSize:'14px' }}>No comments yet. Be the first to share your thoughts!</div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
