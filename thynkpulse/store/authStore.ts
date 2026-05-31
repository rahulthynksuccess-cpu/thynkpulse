import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('tp_token', token)
          document.cookie = `tp_token=${token}; path=/; max-age=${7 * 24 * 3600}; samesite=strict`
        }
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('tp_token')
          localStorage.removeItem('tp-auth')
          document.cookie = 'tp_token=; path=/; max-age=0'
        }
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateUser: (partial) =>
        set(state => ({ user: state.user ? { ...state.user, ...partial } : null })),
    }),
    {
      name: 'tp-auth',
      partialize: s => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }),

      // ── CRITICAL FIX ──────────────────────────────────────────────
      // Zustand persist rehydrates by calling set() — NOT setAuth().
      // So localStorage.tp_token is never refreshed on page load.
      // This hook re-syncs it every time the app starts, ensuring
      // api.ts always finds the token via localStorage.getItem('tp_token').
      onRehydrateStorage: () => (state) => {
        if (!state?.token || typeof window === 'undefined') return
        localStorage.setItem('tp_token', state.token)
        document.cookie = `tp_token=${state.token}; path=/; max-age=${7 * 24 * 3600}; samesite=strict`
      },
    }
  )
)
