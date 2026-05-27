'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { apiGet } from '@/lib/api'
import { Clock, Users, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react'
import { fmtTime } from '@/hooks/useSessionTracker'

const RANGES = [
  { label: 'Today',   value: '1d'  },
  { label: '7 Days',  value: '7d'  },
  { label: '30 Days', value: '30d' },
  { label: 'All Time',value: 'all' },
]

const card: React.CSSProperties = {
  background: '#fff', border: '1px solid var(--border)',
  borderRadius: '14px', padding: '20px',
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string; sub?: string; color: string
}) {
  return (
    <div style={card}>
      <div style={{ width:40, height:40, borderRadius:'10px', background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'14px' }}>
        <Icon style={{ width:20, height:20, color }} />
      </div>
      <div style={{ fontFamily:'var(--font-serif)', fontSize:'30px', fontWeight:900, color:'var(--ink)', lineHeight:1, marginBottom:'4px' }}>{value}</div>
      <div style={{ fontSize:'12px', color:'var(--muted)', fontWeight:500 }}>{label}</div>
      {sub && <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'4px', opacity:.7 }}>{sub}</div>}
    </div>
  )
}

// Simple inline bar chart using divs
function BarChart({ data, valueKey, labelKey, color = 'var(--teal)' }: {
  data: any[]; valueKey: string; labelKey: string; color?: string
}) {
  if (!data?.length) return <div style={{ color:'var(--muted)', fontSize:'13px', padding:'20px 0' }}>No data yet.</div>
  const max = Math.max(...data.map(d => d[valueKey]))
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:'100px 1fr 48px', alignItems:'center', gap:'10px' }}>
          <div style={{ fontSize:'12px', color:'var(--muted)', textAlign:'right', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d[labelKey]}</div>
          <div style={{ height:'10px', borderRadius:'6px', background:'var(--border2)', overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${max ? (d[valueKey]/max)*100 : 0}%`, background:color, borderRadius:'6px', transition:'width .4s ease' }} />
          </div>
          <div style={{ fontSize:'12px', color:'var(--ink)', fontWeight:600 }}>{typeof d[valueKey] === 'number' && valueKey.includes('Sec') ? fmtTime(d[valueKey]) : d[valueKey]}</div>
        </div>
      ))}
    </div>
  )
}

// Distribution donut-like display
function BucketChart({ data }: { data: { bucket: string; count: number }[] }) {
  if (!data?.length) return <div style={{ color:'var(--muted)', fontSize:'13px', padding:'20px 0' }}>No data yet.</div>
  const total = data.reduce((s, d) => s + d.count, 0)
  const colors = ['#E8512A','#C9922A','#0A5F55','#0D7A6D','#12A090','#3D1F5E']
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
      {data.map((d, i) => {
        const pct = total ? Math.round(d.count / total * 100) : 0
        return (
          <div key={d.bucket} style={{ display:'grid', gridTemplateColumns:'64px 1fr 48px 40px', alignItems:'center', gap:'10px' }}>
            <div style={{ fontSize:'12px', color:'var(--muted)', textAlign:'right' }}>{d.bucket}</div>
            <div style={{ height:'10px', borderRadius:'6px', background:'var(--border2)', overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${pct}%`, background:colors[i % colors.length], borderRadius:'6px' }} />
            </div>
            <div style={{ fontSize:'12px', color:'var(--ink)', fontWeight:600 }}>{d.count.toLocaleString()}</div>
            <div style={{ fontSize:'11px', color:'var(--muted)' }}>{pct}%</div>
          </div>
        )
      })}
    </div>
  )
}

export default function AnalyticsPage() {
  const [range, setRange] = useState('7d')

  const { data, isLoading } = useQuery({
    queryKey: ['analytics-sessions', range],
    queryFn: () => apiGet(`/analytics/session?range=${range}`),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  })

  const ov = data?.overview
  const byDay   = data?.byDay   || []
  const byPage  = data?.byPage  || []
  const dist    = data?.distribution || []

  return (
    <AdminLayout title="Time Analytics" subtitle="Average time users spend on ThynkPulse">
      {/* Range selector */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'24px', flexWrap:'wrap' }}>
        {RANGES.map(r => (
          <button key={r.value} onClick={() => setRange(r.value)}
            style={{
              padding:'7px 18px', borderRadius:'8px', border:'1.5px solid',
              borderColor: range === r.value ? 'var(--teal)' : 'var(--parchment)',
              background:  range === r.value ? 'rgba(10,95,85,.08)' : 'transparent',
              color:       range === r.value ? 'var(--teal)' : 'var(--muted)',
              fontFamily: 'var(--font-sans)', fontSize:'13px', fontWeight:600, cursor:'pointer',
            }}>
            {r.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px' }}>
          {[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{ height:120, borderRadius:14 }} />)}
        </div>
      ) : !ov ? (
        <div style={{ ...card, textAlign:'center', padding:'48px', color:'var(--muted)' }}>
          <Clock style={{ width:48, height:48, marginBottom:16, opacity:.3 }} />
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'20px', marginBottom:8 }}>No session data yet</div>
          <div style={{ fontSize:'14px' }}>Add the <code style={{ background:'var(--border2)', padding:'2px 6px', borderRadius:4 }}>SessionTracker</code> component to your layout to start collecting data.</div>
        </div>
      ) : (
        <>
          {/* Overview stat cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'14px', marginBottom:'28px' }}>
            <StatCard icon={Clock}       label="Avg Time on Site"      value={fmtTime(ov.avgDurationSec)}  color="var(--teal)"  sub="all sessions" />
            <StatCard icon={TrendingUp}  label="Avg Engaged Time"      value={fmtTime(ov.avgEngagedSec)}   color="var(--coral)" sub="excl. bounces" />
            <StatCard icon={Users}       label="Total Sessions"        value={ov.totalSessions.toLocaleString()} color="var(--gold)" />
            <StatCard icon={BarChart2}   label="Bounce Rate"           value={`${ov.bounceRate}%`}          color="var(--plum)" sub="left in < 15s" />
            <StatCard icon={TrendingDown}label="Bounced Sessions"      value={ov.bouncedSessions.toLocaleString()} color="#94a3b8" />
          </div>

          {/* Daily breakdown + distribution */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'20px' }}>
            <div style={card}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:'16px', fontWeight:900, color:'var(--ink)', marginBottom:'20px' }}>Daily Sessions</div>
              <BarChart data={byDay} labelKey="day" valueKey="sessions" color="var(--teal)" />
            </div>
            <div style={card}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:'16px', fontWeight:900, color:'var(--ink)', marginBottom:'20px' }}>Daily Avg Time</div>
              <BarChart data={byDay} labelKey="day" valueKey="avgSec" color="var(--coral)" />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:'20px' }}>
            {/* Top pages by avg time */}
            <div style={card}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:'16px', fontWeight:900, color:'var(--ink)', marginBottom:'20px' }}>Top Pages by Time Spent</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {byPage.length === 0 && <div style={{ color:'var(--muted)', fontSize:'13px' }}>No data yet.</div>}
                {byPage.map((p: any, i: number) => (
                  <div key={p.path} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 0', borderBottom:'1px solid var(--border2)' }}>
                    <div style={{ fontFamily:'var(--font-serif)', fontSize:'20px', fontWeight:900, color:'var(--parchment)', minWidth:'28px' }}>
                      {String(i+1).padStart(2,'0')}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'13px', fontWeight:600, color:'var(--ink)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.path}</div>
                      <div style={{ fontSize:'11px', color:'var(--muted)' }}>{p.visits.toLocaleString()} visits</div>
                    </div>
                    <div style={{ fontFamily:'var(--font-serif)', fontSize:'15px', fontWeight:700, color:'var(--teal)', flexShrink:0 }}>
                      {fmtTime(p.avgSec)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Duration distribution */}
            <div style={card}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:'16px', fontWeight:900, color:'var(--ink)', marginBottom:'20px' }}>Session Duration Distribution</div>
              <BucketChart data={dist} />
              {ov.totalSessions > 0 && (
                <div style={{ marginTop:'20px', padding:'14px', background:'rgba(10,95,85,.05)', borderRadius:'10px', border:'1px solid rgba(10,95,85,.12)' }}>
                  <div style={{ fontSize:'12px', color:'var(--muted)', fontFamily:'var(--font-mono)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'6px' }}>Quick Insight</div>
                  <div style={{ fontSize:'13px', color:'var(--ink)', lineHeight:1.6 }}>
                    {ov.avgDurationSec >= 120
                      ? `🟢 Users are highly engaged — average ${fmtTime(ov.avgDurationSec)} per session.`
                      : ov.avgDurationSec >= 45
                      ? `🟡 Decent engagement — average ${fmtTime(ov.avgDurationSec)}. Consider improving content hooks.`
                      : `🔴 Low engagement — average ${fmtTime(ov.avgDurationSec)}. High bounce rate (${ov.bounceRate}%). Review landing content.`
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Setup instructions */}
      <div style={{ ...card, marginTop:'20px', background:'rgba(10,95,85,.03)', border:'1px dashed rgba(10,95,85,.2)' }}>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--muted)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'8px' }}>Setup Reminder</div>
        <div style={{ fontSize:'13px', color:'var(--muted)', lineHeight:1.8 }}>
          1. Run the DB migration in <code style={{ background:'var(--border2)', padding:'2px 5px', borderRadius:4 }}>api-analytics-session-route.ts</code> comments.<br />
          2. Add <code style={{ background:'var(--border2)', padding:'2px 5px', borderRadius:4 }}>&lt;SessionTracker /&gt;</code> to <code style={{ background:'var(--border2)', padding:'2px 5px', borderRadius:4 }}>app/layout.tsx</code> (client component).<br />
          3. Data will appear here automatically — no page refreshes needed.
        </div>
      </div>
    </AdminLayout>
  )
}
