import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
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
        Cookies.set('tp_token', token, { expires: 7, sameSite: 'strict' })
        localStorage.setItem('tp_token', token)
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        Cookies.remove('tp_token')
        localStorage.removeItem('tp_token')
        set({ user: null, token: null, isAuthenticated: false })
      },
      updateUser: (partial) =>
        set(state => ({ user: state.user ? { ...state.user, ...partial } : null })),
    }),
    { name: 'tp-auth', partialize: state => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }) }
  )
)
