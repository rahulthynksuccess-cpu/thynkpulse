'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { apiGet, apiPut } from '@/lib/api'
import { Search, UserCheck, UserX, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import toast from 'react-hot-toast'

const TABS = ['All','Educators','EdTech Pro','Other','Inactive']

export default function AdminUsersPage() {
  const qc = useQueryClient()
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const params = new URLSearchParams({ page:String(page), limit:'20', search })
  if (tab==='Educators')   params.set('role','educator')
  if (tab==='EdTech Pro')  params.set('role','edtech_pro')
  if (tab==='Other')       params.set('role','other')
  if (tab==='Inactive')    params.set('isActive','false')

  const { data, isLoading } = useQuery<{ data: any[]; total: number }>({
    queryKey: ['admin-users', tab, search, page],
    queryFn: () => apiGet(`/admin/users?${params.toString()}`),
    staleTime: 2 * 60 * 1000,
  })

  const users = data?.data || []
  const total = data?.total || 0

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id:string; isActive:boolean }) => apiPut(`/admin/users/${id}`, { isActive }),
    onSuccess: (_,{ isActive }) => { toast.success(isActive ? 'User activated' : 'User deactivated'); qc.invalidateQueries({ queryKey: ['admin-users'] }) },
    onError: () => toast.error('Action failed'),
  })

  const cell: React.CSSProperties = { padding:'11px 14px', fontSize:'13px', fontFamily:'var(--font-sans)', color:'var(--ink)', borderBottom:'1px solid var(--border2)' }
  const hd:   React.CSSProperties = { padding:'9px 14px', fontSize:'10px', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', fontFamily:'var(--font-mono)', borderBottom:'1px solid var(--border)', background:'var(--cream2)', whiteSpace:'nowrap' }

  return (
    <AdminLayout title="Users" subtitle="Register, view, update and manage all platform users">
      <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'14px', overflow:'hidden' }}>

        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', flex:1, background:'var(--cream)', border:'1px solid var(--border)', borderRadius:'9px', padding:'8px 12px' }}>
            <Search style={{ width:14, height:14, color:'var(--muted)', flexShrink:0 }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search name, email, phone..."
              style={{ background:'none', border:'none', outline:'none', fontSize:'13px', fontFamily:'var(--font-sans)', color:'var(--ink)', flex:1 }} />
          </div>
          <div style={{ display:'flex', gap:'5px' }}>
            {TABS.map(t => (
              <button key={t} onClick={() => { setTab(t); setPage(1) }}
                style={{ padding:'7px 14px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:500, fontFamily:'var(--font-sans)', background: tab===t ? 'var(--teal)' : 'var(--cream)', color: tab===t ? '#fff' : 'var(--muted)', transition:'all .18s', whiteSpace:'nowrap' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['User','Role','Contact','Designation','Posts','Status','Actions'].map(h => <th key={h} style={hd}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {isLoading ? Array.from({length:8}).map((_,i) => (
                <tr key={i}><td colSpan={7} style={{ padding:'12px 14px' }}><div className="skeleton" style={{ height:36 }} /></td></tr>
              )) : users.length===0 ? (
                <tr><td colSpan={7} style={{ ...cell, textAlign:'center', padding:'40px', color:'var(--muted)' }}>No users found.</td></tr>
              ) : users.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*.04 }}
                  style={{ background: i%2===0 ? '#fff' : 'rgba(253,246,236,.4)' }}>
                  <td style={cell}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div className="avatar av-teal" style={{ width:32, height:32, fontSize:'12px', borderRadius:'9px', flexShrink:0 }}>
                        {(u.fullName||'U').split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div style={{ fontWeight:600 }}>{u.fullName||'—'}</div>
                        <div style={{ fontSize:'11px', color:'var(--muted)' }}>{u.email||u.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={cell}>
                    <span className={`badge ${u.role==='educator'?'badge-teal':u.role==='edtech_pro'?'badge-coral':'badge-plum'}`} style={{ fontSize:'10px' }}>
                      {u.role==='educator'?'Educator':u.role==='edtech_pro'?'EdTech Pro':u.role==='admin'?'Admin':'Other'}
                    </span>
                  </td>
                  <td style={{ ...cell, color:'var(--muted)' }}>{u.contactNumber||u.phone||'—'}</td>
                  <td style={{ ...cell, color:'var(--muted)', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.designation||'—'}</td>
                  <td style={{ ...cell, fontWeight:600, color:'var(--teal)' }}>{u.postCount||0}</td>
                  <td style={cell}>
                    {u.isActive
                      ? <span className="badge badge-teal" style={{ fontSize:'10px' }}>Active</span>
                      : <span className="badge badge-coral" style={{ fontSize:'10px' }}>Inactive</span>
                    }
                  </td>
                  <td style={cell}>
                    <div style={{ display:'flex', gap:'5px' }}>
                      <Link href={`/profile/${u.id}`} title="View Profile"
                        style={{ padding:'6px 10px', borderRadius:'7px', background:'var(--cream)', border:'1px solid var(--border)', color:'var(--muted)', display:'flex', alignItems:'center', gap:'4px', textDecoration:'none', fontSize:'11px', fontWeight:600 }}>
                        <Eye style={{ width:12, height:12 }} /> View
                      </Link>
                      {u.role !== 'admin' && (
                        <button onClick={() => { if (!u.isActive || confirm(`Deactivate ${u.fullName}?`)) toggleMutation.mutate({ id:u.id, isActive:!u.isActive }) }}
                          style={{ padding:'6px 10px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'11px', fontFamily:'var(--font-sans)', fontWeight:600, display:'flex', alignItems:'center', gap:'4px', background: u.isActive?'rgba(232,81,42,.08)':'rgba(10,95,85,.08)', color: u.isActive?'var(--coral)':'var(--teal)' }}>
                          {u.isActive ? <><UserX style={{ width:12, height:12 }} />Deactivate</> : <><UserCheck style={{ width:12, height:12 }} />Activate</>}
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {total > 20 && (
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', borderTop:'1px solid var(--border)' }}>
            <span style={{ fontSize:'12px', color:'var(--muted)' }}>Showing {(page-1)*20+1}–{Math.min(page*20,total)} of {total}</span>
            <div style={{ display:'flex', gap:'6px' }}>
              <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ padding:'6px 14px', borderRadius:'7px', background:'var(--cream)', border:'1px solid var(--border)', color:'var(--muted)', cursor:'pointer', fontSize:'12px', opacity:page===1?.4:1 }}>← Prev</button>
              <button onClick={() => setPage(p=>p+1)} disabled={page*20>=total} style={{ padding:'6px 14px', borderRadius:'7px', background:'var(--cream)', border:'1px solid var(--border)', color:'var(--muted)', cursor:'pointer', fontSize:'12px', opacity:page*20>=total?.4:1 }}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
