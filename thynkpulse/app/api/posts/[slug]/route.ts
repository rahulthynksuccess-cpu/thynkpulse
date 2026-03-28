import { NextRequest } from 'next/server'
import db from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const res = await db.query(
      `SELECT p.*, up.full_name, up.designation, up.company_name, up.institute_name,
              up.introduction, up.avatar_url, up.post_count, up.follower_count, up.total_reads
       FROM posts p
       LEFT JOIN user_profiles up ON up.user_id = p.author_id
       WHERE p.slug = $1 AND p.status = 'approved'`,
      [params.slug]
    )
    if (res.rows.length === 0)
      return Response.json({ error: 'Post not found' }, { status: 404 })

    const r = res.rows[0]

    // Increment view count async (fire and forget)
    db.query('UPDATE posts SET view_count = view_count + 1 WHERE id = $1', [r.id]).catch(() => {})

    return Response.json({
      id: r.id, slug: r.slug, title: r.title, excerpt: r.excerpt,
      content: r.content, coverEmoji: r.cover_emoji, category: r.category,
      tags: r.tags || [], status: r.status, isFeatured: r.is_featured,
      readTime: r.read_time, viewCount: r.view_count, likeCount: r.like_count,
      commentCount: r.comment_count, authorId: r.author_id,
      publishedAt: r.published_at, createdAt: r.created_at,
      author: {
        userId: r.author_id, fullName: r.full_name, designation: r.designation,
        companyName: r.company_name, instituteName: r.institute_name,
        introduction: r.introduction, avatarUrl: r.avatar_url,
        postCount: r.post_count, followerCount: r.follower_count, totalReads: r.total_reads,
      },
    })
  } catch (err) {
    console.error('[GET /posts/slug]', err)
    return Response.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}
