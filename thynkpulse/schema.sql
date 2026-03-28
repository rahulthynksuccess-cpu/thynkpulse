-- ═══════════════════════════════════════════════════════
--  THYNK PULSE — DATABASE SCHEMA
--  Run once on your PostgreSQL database
--  Compatible: PostgreSQL 14+
-- ═══════════════════════════════════════════════════════

-- ── USERS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE,
  phone         VARCHAR(20)  UNIQUE,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'other'
                  CHECK (role IN ('educator','edtech_pro','other','admin')),
  is_active     BOOLEAN NOT NULL DEFAULT true,
  is_verified   BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_contact_check CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- ── USER PROFILES ───────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name        VARCHAR(200),
  gender           VARCHAR(30),
  designation      VARCHAR(200),
  institute_name   VARCHAR(300),
  company_name     VARCHAR(300),
  contact_number   VARCHAR(20),
  email_id         VARCHAR(255),
  total_exp        VARCHAR(50),
  introduction     TEXT,
  avatar_url       TEXT,
  linkedin_url     TEXT,
  website_url      TEXT,
  post_count       INTEGER NOT NULL DEFAULT 0,
  follower_count   INTEGER NOT NULL DEFAULT 0,
  following_count  INTEGER NOT NULL DEFAULT 0,
  total_reads      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON user_profiles(user_id);

-- ── POSTS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             VARCHAR(200) NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  excerpt          TEXT,
  content          TEXT NOT NULL,
  cover_emoji      VARCHAR(10) DEFAULT '📝',
  cover_gradient   VARCHAR(200),
  category         VARCHAR(100) DEFAULT 'Other',
  tags             JSONB DEFAULT '[]',
  status           VARCHAR(20) NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft','pending','approved','rejected')),
  is_featured      BOOLEAN NOT NULL DEFAULT false,
  read_time        INTEGER NOT NULL DEFAULT 1,
  view_count       INTEGER NOT NULL DEFAULT 0,
  like_count       INTEGER NOT NULL DEFAULT 0,
  comment_count    INTEGER NOT NULL DEFAULT 0,
  rejection_reason TEXT,
  author_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_status      ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_author      ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category    ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published   ON posts(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_posts_featured    ON posts(is_featured) WHERE is_featured = true;

-- ── COMMENTS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id   UUID REFERENCES comments(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  like_count  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post   ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

-- ── LIKES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS post_likes (
  post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- ── FOLLOWS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS follows (
  follower_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

-- ── SEED: default admin account ──────────────────────
-- Password: Admin@1234  (change immediately after first login)
INSERT INTO users (email, password_hash, role, is_active, is_verified)
VALUES (
  'admin@thynkpulse.in',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.XDkK', -- Admin@1234
  'admin', true, true
) ON CONFLICT DO NOTHING;

INSERT INTO user_profiles (user_id, full_name, designation)
SELECT id, 'Admin', 'Platform Administrator'
FROM users WHERE email = 'admin@thynkpulse.in'
ON CONFLICT DO NOTHING;

-- ── SITE SETTINGS (Live Theme Controller) ────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── MIGRATION: profile completion tracking ──────────────────
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN NOT NULL DEFAULT false;

-- ── SEED: Static homepage posts ──────────────────────────────
-- First create seed authors
INSERT INTO users (id, email, password_hash, role, is_active, is_verified) VALUES
  ('00000000-0000-0000-0000-000000000001', 'rajesh.kumar@thynkpulse.in',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'edtech_pro', true, true),
  ('00000000-0000-0000-0000-000000000002', 'priya.sharma@thynkpulse.in',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'educator',   true, true),
  ('00000000-0000-0000-0000-000000000003', 'arjun.mehta@thynkpulse.in',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'edtech_pro', true, true),
  ('00000000-0000-0000-0000-000000000004', 'nalini.verma@thynkpulse.in',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'educator',   true, true),
  ('00000000-0000-0000-0000-000000000005', 'suresh.kaushik@thynkpulse.in','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'educator',   true, true),
  ('00000000-0000-0000-0000-000000000006', 'meena.rao@thynkpulse.in',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'edtech_pro', true, true),
  ('00000000-0000-0000-0000-000000000007', 'amit.singh@thynkpulse.in',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'educator',   true, true),
  ('00000000-0000-0000-0000-000000000008', 'deepa.nair@thynkpulse.in',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'edtech_pro', true, true),
  ('00000000-0000-0000-0000-000000000009', 'vikram.bose@thynkpulse.in',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'educator',   true, true),
  ('00000000-0000-0000-0000-000000000010', 'kavya.iyer@thynkpulse.in',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'edtech_pro', true, true),
  ('00000000-0000-0000-0000-000000000011', 'rohan.das@thynkpulse.in',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'educator',   true, true)
ON CONFLICT DO NOTHING;

INSERT INTO user_profiles (user_id, full_name, designation, company_name, institute_name, total_exp, post_count, follower_count, total_reads, profile_completed) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Rajesh Kumar',   'EdTech Founder',   'EduTech Ventures', '',                  '10', 24,  5200, 340000, true),
  ('00000000-0000-0000-0000-000000000002', 'Priya Sharma',   'Teacher',          '',                 'Delhi Govt School', '8',  12,  1800, 45000,  true),
  ('00000000-0000-0000-0000-000000000003', 'Arjun Mehta',    'Sales Director',   'EduTech India',    '',                  '5',  8,   2100, 78000,  true),
  ('00000000-0000-0000-0000-000000000004', 'Nalini Verma',   'Research Lead',    '',                 'IIT Delhi',         '12', 16,  3400, 120000, true),
  ('00000000-0000-0000-0000-000000000005', 'Suresh Kaushik', 'Principal',        '',                 'CBSE School',       '20', 6,   890,  56000,  true),
  ('00000000-0000-0000-0000-000000000006', 'Meena Rao',      'Founder',          'EduSpark',         '',                  '6',  19,  4100, 210000, true),
  ('00000000-0000-0000-0000-000000000007', 'Amit Singh',     'Teacher',          '',                 'Kendriya Vidyalaya','12', 11,  1200, 32000,  true),
  ('00000000-0000-0000-0000-000000000008', 'Deepa Nair',     'Product Manager',  'SkillBridge',      '',                  '7',  9,   1600, 48000,  true),
  ('00000000-0000-0000-0000-000000000009', 'Vikram Bose',    'School Leader',    '',                 'DPS Group',         '18', 5,   670,  28000,  true),
  ('00000000-0000-0000-0000-000000000010', 'Kavya Iyer',     'EdTech Investor',  'EduFund',          '',                  '9',  14,  2800, 95000,  true),
  ('00000000-0000-0000-0000-000000000011', 'Rohan Das',      'Curriculum Head',  '',                 'Amity School',      '11', 7,   1100, 38000,  true)
ON CONFLICT DO NOTHING;

-- Seed posts (6 main + 5 trending)
INSERT INTO posts (id, slug, title, excerpt, content, cover_emoji, category, tags, status, is_featured, read_time, view_count, like_count, comment_count, author_id, published_at) VALUES
  ('10000000-0000-0000-0000-000000000001',
   'ai-classroom-engagement',
   'How AI is Quietly Rewriting the Rules of Classroom Engagement',
   'From adaptive learning paths to AI-powered feedback loops — what''s actually working in schools across India.',
   'Artificial intelligence is no longer a distant concept for Indian classrooms. Over the past two years, a quiet revolution has been underway in schools across Tier-1 and Tier-2 cities. Teachers are using AI tools for personalised feedback, schools are deploying adaptive learning platforms, and EdTech companies are integrating generative AI into their core product offerings.

In this article, I want to share what I''ve observed after visiting over 200 schools and speaking with teachers, principals, and students about their experience with AI-powered tools.

## What''s Actually Working

Adaptive assessments have been the biggest win. Tools that adjust question difficulty based on student performance have shown measurable improvements in learning outcomes in pilot programs across Delhi NCR, Pune, and Hyderabad.

AI-powered feedback on writing assignments has saved teachers hours each week. Several teachers reported that they now use AI to give first-round feedback on essays, freeing them to focus on higher-order thinking discussions.

## What Still Needs Work

Implementation without teacher training is a recipe for failure. We''ve seen this repeatedly — a school purchases a sophisticated AI platform, does a 2-hour orientation, and then wonders why adoption is low six months later.

Data privacy remains a significant concern. Parents in urban centres are increasingly asking schools about how student data is being used by EdTech platforms.

## The Road Ahead

The schools that are seeing the best results are those that treat AI as a teaching assistant, not a replacement. The technology is most powerful when teachers are in the driving seat — using AI insights to inform their pedagogy rather than outsourcing decisions to algorithms.',
   '🤖', 'EdTech', '["AI","EdTech","Classroom"]', 'approved', true,  8, 12000, 284, 47,
   '00000000-0000-0000-0000-000000000001', NOW()),

  ('10000000-0000-0000-0000-000000000002',
   'experiential-learning',
   'Experiential Learning: Why It Works and How to Scale It',
   'A government school teacher on transforming assessment through real-world projects.',
   'Eight years ago, I walked into a government school in East Delhi with a bag full of textbooks and a head full of theory. What I discovered over the next few years completely transformed how I think about education.

The students in my class weren''t disengaged because they were lazy or uninterested. They were disengaged because the curriculum had nothing to do with their lives.

## My First Experiment

I replaced a unit test on "environmental science" with a project where students had to map the waste disposal practices in their neighbourhood and present solutions to the local municipal councillor. The change in energy was immediate and dramatic.

## Why Experiential Learning Works

When students learn through doing, several things happen simultaneously. They develop metacognitive skills — they learn how to learn. They encounter failure in low-stakes environments and build resilience. They connect abstract concepts to concrete reality.

Research consistently shows that experiential learning leads to better retention and deeper understanding than passive instruction.

## Scaling the Model

The honest challenge is that experiential learning requires more preparation time, more materials, and more flexible classroom management. In a system where teachers are already stretched thin, this is a real barrier.

What I''ve found works is starting small — replace one unit per term with a project-based approach. Build a bank of projects that can be reused and refined. Connect with other teachers who are doing the same.',
   '🌱', 'Educator', '["Teaching","ExperientialLearning"]', 'approved', false, 5, 4200, 102, 18,
   '00000000-0000-0000-0000-000000000002', NOW()),

  ('10000000-0000-0000-0000-000000000003',
   'selling-to-schools',
   'Selling to Schools: What Works (And What Doesn''t)',
   'Honest lessons from 5 years and 300+ school conversations.',
   'I''ve spent five years selling EdTech products to schools across India. I''ve had over 300 conversations with principals, purchase committees, and management trusts. Here''s what I''ve learned — including the stuff nobody puts in sales training.

## The Decision-Making Reality

In most Indian private schools, the principal recommends but the management or trust decides. If you''re only talking to the principal, you''re halfway there at best. Understand who controls the budget before you invest heavily in a relationship.

Government school procurement works completely differently — it''s driven by tender processes, government schemes, and officials at the block and district level. The sales cycle is 6-18 months and requires a completely different approach.

## What Actually Closes Deals

Proof over promises, every time. A 15-minute live demonstration with actual students present is worth more than 10 polished presentations. Schools want to see that it works with their children, in their context.

Teacher buy-in before management approval. The fastest deal I ever closed was one where a teacher had already been using a free trial, loved it, and went to the principal to ask for a school subscription. Bottom-up selling in schools is underrated.

## What Kills Deals

Overpromising outcomes. If you say "this will improve board results by 20%", you''d better be able to prove it. Schools have long memories and reputations matter more than in most other sectors.

Ignoring the IT infrastructure reality. Many schools still have unreliable internet, shared devices, and teachers who are not digitally confident. A product that assumes high connectivity will fail in most of India.',
   '📈', 'Sales & Marketing', '["Sales","EdTech","Schools"]', 'approved', false, 6, 9800, 218, 31,
   '00000000-0000-0000-0000-000000000003', NOW()),

  ('10000000-0000-0000-0000-000000000004',
   'stem-gender-gap',
   'The STEM Gender Gap: Can EdTech Fix What Classrooms Haven''t?',
   'Research findings from 200+ schools across Tier-1 and Tier-2 Indian cities.',
   'The data is stark. Despite decades of policy interventions, women remain significantly underrepresented in STEM fields in India. Our research team spent two years studying 200+ schools across six cities to understand why — and whether EdTech can play a meaningful role in closing this gap.

## What the Research Shows

The gender gap in STEM interest doesn''t appear at birth. It emerges gradually, typically accelerating around Class 6-7, and is driven by a complex interplay of teacher expectations, peer dynamics, family attitudes, and media representation.

Critically, we found that the gap is not about ability. On objective assessments of mathematical reasoning and scientific thinking, girls consistently performed on par with or better than boys in the early grades.

## Where EdTech Helps

Personalised learning platforms that remove the social pressure of classroom performance allow girls to engage with challenging STEM content at their own pace without fear of public failure.

Representation matters enormously. Platforms that feature diverse role models — especially women scientists and engineers from Indian backgrounds — show measurable impact on girls'' self-efficacy in STEM.

## Where EdTech Falls Short

Technology cannot fix teacher bias. If a teacher unconsciously calls on boys more often in science class, or frames mathematics as a "boys subject", no EdTech platform will overcome that influence.

Family attitudes remain the most powerful predictor of girls'' STEM engagement. Until families believe that a daughter pursuing engineering or physics is as valuable as a son doing the same, the gap will persist.',
   '🔬', 'Research', '["STEM","Gender","Research"]', 'approved', false, 9, 7200, 167, 22,
   '00000000-0000-0000-0000-000000000004', NOW()),

  ('10000000-0000-0000-0000-000000000005',
   'school-20-years',
   'What I Learned Running a School for 20 Years',
   'Lessons from two decades of building an institution from the ground up.',
   'In 2004, I took over a struggling CBSE school in a small town in Uttar Pradesh with 180 students, 12 teachers, and a building that needed significant repair. Twenty years later, we have 2,400 students, 140 teachers, and a waiting list for admissions.

This is not a success story in the conventional sense. It is a collection of lessons — many of them learned through costly mistakes.

## On Hiring

The single most important decision you make as a school leader is who you hire as teachers. Not their qualifications, not their experience — their character and their genuine love for children. Skills can be taught. Character cannot.

I made the mistake early on of hiring based on subject knowledge alone. Some of the most academically qualified teachers I hired were among the least effective in the classroom.

## On Parents

Parents are not your adversaries. They are your most important partners. The schools that treat parents as clients to be managed rather than partners to be engaged consistently underperform.

We instituted monthly "Parent Learning Circles" where parents sit in on classes, not to evaluate teachers, but to understand how their children are being taught. This single initiative transformed our school-parent relationship.

## On Technology

I have seen many technology initiatives in schools fail not because the technology was bad, but because the implementation was poor. Technology is a tool, not a solution. The question is never "should we use this technology?" The question is "what problem are we trying to solve, and is this technology the best way to solve it?"',
   '🏫', 'Leadership', '["Leadership","SchoolManagement"]', 'approved', false, 11, 15000, 311, 58,
   '00000000-0000-0000-0000-000000000005', NOW()),

  ('10000000-0000-0000-0000-000000000006',
   'teacher-to-founder',
   'From Teacher to EdTech Founder: My Unfiltered Journey',
   'Three years of failures, pivots, and small wins — the story I wish someone had told me.',
   'Three years ago, I quit my job as a secondary school teacher to start an EdTech company. What followed was the most challenging, humbling, and ultimately rewarding experience of my professional life.

I''m writing this not to inspire you, but to give you an honest picture of what this journey actually looks like — because the polished success stories on LinkedIn don''t capture the reality.

## Year One: The Illusion of Progress

We built a beautiful product. We raised a small seed round from friends and family. We got featured in two education publications. And we had almost no paying customers.

The product was built for teachers the way we imagined them, not the way they actually were. We had assumed that teachers were hungry for digital tools and would adopt new technology enthusiastically. What we found was that teachers were exhausted, overworked, and deeply skeptical of yet another platform that promised to transform their classroom.

## Year Two: Learning to Listen

The pivot happened when I stopped presenting and started listening. I spent three months just visiting schools, sitting in staff rooms, having chai with teachers, and asking questions.

What I learned completely upended our product roadmap. Teachers didn''t want more features. They wanted fewer, better ones. They wanted something that worked reliably on slow internet. They wanted a product that made their existing work easier, not one that asked them to do new kinds of work.

## Year Three: Finding Our People

We rebuilt the product from scratch based on what we''d learned. We launched to a small cohort of 12 schools who had been part of our research phase. The feedback was transformative. These 12 schools became our most powerful advocates.',
   '💼', 'Career', '["Career","EdTech","Startup"]', 'approved', false, 7, 11000, 244, 39,
   '00000000-0000-0000-0000-000000000006', NOW()),

  -- 5 trending posts
  ('10000000-0000-0000-0000-000000000007',
   'gpt-classroom-review',
   'GPT in the Classroom: A Teacher''s 6-Month Honest Review',
   'I used GPT tools every day for six months in my Class 10 English classroom. Here is what I found.',
   'Six months ago, I made a decision to integrate GPT-based tools into my daily teaching practice for Class 10 English. This is my honest, unfiltered review of that experience.

I want to be clear upfront: I am not a tech evangelist. I was skeptical. I remain cautiously optimistic rather than unreservedly enthusiastic. But I think the honest picture is more useful than either cheerleading or dismissal.

## What I Used GPT For

Generating first drafts of discussion questions for literature texts. Creating differentiated reading comprehension passages at different difficulty levels. Giving initial feedback on student essays before my own review. Generating creative writing prompts tailored to student interests.

## What Genuinely Worked

The differentiated materials were a game-changer for me. Creating three versions of the same passage — accessible, standard, and challenging — used to take me a full afternoon. With GPT, I can do it in 20 minutes, with my own editing and review.

## What Didn''t Work

AI-generated feedback on student essays, while sometimes useful, often missed the specific student context that makes feedback meaningful. The best feedback I give my students is rooted in knowing them — their history, their struggles, their goals. AI cannot replicate that.

## My Overall Assessment

GPT is a capable assistant that can handle certain preparatory and administrative tasks well. It is not a teacher, cannot replace the human relationship at the heart of good education, and requires significant teacher judgment to use well.',
   '🤖', 'EdTech', '["AI","GPT","Teaching"]', 'approved', false, 7, 34200, 891, 203,
   '00000000-0000-0000-0000-000000000007', NOW()),

  ('10000000-0000-0000-0000-000000000008',
   'turned-down-edtech-deal',
   'Why I Turned Down a ₹50L EdTech Deal (And What I Learned)',
   'Last year I walked away from a significant commercial deal. This is why — and what it taught me about values in business.',
   'Last year, a well-funded EdTech company offered our school a ₹50 lakh partnership deal. We would feature their platform as the exclusive digital learning solution for our students. The money would have funded our new science laboratory.

I turned it down. Here is why.

## The Product Wasn''t Good Enough

After a six-week pilot with two batches of students, our academic team''s assessment was clear: the platform was engaging but not effective. Students liked using it. Their learning outcomes did not improve. In some areas, students who used the platform performed slightly worse on assessments than those who used traditional methods.

## The Pressure to Ignore the Evidence

What troubled me was what happened next. When I communicated our findings to the company, the response was not to engage with the data. It was to question our methodology, to suggest that we hadn''t implemented the platform correctly, and ultimately to offer us an enhanced financial arrangement if we would proceed with the partnership.

## What I Learned

The EdTech market in India has a significant misalignment problem. Companies are incentivised to close deals and show school partnerships in their pitch decks. Schools are sometimes incentivised by financial arrangements to overlook product quality.

The only people not at the table when these decisions are made are the students and parents who will actually experience the product.',
   '💰', 'Leadership', '["Leadership","Ethics","EdTech"]', 'approved', false, 6, 28700, 645, 144,
   '00000000-0000-0000-0000-000000000008', NOW()),

  ('10000000-0000-0000-0000-000000000009',
   'education-sales-playbook',
   'The Education Sales Playbook Nobody Talks About',
   'After 400 sales conversations in education, here are the patterns nobody publishes.',
   'I have had over 400 sales conversations in the education sector over the past seven years. I have sold to government schools, private schools, coaching centres, and higher education institutions. I have won deals I shouldn''t have and lost deals I should have won.

This is the playbook I wish I had when I started — the stuff that doesn''t appear in sales training courses.

## Understand the Academic Calendar First

Everything in school sales revolves around the academic calendar. April-May is when budgets are allocated and decisions for the next year are made. August-September is when new academic year initiatives are being reviewed. December-January is when schools are mid-year and resistant to disruption.

If you''re trying to close a new school deal in November, you''re swimming upstream. Use that time for relationship building and leave the ask for March-April.

## The Champion Problem

Most sales training tells you to find a champion inside the organisation. In schools, your champion is usually a teacher or a tech coordinator who loves your product but has no purchasing authority. 

The real decision makers are the principal (for smaller purchases) and the management or trust (for significant investments). Your champion can get you the meeting but cannot close the deal. Build the relationship with the champion, then work to get access to the decision maker.

## What Budget Holders Actually Care About

Board results and parent satisfaction. That is it. If you can show — with real evidence, not projected outcomes — that your product will move the needle on either of those two things, you will get a serious hearing.',
   '📊', 'Sales & Marketing', '["Sales","Strategy","Education"]', 'approved', false, 8, 22100, 512, 88,
   '00000000-0000-0000-0000-000000000009', NOW()),

  ('10000000-0000-0000-0000-000000000010',
   'quit-private-school',
   'I Quit a Private School to Teach in a Government School. Here''s Why.',
   'After 8 years in a well-paying private school, I made a choice that confused everyone who knew me.',
   'Eight years ago, I was teaching English at one of Delhi''s premium private schools. Good salary, supportive administration, motivated students, excellent resources. By any conventional measure, I had made it.

I quit to teach in a government school in the same city. Here is why — and what I found.

## What Made Me Leave

Discomfort is the honest answer. I was teaching students who already had every advantage — tutors, stable homes, nutritious food, parents who attended every parent-teacher meeting. My impact, while real, was at the margins.

Meanwhile, a few kilometres away, children with equal intelligence and greater potential were receiving a fraction of the educational investment. I found myself unable to reconcile the disparity.

## What I Found

The government school I joined was not the broken, hopeless institution that middle-class Delhi imagines it to be. The teachers were dedicated professionals working under genuinely difficult conditions — overcrowded classrooms, inadequate materials, administrative burdens that private school teachers never face.

What was missing was not commitment. What was missing was support, resources, and the belief — from the system and sometimes from the teachers themselves — that these children could achieve at the highest levels.

## What Changed

In my first year, I ran the same literature curriculum I had taught at the private school, with modifications for context. The students surprised me constantly. Their reading comprehension, their critical thinking, their creative responses to literature were frequently indistinguishable from what I had seen in my previous school.',
   '🏫', 'Educator', '["Teaching","GovtSchool","Inspiration"]', 'approved', false, 9, 19800, 1200, 317,
   '00000000-0000-0000-0000-000000000010', NOW()),

  ('10000000-0000-0000-0000-000000000011',
   'edtech-investors-2025',
   'What EdTech Investors Actually Look for in 2025',
   'I have reviewed 200+ EdTech pitch decks this year. Here is what separates fundable from forgettable.',
   'This year, I reviewed over 200 EdTech pitch decks as part of my work at an early-stage education fund. I passed on the vast majority. I invested in three companies. Here is what I actually look for — and what I am tired of seeing.

## What I Am Tired of Seeing

The TAM slide that cites "the Indian K-12 education market is worth $180 billion." Everyone uses this number. It tells me nothing about your specific opportunity.

The "we are the Netflix of education" positioning. This comparison has been made so many times it has become meaningless. What does it actually mean for learning outcomes?

Engagement metrics dressed up as learning metrics. Time spent on platform is not learning. Video completion rates are not learning. Show me evidence of knowledge or skill acquisition.

## What I Actually Want to See

Evidence of learning. This does not need to be a randomised controlled trial at the seed stage. But I need to see some credible signal that students who use your product learn more or better.

A clear and honest account of your customer acquisition model in India''s education market. EdTech customer acquisition is genuinely hard in India. Schools are fragmented and relationship-driven. Parents are price-sensitive and skeptical. I want to see that you understand this reality.

Teacher-centred product design. The EdTech companies that have scaled in India have almost universally done so by making teachers'' lives easier or better, not by trying to replace them.

Unit economics that make sense. Not at scale — now. I want to see a path to contribution margin positive at the individual customer level before we talk about growth.',
   '💡', 'EdTech', '["Investment","EdTech","Startup"]', 'approved', false, 8, 17300, 428, 71,
   '00000000-0000-0000-0000-000000000011', NOW())
ON CONFLICT DO NOTHING;

-- ── MIGRATION: last login tracking ──────────────────────────
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- ── USER ACTIVITY LOGS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action     VARCHAR(50)  NOT NULL,  -- login, logout, register, post_created, post_approved, profile_updated, comment, password_changed
  detail     TEXT,                   -- extra info e.g. post title, page visited
  ip_address VARCHAR(45),            -- IPv4 or IPv6
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_user    ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON user_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_action  ON user_activity_logs(action);

-- Add ip_address to users table for latest IP tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_ip VARCHAR(45);

-- ── PASSWORD RESET TOKENS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reset_token ON password_reset_tokens(token);

-- ── USER FOLLOWS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_follows (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);
CREATE INDEX IF NOT EXISTS idx_follows_follower  ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON user_follows(following_id);
