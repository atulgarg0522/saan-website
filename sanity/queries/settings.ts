import { groq } from 'next-sanity'

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    heroHeadline,
    heroSubtext,
    stats[] {
      value,
      label
    },
    contactEmail,
    linkedinUrl,
    githubUrl,
    twitterUrl,
    ogImage
  }
`

export const allServicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    title,
    description,
    order,
    features,
    icon
  }
`

export const allExpertiseQuery = groq`
  *[_type == "expertise"] | order(order asc) {
    label,
    category,
    order
  }
`
