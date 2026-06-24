import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()

    // Get current authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const { post_slug } = await req.json()

    if (!post_slug) {
      return NextResponse.json({ error: 'Missing post slug' }, { status: 400 })
    }

    const userId = user.id

    // Check if like already exists for this post by this user
    const { data: existingLike, error: selectError } = await supabase
      .from('likes')
      .select('id')
      .eq('post_slug', post_slug)
      .eq('user_id', userId)
      .maybeSingle()

    if (selectError) {
      console.error('Error selecting like:', selectError)
      return NextResponse.json({ error: selectError.message }, { status: 500 })
    }

    let liked = false

    if (existingLike) {
      // Delete like (unlike)
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id)

      if (deleteError) {
        console.error('Error deleting like:', deleteError)
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }
      liked = false
    } else {
      // Insert like
      const { error: insertError } = await supabase
        .from('likes')
        .insert({
          post_slug,
          user_id: userId,
        })

      if (insertError) {
        console.error('Error inserting like:', insertError)
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }
      liked = true
    }

    // Get total like count for the post
    const { count, error: countError } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_slug', post_slug)

    if (countError) {
      console.error('Error getting likes count:', countError)
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    return NextResponse.json({ liked, count: count || 0 })
  } catch (err: any) {
    console.error('API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
