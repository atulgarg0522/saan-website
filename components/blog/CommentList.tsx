'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { CornerDownRight, MessageSquare, Reply } from 'lucide-react'
import { Comment } from '@/types'
import CommentBox from './CommentBox'

interface CommentListProps {
  comments: Comment[]
  postSlug: string
  onCommentAdded: () => void
  currentUserSession?: any
}

export default function CommentList({
  comments,
  postSlug,
  onCommentAdded,
  currentUserSession,
}: CommentListProps) {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)

  // Format date helper
  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Filter top-level comments
  const rootComments = comments.filter((c) => !c.parent_id)

  // Get replies for a comment
  const getReplies = (commentId: string) => {
    return comments.filter((c) => c.parent_id === commentId)
  }

  if (rootComments.length === 0) {
    return (
      <div className="py-8 text-center text-saan-muted text-sm border border-saan-border/40 bg-saan-surface/10 rounded-xl">
        <MessageSquare className="h-5 w-5 mx-auto mb-2 text-saan-border" />
        No comments yet. Be the first to share your thoughts!
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {rootComments.map((comment) => {
        const replies = getReplies(comment.id)
        const isReplying = activeReplyId === comment.id

        return (
          <div key={comment.id} className="border-b border-saan-border/20 pb-6 last:border-0 last:pb-0">
            {/* Top level comment */}
            <div className="flex gap-4">
              {/* User Avatar */}
              {comment.user?.avatar_url ? (
                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-saan-border shrink-0">
                  <Image
                    src={comment.user.avatar_url}
                    alt={comment.user.name || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-saan-purple/20 flex items-center justify-center text-xs font-bold text-saan-purple-light shrink-0">
                  {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}

              {/* Comment Content */}
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-saan-text">
                    {comment.user?.name || 'Anonymous User'}
                  </span>
                  <span className="text-[10px] text-saan-muted">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                
                <p className="text-sm text-saan-muted leading-relaxed whitespace-pre-wrap">
                  {comment.body}
                </p>

                {/* Reply Toggle */}
                <div className="mt-2">
                  <button
                    onClick={() => setActiveReplyId(isReplying ? null : comment.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-saan-purple-light hover:text-saan-text transition-colors"
                  >
                    <Reply className="h-3 w-3" /> Reply
                  </button>
                </div>
              </div>
            </div>

            {/* Nested Replies */}
            {replies.length > 0 && (
              <div className="mt-4 ml-8 flex flex-col gap-4 pl-4 border-l border-saan-border/30">
                {replies.map((reply) => (
                  <div key={reply.id} className="flex gap-4">
                    {reply.user?.avatar_url ? (
                      <div className="relative h-8 w-8 rounded-full overflow-hidden border border-saan-border shrink-0">
                        <Image
                          src={reply.user.avatar_url}
                          alt={reply.user.name || 'User'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-saan-teal/20 flex items-center justify-center text-xs font-bold text-saan-teal-light shrink-0">
                        {reply.user?.name ? reply.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-saan-text">
                          {reply.user?.name || 'Anonymous User'}
                        </span>
                        <span className="text-[9px] text-saan-muted">
                          {formatDate(reply.created_at)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-saan-muted leading-relaxed whitespace-pre-wrap">
                        {reply.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Inline Reply Box */}
            {isReplying && (
              <div className="mt-4 ml-8 p-4 bg-[#0a0a0f] border border-saan-border rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-saan-muted flex items-center gap-1.5">
                    <CornerDownRight className="h-3.5 w-3.5" />
                    Replying to {comment.user?.name}
                  </span>
                  <button
                    onClick={() => setActiveReplyId(null)}
                    className="text-[10px] text-saan-muted hover:text-saan-text"
                  >
                    Cancel
                  </button>
                </div>
                <CommentBox
                  postSlug={postSlug}
                  parentId={comment.id}
                  buttonText="Post Reply"
                  placeholder="Type your reply here..."
                  onCommentSubmitted={() => {
                    setActiveReplyId(null)
                    onCommentAdded()
                  }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
