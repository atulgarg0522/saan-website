'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import clsx from 'clsx'

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (pathname === '/') {
      e.preventDefault()
      const element = document.querySelector(hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setMobileMenuOpen(false)
      }
    }
  }

  const navLinks = [
    { label: 'Products', href: pathname === '/' ? '#products' : '/#products', isHash: true },
    { label: 'Blog', href: '/blog', isHash: false },
    { label: 'Projects', href: '/projects', isHash: false },
    { label: 'Services', href: pathname === '/' ? '#services' : '/#services', isHash: true },
    { label: 'Contact', href: pathname === '/' ? '#contact' : '/#contact', isHash: true },
  ]

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        scrolled
          ? 'bg-[#0a0a0f]/80 backdrop-blur-lg border-saan-border py-4'
          : 'bg-transparent border-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold flex items-center gap-0.5 tracking-tight">
          SaaN Digital<span className="text-saan-purple font-black text-2xl">.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (link.isHash) {
                  handleNavClick(e, link.href.substring(link.href.indexOf('#')))
                }
              }}
              className="text-sm font-medium text-saan-muted hover:text-saan-text transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            href={pathname === '/' ? '#contact' : '/#contact'}
            onClick={(e) => handleNavClick(e, '#contact')}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-md border border-saan-purple/40 bg-saan-purple/10 hover:bg-saan-purple text-saan-text transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.15)]"
          >
            Get in touch
          </Link>
        </div>

        {/* Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md text-saan-muted hover:text-saan-text focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0f]/95 border-b border-saan-border absolute top-full left-0 right-0 py-6 px-4 backdrop-blur-lg flex flex-col gap-4 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (link.isHash) {
                  handleNavClick(e, link.href.substring(link.href.indexOf('#')))
                } else {
                  setMobileMenuOpen(false)
                }
              }}
              className="text-base font-medium text-saan-muted hover:text-saan-text transition-colors py-2 border-b border-saan-border/40 last:border-0"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={pathname === '/' ? '#contact' : '/#contact'}
            onClick={(e) => handleNavClick(e, '#contact')}
            className="mt-2 text-center py-2.5 rounded-md border border-saan-purple bg-saan-purple text-saan-text font-semibold text-sm transition-all duration-300"
          >
            Get in touch
          </Link>
        </div>
      )}
    </nav>
  )
}
