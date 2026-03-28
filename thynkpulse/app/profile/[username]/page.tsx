'use client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Twitter, Linkedin } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { apiGet } from '@/lib/api'
import { UserProfile, Post } from '@/types'
import { useAuthStore } from '@/store/authStore'

const GRADIENTS = ['linear-gradient(135deg,#EAF4F0,#C0E6DC)','linear-gradient(135deg,#FEF0EA,#F7CBB8)','linear-gradient(135deg,#EFF0FE,#C9CDF7)','linear-gradient(135deg,#FEF8E8,#F5DFA0)','linear-gradient(135deg,#F5EEF8,#DEC8F0)']

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { user: me } = useAuthStore()

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ['profile', username],
    queryFn: () => apiGet(`/users/${username}/profile`),
    staleTime: 5 * 60 * 1000,
  })

  const { data: postsData } = useQuery<{ data: Post[] }>({
    queryKey: ['user-posts', username],
    queryFn: () => apiGet(`/posts?authorId=${profile?.userId}&status=approved&limit=20`),
    enabled: !!profile?.userId,
    staleTime: 3 * 60 * 1000,
  })

  const posts = postsData?.data || []
  const initials = profile?.fullName?.split(' ').map(n=>n[0]).join('').slice(0,2) || 'U'
  const isMe = me?.id === profile?.userId

  if (profileLoading) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth:'900px', margin:'100px auto', padding:'0 20px', display:'flex', flexDirection:'column', gap:'16px' }}>
          {[80,20,20,200,16,16].map((h,i) => <div key={i} className="skeleton" style={{ height:h }} />)}
        </div>
        <Footer />
      </>
    )
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign:'center', padding:'120px 20px' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'24px', color:'var(--ink)' }}>Profile not found</div>
          <Link href="/" className="btn-teal" style={{ marginTop:'16px', display:'inline-flex' }}>← Back to Feed</Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main style={{ background:'var(--cream)', paddingTop:'80px' }}>
        {/* Cover */}
        <div style={{ height:'160px', background:'linear-gradient(135deg,var(--teal),var(--teal3))', position:'relative' }} />

        <div style={{ maxWidth:'900px', margin:'0 auto', padding:'0 20px 80px' }}>
          {/* Profile header */}
          <div style={{ background:'#fff', borderRadius:'var(--radius-xl)', border:'1px solid var(--border)', padding:'32px', marginTop:'-60px', position:'relative', marginBottom:'24px', boxShadow:'var(--shadow)' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'20px', flexWrap:'wrap' }}>
              <div className="avatar av-teal" style={{ width:80, height:80, fontSize:'30px', borderRadius:'50%', border:'4px solid #fff', flexShrink:0, overflow:'hidden' }}>
                {profile.avatarUrl
                  ? <img src={profile.avatarUrl} alt={profile.fullName} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : initials
                }
              </div>
              <div style={{ flex:1, minWidth:'200px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'12px', flexWrap:'wrap', marginBottom:'6px' }}>
                  <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'26px', fontWeight:900, color:'var(--ink)', letterSpacing:'-.5px' }}>{profile.fullName}</h1>
                  <span className="badge badge-teal" style={{ marginTop:'4px' }}>✓ Verified</span>
                </div>
                <div style={{ fontSize:'14px', color:'var(--muted)', marginBottom:'12px' }}>{profile.designation}{profile.companyName ? ` · ${profile.companyName}` : ''}{profile.instituteName ? ` · ${profile.instituteName}` : ''}</div>
                {profile.introduction && (
                  <p style={{ fontSize:'14px', color:'var(--ink2)', lineHeight:1.7, fontWeight:300, maxWidth:'560px' }}>{profile.introduction.slice(0,200)}{profile.introduction.length>200 ? '…' : ''}</p>
                )}
              </div>
              <div style={{ display:'flex', gap:'8px', flexShrink:0 }}>
                {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding:'8px 12px' }}><Linkedin style={{ width:15, height:15 }} /></a>}
                {profile.websiteUrl && <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding:'8px 12px' }}><ExternalLink style={{ width:15, height:15 }} /></a>}
                {isMe && <Link href="/profile/edit" className="btn-teal" style={{ padding:'9px 18px', fontSize:'13px' }}>Edit Profile</Link>}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginTop:'24px', paddingTop:'20px', borderTop:'1px solid var(--border)' }}>
              {[
                ['Posts',     String(profile.postCount)],
                ['Followers', profile.followerCount >= 1000 ? `${(profile.followerCount/1000).toFixed(1)}K` : String(profile.followerCount)],
                ['Reads',     profile.totalReads >= 1000 ? `${(profile.totalReads/1000).toFixed(0)}K` : String(profile.totalReads)],
                ['Exp.',      profile.totalExp || '—'],
              ].map(([l, n]) => (
                <div key={l} style={{ textAlign:'center', background:'var(--cream)', borderRadius:'12px', padding:'14px' }}>
                  <div style={{ fontFamily:'var(--font-serif)', fontSize:'24px', fontWeight:900, color:'var(--ink)', lineHeight:1 }}>{n}</div>
                  <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'3px' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Posts */}
          <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'22px', fontWeight:900, color:'var(--ink)', marginBottom:'16px' }}>Articles by {profile.fullName.split(' ')[0]}</h2>
          {posts.length === 0 ? (
            <div style={{ textAlign:'center', padding:'48px', background:'#fff', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)', color:'var(--muted)' }}>
              No published articles yet.
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {posts.map((post, i) => (
                <Link key={post.id} href={`/post/${post.slug}`}
                  style={{ display:'flex', gap:'20px', alignItems:'flex-start', background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'20px', textDecoration:'none', color:'inherit', transition:'all .25s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(10,95,85,.2)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'none' }}>
                  <div style={{ width:64, height:64, borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', background:GRADIENTS[i%GRADIENTS.length], flexShrink:0 }}>
                    {post.coverEmoji || '📝'}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:'8px', marginBottom:'5px' }}>
                      <span className="badge badge-teal" style={{ fontSize:'10px' }}>{post.category}</span>
                      <span style={{ fontSize:'11px', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{post.readTime} min read</span>
                    </div>
                    <div style={{ fontFamily:'var(--font-serif)', fontSize:'18px', fontWeight:600, color:'var(--ink)', lineHeight:1.3, marginBottom:'5px' }}>{post.title}</div>
                    {post.excerpt && <div style={{ fontSize:'13px', color:'var(--muted)', lineHeight:1.6, fontWeight:300 }}>{post.excerpt}</div>}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'4px', fontSize:'12px', color:'var(--muted)', flexShrink:0 }}>
                    <span>👁 {post.viewCount >= 1000 ? `${(post.viewCount/1000).toFixed(1)}K` : post.viewCount}</span>
                    <span>❤️ {post.likeCount}</span>
                    <span>💬 {post.commentCount}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
