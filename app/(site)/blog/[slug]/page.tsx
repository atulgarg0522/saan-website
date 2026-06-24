import React from 'react'
import { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { client, urlFor } from '@/sanity/sanity.client'
import { postBySlugQuery, relatedPostsQuery, allPostsQuery } from '@/sanity/queries/posts'
import { Post } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ShareButtons from '@/components/blog/ShareButtons'
import LikeButton from '@/components/blog/LikeButton'
import CommentSection from '@/components/blog/CommentSection'
import { PortableText } from '@portabletext/react'
import { highlight } from 'sugar-high'
import { notFound } from 'next/navigation'
import { Clock, Calendar, ChevronRight, User } from 'lucide-react'

// ISR: revalidate cache every hour (3600 seconds)
export const revalidate = 3600

interface PostPageProps {
  params: {
    slug: string
  }
}

// Generate static paths for pre-rendering
export async function generateStaticParams() {
  try {
    const posts = await client.fetch<Post[]>(allPostsQuery)
    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Dynamic SEO metadata
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  try {
    const decodedSlug = decodeURIComponent(params.slug)
    const post = await client.fetch<Post>(postBySlugQuery, { slug: decodedSlug })

    if (!post) {
      return {
        title: 'Post Not Found',
      }
    }

    const title = post.seoTitle || post.title
    const description = post.seoDescription || post.excerpt || ''
    const ogImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://saantechnology.com'}/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(description)}`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: post.publishedAt,
        images: [{ url: ogImageUrl }],
      },
    }
  } catch (error) {
    return {
      title: 'Blog Post',
    }
  }
}

function extractHeadings(body: any[]) {
  if (!body) return []

  const headings: { text: string; id: string; level: 'h2' | 'h3' }[] = []

  body.forEach((block: any) => {
    if (block._type === 'block' && ['h2', 'h3'].includes(block.style)) {
      const text = block.children?.map((c: any) => c.text).join('') || ''
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      headings.push({
        text,
        id,
        level: block.style,
      })
    }
  })

  return headings
}

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      return (
        <div className="relative aspect-[16/9] w-full my-8 overflow-hidden rounded-xl border border-saan-border bg-black/20">
          <Image
            src={urlFor(value).width(1200).height(675).url()}
            alt={value.alt || 'Post Image'}
            fill
            className="object-cover"
          />
        </div>
      )
    },
    code: ({ value }: any) => {
      const highlightedCode = highlight(value.code)
      return (
        <div className="my-6">
          {value.filename && (
            <div className="px-4 py-1.5 bg-black/60 border-t border-x border-saan-border rounded-t-lg text-[11px] font-mono text-saan-muted">
              {value.filename}
            </div>
          )}
          <pre className={`p-4 bg-black/40 border border-saan-border overflow-x-auto text-xs font-mono leading-relaxed ${value.filename ? 'rounded-b-lg' : 'rounded-lg'}`}>
            <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          </pre>
        </div>
      )
    }
  },
  block: {
    h2: ({ value, children }: any) => {
      const text = value.children?.map((c: any) => c.text).join('') || ''
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      return <h2 id={id} className="scroll-mt-24 text-2xl font-bold text-saan-text mt-12 mb-4 tracking-tight leading-tight">{children}</h2>
    },
    h3: ({ value, children }: any) => {
      const text = value.children?.map((c: any) => c.text).join('') || ''
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      return <h3 id={id} className="scroll-mt-24 text-xl font-bold text-saan-text mt-8 mb-3 tracking-tight">{children}</h3>
    },
    normal: ({ children }: any) => <p className="text-saan-muted text-sm sm:text-base leading-relaxed mb-6 font-medium">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-saan-purple pl-4 italic text-saan-muted my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 text-saan-muted space-y-2 mb-6 text-sm sm:text-base">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 text-saan-muted space-y-2 mb-6 text-sm sm:text-base">{children}</ol>,
  },
}

async function getPostData(slug: string) {
  let post: Post | null = null
  let relatedPosts: Post[] = []

  try {
    post = await client.fetch<Post>(postBySlugQuery, { slug })
    if (!post) return null

    const categoryRefs = post.categories?.map((c: any) => c._id) || []
    relatedPosts = await client.fetch<Post[]>(relatedPostsQuery, { currentSlug: slug, categoryRefs })
  } catch (error) {
    console.error('Error fetching post detail data from Sanity:', error)
    return null
  }

  return {
    post,
    relatedPosts: relatedPosts || [],
  }
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const decodedSlug = decodeURIComponent(params.slug)
  const data = await getPostData(decodedSlug)

  if (!data) {
    return notFound()
  }

  const { post, relatedPosts } = data
  const headings = extractHeadings(post.body || [])

  const publishedDate = post.publishedAt ? new Date(post.publishedAt) : new Date()
  const formattedDate = publishedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saantechnology.com'
  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.seoDescription || '',
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Atul Garg',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SaaN Technology',
      url: siteUrl,
    },
    url: `${siteUrl}/blog/${post.slug}`,
    ...(post.coverImage && {
      image: urlFor(post.coverImage).width(1200).height(630).url(),
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0f] pt-32 pb-24 grid-bg relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-purple pointer-events-none rounded-full" />
        <div className="absolute top-3/4 right-0 w-[400px] h-[400px] glow-teal pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 text-xs font-semibold text-saan-muted mb-8">
            <Link href="/" className="hover:text-saan-text transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="hover:text-saan-text transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-saan-text line-clamp-1">{post.title}</span>
          </div>

          <article className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Post Column */}
            <div className="lg:col-span-8">
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories?.map((cat) => (
                  <Badge
                    key={cat.slug}
                    variant="default"
                    className="font-mono text-[10px]"
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

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-saan-text leading-[1.15] mb-6 tracking-tight">
                {post.title}
              </h1>

              {/* Meta Header */}
              <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-saan-border/40 mb-8 text-xs text-saan-muted font-medium">
                {/* Author */}
                <div className="flex items-center gap-2">
                  {post.author?.avatar ? (
                    <div className="relative h-7 w-7 rounded-full overflow-hidden border border-saan-border">
                      <Image
                        src={urlFor(post.author.avatar).width(56).height(56).url()}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-saan-purple/10 flex items-center justify-center text-xs font-bold text-saan-purple-light uppercase">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <span className="font-semibold text-saan-text">{post.author?.name}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formattedDate}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{post.estimatedReadingTime ? `${post.estimatedReadingTime} min read` : '3 min read'}</span>
                </div>
              </div>

              {/* Full Width Cover Image */}
              {post.coverImage && (
                <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden border border-saan-border mb-12 bg-black/20">
                  <Image
                    src={urlFor(post.coverImage).width(1200).height(514).url()}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Body */}
              <div className="prose prose-invert max-w-none prose-sm sm:prose-base">
                <PortableText value={post.body || []} components={portableTextComponents} />
              </div>

              {/* Footer Likes & Share */}
              <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-saan-border/40 my-12">
                <LikeButton postSlug={post.slug} initialLikesCount={0} />
                <ShareButtons title={post.title} slug={post.slug} />
              </div>

              {/* Comments Section */}
              <div className="mt-16">
                <CommentSection postSlug={post.slug} />
              </div>
            </div>

            {/* Sticky Sidebar (ToC & Author Bio) */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-28 flex flex-col gap-8 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pr-2">
                {/* Table of Contents */}
                {headings.length > 0 && (
                  <div className="p-6 bg-saan-surface border border-saan-border rounded-xl">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-saan-text mb-4">
                      Table of Contents
                    </h3>
                    <ul className="flex flex-col gap-3 text-sm">
                      {headings.map((heading, idx) => (
                        <li
                          key={idx}
                          className={`${
                            heading.level === 'h3' ? 'pl-4 text-xs' : 'font-semibold'
                          }`}
                        >
                          <a
                            href={`#${heading.id}`}
                            className="text-saan-muted hover:text-saan-purple-light transition-colors block py-0.5"
                          >
                            {heading.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Author Bio Card */}
                {post.author && (
                  <div className="p-6 bg-saan-surface border border-saan-border rounded-xl">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-saan-text mb-4">
                      About the Author
                    </h3>
                    <div className="flex items-center gap-3 mb-4">
                      {post.author.avatar ? (
                        <div className="relative h-10 w-10 rounded-full overflow-hidden border border-saan-border">
                          <Image
                            src={urlFor(post.author.avatar).width(80).height(80).url()}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-saan-purple/10 flex items-center justify-center text-sm font-bold text-saan-purple-light uppercase">
                          {post.author.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-saan-text">{post.author.name}</h4>
                        {post.author.twitterHandle && (
                          <span className="text-[10px] text-saan-muted">
                            @{post.author.twitterHandle}
                          </span>
                        )}
                      </div>
                    </div>
                    {post.author.bio && (
                      <p className="text-xs text-saan-muted leading-relaxed font-medium">
                        {post.author.bio}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-24 pt-16 border-t border-saan-border/40">
              <h3 className="text-2xl font-bold text-saan-text mb-8 tracking-tight">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost, i) => (
                  <article
                    key={relatedPost.slug || i}
                    className="group bg-saan-surface border border-saan-border rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:border-saan-purple/40 hover:-translate-y-1"
                  >
                    <Link href={`/blog/${relatedPost.slug}`} className="relative block aspect-[16/9] w-full overflow-hidden bg-black/20">
                      {relatedPost.coverImage ? (
                        <Image
                          src={urlFor(relatedPost.coverImage).width(480).height(270).url()}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-saan-muted font-bold text-xs uppercase tracking-wider">
                          No Image
                        </div>
                      )}
                    </Link>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <h4 className="text-sm font-bold text-saan-text group-hover:text-saan-purple-light transition-colors line-clamp-2 mb-3 leading-snug">
                        <Link href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-saan-muted mt-auto pt-3 border-t border-saan-border/20">
                        <span>{new Date(relatedPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>{relatedPost.estimatedReadingTime ? `${relatedPost.estimatedReadingTime}m read` : '3m read'}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
