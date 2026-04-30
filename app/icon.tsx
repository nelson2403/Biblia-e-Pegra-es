import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: 'linear-gradient(145deg, #1E1B4B 0%, #312E81 100%)',
          borderRadius: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        {/* Book body */}
        <div style={{ display: 'flex', position: 'relative', width: 280, height: 320 }}>
          {/* Left page */}
          <div style={{
            position: 'absolute', left: 0, top: 0,
            width: 132, height: 310,
            background: '#E0E7FF',
            borderRadius: '12px 0 0 12px',
            display: 'flex',
          }} />
          {/* Right page */}
          <div style={{
            position: 'absolute', right: 0, top: 0,
            width: 132, height: 310,
            background: '#fff',
            borderRadius: '0 12px 12px 0',
            display: 'flex',
          }} />
          {/* Spine */}
          <div style={{
            position: 'absolute', left: '50%',
            transform: 'translateX(-50%)',
            top: 0, width: 20, height: 310,
            background: '#4F46E5',
            display: 'flex',
          }} />
          {/* Gold cross on right page */}
          <div style={{
            position: 'absolute', right: 52, top: 90,
            width: 28, height: 90,
            background: '#F59E0B',
            borderRadius: 6,
            display: 'flex',
          }} />
          <div style={{
            position: 'absolute', right: 30, top: 114,
            width: 72, height: 28,
            background: '#F59E0B',
            borderRadius: 6,
            display: 'flex',
          }} />
          {/* Lines on left page */}
          <div style={{ position: 'absolute', left: 16, top: 70, width: 100, height: 10, background: '#6366F1', borderRadius: 5, opacity: 0.7, display: 'flex' }} />
          <div style={{ position: 'absolute', left: 16, top: 92, width: 80, height: 10, background: '#6366F1', borderRadius: 5, opacity: 0.7, display: 'flex' }} />
          <div style={{ position: 'absolute', left: 16, top: 114, width: 100, height: 10, background: '#6366F1', borderRadius: 5, opacity: 0.7, display: 'flex' }} />
          <div style={{ position: 'absolute', left: 16, top: 136, width: 60, height: 10, background: '#6366F1', borderRadius: 5, opacity: 0.7, display: 'flex' }} />
          {/* Bottom gold bar */}
          <div style={{
            position: 'absolute', left: 0, bottom: 0,
            width: 280, height: 12,
            background: '#F59E0B',
            borderRadius: '0 0 12px 12px',
            display: 'flex',
          }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
