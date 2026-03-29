'use client'
import { useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { apiGet } from '@/lib/api'
import { FollowButton } from '@/components/ui/FollowButton'
import { Post } from '@/types'

const CATS = ['All Posts','Educators','EdTech','Sales & Marketing','Innovation','Leadership','Career']
const GRADIENTS = ['linear-gradient(135deg,#EAF4F0,#C0E6DC)','linear-gradient(135deg,#FEF0EA,#F7CBB8)','linear-gradient(135deg,#EFF0FE,#C9CDF7)','linear-gradient(135deg,#FEF8E8,#F5DFA0)','linear-gradient(135deg,#F5EEF8,#DEC8F0)']
const CAT_STYLES: Record<string, string> = { 'EdTech':'cat-t','Educator':'cat-c','Sales Pro':'cat-g','Research':'cat-p','Leadership':'cat-t','Career':'cat-p' }

function PostCardSkeleton({ big = false }: { big?: boolean }) {
  return (
    <div className="pcard" style={{ pointerEvents:'none' }}>
      <div className="skeleton" style={{ height: big ? 300 : 160 }} />
      <div style={{ padding:'22px', display:'flex', flexDirection:'column', gap:'10px' }}>
        <div className="skeleton" style={{ height:20, width:'80%' }} />
        <div className="skeleton" style={{ height:14, width:'60%' }} />
        <div className="skeleton" style={{ height:14 }} />
        <div className="skeleton" style={{ height:14, width:'70%' }} />
      </div>
    </div>
  )
}

function PostCard({ post, big=false, index=0 }: { post: Post; big?: boolean; index?: number }) {
  const gradIdx = index % GRADIENTS.length
  const catClass = CAT_STYLES[post.category] || 'cat-t'
  return (
    <motion.div initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:(index%4)*.08 }}>
      <Link href={`/post/${post.slug}`} className="pcard" style={{ height:'100%' }}>
        <div style={{ position:'relative', overflow:'hidden' }}>
          <div style={{ height: big ? 300 : 160, display:'flex', alignItems:'center', justifyContent:'center', fontSize: big ? 72 : 48, background: GRADIENTS[gradIdx] }}>
            {post.coverEmoji || '📝'}
          </div>
          <span style={{ position:'absolute', top:14, left:14, fontSize:'11px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', padding:'5px 12px', borderRadius:'6px', background:'rgba(10,95,85,.12)', color:'var(--teal)', border:'1px solid rgba(10,95,85,.2)' }}>
            {post.category}
          </span>
        </div>
        <div style={{ padding:'22px', flex:1, display:'flex', flexDirection:'column' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize: big ? 'var(--post-title-size,26px)' : 'var(--post-title-size,18px)', fontWeight:600, color:'var(--post-title-color,var(--ink))', lineHeight:1.35, marginBottom:'8px' }}>
            {post.title}
          </div>
          {post.excerpt && (
            <div style={{ fontSize:'var(--post-excerpt-size,13px)', color:'var(--post-excerpt-color,var(--muted))', lineHeight:1.7, marginBottom:'16px', flex:1 }}>
              {post.excerpt}
            </div>
          )}
          <div style={{ display:'flex', alignItems:'center', gap:'10px', paddingTop:'14px', borderTop:'1px solid var(--border2)', marginTop:'auto' }}>
            <div className="avatar av-teal" style={{ width:34, height:34, fontSize:'14px', borderRadius:'10px' }}>
              {post.author?.fullName?.split(' ').map(n=>n[0]).join('').slice(0,2) || 'U'}
            </div>
            <div>
              <div style={{ fontSize:'13px', fontWeight:600, color:'var(--ink)' }}>{post.author?.fullName || 'Author'}</div>
              <div style={{ fontSize:'11px', color:'var(--muted)' }}>{post.author?.designation} · {post.readTime} min read</div>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', gap:'10px', fontSize:'12px', color:'var(--muted)', flexShrink:0 }}>
              <span>❤️ {post.likeCount}</span>
              <span>💬 {post.commentCount}</span>
              <span>👁 {post.viewCount >= 1000 ? `${(post.viewCount/1000).toFixed(1)}K` : post.viewCount}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

/* Fallback static posts when API not connected */
const STATIC_POSTS: Post[] = [
  { id:'1', slug:'ai-classroom-engagement', title:'How AI is Quietly Rewriting the Rules of Classroom Engagement', excerpt:'From adaptive learning paths to AI-powered feedback loops — what\'s actually working in schools across India.', content:'', category:'EdTech', tags:['AI','EdTech'], status:'approved', isFeatured:true, readTime:8, viewCount:12000, likeCount:284, commentCount:47, authorId:'1', coverEmoji:'🤖', coverGradient:GRADIENTS[0], createdAt:'', updatedAt:'', author:{ id:'1', userId:'1', fullName:'Rajesh Kumar', designation:'EdTech Founder', instituteName:'', companyName:'', contactNumber:'', emailId:'', totalExp:'10', introduction:'', postCount:24, followerCount:5200, followingCount:120, totalReads:340000 } },
  { id:'2', slug:'experiential-learning', title:'Experiential Learning: Why It Works and How to Scale It', excerpt:'A government school teacher on transforming assessment through real-world projects.', content:'', category:'Educator', tags:['Teaching'], status:'approved', isFeatured:false, readTime:5, viewCount:4200, likeCount:102, commentCount:18, authorId:'2', coverEmoji:'🌱', coverGradient:GRADIENTS[1], createdAt:'', updatedAt:'', author:{ id:'2', userId:'2', fullName:'Priya Sharma', designation:'Teacher', instituteName:'Delhi Govt School', companyName:'', contactNumber:'', emailId:'', totalExp:'8', introduction:'', postCount:12, followerCount:1800, followingCount:80, totalReads:45000 } },
  { id:'3', slug:'selling-to-schools', title:'Selling to Schools: What Works (And What Doesn\'t)', excerpt:'Honest lessons from 5 years and 300+ school conversations.', content:'', category:'Sales Pro', tags:['Sales'], status:'approved', isFeatured:false, readTime:6, viewCount:9800, likeCount:218, commentCount:31, authorId:'3', coverEmoji:'📈', coverGradient:GRADIENTS[3], createdAt:'', updatedAt:'', author:{ id:'3', userId:'3', fullName:'Arjun Mehta', designation:'Sales Director', instituteName:'', companyName:'EduTech India', contactNumber:'', emailId:'', totalExp:'5', introduction:'', postCount:8, followerCount:2100, followingCount:200, totalReads:78000 } },
  { id:'4', slug:'stem-gender-gap', title:'The STEM Gender Gap: Can EdTech Fix What Classrooms Haven\'t?', excerpt:'Research findings from 200+ schools across Tier-1 and Tier-2 Indian cities.', content:'', category:'Research', tags:['STEM','Gender'], status:'approved', isFeatured:false, readTime:9, viewCount:7200, likeCount:167, commentCount:22, authorId:'4', coverEmoji:'🔬', coverGradient:GRADIENTS[2], createdAt:'', updatedAt:'', author:{ id:'4', userId:'4', fullName:'Nalini Verma', designation:'Research Lead', instituteName:'IIT Delhi', companyName:'', contactNumber:'', emailId:'', totalExp:'12', introduction:'', postCount:16, followerCount:3400, followingCount:50, totalReads:120000 } },
  { id:'5', slug:'school-20-years', title:'What I Learned Running a School for 20 Years', excerpt:'Lessons from two decades of building an institution from the ground up.', content:'', category:'Leadership', tags:['Leadership'], status:'approved', isFeatured:false, readTime:11, viewCount:15000, likeCount:311, commentCount:58, authorId:'5', coverEmoji:'🏫', coverGradient:GRADIENTS[0], createdAt:'', updatedAt:'', author:{ id:'5', userId:'5', fullName:'Suresh Kaushik', designation:'Principal', instituteName:'CBSE School', companyName:'', contactNumber:'', emailId:'', totalExp:'20', introduction:'', postCount:6, followerCount:890, followingCount:30, totalReads:56000 } },
  { id:'6', slug:'teacher-to-founder', title:'From Teacher to EdTech Founder: My Unfiltered Journey', excerpt:'Three years of failures, pivots, and small wins — the story I wish someone had told me.', content:'', category:'Career', tags:['Career','EdTech'], status:'approved', isFeatured:false, readTime:7, viewCount:11000, likeCount:244, commentCount:39, authorId:'6', coverEmoji:'💼', coverGradient:GRADIENTS[4], createdAt:'', updatedAt:'', author:{ id:'6', userId:'6', fullName:'Meena Rao', designation:'Founder', instituteName:'', companyName:'EduSpark', contactNumber:'', emailId:'', totalExp:'6', introduction:'', postCount:19, followerCount:4100, followingCount:160, totalReads:210000 } },
]

export function PostsSection() {
  const [activeFilter, setActiveFilter] = useState('All Posts')
  const { data, isLoading } = useQuery<{ data: Post[] }>({
    queryKey: ['home-posts', activeFilter],
    queryFn: () => apiGet(`/posts?status=approved&limit=6${activeFilter !== 'All Posts' ? `&category=${activeFilter}` : ''}`),
    staleTime: 3 * 60 * 1000,
  })
  const posts = data?.data?.length ? data.data : STATIC_POSTS

  return (
    <section id="posts" style={{ padding:'96px 5%', background:'var(--posts-bg, var(--cream))' }}>
      <div className="eyebrow"><div className="eyebrow-line" style={{ background:'var(--posts-eyebrow-color,var(--coral))' }} /><span className="eyebrow-text" style={{ color:'var(--posts-eyebrow-color,var(--coral))', fontSize:'var(--posts-eyebrow-size,11px)' }}>Latest from the community</span></div>
      <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'var(--posts-section-title-size, 42px)', fontWeight:900, color:'var(--posts-section-title-color, var(--ink))', lineHeight:1.05, letterSpacing:'-1.5px', marginBottom:'14px' }}>Fresh Ideas,<br /><em style={{ fontStyle:'italic', color:'var(--posts-section-accent, var(--teal))' }}>Real Voices</em></h2>
      <p style={{ fontSize:'var(--posts-desc-size, 16px)', color:'var(--posts-desc-color, var(--muted))', lineHeight:1.8, maxWidth:'520px', marginTop:'14px', fontWeight:300 }}>Articles from educators, EdTech founders, sales pros, and innovators shaping education worldwide.</p>

      <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap', margin:'36px 0 0' }}>
        {CATS.map(cat => (
          <button key={cat} onClick={() => setActiveFilter(cat)}
            className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}>
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:'20px', marginTop:'40px' }}>
          <PostCardSkeleton big />
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            <PostCardSkeleton /><PostCardSkeleton />
          </div>
        </div>
      ) : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gridTemplateRows:'auto auto', gap:'20px', marginTop:'40px' }}>
            <div style={{ gridRow:'1/3' }}>
              <PostCard post={posts[0]} big index={0} />
            </div>
            <PostCard post={posts[1]} index={1} />
            <PostCard post={posts[2]} index={2} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginTop:'20px' }}>
            {posts.slice(3,6).map((p, i) => <PostCard key={p.id} post={p} index={i+3} />)}
          </div>
        </>
      )}

      <div style={{ textAlign:'center', marginTop:'48px' }}>
        <Link href="/?all=1" className="btn-outline" style={{ display:'inline-flex', alignItems:'center', gap:'8px' }}>Browse All Articles →</Link>
      </div>
    </section>
  )
}

/* ── TRENDING SECTION ─────────────────────────────────────────── */
const TRENDING = [
  { num:'01', tag:'EdTech · AI',       title:"GPT in the Classroom: A Teacher's 6-Month Honest Review",       reads:'34.2K', likes:'891', comments:'203' },
  { num:'02', tag:'School Leadership', title:'Why I Turned Down a ₹50L EdTech Deal (And What I Learned)',       reads:'28.7K', likes:'645', comments:'144' },
  { num:'03', tag:'Sales · Career',    title:'The Education Sales Playbook Nobody Talks About',                  reads:'22.1K', likes:'512', comments:'88'  },
  { num:'04', tag:'Educator · Story',  title:'I Quit a Private School to Teach in a Government School. Here\'s Why.', reads:'19.8K', likes:'1.2K', comments:'317' },
  { num:'05', tag:'EdTech · Funding',  title:'What EdTech Investors Actually Look for in 2025',                  reads:'17.3K', likes:'428', comments:'71'  },
]

const TOPICS = ['AI in Education','School Leadership','EdTech Sales','NEP 2020','Teacher Training','Ed-Finance','Curriculum Design','Student Wellbeing','Higher Education','Vocational Ed','STEM','Ed Policy']

const TOP_WRITERS_FALLBACK = [
  { username:'rajesh.kumar@thynkpulse.in', fullName:'Rajesh Kumar', role:'EdTech Founder',  followerCount:5200 },
  { username:'priya.sharma@thynkpulse.in', fullName:'Priya Sharma', role:'Teacher, Delhi',  followerCount:1800 },
  { username:'arjun.mehta@thynkpulse.in',  fullName:'Arjun Mehta',  role:'Sales Director',  followerCount:2100 },
  { username:'nalini.verma@thynkpulse.in', fullName:'Nalini Verma', role:'Researcher, IIT', followerCount:3400 },
]
const AVATAR_BG = ['var(--teal)','var(--coral)','var(--gold)','var(--plum)','var(--teal2)','var(--coral2)']

export function TrendingSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, amount:.1 })

  const { data: writersData } = useQuery<{ writers: any[] }>({
    queryKey: ['top-writers'],
    queryFn: () => fetch('/api/users/top-writers?limit=6').then(r => r.json()),
    staleTime: 5 * 60 * 1000,
  })
  const writers = (writersData?.writers && writersData.writers.length > 0)
    ? writersData.writers
    : TOP_WRITERS_FALLBACK

  return (
    <section id="trending" ref={ref} style={{ padding:'96px 5%', background:'var(--trending-bg, #fff)' }}>
      <div className="eyebrow"><div className="eyebrow-line" style={{ background:'var(--trending-eyebrow-color,var(--coral))' }} /><span className="eyebrow-text" style={{ color:'var(--trending-eyebrow-color,var(--coral))' }}>What the community is reading</span></div>
      <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'var(--trending-section-title-size, 42px)', fontWeight:900, color:'var(--trending-section-title, var(--ink))', lineHeight:1.05, letterSpacing:'-1.5px', marginBottom:'14px' }}>Trending<br /><em style={{ fontStyle:'italic', color:'var(--trending-accent-color, var(--teal))' }}>This Week</em></h2>

      <div className='trending-grid' className='trending-grid' style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'40px', marginTop:'56px', alignItems:'start' }}>

        {/* Trending list */}
        <div>
          {TRENDING.map((t, i) => (
            <motion.a key={t.num} href="#" initial={{ opacity:0, y:18 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ delay:i*.09 }}
              style={{ display:'flex', gap:'16px', alignItems:'flex-start', padding:'20px 0', borderBottom:'1px solid var(--border2)', cursor:'pointer', textDecoration:'none', color:'inherit' }}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:'var(--trending-rank-size,32px)', fontWeight:900, color:'var(--trending-num-color,var(--parchment))', lineHeight:1, flexShrink:0, minWidth:'44px' }}>{t.num}</div>
              <div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'var(--trending-cat-size,11px)', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', color:'var(--trending-cat-color,var(--coral))', marginBottom:'5px' }}>{t.tag}</div>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'var(--trending-title-size,17px)', fontWeight:600, color:'var(--trending-title-color,var(--ink))', lineHeight:1.35, marginBottom:'8px', transition:'color .2s' }}>{t.title}</div>
                <div style={{ display:'flex', gap:'14px', fontSize:'12px', color:'var(--trending-meta-color,var(--muted))' }}>
                  <span>👁 {t.reads} reads</span><span>❤️ {t.likes}</span><span>💬 {t.comments}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          <div className="sidebar-card" style={{ background:'var(--trending-sidebar-bg,var(--cream))' }}>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:'16px', fontWeight:700, color:'var(--ink)', marginBottom:'16px' }}>Browse Topics</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
              {TOPICS.map(t => <span key={t} className="topic-tag" style={{ background:'var(--topic-tag-bg,var(--parchment))', color:'var(--topic-tag-color,var(--muted))' }}>{t}</span>)}
            </div>
          </div>
          <div className="sidebar-card">
            <div style={{ fontFamily:'var(--font-serif)', fontSize:'16px', fontWeight:700, color:'var(--ink)', marginBottom:'16px' }}>Top Writers This Month</div>
            {writers.map((w:any, i:number) => (
              <div key={w.username||w.fullName||w.name} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'9px 0', borderBottom:'1px solid var(--border2)' }}>
                {w.avatarUrl
                  ? <img src={w.avatarUrl} alt={w.fullName} style={{ width:36,height:36,borderRadius:'9px',objectFit:'cover',flexShrink:0 }} />
                  : <div style={{ width:36,height:36,borderRadius:'9px',background:AVATAR_BG[i%AVATAR_BG.length],display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-serif)',fontWeight:900,fontSize:'13px',color:'#fff',flexShrink:0 }}>
                      {(w.fullName||w.name||'U')[0].toUpperCase()}
                    </div>
                }
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'13px',fontWeight:600,color:'var(--ink)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{w.fullName||w.name}</div>
                  <div style={{ fontSize:'11px',color:'var(--muted)',display:'flex',gap:'5px' }}>
                    <span style={{ overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{w.designation||w.role||''}</span>
                    {(w.followerCount||0)>0 && <span style={{ color:'var(--teal)',fontWeight:500,flexShrink:0 }}>· {(w.followerCount||0)>=1000?`${((w.followerCount||0)/1000).toFixed(1)}K`:w.followerCount}</span>}
                  </div>
                </div>
                <FollowButton targetUsername={w.username||w.email||w.id} targetName={w.fullName||w.name} size="sm" />
              </div>
            ))}
          </div>
          {/* Ad slot sidebar */}
          <div style={{ background:'var(--ad-bg)', border:'1px dashed var(--ad-border)', borderRadius:'var(--radius)', padding:'16px', textAlign:'center', minHeight:'120px', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'4px' }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--muted)', letterSpacing:'1px', textTransform:'uppercase' }}>Advertisement</div>
            <div style={{ fontSize:'11px', color:'var(--muted)' }}>Sidebar ad · 300×250</div>
          </div>
        </div>
      </div>
    </section>
  )
}
