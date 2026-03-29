import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { config } from './config'

export const hashPassword = (password: string) => bcrypt.hash(password, 12)
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash)

export const signToken = (payload: Record<string, unknown>) =>
  jwt.sign(payload, config.auth.secret, { expiresIn: config.auth.expiresIn } as jwt.SignOptions)

export const verifyToken = (token: string) => {
  try { return jwt.verify(token, config.auth.secret) as Record<string, unknown> }
  catch { return null }
}

export const getTokenFromHeader = (authHeader?: string) => {
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}

export const requireAuth = (handler: Function) => async (req: Request) => {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return Response.json({ error: 'Invalid token' }, { status: 401 })
  return handler(req, payload)
}

export const requireAdmin = (handler: Function) => async (req: Request) => {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })
  return handler(req, payload)
}
