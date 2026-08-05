import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const URL_BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://biblia-pregacoes.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(URL_BASE),
  applicationName: 'Bíblia & Pregações',
  title: {
    default: 'Bíblia & Pregações — Palavra do Dia',
    template: '%s · Bíblia & Pregações',
  },
  description:
    'Leia e ouça a Bíblia, receba o versículo e um estudo novo todos os dias, faça anotações por voz e prepare pregações com ajuda de IA.',
  keywords: [
    'bíblia', 'versículo do dia', 'estudo bíblico', 'pregação', 'devocional',
    'bíblia em áudio', 'palavra de Deus', 'evangélico',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Bíblia',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icons/icon-180.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/icons/icon-192.png',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Bíblia & Pregações',
    title: 'Bíblia & Pregações — Palavra do Dia',
    description:
      'Versículo do dia, estudo novo todos os dias e a Bíblia em áudio. Espalhe a Palavra de Deus.',
    images: [{ url: '/icons/playstore-banner-1024x500.png', width: 1024, height: 500 }],
  },
}

export const viewport: Viewport = {
  themeColor: '#1E1B4B',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  // Sem maximumScale nem userScalable: travar o zoom prejudica quem tem baixa
  // visão e reprova nas auditorias de acessibilidade.
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
