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
]

const AVATAR_BG = ['var(--teal)', 'var(--coral)', 'var(--gold)', 'var(--plum)', 'var(--teal2)', 'var(--coral2)']

const TOP_WRITERS_FALLBACK = [
  { username: 'kavitha.rajan', fullName: 'Kavitha Rajan', designation: 'Education Policy Analyst', followerCount: 6800, postCount: 31, totalReads: 450000, coverEmoji: '📜' },
  { username: 'ananya.singh', fullName: 'Ananya Singh', designation: 'School Counsellor', followerCount: 7200, postCount: 22, totalReads: 280000, coverEmoji: '💚' },
  { username: 'rajesh.kumar', fullName: 'Rajesh Kumar', designation: 'EdTech Founder', followerCount: 5200, postCount: 24, totalReads: 340000, coverEmoji: '🚀' },
  { username: 'nalini.verma', fullName: 'Nalini Verma', designation: 'Research Lead, IIT Delhi', followerCount: 3400, postCount: 16, totalReads: 120000, coverEmoji: '🔬' },
  { username: 'meena.rao', fullName: 'Meena Rao', designation: 'EdTech Founder', followerCount: 4100, postCount: 19, totalReads: 210000, coverEmoji: '💡' },
  { username: 'vikram.bose', fullName: 'Vikram Bose', designation: 'Learning Designer', followerCount: 2900, postCount: 14, totalReads: 98000, coverEmoji: '🎮' },
]

const RECENT_DISCUSSIONS = [
  { id: '1', title: "Is AI going to replace teachers, or empower them?", replies: 47, category: 'EdTech', time: '2h ago' },
  { id: '2', title: "How do you handle parents who demand \'extra attention\' for their child?", replies: 89, category: 'Educator', time: '4h ago' },
  { id: '3', title: "Best CRM for EdTech sales teams under 10 people?", replies: 23, category: 'Sales Pro', time: '6h ago' },
  { id: '4', title: "NEP implementation — how far along is your school?", replies: 61, category: 'Leadership', time: '8h ago' },
  { id: '5', title: "Salary negotiation tips for experienced teachers changing schools", replies: 34, category: 'Career', time: '12h ago' },
]

const STATS = [
  { n: '10K+', label: 'Community Members' },
  { n: '2.4K+', label: 'Articles Published' },
  { n: '180+', label: 'EdTech Companies' },
  { n: '40+', label: 'Countries' },
]

export default function CommunityPage() {
  const pageContent = useContent(\'content.community')
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
        {/* Hero */}
        <div className="page-hero" style={{ background: 'linear-gradient(135deg,var(--teal) 0%,#0D7A6D 60%,var(--plum) 100%)', padding: '80px 5% 72px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }} />
          <div style={{ position: 'absolute', bottom: -80, left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,.03)' }} />
          <div style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 16 }}>
              🤝 Community Hub
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px,5vw,60px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
              India's Education<br /><em style={{ color: 'var(--gold2)' }}>Community</em>
            </h1>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,.75)', lineHeight: 1.7, maxWidth: 560, marginBottom: 36 }}>
              Connect with 10,000+ educators, EdTech founders, school leaders, and researchers — all building the future of education together.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/register" className="btn-primary" style={{ textDecoration: 'none', background: 'var(--gold2)', color: 'var(--ink)' }}>
                Join Free →
              </Link>
              <Link href="/write" className="btn-outline" style={{ textDecoration: 'none', borderColor: 'rgba(255,255,255,.3)', color: '#fff' }}>
                Start Writing
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="community-stats-bar" style={{ background: '#fff', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ padding: '24px', textAlign: 'center', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 900, color: 'var(--teal)', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Community segments */}
        <div style={{ padding: '72px 5%', background: 'var(--cream)' }}>
          <div className="eyebrow"><div className="eyebrow-line" /><span className="eyebrow-text">Find your people</span></div>
          <h2 className="s-title">One Platform,<br /><em>Every Voice</em></h2>
          <p className="s-desc">Whether you teach a class of 30 or run an EdTech company — there's a place for you here.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20, marginTop: 48 }}>
            {COMMUNITIES.map((c, i) => (
              <motion.div key={c.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}>
                <Link href={`/latest-posts?category=${encodeURIComponent(c.category)}`}
                  style={{ display: 'block', borderRadius: '22px', padding: '36px 30px', background: c.gradient, position: 'relative', overflow: 'hidden', cursor: 'pointer', border: '1.5px solid transparent', transition: 'all .3s', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'transparent'}>
                  <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', fontSize: '100px', opacity: .12, lineHeight: 1 }}>{c.emoji}</div>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>{c.emoji}</div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>{c.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '18px' }}>{c.desc}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.color }} />
                    <span style={{ color: c.color }}>{c.count} {c.unit}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Writers */}
        <div style={{ padding: '72px 5%', background: '#fff' }}>
          <div className="eyebrow"><div className="eyebrow-line" /><span className="eyebrow-text">Community voices</span></div>
          <h2 className="s-title">Top Writers<br /><em>This Month</em></h2>
          <p className="s-desc">The community's most read and followed voices across education verticals.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20, marginTop: 48 }}>
            {writers.map((w: any, i: number) => (
              <motion.div key={w.username || w.fullName}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 18, padding: '28px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  {w.avatarUrl
                    ? <img src={w.avatarUrl} alt={w.fullName} style={{ width: 52, height: 52, borderRadius: '14px', objectFit: 'cover' }} />
                    : <div style={{ width: 52, height: 52, borderRadius: '14px', background: AVATAR_BG[i % AVATAR_BG.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '20px', color: '#fff' }}>
                      {(w.fullName || w.name || 'U')[0].toUpperCase()}
                    </div>
                  }
                  <div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>{w.fullName || w.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{w.designation || w.role}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: '12px', color: 'var(--muted)', marginBottom: 16 }}>
                  <div><span style={{ fontWeight: 700, color: 'var(--teal)' }}>{(w.followerCount || 0) >= 1000 ? `${((w.followerCount || 0) / 1000).toFixed(1)}K` : (w.followerCount || 0)}</span> followers</div>
                  <div><span style={{ fontWeight: 700, color: 'var(--ink)' }}>{w.postCount || 0}</span> articles</div>
                  {w.totalReads > 0 && <div><span style={{ fontWeight: 700, color: 'var(--coral)' }}>{w.totalReads >= 1000 ? `${(w.totalReads / 1000).toFixed(0)}K` : w.totalReads}</span> reads</div>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link href={`/profile/${w.username}`}
                    style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid var(--border)', fontSize: '12px', fontWeight: 600, textAlign: 'center', color: 'var(--ink)', textDecoration: 'none' }}>
                    View Profile
                  </Link>
                  <FollowButton targetUsername={w.username || w.email || w.id} targetName={w.fullName || w.name} size="sm" />
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/writers" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              View All Writers →
            </Link>
          </div>
        </div>

        {/* Recent discussions */}
        <div style={{ padding: '72px 5%', background: 'var(--cream)' }}>
          <div className="eyebrow"><div className="eyebrow-line" /><span className="eyebrow-text">What's being discussed</span></div>
          <h2 className="s-title">Recent<br /><em>Discussions</em></h2>
          <div style={{ marginTop: 40, maxWidth: 800 }}>
            {RECENT_DISCUSSIONS.map((d, i) => (
              <motion.div key={d.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', background: '#fff', borderRadius: 14, border: '1.5px solid var(--border)', marginBottom: 12, cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--teal)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4, marginBottom: 6 }}>
                    {d.title}
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: '12px', color: 'var(--muted)' }}>
                    <span style={{ background: 'rgba(10,95,85,.1)', color: 'var(--teal)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{d.category}</span>
                    <span>💬 {d.replies} replies</span>
                    <span>🕐 {d.time}</span>
                  </div>
                </div>
                <span style={{ color: 'var(--muted)', fontSize: 18 }}>→</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Join CTA */}
        <div style={{ background: 'var(--teal)', padding: '80px 5%', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: '#fff', marginBottom: 16 }}>
            Ready to Join the Conversation?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.75)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Free forever. No spam. Just the best conversations in Indian education.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn-primary" style={{ textDecoration: 'none', background: 'var(--gold2)', color: 'var(--ink)' }}>
              Create Free Account →
            </Link>
            <Link href="/latest-posts" className="btn-outline" style={{ textDecoration: 'none', borderColor: 'rgba(255,255,255,.3)', color: '#fff' }}>
              Browse Articles First
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
