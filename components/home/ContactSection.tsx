'use client'

import React, { useState } from 'react'
import AnimatedSection from '../ui/AnimatedSection'
import Badge from '../ui/Badge'
import { Mail, Linkedin, Github, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    service: 'AI Strategy',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setStatus('success')
        setForm({
          name: '',
          email: '',
          service: 'AI Strategy',
          message: '',
        })
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-[#0a0a0f] border-t border-saan-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <Badge variant="amber">Get In Touch</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-saan-text mt-4 tracking-tight">
            Let&apos;s Build Something Intelligent
          </h2>
          <p className="text-saan-muted mt-4 max-w-2xl mx-auto text-base sm:text-lg">
            Have a project in mind or need advisory services? Drop a message, and let&apos;s connect.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-saan-surface border border-saan-border p-8 rounded-xl relative">
            <h3 className="text-xl font-bold text-saan-text mb-6">Send a Message</h3>
            
            {status === 'success' && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Message sent successfully!</p>
                  <p className="text-emerald-400/80 mt-1">Thank you. Atul will get back to you shortly.</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Failed to send message.</p>
                  <p className="text-rose-400/80 mt-1">Please try again or email directly at nehagarg@saandigital.com.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-saan-muted">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-saan-border focus:border-saan-purple/50 focus:outline-none rounded-md text-saan-text text-sm transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-saan-muted">
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-saan-border focus:border-saan-purple/50 focus:outline-none rounded-md text-saan-text text-sm transition-all"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="service" className="text-xs font-bold uppercase tracking-wider text-saan-muted">
                  Requested Service
                </label>
                <div className="relative">
                  <select
                    id="service"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0a0a0f] border border-saan-border focus:border-saan-purple/50 focus:outline-none rounded-md text-saan-text text-sm transition-all cursor-pointer appearance-none"
                  >
                    <option value="AI Strategy">AI Strategy</option>
                    <option value="Platform Engineering">Platform Engineering</option>
                    <option value="Observability & SRE">Observability &amp; SRE</option>
                    <option value="Architecture Consulting">Architecture Consulting</option>
                    <option value="Product Development">Product Development</option>
                    <option value="Freelance & Advisory">Freelance &amp; Advisory</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-saan-muted">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-saan-muted">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-[#0a0a0f] border border-saan-border focus:border-saan-purple/50 focus:outline-none rounded-md text-saan-text text-sm transition-all resize-none"
                  placeholder="Tell us about your project requirements, timeline, and stack..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-md bg-saan-purple hover:bg-saan-purple-light text-saan-text transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.2)] disabled:opacity-50 disabled:hover:bg-saan-purple disabled:cursor-not-allowed mt-2"
              >
                {loading ? 'Sending...' : 'Send Message'}
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Info Column */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-xl font-bold text-saan-text">Contact Information</h3>
                <p className="text-saan-muted mt-2 text-sm leading-relaxed">
                  We consult globally. Reach out directly or check out our active workspaces.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4 text-saan-muted">
                  <div className="p-2.5 bg-saan-surface border border-saan-border rounded-lg text-saan-purple-light">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-saan-muted font-mono">Email</p>
                    <a href="mailto:nehagarg@saandigital.com" className="text-sm font-semibold text-saan-text hover:text-saan-purple-light transition-colors">
                      nehagarg@saandigital.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-saan-muted">
                  <div className="p-2.5 bg-saan-surface border border-saan-border rounded-lg text-saan-teal-light">
                    <Linkedin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-saan-muted font-mono">LinkedIn</p>
                    <Link
                      href="https://www.linkedin.com/in/atulgarg52/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-saan-text hover:text-saan-teal-light transition-colors"
                    >
                      linkedin.com/in/atulgarg52
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-saan-muted">
                  <div className="p-2.5 bg-saan-surface border border-saan-border rounded-lg text-saan-amber">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-saan-muted font-mono">GitHub</p>
                    <Link
                      href="https://github.com/saandigital"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-saan-text hover:text-saan-amber transition-colors"
                    >
                      github.com/saandigital
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-saan-muted">
                  <div className="p-2.5 bg-saan-surface border border-saan-border rounded-lg text-saan-purple-light">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-saan-muted font-mono">Location</p>
                    <p className="text-sm font-semibold text-saan-text">Bangalore, India &middot; Hybrid/Remote</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 lg:mt-0 p-5 bg-saan-surface/30 border border-saan-border rounded-xl flex items-start gap-4">
              <Clock className="h-5 w-5 text-saan-amber shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-saan-text">Response Time</p>
                <p className="text-xs text-saan-muted mt-1 leading-relaxed">
                  We usually respond within 12–24 hours on business days. If urgent, feel free to highlight in the subject header.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
