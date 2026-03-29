'use client'
export const dynamic = 'force-dynamic'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { apiGet } from '@/lib/api'
import { useContent } from '@/hooks/useContent'
import { Post } from '@/types'

const GRADIENTS = [
  'linear-gradient(135deg,#FEF9EC,#F7E8BE)',
  'linear-gradient(135deg,#EAF4F0,#C0E6DC)',
  'linear-gradient(135deg,#FEF0EA,#F7CBB8)',
  'linear-gradient(135deg,#EFF0FE,#C9CDF7)',
  'linear-gradient(135deg,#F5EEF8,#DEC8F0)',
]

const STATIC_LEADERSHIP: Post[] = [
  { id: '1', slug: 'school-20-years', title: 'What I Learned Running a School for 20 Years', excerpt: 'Lessons from two decades of building an institution from the ground up — the wins, the failures, and everything in between.', content: '', category: 'Leadership', tags: ['Leadership', 'Management'], status: 'approved', isFeatured: true, readTime: 11, viewCount: 15000, likeCount: 311, commentCount: 58, authorId: '1', coverEmoji: '🏆', createdAt: '', updatedAt: '', author: { id: '1', userId: '1', fullName: 'Suresh Kaushik', designation: 'Principal & Founder', instituteName: 'CBSE School', companyName: '', contactNumber: '', emailId: '', totalExp: '20', introduction: '', postCount: 6, followerCount: 890, followingCount: 30, totalReads: 56000 } },
  { id: '2', slug: 'turned-down-edtech-deal', title: 'Why I Turned Down a ₹50L EdTech Deal (And What I Learned)', excerpt: 'Sometimes the best leadership decision is knowing when to say no — even when the pressure to say yes is enormous.', content: '', category: 'Leadership', tags: ['Decision Making', 'Leadership'], status: 'approved', isFeatured: false, readTime: 8, viewCount: 28700, likeCount: 645, commentCount: 144, authorId: '2', coverEmoji: '💰', createdAt: '', updatedAt: '', author: { id: '2', userId: '2', fullName: 'Anita Desai', designation: 'School Director', instituteName: 'Sunrise Academy', companyName: '', contactNumber: '', emailId: '', totalExp: '18', introduction: '', postCount: 11, followerCount: 2400, followingCount: 55, totalReads: 88000 } },
  { id: '3', slug: 'hiring-teachers-right', title: 'How to Hire Teachers Who Actually Stay (And Grow)', excerpt: 'After 200+ teacher interviews, I\'ve learned what questions actually predict long-term retention and performance.', content: '', category: 'Leadership', tags: ['HR', 'Leadership', 'Teachers'], status: 'approved', isFeatured: false, readTime: 9, viewCount: 11200, likeCount: 267, commentCount: 43, authorId: '3', coverEmoji: '👥', createdAt: '', updatedAt: '', author: { id: '3', userId: '3', fullName: 'Ramesh Iyer', designation: 'Vice Principal', instituteName: 'National Academy', companyName: '', contactNumber: '', emailId: '', totalExp: '16', introduction: '', postCount: 9, followerCount: 1200, followingCount: 70, totalReads: 42000 } },
  { id: '4', slug: 'data-driven-school', title: 'Building a Data-Driven School Without Losing the Human Touch', excerpt: 'How we used dashboards and analytics to improve outcomes while keeping teacher morale high.', content: '', category: 'Leadership', tags: ['Data', 'Management', 'EdTech'], status: 'approved', isFeatured: false, readTime: 7, viewCount: 8900, likeCount: 189, commentCount: 31, authorId: '4', coverEmoji: '📊', createdAt: '', updatedAt: '', author: { id: '4', userId: '4', fullName: 'Kavitha Rajan', designation: 'Academic Director', instituteName: 'Wisdom International School', companyName: '', contactNumber: '', emailId: '', totalExp: '14', introduction: '', postCount: 17, followerCount: 3100, followingCount: 85, totalReads: 95000 } },
  { id: '5', slug: 'parent-communication-strategy', title: 'The Parent Communication Strategy That Transformed Our School Culture', excerpt: 'From daily WhatsApp chaos to structured, purposeful communication — a 12-month transformation story.', content: '', category: 'Leadership', tags: ['Parents', 'Communication', 'Culture'], status: 'approved', isFeatured: false, readTime: 6, viewCount: 13400, likeCount: 298, commentCount: 52, authorId: '5', coverEmoji: '💬', createdAt: '', updatedAt: '', author: { id: '5', userId: '5', fullName: 'Meera Pillai', designation: 'Principal', instituteName: 'St. Thomas School', companyName: '', contactNumber: '', emailId: '', totalExp: '12', introduction: '', postCount: 8, followerCount: 980, followingCount: 40, totalReads: 38000 } },
  { id: '6', slug: 'edtech-procurement-guide', title: 'The Principal\'s Guide to EdTech Procurement (Without Getting Sold To)', excerpt: 'How to evaluate EdTech vendors on your terms — a 10-point framework from 5 years of procurement experience.', content: '', category: 'Leadership', tags: ['Procurement', 'EdTech', 'Leadership'], status: 'approved', isFeatured: false, readTime: 10, viewCount: 19600, likeCount: 441, commentCount: 68, authorId: '6', coverEmoji: '📋', createdAt: '', updatedAt: '', author: { id: '6', userId: '6', fullName: 'Rajiv Menon', designation: 'School Director', instituteName: 'Delhi International', companyName: '', contactNumber: '', emailId: '', totalExp: '22', introduction: '', postCount: 13, followerCount: 4500, followingCount: 95, totalReads: 176000 } },
]

const LEADERSHIP_PILLARS = [
  { icon: '🎯', title: 'Vision & Strategy', desc: 'Setting direction for your institution' },
  { icon: '👥', title: 'People & Culture', desc: 'Building high-performing teams' },
  { icon: '📊', title: 'Data & Outcomes', desc: 'Measuring what matters' },
  { icon: '🤝', title: 'Community Relations', desc: 'Engaging parents and stakeholders' },
  { icon: '💡', title: 'Innovation & Change', desc: 'Leading transformation' },
  { icon: '💰', title: 'Finance & Governance', desc: 'Running a sustainable institution' },
]

export default function SchoolLeadershipPage() {
  const pageContent = useContent(\'content.school-leadership')
  const { data, isLoading } = useQuery<{ data: Post[] }>({
    queryKey: ['leadership-posts'],
    queryFn: () => apiGet(`/posts?status=approved&category=Leadership&limit=9`),
    staleTime: 3 * 60 * 1000,
  })
  const posts = data?.data?.length ? data.data : STATIC_LEADERSHIP
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,#C9922A 0%,#E5B64A 100%)', padding: '72px 5% 64px' }}>
          <div style={{ maxWidth: 800 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: 16 }}>
              🏆 School Leadership
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
              School Leadership
            </h1>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,.85)', lineHeight: 1.7, maxWidth: 560 }}>
              Insights from principals, directors, and administrators who are navigating the complex realities of leading educational institutions in modern India.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div style={{ background: 'var(--cream)', padding: '36px 5%', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12 }}>
            {LEADERSHIP_PILLARS.map(p => (
              <div key={p.title}
                style={{ padding: '16px', borderRadius: 12, background: '#fff', border: '1px solid var(--border)', cursor: 'pointer' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{p.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{p.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '48px 5%', background: 'var(--cream)' }}>
          {/* Featured */}
          {!isLoading && featured && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
              <Link href={`/post/${featured.slug}`}
                className="leader-featured" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 0, borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,.08)', textDecoration: 'none', color: 'inherit', border: '1.5px solid var(--border)', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, background: GRADIENTS[0] }}>
                  {featured.coverEmoji || '🏆'}
                </div>
                <div style={{ padding: '36px 32px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>
                    ⭐ Featured Leadership Article
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 10 }}>
                    {featured.title}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 20 }}>
                    {featured.excerpt}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar" style={{ width: 36, height: 36, borderRadius: '10px', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '14px', color: '#fff' }}>
                      {featured.author?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{featured.author?.fullName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{featured.author?.designation} · {featured.readTime} min read</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--muted)' }}>
                      👁 {(featured.viewCount / 1000).toFixed(1)}K · ❤️ {featured.likeCount}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Articles grid */}
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
                      {post.coverEmoji || '🏆'}
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
                        <div className="avatar" style={{ width: 30, height: 30, borderRadius: '8px', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '12px', color: '#fff' }}>
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
            <Link href="/latest-posts?category=Leadership" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              View All Leadership Articles →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
