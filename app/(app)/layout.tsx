'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Sidebar, BottomNav } from '@/components/Sidebar'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { AcessibilidadeGlobal } from '@/components/AcessibilidadeGlobal'
import { ConviteInstalar } from '@/components/ConviteInstalar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  if (loading) return <LoadingSpinner />
  if (!user) return null

  return (
    <div className="flex min-h-screen bg-bg">
      <AcessibilidadeGlobal />
      <Sidebar />
      {/* A barra inferior flutua sobre o conteúdo, então o espaço reservado
          precisa cobrir a altura dela mais a área segura do aparelho. */}
      <main className="flex-1 flex flex-col overflow-auto area-conteudo">
        {children}
      </main>
      <BottomNav />
      <ConviteInstalar />
    </div>
  )
}
