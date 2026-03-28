import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = Cookies.get('tp_token') || (typeof window !== 'undefined' ? localStorage.getItem('tp_token') : null)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      Cookies.remove('tp_token')
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tp_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export const apiGet  = (url: string, params?: Record<string, unknown>) => api.get(url, { params }).then(r => r.data)
export const apiPost = (url: string, data?: unknown) => api.post(url, data).then(r => r.data)
export const apiPut  = (url: string, data?: unknown) => api.put(url, data).then(r => r.data)
export const apiDelete = (url: string) => api.delete(url).then(r => r.data)
export const apiPatch = (url: string, data?: unknown) => api.patch(url, data).then(r => r.data)

export default api
