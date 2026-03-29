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
          // Write cookie so server-side and api.ts can read it
          document.cookie = `tp_token=${token}; path=/; max-age=${7*24*3600}; samesite=strict`
        }
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('tp_token')
          document.cookie = 'tp_token=; path=/; max-age=0'
        }
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateUser: (partial) =>
        set(state => ({ user: state.user ? { ...state.user, ...partial } : null })),
    }),
    {
      name: 'tp-auth',
      partialize: state => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)
