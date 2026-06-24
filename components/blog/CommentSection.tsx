'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Comment } from '@/types'
import CommentBox from './CommentBox'
import CommentList from './CommentList'

interface CommentSectionProps {
  postSlug: string
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?slug=${postSlug}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data || [])
      }
    } catch (err) {
      console.error('Error fetching comments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()

    // Setup realtime subscription
    const channel = supabase
      .channel(`realtime-comments-${postSlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_slug=eq.${postSlug}`,
        },
        () => {
          fetchComments()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [postSlug])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-xl font-bold text-saan-text">Discussion</h3>
        <p className="text-xs text-saan-muted mt-1">
          Share your feedback, ask questions, or discuss with others.
        </p>
      </div>

      <CommentBox postSlug={postSlug} onCommentSubmitted={fetchComments} />

      <div className="border-t border-saan-border/40 pt-8 mt-4">
        {loading ? (
          <p className="text-xs text-saan-muted">Loading comments...</p>
        ) : (
          <CommentList
            comments={comments}
            postSlug={postSlug}
            onCommentAdded={fetchComments}
          />
        )}
      </div>
    </div>
  )
}
