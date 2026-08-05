import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: 'linear-gradient(145deg, #1E1B4B 0%, #312E81 100%)',
          borderRadius: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Book */}
        <div style={{ display: 'flex', position: 'relative', width: 100, height: 112 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 47, height: 108, background: '#E0E7FF', borderRadius: '6px 0 0 6px', display: 'flex' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, width: 47, height: 108, background: '#fff', borderRadius: '0 6px 6px 0', display: 'flex' }} />
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, width: 8, height: 108, background: 'var(--accent)', display: 'flex' }} />
          {/* Cross */}
          <div style={{ position: 'absolute', right: 19, top: 24, width: 10, height: 36, background: 'var(--gold)', borderRadius: 3, display: 'flex' }} />
          <div style={{ position: 'absolute', right: 10, top: 34, width: 28, height: 10, background: 'var(--gold)', borderRadius: 3, display: 'flex' }} />
          {/* Bottom gold bar */}
          <div style={{ position: 'absolute', left: 0, bottom: 0, width: 100, height: 5, background: 'var(--gold)', borderRadius: '0 0 6px 6px', display: 'flex' }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
