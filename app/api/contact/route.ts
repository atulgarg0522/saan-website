import { NextRequest, NextResponse } from 'next/server'
import { resend } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const { name, email, service, message } = await req.json()

    if (!name || !email || !service || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || 'atul@saantechnology.com'
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@saantechnology.com'

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      reply_to: email,
      subject: `New Contact Request: ${service} from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #0f172a; margin-top: 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">New Inquiry Received</h3>
          <p style="color: #475569; font-size: 14px;"><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
          <p style="color: #475569; font-size: 14px;"><strong>Service Requested:</strong> ${service}</p>
          <p style="color: #475569; font-size: 14px;"><strong>Message:</strong></p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; color: #334155; font-size: 14px; white-space: pre-wrap; line-height: 1.5;">
            ${message}
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending email via Resend:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err: any) {
    console.error('Contact API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
