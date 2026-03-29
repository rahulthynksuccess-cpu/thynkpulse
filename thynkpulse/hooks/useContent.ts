import { useQuery } from '@tanstack/react-query'

let cache: Record<string,any> | null = null

export function useContent(key: string) {
  const { data } = useQuery({
    queryKey: ['site-content-all'],
    queryFn: async () => {
      const res = await fetch('/api/admin/content', { cache: 'no-store' })
      const all = await res.json()
      cache = all
      return all
    },
    staleTime: 0,
    gcTime: 0,
  })
  const all = data ?? cache ?? {}
  return all[key] ?? null
}
