export interface Author {
  name: string
  bio?: string
  avatar?: any
  twitterHandle?: string
  linkedinUrl?: string
}

export interface Category {
  name: string
  slug: string
  description?: string
  color?: string
}

export interface Post {
  title: string
  slug: string
  publishedAt: string
  estimatedReadingTime?: number
  excerpt?: string
  coverImage?: any
  body?: any[]
  seoTitle?: string
  seoDescription?: string
  author?: Author
  categories?: Category[]
}

export interface Project {
  title: string
  slug: string
  description: string
  coverImage?: any
  techStack?: string[]
  githubUrl?: string
  liveUrl?: string
  category: 'AI' | 'Platform' | 'Observability' | 'Tools'
  status: 'Active' | 'Archived'
  featured?: boolean
  publishedAt?: string
}

export interface Service {
  title: string
  description: string
  order?: number
  features?: string[]
  icon?: string
}

export interface Expertise {
  label: string
  category: 'platform' | 'ai' | 'observability'
  order?: number
}

export interface StatItem {
  value: string
  label: string
}

export interface SiteSettings {
  heroHeadline: string
  heroSubtext: string
  stats?: StatItem[]
  contactEmail?: string
  linkedinUrl?: string
  githubUrl?: string
  twitterUrl?: string
  ogImage?: any
}

export interface UserProfile {
  id: string
  email?: string
  name?: string
  avatar_url?: string
  provider?: string
  created_at?: string
}

export interface Comment {
  id: string
  post_slug: string
  user_id: string
  parent_id?: string | null
  body: string
  is_approved: boolean
  created_at: string
  user?: UserProfile
  replies?: Comment[]
}
