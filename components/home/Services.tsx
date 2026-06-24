'use client'

import React from 'react'
import AnimatedSection from '../ui/AnimatedSection'
import Badge from '../ui/Badge'
import { Service } from '@/types'

interface ServicesProps {
  services?: Service[]
}

const fallbackServices: Service[] = [
  {
    title: 'AI Strategy',
    description: 'Designing robust, cost-effective LLM deployment patterns, RAG pipelines, and model evaluation setups.',
    features: ['LLMs', 'RAG Pipelines', 'Model Finetuning'],
  },
  {
    title: 'Platform Engineering',
    description: 'Multi-tenant Kubernetes cluster design, GitOps CI/CD flows, and Infrastructure-as-Code setups.',
    features: ['Kubernetes', 'ArgoCD', 'Terraform'],
  },
  {
    title: 'Observability & SRE',
    description: 'Deploying full-stack monitoring, OpenTelemetry instrumentations, and proactive incident response workflows.',
    features: ['OpenTelemetry', 'Prometheus', 'Grafana'],
  },
  {
    title: 'Architecture Consulting',
    description: 'High-availability database modeling, event-driven architectures, and cloud migration blueprints.',
    features: ['PostgreSQL', 'Kafka', 'System Design'],
  },
  {
    title: 'Product Development',
    description: 'Engineering production-ready SaaS tools, developer utilities, and high-performance custom backends.',
    features: ['Next.js', 'Go', 'Rust'],
  },
  {
    title: 'Freelance & Advisory',
    description: 'Part-time CTO advisory, engineering leadership, and dedicated freelance project execution.',
    features: ['CTO Advisory', 'Mentorship', 'Delivery'],
  },
]

export default function Services({ services = [] }: ServicesProps) {
  const displayServices = services.length > 0 ? services : fallbackServices

  return (
    <section id="services" className="py-24 bg-[#0a0a0f] border-t border-saan-border relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute left-10 bottom-10 w-[450px] h-[450px] glow-purple pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="purple">Our Services</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-saan-text mt-4 tracking-tight">
            Enterprise Consulting &amp; Implementation
          </h2>
          <p className="text-saan-muted mt-4 max-w-2xl mx-auto text-base sm:text-lg">
            High-impact technical services tailored to scale your software infrastructure and AI capabilities.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, i) => {
            const num = String(i + 1).padStart(2, '0')
            return (
              <AnimatedSection key={service.title || i} delay={i * 0.08} className="h-full">
                <div className="group h-full relative flex flex-col justify-between p-8 bg-saan-surface border border-saan-border rounded-xl transition-all duration-300 hover:border-saan-purple/60 hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-3xl font-extrabold text-white/5 group-hover:text-saan-purple/20 transition-colors duration-300 font-mono">
                        {num}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-saan-text group-hover:text-saan-purple-light transition-colors duration-300 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-sm text-saan-muted leading-relaxed mb-8">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-saan-border/30">
                    {service.features?.map((feat, idx) => (
                      <Badge key={idx} variant="default" className="text-[10px] py-0.5 px-2 bg-saan-surface/40">
                        {feat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
