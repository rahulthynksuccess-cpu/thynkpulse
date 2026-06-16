'use client'
// components/layout/Navbar.tsx  (ThynkPulse)
// Added: live notification bell with dropdown + unread badge
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, PenSquare, Bell, LogOut, User, LayoutDashboard, ChevronDown, CheckCheck } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { config } from '@/lib/config'
import { clsx } from 'clsx'
import { useContent } from '@/hooks/useContent'

const NAV_LINKS = [
  { label: 'Latest Posts', href: '/latest-posts'  },
  { label: 'Trending',     href: '/trending'      },
  { label: 'Community',    href: '/community'     },
  { label: 'Writers',      href: '/writers'       },
  { label: 'Thynk Success ↗', href: config.app.parentSite, external: true },
]

// ── Notification type icon ────────────────────────────────────────────────────
function notifIcon(type: string) {
  const icons: Record<string, string> = {
    post_approved: '✅', post_rejected: '📝', follow: '👤', comment: '💬',
    like: '❤️', broadcast: '📢', info: 'ℹ️',
  }
  return icons[type] || '🔔'
}

// ── Bell + Dropdown ───────────────────────────────────────────────────────────
function NotificationBell({ userId }: { userId?: string }) {
  const [open,         setOpen]         = useState(false)
  const [notifs,       setNotifs]       = useState<any[]>([])
  const [unread,       setUnread]       = useState(0)
  const [loading,      setLoading]      = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  const token = typeof window !== 'undefined' ? localStorage.getItem('tp_access_token') || '' : ''
  const hdrs  = { Authorization: `Bearer ${token}` }

  const load = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch('/api/notifications', { headers: hdrs, cache: 'no-store' })
      const data: any[] = await res.json()
      setNotifs(data)
      setUnread(data.filter(n => !n.isRead).length)
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    load()
    const iv = setInterval(load, 60_000)
    return () => clearInterval(iv)
  }, [userId])

  // Close on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const markAllRead = async () => {
    if (!userId) return
    await fetch('/api/notifications?action=mark-all-read', { method: 'POST', headers: hdrs }).catch(() => {})
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnread(0)
  }

  const markRead = async (id: string) => {
    await fetch(`/api/notifications?action=mark-read&id=${id}`, { method: 'POST', headers: hdrs }).catch(() => {})
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    setUnread(prev => Math.max(0, prev - 1))
  }

  const handleToggle = () => {
    if (!open) load()
    setOpen(o => !o)
  }

  const timeAgo = (iso: string) => {
    const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
    if (s < 60)   return 'just now'
    if (s < 3600) return `${Math.floor(s/60)}m ago`
    if (s < 86400) return `${Math.floor(s/3600)}h ago`
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
  }

  return (
    <div ref={dropRef} style={{ position: 'relative' }}>
      <button
        onClick={handleToggle}
        aria-label="Notifications"
        className="relative p-[8px] rounded-[8px] hover:bg-[var(--border2)] transition-colors"
        style={{ background: open ? 'var(--border2)' : 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
        <Bell style={{ width: 18, height: 18, color: 'var(--muted)' }} />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}
            style={{
              position: 'absolute', top: 4, right: 4,
              width: unread > 9 ? 'auto' : 16, height: 16,
              background: '#E8512A', borderRadius: 100, minWidth: 16, padding: unread > 9 ? '0 4px' : 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700, color: '#fff', lineHeight: 1,
              border: '1.5px solid #FDF6EC',
            }}>
            {unread > 99 ? '99+' : unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 200,
              width: 340, maxWidth: 'calc(100vw - 32px)',
              background: '#fff', border: '1px solid rgba(26,18,8,0.10)',
              borderRadius: 16, boxShadow: '0 8px 40px rgba(26,18,8,0.14)',
              overflow: 'hidden',
            }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(26,18,8,0.07)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 14, color: '#1A1208' }}>
                Notifications {unread > 0 && <span style={{ fontSize: 11, color: '#E8512A' }}>({unread} new)</span>}
              </div>
              {unread > 0 && (
                <button onClick={markAllRead}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#0A5F55', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  <CheckCheck style={{ width: 12, height: 12 }} /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {loading && notifs.length === 0 ? (
                <div style={{ padding: '32px 0', textAlign: 'center', color: '#7A6A52', fontSize: 13 }}>Loading…</div>
              ) : notifs.length === 0 ? (
                <div style={{ padding: '40px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🔔</div>
                  <div style={{ fontSize: 13, color: '#7A6A52' }}>You're all caught up!</div>
                </div>
              ) : notifs.map((n: any) => (
                <div
                  key={n.id}
                  onClick={() => { if (!n.isRead) markRead(n.id); if (n.link) { setOpen(false); window.location.href = n.link } }}
                  style={{
                    display: 'flex', gap: 10, padding: '12px 16px',
                    borderBottom: '1px solid rgba(26,18,8,0.05)',
                    cursor: n.link ? 'pointer' : 'default',
                    background: n.isRead ? 'transparent' : 'rgba(10,95,85,0.04)',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={e => { if (n.link || !n.isRead) (e.currentTarget as HTMLElement).style.background = 'rgba(10,95,85,0.07)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = n.isRead ? 'transparent' : 'rgba(10,95,85,0.04)' }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, background: 'rgba(10,95,85,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0,
                  }}>
                    {notifIcon(n.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: n.isRead ? 500 : 700, color: '#1A1208', marginBottom: 2, lineHeight: 1.35 }}>
                      {n.title}
                    </div>
                    {n.body && (
                      <div style={{ fontSize: 11.5, color: '#7A6A52', lineHeight: 1.45, marginBottom: 3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                        {n.body}
                      </div>
                    )}
                    <div style={{ fontSize: 10.5, color: '#C0AE96' }}>{timeAgo(n.createdAt)}</div>
                  </div>
                  {!n.isRead && (
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0A5F55', flexShrink: 0, marginTop: 6 }} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export function Navbar() {
  const ncRaw = useContent('content.navbar')
  const nc = ncRaw ?? { ctaLabel: 'Start Writing', loginLabel: 'Login' }
  const ctaLabel   = nc?.ctaLabel   || 'Start Writing'
  const loginLabel = nc?.loginLabel || 'Login'
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => setMobileOpen(false), [pathname])

  const initials = user?.profile?.fullName
    ? user.profile.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <>
      <div className="progress-bar" id="tp-progress" />

      <header className={clsx(
        'fixed top-[3px] left-0 right-0 z-[100] h-[68px] flex items-center justify-between px-[5%] transition-all duration-300',
        scrolled
          ? 'bg-[rgba(253,246,236,0.95)] backdrop-blur-[24px] border-b border-[rgba(10,95,85,0.12)]'
          : 'bg-[rgba(253,246,236,0.92)] backdrop-blur-[24px] border-b border-[rgba(10,95,85,0.12)]',
      )}>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-[10px] no-underline">
          <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center relative overflow-hidden"
            style={{ background: 'var(--teal)' }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--teal2), var(--teal3))', opacity: .7 }} />
            <span className="relative z-[1] font-serif font-black text-[17px] text-white" style={{ letterSpacing: '-1px' }}>TP</span>
          </div>
          <span className="font-serif font-black text-[21px]" style={{ color: 'var(--ink)', letterSpacing: '-.5px' }}>
            Thynk <em className="not-italic" style={{ color: 'var(--teal)' }}>Pulse</em>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-[4px]">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noopener noreferrer' : undefined}
              className="btn-ghost text-[14px]">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-[8px]">
          {isAuthenticated && user ? (
            <>
              <Link href="/write" className="btn-teal text-[14px] py-[9px] px-[18px]">
                <PenSquare style={{ width: 15, height: 15 }} /> Write
              </Link>

              {/* ── Notification Bell ── */}
              <NotificationBell userId={user?.id || user?.userId} />

              {/* ── Profile dropdown ── */}
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-[8px] py-[6px] px-[10px] rounded-[10px] hover:bg-[var(--border2)] transition-colors">
                  <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid var(--parchment)', background: 'linear-gradient(135deg,var(--teal),var(--teal3))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {user?.profile?.avatarUrl
                      ? <img src={user.profile.avatarUrl} alt={user.profile.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '13px', color: '#fff' }}>{initials}</span>
                    }
                  </div>
                  <ChevronDown style={{ width: 14, height: 14, color: 'var(--muted)', transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: .97 }} transition={{ duration: .15 }}
                      className="absolute right-0 top-full mt-[6px] w-[200px] card py-[6px] z-50">
                      <Link href={`/profile/${encodeURIComponent(user?.email || user?.phone || user?.id || '')}`}
                        className="flex items-center gap-[10px] px-[14px] py-[10px] text-[13px] hover:bg-[var(--border2)] transition-colors no-underline" style={{ color: 'var(--ink)' }}>
                        <User style={{ width: 14, height: 14 }} /> My Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link href="/admin"
                          className="flex items-center gap-[10px] px-[14px] py-[10px] text-[13px] hover:bg-[var(--border2)] transition-colors no-underline" style={{ color: 'var(--ink)' }}>
                          <LayoutDashboard style={{ width: 14, height: 14 }} /> Admin Panel
                        </Link>
                      )}
                      <div className="h-[1px] my-[4px]" style={{ background: 'var(--border)' }} />
                      <Link href="/forgot-password"
                        className="flex items-center gap-[10px] px-[14px] py-[10px] text-[13px] hover:bg-[var(--border2)] transition-colors no-underline" style={{ color: 'var(--ink)' }}>
                        <span style={{ fontSize: '14px' }}>🔑</span> Change Password
                      </Link>
                      <div style={{ height: '1px', background: 'var(--border)', margin: '2px 0' }} />
                      <button onClick={logout}
                        className="w-full flex items-center gap-[10px] px-[14px] py-[10px] text-[13px] hover:bg-red-50 transition-colors text-left"
                        style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <LogOut style={{ width: 14, height: 14 }} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">{loginLabel}</Link>
              <Link href="/register" className="btn-teal py-[9px] px-[20px] text-[14px]">{ctaLabel}</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="lg:hidden p-[8px]" onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          {mobileOpen
            ? <X    style={{ width: 22, height: 22, color: 'var(--ink)' }} />
            : <Menu style={{ width: 22, height: 22, color: 'var(--ink)' }} />}
        </button>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: .22 }}
            className="fixed top-[71px] left-0 right-0 z-[90] overflow-hidden"
            style={{ background: 'rgba(253,246,236,0.98)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
            <div className="px-[5%] py-[16px] flex flex-col gap-[4px]">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="btn-ghost justify-start py-[12px]">{l.label}</Link>
              ))}
              <div className="h-[1px] my-[8px]" style={{ background: 'var(--border)' }} />
              {isAuthenticated ? (
                <Link href="/write" className="btn-teal justify-center">
                  <PenSquare style={{ width: 15, height: 15 }} /> Write a Post
                </Link>
              ) : (
                <div className="flex flex-col gap-[8px]">
                  <Link href="/login"    className="btn-outline justify-center">{loginLabel}</Link>
                  <Link href="/register" className="btn-teal justify-center">{ctaLabel}</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(mobileOpen || profileOpen) && (
        <div className="fixed inset-0 z-[80]" onClick={() => { setMobileOpen(false); setProfileOpen(false) }} />
      )}
    </>
  )
}
