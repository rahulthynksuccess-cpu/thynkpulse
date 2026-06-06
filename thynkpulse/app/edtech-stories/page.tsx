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
  'linear-gradient(135deg,#EAF4F0,#C0E6DC)',
  'linear-gradient(135deg,#FEF0EA,#F7CBB8)',
  'linear-gradient(135deg,#EFF0FE,#C9CDF7)',
  'linear-gradient(135deg,#FEF8E8,#F5DFA0)',
  'linear-gradient(135deg,#F5EEF8,#DEC8F0)',
]

const STATIC_STORIES: Post[] = [
  { id: '1', slug: 'teacher-to-founder', title: 'From Teacher to EdTech Founder: My Unfiltered Journey', excerpt: 'Three years of failures, pivots, and small wins — the story I wish someone had told me before I started.', content: '', category: 'Educator', tags: ['Career', 'EdTech', 'Story'], status: 'approved', isFeatured: true, readTime: 7, viewCount: 11000, likeCount: 244, commentCount: 39, authorId: '1', coverEmoji: '💼', createdAt: '', updatedAt: '', author: { id: '1', userId: '1', fullName: 'Meena Rao', designation: 'Founder, EduSpark', instituteName: '', companyName: 'EduSpark', contactNumber: '', emailId: '', totalExp: '6', introduction: '', postCount: 19, followerCount: 4100, followingCount: 160, totalReads: 210000 } },
  { id: '2', slug: 'quit-private-school', title: 'I Quit a Private School to Teach in a Government School. Here\'s Why.', excerpt: 'A personal essay on purpose, pay cuts, and what teaching really means when you strip away the perks.', content: '', category: 'Educator', tags: ['Teaching', 'Career', 'Story'], status: 'approved', isFeatured: false, readTime: 7, viewCount: 19800, likeCount: 1200, commentCount: 317, authorId: '2', coverEmoji: '🏫', createdAt: '', updatedAt: '', author: { id: '2', userId: '2', fullName: 'Priya Sharma', designation: 'Govt School Teacher', instituteName: 'Delhi Govt School', companyName: '', contactNumber: '', emailId: '', totalExp: '8', introduction: '', postCount: 12, followerCount: 1800, followingCount: 80, totalReads: 45000 } },
  { id: '3', slug: 'teacher-burnout-crisis', title: 'The Teacher Burnout Crisis Nobody Wants to Talk About', excerpt: 'Mental health conversations are happening everywhere except the staffroom. Let\'s change that.', content: '', category: 'Educator', tags: ['Wellbeing', 'Teaching', 'Story'], status: 'approved', isFeatured: false, readTime: 6, viewCount: 22000, likeCount: 518, commentCount: 91, authorId: '3', coverEmoji: '💚', createdAt: '', updatedAt: '', author: { id: '3', userId: '3', fullName: 'Ananya Singh', designation: 'School Counsellor', instituteName: 'Delhi Public School', companyName: '', contactNumber: '', emailId: '', totalExp: '9', introduction: '', postCount: 22, followerCount: 7200, followingCount: 140, totalReads: 280000 } },
  { id: '4', slug: 'nep-ground-reality', title: 'NEP 2020: Two Years Later — What\'s Actually Changed on the Ground?', excerpt: 'I interviewed 50 teachers across urban and rural India. This is what they told me.', content: '', category: 'Educator', tags: ['NEP', 'Policy', 'Story'], status: 'approved', isFeatured: false, readTime: 10, viewCount: 18000, likeCount: 392, commentCount: 74, authorId: '4', coverEmoji: '📜', createdAt: '', updatedAt: '', author: { id: '4', userId: '4', fullName: 'Kavitha Rajan', designation: 'Education Policy Analyst', instituteName: '', companyName: '', contactNumber: '', emailId: '', totalExp: '15', introduction: '', postCount: 31, followerCount: 6800, followingCount: 90, totalReads: 450000 } },
  { id: '5', slug: 'experiential-learning', title: 'Experiential Learning: Why It Works and How to Scale It', excerpt: 'My classroom transformation story — from rote teaching to real-world projects that changed everything.', content: '', category: 'Educator', tags: ['Teaching', 'Innovation'], status: 'approved', isFeatured: false, readTime: 5, viewCount: 4200, likeCount: 102, commentCount: 18, authorId: '5', coverEmoji: '🌱', createdAt: '', updatedAt: '', author: { id: '5', userId: '5', fullName: 'Rajesh Kumar', designation: 'Senior Teacher', instituteName: 'Delhi Govt School', companyName: '', contactNumber: '', emailId: '', totalExp: '10', introduction: '', postCount: 24, followerCount: 5200, followingCount: 120, totalReads: 340000 } },
  { id: '6', slug: 'gpt-classroom-review', title: "GPT in the Classroom: A Teacher's 6-Month Honest Review", excerpt: 'I gave every student access to AI tools. Here\'s what changed, what didn\'t, and what I\'d do differently.', content: '', category: 'Educator', tags: ['AI', 'Teaching', 'Story'], status: 'approved', isFeatured: false, readTime: 10, viewCount: 34200, likeCount: 891, commentCount: 203, authorId: '6', coverEmoji: '🤖', createdAt: '', updatedAt: '', author: { id: '6', userId: '6', fullName: 'Vikram Bose', designation: 'Teacher & Technologist', instituteName: 'Delhi Public School', companyName: '', contactNumber: '', emailId: '', totalExp: '7', introduction: '', postCount: 14, followerCount: 2900, followingCount: 180, totalReads: 98000 } },
]

const STORY_THEMES = [
  { emoji: '🏫', label: 'Classroom Experiences' },
  { emoji: '🚀', label: 'Career Transitions' },
  { emoji: '💚', label: 'Teacher Wellbeing' },
  { emoji: '📱', label: 'Tech Adoption' },
  { emoji: '🌍', label: 'Rural Education' },
  { emoji: '👩‍🏫', label: 'Women in EdTech' },
]

export default function EdTechStoriesPage() {
  const [search, setSearch] = useState('')
  const pageContent = useContent('content.edtech-stories')
  const { data, isLoading } = useQuery<{ data: Post[] }>({
    queryKey: ['edtech-stories'],
    queryFn: () => apiGet(`/posts?status=approved&category=Educator&limit=9`),
    staleTime: 3 * 60 * 1000,
  })
  const posts = data?.data?.length ? data.data : STATIC_STORIES
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
      <main style={{ minHeight: '100vh', background: '#fff' }}>
        {/* Hero — matches Latest Posts style */}
        <div style={{
          background: 'var(--edtech-stories-hero-bg, linear-gradient(135deg,#3D1F5E 0%,#5B3185 100%))',
          padding: '96px 5% 52px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,.03)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', marginBottom: 16 }}>
              {pageContent?.heroEyebrow || '✍️ Real Stories'}
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 18, letterSpacing: '-1px' }}>
              {pageContent?.heroTitle || 'EdTech Stories'}
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,.8)', lineHeight: 1.75, maxWidth: 560, fontWeight: 300 }}>
              {pageContent?.heroSubtitle || "Personal narratives from educators and EdTech professionals — the real stories behind the industry, in their own words."}
            </p>
          </div>
        </div>

        {/* Story themes */}
        <div style={{ background: 'var(--cream)', padding: '24px 5%', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {STORY_THEMES.map(t => (
            <button key={t.label}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, background: '#fff', border: '1px solid var(--border)', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 13, color: 'var(--ink)', transition: 'all .2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--plum)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--plum)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)' }}>
              <span>{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '48px 5%' }}>
          {/* Featured story */}
          {!isLoading && featured && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
              <Link href={`/post/${featured.slug}`}
                className="stories-featured" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 0, borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,.08)', textDecoration: 'none', color: 'inherit', border: '1.5px solid var(--border)' }}>
                <div className="stories-featured-img" style={{ height: '100%', minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 96, background: GRADIENTS[0] }}>
                  {featured.coverEmoji || '✍️'}
                </div>
                <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#fff' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--plum)', marginBottom: 12 }}>
                    ⭐ Featured Story
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
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{featured.author?.fullName}</div>
                      <div style={{ fontSize: '14px', color: 'var(--muted)' }}>{featured.author?.designation} · {featured.readTime} min read</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '14px', color: 'var(--muted)' }}>
                      ❤️ {featured.likeCount} · 💬 {featured.commentCount}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Stories grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
            {(isLoading ? Array.from({ length: 6 }) : rest).map((post: any, i: number) => (
              isLoading ? (
                <div key={i} className="pcard">
                  <div className="skeleton" style={{ height: 160 }} />
                  <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="skeleton" style={{ height: 20, width: '80%' }} />
                    <div className="skeleton" style={{ height: 14 }} />
                  </div>
                </div>
              ) : (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <Link href={`/post/${post.slug}`} className="pcard" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, background: GRADIENTS[(i + 1) % GRADIENTS.length] }}>
                      {post.coverEmoji || '✍️'}
                    </div>
                    <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35, marginBottom: 8 }}>
                        {post.title}
                      </div>
                      {post.excerpt && (
                        <div style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, flex: 1, marginBottom: 14 }}>
                          {post.excerpt.slice(0, 120)}...
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border2)', marginTop: 'auto' }}>
                        <div className="avatar av-teal" style={{ width: 32, height: 32, fontSize: '13px', borderRadius: '8px' }}>
                          {post.author?.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.author?.fullName}</div>
                          <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{post.readTime} min read</div>
                        </div>
                        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>❤️ {post.likeCount}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/latest-posts?category=Educator" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Read All Educator Stories →
            </Link>
          </div>
        </div>

        {/* CTA — community page style */}
        <div style={{ background: 'linear-gradient(135deg,#3D1F5E,#5B3185)', padding: '72px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, left: -80, width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,255,255,.05)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#fff', marginBottom: 16, letterSpacing: '-1px', lineHeight: 1.1 }}>
              Your Story Matters
            </h2>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,.8)', maxWidth: 500, margin: '0 auto 44px', lineHeight: 1.75, fontWeight: 300 }}>
              Every educator has a unique journey. Share yours with 10,000+ education professionals.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/write" style={{
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'var(--gold2,#E5B64A)',
                color: 'var(--ink,#1A1208)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 800,
                fontSize: '17px',
                padding: '16px 36px',
                borderRadius: '14px',
                boxShadow: '0 8px 28px rgba(201,146,42,.45)',
                transition: 'all .25s',
                letterSpacing: '-.1px',
              }}>
                ✍️ Share Your Story
              </Link>
              <Link href="/writers" style={{
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,.13)',
                border: '2px solid rgba(255,255,255,.35)',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '15px',
                padding: '14px 30px',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                transition: 'all .25s',
              }}>
                Meet the Writers →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
