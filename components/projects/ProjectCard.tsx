import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Github, ArrowUpRight } from 'lucide-react'
import Badge from '../ui/Badge'
import { Project } from '@/types'
import { urlFor } from '@/sanity/sanity.client'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group bg-saan-surface border border-saan-border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-saan-purple/50 hover:-translate-y-1">
      <div>
        {/* Cover Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/20 border-b border-saan-border">
          {project.coverImage ? (
            <Image
              src={urlFor(project.coverImage).width(640).height(360).url()}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-saan-muted font-bold text-xs uppercase tracking-wider">
              No Image
            </div>
          )}
          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge variant={project.status === 'Active' ? 'teal' : 'default'}>
              {project.status}
            </Badge>
          </div>
        </div>

        <div className="p-6">
          {/* Category */}
          <span className="text-[10px] uppercase font-bold tracking-widest text-saan-purple-light font-mono block mb-2">
            {project.category}
          </span>
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-saan-text mb-3 leading-snug group-hover:text-saan-purple-light transition-colors line-clamp-2">
            {project.title}
          </h3>
          {/* Description */}
          <p className="text-sm text-saan-muted leading-relaxed mb-6 line-clamp-3">
            {project.description}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0 mt-auto">
        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.techStack?.map((tech) => (
            <Badge key={tech} variant="default" className="text-[9px] py-0.5 px-2 bg-saan-surface/60 border-saan-border/40">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 pt-4 border-t border-saan-border/30">
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-saan-muted hover:text-saan-text flex items-center gap-1 transition-colors"
            >
              <Github className="h-4 w-4" /> GitHub
            </Link>
          )}
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-saan-purple-light hover:text-saan-text flex items-center gap-1 transition-colors ml-auto"
            >
              Live Demo <ArrowUpRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
