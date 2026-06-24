'use client'

import React, { useState, useEffect } from 'react'
import { Heart, Github, Chrome } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

interface LikeButtonProps {
  postSlug: string
  initialLikesCount: number
}

export default function LikeButton({ postSlug, initialLikesCount }: LikeButtonProps) {
  const supabase = createClient()
  const [session, setSession] = useState<Session | null>(null)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    // Fetch real likes count from API
    fetch(`/api/likes?slug=${encodeURIComponent(postSlug)}`)
      .then(r => r.json())
      .then(d => { if (typeof d.count === 'number') setLikesCount(d.count) })
      .catch(() => {})

    // Get session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        checkUserLike(session.user.id)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        checkUserLike(session.user.id)
      } else {
        setLiked(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [postSlug])

  const checkUserLike = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('post_slug', postSlug)
        .eq('user_id', userId)
        .maybeSingle()

      if (data) {
        setLiked(true)
      }
    } catch (err) {
      console.error('Error checking user like:', err)
    }
  }

  const handleLike = async () => {
    if (!session) {
      setShowLoginModal(true)
      return
    }

    setLoading(true)
    // Optimistic UI updates
    const previousLiked = liked
    const previousCount = likesCount

    setLiked(!liked)
    setLikesCount(liked ? likesCount - 1 : likesCount + 1)

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_slug: postSlug }),
      })

      if (!res.ok) {
        throw new Error('Failed to toggle like')
      }

      const data = await res.json()
      setLiked(data.liked)
      setLikesCount(data.count)
    } catch (err) {
      console.error('Error toggling like:', err)
      // Rollback
      setLiked(previousLiked)
      setLikesCount(previousCount)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.href,
      },
    })
  }

  return (
    <div className="relative">
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-300 ${
          liked
            ? 'bg-rose-500/10 border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
            : 'bg-saan-surface border-saan-border text-saan-muted hover:text-saan-text hover:border-saan-purple/50'
        }`}
      >
        <Heart className={`h-4.5 w-4.5 transition-transform duration-300 ${liked ? 'fill-rose-500 scale-110' : ''}`} />
        <span>{likesCount} Likes</span>
      </button>

      {/* Login Popover */}
      {showLoginModal && (
        <div className="absolute left-0 mt-3 z-20 w-72 p-5 bg-[#0a0a0f] border border-saan-border rounded-xl shadow-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-saan-text">Sign in to Like</h4>
            <button
              onClick={() => setShowLoginModal(false)}
              className="text-xs text-saan-muted hover:text-saan-text"
            >
              Close
            </button>
          </div>
          <p className="text-xs text-saan-muted leading-relaxed">
            Support this post by logging in with GitHub or Google.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuthLogin('github')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 border border-saan-border hover:bg-white/10 rounded-md text-xs font-semibold text-saan-text transition-all"
            >
              <Github className="h-4 w-4" /> GitHub
            </button>
            <button
              onClick={() => handleOAuthLogin('google')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 border border-saan-border hover:bg-white/10 rounded-md text-xs font-semibold text-saan-text transition-all"
            >
              <Chrome className="h-4 w-4" /> Google
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
