// ═══════════════════════════════════════════════════
//  THYNK PULSE — LOYALTY BADGE SYSTEM
//  lib/badges.ts
// ═══════════════════════════════════════════════════

export type BadgeCategory =
  | 'verified'
  | 'content_creator'
  | 'engagement'
  | 'appreciation'
  | 'networking'
  | 'educator'
  | 'elite'

export interface BadgeDef {
  id: string
  name: string
  emoji: string
  description: string
  category: BadgeCategory
  color: string       // accent hex
  bg: string          // background hex
  threshold: number   // value needed to earn
  metric: 'posts' | 'comments' | 'likes_received' | 'connections' | 'edu_posts' | 'verified' | 'elite'
}

// ── VERIFIED BADGE ──────────────────────────────────
export const VERIFIED_BADGE: BadgeDef = {
  id: 'verified',
  name: 'Verified',
  emoji: '✅',
  description: 'Account verified by ThynkPulse',
  category: 'verified',
  color: '#0A5F55',
  bg: '#EAF4F0',
  threshold: 1,
  metric: 'verified',
}

// ── CONTENT CREATOR BADGES ─────────────────────────
export const CONTENT_CREATOR_BADGES: BadgeDef[] = [
  { id: 'emerging_voice',     name: 'Emerging Voice',     emoji: '🌱', description: 'Published 10 posts',   category: 'content_creator', color: '#4ADE80', bg: '#F0FDF4', threshold: 10,  metric: 'posts' },
  { id: 'thought_leader',     name: 'Thought Leader',     emoji: '⭐', description: 'Published 25 posts',   category: 'content_creator', color: '#F59E0B', bg: '#FFFBEB', threshold: 25,  metric: 'posts' },
  { id: 'knowledge_champion', name: 'Knowledge Champion', emoji: '🔥', description: 'Published 50 posts',   category: 'content_creator', color: '#F97316', bg: '#FFF7ED', threshold: 50,  metric: 'posts' },
  { id: 'industry_expert',    name: 'Industry Expert',    emoji: '🏅', description: 'Published 100 posts',  category: 'content_creator', color: '#0A5F55', bg: '#EAF4F0', threshold: 100, metric: 'posts' },
  { id: 'visionary_author',   name: 'Visionary Author',   emoji: '💎', description: 'Published 250 posts',  category: 'content_creator', color: '#8B5CF6', bg: '#F5F3FF', threshold: 250, metric: 'posts' },
  { id: 'thynkpulse_icon',    name: 'ThynkPulse Icon',    emoji: '👑', description: 'Published 500 posts',  category: 'content_creator', color: '#C9922A', bg: '#FFFBEB', threshold: 500, metric: 'posts' },
]

// ── COMMENT & ENGAGEMENT BADGES ────────────────────
export const ENGAGEMENT_BADGES: BadgeDef[] = [
  { id: 'conversation_starter',   name: 'Conversation Starter',   emoji: '💬', description: '25 comments',    category: 'engagement', color: '#06B6D4', bg: '#ECFEFF', threshold: 25,   metric: 'comments' },
  { id: 'engagement_builder',     name: 'Engagement Builder',     emoji: '🤝', description: '100 comments',   category: 'engagement', color: '#3B82F6', bg: '#EFF6FF', threshold: 100,  metric: 'comments' },
  { id: 'community_connector',    name: 'Community Connector',    emoji: '🌐', description: '250 comments',   category: 'engagement', color: '#0A5F55', bg: '#EAF4F0', threshold: 250,  metric: 'comments' },
  { id: 'influential_contributor',name: 'Influential Contributor',emoji: '⚡', description: '500 comments',   category: 'engagement', color: '#F59E0B', bg: '#FFFBEB', threshold: 500,  metric: 'comments' },
  { id: 'community_pillar',       name: 'Community Pillar',       emoji: '🏛️', description: '1,000 comments', category: 'engagement', color: '#C9922A', bg: '#FEF3C7', threshold: 1000, metric: 'comments' },
]

// ── POST APPRECIATION BADGES (likes received) ──────
export const APPRECIATION_BADGES: BadgeDef[] = [
  { id: 'appreciated_voice',    name: 'Appreciated Voice',    emoji: '❤️', description: '100 likes received',   category: 'appreciation', color: '#EF4444', bg: '#FFF1F2', threshold: 100,  metric: 'likes_received' },
  { id: 'respected_contributor',name: 'Respected Contributor',emoji: '💗', description: '500 likes received',   category: 'appreciation', color: '#EC4899', bg: '#FDF2F8', threshold: 500,  metric: 'likes_received' },
  { id: 'community_favorite',   name: 'Community Favorite',   emoji: '🌟', description: '1,000 likes received', category: 'appreciation', color: '#F59E0B', bg: '#FFFBEB', threshold: 1000, metric: 'likes_received' },
  { id: 'influential_voice',    name: 'Influential Voice',    emoji: '🔮', description: '5,000 likes received', category: 'appreciation', color: '#8B5CF6', bg: '#F5F3FF', threshold: 5000, metric: 'likes_received' },
]

// ── NETWORKING BADGES ───────────────────────────────
export const NETWORKING_BADGES: BadgeDef[] = [
  { id: 'network_builder',       name: 'Network Builder',       emoji: '🔗', description: '50 connections',    category: 'networking', color: '#06B6D4', bg: '#ECFEFF', threshold: 50,   metric: 'connections' },
  { id: 'community_connector_n', name: 'Community Connector',   emoji: '🌍', description: '100 connections',   category: 'networking', color: '#3B82F6', bg: '#EFF6FF', threshold: 100,  metric: 'connections' },
  { id: 'relationship_champion', name: 'Relationship Champion', emoji: '🤝', description: '250 connections',   category: 'networking', color: '#0A5F55', bg: '#EAF4F0', threshold: 250,  metric: 'connections' },
  { id: 'collaboration_leader',  name: 'Collaboration Leader',  emoji: '🏆', description: '500 connections',   category: 'networking', color: '#C9922A', bg: '#FEF3C7', threshold: 500,  metric: 'connections' },
  { id: 'ecosystem_builder',     name: 'Ecosystem Builder',     emoji: '🌳', description: '1,000 connections', category: 'networking', color: '#16A34A', bg: '#F0FDF4', threshold: 1000, metric: 'connections' },
]

// ── EDUCATOR-SPECIFIC BADGES ────────────────────────
export const EDUCATOR_BADGES: BadgeDef[] = [
  { id: 'educator_voice',        name: 'Educator Voice',        emoji: '📢', description: 'First published education post',        category: 'educator', color: '#06B6D4', bg: '#ECFEFF', threshold: 1,   metric: 'edu_posts' },
  { id: 'learning_advocate',     name: 'Learning Advocate',     emoji: '📚', description: '10 posts on Education',                 category: 'educator', color: '#3B82F6', bg: '#EFF6FF', threshold: 10,  metric: 'edu_posts' },
  { id: 'education_influencer',  name: 'Education Influencer',  emoji: '🎯', description: '25 posts on Education',                 category: 'educator', color: '#8B5CF6', bg: '#F5F3FF', threshold: 25,  metric: 'edu_posts' },
  { id: 'future_skills_champion',name: 'Future Skills Champion',emoji: '🚀', description: '50 posts on Education',                 category: 'educator', color: '#F97316', bg: '#FFF7ED', threshold: 50,  metric: 'edu_posts' },
  { id: 'education_visionary',   name: 'Education Visionary',   emoji: '🔭', description: '100 posts on Education',                category: 'educator', color: '#C9922A', bg: '#FFFBEB', threshold: 100, metric: 'edu_posts' },
  { id: 'education_ambassador',  name: 'Education Ambassador',  emoji: '🏆', description: 'Top Contributor — Education category', category: 'educator', color: '#0A5F55', bg: '#EAF4F0', threshold: 999, metric: 'edu_posts' },
]

// ── ELITE STATUS TAGS (highest prestige) ───────────
export const ELITE_TAGS: Array<{
  id: string
  label: string
  emoji: string
  color: string
  bg: string
  borderColor: string
  minPosts: number
  minFollowers: number
}> = [
  { id: 'emerging_voice_tag',     label: 'Emerging Voice',      emoji: '🌱', color: '#16A34A', bg: '#F0FDF4', borderColor: '#86EFAC', minPosts: 10,  minFollowers: 0    },
  { id: 'thought_leader_tag',     label: 'Thought Leader',      emoji: '⭐', color: '#D97706', bg: '#FFFBEB', borderColor: '#FCD34D', minPosts: 25,  minFollowers: 50   },
  { id: 'knowledge_champion_tag', label: 'Knowledge Champion',  emoji: '🔥', color: '#EA580C', bg: '#FFF7ED', borderColor: '#FDBA74', minPosts: 50,  minFollowers: 100  },
  { id: 'visionary_author_tag',   label: 'Visionary Author',    emoji: '💎', color: '#7C3AED', bg: '#F5F3FF', borderColor: '#C4B5FD', minPosts: 250, minFollowers: 500  },
  { id: 'community_pillar_tag',   label: 'Community Pillar',    emoji: '👑', color: '#B45309', bg: '#FEF3C7', borderColor: '#FDE68A', minPosts: 0,   minFollowers: 1000 },
  { id: 'future_skills_tag',      label: 'Future Skills Champion', emoji: '🚀', color: '#0369A1', bg: '#EFF6FF', borderColor: '#93C5FD', minPosts: 50,  minFollowers: 200  },
  { id: 'ambassador_tag',         label: 'ThynkPulse Ambassador', emoji: '🏆', color: '#0A5F55', bg: '#EAF4F0', borderColor: '#6EE7B7', minPosts: 100, minFollowers: 500  },
  { id: 'legend_tag',             label: 'ThynkPulse Legend',   emoji: '👑', color: '#C9922A', bg: '#FFFBEB', borderColor: '#FCD34D', minPosts: 500, minFollowers: 1000 },
]

// ── ALL PROGRESSIVE BADGES (flat list) ─────────────
export const ALL_BADGES: BadgeDef[] = [
  VERIFIED_BADGE,
  ...CONTENT_CREATOR_BADGES,
  ...ENGAGEMENT_BADGES,
  ...APPRECIATION_BADGES,
  ...NETWORKING_BADGES,
  ...EDUCATOR_BADGES,
]

// ─────────────────────────────────────────────────────────────────────────────
//  COMPUTE EARNED BADGES
// ─────────────────────────────────────────────────────────────────────────────

export interface UserBadgeStats {
  isVerified: boolean
  postCount: number
  commentCount: number
  likesReceived: number    // sum of like_count on their posts
  followerCount: number    // used as "connections"
  eduPostCount: number     // posts in Education/Educator/EdTech categories
}

/**
 * Returns the highest-tier badge per metric (progressive system)
 * and always includes Verified if isVerified === true.
 */
export function computeEarnedBadges(stats: UserBadgeStats): BadgeDef[] {
  const earned: BadgeDef[] = []

  if (stats.isVerified) earned.push(VERIFIED_BADGE)

  // Helper: pick highest threshold badge earned for a metric
  const topBadge = (badges: BadgeDef[], value: number): BadgeDef | null => {
    const eligible = badges.filter(b => value >= b.threshold)
    return eligible.length ? eligible[eligible.length - 1] : null
  }

  const cc = topBadge(CONTENT_CREATOR_BADGES, stats.postCount)
  if (cc) earned.push(cc)

  const eng = topBadge(ENGAGEMENT_BADGES, stats.commentCount)
  if (eng) earned.push(eng)

  const app = topBadge(APPRECIATION_BADGES, stats.likesReceived)
  if (app) earned.push(app)

  const net = topBadge(NETWORKING_BADGES, stats.followerCount)
  if (net) earned.push(net)

  const edu = topBadge(EDUCATOR_BADGES, stats.eduPostCount)
  if (edu) earned.push(edu)

  return earned
}

/**
 * Returns the best matching Elite Status Tag for the user.
 */
export function computeEliteTag(stats: UserBadgeStats) {
  // Find highest-ranking tag the user qualifies for
  const eligible = ELITE_TAGS.filter(t =>
    stats.postCount >= t.minPosts && stats.followerCount >= t.minFollowers
  )
  return eligible.length ? eligible[eligible.length - 1] : null
}

/**
 * Returns the NEXT badge the user is working toward (for progress display)
 */
export function getNextBadge(metric: BadgeDef['metric'], currentValue: number): { badge: BadgeDef; progress: number } | null {
  const maps: Record<string, BadgeDef[]> = {
    posts:          CONTENT_CREATOR_BADGES,
    comments:       ENGAGEMENT_BADGES,
    likes_received: APPRECIATION_BADGES,
    connections:    NETWORKING_BADGES,
    edu_posts:      EDUCATOR_BADGES,
  }
  const list = maps[metric]
  if (!list) return null
  const next = list.find(b => currentValue < b.threshold)
  if (!next) return null
  const prev = list[list.indexOf(next) - 1]
  const from = prev ? prev.threshold : 0
  const progress = Math.min(100, Math.round(((currentValue - from) / (next.threshold - from)) * 100))
  return { badge: next, progress }
}
