import { groq } from 'next-sanity'

export const allPostsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    publishedAt,
    estimatedReadingTime,
    excerpt,
    coverImage,
    author-> {
      name,
      avatar
    },
    categories[]-> {
      name,
      "slug": slug.current,
      color
    }
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    title,
    "slug": slug.current,
    publishedAt,
    estimatedReadingTime,
    excerpt,
    coverImage,
    body,
    seoTitle,
    seoDescription,
    author-> {
      name,
      bio,
      avatar,
      twitterHandle,
      linkedinUrl
    },
    categories[]-> {
      name,
      "slug": slug.current,
      color
    }
  }
`

export const postsByCategoryQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**")) && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    publishedAt,
    estimatedReadingTime,
    excerpt,
    coverImage,
    author-> {
      name,
      avatar
    },
    categories[]-> {
      name,
      "slug": slug.current,
      color
    }
  }
`

export const relatedPostsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**")) && slug.current != $currentSlug && count(categories[@._ref in $categoryRefs]) > 0][0...3] {
    title,
    "slug": slug.current,
    publishedAt,
    estimatedReadingTime,
    excerpt,
    coverImage,
    author-> {
      name,
      avatar
    },
    categories[]-> {
      name,
      "slug": slug.current,
      color
    }
  }
`

export const allCategoriesQuery = groq`
  *[_type == "category"] {
    name,
    "slug": slug.current,
    color,
    description
  }
`
