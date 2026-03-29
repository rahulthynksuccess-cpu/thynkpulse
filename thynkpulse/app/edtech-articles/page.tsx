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

const SUBCATS = ['All EdTech', 'AI & ML', 'Ed-Finance', 'Products', 'Startups', 'Research', 'Policy']
const GRADIENTS = [
  'linear-gradient(135deg,#EAF4F0,#C0E6DC)',
  'linear-gradient(135deg,#FEF0EA,#F7CBB8)',
  'linear-gradient(135deg,#EFF0FE,#C9CDF7)',
  'linear-gradient(135deg,#FEF8E8,#F5DFA0)',
  'linear-gradient(135deg,#F5EEF8,#DEC8F0)',
]

const STATIC_EDTECH: Post[] = [
  { id: '1', slug: 'ai-classroom-engagement', title: 'How AI is Quietly Rewriting the Rules of Classroom Engagement', excerpt: 'From adaptive learning paths to AI-powered feedback loops — what\'s actually working in schools across India.', content: '', category: 'EdTech', tags: ['AI', 'EdTech'], status: 'approved', isFeatured: true, readTime: 8, viewCount: 12000, likeCount: 284, commentCount: 47, authorId: '1', coverEmoji: '🤖', createdAt: '', updatedAt: '', author: { id: '1', userId: '1', fullName: 'Rajesh Kumar', designation: 'EdTech Founder', instituteName: '', companyName: 'EduTech India', contactNumber: '', emailId: '', totalExp: '10', introduction: '', postCount: 24, followerCount: 5200, followingCount: 120, totalReads: 340000 } },
  { id: '2', slug: 'edtech-investors-2025', title: 'What EdTech Investors Actually Look for in 2025', excerpt: 'Insights from conversations with 20+ VCs who actively fund education startups.', content: '', category: 'EdTech', tags: ['Funding', 'Startup'], status: 'approved', isFeatured: false, readTime: 12, viewCount: 17300, likeCount: 428, commentCount: 71, authorId: '2', coverEmoji: '💡', createdAt: '', updatedAt: '', author: { id: '2', userId: '2', fullName: 'Nalini Verma', designation: 'Research Lead', instituteName: 'IIT Delhi', companyName: '', contactNumber: '', emailId: '', totalExp: '12', introduction: '', postCount: 16, followerCount: 3400, followingCount: 50, totalReads: 120000 } },
  { id: '3', slug: 'stem-gender-gap', title: 'The STEM Gender Gap: Can EdTech Fix What Classrooms Haven\'t?', excerpt: 'Research findings from 200+ schools across Tier-1 and Tier-2 Indian cities.', content: '', category: 'EdTech', tags: ['STEM', 'Gender', 'Research'], status: 'approved', isFeatured: false, readTime: 9, viewCount: 7200, likeCount: 167, commentCount: 22, authorId: '3', coverEmoji: '🔬', createdAt: '', updatedAt: '', author: { id: '3', userId: '3', fullName: 'Priya Sharma', designation: 'Research Analyst', instituteName: 'IIT Bombay', companyName: '', contactNumber: '', emailId: '', totalExp: '8', introduction: '', postCount: 12, followerCount: 1800, followingCount: 80, totalReads: 45000 } },
  { id: '4', slug: 'gpt-classroom-review', title: "GPT in the Classroom: A Teacher's 6-Month Honest Review", excerpt: 'After six months of experimenting with AI tools, here\'s what actually moved the needle.', content: '', category: 'EdTech', tags: ['AI', 'Teaching', 'GPT'], status: 'approved', isFeatured: false, readTime: 10, viewCount: 34200, likeCount: 891, commentCount: 203, authorId: '4', coverEmoji: '🧠', createdAt: '', updatedAt: '', author: { id: '4', userId: '4', fullName: 'Vikram Bose', designation: 'Teacher & Technologist', instituteName: 'Delhi Public School', companyName: '', contactNumber: '', emailId: '', totalExp: '7', introduction: '', postCount: 14, followerCount: 2900, followingCount: 180, totalReads: 98000 } },
  { id: '5', slug: 'gamification-learning', title: 'Gamification in Education: Beyond Points and Badges', excerpt: 'How leading schools are using game mechanics to genuinely improve learning outcomes.', content: '', category: 'EdTech', tags: ['Gamification', 'EdTech'], status: 'approved', isFeatured: false, readTime: 7, viewCount: 8400, likeCount: 195, commentCount: 27, authorId: '5', coverEmoji: '🎮', createdAt: '', updatedAt: '', author: { id: '5', userId: '5', fullName: 'Meena Rao', designation: 'Learning Designer', instituteName: '', companyName: 'PlayLearn', contactNumber: '', emailId: '', totalExp: '6', introduction: '', postCount: 19, followerCount: 4100, followingCount: 160, totalReads: 210000 } },
  { id: '6', slug: 'teacher-to-founder', title: 'From Teacher to EdTech Founder: My Unfiltered Journey', excerpt: 'Three years of failures, pivots, and small wins — the story I wish someone had told me.', content: '', category: 'EdTech', tags: ['Career', 'Startup'], status: 'approved', isFeatured: false, readTime: 7, viewCount: 11000, likeCount: 244, commentCount: 39, authorId: '6', coverEmoji: '💼', createdAt: '', updatedAt: '', author: { id: '6', userId: '6', fullName: 'Arjun Mehta', designation: 'Founder', instituteName: '', companyName: 'EduSpark', contactNumber: '', emailId: '', totalExp: '5', introduction: '', postCount: 8, followerCount: 2100, followingCount: 200, totalReads: 78000 } },
]

const FEATURED_TOPICS = [
  { icon: '🤖', title: 'AI & Machine Learning', count: '248 articles' },
  { icon: '💰', title: 'EdTech Funding', count: '134 articles' },
  { icon: '📱', title: 'EdTech Products', count: '312 articles' },
  { icon: '🚀', title: 'Startups & Innovation', count: '196 articles' },
  { icon: '🔬', title: 'Ed Research', count: '89 articles' },
  { icon: '📋', title: 'Ed Policy', count: '167 articles' },
]

export default function EdTechArticlesPage() {
  const pageContent = useContent('content.edtech-articles')
  const [activeFilter, setActiveFilter] = useState('All EdTech')

  const { data, isLoading } = useQuery<{ data: Post[] }>({
    queryKey: ['edtech-articles', activeFilter],
    queryFn: () => apiGet(`/posts?status=approved&category=EdTech&limit=9`),
    staleTime: 3 * 60 * 1000,
  })
  const posts = data?.data?.length ? data.data : STATIC_EDTECH

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, var(--teal) 0%, #0D7A6D 100%)', padding: '72px 5% 64px' }}>
          <div style={{ maxWidth: 800 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 16 }}>
              EdTech Category
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
              EdTech Articles
            </h1>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,.75)', lineHeight: 1.7, maxWidth: 560 }}>
              In-depth analysis, product deep-dives, funding news, and thought leadership from EdTech founders, investors, and practitioners.
            </p>
          </div>
        </div>

        {/* Topic pills */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '28px 5%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
            {FEATURED_TOPICS.map(topic => (
              <button key={topic.title}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, background: 'var(--cream)', border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left', transition: 'all .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--teal)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(10,95,85,.04)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--cream)' }}>
                <span style={{ fontSize: 22 }}>{topic.icon}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{topic.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{topic.count}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sub-filter */}
        <div style={{ background: 'var(--cream)', padding: '0 5%', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 4, padding: '14px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {SUBCATS.map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                style={{ whiteSpace: 'nowrap' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div style={{ padding: '48px 5%' }}>
          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="pcard">
                  <div className="skeleton" style={{ height: 160 }} />
                  <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton" style={{ height: 20, width: '80%' }} />
                    <div className="skeleton" style={{ height: 14 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
              {posts.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link href={`/post/${post.slug}`} className="pcard" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, background: GRADIENTS[i % GRADIENTS.length] }}>
                        {post.coverEmoji || '💡'}
                      </div>
                      <span style={{ position: 'absolute', top: 14, left: 14, fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '5px 12px', borderRadius: '6px', background: 'rgba(10,95,85,.12)', color: 'var(--teal)', border: '1px solid rgba(10,95,85,.2)' }}>
                        EdTech
                      </span>
                    </div>
                    <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35, marginBottom: 8 }}>
                        {post.title}
                      </div>
                      {post.excerpt && (
                        <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7, flex: 1, marginBottom: 16 }}>
                          {post.excerpt}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 14, borderTop: '1px solid var(--border2)', marginTop: 'auto' }}>
                        <div className="avatar av-teal" style={{ width: 32, height: 32, fontSize: '13px', borderRadius: '9px' }}>
                          {post.author?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{post.author?.fullName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{post.readTime} min read</div>
                        </div>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, fontSize: '12px', color: 'var(--muted)' }}>
                          <span>❤️ {post.likeCount}</span>
                          <span>👁 {post.viewCount >= 1000 ? `${(post.viewCount / 1000).toFixed(1)}K` : post.viewCount}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/latest-posts?category=EdTech" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              View All EdTech Articles →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
