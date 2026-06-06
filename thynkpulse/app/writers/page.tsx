'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useContent } from '@/hooks/useContent'
import { FollowButton } from '@/components/ui/FollowButton'

const ROLES = ['All Writers', 'Educator', 'EdTech Pro', 'School Leader', 'Researcher', 'Sales Pro', 'Student', 'Parent']
const AVATAR_BG = ['var(--teal)', 'var(--coral)', 'var(--gold)', 'var(--plum)', 'var(--teal2)', 'var(--coral2)']

const FALLBACK_WRITERS = [
  { username: 'kavitha.rajan', fullName: 'Kavitha Rajan', designation: 'Education Policy Analyst', instituteName: '', companyName: '', postCount: 31, followerCount: 6800, totalReads: 450000, bio: 'Researching education policy and its real-world impact across India.' },
  { username: 'ananya.singh', fullName: 'Ananya Singh', designation: 'School Counsellor', instituteName: 'Delhi Public School', companyName: '', postCount: 22, followerCount: 7200, totalReads: 280000, bio: 'Mental health advocate and school counsellor writing about teacher and student wellbeing.' },
  { username: 'rajesh.kumar', fullName: 'Rajesh Kumar', designation: 'EdTech Founder', instituteName: '', companyName: 'EduTech India', postCount: 24, followerCount: 5200, totalReads: 340000, bio: 'Building EdTech products for Tier-2 India. Sharing lessons from the trenches.' },
  { username: 'nalini.verma', fullName: 'Nalini Verma', designation: 'Research Lead', instituteName: 'IIT Delhi', companyName: '', postCount: 16, followerCount: 3400, totalReads: 120000, bio: 'Bridging the gap between education research and classroom practice.' },
  { username: 'meena.rao', fullName: 'Meena Rao', designation: 'EdTech Founder', instituteName: '', companyName: 'EduSpark', postCount: 19, followerCount: 4100, totalReads: 210000, bio: 'Former teacher turned EdTech founder. Writing about the journey honestly.' },
  { username: 'vikram.bose', fullName: 'Vikram Bose', designation: 'Learning Designer', instituteName: '', companyName: 'PlayLearn', postCount: 14, followerCount: 2900, totalReads: 98000, bio: 'Making learning engaging through game design and interactive media.' },
  { username: 'arjun.mehta', fullName: 'Arjun Mehta', designation: 'Sales Director', instituteName: '', companyName: 'EduTech India', postCount: 8, followerCount: 2100, totalReads: 78000, bio: 'Demystifying B2B education sales for founders and sales professionals.' },
  { username: 'priya.sharma', fullName: 'Priya Sharma', designation: 'Senior Teacher', instituteName: 'Delhi Govt School', companyName: '', postCount: 12, followerCount: 1800, totalReads: 45000, bio: "Teaching for 8 years in government schools across Delhi. Sharing what's real." },
  { username: 'suresh.kaushik', fullName: 'Suresh Kaushik', designation: 'Principal & Founder', instituteName: 'CBSE School', companyName: '', postCount: 6, followerCount: 890, totalReads: 56000, bio: '20 years of running schools. Now sharing everything I know.' },
]

export default function WritersPage() {
  const pageContent = useContent('content.writers')
  const [search, setSearch] = useState('')
  const [activeRole, setActiveRole] = useState('All Writers')

  const { data, isLoading } = useQuery<{ writers: any[] }>({
    queryKey: ['writers-directory'],
    queryFn: () => fetch('/api/users/top-writers?limit=20').then(r => r.json()),
    staleTime: 5 * 60 * 1000,
  })
  const allWriters = data?.writers?.length ? data.writers : FALLBACK_WRITERS

  const filtered = allWriters.filter(w => {
    const name = (w.fullName || w.name || '').toLowerCase()
    const role = (w.designation || w.role || '').toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase()) || role.includes(search.toLowerCase())
    const matchRole = activeRole === 'All Writers' || role.includes(activeRole.toLowerCase().replace(' pro', ''))
    return matchSearch && matchRole
  })

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--cream)' }}>
        {/* Hero — matches Latest Posts / Trending style */}
        <div style={{
          background: 'var(--writers-hero-bg, var(--teal))',
          padding: '96px 5% 52px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* decorative circles */}
          <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,.03)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', marginBottom: 16 }}>
              ✍️ Writers Directory
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, color: 'var(--writers-hero-color, #fff)', lineHeight: 1.1, marginBottom: 18, letterSpacing: '-1px' }}>
              {pageContent?.heroTitle || 'Meet the Writers'}
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,.8)', lineHeight: 1.75, maxWidth: 540, marginBottom: 40, fontWeight: 300 }}>
              {pageContent?.heroSubtitle || "Educators, founders, researchers, and leaders sharing their expertise with India's education community."}
            </p>
            {/* Search in hero */}
            <div style={{ display: 'flex', gap: 12, maxWidth: 500 }}>
              <input
                type="text"
                placeholder="Search by name or role..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, padding: '13px 20px', borderRadius: 12, border: 'none', fontSize: '15px', outline: 'none', background: 'rgba(255,255,255,.15)', color: '#fff', backdropFilter: 'blur(10px)', fontFamily: 'var(--font-sans)' }}
              />
            </div>
          </div>
        </div>

        {/* Role filter */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '0 5%' }}>
          <div style={{ display: 'flex', gap: 4, padding: '14px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {ROLES.map(role => (
              <button key={role} onClick={() => setActiveRole(role)}
                className={`filter-btn ${activeRole === role ? 'active' : ''}`}
                style={{ whiteSpace: 'nowrap' }}>
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Writers grid */}
        <div style={{ padding: '56px 5%' }}>
          {isLoading ? (
            <div className="writers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 18, padding: '28px 24px', border: '1.5px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                    <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0 }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div className="skeleton" style={{ height: 16, width: '70%' }} />
                      <div className="skeleton" style={{ height: 12, width: '50%' }} />
                    </div>
                  </div>
                  <div className="skeleton" style={{ height: 12, marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 12, width: '80%' }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, marginBottom: 8 }}>No writers found</div>
              <div style={{ fontSize: 15 }}>Try a different search or filter</div>
            </div>
          ) : (
            <div className="writers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
              {filtered.map((w: any, i: number) => (
                <motion.div key={w.username || w.fullName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 9) * 0.06 }}
                  style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 18, padding: '28px 24px', transition: 'box-shadow .2s', display: 'flex', flexDirection: 'column', gap: 0 }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,.08)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                    {w.avatarUrl
                      ? <img src={w.avatarUrl} alt={w.fullName} style={{ width: 54, height: 54, borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }} />
                      : <div style={{ width: 54, height: 54, borderRadius: '14px', background: AVATAR_BG[i % AVATAR_BG.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '22px', color: '#fff', flexShrink: 0 }}>
                        {(w.fullName || w.name || 'U')[0].toUpperCase()}
                      </div>
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: 3, lineHeight: 1.2 }}>{w.fullName || w.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {w.designation || w.role}{(w.instituteName || w.companyName) ? ` · ${w.instituteName || w.companyName}` : ''}
                      </div>
                    </div>
                  </div>
                  {(w.bio || w.introduction) && (
                    <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.65, marginBottom: 16 }}>
                      {(w.bio || w.introduction || '').slice(0, 100)}{(w.bio || w.introduction || '').length > 100 ? '...' : ''}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 20, fontSize: '14px', color: 'var(--muted)', marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--border2)' }}>
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
                    {(w.totalReads || 0) > 0 && (
                      <div>
                        <span style={{ fontWeight: 800, color: 'var(--coral)', fontSize: '16px' }}>
                          {(w.totalReads || 0) >= 1000 ? `${((w.totalReads || 0) / 1000).toFixed(0)}K` : (w.totalReads || 0)}
                        </span>
                        <span style={{ marginLeft: 4 }}>reads</span>
                      </div>
                    )}
                  </div>
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
          )}
        </div>

        {/* Become a writer CTA — matches Community page style */}
        <div style={{ background: 'var(--teal)', padding: '72px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, left: -80, width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,255,255,.05)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#fff', marginBottom: 16, letterSpacing: '-1px', lineHeight: 1.1 }}>
              Your Expertise Belongs Here
            </h2>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,.8)', maxWidth: 500, margin: '0 auto 44px', lineHeight: 1.75, fontWeight: 300 }}>
              Join 2,400+ writers sharing knowledge with India's education community. It's free.
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
                ✍️ Start Writing Today →
              </Link>
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
