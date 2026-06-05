'use client'
export const dynamic = 'force-dynamic'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useContent } from '@/hooks/useContent'
import { FollowButton } from '@/components/ui/FollowButton'

const COMMUNITIES = [
  { emoji: '🏫', gradient: 'linear-gradient(135deg,#EAF4F1,#D5EDE8)', title: 'Educators & Teachers', desc: 'Share classroom innovations, teaching methods, and real challenges. Connect with peers across schools worldwide.', count: '3,200+', unit: 'educators', color: 'var(--teal)', category: 'Educator' },
  { emoji: '💡', gradient: 'linear-gradient(135deg,#FEF0EA,#FAD8CB)', title: 'EdTech Companies', desc: 'Publish thought leadership, product insights, and case studies. Build authentic trust with educators.', count: '180+', unit: 'companies', color: 'var(--coral)', category: 'EdTech' },
  { emoji: '📊', gradient: 'linear-gradient(135deg,#F5F0FD,#E4D7F7)', title: 'Sales Professionals', desc: 'Real conversations about selling in education — strategies, objections, and what actually closes deals.', count: '840+', unit: 'professionals', color: 'var(--plum)', category: 'Sales Pro' },
  { emoji: '🏆', gradient: 'linear-gradient(135deg,#FEF9EC,#F7E8BE)', title: 'School Leaders', desc: 'Principals and administrators sharing governance insights, procurement decisions, and transformation stories.', count: '620+', unit: 'leaders', color: 'var(--gold)', category: 'Leadership' },
  { emoji: '🔬', gradient: 'linear-gradient(135deg,#EAF4F1,#C4E4DC)', title: 'Researchers & Innovators', desc: 'Bridge the gap between academic research and classroom practice. Make findings accessible and actionable.', count: '290+', unit: 'researchers', color: 'var(--teal)', category: 'Research' },
  { emoji: '🌍', gradient: 'linear-gradient(135deg,#FDF0F0,#F5CBCB)', title: 'International Educators', desc: 'Education challenges are global. Connect with practitioners from 40+ countries and diverse education systems.', count: '40+', unit: 'countries', color: 'var(--coral)', category: 'International' },
  { emoji: '🎓', gradient: 'linear-gradient(135deg,#EEF4FF,#C8D9F8)', title: 'Students', desc: 'A space for curious learners to read, explore ideas, and follow educators and innovators shaping their future.', count: '1,200+', unit: 'students', color: '#4F7BE8', category: 'Student' },
  { emoji: '👨‍👩‍👧', gradient: 'linear-gradient(135deg,#FFF0F8,#F5C8E5)', title: 'Parents & Guardians', desc: 'Stay informed about education trends, school choices, and how to support your child\'s learning journey.', count: '800+', unit: 'parents', color: '#C2407A', category: 'Parent' },
]

const AVATAR_BG = ['var(--teal)', 'var(--coral)', 'var(--gold)', 'var(--plum)', 'var(--teal2)', 'var(--coral2)']

const TOP_WRITERS_FALLBACK = [
  { username: 'kavitha.rajan', fullName: 'Kavitha Rajan', designation: 'Education Policy Analyst', followerCount: 6800, postCount: 31, totalReads: 450000 },
  { username: 'ananya.singh', fullName: 'Ananya Singh', designation: 'School Counsellor', followerCount: 7200, postCount: 22, totalReads: 280000 },
  { username: 'rajesh.kumar', fullName: 'Rajesh Kumar', designation: 'EdTech Founder', followerCount: 5200, postCount: 24, totalReads: 340000 },
  { username: 'nalini.verma', fullName: 'Nalini Verma', designation: 'Research Lead, IIT Delhi', followerCount: 3400, postCount: 16, totalReads: 120000 },
  { username: 'meena.rao', fullName: 'Meena Rao', designation: 'EdTech Founder', followerCount: 4100, postCount: 19, totalReads: 210000 },
  { username: 'vikram.bose', fullName: 'Vikram Bose', designation: 'Learning Designer', followerCount: 2900, postCount: 14, totalReads: 98000 },
]

const RECENT_DISCUSSIONS = [
  { id: '1', title: 'Is AI going to replace teachers, or empower them?', replies: 47, category: 'EdTech', time: '2h ago' },
  { id: '2', title: "How do you handle parents who demand 'extra attention' for their child?", replies: 89, category: 'Educator', time: '4h ago' },
  { id: '3', title: 'Best CRM for EdTech sales teams under 10 people?', replies: 23, category: 'Sales Pro', time: '6h ago' },
  { id: '4', title: 'NEP implementation — how far along is your school?', replies: 61, category: 'Leadership', time: '8h ago' },
  { id: '5', title: 'Salary negotiation tips for experienced teachers changing schools', replies: 34, category: 'Career', time: '12h ago' },
  { id: '6', title: 'What EdTech tools are actually saving teachers time in 2025?', replies: 52, category: 'EdTech', time: '14h ago' },
]

const STATS = [
  { n: '10K+', label: 'Community Members' },
  { n: '2.4K+', label: 'Articles Published' },
  { n: '180+', label: 'EdTech Companies' },
  { n: '40+', label: 'Countries' },
]

export default function CommunityPage() {
  const pageContent = useContent('content.community')
  const { data: writersData } = useQuery<{ writers: any[] }>({
    queryKey: ['top-writers-community'],
    queryFn: () => fetch('/api/users/top-writers?limit=6').then(r => r.json()),
    staleTime: 5 * 60 * 1000,
  })
  const writers = writersData?.writers?.length ? writersData.writers : TOP_WRITERS_FALLBACK

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg,var(--teal) 0%,#0D7A6D 60%,var(--plum) 100%)',
          padding: '96px 5% 56px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,.03)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', marginBottom: 16 }}>
              {pageContent?.heroEyebrow || '🤝 Community Hub'}
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px,5vw,60px)', fontWeight: 900, color: 'var(--community-hero-color,#fff)', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-1px' }}>
              {pageContent?.heroTitle || "India's Education"}<br />
              <em style={{ color: 'var(--gold2,#E5B64A)' }}>{pageContent?.heroAccent || 'Community'}</em>
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,.8)', lineHeight: 1.75, maxWidth: 560, marginBottom: 40, fontWeight: 300 }}>
              {pageContent?.heroSubtitle || 'Connect with 10,000+ educators, EdTech founders, school leaders, and researchers — all building the future of education together.'}
            </p>

            {/* ── Hero CTAs — proper button design ─────────────── */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/write" style={{
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'var(--gold2,#E5B64A)',
                color: 'var(--ink,#1A1208)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 800,
                fontSize: '16px',
                padding: '14px 32px',
                borderRadius: '12px',
                boxShadow: '0 6px 24px rgba(201,146,42,.4)',
                transition: 'all .25s',
                letterSpacing: '-.1px',
              }}>
                ✍️ Start Writing Free
              </Link>
              <Link href="/latest-posts" style={{
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,.12)',
                border: '1.5px solid rgba(255,255,255,.35)',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '15px',
                padding: '13px 28px',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                transition: 'all .25s',
              }}>
                Browse Articles →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats bar ─────────────────────────────────────────── */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ padding: '24px', textAlign: 'center', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 900, color: 'var(--teal)', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: 5, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Find Your People ─────────────────────────────────── */}
        <div style={{ padding: '72px 5%', background: 'var(--cream)' }}>
          <div className="eyebrow"><div className="eyebrow-line" /><span className="eyebrow-text">Find your people</span></div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.08, letterSpacing: '-1px', marginBottom: 0 }}>
            One Platform,<br /><em style={{ fontStyle: 'italic', color: 'var(--teal)' }}>Every Voice</em>
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--muted)', lineHeight: 1.8, maxWidth: 540, fontWeight: 300, marginTop: 16 }}>
            Whether you teach a class of 30 or run an EdTech company — there&apos;s a place for you here.
          </p>

          {/* 4-column grid — all 8 cards equal */}
          <div className="comm-4col" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
            marginTop: 48,
          }}>
            {COMMUNITIES.map((c, i) => (
              <motion.div key={c.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}>
                <Link
                  href={`/latest-posts?category=${encodeURIComponent(c.category)}`}
                  style={{
                    display: 'flex', flexDirection: 'column', height: '100%',
                    borderRadius: '20px', padding: '28px 24px',
                    background: c.gradient,
                    position: 'relative', overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1.5px solid transparent',
                    transition: 'all .3s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,0,0,.12)'
                    ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'
                    ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 32px rgba(0,0,0,.08)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'transparent'
                    ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
                    ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'
                  }}>
                  {/* Background emoji watermark */}
                  <div style={{ position: 'absolute', right: '-8px', bottom: '-8px', fontSize: '88px', opacity: .11, lineHeight: 1, pointerEvents: 'none' }}>{c.emoji}</div>

                  {/* Icon */}
                  <div style={{ width: '48px', height: '48px', borderRadius: '13px', background: 'rgba(255,255,255,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '16px', boxShadow: '0 2px 10px rgba(0,0,0,.06)', flexShrink: 0 }}>
                    {c.emoji}
                  </div>

                  {/* Title */}
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.3 }}>
                    {c.title}
                  </div>

                  {/* Description */}
                  <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '16px', flex: 1 }}>
                    {c.desc}
                  </div>

                  {/* Count */}
                  <div style={{ fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                    <span style={{ color: c.color }}>{c.count} {c.unit}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Responsive override */}
          <style>{`
            @media (max-width: 1100px) { .comm-4col { grid-template-columns: repeat(3,1fr) !important; } }
            @media (max-width: 768px)  { .comm-4col { grid-template-columns: repeat(2,1fr) !important; } }
            @media (max-width: 480px)  { .comm-4col { grid-template-columns: 1fr !important; } }
          `}</style>
        </div>

        {/* ── Community Voices ─────────────────────────────────── */}
        <div style={{ padding: '72px 5%', background: '#fff' }}>
          <div className="eyebrow"><div className="eyebrow-line" /><span className="eyebrow-text">Community voices</span></div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.08, letterSpacing: '-1px', marginBottom: 0 }}>
            Top Writers<br /><em style={{ fontStyle: 'italic', color: 'var(--teal)' }}>This Month</em>
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--muted)', lineHeight: 1.8, maxWidth: 540, fontWeight: 300, marginTop: 16, marginBottom: 48 }}>
            The community&apos;s most-read and followed voices across education verticals.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {writers.map((w: any, i: number) => (
              <motion.div key={w.username || w.fullName}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 18, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>

                {/* Avatar + name row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  {w.avatarUrl
                    ? <img src={w.avatarUrl} alt={w.fullName} style={{ width: 54, height: 54, borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }} />
                    : <div style={{ width: 54, height: 54, borderRadius: '14px', background: AVATAR_BG[i % AVATAR_BG.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '22px', color: '#fff', flexShrink: 0 }}>
                        {(w.fullName || w.name || 'U')[0].toUpperCase()}
                      </div>
                  }
                  <div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>
                      {w.fullName || w.name}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--muted)', marginTop: 3 }}>
                      {w.designation || w.role}
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: 20, fontSize: '14px', color: 'var(--muted)', marginBottom: 18, paddingBottom: 16, borderBottom: '1px solid var(--border2)' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: 'var(--teal)', fontSize: '16px' }}>
                      {(w.followerCount || 0) >= 1000 ? `${((w.followerCount || 0) / 1000).toFixed(1)}K` : (w.followerCount || 0)}
                    </span>
                    <span style={{ marginLeft: 4 }}>followers</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 800, color: 'var(--ink)', fontSize: '16px' }}>{w.postCount || 0}</span>
                    <span style={{ marginLeft: 4 }}>articles</span>
                  </div>
                  {w.totalReads > 0 && (
                    <div>
                      <span style={{ fontWeight: 800, color: 'var(--coral)', fontSize: '16px' }}>
                        {w.totalReads >= 1000 ? `${(w.totalReads / 1000).toFixed(0)}K` : w.totalReads}
                      </span>
                      <span style={{ marginLeft: 4 }}>reads</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  <Link href={`/profile/${w.username}`}
                    style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: '13px', fontWeight: 600, textAlign: 'center', color: 'var(--ink)', textDecoration: 'none', transition: 'all .2s' }}>
                    View Profile
                  </Link>
                  <FollowButton targetUsername={w.username || w.email || w.id} targetName={w.fullName || w.name} size="sm" />
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/writers" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '15px', padding: '12px 28px' }}>
              View All Writers →
            </Link>
          </div>
        </div>

        {/* ── Recent Discussions ───────────────────────────────── */}
        <div style={{ padding: '72px 5% 56px', background: 'var(--cream)' }}>
          <div className="eyebrow"><div className="eyebrow-line" /><span className="eyebrow-text">What&apos;s being discussed</span></div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.08, letterSpacing: '-1px', marginBottom: 0 }}>
            Recent<br /><em style={{ fontStyle: 'italic', color: 'var(--teal)' }}>Discussions</em>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 16, marginTop: 40 }}>
            {RECENT_DISCUSSIONS.map((d, i) => (
              <motion.div key={d.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '22px 24px', background: '#fff', borderRadius: 16, border: '1.5px solid var(--border)', cursor: 'pointer', transition: 'all .22s' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--teal)'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(10,95,85,.1)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ background: 'rgba(10,95,85,.1)', color: 'var(--teal)', padding: '3px 10px', borderRadius: 6, fontWeight: 700, fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{d.category}</span>
                  <span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: 'auto' }}>🕐 {d.time}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.45 }}>
                  {d.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border2)' }}>
                  <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}>💬 {d.replies} replies</span>
                  <span style={{ fontSize: '13px', color: 'var(--teal)', fontWeight: 700 }}>Join discussion →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Join CTA ─────────────────────────────────────────── */}
        <div style={{ background: 'var(--teal)', padding: '72px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, left: -80, width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,255,255,.05)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#fff', marginBottom: 16, letterSpacing: '-1px', lineHeight: 1.1 }}>
              Ready to Join the Conversation?
            </h2>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,.8)', maxWidth: 500, margin: '0 auto 44px', lineHeight: 1.75, fontWeight: 300 }}>
              Free forever. No spam. Just the best conversations in Indian education.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Primary CTA button */}
              <Link href="/register" style={{
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
                🚀 Create Free Account
              </Link>

              {/* Secondary CTA button */}
              <Link href="/latest-posts" style={{
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
                Browse Articles First
              </Link>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
