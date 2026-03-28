'use client'
import { useQuery } from '@tanstack/react-query'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { apiGet } from '@/lib/api'
import { Users, FileText, FileCheck, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const card = { background:'#fff', border:'1px solid var(--border)', borderRadius:'14px', padding:'20px' } as React.CSSProperties

export default function AdminPage() {
  const { data } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => apiGet('/admin/overview'),
    staleTime: 2 * 60 * 1000,
  })

  const STATS = [
    { icon: Users,     label: 'Total Users',       value: data?.totalUsers    || 0, color:'var(--teal)',  href:'/admin/users'     },
    { icon: FileText,  label: 'Total Posts',        value: data?.totalPosts    || 0, color:'var(--coral)', href:'/admin/approvals'  },
    { icon: FileCheck, label: 'Pending Approval',   value: data?.pendingPosts  || 0, color:'var(--gold)',  href:'/admin/approvals'  },
    { icon: Eye,       label: 'Total Views',        value: data?.totalViews    || 0, color:'var(--plum)',  href:'/'                 },
  ]

  return (
    <AdminLayout title="Overview" subtitle="Platform health at a glance">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'24px' }}>
        {STATS.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={s.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*.07 }}>
              <Link href={s.href} style={{ ...card, display:'block', textDecoration:'none', transition:'all .2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = s.color + '40'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'}>
                <div style={{ width:40, height:40, borderRadius:'10px', background:`${s.color}15`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'14px' }}>
                  <Icon style={{ width:20, height:20, color:s.color }} />
                </div>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'34px', fontWeight:900, color:'var(--ink)', lineHeight:1, marginBottom:'4px' }}>{s.value.toLocaleString()}</div>
                <div style={{ fontSize:'12px', color:'var(--muted)', fontWeight:500 }}>{s.label}</div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Recent activity */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div style={card}>
          <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'18px', fontWeight:900, color:'var(--ink)', marginBottom:'16px' }}>Recent Users</h3>
          {(data?.recentUsers || []).length === 0 ? (
            <p style={{ fontSize:'13px', color:'var(--muted)' }}>No users yet.</p>
          ) : (data?.recentUsers || []).map((u: any) => (
            <div key={u.id} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'9px 0', borderBottom:'1px solid var(--border2)' }}>
              <div className="avatar av-teal" style={{ width:32, height:32, fontSize:'12px', borderRadius:'9px' }}>{(u.fullName||'U')[0]}</div>
              <div>
                <div style={{ fontSize:'13px', fontWeight:600, color:'var(--ink)' }}>{u.fullName || 'User'}</div>
                <div style={{ fontSize:'11px', color:'var(--muted)' }}>{u.role} · {u.designation}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={card}>
          <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'18px', fontWeight:900, color:'var(--ink)', marginBottom:'16px' }}>Pending Approvals</h3>
          {(data?.pendingPostsList || []).length === 0 ? (
            <p style={{ fontSize:'13px', color:'var(--muted)' }}>No pending posts.</p>
          ) : (data?.pendingPostsList || []).map((p: any) => (
            <Link key={p.id} href="/admin/approvals" style={{ display:'flex', alignItems:'center', gap:'10px', padding:'9px 0', borderBottom:'1px solid var(--border2)', textDecoration:'none', color:'inherit' }}>
              <span style={{ fontSize:'22px' }}>{p.coverEmoji || '📝'}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'13px', fontWeight:600, color:'var(--ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title}</div>
                <div style={{ fontSize:'11px', color:'var(--muted)' }}>{p.authorName}</div>
              </div>
              <span className="badge badge-coral" style={{ fontSize:'10px', flexShrink:0 }}>Pending</span>
            </Link>
          ))}
          <Link href="/admin/approvals" className="btn-teal" style={{ display:'block', textAlign:'center', marginTop:'14px', padding:'9px', fontSize:'13px' }}>Review All →</Link>
        </div>
      </div>
    </AdminLayout>
  )
}
