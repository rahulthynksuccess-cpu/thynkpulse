export type UserRole = 'educator' | 'edtech_pro' | 'other' | 'admin'
export type PostStatus = 'draft' | 'pending' | 'approved' | 'rejected'

export interface User {
  id: string
  email?: string
  phone?: string
  passwordHash?: string
  role: UserRole
  isActive: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string
  profile?: UserProfile
}

export interface UserProfile {
  id: string
  userId: string
  fullName: string
  gender?: string
  designation?: string
  instituteName?: string
  companyName?: string
  contactNumber?: string
  emailId?: string
  totalExp?: string
  introduction?: string
  avatarUrl?: string
  bio?: string
  linkedinUrl?: string
  websiteUrl?: string
  postCount: number
  followerCount: number
  followingCount: number
  totalReads: number
}

export interface Post {
  id: string
  slug: string
  title: string
  excerpt?: string
  content: string
  coverEmoji?: string
  coverGradient?: string
  category: string
  tags: string[]
  status: PostStatus
  isFeatured: boolean
  readTime: number
  viewCount: number
  likeCount: number
  commentCount: number
  authorId: string
  author?: UserProfile
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  author?: UserProfile
  parentId?: string
  content: string
  likeCount: number
  createdAt: string
  replies?: Comment[]
}

export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ThemeConfig {
  cream: string
  cream2: string
  parchment: string
  teal: string
  teal2: string
  teal3: string
  coral: string
  coral2: string
  gold: string
  gold2: string
  plum: string
  ink: string
  ink2: string
  muted: string
  fontSerif: string
  fontSans: string
  radius: number
  radiusLg: number
}
