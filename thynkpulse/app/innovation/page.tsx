'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { apiGet } from '@/lib/api'
import { useContent } from '@/hooks/useContent'
import { Post } from '@/types'

const GRADIENTS = [
  'linear-gradient(135deg,#EFF0FE,#C9CDF7)',
  'linear-gradient(135deg,#EAF4F0,#C0E6DC)',
  'linear-gradient(135deg,#FEF0EA,#F7CBB8)',
  'linear-gradient(135deg,#FEF8E8,#F5DFA0)',
  'linear-gradient(135deg,#F5EEF8,#DEC8F0)',
]

const STATIC_INNOVATION: Post[] = [
  { id: '1', slug: 'gamification-learning', title: 'Gamification in Education: Beyond Points and Badges', excerpt: 'How leading schools are using game mechanics to genuinely improve learning outcomes — not just engagement metrics.', content: '', category: 'Innovation', tags: ['Gamification', 'EdTech'], status: 'approved', isFeatured: true, readTime: 7, viewCount: 8400, likeCount: 195, commentCount: 27, authorId: '1', coverEmoji: '🎮', createdAt: '', updatedAt: '', author: { id: '1', userId: '1', fullName: 'Vikram Bose', designation: 'Learning Designer', instituteName: '', companyName: 'PlayLearn', contactNumber: '', emailId: '', totalExp: '7', introduction: '', postCount: 14, followerCount: 2900, followingCount: 180, totalReads: 98000 } },
  { id: '2', slug: 'ar-vr-classrooms', title: 'AR & VR in the Classroom: A Practical Guide for 2025', excerpt: 'Skip the hype. Here\'s what actually works, what\'s affordable, and what the research says about immersive learning.', content: '', category: 'Innovation', tags: ['AR', 'VR', 'EdTech'], status: 'approved', isFeatured: false, readTime: 9, viewCount: 12300, likeCount: 287, commentCount: 44, authorId: '2', coverEmoji: '🥽', createdAt: '', updatedAt: '', author: { id: '2', userId: '2', fullName: 'Nalini Verma', designation: 'Research Lead', instituteName: 'IIT Delhi', companyName: '', contactNumber: '', emailId: '', totalExp: '12', introduction: '', postCount: 16, followerCount: 3400, followingCount: 50, totalReads: 120000 } },
  { id: '3', slug: 'project-based-learning', title: 'Project-Based Learning at Scale: Lessons from 200 Schools', excerpt: 'The implementation challenges, teacher training hurdles, and student outcomes from India\'s largest PBL pilot.', content: '', category: 'Innovation', tags: ['PBL', 'Pedagogy', 'Innovation'], status: 'approved', isFeatured: false, readTime: 11, viewCount: 9700, likeCount: 218, commentCount: 36, authorId: '3', coverEmoji: '🛠️', createdAt: '', updatedAt: '', author: { id: '3', userId: '3', fullName: 'Kavitha Rajan', designation: 'Education Policy Analyst', instituteName: '', companyName: '', contactNumber: '', emailId: '', totalExp: '15', introduction: '', postCount: 31, followerCount: 6800, followingCount: 90, totalReads: 450000 } },
  { id: '4', slug: 'micro-credentials-india', title: 'Micro-Credentials: The Future of Teacher Professional Development?', excerpt: 'Short, stackable, verifiable — could micro-credentials finally fix India\'s teacher upskilling crisis?', content: '', category: 'Innovation', tags: ['Teacher Training', 'Credentials'], status: 'approved', isFeatured: false, readTime: 8, viewCount: 6800, likeCount: 154, commentCount: 21, authorId: '4', coverEmoji: '🎖️', createdAt: '', updatedAt: '', author: { id: '4', userId: '4', fullName: 'Arjun Mehta', designation: 'L&D Strategist', instituteName: '', companyName: 'SkillPath', contactNumber: '', emailId: '', totalExp: '9', introduction: '', postCount: 8, followerCount: 2100, followingCount: 200, totalReads: 78000 } },
  { id: '5', slug: 'ai-assessment-tools', title: 'AI-Powered Assessment Tools: What\'s Actually Saving Teachers Time', excerpt: 'A hands-on review of 8 AI assessment platforms used across CBSE, ICSE, and IB schools in India.', content: '', category: 'Innovation', tags: ['AI', 'Assessment', 'EdTech'], status: 'approved', isFeatured: false, readTime: 10, viewCount: 15600, likeCount: 342, commentCount: 58, authorId: '5', coverEmoji: '📝', createdAt: '', updatedAt: '', author: { id: '5', userId: '5', fullName: 'Meena Rao', designation: 'EdTech Researcher', instituteName: '', companyName: 'EduSpark', contactNumber: '', emailId: '', totalExp: '6', introduction: '', postCount: 19, followerCount: 4100, followingCount: 160, totalReads: 210000 } },
  { id: '6', slug: 'hybrid-learning-model', title: 'The Hybrid Learning Model That Actually Works (2025 Edition)', excerpt: 'Post-pandemic, most hybrid models failed. Here\'s what the schools that got it right did differently.', content: '', category: 'Innovation', tags: ['Hybrid Learning', 'Blended', 'EdTech'], status: 'approved', isFeatured: false, readTime: 8, viewCount: 11200, likeCount: 256, commentCount: 41, authorId: '6', coverEmoji: '🏗️', createdAt: '', updatedAt: '', author: { id: '6', userId: '6', fullName: 'Rajesh Kumar', designation: 'Academic Director', instituteName: 'Horizon International', companyName: '', contactNumber: '', emailId: '', totalExp: '10', introduction: '', postCount: 24, followerCount: 5200, followingCount: 120, totalReads: 340000 } },
]

const INNOVATION_AREAS = [
  { icon: '🤖', label: 'AI in Education' },
  { icon: '🎮', label: 'Gamification' },
  { icon: '🥽', label: 'AR / VR' },
  { icon: '🛠️', label: 'Project-Based Learning' },
  { icon: '📊', label: 'Learning Analytics' },
  { icon: '🔄', label: 'Blended Learning' },
  { icon: '📱', label: 'Mobile Learning' },
  { icon: '🧬', label: 'Neuroscience & Learning' },
]

export default function InnovationPage() {
  const [search, setSearch] = useState('')
  const pageContent = useContent('content.innovation')
  const { data, isLoading } = useQuery<{ data: Post[] }>({
    queryKey: ['innovation-posts'],
    queryFn: () => apiGet(`/posts?status=approved&category=Innovation&limit=9`),
    staleTime: 3 * 60 * 1000,
  })
  const posts = data?.data?.length ? data.data : STATIC_INNOVATION
  const filteredPosts = search.trim()
    ? posts.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.author?.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.excerpt || '').toLowerCase().includes(search.toLowerCase())
      )
    : posts
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,#3D1F5E 0%,#6B35A8 50%,#0A5F55 100%)', padding: '72px 5% 64px' }}>
          <div style={{ maxWidth: 800 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 16 }}>
              {pageContent?.heroEyebrow || '💡 Innovation Hub'}
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
              {pageContent?.heroTitle || 'Innovation in Education'}
            </h1>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,.75)', lineHeight: 1.7, maxWidth: 580 }}>
              {pageContent?.heroSubtitle || "Cutting-edge ideas, experimental models, and real-world case studies from educators and technologists reimagining how learning happens."}
            </p>
          </div>
        </div>

        {/* Innovation areas */}
        <div style={{ background: '#fff', padding: '28px 5%', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {INNOVATION_AREAS.map(area => (
            <button key={area.label}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 100, background: 'var(--cream)', border: '1px solid var(--border)', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 13, color: 'var(--ink)', fontWeight: 500, transition: 'all .2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'var(--teal)'; el.style.color = '#fff'; el.style.borderColor = 'var(--teal)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'var(--cream)'; el.style.color = 'var(--ink)'; el.style.borderColor = 'var(--border)' }}>
              <span>{area.icon}</span> {area.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '48px 5%' }}>
          {/* Featured article */}
          {!isLoading && featured && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
              <Link href={`/post/${featured.slug}`}
                className="innov-featured" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 0, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(61,31,94,.15)', textDecoration: 'none', color: 'inherit', border: '1.5px solid rgba(61,31,94,.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100, background: GRADIENTS[0], minHeight: 300 }}>
                  {featured.coverEmoji || '💡'}
                </div>
                <div style={{ padding: '40px 36px', background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--plum)', marginBottom: 12 }}>
                    ⭐ Featured Innovation
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 12 }}>
                    {featured.title}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 20 }}>
                    {featured.excerpt}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar av-teal" style={{ width: 38, height: 38, borderRadius: '11px' }}>
                      {featured.author?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{featured.author?.fullName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{featured.readTime} min read</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--muted)' }}>
                      👁 {(featured.viewCount / 1000).toFixed(1)}K · ❤️ {featured.likeCount}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="pcard">
                  <div className="skeleton" style={{ height: 160 }} />
                  <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton" style={{ height: 20, width: '80%' }} />
                    <div className="skeleton" style={{ height: 14 }} />
                  </div>
                </div>
              ))
              : rest.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link href={`/post/${post.slug}`} className="pcard" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, background: GRADIENTS[(i + 1) % GRADIENTS.length] }}>
                      {post.coverEmoji || '💡'}
                    </div>
                    <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35, marginBottom: 8 }}>
                        {post.title}
                      </div>
                      {post.excerpt && (
                        <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7, flex: 1, marginBottom: 14 }}>
                          {post.excerpt.slice(0, 110)}...
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border2)', marginTop: 'auto' }}>
                        <div className="avatar av-teal" style={{ width: 30, height: 30, fontSize: '12px', borderRadius: '8px' }}>
                          {post.author?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.author?.fullName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{post.readTime} min read</div>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>❤️ {post.likeCount}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/latest-posts?category=Innovation" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              View All Innovation Articles →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
