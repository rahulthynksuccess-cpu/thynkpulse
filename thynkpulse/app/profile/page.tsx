'use client'
export const dynamic = 'force-dynamic'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function ProfileRedirect() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    } else {
      const id = user?.email || user?.phone || user?.id || ''
      router.replace(`/profile/${encodeURIComponent(id)}`)
    }
  }, [isAuthenticated, user, router])

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontFamily:'var(--font-sans)', fontSize:'14px', color:'var(--muted)' }}>Loading profile…</div>
    </div>
  )
}
