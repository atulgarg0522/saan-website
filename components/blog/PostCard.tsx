import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, Heart } from 'lucide-react'
import Badge from '../ui/Badge'
import { Post } from '@/types'
import { urlFor } from '@/sanity/sanity.client'

interface PostCardProps {
  post: Post
  likesCount?: number
}

export default function PostCard({ post, likesCount = 0 }: PostCardProps) {
  const publishedDate = post.publishedAt ? new Date(post.publishedAt) : new Date()
  const formattedDate = publishedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <article className="group flex flex-col bg-saan-surface border border-saan-border rounded-xl overflow-hidden transition-all duration-300 hover:border-saan-purple/50 hover:-translate-y-1">
      {/* Cover Image */}
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] w-full overflow-hidden bg-black/20">
        {post.coverImage ? (
          <Image
            src={urlFor(post.coverImage).width(640).height(360).url()}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-saan-muted font-bold text-xs uppercase tracking-wider">
            No Image
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-6">
        {/* Date & Categories */}
        <div className="flex items-center justify-between mb-3 text-xs text-saan-muted">
          <span>{formattedDate}</span>
          <div className="flex flex-wrap gap-2">
            {post.categories?.slice(0, 1).map((cat) => (
              <Badge
                key={cat.slug}
                variant="default"
                className="text-[9px] py-0.5 px-2 font-mono"
                style={{
                  borderColor: cat.color ? `${cat.color}30` : undefined,
                  color: cat.color || undefined,
                  backgroundColor: cat.color ? `${cat.color}08` : undefined,
                }}
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-saan-text mb-3 leading-snug group-hover:text-saan-purple-light transition-colors duration-200 line-clamp-2">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-saan-muted mb-6 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-saan-border/40 text-xs text-saan-muted">
          {/* Author */}
          <div className="flex items-center gap-2">
            {post.author?.avatar ? (
              <div className="relative h-6 w-6 rounded-full overflow-hidden border border-saan-border">
                <Image
                  src={urlFor(post.author.avatar).width(48).height(48).url()}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full bg-saan-purple/10 flex items-center justify-center text-[10px] font-bold text-saan-purple-light uppercase">
                {post.author?.name ? post.author.name.charAt(0) : 'S'}
              </div>
            )}
            <span className="font-semibold text-saan-text">{post.author?.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.estimatedReadingTime ? `${post.estimatedReadingTime}m` : '3m'}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 text-rose-500/80 fill-rose-500/10" />
              {likesCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
