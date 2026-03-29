'use client'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App Error:', error)
    console.error('Stack:', error.stack)
  }, [error])

  return (
    <div style={{ minHeight: '100vh', background: '#FDF6EC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 900, color: '#1A1208', marginBottom: '12px' }}>
          Something went wrong
        </h2>
        <div style={{ background: '#fff', border: '1px solid #EDE0C8', borderRadius: '12px', padding: '20px', marginBottom: '20px', textAlign: 'left' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#E8512A', marginBottom: '8px', fontWeight: 700 }}>
            {error.name}: {error.message}
          </div>
          {error.stack && (
            <pre style={{ fontFamily: 'monospace', fontSize: '11px', color: '#7A6A52', overflow: 'auto', maxHeight: '200px', margin: 0, whiteSpace: 'pre-wrap' }}>
              {error.stack.split('\n').slice(1, 6).join('\n')}
            </pre>
          )}
          {error.digest && (
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#7A6A52', marginTop: '8px' }}>
              Digest: {error.digest}
            </div>
          )}
        </div>
        <button onClick={reset}
          style={{ padding: '12px 28px', borderRadius: '10px', background: '#0A5F55', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'sans-serif', fontSize: '14px', fontWeight: 600 }}>
          Try again
        </button>
        <div style={{ marginTop: '12px' }}>
          <a href="/" style={{ fontSize: '13px', color: '#7A6A52', textDecoration: 'none' }}>← Go home</a>
        </div>
      </div>
    </div>
  )
}
