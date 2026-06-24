import React from 'react'
import Link from 'next/link'
import { Github, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-saan-border bg-[#0a0a0f] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-saan-muted">
          &copy; 2025 SaaN Digital &middot; Bangalore, India
        </p>

        <div className="flex items-center gap-6">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-saan-muted hover:text-saan-text transition-colors duration-200"
            aria-label="GitHub"
          >
            <Github className="h-4.5 w-4.5" />
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-saan-muted hover:text-saan-text transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4.5 w-4.5" />
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-saan-muted hover:text-saan-text transition-colors duration-200"
            aria-label="Twitter/X"
          >
            <Twitter className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
