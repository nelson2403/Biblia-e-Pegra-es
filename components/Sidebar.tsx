'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BookOpen, Home, Layers, Mic, User, LogOut, BookMarked,
  Heart, Map, Search, BookA, HeartHandshake, Bot, Sparkles,
  Grid2x2, X, Sun,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const NAV = [
  { href: '/dashboard', label: 'Inicio', Icon: Home },
  { href: '/diario', label: 'Palavra do Dia', Icon: Sun },
  { href: '/biblia', label: 'Biblia', Icon: BookOpen },
  { href: '/favoritos', label: 'Favoritos', Icon: Heart },
  { href: '/estudos', label: 'Estudos', Icon: Layers },
  { href: '/anotacoes', label: 'Anotacoes', Icon: BookMarked },
  { href: '/pregacoes', label: 'Pregacoes', Icon: Mic },
  { href: '/plano', label: 'Plano', Icon: Map },
  { href: '/busca', label: 'Busca', Icon: Search },
  { href: '/dicionario', label: 'Dicionario', Icon: BookA },
  { href: '/oracao', label: 'Mural de Oracao', Icon: HeartHandshake },
  { href: '/conselheiro', label: 'Conselheiro IA', Icon: Bot },
  { href: '/pregacoes/ia', label: 'Gerar Pregacao IA', Icon: Sparkles },
  { href: '/perfil', label: 'Perfil', Icon: User },
]

const BOTTOM_NAV = [
  { href: '/dashboard', label: 'Inicio', Icon: Home },
  { href: '/diario', label: 'Hoje', Icon: Sun },
  { href: '/biblia', label: 'Biblia', Icon: BookOpen },
  { href: '/estudos', label: 'Estudos', Icon: Layers },
]

const MAIS_MENU = [
  { href: '/oracao', label: 'Mural de Oracao', Icon: HeartHandshake },
  { href: '/conselheiro', label: 'Conselheiro IA', Icon: Bot },
  { href: '/pregacoes/ia', label: 'Gerar Pregacao IA', Icon: Sparkles },
  { href: '/pregacoes', label: 'Pregacoes', Icon: Mic },
  { href: '/favoritos', label: 'Favoritos', Icon: Heart },
  { href: '/anotacoes', label: 'Anotacoes', Icon: BookMarked },
  { href: '/dicionario', label: 'Dicionario', Icon: BookA },
  { href: '/plano', label: 'Plano', Icon: Map },
  { href: '/busca', label: 'Busca', Icon: Search },
  { href: '/perfil', label: 'Perfil', Icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()

  const userName = (user?.user_metadata?.name || user?.email?.split('@')[0] || 'Servo').split(' ')[0]
  const initials = userName.slice(0, 2).toUpperCase()

  const handleSignOut = async () => {
    await signOut()
    router.replace('/login')
  }

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-surface border-r border-borda shadow-sm">
      <div className="px-5 py-5 border-b border-borda"
        style={{ background: 'linear-gradient(135deg, #1E1B4B, #4F46E5)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <BookOpen size={20} color="#fff" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Biblia & Pregacoes</p>
            <p className="text-white/60 text-xs">Ministerio Digital</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: active ? 'var(--accent-soft)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-muted)',
              }}>
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-borda">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--accent-hover)' }}>
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-conteudo truncate">{userName}</p>
            <p className="text-xs text-conteudo-faint truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-semibold text-perigo hover:bg-perigo-soft transition-colors">
          <LogOut size={17} />
          Sair da conta
        </button>
      </div>
    </aside>
  )
}

export function BottomNav() {
  const pathname = usePathname()
  const [showMais, setShowMais] = useState(false)

  const maisActive = MAIS_MENU.some(item => pathname === item.href || pathname.startsWith(item.href + '/'))

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-borda z-50">
        <div className="flex">
          {BOTTOM_NAV.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link key={href} href={href}
                className="flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors"
                style={{ color: active ? 'var(--accent)' : 'var(--text-faint)' }}>
                <Icon size={21} />
                <span className="text-[10px] font-semibold">{label}</span>
              </Link>
            )
          })}

          {/* Botão Mais */}
          <button
            onClick={() => setShowMais(v => !v)}
            className="flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors"
            style={{ color: showMais || maisActive ? 'var(--accent)' : 'var(--text-faint)' }}>
            <Grid2x2 size={21} />
            <span className="text-[10px] font-semibold">Mais</span>
          </button>
        </div>
      </nav>

      {/* Menu Mais */}
      {showMais && (
        <div
          className="md:hidden fixed inset-0 z-40 flex items-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowMais(false)}
        >
          <div
            className="w-full bg-surface rounded-t-3xl px-5 pt-4 pb-24"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-conteudo text-base">Todas as seções</h3>
              <button onClick={() => setShowMais(false)} className="p-1 text-conteudo-faint">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {MAIS_MENU.map(({ href, label, Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setShowMais(false)}
                    className="flex flex-col items-center gap-2 py-4 rounded-2xl transition-all"
                    style={{
                      backgroundColor: active ? 'var(--accent-soft)' : 'var(--surface-2)',
                      color: active ? 'var(--accent)' : 'var(--text-muted)',
                    }}
                  >
                    <Icon size={24} />
                    <span className="text-[11px] font-bold text-center leading-tight">{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
