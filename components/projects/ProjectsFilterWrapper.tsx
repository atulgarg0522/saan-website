'use client'

import React, { useState } from 'react'
import ProjectCard from './ProjectCard'
import { Project } from '@/types'
import Badge from '../ui/Badge'
import Link from 'next/link'
import Image from 'next/image'
import { Github, ArrowUpRight } from 'lucide-react'
import clsx from 'clsx'
import { urlFor } from '@/sanity/sanity.client'
import AnimatedSection from '../ui/AnimatedSection'

interface ProjectsFilterWrapperProps {
  initialProjects: Project[]
}

const categories = ['All', 'AI', 'Platform', 'Observability', 'Tools']

export default function ProjectsFilterWrapper({ initialProjects }: ProjectsFilterWrapperProps) {
  const [activeTab, setActiveTab] = useState('All')

  // Filter projects by category
  const filteredProjects = initialProjects.filter((project) => {
    if (activeTab === 'All') return true
    return project.category === activeTab
  })

  // Find featured project (only show at top when filter is 'All' or when the featured project matches the selected category)
  const featuredProject = filteredProjects.find((p) => p.featured)
  
  // The rest of the projects in the grid
  const gridProjects = featuredProject
    ? filteredProjects.filter((p) => p.slug !== featuredProject.slug)
    : filteredProjects

  return (
    <div className="flex flex-col gap-12">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-saan-border/40 pb-4 overflow-x-auto no-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={clsx(
              'px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 whitespace-nowrap',
              activeTab === cat
                ? 'border-saan-purple bg-saan-purple/10 text-saan-text shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                : 'border-saan-border bg-saan-surface text-saan-muted hover:text-saan-text hover:border-saan-purple/40'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Project (Full-width) */}
      {featuredProject && (
        <AnimatedSection>
          <div className="group bg-saan-surface border border-saan-border rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 transition-all duration-300 hover:border-saan-purple/50">
            {/* Cover Image */}
            <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto w-full min-h-[300px] bg-black/20 border-b lg:border-b-0 lg:border-r border-saan-border overflow-hidden">
              {featuredProject.coverImage ? (
                <Image
                  src={urlFor(featuredProject.coverImage).width(960).height(540).url()}
                  alt={featuredProject.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-saan-muted font-bold text-xs uppercase tracking-wider">
                  No Image
                </div>
              )}
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="purple" dot={true}>Featured System</Badge>
              </div>
              <div className="absolute top-4 right-4 z-10">
                <Badge variant={featuredProject.status === 'Active' ? 'teal' : 'default'}>
                  {featuredProject.status}
                </Badge>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-5 p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-saan-purple-light font-mono block mb-2">
                  {featuredProject.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-saan-text mb-4 leading-tight group-hover:text-saan-purple-light transition-colors">
                  {featuredProject.title}
                </h2>
                <p className="text-sm sm:text-base text-saan-muted leading-relaxed mb-6 font-medium">
                  {featuredProject.description}
                </p>
              </div>

              <div>
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {featuredProject.techStack?.map((tech) => (
                    <Badge key={tech} variant="default" className="text-[9px] py-0.5 px-2 bg-saan-surface/60 border-saan-border/40">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-6 pt-4 border-t border-saan-border/30">
                  {featuredProject.githubUrl && (
                    <Link
                      href={featuredProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-saan-muted hover:text-saan-text flex items-center gap-1 transition-colors"
                    >
                      <Github className="h-4.5 w-4.5" /> GitHub Repository
                    </Link>
                  )}
                  {featuredProject.liveUrl && (
                    <Link
                      href={featuredProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-saan-purple-light hover:text-saan-text flex items-center gap-1 transition-colors ml-auto"
                    >
                      Launch Demo <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Grid of remaining projects */}
      {gridProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridProjects.map((project, i) => (
            <AnimatedSection key={project.slug || i} delay={i * 0.05}>
              <ProjectCard project={project} />
            </AnimatedSection>
          ))}
        </div>
      ) : (
        !featuredProject && (
          <div className="py-16 text-center border border-dashed border-saan-border rounded-xl bg-saan-surface/20">
            <p className="text-saan-muted text-sm font-medium">No projects found in this category.</p>
          </div>
        )
      )}
    </div>
  )
}
