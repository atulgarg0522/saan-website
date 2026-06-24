import React from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import Products from '@/components/home/Products'
import Expertise from '@/components/home/Expertise'
import Services from '@/components/home/Services'
import ContactSection from '@/components/home/ContactSection'
import { client } from '@/sanity/sanity.client'
import { siteSettingsQuery, allServicesQuery, allExpertiseQuery } from '@/sanity/queries/settings'
import { allProjectsQuery } from '@/sanity/queries/projects'
import { SiteSettings, Service, Expertise as ExpertiseType, Project } from '@/types'

// Revalidate homepage every 24 hours (86400 seconds) as per performance requirements
// export const revalidate = 86400
export const revalidate = 0

async function getHomepageData() {
  try {
    const [settings, services, expertiseList, projects] = await Promise.all([
      client.fetch<SiteSettings>(siteSettingsQuery),
      client.fetch<Service[]>(allServicesQuery),
      client.fetch<ExpertiseType[]>(allExpertiseQuery),
      client.fetch<Project[]>(allProjectsQuery),
    ])

    return {
      settings: settings || undefined,
      services: services || [],
      expertiseList: expertiseList || [],
      projects: projects || [],
    }
  } catch (error) {
    console.error('Error fetching homepage data from Sanity:', error)
    return {
      settings: undefined,
      services: [],
      expertiseList: [],
      projects: [],
    }
  }
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Atul Garg',
  jobTitle: 'AI Architect & Platform Engineer',
  url: 'https://saantechnology.com',
  sameAs: [
    'https://linkedin.com/in/atulgarg',
    'https://github.com/saantechnology',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'SaaN Technology',
    url: 'https://saantechnology.com',
  },
  description: 'AI architect and platform engineer with 14+ years of experience building enterprise-grade infrastructure.',
}

export default async function Homepage() {
  const { settings, services, expertiseList, projects } = await getHomepageData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Navbar />
      <main>
        <Hero
          headline={settings?.heroHeadline}
          subtext={settings?.heroSubtext}
          stats={settings?.stats}
        />
        <Products projects={projects} />
        <Expertise expertiseList={expertiseList} />
        <Services services={services} />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
