'use client'
import { useEffect, useState } from 'react'

// Single shared cache - persists across re-renders
const DATA_CACHE: Record<string, any> = {}
let fetchPromise: Promise<void> | null = null
let fetched = false

async function fetchAll() {
  if (fetched) return
  if (fetchPromise) return fetchPromise
  fetchPromise = fetch('/api/admin/content', { cache: 'no-store' })
    .then(r => r.json())
    .then(all => {
      Object.assign(DATA_CACHE, all)
      fetched = true
    })
    .catch(() => { fetched = true })
  return fetchPromise
}

export function useContent(key: string) {
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    if (!fetched) {
      fetchAll().then(() => forceUpdate(n => n + 1))
    }
  }, [])

  return DATA_CACHE[key] ?? null
}
