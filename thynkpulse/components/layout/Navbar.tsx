'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, PenSquare, Bell, LogOut, User, LayoutDashboard, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { config } from '@/lib/config'
import { clsx } from 'clsx'

const NAV_LINKS = [
  { label: 'Latest Posts', href: '/latest-posts'  },
  { label: 'Trending',     href: '/trending'      },
  { label: 'Community',    href: '/community'     },
  { label: 'Writers',      href: '/writers'       },
  { label: 'Thynk Success ↗', href: config.app.parentSite, external: true },
]

export function Navbar() {
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
    ? user.profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <>
      {/* Scroll progress */}
      <div className="progress-bar" id="tp-progress" />

      <header className={clsx(
        'fixed top-[3px] left-0 right-0 z-[100] h-[68px] flex items-center justify-between px-[5%] transition-all duration-300',
        scrolled
          ? 'bg-[rgba(253,246,236,0.95)] backdrop-blur-[24px] border-b border-[rgba(10,95,85,0.12)]'
          : 'bg-[rgba(253,246,236,0.92)] backdrop-blur-[24px] border-b border-[rgba(10,95,85,0.12)]'
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
              <button className="relative p-[8px] rounded-[8px] hover:bg-[var(--border2)] transition-colors">
                <Bell style={{ width: 18, height: 18, color: 'var(--muted)' }} />
              </button>
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-[8px] py-[6px] px-[10px] rounded-[10px] hover:bg-[var(--border2)] transition-colors">
                  <div style={{ width:32, height:32, borderRadius:'50%', overflow:'hidden', flexShrink:0, border:'2px solid var(--parchment)', background:'linear-gradient(135deg,var(--teal),var(--teal3))', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {user?.profile?.avatarUrl
                      ? <img src={user.profile.avatarUrl} alt={user.profile.fullName} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <span style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'13px', color:'#fff' }}>{initials}</span>
                    }
                  </div>
                  <ChevronDown style={{ width:14, height:14, color:'var(--muted)', transform: profileOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s' }} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity:0, y:6, scale:.97 }} animate={{ opacity:1, y:0, scale:1 }}
                      exit={{ opacity:0, y:6, scale:.97 }} transition={{ duration:.15 }}
                      className="absolute right-0 top-full mt-[6px] w-[200px] card py-[6px] z-50">
                      <Link href={`/profile/${encodeURIComponent(user?.email || user?.phone || user?.id || '')}`} className="flex items-center gap-[10px] px-[14px] py-[10px] text-[13px] hover:bg-[var(--border2)] transition-colors no-underline" style={{ color: 'var(--ink)' }}>
                        <User style={{ width:14, height:14 }} /> My Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link href="/admin" className="flex items-center gap-[10px] px-[14px] py-[10px] text-[13px] hover:bg-[var(--border2)] transition-colors no-underline" style={{ color: 'var(--ink)' }}>
                          <LayoutDashboard style={{ width:14, height:14 }} /> Admin Panel
                        </Link>
                      )}
                      <div className="h-[1px] my-[4px]" style={{ background: 'var(--border)' }} />
                      <Link href="/forgot-password" className="flex items-center gap-[10px] px-[14px] py-[10px] text-[13px] hover:bg-[var(--border2)] transition-colors no-underline" style={{ color: 'var(--ink)', display:'flex' }}>
                        <span style={{ fontSize:'14px' }}>🔑</span> Change Password
                      </Link>
                      <div style={{ height:'1px', background:'var(--border)', margin:'2px 0' }} />
                      <button onClick={logout} className="w-full flex items-center gap-[10px] px-[14px] py-[10px] text-[13px] hover:bg-red-50 transition-colors text-left" style={{ color: '#DC2626', background:'none', border:'none', cursor:'pointer' }}>
                        <LogOut style={{ width:14, height:14 }} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">Login</Link>
              <Link href="/register" className="btn-teal py-[9px] px-[20px] text-[14px]">Start Writing</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="lg:hidden p-[8px]" onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background:'none', border:'none', cursor:'pointer' }}>
          {mobileOpen ? <X style={{ width:22, height:22, color:'var(--ink)' }} /> : <Menu style={{ width:22, height:22, color:'var(--ink)' }} />}
        </button>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }} transition={{ duration:.22 }}
            className="fixed top-[71px] left-0 right-0 z-[90] overflow-hidden"
            style={{ background:'rgba(253,246,236,0.98)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)' }}>
            <div className="px-[5%] py-[16px] flex flex-col gap-[4px]">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="btn-ghost justify-start py-[12px]">{l.label}</Link>
              ))}
              <div className="h-[1px] my-[8px]" style={{ background:'var(--border)' }} />
              {isAuthenticated ? (
                <Link href="/write" className="btn-teal justify-center"><PenSquare style={{ width:15,height:15 }} /> Write a Post</Link>
              ) : (
                <div className="flex flex-col gap-[8px]">
                  <Link href="/login" className="btn-outline justify-center">Login</Link>
                  <Link href="/register" className="btn-teal justify-center">Start Writing Free</Link>
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
