'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Sidebar, BottomNav } from '@/components/Sidebar'
import { LoadingSpinner } from '@/components/LoadingSpinner'

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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-auto pb-16 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
