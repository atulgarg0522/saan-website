import { groq } from 'next-sanity'

export const allProjectsQuery = groq`
  *[_type == "project"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    description,
    coverImage,
    techStack,
    githubUrl,
    liveUrl,
    category,
    status,
    featured,
    publishedAt
  }
`

export const featuredProjectQuery = groq`
  *[_type == "project" && featured == true] | order(publishedAt desc)[0] {
    title,
    "slug": slug.current,
    description,
    coverImage,
    techStack,
    githubUrl,
    liveUrl,
    category,
    status,
    featured,
    publishedAt
  }
`
