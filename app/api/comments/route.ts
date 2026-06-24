import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend } from '@/lib/resend'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Missing post slug' }, { status: 400 })
  }

  const supabase = createClient()

  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      post_slug,
      user_id,
      parent_id,
      body,
      is_approved,
      created_at,
      user:users (
        id,
        name,
        avatar_url
      )
    `)
    .eq('post_slug', slug)
    .eq('is_approved', true)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const { post_slug, body, parent_id } = await req.json()

    if (!post_slug || !body) {
      return NextResponse.json({ error: 'Missing post slug or comment body' }, { status: 400 })
    }

    if (body.length > 2000) {
      return NextResponse.json({ error: 'Comment body too long (max 2000 characters)' }, { status: 400 })
    }

    const userId = user.id

    // Insert comment
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_slug,
        user_id: userId,
        body,
        parent_id: parent_id || null,
        is_approved: true, // auto approve
      })
      .select(`
        id,
        body,
        created_at,
        user:users (
          name,
          email
        )
      `)
      .single()

    if (error) {
      console.error('Error inserting comment:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send Resend notification to site owner
    try {
      const userObj = Array.isArray(data.user) ? data.user[0] : (data.user as any)
      const commenterName = userObj?.name || user.email || 'A user'
      const isReply = !!parent_id

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'hello@saantechnology.com',
        to: process.env.CONTACT_TO_EMAIL || 'atul@saantechnology.com',
        subject: `New Blog Comment on SaaN Technology`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #0f172a; margin-top: 0;">New ${isReply ? 'Reply' : 'Comment'} Received</h3>
            <p style="color: #475569; font-size: 14px;"><strong>Post Slug:</strong> ${post_slug}</p>
            <p style="color: #475569; font-size: 14px;"><strong>Author:</strong> ${commenterName}</p>
            <p style="color: #475569; font-size: 14px;"><strong>Content:</strong></p>
            <blockquote style="border-left: 3px solid #7c3aed; padding-left: 15px; margin: 15px 0; color: #334155; font-style: italic; font-size: 14px;">
              ${data.body}
            </blockquote>
            <p style="margin-top: 25px;"><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://saantechnology.com'}/blog/${post_slug}" style="background-color: #7c3aed; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: bold;">View Post Comments</a></p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Resend notification failed:', emailErr)
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
