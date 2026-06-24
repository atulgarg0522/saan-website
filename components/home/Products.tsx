'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Cpu, Activity, Terminal, Box, ArrowUpRight, Github, Globe } from 'lucide-react'
import Link from 'next/link'
import AnimatedSection from '../ui/AnimatedSection'
import Badge from '../ui/Badge'
import { Project } from '@/types'

interface ProductsProps {
  projects?: Project[]
}

const iconMap: Record<string, React.ComponentType<any>> = {
  'saan shield': Shield,
  'saan sre agent': Activity,
  'eeip': Cpu,
  'saan job engine': Terminal,
}

const fallbackProducts = [
  {
    title: 'SaaN Shield',
    description: 'Active compliance and real-time security auditing for multi-cloud Kubernetes clusters.',
    category: 'Security',
    githubUrl: 'https://github.com',
    liveUrl: 'https://saantechnology.com',
    status: 'Active',
    featured: true,
  },
  {
    title: 'SaaN SRE Agent',
    description: 'Autonomous AI engineer that monitors cluster health, correlates logs, and auto-remediates failures.',
    category: 'AI & SRE',
    githubUrl: 'https://github.com',
    liveUrl: 'https://saantechnology.com',
    status: 'Active',
    featured: true,
  },
  {
    title: 'EEIP',
    description: 'Enterprise Edge Integration Platform for connecting high-throughput IoT streams directly to AI models.',
    category: 'Platform',
    githubUrl: 'https://github.com',
    liveUrl: 'https://saantechnology.com',
    status: 'Active',
    featured: true,
  },
  {
    title: 'SaaN Job Engine',
    description: 'Ultra-low latency distributed task orchestrator built in Rust for enterprise AI pipelines.',
    category: 'Automation',
    githubUrl: 'https://github.com',
    liveUrl: 'https://saantechnology.com',
    status: 'Active',
    featured: true,
  },
]

export default function Products({ projects = [] }: ProductsProps) {
  // If no projects are passed from Sanity, use our default product list
  const displayProducts = projects.length > 0 ? projects.filter(p => p.featured) : fallbackProducts

  const getIcon = (title: string) => {
    const key = title.toLowerCase()
    return iconMap[key] || Box
  }

  return (
    <section id="products" className="py-24 bg-[#0a0a0f] border-t border-saan-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="teal">Our Products</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-saan-text mt-4 tracking-tight">
            Production-Ready AI &amp; Infrastructure Tools
          </h2>
          <p className="text-saan-muted mt-4 max-w-2xl mx-auto text-base sm:text-lg">
            Enterprise-grade products designed to streamline cloud security, operations, and data integration.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product, i) => {
            const IconComponent = getIcon(product.title)
            return (
              <AnimatedSection key={product.title || i} delay={i * 0.1} className="h-full">
                <div className="group h-full relative flex flex-col justify-between p-6 bg-saan-surface border border-saan-border rounded-xl transition-all duration-300 hover:border-saan-purple hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-saan-purple/10 rounded-lg text-saan-purple-light group-hover:bg-saan-purple group-hover:text-saan-text transition-all duration-300">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <Badge variant={i % 2 === 0 ? 'purple' : 'teal'}>
                        {product.category}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-saan-text group-hover:text-saan-purple-light transition-colors duration-300 mb-3">
                      {product.title}
                    </h3>
                    <p className="text-sm text-saan-muted leading-relaxed mb-6">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-saan-border/40">
                    {product.githubUrl && (
                      <Link
                        href={product.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-saan-muted hover:text-saan-text flex items-center gap-1 transition-colors"
                      >
                        <Github className="h-4 w-4" /> GitHub
                      </Link>
                    )}
                    {product.liveUrl && (
                      <Link
                        href={product.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-saan-purple-light hover:text-saan-text flex items-center gap-1 transition-colors ml-auto"
                      >
                        Launch App <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            )
          })}

          {/* Coming Soon Card */}
          <AnimatedSection delay={displayProducts.length * 0.1} className="h-full">
            <div className="h-full flex flex-col items-center justify-center p-8 bg-saan-surface/20 border border-dashed border-saan-border rounded-xl text-center min-h-[250px]">
              <div className="p-3 bg-saan-border/20 rounded-full text-saan-muted mb-4">
                <Box className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="text-base font-semibold text-saan-text mb-1">
                More in the pipeline
              </h3>
              <p className="text-xs text-saan-muted max-w-[200px]">
                We are actively developing new tools for LLM observability and cluster caching.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
