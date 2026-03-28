'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, FileText, Users, FileCheck, Palette, LogOut, Menu, X, GraduationCap, Settings } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const NAV = [
  { icon: LayoutDashboard, label: 'Overview',    href: '/admin'            },
  { icon: Users,           label: 'Users',        href: '/admin/users'      },
  { icon: FileCheck,       label: 'Approvals',    href: '/admin/approvals'  },
  { icon: Palette,         label: 'Theme',        href: '/admin/theme'      },
]

export function AdminLayout({ children, title, subtitle }: {
  children: React.ReactNode
  title: string
  subtitle?: string
}) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const [open, setOpen] = useState(false)

  const Sidebar = ({ onClose }: { onClose?: () => void }) => (
    <aside style={{ width:240, background:'var(--ink)', display:'flex', flexDirection:'column', height:'100%', flexShrink:0 }}>
      <div style={{ padding:'20px', borderBottom:'1px solid rgba(255,255,255,.08)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:'8px', textDecoration:'none' }}>
          <div style={{ width:32, height:32, borderRadius:'8px', background:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'15px', color:'#fff' }}>TP</span>
          </div>
          <span style={{ fontFamily:'var(--font-serif)', fontSize:'16px', fontWeight:900, color:'#fff' }}>Thynk <em style={{ fontStyle:'normal', color:'var(--teal3)' }}>Pulse</em></span>
        </Link>
        {onClose && <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,.4)', display:'flex' }}><X style={{ width:16, height:16 }} /></button>}
      </div>

      <div style={{ padding:'14px', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:34, height:34, borderRadius:'9px', background:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'14px', color:'#fff' }}>
            {(user?.profile?.fullName || 'A')[0]}
          </div>
          <div>
            <div style={{ fontSize:'13px', fontWeight:600, color:'#fff', fontFamily:'var(--font-sans)' }}>{user?.profile?.fullName || 'Admin'}</div>
            <div style={{ fontSize:'10px', background:'rgba(10,95,85,.2)', color:'var(--teal3)', padding:'2px 8px', borderRadius:'100px', display:'inline-block', marginTop:'2px', fontFamily:'var(--font-mono)', fontWeight:700, letterSpacing:'.04em' }}>ADMIN</div>
          </div>
        </div>
      </div>

      <nav style={{ flex:1, padding:'10px', display:'flex', flexDirection:'column', gap:'2px', overflowY:'auto' }}>
        {NAV.map(({ icon: Icon, label, href }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'10px', fontFamily:'var(--font-sans)', fontSize:'13px', fontWeight:500, textDecoration:'none', transition:'all .18s', background: active ? 'var(--teal)' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,.5)' }}>
              <Icon style={{ width:16, height:16, flexShrink:0 }} />{label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding:'10px', borderTop:'1px solid rgba(255,255,255,.06)' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'10px', fontSize:'13px', color:'rgba(255,255,255,.4)', textDecoration:'none', fontFamily:'var(--font-sans)', marginBottom:'4px' }}>
          <GraduationCap style={{ width:15, height:15 }} /> View Site
        </Link>
        <button onClick={logout} style={{ width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'10px', background:'none', border:'none', cursor:'pointer', fontSize:'13px', color:'#F87171', fontFamily:'var(--font-sans)' }}>
          <LogOut style={{ width:15, height:15 }} /> Logout
        </button>
      </div>
    </aside>
  )

  return (
    <div style={{ display:'flex', height:'100vh', background:'var(--cream2)', overflow:'hidden', fontFamily:'var(--font-sans)' }}>
      <div className="hidden lg:flex" style={{ flexShrink:0 }}><Sidebar /></div>
      {open && (
        <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex' }}>
          <Sidebar onClose={() => setOpen(false)} />
          <div style={{ flex:1, background:'rgba(0,0,0,.5)' }} onClick={() => setOpen(false)} />
        </div>
      )}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <header style={{ display:'flex', alignItems:'center', gap:'16px', padding:'14px 24px', borderBottom:'1px solid var(--border)', background:'#fff', flexShrink:0 }}>
          <button className="lg:hidden" onClick={() => setOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex' }}>
            <Menu style={{ width:20, height:20, color:'var(--ink)' }} />
          </button>
          <div>
            <h1 style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'20px', color:'var(--ink)', margin:0, letterSpacing:'-.3px' }}>{title}</h1>
            {subtitle && <p style={{ fontSize:'12px', color:'var(--muted)', margin:0, marginTop:'2px' }}>{subtitle}</p>}
          </div>
        </header>
        <main style={{ flex:1, overflowY:'auto', padding:'24px' }}>{children}</main>
      </div>
    </div>
  )
}
