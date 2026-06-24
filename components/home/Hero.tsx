'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Badge from '../ui/Badge'
import GradientText from '../ui/GradientText'
import Link from 'next/link'

interface StatItem {
  value: string
  label: string
}

interface HeroProps {
  headline?: string
  subtext?: string
  stats?: StatItem[]
}

const defaultStats = [
  { value: '14+', label: 'Years Experience' },
  { value: '3+', label: 'Products' },
  { value: '50+', label: 'Enterprise Clients' },
  { value: '100%', label: 'Outcome Focused' },
]

export default function Hero({
  headline,
  subtext,
  stats,
}: HeroProps) {
  const displayHeadline = headline || 'Building intelligent infrastructure for the modern enterprise'
  const displaySubtext = subtext || 'We design, engineer, and deploy high-performance SRE, platform automation, and custom artificial intelligence layers for technical enterprises worldwide.'
  const displayStats = stats && stats.length > 0 ? stats : defaultStats

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-24 overflow-hidden bg-[#0a0a0f] grid-bg">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-purple pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] glow-teal pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={childVariants}>
            <Badge variant="purple" dot={true} dotPulse={true}>
              Enterprise AI &amp; Platform Engineering
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.div variants={childVariants}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-saan-text leading-[1.15]">
              <GradientText>{displayHeadline}</GradientText>
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.div variants={childVariants}>
            <p className="text-base sm:text-lg md:text-xl text-saan-muted max-w-2xl mx-auto font-medium leading-relaxed">
              {displaySubtext}
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={childVariants} className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto justify-center">
            <Link
              href="#products"
              onClick={(e) => handleScroll(e, '#products')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md bg-saan-purple hover:bg-saan-purple-light text-saan-text transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:scale-[1.02]"
            >
              Explore our products
            </Link>
            <Link
              href="#services"
              onClick={(e) => handleScroll(e, '#services')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md border border-saan-border bg-saan-surface hover:bg-white/10 text-saan-text transition-all duration-300 hover:scale-[1.02]"
            >
              View services
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={childVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-16 pt-12 border-t border-saan-border w-full max-w-5xl"
          >
            {displayStats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-saan-text tracking-tight mb-2 bg-gradient-to-b from-white to-saan-muted bg-clip-text text-transparent">
                  {stat.value}
                </span>
                <span className="text-xs uppercase tracking-wider text-saan-muted font-bold">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
