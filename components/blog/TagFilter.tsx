'use client'

import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { Category } from '@/types'

interface TagFilterProps {
  categories: Category[]
  activeCategory?: string
  basePath?: string
}

export default function TagFilter({
  categories,
  activeCategory = 'all',
  basePath = '/blog',
}: TagFilterProps) {
  return (
    <div className="w-full border-b border-saan-border/40 pb-4 mb-8 overflow-x-auto no-scrollbar scroll-smooth">
      <div className="flex items-center gap-3 min-w-max px-1">
        <Link
          href={basePath}
          className={clsx(
            'px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300',
            activeCategory === 'all'
              ? 'border-saan-purple bg-saan-purple/10 text-saan-text shadow-[0_0_15px_rgba(124,58,237,0.15)]'
              : 'border-saan-border bg-saan-surface hover:border-saan-purple/40 text-saan-muted hover:text-saan-text'
          )}
        >
          All Insights
        </Link>

        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`${basePath}/tag/${cat.slug}`}
            className={clsx(
              'px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300',
              activeCategory === cat.slug
                ? 'text-saan-text shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                : 'border-saan-border bg-saan-surface text-saan-muted hover:text-saan-text'
            )}
            style={
              activeCategory === cat.slug
                ? {
                    borderColor: cat.color || '#7c3aed',
                    backgroundColor: cat.color ? `${cat.color}15` : 'rgba(124,58,237,0.1)',
                  }
                : undefined
            }
            onMouseEnter={(e) => {
              if (activeCategory !== cat.slug && cat.color) {
                e.currentTarget.style.borderColor = cat.color
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== cat.slug) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              }
            }}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
