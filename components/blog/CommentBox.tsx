'use client'

import React, { useState, useEffect } from 'react'
import { Github, Chrome, Send, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'
import Image from 'next/image'

interface CommentBoxProps {
  postSlug: string
  parentId?: string | null
  onCommentSubmitted?: () => void
  placeholder?: string
  buttonText?: string
}

export default function CommentBox({
  postSlug,
  parentId = null,
  onCommentSubmitted,
  placeholder = 'Add a comment...',
  buttonText = 'Post Comment',
}: CommentBoxProps) {
  const supabase = createClient()
  const [session, setSession] = useState<Session | null>(null)
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.href,
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_slug: postSlug,
          body,
          parent_id: parentId,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit comment')
      }

      setBody('')
      if (onCommentSubmitted) {
        onCommentSubmitted()
      }
    } catch (err: any) {
      console.error('Error posting comment:', err)
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!session) {
    return (
      <div className="p-6 bg-saan-surface border border-saan-border rounded-xl text-center">
        <MessageSquare className="h-6 w-6 text-saan-muted mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-saan-text mb-2">Join the Discussion</h4>
        <p className="text-xs text-saan-muted max-w-sm mx-auto mb-4">
          Please sign in to share your thoughts, ask questions, or reply.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => handleOAuthLogin('github')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white/5 border border-saan-border hover:bg-white/10 rounded-md text-xs font-semibold text-saan-text transition-all duration-200"
          >
            <Github className="h-4 w-4" /> Sign in with GitHub
          </button>
          <button
            onClick={() => handleOAuthLogin('google')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white/5 border border-saan-border hover:bg-white/10 rounded-md text-xs font-semibold text-saan-text transition-all duration-200"
          >
            <Chrome className="h-4 w-4" /> Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  const userMetadata = session.user.user_metadata
  const avatarUrl = userMetadata.avatar_url
  const fullName = userMetadata.full_name || session.user.email

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-4">
        {avatarUrl ? (
          <div className="relative h-10 w-10 rounded-full overflow-hidden border border-saan-border shrink-0">
            <Image src={avatarUrl} alt={fullName || 'Avatar'} fill className="object-cover" />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-full bg-saan-purple/20 flex items-center justify-center text-xs font-bold text-saan-purple-light shrink-0">
            {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
          </div>
        )}

        <div className="flex-1 flex flex-col gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={placeholder}
            rows={3}
            required
            className="w-full px-4 py-3 bg-[#0a0a0f] border border-saan-border focus:border-saan-purple/50 focus:outline-none rounded-lg text-saan-text text-sm transition-all resize-none"
          />
          {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-md bg-saan-purple hover:bg-saan-purple-light text-saan-text transition-all duration-300 disabled:opacity-50"
        >
          {submitting ? 'Posting...' : buttonText}
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </form>
  )
}
