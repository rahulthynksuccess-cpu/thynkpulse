'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, MessageSquare, Eye, Share2, Loader2, ArrowLeft, Send, Bookmark, Twitter, Linkedin } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { apiGet, apiPost } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { Post, Comment } from '@/types'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

const GRADIENTS = ['linear-gradient(135deg,#EAF4F0,#C0E6DC)','linear-gradient(135deg,#FEF0EA,#F7CBB8)','linear-gradient(135deg,#EFF0FE,#C9CDF7)','linear-gradient(135deg,#FEF8E8,#F5DFA0)']

function Avatar({ name, size=40, radius=10 }: { name:string; size?:number; radius?:number }) {
  const initials = name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || 'U'
  const colors = ['#0A5F55','#E8512A','#C9922A','#3D1F5E']
  const bg = colors[name?.charCodeAt(0) % 4 || 0]
  return (
    <div style={{ width:size, height:size, borderRadius:radius, background:bg, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.38, fontWeight:700, fontFamily:'var(--font-sans)', flexShrink:0 }}>
      {initials}
    </div>
  )
}

function CommentItem({ comment, postId, depth=0 }: { comment:Comment; postId:string; depth?:number }) {
  const { isAuthenticated } = useAuthStore()
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const qc = useQueryClient()
  const replyMutation = useMutation({
    mutationFn: () => apiPost('/comments', { postId, content: replyText, parentId: comment.id }),
    onSuccess: () => { setReplyText(''); setReplyOpen(false); qc.invalidateQueries({ queryKey: ['comments', postId] }); toast.success('Reply posted!') },
  })
  return (
    <div style={{ marginLeft: depth > 0 ? '44px' : 0, paddingLeft: depth > 0 ? '16px' : 0, borderLeft: depth > 0 ? '2px solid var(--border)' : 'none' }}>
      <div style={{ display:'flex', gap:'12px', marginBottom:'6px' }}>
        <Avatar name={comment.author?.fullName || 'User'} size={36} radius={10} />
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
            <span style={{ fontSize:'14px', fontWeight:600, color:'var(--ink)', fontFamily:'var(--font-sans)' }}>{comment.author?.fullName || 'User'}</span>
            <span style={{ fontSize:'11px', color:'var(--muted)', fontFamily:'var(--font-sans)' }}>
              {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix:true }) : 'just now'}
            </span>
          </div>
          <div style={{ fontSize:'15px', color:'var(--ink)', lineHeight:1.7, fontWeight:300, fontFamily:'var(--font-sans)' }}>{comment.content}</div>
          {isAuthenticated && depth === 0 && (
            <button onClick={() => setReplyOpen(!replyOpen)}
              style={{ fontSize:'12px', color:'var(--teal)', fontWeight:600, background:'none', border:'none', cursor:'pointer', marginTop:'6px', padding:0, fontFamily:'var(--font-sans)' }}>
              {replyOpen ? 'Cancel' : '↩ Reply'}
            </button>
          )}
        </div>
      </div>
      {replyOpen && (
        <div style={{ marginLeft:'48px', marginBottom:'12px', display:'flex', gap:'8px' }}>
          <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write a reply..."
            style={{ flex:1, padding:'9px 13px', border:'1.5px solid var(--parchment)', borderRadius:'var(--radius)', fontFamily:'var(--font-sans)', fontSize:'14px', outline:'none', color:'var(--ink)' }} />
          <button onClick={() => replyMutation.mutate()} disabled={!replyText.trim()} className="btn-teal" style={{ padding:'9px 14px' }}>
            {replyMutation.isPending ? <Loader2 style={{ width:13, height:13 }} /> : <Send style={{ width:13, height:13 }} />}
          </button>
        </div>
      )}
      {comment.replies?.map(r => <CommentItem key={r.id} comment={r} postId={postId} depth={depth+1} />)}
    </div>
  )
}

function PostCard({ post }: { post: Post }) {
  const idx = parseInt(post.id) % GRADIENTS.length
  return (
    <Link href={`/post/${post.slug}`} style={{ display:'flex', gap:'12px', textDecoration:'none', padding:'14px 0', borderBottom:'1px solid var(--border)' }}>
      <div style={{ width:52, height:52, borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', background:GRADIENTS[idx], flexShrink:0 }}>
        {post.coverEmoji || '📝'}
      </div>
      <div>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:'14px', fontWeight:700, color:'var(--ink)', lineHeight:1.35, marginBottom:'4px' }}>{post.title}</div>
        <div style={{ fontSize:'11px', color:'var(--muted)', fontFamily:'var(--font-sans)' }}>
          👁 {post.viewCount >= 1000 ? `${(post.viewCount/1000).toFixed(1)}K` : post.viewCount} · ❤️ {post.likeCount}
        </div>
      </div>
    </Link>
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

  // Other posts by same author
  const { data: authorPostsData } = useQuery<{ data: Post[] }>({
    queryKey: ['author-posts', post?.authorId],
    queryFn: () => apiGet(`/posts?authorId=${post?.authorId}&status=approved&limit=5`),
    enabled: !!post?.authorId,
    staleTime: 5 * 60 * 1000,
  })

  // Similar posts by category
  const { data: similarPostsData } = useQuery<{ data: Post[] }>({
    queryKey: ['similar-posts', post?.category],
    queryFn: () => apiGet(`/posts?category=${post?.category}&status=approved&limit=4`),
    enabled: !!post?.category,
    staleTime: 5 * 60 * 1000,
  })

  const authorPosts = (authorPostsData?.data || []).filter(p => p.slug !== slug).slice(0, 3)
  const similarPosts = (similarPostsData?.data || []).filter(p => p.slug !== slug).slice(0, 3)

  const commentMutation = useMutation({
    mutationFn: () => apiPost('/comments', { postId: post?.id, content: commentText }),
    onSuccess: () => { setCommentText(''); qc.invalidateQueries({ queryKey: ['comments', post?.id] }); toast.success('Comment posted!') },
    onError: () => toast.error('Please sign in to comment'),
  })

  if (isLoading) return (
    <>
      <Navbar />
      <div style={{ maxWidth:'1200px', margin:'100px auto', padding:'0 24px', display:'grid', gridTemplateColumns:'1fr 320px', gap:'48px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {[48,20,400,16,16,16].map((h,i) => <div key={i} className="skeleton" style={{ height:h }} />)}
        </div>
        <div className="skeleton" style={{ height:300, borderRadius:12 }} />
      </div>
      <Footer />
    </>
  )

  if (!post) return (
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

  const initials = post.author?.fullName?.split(' ').map(n=>n[0]).join('').slice(0,2) || 'U'
  const viewStr = post.viewCount >= 1000 ? `${(post.viewCount/1000).toFixed(1)}K` : String(post.viewCount)

  return (
    <>
      <Navbar />
      <main style={{ background:'var(--cream)', paddingTop:'80px', minHeight:'100vh' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'40px 24px 80px', display:'grid', gridTemplateColumns:'1fr 300px', gap:'56px', alignItems:'start' }}>

          {/* LEFT — Article */}
          <article>
            {/* Breadcrumb */}
            <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'var(--muted)', textDecoration:'none', fontFamily:'var(--font-sans)', marginBottom:'28px' }}>
              <ArrowLeft style={{ width:14, height:14 }} /> Back to Feed
            </Link>

            {/* Category + meta */}
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
              <span className="badge badge-teal" style={{ fontSize:'11px' }}>{post.category}</span>
              <span style={{ fontSize:'12px', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{post.readTime} min read</span>
              {post.isFeatured && <span className="badge badge-coral" style={{ fontSize:'11px' }}>✦ Featured</span>}
            </div>

            {/* Title */}
            <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(30px,4vw,var(--post-page-title-size,48px))', fontWeight:900, color:'var(--post-page-title-color,var(--ink))', lineHeight:1.1, letterSpacing:'-1.5px', marginBottom:'18px' }}>
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p style={{ fontSize:'20px', color:'var(--muted)', lineHeight:1.65, marginBottom:'28px', fontWeight:300, fontFamily:'var(--font-sans)', borderLeft:'3px solid var(--teal)', paddingLeft:'18px' }}>
                {post.excerpt}
              </p>
            )}

            {/* Author row */}
            <div style={{ display:'flex', alignItems:'center', gap:'14px', padding:'18px 0', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', marginBottom:'40px' }}>
              <Avatar name={post.author?.fullName || 'Author'} size={48} radius={13} />
              <div style={{ flex:1 }}>
                <Link href={`/profile/${post.authorId}`} style={{ fontSize:'15px', fontWeight:700, color:'var(--ink)', textDecoration:'none', fontFamily:'var(--font-sans)' }}>
                  {post.author?.fullName || 'Author'}
                </Link>
                <div style={{ fontSize:'12px', color:'var(--muted)', marginTop:'2px', fontFamily:'var(--font-sans)' }}>
                  {post.author?.designation}{post.publishedAt ? ` · ${formatDistanceToNow(new Date(post.publishedAt), { addSuffix:true })}` : ''}
                </div>
              </div>
              <div style={{ display:'flex', gap:'16px', fontSize:'13px', color:'var(--muted)', fontFamily:'var(--font-sans)', fontWeight:500 }}>
                <span style={{ display:'flex', alignItems:'center', gap:'4px' }}><Eye style={{ width:13, height:13 }} /> {viewStr}</span>
                <span style={{ display:'flex', alignItems:'center', gap:'4px' }}><Heart style={{ width:13, height:13 }} /> {post.likeCount + (liked ? 1 : 0)}</span>
                <span style={{ display:'flex', alignItems:'center', gap:'4px' }}><MessageSquare style={{ width:13, height:13 }} /> {post.commentCount}</span>
              </div>
            </div>

            {/* Article body */}
            <div style={{
              fontSize:'var(--post-page-body-size,17px)',
              color:'var(--post-page-body-color,var(--ink))',
              lineHeight:1.9,
              fontWeight:'var(--post-page-body-weight,300)' as any,
              fontFamily:'var(--font-sans)',
              whiteSpace:'pre-wrap',
              marginBottom:'48px',
            }}>
              {post.content}
            </div>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'36px' }}>
                {post.tags.map(t => <span key={t} className="topic-tag">{t}</span>)}
              </div>
            )}

            {/* Action bar */}
            <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'18px 20px', background:'#fff', borderRadius:'16px', border:'1px solid var(--border)', marginBottom:'48px', flexWrap:'wrap' }}>
              <button onClick={() => { if (!isAuthenticated) { toast.error('Sign in to like'); return } setLiked(!liked) }}
                style={{ display:'flex', alignItems:'center', gap:'7px', padding:'9px 18px', borderRadius:'var(--radius)', border:`1.5px solid ${liked ? 'var(--coral)' : 'var(--parchment)'}`, background: liked ? 'rgba(232,81,42,.06)' : 'transparent', color: liked ? 'var(--coral)' : 'var(--muted)', fontFamily:'var(--font-sans)', fontSize:'13px', fontWeight:600, cursor:'pointer', transition:'all .2s' }}>
                <Heart style={{ width:15, height:15, fill: liked ? 'var(--coral)' : 'none' }} /> {post.likeCount + (liked ? 1 : 0)} Likes
              </button>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}
                style={{ display:'flex', alignItems:'center', gap:'7px', padding:'9px 18px', borderRadius:'var(--radius)', border:'1.5px solid var(--parchment)', background:'transparent', color:'var(--muted)', fontFamily:'var(--font-sans)', fontSize:'13px', fontWeight:500, cursor:'pointer' }}>
                <Share2 style={{ width:14, height:14 }} /> Share
              </button>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window!=='undefined'?window.location.href:'')}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', gap:'7px', padding:'9px 14px', borderRadius:'var(--radius)', border:'1.5px solid var(--parchment)', background:'transparent', color:'var(--muted)', fontSize:'13px', textDecoration:'none' }}>
                <Twitter style={{ width:14, height:14 }} />
              </a>
              <Link href="/write" className="btn-teal" style={{ marginLeft:'auto', padding:'9px 20px', fontSize:'13px' }}>✍️ Write a Post</Link>
            </div>

            {/* Comments */}
            <div>
              <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'24px', fontWeight:900, color:'var(--ink)', marginBottom:'24px', display:'flex', alignItems:'center', gap:'8px' }}>
                <MessageSquare style={{ width:20, height:20, color:'var(--teal)' }} />
                {(comments?.length || 0) + post.commentCount} Comments
              </h3>

              {isAuthenticated ? (
                <div style={{ display:'flex', gap:'12px', marginBottom:'32px' }}>
                  <Avatar name="You" size={38} radius={10} />
                  <div style={{ flex:1, display:'flex', gap:'8px' }}>
                    <textarea value={commentText} onChange={e => setCommentText(e.target.value)}
                      placeholder="Share your thoughts on this post..." rows={3}
                      style={{ flex:1, padding:'12px 14px', border:'1.5px solid var(--parchment)', borderRadius:'12px', fontFamily:'var(--font-sans)', fontSize:'14px', color:'var(--ink)', outline:'none', resize:'vertical', lineHeight:1.65, fontWeight:300 }} />
                    <button onClick={() => commentMutation.mutate()} disabled={!commentText.trim() || commentMutation.isPending}
                      className="btn-teal" style={{ padding:'12px 16px', alignSelf:'flex-end', flexShrink:0 }}>
                      {commentMutation.isPending ? <Loader2 style={{ width:15, height:15 }} /> : <Send style={{ width:15, height:15 }} />}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding:'18px', background:'rgba(10,95,85,.04)', borderRadius:'12px', border:'1px solid rgba(10,95,85,.12)', marginBottom:'28px', textAlign:'center' }}>
                  <span style={{ fontSize:'14px', color:'var(--muted)', fontFamily:'var(--font-sans)' }}>
                    <Link href="/login" style={{ color:'var(--teal)', fontWeight:600, textDecoration:'none' }}>Sign in</Link> to join the conversation
                  </span>
                </div>
              )}

              <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                {comments?.map(c => <CommentItem key={c.id} comment={c} postId={post.id} />)}
                {(!comments || comments.length === 0) && (
                  <div style={{ textAlign:'center', padding:'40px', color:'var(--muted)', fontSize:'14px', fontFamily:'var(--font-sans)' }}>
                    No comments yet. Be the first to share your thoughts!
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* RIGHT — Sidebar */}
          <aside style={{ position:'sticky', top:'100px', display:'flex', flexDirection:'column', gap:'24px' }}>

            {/* Author card */}
            <div style={{ background:'#fff', borderRadius:'16px', border:'1px solid var(--border)', padding:'20px' }}>
              <div style={{ display:'flex', gap:'12px', alignItems:'center', marginBottom:'12px' }}>
                <Avatar name={post.author?.fullName || 'Author'} size={44} radius={12} />
                <div>
                  <Link href={`/profile/${post.authorId}`} style={{ fontSize:'14px', fontWeight:700, color:'var(--ink)', textDecoration:'none', fontFamily:'var(--font-sans)' }}>
                    {post.author?.fullName}
                  </Link>
                  <div style={{ fontSize:'12px', color:'var(--muted)', fontFamily:'var(--font-sans)' }}>{post.author?.designation}</div>
                </div>
              </div>
              <Link href={`/profile/${post.authorId}`} className="btn-outline" style={{ width:'100%', textAlign:'center' as const, justifyContent:'center', fontSize:'13px', padding:'8px' }}>
                View Profile
              </Link>
            </div>

            {/* More from author */}
            {authorPosts.length > 0 && (
              <div style={{ background:'#fff', borderRadius:'16px', border:'1px solid var(--border)', padding:'20px' }}>
                <h4 style={{ fontFamily:'var(--font-serif)', fontSize:'15px', fontWeight:900, color:'var(--ink)', marginBottom:'4px' }}>
                  More from {post.author?.fullName?.split(' ')[0]}
                </h4>
                <div>
                  {authorPosts.map(p => <PostCard key={p.id} post={p} />)}
                </div>
              </div>
            )}

            {/* Similar posts */}
            {similarPosts.length > 0 && (
              <div style={{ background:'#fff', borderRadius:'16px', border:'1px solid var(--border)', padding:'20px' }}>
                <h4 style={{ fontFamily:'var(--font-serif)', fontSize:'15px', fontWeight:900, color:'var(--ink)', marginBottom:'4px' }}>
                  Similar in {post.category}
                </h4>
                <div>
                  {similarPosts.map(p => <PostCard key={p.id} post={p} />)}
                </div>
              </div>
            )}

            {/* Share box */}
            <div style={{ background:'linear-gradient(135deg,var(--teal),#0D7A6D)', borderRadius:'16px', padding:'20px', color:'#fff', textAlign:'center' as const }}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:'16px', fontWeight:900, marginBottom:'6px' }}>Share this Article</div>
              <div style={{ fontSize:'12px', opacity:.75, fontFamily:'var(--font-sans)', marginBottom:'14px' }}>Help more educators find this</div>
              <div style={{ display:'flex', gap:'8px', justifyContent:'center' }}>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Copied!') }}
                  style={{ flex:1, padding:'9px', borderRadius:'8px', border:'1px solid rgba(255,255,255,.2)', background:'rgba(255,255,255,.1)', color:'#fff', fontSize:'12px', fontFamily:'var(--font-sans)', fontWeight:600, cursor:'pointer' }}>
                  📋 Copy Link
                </button>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window!=='undefined'?window.location.href:'')}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'9px 14px', borderRadius:'8px', border:'1px solid rgba(255,255,255,.2)', background:'rgba(255,255,255,.1)', color:'#fff', textDecoration:'none' }}>
                  <Linkedin style={{ width:14, height:14 }} />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
