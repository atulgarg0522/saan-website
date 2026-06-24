import { MetadataRoute } from 'next'
import { client } from '@/sanity/sanity.client'
import { allPostsQuery } from '@/sanity/queries/posts'
import { Post } from '@/types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saantechnology.com'

  // Fetch all posts from Sanity to generate sitemap items
  let posts: Post[] = []
  try {
    posts = await client.fetch<Post[]>(allPostsQuery)
  } catch (error) {
    console.error('Sitemap generation: failed to fetch posts:', error)
  }

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  return [...staticUrls, ...postUrls]
}
