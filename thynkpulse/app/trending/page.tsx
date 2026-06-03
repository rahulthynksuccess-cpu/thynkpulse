'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
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
const RANK_COLORS = ['var(--coral)','var(--gold)','var(--teal)','var(--plum)','#E07A5F']
const TOPICS = ['AI in Education','NEP 2020','EdTech Sales','School Leadership','Teacher Wellbeing','Gamification','Ed-Finance','STEM','Higher Education','Curriculum Design']

const STATIC: Post[] = [
  { id:'1', slug:'gpt-classroom-review', title:"GPT in the Classroom: A Teacher's 6-Month Honest Review", excerpt:"After half a year of experimenting, here's what actually worked, what flopped, and what surprised me most.", content:'', category:'EdTech', tags:[], status:'approved', isFeatured:true, readTime:10, viewCount:34200, likeCount:891, commentCount:203, authorId:'1', coverEmoji:'🤖', createdAt:'', updatedAt:'', author:{id:'1',userId:'1',fullName:'Rajesh Kumar',designation:'EdTech Founder',instituteName:'',companyName:'',contactNumber:'',emailId:'',totalExp:'10',introduction:'',postCount:24,followerCount:5200,followingCount:120,totalReads:340000}},
  { id:'2', slug:'turned-down-edtech-deal', title:'Why I Turned Down a ₹50L EdTech Deal (And What I Learned)', excerpt:'Sometimes the best business decision is knowing when to say no — even to big money.', content:'', category:'Leadership', tags:[], status:'approved', isFeatured:false, readTime:8, viewCount:28700, likeCount:645, commentCount:144, authorId:'2', coverEmoji:'💰', createdAt:'', updatedAt:'', author:{id:'2',userId:'2',fullName:'Suresh Kaushik',designation:'Principal',instituteName:'',companyName:'',contactNumber:'',emailId:'',totalExp:'20',introduction:'',postCount:6,followerCount:890,followingCount:30,totalReads:56000}},
  { id:'3', slug:'education-sales-playbook', title:'The Education Sales Playbook Nobody Talks About', excerpt:'The unspoken rules of selling to schools — from gatekeepers to procurement cycles.', content:'', category:'Sales Pro', tags:[], status:'approved', isFeatured:false, readTime:9, viewCount:22100, likeCount:512, commentCount:88, authorId:'3', coverEmoji:'📊', createdAt:'', updatedAt:'', author:{id:'3',userId:'3',fullName:'Arjun Mehta',designation:'Sales Director',instituteName:'',companyName:'',contactNumber:'',emailId:'',totalExp:'5',introduction:'',postCount:8,followerCount:2100,followingCount:200,totalReads:78000}},
  { id:'4', slug:'quit-private-school', title:"I Quit a Private School to Teach in a Government School. Here's Why.", excerpt:'A personal essay on purpose, pay cuts, and what teaching really means.', content:'', category:'Educator', tags:[], status:'approved', isFeatured:false, readTime:7, viewCount:19800, likeCount:1200, commentCount:317, authorId:'4', coverEmoji:'🏫', createdAt:'', updatedAt:'', author:{id:'4',userId:'4',fullName:'Priya Sharma',designation:'Govt Teacher',instituteName:'',companyName:'',contactNumber:'',emailId:'',totalExp:'8',introduction:'',postCount:12,followerCount:1800,followingCount:80,totalReads:45000}},
  { id:'5', slug:'edtech-investors-2025', title:'What EdTech Investors Actually Look for in 2025', excerpt:'Insights from conversations with 20+ VCs who fund education startups across India.', content:'', category:'EdTech', tags:[], status:'approved', isFeatured:false, readTime:12, viewCount:17300, likeCount:428, commentCount:71, authorId:'5', coverEmoji:'💡', createdAt:'', updatedAt:'', author:{id:'5',userId:'5',fullName:'Nalini Verma',designation:'Researcher',instituteName:'',companyName:'',contactNumber:'',emailId:'',totalExp:'12',introduction:'',postCount:16,followerCount:3400,followingCount:50,totalReads:120000}},
  { id:'6', slug:'teacher-burnout-crisis', title:'The Teacher Burnout Crisis Nobody Wants to Talk About', excerpt:'Mental health conversations are happening everywhere except the staffroom.', content:'', category:'Educator', tags:[], status:'approved', isFeatured:false, readTime:6, viewCount:22000, likeCount:518, commentCount:91, authorId:'6', coverEmoji:'💚', createdAt:'', updatedAt:'', author:{id:'6',userId:'6',fullName:'Ananya Singh',designation:'Counsellor',instituteName:'',companyName:'',contactNumber:'',emailId:'',totalExp:'9',introduction:'',postCount:22,followerCount:7200,followingCount:140,totalReads:280000}},
  { id:'7', slug:'stem-gender-gap', title:"The STEM Gender Gap: Can EdTech Fix What Classrooms Haven't?", excerpt:'Research findings from 200+ schools across Tier-1 and Tier-2 cities in India.', content:'', category:'Research', tags:[], status:'approved', isFeatured:false, readTime:9, viewCount:7200, likeCount:167, commentCount:22, authorId:'7', coverEmoji:'🔬', createdAt:'', updatedAt:'', author:{id:'7',userId:'7',fullName:'Kavitha Rajan',designation:'Analyst',instituteName:'',companyName:'',contactNumber:'',emailId:'',totalExp:'15',introduction:'',postCount:31,followerCount:6800,followingCount:90,totalReads:450000}},
  { id:'8', slug:'nep-ground-reality', title:"NEP 2020: Two Years Later — What's Actually Changed?", excerpt:'An honest assessment from 50 teachers across urban and rural India.', content:'', category:'Educator', tags:[], status:'approved', isFeatured:false, readTime:10, viewCount:18000, likeCount:392, commentCount:74, authorId:'8', coverEmoji:'📜', createdAt:'', updatedAt:'', author:{id:'8',userId:'8',fullName:'Meena Rao',designation:'Policy Researcher',instituteName:'',companyName:'',contactNumber:'',emailId:'',totalExp:'6',introduction:'',postCount:19,followerCount:4100,followingCount:160,totalReads:210000}},
  { id:'9', slug:'school-20-years', title:'What I Learned Running a School for 20 Years', excerpt:'Hard lessons from two decades of building an institution from the ground up.', content:'', category:'Leadership', tags:[], status:'approved', isFeatured:false, readTime:11, viewCount:15000, likeCount:311, commentCount:58, authorId:'9', coverEmoji:'🏆', createdAt:'', updatedAt:'', author:{id:'9',userId:'9',fullName:'Deepak Sharma',designation:'School Director',instituteName:'',companyName:'',contactNumber:'',emailId:'',totalExp:'20',introduction:'',postCount:6,followerCount:1200,followingCount:40,totalReads:67000}},
]

function fmt(n: number) { return n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(n) }

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      transition={{ delay:(index%9)*0.06 }}
      style={{ height:'100%' }}
    >
      <Link href={`/post/${post.slug}`} className="pcard"
        style={{ display:'flex', flexDirection:'column', height:'100%', textDecoration:'none', color:'inherit' }}>
        <div style={{ position:'relative', overflow:'hidden' }}>
          <div style={{ height:160, display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:48, background:GRADIENTS[index % GRADIENTS.length] }}>
            {post.coverEmoji || '📝'}
          </div>
          {/* Category badge */}
          <span style={{ position:'absolute', top:14, left:14, fontSize:'12px', fontWeight:700,
            letterSpacing:'1px', textTransform:'uppercase', padding:'5px 12px', borderRadius:'6px',
            background:'rgba(10,95,85,.12)', color:'var(--teal)', border:'1px solid rgba(10,95,85,.2)' }}>
            {post.category}
          </span>
          {/* Rank badge */}
          <div style={{ position:'absolute', top:10, right:10, width:32, height:32, borderRadius:'50%',
            background:RANK_COLORS[index % RANK_COLORS.length], display:'flex', alignItems:'center',
            justifyContent:'center', fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'13px',
            color:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,.2)' }}>
            {String(index+1).padStart(2,'0')}
          </div>
        </div>

        <div style={{ padding:'22px', flex:1, display:'flex', flexDirection:'column' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:20, fontWeight:700,
            color:'var(--ink)', lineHeight:1.35, marginBottom:10 }}>
            {post.title}
          </div>
          {post.excerpt && (
            <div style={{ fontSize:'15px', color:'var(--muted)', lineHeight:1.75,
              marginBottom:16, flex:1 }}>
              {post.excerpt}
            </div>
          )}
          <div style={{ display:'flex', alignItems:'center', gap:10, paddingTop:14,
            borderTop:'1px solid var(--border2)', marginTop:'auto' }}>
            <div className="avatar av-teal" style={{ width:34, height:34, fontSize:'14px', borderRadius:'10px', flexShrink:0 }}>
              {post.author?.fullName?.split(' ').map(n=>n[0]).join('').slice(0,2) || 'U'}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'14px', fontWeight:600, color:'var(--ink)',
                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {post.author?.fullName || 'Author'}
              </div>
              <div style={{ fontSize:'13px', color:'var(--muted)' }}>
                {post.author?.designation} · {post.readTime} min read
              </div>
            </div>
            <div style={{ display:'flex', gap:8, fontSize:'13px', color:'var(--muted)', flexShrink:0 }}>
              <span>❤️ {fmt(post.likeCount)}</span>
              <span>👁 {fmt(post.viewCount)}</span>
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
      <div style={{ padding:'22px', display:'flex', flexDirection:'column', gap:10 }}>
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
    queryFn: () => apiGet('/posts?status=approved&limit=9'),
    staleTime: 5 * 60 * 1000,
  })
  const posts = data?.data?.length ? data.data : STATIC

  return (
    <>
      <Navbar />
      <main style={{ background:'var(--cream)' }}>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <div style={{
          background:'var(--trending-hero-bg, linear-gradient(135deg,var(--teal) 0%,#0D7A6D 60%,var(--plum) 100%))',
          padding:'72px 5% 64px', position:'relative', overflow:'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{ position:'absolute', top:-100, right:-100, width:400, height:400, borderRadius:'50%', background:'rgba(255,255,255,.04)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-80, left:'30%', width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,.03)', pointerEvents:'none' }} />

          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', alignItems:'flex-end', gap:40, maxWidth:1200, position:'relative', zIndex:1 }}>
            {/* Left: title + subtitle */}
            <div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'rgba(255,255,255,.55)', marginBottom:14 }}>
                🔥 What's Hot
              </div>
              <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(32px,5vw,60px)', fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:16, letterSpacing:'-1px' }}>
                Trending<br />
                <em style={{ fontStyle:'italic', color:'var(--gold2,#E5B64A)' }}>Now</em>
              </h1>
              <p style={{ fontSize:'17px', color:'rgba(255,255,255,.75)', lineHeight:1.75, maxWidth:540, fontWeight:300 }}>
                {pageContent?.heroSubtitle || "The articles the community can't stop reading, sharing, and discussing right now."}
              </p>
            </div>

            {/* Right: Share your story block — IN the hero */}
            <div style={{
              background:'rgba(255,255,255,.1)', border:'1.5px solid rgba(255,255,255,.2)',
              borderRadius:16, padding:'28px 28px', backdropFilter:'blur(8px)',
              minWidth:280, maxWidth:320, flexShrink:0,
            }}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:'18px', fontWeight:700, color:'#fff', marginBottom:10 }}>
                ✍️ Share Your Story
              </div>
              <p style={{ fontSize:'14px', color:'rgba(255,255,255,.8)', lineHeight:1.7, marginBottom:20 }}>
                Join 2,400+ educators and EdTech professionals writing on Thynk Pulse. Free forever.
              </p>
              <Link href="/write" style={{
                display:'block', padding:'12px 20px', borderRadius:10,
                background:'var(--gold2,#E5B64A)', color:'var(--ink)',
                textAlign:'center', textDecoration:'none',
                fontFamily:'var(--font-sans)', fontWeight:800, fontSize:'15px',
                boxShadow:'0 4px 16px rgba(201,146,42,.35)',
              }}>
                Start Writing →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Period filter bar ────────────────────────────────── */}
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

        {/* ── Posts + Sidebar ──────────────────────────────────── */}
        <div style={{ padding:'48px 5%', maxWidth:1280, margin:'0 auto' }}>
          <div className="trending-layout" style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:40, alignItems:'start' }}>

            {/* Posts grid — SAME as Latest Posts */}
            <div>
              <div style={{ fontSize:'14px', fontWeight:600, color:'var(--muted)', marginBottom:24 }}>
                {isLoading ? 'Loading…' : `${posts.length} trending articles · ${activePeriod}`}
              </div>

              {isLoading ? (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
                  {Array.from({length:6}).map((_,i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
                  {posts.map((post,i) => <PostCard key={post.id} post={post} index={i} />)}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ display:'flex', flexDirection:'column', gap:20, position:'sticky', top:24 }}>
              <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:16, padding:22 }}>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'17px', fontWeight:700, color:'var(--ink)', marginBottom:16 }}>
                  🏷️ Trending Topics
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {TOPICS.map(t => (
                    <span key={t} style={{ padding:'6px 12px', borderRadius:20, border:'1.5px solid var(--parchment)', background:'var(--cream)', fontSize:'13px', fontWeight:600, color:'var(--ink)', cursor:'pointer' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <style>{`
        @media (max-width:900px) { .trending-layout { grid-template-columns:1fr !important; } }
        @media (max-width:640px) { .trending-hero-grid { grid-template-columns:1fr !important; } }
      `}</style>
      <Footer />
    </>
  )
}
