'use client'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

interface Props {
  targetUsername: string   // email / phone / id of the person to follow
  targetName?: string
  initialFollowing?: boolean
  size?: 'sm' | 'md'
  onToggle?: (following: boolean) => void
}

export function FollowButton({ targetUsername, targetName, initialFollowing = false, size = 'sm', onToggle }: Props) {
  const { isAuthenticated, token } = useAuthStore()
  const [following, setFollowing] = useState(initialFollowing)
  const [loading,   setLoading]   = useState(false)
  const [checked,   setChecked]   = useState(false)

  // Check actual follow status on mount if authenticated
  useEffect(() => {
    if (!isAuthenticated || !targetUsername || checked) return
    setChecked(true)
    const t = token || localStorage.getItem('tp_token')
    fetch(`/api/users/${encodeURIComponent(targetUsername)}/follow`, {
      headers: t ? { Authorization: `Bearer ${t}` } : {}
    })
      .then(r => r.json())
      .then(d => setFollowing(!!d.following))
      .catch(() => {})
  }, [isAuthenticated, targetUsername, token, checked])

  async function handleClick() {
    if (!isAuthenticated) {
      toast.error('Please log in to follow writers')
      return
    }
    setLoading(true)
    const t = token || localStorage.getItem('tp_token')
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(targetUsername)}/follow`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${t}` },
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed'); return }
      setFollowing(data.following)
      onToggle?.(data.following)
      if (data.following) {
        toast.success(`Following ${targetName || 'writer'} ✓`)
      } else {
        toast(`Unfollowed ${targetName || 'writer'}`, { icon: '👋' })
      }
    } catch {
      toast.error('Network error — try again')
    } finally {
      setLoading(false)
    }
  }

  const sm = size === 'sm'

  return (
    <button onClick={handleClick} disabled={loading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: sm ? '5px 13px' : '8px 20px',
        fontSize: sm ? '12px' : '13px',
        fontWeight: 600, fontFamily: 'var(--font-sans)',
        borderRadius: '50px', border: '1.5px solid',
        cursor: loading ? 'wait' : 'pointer',
        transition: 'all .2s',
        flexShrink: 0,
        borderColor: following ? 'var(--teal)' : 'rgba(10,95,85,.25)',
        background:  following ? 'var(--teal)' : 'transparent',
        color:       following ? '#fff' : 'var(--teal)',
        opacity: loading ? .7 : 1,
      }}>
      {loading
        ? <Loader2 style={{ width: 11, height: 11, animation: 'spin 1s linear infinite' }} />
        : following ? '✓ Following' : '+ Follow'
      }
    </button>
  )
}
