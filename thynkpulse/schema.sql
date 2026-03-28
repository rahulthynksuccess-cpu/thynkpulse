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
