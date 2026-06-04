'use client'
export const dynamic = 'force-dynamic'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { ExternalLink, Linkedin, MapPin, BookOpen, Users, Eye, Zap, Heart, MessageSquare, Award } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { apiGet } from '@/lib/api'
import { UserProfile, Post } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { BadgeShelf, BadgeGrid, EliteTag, BadgeProgressBar } from '@/components/ui/BadgeDisplay'
import { BadgeDef, getNextBadge } from '@/lib/badges'

const GRADIENTS = ['linear-gradient(135deg,#EAF4F0,#C0E6DC)','linear-gradient(135deg,#FEF0EA,#F7CBB8)','linear-gradient(135deg,#EFF0FE,#C9CDF7)','linear-gradient(135deg,#FEF8E8,#F5DFA0)','linear-gradient(135deg,#F5EEF8,#DEC8F0)']

function Avatar({ name, size=80 }: { name:string; size?:number }) {
  const initials = name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || 'U'
  const colors = ['#0A5F55','#E8512A','#C9922A','#3D1F5E','#12A090']
  const bg = colors[(name?.charCodeAt(0) || 0) % colors.length]
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:bg, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.36, fontWeight:700, fontFamily:'var(--font-sans)', flexShrink:0, border:'4px solid #fff', boxShadow:'0 4px 20px rgba(0,0,0,0.12)' }}>
      {initials}
    </div>
  )
}

function StatCard({ icon, label, value, accent }: { icon:React.ReactNode; label:string; value:string|number; accent:string }) {
  return (
    <div style={{ background:'#fff', borderRadius:'14px', padding:'18px 16px', textAlign:'center' as const, border:'1px solid var(--border)', display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
      <div style={{ width:36, height:36, borderRadius:'10px', background:`${accent}15`, display:'flex', alignItems:'center', justifyContent:'center', color:accent }}>
        {icon}
      </div>
      <div style={{ fontFamily:'var(--font-serif)', fontSize:'26px', fontWeight:900, color:'var(--ink)', lineHeight:1 }}>{value || 0}</div>
      <div style={{ fontSize:'15px', color:'var(--muted)', fontFamily:'var(--font-sans)', fontWeight:500, textTransform:'uppercase' as const, letterSpacing:'1px' }}>{label}</div>
    </div>
  )
}

interface BadgesData {
  stats: {
    isVerified: boolean
    postCount: number
    commentCount: number
    likesReceived: number
    followerCount: number
    eduPostCount: number
  }
  badgeDefs: BadgeDef[]
  eliteTag: typeof import('@/lib/badges').ELITE_TAGS[0] | null
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { user: me } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'articles' | 'badges'>('articles')

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['profile', username],
    queryFn: () => apiGet(`/users/${username}/profile`),
    staleTime: 5 * 60 * 1000,
  })

  const { data: postsData } = useQuery<{ data: Post[]; total?: number }>({
    queryKey: ['user-posts', profile?.userId],
    queryFn: () => apiGet(`/posts?authorId=${profile?.userId}&status=approved&limit=50`),
    enabled: !!profile?.userId,
    staleTime: 3 * 60 * 1000,
  })

  const { data: badgesData } = useQuery<BadgesData>({
    queryKey: ['user-badges', username],
    queryFn: () => apiGet(`/users/${username}/badges`),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  })

  const posts = postsData?.data || []
  const isMe = me?.id === profile?.userId

  const actualPostCount = postsData ? posts.length : (profile?.postCount || 0)
  const totalReads = posts.reduce((sum, p) => sum + (p.viewCount || 0), 0) || profile?.totalReads || 0
  const totalLikes = posts.reduce((sum, p) => sum + (p.likeCount || 0), 0)

  const fmt = (n: number) => n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(n)

  const earnedBadges: BadgeDef[] = badgesData?.badgeDefs || []
  const badgeStats = badgesData?.stats
  const isVerified = profile?.isVerified || false

  if (isLoading) return (
    <>
      <Navbar />
      <div style={{ maxWidth:'900px', margin:'100px auto', padding:'0 24px', display:'flex', flexDirection:'column', gap:'16px' }}>
        {[200,80,40,300].map((h,i) => <div key={i} className="skeleton" style={{ height:h, borderRadius:16 }} />)}
      </div>
      <Footer />
    </>
  )

  if (!profile) return (
    <>
      <Navbar />
      <div style={{ textAlign:'center', padding:'120px 20px' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:'28px', color:'var(--ink)', marginBottom:'16px' }}>Profile not found</div>
        <Link href="/" className="btn-teal">← Back to Feed</Link>
      </div>
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />
      <main style={{ background:'var(--cream)', paddingTop:'80px', minHeight:'100vh' }}>

        {/* Cover banner */}
        <div style={{ height:'200px', background:'linear-gradient(135deg,var(--teal) 0%,#0D7A6D 50%,var(--plum) 100%)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.04) 1px, transparent 1px)', backgroundSize:'24px 24px' }} />
          <div style={{ position:'absolute', top:-60, right:-60, width:250, height:250, borderRadius:'50%', background:'rgba(255,255,255,.03)' }} />
        </div>

        <div style={{ maxWidth:'900px', margin:'0 auto', padding:'0 24px 80px' }}>

          {/* Profile card */}
          <div style={{ background:'#fff', borderRadius:'20px', border:'1px solid var(--border)', padding:'28px 32px', marginTop:'-80px', position:'relative', marginBottom:'16px', boxShadow:'0 8px 40px rgba(0,0,0,0.08)' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'24px', flexWrap:'wrap', marginBottom:'24px' }}>

              {/* Avatar */}
              <div style={{ marginTop:'-60px' }}>
                {profile.avatarUrl
                  ? <img src={profile.avatarUrl} alt={profile.fullName} style={{ width:88, height:88, borderRadius:'50%', objectFit:'cover', border:'4px solid #fff', boxShadow:'0 4px 20px rgba(0,0,0,0.12)' }} />
                  : <Avatar name={profile.fullName} size={88} />
                }
              </div>

              {/* Info */}
              <div style={{ flex:1, minWidth:'200px' }}>
                {/* Name + verified + elite tag */}
                <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap', marginBottom:'4px' }}>
                  <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'28px', fontWeight:900, color:'var(--ink)', letterSpacing:'-.5px', margin:0 }}>
                    {profile.fullName}
                  </h1>
                  {isVerified && (
                    <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'12px', fontWeight:700, color:'var(--teal)', background:'rgba(10,95,85,.08)', border:'1.5px solid rgba(10,95,85,.25)', borderRadius:'100px', padding:'3px 9px', fontFamily:'var(--font-sans)' }}>
                      ✅ Verified
                    </span>
                  )}
                  {/* Elite status tag */}
                  {badgeStats && <EliteTag stats={badgeStats} size="sm" />}
                </div>

                <div style={{ fontSize:'14px', color:'var(--muted)', fontFamily:'var(--font-sans)', marginBottom:'10px', fontWeight:500 }}>
                  {profile.designation}{profile.companyName ? ` · ${profile.companyName}` : ''}{profile.instituteName ? ` · ${profile.instituteName}` : ''}
                </div>
                {profile.location && (
                  <div style={{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'14px', color:'var(--muted)', fontFamily:'var(--font-sans)', marginBottom:'10px' }}>
                    <MapPin style={{ width:12, height:12 }} /> {profile.location}
                  </div>
                )}
                {profile.introduction && (
                  <p style={{ fontSize:'14px', color:'var(--ink)', lineHeight:1.75, fontWeight:300, maxWidth:'520px', fontFamily:'var(--font-sans)', margin:'0 0 12px' }}>
                    {profile.introduction}
                  </p>
                )}

                {/* Badge shelf (top 5 earned badges) */}
                {earnedBadges.length > 0 && (
                  <BadgeShelf badges={earnedBadges} isVerified={isVerified} max={5} />
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display:'flex', gap:'8px', flexShrink:0, marginTop:'4px' }}>
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', width:38, height:38, borderRadius:'10px', border:'1.5px solid var(--border)', background:'#fff', color:'var(--ink)', textDecoration:'none', transition:'all .2s' }}>
                    <Linkedin style={{ width:16, height:16 }} />
                  </a>
                )}
                {profile.websiteUrl && (
                  <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', width:38, height:38, borderRadius:'10px', border:'1.5px solid var(--border)', background:'#fff', color:'var(--ink)', textDecoration:'none' }}>
                    <ExternalLink style={{ width:16, height:16 }} />
                  </a>
                )}
                {isMe && (
                  <Link href="/profile/edit" style={{ display:'inline-flex', alignItems:'center', gap:'7px', padding:'9px 18px', borderRadius:'10px', background:'var(--teal)', color:'#fff', textDecoration:'none', fontFamily:'var(--font-sans)', fontSize:'13px', fontWeight:600 }}>
                    Edit Profile
                  </Link>
                )}
                {!isMe && (
                  <button style={{ padding:'9px 18px', borderRadius:'10px', border:'1.5px solid var(--teal)', background:'transparent', color:'var(--teal)', fontFamily:'var(--font-sans)', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
                    + Follow
                  </button>
                )}
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', paddingTop:'20px', borderTop:'1px solid var(--border)' }}>
              <StatCard icon={<BookOpen style={{ width:16, height:16 }} />} label="Articles" value={actualPostCount} accent="#0A5F55" />
              <StatCard icon={<Users style={{ width:16, height:16 }} />} label="Followers" value={fmt(profile.followerCount)} accent="#E8512A" />
              <StatCard icon={<Eye style={{ width:16, height:16 }} />} label="Total Reads" value={fmt(totalReads)} accent="#C9922A" />
              <StatCard icon={<Zap style={{ width:16, height:16 }} />} label="Experience" value={profile.totalExp || '—'} accent="#3D1F5E" />
            </div>
          </div>

          {/* Interests */}
          {profile.interests && (
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'16px' }}>
              {String(profile.interests).split(',').map(tag => (
                <span key={tag} className="topic-tag" style={{ fontSize:'12px' }}>{tag.trim()}</span>
              ))}
            </div>
          )}

          {/* Tab bar: Articles | Badges */}
          <div style={{ display:'flex', gap:'4px', marginBottom:'20px', background:'#fff', border:'1px solid var(--border)', borderRadius:'12px', padding:'4px' }}>
            {(['articles', 'badges'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ flex:1, padding:'9px', borderRadius:'9px', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:600, fontFamily:'var(--font-sans)', background: activeTab === tab ? 'var(--teal)' : 'transparent', color: activeTab === tab ? '#fff' : 'var(--muted)', transition:'all .18s', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
                {tab === 'badges' ? <Award style={{ width:14, height:14 }} /> : <BookOpen style={{ width:14, height:14 }} />}
                {tab === 'articles' ? `Articles${actualPostCount > 0 ? ` (${actualPostCount})` : ''}` : `Badges${earnedBadges.length > 0 ? ` (${earnedBadges.length})` : ''}`}
              </button>
            ))}
          </div>

          {/* ── ARTICLES TAB ─── */}
          {activeTab === 'articles' && (
            posts.length === 0 ? (
              <div style={{ textAlign:'center', padding:'56px', background:'#fff', borderRadius:'16px', border:'1px solid var(--border)', color:'var(--muted)', fontFamily:'var(--font-sans)' }}>
                No published articles yet.
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                {posts.map((post, i) => (
                  <Link key={post.id} href={`/post/${post.slug}`}
                    style={{ display:'flex', gap:'20px', alignItems:'flex-start', background:'#fff', border:'1px solid var(--border)', borderRadius:'16px', padding:'20px 22px', textDecoration:'none', color:'inherit', transition:'all .22s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(10,95,85,.25)'; (e.currentTarget as HTMLElement).style.transform='translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 8px 32px rgba(10,95,85,.08)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='var(--border)'; (e.currentTarget as HTMLElement).style.transform='none'; (e.currentTarget as HTMLElement).style.boxShadow='none' }}>
                    <div style={{ width:68, height:68, borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', background:GRADIENTS[i % GRADIENTS.length], flexShrink:0 }}>
                      {post.coverEmoji || '📝'}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', gap:'8px', marginBottom:'6px', flexWrap:'wrap' }}>
                        <span className="badge badge-teal" style={{ fontSize:'10px' }}>{post.category}</span>
                        <span style={{ fontSize:'15px', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>{post.readTime} min read</span>
                      </div>
                      <div style={{ fontFamily:'var(--font-serif)', fontSize:'18px', fontWeight:700, color:'var(--ink)', lineHeight:1.3, marginBottom:'6px' }}>{post.title}</div>
                      {post.excerpt && <div style={{ fontSize:'15px', color:'var(--muted)', lineHeight:1.6, fontWeight:300, fontFamily:'var(--font-sans)' }}>{post.excerpt.slice(0, 120)}{post.excerpt.length > 120 ? '…' : ''}</div>}
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'5px', fontSize:'14px', color:'var(--muted)', fontFamily:'var(--font-sans)', flexShrink:0 }}>
                      <span style={{ display:'flex', alignItems:'center', gap:'3px' }}><Eye style={{ width:11, height:11 }} /> {fmt(post.viewCount || 0)}</span>
                      <span style={{ display:'flex', alignItems:'center', gap:'3px' }}><Heart style={{ width:11, height:11 }} /> {post.likeCount || 0}</span>
                      <span style={{ display:'flex', alignItems:'center', gap:'3px' }}><MessageSquare style={{ width:11, height:11 }} /> {post.commentCount || 0}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}

          {/* ── BADGES TAB ─── */}
          {activeTab === 'badges' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

              {/* Earned badge grid */}
              <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'16px', padding:'24px' }}>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:900, color:'var(--ink)', marginBottom:'16px' }}>
                  🏅 Earned Badges
                </div>
                <BadgeGrid badges={earnedBadges} isVerified={isVerified} />
              </div>

              {/* Progress toward next badges (only show to profile owner) */}
              {isMe && badgeStats && (
                <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'16px', padding:'24px' }}>
                  <div style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:900, color:'var(--ink)', marginBottom:'16px' }}>
                    🎯 Progress
                  </div>
                  {[
                    { metric: 'posts' as const,          label: 'Posts published',   value: badgeStats.postCount,      color: '#0A5F55' },
                    { metric: 'comments' as const,       label: 'Comments made',     value: badgeStats.commentCount,   color: '#06B6D4' },
                    { metric: 'likes_received' as const, label: 'Likes received',    value: badgeStats.likesReceived,  color: '#EF4444' },
                    { metric: 'connections' as const,    label: 'Followers',         value: badgeStats.followerCount,  color: '#8B5CF6' },
                    { metric: 'edu_posts' as const,      label: 'Education posts',   value: badgeStats.eduPostCount,   color: '#F59E0B' },
                  ].map(({ metric, label, value, color }) => {
                    const next = getNextBadge(metric, value)
                    if (!next) return null
                    return (
                      <div key={metric} style={{ marginBottom:'16px' }}>
                        <div style={{ fontSize:'12px', fontWeight:700, color:'var(--ink)', fontFamily:'var(--font-sans)', marginBottom:'4px' }}>
                          {next.badge.emoji} Next: <span style={{ color }}>{next.badge.name}</span>
                        </div>
                        <BadgeProgressBar
                          label={label}
                          current={value}
                          next={next.badge.threshold}
                          color={color}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
