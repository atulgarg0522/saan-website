import React from 'react'
import PostCard from './PostCard'
import { Post } from '@/types'

interface PostGridProps {
  posts: Post[]
  likesMap?: Record<string, number>
}

export default function PostGrid({ posts, likesMap = {} }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-saan-border rounded-xl bg-saan-surface/20">
        <p className="text-saan-muted text-sm font-medium">No insights found in this section yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, i) => (
        <PostCard
          key={post.slug || i}
          post={post}
          likesCount={likesMap[post.slug] || 0}
        />
      ))}
    </div>
  )
}
