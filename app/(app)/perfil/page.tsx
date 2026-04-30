'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Calendar, BookOpen, Shield, HelpCircle, LogOut, Star, Layers, PenLine, Mic } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function PerfilPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ estudos: 0, anotacoes: 0, pregacoes: 0 })

  const userName = user?.user_metadata?.name || 'Servo de Deus'
  const userEmail = user?.email ?? ''
  const initials = userName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : ''

  const fetchStats = useCallback(async () => {
    if (!user) return
    const [e, a, p] = await Promise.all([
      supabase.from('estudos_biblicos').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('anotacoes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('pregacoes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ])
    setStats({ estudos: e.count ?? 0, anotacoes: a.count ?? 0, pregacoes: p.count ?? 0 })
  }, [user])

  useEffect(() => { fetchStats() }, [fetchStats])

  const handleSignOut = async () => {
    if (!confirm('Tem certeza que deseja sair?')) return
    await signOut()
    router.replace('/login')
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="p-6 flex flex-col gap-5 pb-10">
        {/* Profile header */}
        <div className="flex flex-col items-center py-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 text-white text-2xl font-extrabold"
            style={{ backgroundColor: '#3730A3' }}>
            {initials}
          </div>
          <h1 className="text-xl font-extrabold text-gray-800 mb-1">{userName}</h1>
          <p className="text-sm text-gray-500 mb-3">{userEmail}</p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: '#FEF3C7' }}>
            <Star size={13} color="#D97706" />
            <span className="text-xs font-semibold" style={{ color: '#92400E' }}>Membro desde {memberSince}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-sm flex divide-x divide-gray-100">
          {[
            { value: stats.estudos, label: 'Estudos', Icon: Layers, color: '#4F46E5' },
            { value: stats.anotacoes, label: 'Anotações', Icon: PenLine, color: '#D97706' },
            { value: stats.pregacoes, label: 'Pregações', Icon: Mic, color: '#059669' },
          ].map(({ value, label, Icon, color }) => (
            <div key={label} className="flex-1 flex flex-col items-center py-4">
              <span className="text-2xl font-extrabold" style={{ color }}>{value}</span>
              <span className="text-xs text-gray-400 mt-1">{label}</span>
            </div>
          ))}
        </div>

        {/* Account info */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Minha conta</p>
          {[
            { Icon: User, label: 'Nome', value: userName },
            { Icon: Mail, label: 'E-mail', value: userEmail },
            { Icon: Calendar, label: 'Membro desde', value: memberSince },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#EEF2FF' }}>
                <Icon size={19} color="#4F46E5" />
              </div>
              <span className="flex-1 text-sm font-medium text-gray-700">{label}</span>
              <span className="text-sm text-gray-400 max-w-[140px] text-right truncate">{value}</span>
            </div>
          ))}
        </div>

        {/* Info menu */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Informações</p>
          {[
            { Icon: BookOpen, label: 'Sobre o App' },
            { Icon: Shield, label: 'Privacidade' },
            { Icon: HelpCircle, label: 'Suporte' },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#F3F4F6' }}>
                <Icon size={19} color="#6B7280" />
              </div>
              <span className="flex-1 text-sm font-medium text-gray-700">{label}</span>
            </div>
          ))}
        </div>

        {/* Inspirational */}
        <div className="rounded-2xl p-4 flex flex-col items-center gap-2 text-center"
          style={{ backgroundColor: '#FFF7ED', border: '1px solid #FED7AA' }}>
          <p className="text-sm italic" style={{ color: '#92400E' }}>"Posso tudo naquele que me fortalece."</p>
          <p className="text-xs font-bold" style={{ color: '#D97706' }}>Filipenses 4:13</p>
        </div>

        {/* Sign out */}
        <button onClick={handleSignOut}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-red-600 text-sm"
          style={{ backgroundColor: '#FEE2E2' }}>
          <LogOut size={19} />
          Sair da conta
        </button>

        <p className="text-center text-xs text-gray-400">Bíblia &amp; Pregações v1.0.0</p>
      </div>
    </div>
  )
}
