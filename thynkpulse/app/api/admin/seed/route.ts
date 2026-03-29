export const dynamic = "force-dynamic"
import { NextRequest } from 'next/server'
import db from '@/lib/db'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

// Hardcoded seed data — no file reading, no semicolon splitting issues
export async function POST(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get('authorization') || '')
  if (!token) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  const payload = verifyToken(token) as any
  if (!payload || payload.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const existing = await db.query('SELECT COUNT(*) FROM posts')
    if (Number(existing.rows[0].count) > 0)
      return Response.json({ message: `Already have ${existing.rows[0].count} posts.`, count: Number(existing.rows[0].count) })

    // Step 1: Seed users
    await db.query(`
      INSERT INTO users (id, email, password_hash, role, is_active, is_verified) VALUES
        ('00000000-0000-0000-0000-000000000001','rajesh.kumar@thynkpulse.in','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','edtech_pro',true,true),
        ('00000000-0000-0000-0000-000000000002','priya.sharma@thynkpulse.in','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','educator',true,true),
        ('00000000-0000-0000-0000-000000000003','arjun.mehta@thynkpulse.in','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','edtech_pro',true,true),
        ('00000000-0000-0000-0000-000000000004','nalini.verma@thynkpulse.in','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','educator',true,true),
        ('00000000-0000-0000-0000-000000000005','suresh.kaushik@thynkpulse.in','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','educator',true,true)
      ON CONFLICT DO NOTHING
    `)

    // Step 2: Seed profiles
    await db.query(`
      INSERT INTO user_profiles (user_id, full_name, designation, company_name, institute_name, total_exp, post_count, follower_count, total_reads, profile_completed) VALUES
        ('00000000-0000-0000-0000-000000000001','Rajesh Kumar','EdTech Founder','EduTech Ventures','','10',24,5200,340000,true),
        ('00000000-0000-0000-0000-000000000002','Priya Sharma','Senior Teacher','','Delhi Govt School','8',12,1800,45000,true),
        ('00000000-0000-0000-0000-000000000003','Arjun Mehta','Sales Director','EduTech India','','5',8,2100,78000,true),
        ('00000000-0000-0000-0000-000000000004','Nalini Verma','Principal','','St. Marys School','15',6,890,23000,true),
        ('00000000-0000-0000-0000-000000000005','Suresh Kaushik','Science Teacher','','Kendriya Vidyalaya','12',9,1100,31000,true)
      ON CONFLICT DO NOTHING
    `)

    // Step 3: Seed posts one by one
    const posts = [
      { id:'10000000-0000-0000-0000-000000000001', slug:'how-ai-is-rewriting-classroom-engagement', title:'How AI is Quietly Rewriting Classroom Engagement Across India', excerpt:'From adaptive learning paths to AI-powered feedback loops — what is actually working in Indian schools today.', category:'EdTech', emoji:'🤖', author:'00000000-0000-0000-0000-000000000001', featured:true, views:12400, likes:284 },
      { id:'10000000-0000-0000-0000-000000000002', slug:'teacher-burnout-real-solutions', title:'Teacher Burnout is Real — Here Are Solutions That Actually Work', excerpt:'After 8 years in classrooms, I have seen colleagues leave the profession. Here is what schools can do differently.', category:'Educator', emoji:'🧠', author:'00000000-0000-0000-0000-000000000002', featured:false, views:8200, likes:193 },
      { id:'10000000-0000-0000-0000-000000000003', slug:'selling-edtech-to-principals', title:'The Art of Selling EdTech to School Principals in Tier 2 Cities', excerpt:'Three years of field sales taught me that demos mean nothing without trust. Here is how I changed my approach.', category:'EdTech', emoji:'💼', author:'00000000-0000-0000-0000-000000000003', featured:false, views:6100, likes:147 },
      { id:'10000000-0000-0000-0000-000000000004', slug:'nep-2020-one-year-later', title:'NEP 2020 — One Year Later, What Has Actually Changed?', excerpt:'A ground-level assessment from a principal who implemented the new framework across 1,200 students.', category:'Leadership', emoji:'📜', author:'00000000-0000-0000-0000-000000000004', featured:false, views:9800, likes:231 },
      { id:'10000000-0000-0000-0000-000000000005', slug:'stem-labs-on-shoestring-budget', title:'Building a STEM Lab on a Shoestring Budget — Our School Did It', excerpt:'We set up a functional robotics lab for under ₹80,000. Here is the exact breakdown and what we learned.', category:'Innovation', emoji:'🔬', author:'00000000-0000-0000-0000-000000000005', featured:false, views:7300, likes:168 },
      { id:'10000000-0000-0000-0000-000000000006', slug:'edtech-market-saturation-2024', title:'Is the Indian EdTech Market Already Saturated?', excerpt:'With 4,000+ EdTech startups, standing out requires more than a good product. Here is the real picture.', category:'EdTech', emoji:'📊', author:'00000000-0000-0000-0000-000000000001', featured:false, views:11200, likes:267 },
      { id:'10000000-0000-0000-0000-000000000007', slug:'project-based-learning-implementation', title:'Project-Based Learning: From Theory to My Classroom in 90 Days', excerpt:'I resisted PBL for years. Then I tried it with Class 9 and the results changed my mind completely.', category:'Educator', emoji:'🎯', author:'00000000-0000-0000-0000-000000000002', featured:false, views:5400, likes:124 },
      { id:'10000000-0000-0000-0000-000000000008', slug:'school-leadership-decisions-data', title:'How Data Changed the Way I Make School Decisions', excerpt:'Gut instinct was my guide for 10 years. Here is how I learned to lead with data without losing humanity.', category:'Leadership', emoji:'📈', author:'00000000-0000-0000-0000-000000000004', featured:false, views:6800, likes:156 },
      { id:'10000000-0000-0000-0000-000000000009', slug:'cold-email-edtech-sales', title:'Why Cold Emails Fail in EdTech Sales (And What Works Instead)', excerpt:'I sent 2,000 cold emails in one year. Here is the data on what worked, what bombed, and the alternative I found.', category:'EdTech', emoji:'📧', author:'00000000-0000-0000-0000-000000000003', featured:false, views:7900, likes:189 },
      { id:'10000000-0000-0000-0000-000000000010', slug:'inquiry-based-science-teaching', title:'Inquiry-Based Science: How I Stopped Lecturing and Started Listening', excerpt:'Switching from lecture-based to inquiry-based teaching was terrifying. It was also the best decision of my career.', category:'Educator', emoji:'🔭', author:'00000000-0000-0000-0000-000000000005', featured:false, views:4900, likes:112 },
      { id:'10000000-0000-0000-0000-000000000011', slug:'parental-engagement-digital-age', title:'Parental Engagement in the Digital Age — What Schools Get Wrong', excerpt:'WhatsApp groups are not a communication strategy. Here is what genuine parental engagement actually looks like.', category:'Leadership', emoji:'👨‍👩‍👧', author:'00000000-0000-0000-0000-000000000004', featured:false, views:8600, likes:204 },
    ]

    for (const p of posts) {
      await db.query(`
        INSERT INTO posts (id, slug, title, excerpt, content, cover_emoji, category, tags, status, is_featured, read_time, view_count, like_count, comment_count, author_id, published_at)
        VALUES ($1,$2,$3,$4,$3,'${ p.emoji}',$5,'["education","india"]','approved',$6,
                GREATEST(1, ROUND(LENGTH($3)/500)::int),$7,$8,0,$9,NOW() - INTERVAL '${Math.floor(Math.random()*60)+1} days')
        ON CONFLICT DO NOTHING
      `, [p.id, p.slug, p.title, p.excerpt, p.category, p.featured, p.views, p.likes, p.author])
    }

    const after = await db.query('SELECT COUNT(*) FROM posts')
    return Response.json({ message: `✅ Seeded ${after.rows[0].count} posts successfully!`, count: Number(after.rows[0].count) })
  } catch (err: any) {
    console.error('[seed]', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
