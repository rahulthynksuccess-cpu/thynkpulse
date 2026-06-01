'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PageHeroSection } from '@/components/layout/PageHeroSection'
import { apiGet } from '@/lib/api'
import { useContent } from '@/hooks/useContent'
import { Post } from '@/types'

const PERIODS = ['This Week', 'This Month', 'All Time']
const GRADIENTS = [
  'linear-gradient(135deg,#EAF4F0,#C0E6DC)',
  'linear-gradient(135deg,#FEF0EA,#F7CBB8)',
  'linear-gradient(135deg,#EFF0FE,#C9CDF7)',
  'linear-gradient(135deg,#FEF8E8,#F5DFA0)',
  'linear-gradient(135deg,#F5EEF8,#DEC8F0)',
]

const TRENDING_TOPICS = [
  'AI in Education','NEP 2020','EdTech Sales','School Leadership',
  'Teacher Wellbeing','Gamification','Ed-Finance','STEM',
  'Higher Education','Curriculum Design',
]

const STATIC: Post[] = [
  { id:'1', slug:'gpt-classroom-review', title:"GPT in the Classroom: A Teacher's 6-Month Honest Review", excerpt:"After half a year of experimenting, here's what actually worked, what flopped, and what surprised me the most.", content:'', category:'EdTech', tags:['AI'], status:'approved', isFeatured:true, readTime:10, viewCount:34200, likeCount:891, commentCount:203, authorId:'1', coverEmoji:'🤖', createdAt:'', updatedAt:'', author:{id:'1',userId:'1',fullName:'Rajesh Kumar',designation:'EdTech Founder',instituteName:'',companyName:'',contactNumber:'',emailId:'',totalExp:'10',introduction:'',postCount:24,followerCount:5200,followingCount:120,totalReads:340000}},
  { id:'2', slug:'turned-down-edtech-deal', title:'Why I Turned Down a ₹50L EdTech Deal (And What I Learned)', excerpt:'Sometimes the best business decision is knowing when to say no — even to big money.', content:'', category:'Leadership', tags:['Leadership'], status:'approved', isFeatured:false, readTime:8, viewCount:28700, likeCount:645, commentCount:144, authorId:'2', coverEmoji:'💰', createdAt:'', updatedAt:'', author:{id:'2',userId:'2',fullName:'Suresh Kaushik',designation:'Principal & Entrepreneur',instituteName:'',companyName:'',contactNumber:'',emailId:'',totalExp:'20',introduction:'',postCount:6,followerCount:890,followingCount:30,totalReads:56000}},
  { id:'3', slug:'education-sales-playbook', title:'The Education Sales Playbook Nobody Talks About', excerpt:'The unspoken rules of selling to schools — from gatekeepers to procurement cycles.', content:'', category:'Sales Pro', tags:['Sales'], status:'approved', isFeatured:false, readTime:9, viewCount:22100, likeCount:512, commentCount:88, authorId:'3', coverEmoji:'📊', createdAt:'', updatedAt:'', author:{id:'3',userId:'3',fullName:'Arjun Mehta',designation:'Sales Director',instituteName:'',companyName:'EduTech India',contactNumber:'',emailId:'',totalExp:'5',introduction:'',postCount:8,followerCount:2100,followingCount:200,totalReads:78000}},
  { id:'4', slug:'quit-private-school', title:"I Quit a Private School to Teach in a Government School. Here's Why.", excerpt:'A personal essay on purpose, pay cuts, and what teaching really means.', content:'', category:'Educator', tags:['Teaching'], status:'approved', isFeatured:false, readTime:7, viewCount:19800, likeCount:1200, commentCount:317, authorId:'4', coverEmoji:'🏫', createdAt:'', updatedAt:'', author:{id:'4',userId:'4',fullName:'Priya Sharma',designation:'Govt School Teacher',instituteName:'Delhi Govt School',companyName:'',contactNumber:'',emailId:'',totalExp:'8',introduction:'',postCount:12,followerCount:1800,followingCount:80,totalReads:45000}},
  { id:'5', slug:'edtech-investors-2025', title:'What EdTech Investors Actually Look for in 2025', excerpt:'Insights from conversations with 20+ VCs who fund education startups.', content:'', category:'EdTech', tags:['Funding'], status:'approved', isFeatured:false, readTime:12, viewCount:17300, likeCount:428, commentCount:71, authorId:'5', coverEmoji:'💡', createdAt:'', updatedAt:'', author:{id:'5',userId:'5',fullName:'Nalini Verma',designation:'Research Lead',instituteName:'IIT Delhi',companyName:'',contactNumber:'',emailId:'',totalExp:'12',introduction:'',postCount:16,followerCount:3400,followingCount:50,totalReads:120000}},
  { id:'6', slug:'teacher-burnout-crisis', title:'The Teacher Burnout Crisis Nobody Wants to Talk About', excerpt:'Mental health conversations are happening everywhere except the staffroom.', content:'', category:'Educator', tags:['Wellbeing'], status:'approved', isFeatured:false, readTime:6, viewCount:22000, likeCount:518, commentCount:91, authorId:'6', coverEmoji:'💚', createdAt:'', updatedAt:'', author:{id:'6',userId:'6',fullName:'Ananya Singh',designation:'School Counsellor',instituteName:'DPS',companyName:'',contactNumber:'',emailId:'',totalExp:'9',introduction:'',postCount:22,followerCount:7200,followingCount:140,totalReads:280000}},
  { id:'7', slug:'stem-gender-gap', title:"The STEM Gender Gap: Can EdTech Fix What Classrooms Haven't?", excerpt:'Research findings from 200+ schools across Tier-1 and Tier-2 Indian cities.', content:'', category:'Research', tags:['STEM'], status:'approved', isFeatured:false, readTime:9, viewCount:7200, likeCount:167, commentCount:22, authorId:'7', coverEmoji:'🔬', createdAt:'', updatedAt:'', author:{id:'7',userId:'7',fullName:'Kavitha Rajan',designation:'Education Policy Analyst',instituteName:'',companyName:'',contactNumber:'',emailId:'',totalExp:'15',introduction:'',postCount:31,followerCount:6800,followingCount:90,totalReads:450000}},
  { id:'8', slug:'nep-ground-reality', title:"NEP 2020: Two Years Later — What's Actually Changed on the Ground?", excerpt:'An honest assessment from 50 teachers across urban and rural India.', content:'', category:'Educator', tags:['NEP'], status:'approved', isFeatured:false, readTime:10, viewCount:18000, likeCount:392, commentCount:74, authorId:'8', coverEmoji:'📜', createdAt:'', updatedAt:'', author:{id:'8',userId:'8',fullName:'Meena Rao',designation:'Policy Researcher',instituteName:'',companyName:'',contactNumber:'',emailId:'',totalExp:'6',introduction:'',postCount:19,followerCount:4100,followingCount:160,totalReads:210000}},
]

// Rank badge colours cycle
const RANK_COLORS = ['var(--coral)','var(--gold)','var(--teal)','var(--plum)','var(--coral2)']

function PostCard({ post, index }: { post: Post; index: number }) {
  const grad = GRADIENTS[index % GRADIENTS.length]
  const fmt = (n: number) => n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(n)
  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link href={`/post/${post.slug}`} style={{ textDecoration:'none', color:'inherit', display:'block', height:'100%' }}>
        <div className="pcard" style={{ height:'100%', display:'flex', flexDirection:'column', position:'relative' }}>
          {/* Rank badge */}
          <div style={{
            position:'absolute', top:14, left:14, zIndex:2,
            width:32, height:32, borderRadius:'50%',
            background: RANK_COLORS[index % RANK_COLORS.length],
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'13px', color:'#fff',
            boxShadow:'0 2px 8px rgba(0,0,0,.18)',
          }}>
            {String(index + 1).padStart(2,'0')}
          </div>

          {/* Cover */}
          <div style={{ height:160, display:'flex', alignItems:'center', justifyContent:'center', fontSize:52, background:grad, position:'relative', overflow:'hidden' }}>
            {post.coverEmoji || '📝'}
          </div>

          {/* Category */}
          <span style={{
            position:'absolute', top:14, right:14,
            fontSize:'11px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase',
            padding:'4px 10px', borderRadius:'6px',
            background:'rgba(255,255,255,.9)', color:'var(--teal)',
            border:'1px solid rgba(10,95,85,.15)',
          }}>
            {post.category}
          </span>

          {/* Body */}
          <div style={{ padding:'20px', flex:1, display:'flex', flexDirection:'column' }}>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:'var(--post-title-size,19px)', fontWeight:700, color:'var(--ink)', lineHeight:1.35, marginBottom:10 }}>
              {post.title}
            </div>
            {post.excerpt && (
              <div style={{ fontSize:'15px', color:'var(--muted)', lineHeight:1.75, marginBottom:16, flex:1 }}>
                {post.excerpt}
              </div>
            )}

            {/* Footer */}
            <div style={{ display:'flex', alignItems:'center', gap:10, paddingTop:14, borderTop:'1px solid var(--border2)', marginTop:'auto', flexWrap:'wrap' }}>
              <div style={{ width:34, height:34, borderRadius:10, background:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'14px', color:'#fff', flexShrink:0 }}>
                {post.author?.fullName?.[0] || 'U'}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'14px', fontWeight:600, color:'var(--ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{post.author?.fullName}</div>
                <div style={{ fontSize:'12px', color:'var(--muted)' }}>{post.author?.designation} · {post.readTime}min read</div>
              </div>
              <div style={{ display:'flex', gap:8, fontSize:'12px', color:'var(--muted)', flexShrink:0 }}>
                <span>❤️ {fmt(post.likeCount)}</span>
                <span>👁 {fmt(post.viewCount)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function SkeletonCard() {
  return (
    <div className="pcard">
      <div className="skeleton" style={{ height:160 }} />
      <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:10 }}>
        <div className="skeleton" style={{ height:20, width:'85%' }} />
        <div className="skeleton" style={{ height:15 }} />
        <div className="skeleton" style={{ height:15, width:'70%' }} />
      </div>
    </div>
  )
}

export default function TrendingNowPage() {
  const pageContent = useContent('content.trending')
  const [activePeriod, setActivePeriod] = useState('This Week')

  const { data, isLoading } = useQuery<{ data: Post[] }>({
    queryKey: ['trending-posts', activePeriod],
    queryFn: () => apiGet(`/posts?status=approved&limit=9`),
    staleTime: 5 * 60 * 1000,
  })
  const posts = data?.data?.length ? data.data : STATIC

  return (
    <>
      <Navbar />
      <main style={{ minHeight:'100vh', background:'var(--cream)' }}>

        {/* Hero — same gradient as all other pages */}
        <PageHeroSection
          eyebrow="🔥 What's Hot"
          title="Trending"
          accent="Now"
          subtitle={pageContent?.heroSubtitle || "The articles the community can't stop reading, sharing, and discussing right now."}
        />

        {/* Period filter */}
        <div style={{ background:'#fff', borderBottom:'1px solid var(--border)', padding:'0 5%' }}>
          <div style={{ display:'flex', gap:8, padding:'14px 0', overflowX:'auto', scrollbarWidth:'none' }}>
            {PERIODS.map(p => (
              <button key={p} onClick={() => setActivePeriod(p)}
                className={`filter-btn ${activePeriod === p ? 'active' : ''}`}
                style={{ whiteSpace:'nowrap' }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Main layout */}
        <div style={{ padding:'48px 5%', maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 300px', gap:40, alignItems:'start' }}>

          {/* ── Post cards grid (same as Latest Posts) ── */}
          <div>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:'13px', fontWeight:600, color:'var(--muted)', marginBottom:24, letterSpacing:'.5px' }}>
              {isLoading ? 'Loading…' : `${posts.length} trending article${posts.length !== 1 ? 's' : ''} · ${activePeriod}`}
            </div>

            {isLoading ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
                {Array.from({length:6}).map((_,i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <>
                {/* Featured first card — full width */}
                {posts[0] && (
                  <div style={{ marginBottom:20 }}>
                    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
                      <Link href={`/post/${posts[0].slug}`} style={{ textDecoration:'none', color:'inherit', display:'block' }}>
                        <div className="pcard" style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:0, overflow:'hidden', position:'relative' }}>
                          {/* Rank */}
                          <div style={{ position:'absolute', top:16, left:16, zIndex:2, width:36, height:36, borderRadius:'50%', background:'var(--coral)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'15px', color:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,.2)' }}>01</div>
                          <div style={{ height:280, display:'flex', alignItems:'center', justifyContent:'center', fontSize:88, background:GRADIENTS[0] }}>
                            {posts[0].coverEmoji || '📝'}
                          </div>
                          <div style={{ padding:'32px 28px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                            <div>
                              <span style={{ fontSize:'12px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', color:'var(--teal)', display:'block', marginBottom:12 }}>{posts[0].category}</span>
                              <div style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(18px,2.5vw,24px)', fontWeight:700, color:'var(--ink)', lineHeight:1.35, marginBottom:14 }}>{posts[0].title}</div>
                              <div style={{ fontSize:'15px', color:'var(--muted)', lineHeight:1.75 }}>{posts[0].excerpt}</div>
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:20, paddingTop:16, borderTop:'1px solid var(--border2)' }}>
                              <div style={{ width:36,height:36,borderRadius:10,background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-serif)',fontWeight:900,fontSize:'14px',color:'#fff',flexShrink:0 }}>
                                {posts[0].author?.fullName?.[0] || 'U'}
                              </div>
                              <div style={{ flex:1,minWidth:0 }}>
                                <div style={{ fontSize:'14px',fontWeight:600,color:'var(--ink)' }}>{posts[0].author?.fullName}</div>
                                <div style={{ fontSize:'12px',color:'var(--muted)' }}>{posts[0].author?.designation} · {posts[0].readTime}min</div>
                              </div>
                              <div style={{ fontSize:'12px',color:'var(--muted)',display:'flex',gap:8 }}>
                                <span>❤️ {posts[0].likeCount >= 1000 ? `${(posts[0].likeCount/1000).toFixed(1)}K` : posts[0].likeCount}</span>
                                <span>👁 {posts[0].viewCount >= 1000 ? `${(posts[0].viewCount/1000).toFixed(1)}K` : posts[0].viewCount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </div>
                )}

                {/* Rest as 3-col grid */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
                  {posts.slice(1).map((post, i) => (
                    <PostCard key={post.id} post={post} index={i+1} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:20, position:'sticky', top:24 }}>
            {/* Trending topics */}
            <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:16, padding:'22px' }}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:'16px', fontWeight:700, color:'var(--ink)', marginBottom:16 }}>🏷️ Trending Topics</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {TRENDING_TOPICS.map(t => (
                  <button key={t}
                    style={{ padding:'6px 12px', borderRadius:20, border:'1.5px solid var(--parchment)', background:'var(--cream)', fontSize:'13px', fontWeight:600, color:'var(--ink)', cursor:'pointer', transition:'all .15s' }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.background='var(--teal)'; (e.target as HTMLElement).style.color='#fff'; (e.target as HTMLElement).style.borderColor='var(--teal)' }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.background='var(--cream)'; (e.target as HTMLElement).style.color='var(--ink)'; (e.target as HTMLElement).style.borderColor='var(--parchment)' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ background:'var(--teal)', borderRadius:16, padding:'24px', color:'#fff' }}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:'18px', fontWeight:700, marginBottom:10 }}>Share your story</div>
              <div style={{ fontSize:'14px', color:'rgba(255,255,255,.8)', lineHeight:1.7, marginBottom:20 }}>Join 2,400+ educators and EdTech professionals writing on Thynk Pulse.</div>
              <Link href="/write" style={{ display:'block', padding:'11px', borderRadius:10, background:'var(--gold2)', color:'var(--ink)', textAlign:'center', textDecoration:'none', fontWeight:700, fontSize:'14px' }}>
                Start Writing →
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile: hide sidebar below 900px */}
        <style>{`
          @media (max-width: 900px) {
            .trending-layout-grid { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 640px) {
            .trending-featured { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </main>
      <Footer />
    </>
  )
}
