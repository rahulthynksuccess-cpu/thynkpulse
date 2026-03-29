'use client'
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#FDF6EC' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💥</div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1A1208', marginBottom: '12px' }}>
              Layout Error
            </h2>
            <div style={{ background: '#fff', border: '1px solid #EDE0C8', borderRadius: '12px', padding: '20px', marginBottom: '20px', textAlign: 'left' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#E8512A', marginBottom: '8px' }}>
                {error.name}: {error.message}
              </div>
              {error.stack && (
                <pre style={{ fontFamily: 'monospace', fontSize: '11px', color: '#7A6A52', overflow: 'auto', maxHeight: '200px', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {error.stack.split('\n').slice(0, 8).join('\n')}
                </pre>
              )}
            </div>
            <button onClick={reset}
              style={{ padding: '12px 28px', borderRadius: '10px', background: '#0A5F55', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
