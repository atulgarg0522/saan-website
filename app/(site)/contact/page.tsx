import React from 'react'
import { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ContactSection from '@/components/home/ContactSection'

export const metadata: Metadata = {
  title: 'Contact — Get in Touch',
  description: 'Reach out to Atul Garg for AI strategy, platform engineering, SRE consulting, or freelance advisory engagements.',
  openGraph: {
    title: 'Contact SaaN Technology',
    description: 'Reach out for AI strategy, platform engineering, SRE consulting, or freelance advisory engagements.',
    images: [{ url: '/og-image.png' }],
  },
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0f] pt-20">
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
