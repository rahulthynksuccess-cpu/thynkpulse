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

const TRENDING_POSTS: Post[] = [
  { id: '1', slug: 'gpt-classroom-review', title: "GPT in the Classroom: A Teacher's 6-Month Honest Review", excerpt: 'After half a year of experimenting, here\'s what actually worked, what flopped, and what surprised me the most.', content: '', category: 'EdTech', tags: ['AI', 'Teaching'], status: 'approved', isFeatured: true, readTime: 10, viewCount: 34200, likeCount: 891, commentCount: 203, authorId: '1', coverEmoji: '🤖', createdAt: '', updatedAt: '', author: { id: '1', userId: '1', fullName: 'Rajesh Kumar', designation: 'EdTech Founder', instituteName: '', companyName: '', contactNumber: '', emailId: '', totalExp: '10', introduction: '', postCount: 24, followerCount: 5200, followingCount: 120, totalReads: 340000 } },
  { id: '2', slug: 'turned-down-edtech-deal', title: 'Why I Turned Down a ₹50L EdTech Deal (And What I Learned)', excerpt: 'Sometimes the best business decision is knowing when to say no — even to big money.', content: '', category: 'Leadership', tags: ['Leadership', 'EdTech'], status: 'approved', isFeatured: false, readTime: 8, viewCount: 28700, likeCount: 645, commentCount: 144, authorId: '2', coverEmoji: '💰', createdAt: '', updatedAt: '', author: { id: '2', userId: '2', fullName: 'Suresh Kaushik', designation: 'Principal & Entrepreneur', instituteName: '', companyName: '', contactNumber: '', emailId: '', totalExp: '20', introduction: '', postCount: 6, followerCount: 890, followingCount: 30, totalReads: 56000 } },
  { id: '3', slug: 'education-sales-playbook', title: 'The Education Sales Playbook Nobody Talks About', excerpt: 'The unspoken rules of selling to schools — from gatekeepers to procurement cycles.', content: '', category: 'Sales Pro', tags: ['Sales', 'EdTech'], status: 'approved', isFeatured: false, readTime: 9, viewCount: 22100, likeCount: 512, commentCount: 88, authorId: '3', coverEmoji: '📊', createdAt: '', updatedAt: '', author: { id: '3', userId: '3', fullName: 'Arjun Mehta', designation: 'Sales Director', instituteName: '', companyName: 'EduTech India', contactNumber: '', emailId: '', totalExp: '5', introduction: '', postCount: 8, followerCount: 2100, followingCount: 200, totalReads: 78000 } },
  { id: '4', slug: 'quit-private-school', title: 'I Quit a Private School to Teach in a Government School. Here\'s Why.', excerpt: 'A personal essay on purpose, pay cuts, and what teaching really means.', content: '', category: 'Educator', tags: ['Teaching', 'Career'], status: 'approved', isFeatured: false, readTime: 7, viewCount: 19800, likeCount: 1200, commentCount: 317, authorId: '4', coverEmoji: '🏫', createdAt: '', updatedAt: '', author: { id: '4', userId: '4', fullName: 'Priya Sharma', designation: 'Govt School Teacher', instituteName: 'Delhi Govt School', companyName: '', contactNumber: '', emailId: '', totalExp: '8', introduction: '', postCount: 12, followerCount: 1800, followingCount: 80, totalReads: 45000 } },
  { id: '5', slug: 'edtech-investors-2025', title: 'What EdTech Investors Actually Look for in 2025', excerpt: 'Insights from conversations with 20+ VCs who fund education startups.', content: '', category: 'EdTech', tags: ['Funding', 'Startup'], status: 'approved', isFeatured: false, readTime: 12, viewCount: 17300, likeCount: 428, commentCount: 71, authorId: '5', coverEmoji: '💡', createdAt: '', updatedAt: '', author: { id: '5', userId: '5', fullName: 'Nalini Verma', designation: 'Research Lead', instituteName: 'IIT Delhi', companyName: '', contactNumber: '', emailId: '', totalExp: '12', introduction: '', postCount: 16, followerCount: 3400, followingCount: 50, totalReads: 120000 } },
  { id: '6', slug: 'teacher-burnout-crisis', title: 'The Teacher Burnout Crisis Nobody Wants to Talk About', excerpt: 'Mental health conversations are happening everywhere except the staffroom.', content: '', category: 'Educator', tags: ['Wellbeing', 'Teaching'], status: 'approved', isFeatured: false, readTime: 6, viewCount: 22000, likeCount: 518, commentCount: 91, authorId: '6', coverEmoji: '💚', createdAt: '', updatedAt: '', author: { id: '6', userId: '6', fullName: 'Ananya Singh', designation: 'School Counsellor', instituteName: 'Delhi Public School', companyName: '', contactNumber: '', emailId: '', totalExp: '9', introduction: '', postCount: 22, followerCount: 7200, followingCount: 140, totalReads: 280000 } },
  { id: '7', slug: 'stem-gender-gap', title: 'The STEM Gender Gap: Can EdTech Fix What Classrooms Haven\'t?', excerpt: 'Research findings from 200+ schools across Tier-1 and Tier-2 Indian cities.', content: '', category: 'Research', tags: ['STEM', 'Gender'], status: 'approved', isFeatured: false, readTime: 9, viewCount: 7200, likeCount: 167, commentCount: 22, authorId: '7', coverEmoji: '🔬', createdAt: '', updatedAt: '', author: { id: '7', userId: '7', fullName: 'Kavitha Rajan', designation: 'Education Policy Analyst', instituteName: '', companyName: '', contactNumber: '', emailId: '', totalExp: '15', introduction: '', postCount: 31, followerCount: 6800, followingCount: 90, totalReads: 450000 } },
  { id: '8', slug: 'nep-ground-reality', title: 'NEP 2020: Two Years Later — What\'s Actually Changed on the Ground?', excerpt: 'An honest assessment from 50 teachers across urban and rural India.', content: '', category: 'Educator', tags: ['NEP', 'Policy'], status: 'approved', isFeatured: false, readTime: 10, viewCount: 18000, likeCount: 392, commentCount: 74, authorId: '8', coverEmoji: '📜', createdAt: '', updatedAt: '', author: { id: '8', userId: '8', fullName: 'Meena Rao', designation: 'Policy Researcher', instituteName: '', companyName: '', contactNumber: '', emailId: '', totalExp: '6', introduction: '', postCount: 19, followerCount: 4100, followingCount: 160, totalReads: 210000 } },
]

const TRENDING_TOPICS = ['AI in Education', 'NEP 2020', 'EdTech Sales', 'School Leadership', 'Teacher Wellbeing', 'Gamification', 'Ed-Finance', 'STEM', 'Higher Education', 'Curriculum Design']

export default function TrendingNowPage() {
  const pageContent = useContent('content.trending')
  const [activePeriod, setActivePeriod] = useState('This Week')

  const { data, isLoading } = useQuery<{ data: Post[] }>({
    queryKey: ['trending-posts', activePeriod],
    queryFn: () => apiGet(`/posts?status=approved&limit=8`),
    staleTime: 5 * 60 * 1000,
  })
  const posts = data?.data?.length ? data.data : TRENDING_POSTS

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#fff' }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, var(--coral) 0%, #c0392b 100%)', padding: '72px 5% 64px', color: '#fff' }}>
          <div style={{ maxWidth: 800 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: 16 }}>
              🔥 What\'s Hot
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
              Trending Now
            </h1>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,.8)', lineHeight: 1.7, maxWidth: 540 }}>
              The articles the community can\'t stop reading, sharing, and discussing right now.
            </p>
          </div>
        </div>

        {/* Period filter */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '0 5%' }}>
          <div style={{ display: 'flex', gap: 4, padding: '14px 0' }}>
            {PERIODS.map(p => (
              <button key={p} onClick={() => setActivePeriod(p)}
                className={`filter-btn ${activePeriod === p ? 'active' : ''}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="trending-layout" style={{ padding: '48px 5%', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, maxWidth: 1200, margin: '0 auto' }}>
          {/* Main list */}
          <div>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '24px 0', borderBottom: '1px solid var(--border2)' }}>
                  <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton" style={{ height: 20, width: '80%' }} />
                    <div className="skeleton" style={{ height: 14, width: '60%' }} />
                  </div>
                </div>
              ))
            ) : (
              posts.map((post, i) => (
                <motion.div key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <Link href={`/post/${post.slug}`}
                    style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: '24px 0', borderBottom: '1px solid var(--border2)', textDecoration: 'none', color: 'inherit' }}>
                    {/* Rank */}
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 900, color: 'var(--parchment)', lineHeight: 1, flexShrink: 0, minWidth: 48, paddingTop: 4 }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    {/* Emoji */}
                    <div style={{ width: 60, height: 60, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, background: GRADIENTS[i % GRADIENTS.length], flexShrink: 0 }}>
                      {post.coverEmoji || '📝'}
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--coral)', marginBottom: 6 }}>
                        {post.category}
                      </div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 19, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35, marginBottom: 8 }}>
                        {post.title}
                      </div>
                      <div style={{ display: 'flex', gap: 14, fontSize: '12px', color: 'var(--muted)', flexWrap: 'wrap' }}>
                        <span>✍️ {post.author?.fullName}</span>
                        <span>👁 {post.viewCount >= 1000 ? `${(post.viewCount / 1000).toFixed(1)}K` : post.viewCount} reads</span>
                        <span>❤️ {post.likeCount >= 1000 ? `${(post.likeCount / 1000).toFixed(1)}K` : post.likeCount}</span>
                        <span>💬 {post.commentCount}</span>
                        <span>⏱ {post.readTime} min</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="trending-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="sidebar-card">
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 16 }}>
                🔖 Trending Topics
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TRENDING_TOPICS.map(t => (
                  <Link key={t} href={`/latest-posts?q=${encodeURIComponent(t)}`} className="topic-tag">{t}</Link>
                ))}
              </div>
            </div>
            <div className="sidebar-card" style={{ background: 'linear-gradient(135deg,#FEF0EA,#F7CBB8)', border: '1.5px solid rgba(232,81,42,.15)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 700, color: 'var(--coral)', marginBottom: 8 }}>
                ✍️ Share Your Insights
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16 }}>
                Your experience could be trending next. Write for the Thynk Pulse community — it\'s free and takes 5 minutes to start.
              </p>
              <Link href="/write" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', fontSize: 13 }}>
                Start Writing →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
