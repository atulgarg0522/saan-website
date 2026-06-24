'use client'

import React from 'react'
import AnimatedSection from '../ui/AnimatedSection'
import Badge from '../ui/Badge'
import { Expertise as ExpertiseType } from '@/types'

interface ExpertiseProps {
  expertiseList?: ExpertiseType[]
}

const fallbackExpertise: ExpertiseType[] = [
  { label: 'Kubernetes', category: 'platform' },
  { label: 'Terraform', category: 'platform' },
  { label: 'AWS / GCP', category: 'platform' },
  { label: 'Docker / Containers', category: 'platform' },
  { label: 'Go / Golang', category: 'platform' },
  { label: 'Rust', category: 'platform' },
  { label: 'Python', category: 'ai' },
  { label: 'PyTorch / TensorFlow', category: 'ai' },
  { label: 'LLM Ops & Pipelines', category: 'ai' },
  { label: 'RAG Systems', category: 'ai' },
  { label: 'LangChain & Agents', category: 'ai' },
  { label: 'Vector Databases', category: 'ai' },
  { label: 'Prometheus & Grafana', category: 'observability' },
  { label: 'OpenTelemetry', category: 'observability' },
  { label: 'Distributed Tracing', category: 'observability' },
  { label: 'ELK / Observability', category: 'observability' },
]

export default function Expertise({ expertiseList = [] }: ExpertiseProps) {
  const list = expertiseList.length > 0 ? expertiseList : fallbackExpertise

  const getVariant = (category: string) => {
    switch (category) {
      case 'platform':
        return 'purple'
      case 'ai':
        return 'teal'
      case 'observability':
        return 'amber'
      default:
        return 'default'
    }
  }

  return (
    <section id="expertise" className="py-24 bg-[#0a0a0f] border-t border-saan-border relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[350px] glow-teal pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <AnimatedSection>
              <Badge variant="purple">Core Capabilities</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-saan-text mt-4 tracking-tight">
                Architectural Expertise &amp; Technical Stack
              </h2>
              <p className="text-saan-muted mt-4 text-base sm:text-lg leading-relaxed">
                With over 14 years of engineering experience, our principal consultant Atul Garg specializes in designing systems at the intersection of AI modeling and modern platform automation.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2 text-xs font-semibold text-saan-muted">
                  <span className="h-2 w-2 rounded-full bg-saan-purple" /> Platform &amp; Infra
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-saan-muted">
                  <span className="h-2 w-2 rounded-full bg-saan-teal" /> AI &amp; Data
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-saan-muted">
                  <span className="h-2 w-2 rounded-full bg-saan-amber" /> Observability &amp; SRE
                </div>
              </div>
            </AnimatedSection>
          </div>

          <div className="lg:col-span-7">
            <AnimatedSection delay={0.2}>
              <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
                {list.map((item, i) => (
                  <Badge
                    key={item.label || i}
                    variant={getVariant(item.category)}
                    dot={true}
                    className="py-2.5 px-4 text-sm font-medium hover:scale-105 transform transition-transform cursor-default"
                  >
                    {item.label}
                  </Badge>
                ))}
              </div>
            </AnimatedSection>
          </div>

        </div>
      </div>
    </section>
  )
}
