'use client'

import React, { useState } from 'react'
import { Twitter, Linkedin, Link2, Check } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  slug: string
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const getUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/blog/${slug}`
    }
    return `https://saantechnology.com/blog/${slug}`
  }

  const handleShareTwitter = () => {
    const url = getUrl()
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleShareLinkedin = () => {
    const url = getUrl()
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleCopyLink = () => {
    const url = getUrl()
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold uppercase tracking-wider text-saan-muted">Share:</span>
      <button
        onClick={handleShareTwitter}
        className="p-2 bg-saan-surface border border-saan-border hover:border-saan-purple/50 rounded-full text-saan-muted hover:text-saan-text transition-colors duration-200"
        aria-label="Share on Twitter/X"
      >
        <Twitter className="h-4 w-4" />
      </button>
      <button
        onClick={handleShareLinkedin}
        className="p-2 bg-saan-surface border border-saan-border hover:border-saan-purple/50 rounded-full text-saan-muted hover:text-saan-text transition-colors duration-200"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </button>
      <button
        onClick={handleCopyLink}
        className="p-2 bg-saan-surface border border-saan-border hover:border-saan-purple/50 rounded-full text-saan-muted hover:text-saan-text transition-colors duration-200"
        aria-label="Copy link"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  )
}
