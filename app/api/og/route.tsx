import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get('title') || 'SaaN Digital'
    const subtitle = searchParams.get('subtitle') || 'Enterprise AI & Platform Engineering'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0a0a0f',
            backgroundImage:
              'linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            padding: '80px',
            boxSizing: 'border-box',
          }}
        >
          {/* Top Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#f1f5f9',
            }}
          >
            SaaN Digital<span style={{ color: '#7c3aed', marginLeft: '2px' }}>.</span>
          </div>

          {/* Center Title Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                fontSize: '56px',
                fontWeight: 'extrabold',
                color: '#f1f5f9',
                lineHeight: '1.2',
                maxWidth: '900px',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '22px',
                fontWeight: 'normal',
                color: '#94a3b8',
                maxWidth: '800px',
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Footer Branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '30px',
            }}
          >
            <div style={{ fontSize: '16px', color: '#94a3b8', fontWeight: 'normal' }}>
              Atul Garg &middot; saantechnology.com
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '14px',
                color: '#a78bfa',
                fontWeight: 'bold',
              }}
            >
              Enterprise SRE &amp; AI
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error: any) {
    console.error('Failed to generate OG image:', error)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
