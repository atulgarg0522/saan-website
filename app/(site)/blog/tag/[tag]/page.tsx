import React from 'react'
import { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TagFilter from '@/components/blog/TagFilter'
import PostGrid from '@/components/blog/PostGrid'
import { client } from '@/sanity/sanity.client'
import { postsByCategoryQuery, allCategoriesQuery } from '@/sanity/queries/posts'
import { createClient } from '@/lib/supabase/server'
import { Post, Category } from '@/types'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Badge from '@/components/ui/Badge'
import { notFound } from 'next/navigation'

// ISR: revalidate cache every hour (3600 seconds)
export const revalidate = 3600

interface TagPageProps {
  params: {
    tag: string
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  try {
    const decodedTag = decodeURIComponent(params.tag)
    const categories = await client.fetch<Category[]>(allCategoriesQuery)
    const currentCategory = categories.find((c) => c.slug === decodedTag)

    if (!currentCategory) {
      return {
        title: 'Insights Tag Filter',
      }
    }

    return {
      title: `Insights: ${currentCategory.name}`,
      description: currentCategory.description || `Read SaaN Digital technical insights on ${currentCategory.name}.`,
    }
  } catch (error) {
    return {
      title: 'Insights Tag Filter',
    }
  }
}

async function getFilteredBlogData(tagSlug: string) {
  let posts: Post[] = []
  let categories: Category[] = []
  const likesMap: Record<string, number> = {}

  try {
    const [postsRes, categoriesRes] = await Promise.all([
      client.fetch<Post[]>(postsByCategoryQuery, { categorySlug: tagSlug }),
      client.fetch<Category[]>(allCategoriesQuery),
    ])
    posts = postsRes || []
    categories = categoriesRes || []
  } catch (error) {
    console.error('Error fetching blog data from Sanity:', error)
  }

  // Fetch likes separately and catch errors so it doesn't break page rendering
  try {
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('dummy')
    if (isSupabaseConfigured) {
      const supabase = createClient()
      const { data: likes, error } = await supabase.from('likes').select('post_slug')
      if (error) throw error
      likes?.forEach((like) => {
        likesMap[like.post_slug] = (likesMap[like.post_slug] || 0) + 1
      })
    }
  } catch (error) {
    console.error('Error fetching likes from Supabase (using mocks/fallback):', error)
  }

  return {
    posts,
    categories,
    likesMap,
  }
}

export default async function BlogTagListingPage({ params }: TagPageProps) {
  const decodedTag = decodeURIComponent(params.tag)
  const { posts, categories, likesMap } = await getFilteredBlogData(decodedTag)

  const currentCategory = categories.find((c) => c.slug === decodedTag)
  
  if (!currentCategory && categories.length > 0) {
    return notFound()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0f] pt-32 pb-24 grid-bg relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] glow-purple pointer-events-none rounded-full" />
        <div className="absolute top-2/3 left-0 w-[450px] h-[450px] glow-teal pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="mb-12">
            <Badge variant="teal">{currentCategory?.name || 'Category'}</Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-saan-text mt-4 tracking-tight">
              Insights: {currentCategory?.name}
            </h1>
            <p className="text-saan-muted mt-4 max-w-2xl text-base sm:text-lg leading-relaxed">
              {currentCategory?.description || `In-depth technical papers and strategic viewpoints on ${currentCategory?.name}.`}
            </p>
          </AnimatedSection>

          {/* Tag / Category Filter */}
          <AnimatedSection delay={0.1}>
            <TagFilter categories={categories} activeCategory={params.tag} />
          </AnimatedSection>

          {/* Post Grid */}
          <AnimatedSection delay={0.2}>
            <PostGrid posts={posts} likesMap={likesMap} />
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </>
  )
}
