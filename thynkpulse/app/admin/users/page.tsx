'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { apiGet, apiPut } from '@/lib/api'
import { Search, UserCheck, UserX, Download, Linkedin, CheckCircle, XCircle, Activity, X, Globe, Monitor, Smartphone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const TABS = ['All','Educators','EdTech Pro','Other','Inactive']

const ROLE_STYLE: Record<string, { bg:string; color:string; label:string }> = {
  educator:   { bg:'rgba(10,95,85,.1)',   color:'var(--teal)',  label:'Educator'   },
  edtech_pro: { bg:'rgba(61,31,94,.1)',   color:'var(--plum)',  label:'EdTech Pro' },
  other:      { bg:'rgba(122,106,82,.1)', color:'var(--muted)', label:'Other'      },
}

const ACTION_STYLE: Record<string, { color:string; bg:string; emoji:string }> = {
  login:            { color:'#4ADE80', bg:'rgba(74,222,128,.1)',   emoji:'🔐' },
  login_failed:     { color:'#F87171', bg:'rgba(239,68,68,.1)',    emoji:'⚠️' },
  register:         { color:'#60A5FA', bg:'rgba(96,165,250,.1)',   emoji:'✨' },
  post_created:     { color:'var(--teal)',  bg:'rgba(10,95,85,.1)',  emoji:'✍️' },
  post_approved:    { color:'#4ADE80', bg:'rgba(74,222,128,.1)',   emoji:'✅' },
  post_rejected:    { color:'#F87171', bg:'rgba(239,68,68,.1)',    emoji:'❌' },
  profile_updated:  { color:'var(--gold)', bg:'rgba(201,146,42,.1)', emoji:'👤' },
  comment:          { color:'var(--coral)', bg:'rgba(232,81,42,.1)', emoji:'💬' },
  password_changed: { color:'#A78BFA', bg:'rgba(167,139,250,.1)',  emoji:'🔑' },
}

function fmt(date: string|null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'2-digit' })
}

function fmtDateTime(date: string|null) {
  if (!date) return '—'
  return new Date(date).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'2-digit', hour:'2-digit', minute:'2-digit', hour12:true })
}

function getDeviceIcon(ua: string|null) {
  if (!ua) return <Monitor style={{ width:12, height:12 }} />
  const u = ua.toLowerCase()
  if (u.includes('mobile') || u.includes('android') || u.includes('iphone'))
    return <Smartphone style={{ width:12, height:12 }} />
  return <Monitor style={{ width:12, height:12 }} />
}

function exportToExcel(users: any[]) {
  const headers = ['Name','Email','Phone','Role','Designation','Company','Institute','Experience','LinkedIn','Posts','Profile Complete','Last IP','Active','Joined','Last Login']
  const rows = users.map(u => [
    u.fullName||'', u.email||'', u.phone||'', u.role||'', u.designation||'',
    u.companyName||'', u.instituteName||'', u.totalExp ? `${u.totalExp} yrs` : '',
    u.linkedinUrl||'', u.postCount||0, u.profileCompleted?'Yes':'No',
    u.lastIp||'', u.isActive?'Active':'Inactive', fmt(u.createdAt), fmt(u.lastLoginAt),
  ])
  const csv = [headers,...rows].map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
  if (typeof window === 'undefined') return
  const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = `thynkpulse-users-${new Date().toISOString().slice(0,10)}.csv`; a.click()
  URL.revokeObjectURL(url)
  toast.success('Exported as CSV — opens in Excel')
}

/* ── Activity Log Drawer ── */
function ActivityDrawer({ user, onClose }: { user:any; onClose:()=>void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user-activity', user.id],
    queryFn: () => apiGet(`/admin/users/${user.id}/activity?limit=50`),
    staleTime: 30 * 1000,
  })

  const logs = data?.logs || []

  return (
    <motion.div
      initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
      transition={{ type:'spring', damping:30, stiffness:300 }}
      style={{ position:'fixed', top:0, right:0, bottom:0, width:'440px', zIndex:200, background:'#fff', boxShadow:'-8px 0 40px rgba(26,18,8,.15)', display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <div style={{ padding:'18px 20px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'18px', fontWeight:900, color:'var(--ink)' }}>Activity Log</div>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:'8px', border:'1.5px solid var(--parchment)', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--muted)' }}>
            <X style={{ width:14, height:14 }} />
          </button>
        </div>
        {/* User summary */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', background:'var(--cream2)', borderRadius:'10px' }}>
          <div style={{ width:36, height:36, borderRadius:'9px', background:'linear-gradient(135deg,var(--teal),var(--teal3))', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'14px', color:'#fff', flexShrink:0 }}>
            {(user.fullName||user.email||'U')[0].toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:600, fontSize:'13px', color:'var(--ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.fullName || '—'}</div>
            <div style={{ fontSize:'11px', color:'var(--muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email || user.phone}</div>
          </div>
          <div style={{ textAlign:'right', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'11px', color:'var(--muted)', fontFamily:'var(--font-sans)' }}>
              <Globe style={{ width:11, height:11 }} />
              {user.lastIp || '—'}
            </div>
            <div style={{ fontSize:'10px', color:'var(--muted)', marginTop:'2px', fontFamily:'var(--font-sans)' }}>Last IP</div>
          </div>
        </div>
        {/* Quick stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'6px', marginTop:'10px' }}>
          {[
            { label:'Total Events', value:logs.length },
            { label:'Last Login',   value:fmt(user.lastLoginAt) },
            { label:'Joined',       value:fmt(user.createdAt) },
          ].map(s=>(
            <div key={s.label} style={{ background:'var(--cream)', borderRadius:'8px', padding:'8px 10px', textAlign:'center' }}>
              <div style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'15px', color:'var(--ink)', lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:'9px', color:'var(--muted)', marginTop:'3px', fontFamily:'var(--font-sans)', textTransform:'uppercase', letterSpacing:'.08em', fontWeight:600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Log list */}
      <div style={{ flex:1, overflowY:'auto', padding:'14px 20px' }}>
        {isLoading
          ? Array.from({length:6}).map((_,i) => (
              <div key={i} style={{ height:'56px', background:'var(--cream)', borderRadius:'10px', marginBottom:'8px' }} />
            ))
          : logs.length === 0
            ? (
              <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--muted)' }}>
                <Activity style={{ width:32, height:32, margin:'0 auto 10px', opacity:.3 }} />
                <div style={{ fontFamily:'var(--font-sans)', fontSize:'13px' }}>No activity logged yet</div>
              </div>
            )
            : logs.map((log:any, i:number) => {
                const s = ACTION_STYLE[log.action] || { color:'var(--muted)', bg:'var(--cream)', emoji:'•' }
                return (
                  <div key={log.id} style={{ display:'flex', gap:'12px', padding:'10px 0', borderBottom:'1px solid var(--border2)' }}>
                    {/* Timeline dot */}
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                      <div style={{ width:32, height:32, borderRadius:'9px', background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', flexShrink:0 }}>{s.emoji}</div>
                      {i < logs.length-1 && <div style={{ width:1, flex:1, background:'var(--border2)', marginTop:'4px', minHeight:'8px' }} />}
                    </div>
                    {/* Content */}
                    <div style={{ flex:1, minWidth:0, paddingBottom:'8px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'2px' }}>
                        <span style={{ fontSize:'11px', fontWeight:700, padding:'2px 7px', borderRadius:'100px', background:s.bg, color:s.color, fontFamily:'var(--font-sans)', textTransform:'uppercase', letterSpacing:'.06em' }}>
                          {log.action.replace(/_/g,' ')}
                        </span>
                      </div>
                      {log.detail && (
                        <div style={{ fontSize:'12px', color:'var(--ink)', fontFamily:'var(--font-sans)', marginBottom:'4px', fontWeight:500 }}>{log.detail}</div>
                      )}
                      <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
                        <span style={{ fontSize:'11px', color:'var(--muted)', fontFamily:'var(--font-sans)' }}>
                          🕐 {fmtDateTime(log.created_at)}
                        </span>
                        {log.ip_address && (
                          <span style={{ display:'flex', alignItems:'center', gap:'3px', fontSize:'11px', color:'var(--muted)', fontFamily:'var(--font-mono)' }}>
                            <Globe style={{ width:10, height:10 }} /> {log.ip_address}
                          </span>
                        )}
                        {log.user_agent && (
                          <span style={{ display:'flex', alignItems:'center', gap:'3px', fontSize:'11px', color:'var(--muted)', fontFamily:'var(--font-sans)' }}>
                            {getDeviceIcon(log.user_agent)}
                            {log.user_agent.includes('Mobile') ? 'Mobile' : 'Desktop'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
        }
      </div>
    </motion.div>
  )
}

/* ── Main Page ── */
export default function AdminUsersPage() {
  const qc = useQueryClient()
  const [tab,         setTab]         = useState('All')
  const [search,      setSearch]      = useState('')
  const [page,        setPage]        = useState(1)
  const [activeUser,  setActiveUser]  = useState<any>(null)

  const params = new URLSearchParams({ page:String(page), limit:'20', search })
  if (tab==='Educators')  params.set('role','educator')
  if (tab==='EdTech Pro') params.set('role','edtech_pro')
  if (tab==='Other')      params.set('role','other')
  if (tab==='Inactive')   params.set('isActive','false')

  const { data, isLoading } = useQuery<{ data:any[]; total:number }>({
    queryKey: ['admin-users', tab, search, page],
    queryFn: () => apiGet(`/admin/users?${params.toString()}`),
    staleTime: 2 * 60 * 1000,
  })

  const users = data?.data || []
  const total = data?.total || 0

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }:{id:string;isActive:boolean}) => apiPut(`/admin/users/${id}`,{isActive}),
    onSuccess: (_,{isActive}) => { toast.success(isActive?'User activated':'User deactivated'); qc.invalidateQueries({queryKey:['admin-users']}) },
    onError: () => toast.error('Action failed'),
  })

  const cell: React.CSSProperties = { padding:'10px 12px', fontSize:'12px', fontFamily:'var(--font-sans)', color:'var(--ink)', borderBottom:'1px solid var(--border2)', verticalAlign:'top' }
  const hd:   React.CSSProperties = { padding:'9px 12px', fontSize:'10px', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted)', fontFamily:'var(--font-mono)', borderBottom:'1px solid var(--border)', background:'var(--cream2)', whiteSpace:'nowrap' }

  return (
    <AdminLayout title="Users" subtitle="All registered users — view profile details, activity and manage access">

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'18px' }}>
        {[
          { label:'Total Users',        value:total,                                        color:'var(--teal)'  },
          { label:'Profile Complete',   value:users.filter(u=>u.profileCompleted).length,   color:'#4ADE80'      },
          { label:'Profile Incomplete', value:users.filter(u=>!u.profileCompleted).length,  color:'var(--gold)'  },
          { label:'Inactive',           value:users.filter(u=>!u.isActive).length,          color:'var(--coral)' },
        ].map((s,i) => (
          <motion.div key={s.label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*.06}}
            style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'12px', padding:'16px' }}>
            <div style={{ fontFamily:'var(--font-serif)', fontWeight:900, fontSize:'28px', color:s.color, lineHeight:1, marginBottom:'4px' }}>{s.value}</div>
            <div style={{ fontSize:'11px', color:'var(--muted)', fontFamily:'var(--font-sans)', textTransform:'uppercase', letterSpacing:'.08em', fontWeight:600 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'14px', overflow:'hidden' }}>

        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 14px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'7px', flex:1, background:'var(--cream)', border:'1.5px solid var(--parchment)', borderRadius:'8px', padding:'7px 11px' }}>
            <Search style={{ width:13, height:13, color:'var(--muted)', flexShrink:0 }} />
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}
              placeholder="Search name, email, phone, company..."
              style={{ background:'none', border:'none', outline:'none', fontSize:'13px', fontFamily:'var(--font-sans)', color:'var(--ink)', flex:1 }} />
          </div>
          <div style={{ display:'flex', gap:'5px' }}>
            {TABS.map(t=>(
              <button key={t} onClick={()=>{setTab(t);setPage(1)}}
                style={{ padding:'7px 13px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:600, fontFamily:'var(--font-sans)', background:tab===t?'var(--teal)':'var(--cream2)', color:tab===t?'#fff':'var(--muted)', transition:'all .15s', whiteSpace:'nowrap' }}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={()=>exportToExcel(users)} disabled={users.length===0}
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'7px 14px', borderRadius:'8px', background:'rgba(10,95,85,.08)', border:'1px solid rgba(10,95,85,.2)', color:'var(--teal)', cursor:'pointer', fontSize:'12px', fontWeight:600, fontFamily:'var(--font-sans)', whiteSpace:'nowrap' }}>
            <Download style={{ width:13, height:13 }} /> Export Excel
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['User','Role','Company / Institute','Exp.','LinkedIn','Posts','Profile','IP Address','Last Login','Joined','Status','Actions'].map(h=>(
                  <th key={h} style={hd}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({length:8}).map((_,i)=>(
                    <tr key={i}><td colSpan={12} style={{padding:'10px 14px'}}>
                      <div style={{height:'36px',background:'var(--cream)',borderRadius:'6px'}} />
                    </td></tr>
                  ))
                : users.length===0
                  ? <tr><td colSpan={12} style={{...cell,textAlign:'center',padding:'40px',color:'var(--muted)'}}>No users found.</td></tr>
                  : users.map((u:any)=>{
                      const role = ROLE_STYLE[u.role]||ROLE_STYLE.other
                      return (
                        <tr key={u.id}
                          onMouseEnter={e=>(e.currentTarget as HTMLTableRowElement).style.background='var(--cream)'}
                          onMouseLeave={e=>(e.currentTarget as HTMLTableRowElement).style.background='transparent'}>

                          {/* User */}
                          <td style={{...cell,minWidth:'160px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                              <div style={{width:32,height:32,borderRadius:'8px',background:role.bg,border:`1px solid ${role.color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-serif)',fontWeight:900,fontSize:'13px',color:role.color,flexShrink:0}}>
                                {(u.fullName||u.email||'U')[0].toUpperCase()}
                              </div>
                              <div style={{minWidth:0}}>
                                <div style={{fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'130px'}}>{u.fullName||'—'}</div>
                                <div style={{fontSize:'11px',color:'var(--muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'130px'}}>{u.email||u.phone}</div>
                                {u.designation&&<div style={{fontSize:'10px',color:'var(--muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'130px'}}>{u.designation}</div>}
                              </div>
                            </div>
                          </td>
                          {/* Role */}
                          <td style={cell}><span style={{fontSize:'10px',fontWeight:700,padding:'3px 8px',borderRadius:'100px',background:role.bg,color:role.color,whiteSpace:'nowrap'}}>{role.label}</span></td>
                          {/* Company */}
                          <td style={{...cell,maxWidth:'130px'}}><div style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'12px'}}>{u.companyName||u.instituteName||<span style={{color:'var(--muted)'}}>—</span>}</div></td>
                          {/* Exp */}
                          <td style={{...cell,color:'var(--muted)',fontSize:'12px',whiteSpace:'nowrap'}}>{u.totalExp?`${u.totalExp} yrs`:'—'}</td>
                          {/* LinkedIn */}
                          <td style={cell}>
                            {u.linkedinUrl
                              ? <a href={u.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:'4px',color:'#0A66C2',fontSize:'11px',fontWeight:600,textDecoration:'none'}}><Linkedin style={{width:12,height:12}}/>View</a>
                              : <span style={{color:'var(--muted)',fontSize:'11px'}}>—</span>}
                          </td>
                          {/* Posts */}
                          <td style={{...cell,textAlign:'center',fontSize:'13px',fontWeight:600,color:u.postCount>0?'var(--teal)':'var(--muted)'}}>{u.postCount||0}</td>
                          {/* Profile */}
                          <td style={{...cell,textAlign:'center'}}>
                            {u.profileCompleted
                              ? <span style={{display:'inline-flex',alignItems:'center',gap:'3px',fontSize:'11px',fontWeight:600,color:'#4ADE80'}}><CheckCircle style={{width:12,height:12}}/>Yes</span>
                              : <span style={{display:'inline-flex',alignItems:'center',gap:'3px',fontSize:'11px',fontWeight:600,color:'var(--coral)'}}><XCircle style={{width:12,height:12}}/>No</span>}
                          </td>
                          {/* IP */}
                          <td style={{...cell,fontSize:'11px',fontFamily:'var(--font-mono)',color:'var(--muted)',whiteSpace:'nowrap'}}>
                            {u.lastIp
                              ? <div style={{display:'flex',alignItems:'center',gap:'4px'}}><Globe style={{width:10,height:10}}/>{u.lastIp}</div>
                              : '—'}
                          </td>
                          {/* Last Login */}
                          <td style={{...cell,fontSize:'11px',color:'var(--muted)',whiteSpace:'nowrap'}}>{fmt(u.lastLoginAt)}</td>
                          {/* Joined */}
                          <td style={{...cell,fontSize:'11px',color:'var(--muted)',whiteSpace:'nowrap'}}>{fmt(u.createdAt)}</td>
                          {/* Status */}
                          <td style={cell}>
                            <span style={{fontSize:'10px',fontWeight:700,padding:'3px 8px',borderRadius:'100px',background:u.isActive?'rgba(74,222,128,.1)':'rgba(239,68,68,.1)',color:u.isActive?'#4ADE80':'#F87171'}}>
                              {u.isActive?'Active':'Inactive'}
                            </span>
                          </td>
                          {/* Actions */}
                          <td style={cell}>
                            <div style={{display:'flex',gap:'5px',alignItems:'center'}}>
                              <button onClick={()=>setActiveUser(u)}
                                style={{display:'flex',alignItems:'center',gap:'4px',padding:'5px 9px',borderRadius:'6px',background:'rgba(201,146,42,.08)',border:'1px solid rgba(201,146,42,.2)',color:'var(--gold)',cursor:'pointer',fontSize:'11px',fontWeight:600,fontFamily:'var(--font-sans)',whiteSpace:'nowrap'}}>
                                <Activity style={{width:11,height:11}}/> Logs
                              </button>
                              <button onClick={()=>toggleMutation.mutate({id:u.id,isActive:!u.isActive})}
                                style={{display:'flex',alignItems:'center',gap:'4px',padding:'5px 9px',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'11px',fontWeight:600,fontFamily:'var(--font-sans)',whiteSpace:'nowrap',background:u.isActive?'rgba(239,68,68,.08)':'rgba(74,222,128,.1)',color:u.isActive?'#F87171':'#4ADE80'}}>
                                {u.isActive?<><UserX style={{width:11,height:11}}/>Off</>:<><UserCheck style={{width:11,height:11}}/>On</>}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total>20 && (
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',borderTop:'1px solid var(--border)'}}>
            <span style={{fontSize:'12px',color:'var(--muted)',fontFamily:'var(--font-sans)'}}>{((page-1)*20)+1}–{Math.min(page*20,total)} of {total} users</span>
            <div style={{display:'flex',gap:'6px'}}>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                style={{padding:'6px 13px',borderRadius:'8px',background:'var(--cream2)',border:'1px solid var(--border)',color:'var(--muted)',cursor:'pointer',fontSize:'12px',opacity:page===1?.4:1}}>← Prev</button>
              <button onClick={()=>setPage(p=>p+1)} disabled={page*20>=total}
                style={{padding:'6px 13px',borderRadius:'8px',background:'var(--cream2)',border:'1px solid var(--border)',color:'var(--muted)',cursor:'pointer',fontSize:'12px',opacity:page*20>=total?.4:1}}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Activity drawer backdrop */}
      <AnimatePresence>
        {activeUser && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={()=>setActiveUser(null)}
              style={{position:'fixed',inset:0,background:'rgba(26,18,8,.4)',zIndex:199,backdropFilter:'blur(2px)'}} />
            <ActivityDrawer user={activeUser} onClose={()=>setActiveUser(null)} />
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
