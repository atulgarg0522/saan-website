import React from 'react'
import { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProjectsFilterWrapper from '@/components/projects/ProjectsFilterWrapper'
import { client } from '@/sanity/sanity.client'
import { allProjectsQuery } from '@/sanity/queries/projects'
import { Project } from '@/types'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Badge from '@/components/ui/Badge'

// ISR: revalidate cache every hour (3600 seconds)
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Engineering Projects & Systems Portfolio',
  description: 'Explore the portfolio of active and archived systems, AI automation tooling, and platform engineering architectures designed by SaaN Digital.',
}

async function getProjectsData() {
  try {
    const projects = await client.fetch<Project[]>(allProjectsQuery)
    return projects || []
  } catch (error) {
    console.error('Error fetching projects data:', error)
    return []
  }
}

export default async function ProjectsPage() {
  const projects = await getProjectsData()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0f] pt-32 pb-24 grid-bg relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] glow-purple pointer-events-none rounded-full" />
        <div className="absolute top-3/4 right-0 w-[450px] h-[450px] glow-teal pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="mb-12">
            <Badge variant="purple">Portfolio</Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-saan-text mt-4 tracking-tight">
              Systems Engineering &amp; AI Portfolio
            </h1>
            <p className="text-saan-muted mt-4 max-w-2xl text-base sm:text-lg leading-relaxed">
              An overview of our custom tools, open-source projects, and platform deployments built for enterprise scale and performance.
            </p>
          </AnimatedSection>

          {/* Filter Wrapper */}
          <ProjectsFilterWrapper initialProjects={projects} />
        </div>
      </main>
      <Footer />
    </>
  )
}
