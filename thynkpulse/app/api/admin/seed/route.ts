export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  const payload = verifyToken(token) as any
  if (!payload || payload.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })

  try {
    // Check if posts already exist
    const existing = await db.query('SELECT COUNT(*) FROM posts')
    const count = Number(existing.rows[0].count)
    if (count > 0) {
      return Response.json({ message: `Already have ${count} posts — no seed needed.`, count })
    }

    // Run seed SQL
    const seedPath = path.join(process.cwd(), 'seed-posts.sql')
    const sql = fs.readFileSync(seedPath, 'utf-8')
    
    // Split by semicolons and run each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 10 && !s.startsWith('--'))

    let ran = 0
    for (const stmt of statements) {
      await db.query(stmt).catch(e => console.error('Seed stmt error:', e.message))
      ran++
    }

    const after = await db.query('SELECT COUNT(*) FROM posts')
    return Response.json({ 
      message: `Seed complete! ${after.rows[0].count} posts now in DB.`,
      count: Number(after.rows[0].count)
    })
  } catch (err: any) {
    console.error('[seed]', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
