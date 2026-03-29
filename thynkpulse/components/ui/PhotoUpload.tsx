'use client'
import { useRef, useState } from 'react'
import { Camera, Loader2, X } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { apiPost } from '@/lib/api'
import toast from 'react-hot-toast'

interface PhotoUploadProps {
  currentUrl?: string
  name?: string        // initials fallback
  size?: number        // px, default 80
  onUpload: (url: string) => void
}

export function PhotoUpload({ currentUrl, name = 'U', size = 80, onUpload }: PhotoUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentUrl || null)

  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const mutation = useMutation({
    mutationFn: ({ base64, mimeType }: { base64: string; mimeType: string }) =>
      apiPost('/upload', { base64, mimeType }),
    onSuccess: (data) => {
      setPreview(data.avatarUrl)
      onUpload(data.avatarUrl)
      toast.success('Photo updated!')
    },
    onError: () => toast.error('Upload failed. Max 5 MB, JPEG/PNG/WebP only.'),
  })

  const handleFile = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPEG, PNG or WebP allowed')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      // result = "data:image/jpeg;base64,/9j/4AA..."
      const base64 = result.split(',')[1]
      mutation.mutate({ base64, mimeType: file.type })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {/* Avatar circle */}
      <div
        onClick={() => !mutation.isPending && fileRef.current?.click()}
        style={{
          width: size, height: size, borderRadius: '50%',
          overflow: 'hidden', cursor: 'pointer',
          border: '3px solid var(--parchment)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: preview ? 'transparent' : 'linear-gradient(135deg,var(--teal),var(--teal3))',
          position: 'relative', transition: 'border-color .2s',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--teal)'}
        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--parchment)'}
      >
        {preview ? (
          <img src={preview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: size * 0.3, color: '#fff' }}>
            {initials}
          </span>
        )}

        {/* Hover overlay */}
        {!mutation.isPending && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: 0, transition: 'opacity .2s', borderRadius: '50%',
            gap: '2px',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '0'}>
            <Camera style={{ width: size * 0.22, height: size * 0.22, color: '#fff' }} />
            <span style={{ fontSize: size * 0.12, color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
              Change
            </span>
          </div>
        )}

        {/* Loading spinner */}
        {mutation.isPending && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 style={{ width: size * 0.25, height: size * 0.25, color: '#fff', animation: 'spin 1s linear infinite' }} />
          </div>
        )}
      </div>

      {/* Camera badge */}
      <div
        onClick={() => !mutation.isPending && fileRef.current?.click()}
        style={{
          position: 'absolute', bottom: 0, right: 0,
          width: size * 0.32, height: size * 0.32, borderRadius: '50%',
          background: 'var(--teal)', border: '2px solid #fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'background .2s',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--teal2)'}
        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--teal)'}
      >
        <Camera style={{ width: size * 0.16, height: size * 0.16, color: '#fff' }} />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
