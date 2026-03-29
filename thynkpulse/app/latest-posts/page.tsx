'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { apiGet } from '@/lib/api'
import { Post } from '@/types'
import { useContent } from '@/hooks/useContent'
import { Search } from 'lucide-react'

const CATS = ['All', 'EdTech', 'Educator', 'Sales Pro', 'Leadership', 'Innovation', 'Career', 'Research']
const GRADIENTS = [
  'linear-gradient(135deg,#EAF4F0,#C0E6DC)',
  'linear-gradient(135deg,#FEF0EA,#F7CBB8)',
  'linear-gradient(135deg,#EFF0FE,#C9CDF7)',
  'linear-gradient(135deg,#FEF8E8,#F5DFA0)',
  'linear-gradient(135deg,#F5EEF8,#DEC8F0)',
]

function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 9) * 0.06 }}
    >
      <Link href={`/post/${post.slug}`} className="pcard" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{
            height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, background: GRADIENTS[index % GRADIENTS.length]
          }}>
            {post.coverEmoji || '📝'}
          </div>
          <span style={{
            position: 'absolute', top: 14, left: 14, fontSize: '11px', fontWeight: 700,
            letterSpacing: '1px', textTransform: 'uppercase', padding: '5px 12px',
            borderRadius: '6px', background: 'rgba(10,95,85,.12)', color: 'var(--teal)',
            border: '1px solid rgba(10,95,85,.2)'
          }}>
            {post.category}
          </span>
        </div>
        <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35, marginBottom: 8 }}>
            {post.title}
          </div>
          {post.excerpt && (
            <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16, flex: 1 }}>
              {post.excerpt}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 14, borderTop: '1px solid var(--border2)', marginTop: 'auto' }}>
            <div className="avatar av-teal" style={{ width: 32, height: 32, fontSize: '13px', borderRadius: '9px' }}>
              {post.author?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {post.author?.fullName || 'Author'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{post.readTime} min read</div>
            </div>
            <div style={{ display: 'flex', gap: 8, fontSize: '12px', color: 'var(--muted)', flexShrink: 0 }}>
              <span>❤️ {post.likeCount}</span>
              <span>👁 {post.viewCount >= 1000 ? `${(post.viewCount / 1000).toFixed(1)}K` : post.viewCount}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

const STATIC_POSTS: Post[] = [
  { id: '1', slug: 'ai-classroom-engagement', title: 'How AI is Quietly Rewriting the Rules of Classroom Engagement', excerpt: 'From adaptive learning paths to AI-powered feedback loops — what\'s actually working in schools across India.', content: '', category: 'EdTech', tags: ['AI', 'EdTech'], status: 'approved', isFeatured: true, readTime: 8, viewCount: 12000, likeCount: 284, commentCount: 47, authorId: '1', coverEmoji: '🤖', createdAt: '', updatedAt: '', author: { id: '1', userId: '1', fullName: 'Rajesh Kumar', designation: 'EdTech Founder', instituteName: '', companyName: '', contactNumber: '', emailId: '', totalExp: '10', introduction: '', postCount: 24, followerCount: 5200, followingCount: 120, totalReads: 340000 } },
  { id: '2', slug: 'experiential-learning', title: 'Experiential Learning: Why It Works and How to Scale It', excerpt: 'A government school teacher on transforming assessment through real-world projects.', content: '', category: 'Educator', tags: ['Teaching'], status: 'approved', isFeatured: false, readTime: 5, viewCount: 4200, likeCount: 102, commentCount: 18, authorId: '2', coverEmoji: '🌱', createdAt: '', updatedAt: '', author: { id: '2', userId: '2', fullName: 'Priya Sharma', designation: 'Teacher', instituteName: 'Delhi Govt School', companyName: '', contactNumber: '', emailId: '', totalExp: '8', introduction: '', postCount: 12, followerCount: 1800, followingCount: 80, totalReads: 45000 } },
  { id: '3', slug: 'selling-to-schools', title: 'Selling to Schools: What Works (And What Doesn\'t)', excerpt: 'Honest lessons from 5 years and 300+ school conversations.', content: '', category: 'Sales Pro', tags: ['Sales'], status: 'approved', isFeatured: false, readTime: 6, viewCount: 9800, likeCount: 218, commentCount: 31, authorId: '3', coverEmoji: '📈', createdAt: '', updatedAt: '', author: { id: '3', userId: '3', fullName: 'Arjun Mehta', designation: 'Sales Director', instituteName: '', companyName: 'EduTech India', contactNumber: '', emailId: '', totalExp: '5', introduction: '', postCount: 8, followerCount: 2100, followingCount: 200, totalReads: 78000 } },
  { id: '4', slug: 'stem-gender-gap', title: 'The STEM Gender Gap: Can EdTech Fix What Classrooms Haven\'t?', excerpt: 'Research findings from 200+ schools across Tier-1 and Tier-2 Indian cities.', content: '', category: 'Research', tags: ['STEM', 'Gender'], status: 'approved', isFeatured: false, readTime: 9, viewCount: 7200, likeCount: 167, commentCount: 22, authorId: '4', coverEmoji: '🔬', createdAt: '', updatedAt: '', author: { id: '4', userId: '4', fullName: 'Nalini Verma', designation: 'Research Lead', instituteName: 'IIT Delhi', companyName: '', contactNumber: '', emailId: '', totalExp: '12', introduction: '', postCount: 16, followerCount: 3400, followingCount: 50, totalReads: 120000 } },
  { id: '5', slug: 'school-20-years', title: 'What I Learned Running a School for 20 Years', excerpt: 'Lessons from two decades of building an institution from the ground up.', content: '', category: 'Leadership', tags: ['Leadership'], status: 'approved', isFeatured: false, readTime: 11, viewCount: 15000, likeCount: 311, commentCount: 58, authorId: '5', coverEmoji: '🏫', createdAt: '', updatedAt: '', author: { id: '5', userId: '5', fullName: 'Suresh Kaushik', designation: 'Principal', instituteName: 'CBSE School', companyName: '', contactNumber: '', emailId: '', totalExp: '20', introduction: '', postCount: 6, followerCount: 890, followingCount: 30, totalReads: 56000 } },
  { id: '6', slug: 'teacher-to-founder', title: 'From Teacher to EdTech Founder: My Unfiltered Journey', excerpt: 'Three years of failures, pivots, and small wins — the story I wish someone had told me.', content: '', category: 'Career', tags: ['Career', 'EdTech'], status: 'approved', isFeatured: false, readTime: 7, viewCount: 11000, likeCount: 244, commentCount: 39, authorId: '6', coverEmoji: '💼', createdAt: '', updatedAt: '', author: { id: '6', userId: '6', fullName: 'Meena Rao', designation: 'Founder', instituteName: '', companyName: 'EduSpark', contactNumber: '', emailId: '', totalExp: '6', introduction: '', postCount: 19, followerCount: 4100, followingCount: 160, totalReads: 210000 } },
  { id: '7', slug: 'nep-2020-reality', title: 'NEP 2020: Two Years Later — What\'s Actually Changed on the Ground?', excerpt: 'An honest assessment from 50 teachers across urban and rural India.', content: '', category: 'Educator', tags: ['NEP', 'Policy'], status: 'approved', isFeatured: false, readTime: 10, viewCount: 18000, likeCount: 392, commentCount: 74, authorId: '7', coverEmoji: '📜', createdAt: '', updatedAt: '', author: { id: '7', userId: '7', fullName: 'Kavitha Rajan', designation: 'Education Policy Analyst', instituteName: '', companyName: '', contactNumber: '', emailId: '', totalExp: '15', introduction: '', postCount: 31, followerCount: 6800, followingCount: 90, totalReads: 450000 } },
  { id: '8', slug: 'gamification-learning', title: 'Gamification in Education: Beyond Points and Badges', excerpt: 'How leading schools are using game mechanics to genuinely improve learning outcomes.', content: '', category: 'Innovation', tags: ['Gamification', 'EdTech'], status: 'approved', isFeatured: false, readTime: 7, viewCount: 8400, likeCount: 195, commentCount: 27, authorId: '8', coverEmoji: '🎮', createdAt: '', updatedAt: '', author: { id: '8', userId: '8', fullName: 'Vikram Bose', designation: 'Learning Designer', instituteName: '', companyName: 'PlayLearn', contactNumber: '', emailId: '', totalExp: '7', introduction: '', postCount: 14, followerCount: 2900, followingCount: 180, totalReads: 98000 } },
  { id: '9', slug: 'teacher-wellbeing', title: 'The Teacher Burnout Crisis Nobody Wants to Talk About', excerpt: 'Mental health conversations are happening everywhere except the staffroom.', content: '', category: 'Educator', tags: ['Wellbeing', 'Teaching'], status: 'approved', isFeatured: false, readTime: 6, viewCount: 22000, likeCount: 518, commentCount: 91, authorId: '9', coverEmoji: '💚', createdAt: '', updatedAt: '', author: { id: '9', userId: '9', fullName: 'Ananya Singh', designation: 'School Counsellor', instituteName: 'Delhi Public School', companyName: '', contactNumber: '', emailId: '', totalExp: '9', introduction: '', postCount: 22, followerCount: 7200, followingCount: 140, totalReads: 280000 } },
]

export default function LatestPostsPage() {
  const pageContent = useContent('content.latest-posts')
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [page, setPage] = useState(1)
  const LIMIT = 9

  const { data, isLoading } = useQuery<{ data: Post[]; total: number }>({
    queryKey: ['latest-posts', activeFilter, page],
    queryFn: () => apiGet(`/posts?status=approved&limit=${LIMIT}&page=${page}${activeFilter !== 'All' ? `&category=${activeFilter}` : ''}`),
    staleTime: 3 * 60 * 1000,
  })

  const allPosts = data?.data?.length ? data.data : STATIC_POSTS
  const filteredPosts = search.trim()
    ? allPosts.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.author?.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.excerpt || '').toLowerCase().includes(search.toLowerCase())
      )
    : allPosts
  const posts = filteredPosts
  const total = data?.total || STATIC_POSTS.length
  const totalPages = Math.ceil(total / LIMIT)

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--latest-posts-bg, var(--cream))' }}>
        {/* Hero */}
        <div style={{ background: 'var(--latest-posts-hero-bg, var(--teal))', padding: '72px 5% 64px', color: 'var(--latest-posts-hero-color, #fff)' }}>
          <div style={{ maxWidth: 800 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 16 }}>
              {pageContent?.heroEyebrow || 'Community Feed'}
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: 'var(--latest-posts-hero-color, #fff)', lineHeight: 1.1, marginBottom: 16 }}>
              {pageContent?.heroTitle || 'Latest Posts'}
            </h1>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,.7)', lineHeight: 1.7, maxWidth: 540 }}>
              {pageContent?.heroSubtitle || 'Fresh articles from educators, EdTech founders, sales pros, and innovators shaping the future of education.'}
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '0 5%', position: 'sticky', top: 0, zIndex: 10 }}>
          {/* Search bar */}
          <div style={{ padding: '14px 0 0' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', background:'var(--cream)', border:'1.5px solid var(--border)', borderRadius:'10px', padding:'10px 16px', maxWidth:'480px' }}>
              <Search style={{ width:15, height:15, color:'var(--muted)', flexShrink:0 }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by post title or author name..."
                style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:'14px', fontFamily:'var(--font-sans)', color:'var(--ink)' }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ border:'none', background:'none', cursor:'pointer', color:'var(--muted)', fontSize:'16px', lineHeight:1 }}>×</button>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, overflowX: 'auto', padding: '14px 0', scrollbarWidth: 'none' }}>
            {CATS.map(cat => (
              <button key={cat} onClick={() => { setActiveFilter(cat); setPage(1) }}
                className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                style={{ whiteSpace: 'nowrap' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div style={{ padding: '48px 5%' }}>
          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="pcard" style={{ pointerEvents: 'none' }}>
                  <div className="skeleton" style={{ height: 160 }} />
                  <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton" style={{ height: 20, width: '80%' }} />
                    <div className="skeleton" style={{ height: 14 }} />
                    <div className="skeleton" style={{ height: 14, width: '70%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {posts.length === 0 ? (
                <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--muted)', fontFamily:'var(--font-sans)' }}>
                  <div style={{ fontSize:'40px', marginBottom:'12px' }}>🔍</div>
                  <div style={{ fontSize:'16px', fontWeight:600, marginBottom:'6px' }}>No results found</div>
                  <div style={{ fontSize:'13px' }}>Try a different search term or clear the filter</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
                  {posts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="btn-outline" style={{ padding: '10px 20px', opacity: page === 1 ? 0.4 : 1 }}>
                    ← Prev
                  </button>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--muted)' }}>
                    Page {page} of {totalPages}
                  </span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="btn-outline" style={{ padding: '10px 20px', opacity: page === totalPages ? 0.4 : 1 }}>
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
